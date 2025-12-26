import { Router } from 'express';
import { authenticateUser, AuthenticatedRequest } from '../middleware/auth.middleware';
import { contentGenerationLimiter } from '../middleware/rateLimiter.middleware';
import { shortsQueue, blogQueue, twitterQueue, linkedinQueue, instagramQueue, thumbnailQueue } from '../services/queue.service';
import * as db from '../services/supabase.service';
import { NotFoundError, ValidationError } from '../utils/errors';
import type { ContentType } from '../types/content.types';

const router = Router();

async function generateContent(req: any, res: any, next: any, contentType: ContentType, queue: any) {
  try {
    const { user } = req as AuthenticatedRequest;
    const { videoId } = req.params;
    const { regenerate } = req.body || {};

    // Get video with transcript
    const video = await db.getVideoById(videoId, user.id);
    if (video.transcript_status !== 'completed' || !video.transcript) {
      throw new ValidationError('Video transcript not ready');
    }

    // Check if content exists (return cached unless regenerate)
    const existing = await db.getContent(videoId, contentType);
    if (existing?.status === 'completed' && !regenerate) {
      return res.json({ success: true, content: existing, cached: true });
    }

    // Check credits
    const credits = await db.checkUserCredits(user.id);
    if (credits < 1) {
      return res.status(402).json({ success: false, error: 'Insufficient credits' });
    }

    // Queue job
    await queue.add({ videoId, userId: user.id, transcript: video.transcript, videoTitle: video.title || 'Video' });

    res.json({ success: true, status: 'processing', message: `${contentType} generation started` });
  } catch (error) {
    next(error);
  }
}

router.post('/shorts/:videoId', authenticateUser, contentGenerationLimiter, (req, res, next) => generateContent(req, res, next, 'shorts', shortsQueue));
router.post('/blog/:videoId', authenticateUser, contentGenerationLimiter, (req, res, next) => generateContent(req, res, next, 'blog', blogQueue));
router.post('/twitter/:videoId', authenticateUser, contentGenerationLimiter, (req, res, next) => generateContent(req, res, next, 'twitter', twitterQueue));
router.post('/linkedin/:videoId', authenticateUser, contentGenerationLimiter, (req, res, next) => generateContent(req, res, next, 'linkedin', linkedinQueue));
router.post('/instagram/:videoId', authenticateUser, contentGenerationLimiter, (req, res, next) => generateContent(req, res, next, 'instagram', instagramQueue));
router.post('/thumbnail/:videoId', authenticateUser, contentGenerationLimiter, (req, res, next) => generateContent(req, res, next, 'thumbnail', thumbnailQueue));

// Get content
router.get('/:videoId/:contentType', authenticateUser, async (req, res, next) => {
  try {
    const { user } = req as AuthenticatedRequest;
    const { videoId, contentType } = req.params;

    await db.getVideoById(videoId, user.id); // Verify ownership
    const content = await db.getContent(videoId, contentType as ContentType);
    if (!content) throw new NotFoundError('Content not found');

    res.json({ success: true, content });
  } catch (error) {
    next(error);
  }
});

export default router;
