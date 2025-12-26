import { linkedinQueue } from '../services/queue.service';
import { generateLinkedInCarousel } from '../services/contentGenerator.service';
import { upsertContent, deductCredit } from '../services/supabase.service';
import { logger } from '../utils/logger';
import type { ContentJobData } from '../types/queue.types';

export function setupLinkedInWorker(): void {
  linkedinQueue.process(2, async (job) => {
    const { videoId, userId, transcript, videoTitle } = job.data as ContentJobData;

    try {
      logger.info(`Starting LinkedIn carousel generation for video: ${videoId}`);

      await upsertContent(videoId, 'linkedin', {}, 'processing');

      const linkedinData = await generateLinkedInCarousel(transcript, videoTitle);

      await upsertContent(videoId, 'linkedin', linkedinData, 'completed');

      await deductCredit(userId);

      logger.info(`LinkedIn carousel generation completed for video: ${videoId}`);

      return { success: true, videoId };
    } catch (error: any) {
      logger.error(`LinkedIn generation failed for video ${videoId}: ${error.message}`);

      await upsertContent(videoId, 'linkedin', {}, 'failed', error.message);

      throw error;
    }
  });

  logger.info('LinkedIn worker started');
}
