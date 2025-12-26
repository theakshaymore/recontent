import { instagramQueue } from '../services/queue.service';
import { generateInstagramCaptions } from '../services/contentGenerator.service';
import { upsertContent, deductCredit } from '../services/supabase.service';
import { logger } from '../utils/logger';
import type { ContentJobData } from '../types/queue.types';

export function setupInstagramWorker(): void {
  instagramQueue.process(2, async (job) => {
    const { videoId, userId, transcript, videoTitle } = job.data as ContentJobData;

    try {
      logger.info(`Starting Instagram captions generation for video: ${videoId}`);

      await upsertContent(videoId, 'instagram', {}, 'processing');

      const instagramData = await generateInstagramCaptions(transcript, videoTitle);

      await upsertContent(videoId, 'instagram', instagramData, 'completed');

      await deductCredit(userId);

      logger.info(`Instagram captions generation completed for video: ${videoId}`);

      return { success: true, videoId };
    } catch (error: any) {
      logger.error(`Instagram generation failed for video ${videoId}: ${error.message}`);

      await upsertContent(videoId, 'instagram', {}, 'failed', error.message);

      throw error;
    }
  });

  logger.info('Instagram worker started');
}
