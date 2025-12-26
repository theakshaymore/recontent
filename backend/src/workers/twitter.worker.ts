import { twitterQueue } from '../services/queue.service';
import { generateTwitterThread } from '../services/contentGenerator.service';
import { upsertContent, deductCredit } from '../services/supabase.service';
import { logger } from '../utils/logger';
import type { ContentJobData } from '../types/queue.types';

export function setupTwitterWorker(): void {
  twitterQueue.process(2, async (job) => {
    const { videoId, userId, transcript, videoTitle } = job.data as ContentJobData;

    try {
      logger.info(`Starting Twitter thread generation for video: ${videoId}`);

      await upsertContent(videoId, 'twitter', {}, 'processing');

      const twitterData = await generateTwitterThread(transcript, videoTitle);

      await upsertContent(videoId, 'twitter', twitterData, 'completed');

      await deductCredit(userId);

      logger.info(`Twitter thread generation completed for video: ${videoId}`);

      return { success: true, videoId };
    } catch (error: any) {
      logger.error(`Twitter generation failed for video ${videoId}: ${error.message}`);

      await upsertContent(videoId, 'twitter', {}, 'failed', error.message);

      throw error;
    }
  });

  logger.info('Twitter worker started');
}
