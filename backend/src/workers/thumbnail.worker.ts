import { thumbnailQueue } from '../services/queue.service';
import { generateThumbnails } from '../services/thumbnailGenerator.service';
import { upsertContent, deductCredit } from '../services/supabase.service';
import { logger } from '../utils/logger';
import type { ThumbnailJobData } from '../types/queue.types';

export function setupThumbnailWorker(): void {
  thumbnailQueue.process(1, async (job) => {
    const { videoId, userId, transcript, videoTitle } = job.data as ThumbnailJobData;

    try {
      logger.info(`Starting thumbnail generation for video: ${videoId}`);

      await upsertContent(videoId, 'thumbnail', {}, 'processing');

      const thumbnailData = await generateThumbnails(transcript, videoTitle, videoId);

      await upsertContent(videoId, 'thumbnail', thumbnailData, 'completed');

      await deductCredit(userId);

      logger.info(`Thumbnail generation completed for video: ${videoId}`);

      return { success: true, videoId };
    } catch (error: any) {
      logger.error(`Thumbnail generation failed for video ${videoId}: ${error.message}`);

      await upsertContent(videoId, 'thumbnail', {}, 'failed', error.message);

      throw error;
    }
  });

  logger.info('Thumbnail worker started');
}
