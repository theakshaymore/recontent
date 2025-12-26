import { blogQueue } from '../services/queue.service';
import { generateBlogPost } from '../services/contentGenerator.service';
import { upsertContent, deductCredit } from '../services/supabase.service';
import { logger } from '../utils/logger';
import type { ContentJobData } from '../types/queue.types';

export function setupBlogWorker(): void {
  blogQueue.process(2, async (job) => {
    const { videoId, userId, transcript, videoTitle } = job.data as ContentJobData;

    try {
      logger.info(`Starting blog generation for video: ${videoId}`);

      await upsertContent(videoId, 'blog', {}, 'processing');

      const blogData = await generateBlogPost(transcript, videoTitle);

      await upsertContent(videoId, 'blog', blogData, 'completed');

      await deductCredit(userId);

      logger.info(`Blog generation completed for video: ${videoId}`);

      return { success: true, videoId };
    } catch (error: any) {
      logger.error(`Blog generation failed for video ${videoId}: ${error.message}`);

      await upsertContent(videoId, 'blog', {}, 'failed', error.message);

      throw error;
    }
  });

  logger.info('Blog worker started');
}
