import { shortsQueue } from '../services/queue.service';
import { generateShorts } from '../services/contentGenerator.service';
import { upsertContent, deductCredit } from '../services/supabase.service';
import { logger } from '../utils/logger';
import type { ContentJobData } from '../types/queue.types';

export function setupShortsWorker(): void {
  shortsQueue.process(2, async (job) => {
    const { videoId, userId, transcript, videoTitle } = job.data as ContentJobData;

    try {
      logger.info(`Starting shorts generation for video: ${videoId}`);

      // Update status to processing
      await upsertContent(videoId, 'shorts', {}, 'processing');

      // Generate shorts
      const shortsData = await generateShorts(transcript, videoTitle);

      // Save content
      await upsertContent(videoId, 'shorts', shortsData, 'completed');

      // Deduct credit
      await deductCredit(userId);

      logger.info(`Shorts generation completed for video: ${videoId}`);

      return { success: true, videoId };
    } catch (error: any) {
      logger.error(`Shorts generation failed for video ${videoId}: ${error.message}`);

      await upsertContent(videoId, 'shorts', {}, 'failed', error.message);

      throw error;
    }
  });

  logger.info('Shorts worker started');
}
