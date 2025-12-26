import { setupTranscriptionWorker } from './transcription.worker';
import { setupShortsWorker } from './shorts.worker';
import { setupBlogWorker } from './blog.worker';
import { setupTwitterWorker } from './twitter.worker';
import { setupLinkedInWorker } from './linkedin.worker';
import { setupInstagramWorker } from './instagram.worker';
import { setupThumbnailWorker } from './thumbnail.worker';
import { closeQueues } from '../services/queue.service';
import { logger } from '../utils/logger';

// Initialize all workers
export function startAllWorkers(): void {
  logger.info('Starting all workers...');

  setupTranscriptionWorker();
  setupShortsWorker();
  setupBlogWorker();
  setupTwitterWorker();
  setupLinkedInWorker();
  setupInstagramWorker();
  setupThumbnailWorker();

  logger.info('All workers started successfully');
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down workers...');
  await closeQueues();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down workers...');
  await closeQueues();
  process.exit(0);
});

// Start workers if this file is run directly
if (require.main === module) {
  startAllWorkers();
}
