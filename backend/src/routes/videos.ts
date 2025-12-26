import { Router } from 'express';
import { authenticateUser, AuthenticatedRequest } from '../middleware/auth.middleware';
import { validate, schemas } from '../middleware/validation.middleware';
import { videoCreationLimiter } from '../middleware/rateLimiter.middleware';
import { transcriptionQueue } from '../services/queue.service';
import { extractVideoId, getVideoInfo } from '../services/youtube.service';
import * as db from '../services/supabase.service';
import { ValidationError } from '../utils/errors';
import { logger } from '../utils/logger';

const router = Router();

// Create video
router.post('/', authenticateUser, videoCreationLimiter, validate(schemas.createVideo), async (req, res, next) => {
  try {
    const { user } = req as AuthenticatedRequest;
    const { youtube_url } = req.body;

    // Check credits
    const credits = await db.checkUserCredits(user.id);
    if (credits < 1) {
      return res.status(402).json({ success: false, error: 'Insufficient credits' });
    }

    // Extract and validate YouTube video
    const ytVideoId = extractVideoId(youtube_url);
    if (!ytVideoId) {
      throw new ValidationError('Invalid YouTube URL');
    }

    // Get video info
    const videoInfo = await getVideoInfo(youtube_url);

    // Create video record
    const video = await db.createVideo(user.id, youtube_url, ytVideoId, videoInfo.title, videoInfo.duration);

    // Queue transcription
    await transcriptionQueue.add({ videoId: video.id, youtubeUrl: youtube_url, userId: user.id });

    logger.info(`Video created: ${video.id} for user ${user.id}`);

    res.status(201).json({ success: true, video_id: video.id, status: 'pending', message: 'Video queued for processing' });
  } catch (error) {
    next(error);
  }
});

// Get user's videos
router.get('/', authenticateUser, async (req, res, next) => {
  try {
    const { user } = req as AuthenticatedRequest;
    const videos = await db.getUserVideos(user.id);
    res.json({ success: true, videos });
  } catch (error) {
    next(error);
  }
});

// Get single video
router.get('/:id', authenticateUser, async (req, res, next) => {
  try {
    const { user } = req as AuthenticatedRequest;
    const video = await db.getVideoById(req.params.id, user.id);
    res.json({ success: true, video });
  } catch (error) {
    next(error);
  }
});

// Delete video
router.delete('/:id', authenticateUser, async (req, res, next) => {
  try {
    const { user } = req as AuthenticatedRequest;
    await db.deleteVideo(req.params.id, user.id);
    res.json({ success: true, message: 'Video deleted' });
  } catch (error) {
    next(error);
  }
});

export default router;
