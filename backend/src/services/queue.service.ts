import Bull from 'bull';
import { config } from '../config/env.config';
import { logger } from '../utils/logger';
import type { TranscriptionJobData, ContentJobData, ThumbnailJobData } from '../types/queue.types';

const redisConfig = {
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
};

const defaultJobOptions: Bull.JobOptions = {
  attempts: 2,
  backoff: {
    type: 'exponential',
    delay: 5000,
  },
  removeOnComplete: 100,
  removeOnFail: 50,
  timeout: 5 * 60 * 1000, // 5 minutes
};

// Create queues
export const transcriptionQueue = new Bull<TranscriptionJobData>('transcription', {
  redis: redisConfig,
  defaultJobOptions,
});

export const shortsQueue = new Bull<ContentJobData>('shorts', {
  redis: redisConfig,
  defaultJobOptions,
});

export const blogQueue = new Bull<ContentJobData>('blog', {
  redis: redisConfig,
  defaultJobOptions,
});

export const twitterQueue = new Bull<ContentJobData>('twitter', {
  redis: redisConfig,
  defaultJobOptions,
});

export const linkedinQueue = new Bull<ContentJobData>('linkedin', {
  redis: redisConfig,
  defaultJobOptions,
});

export const instagramQueue = new Bull<ContentJobData>('instagram', {
  redis: redisConfig,
  defaultJobOptions,
});

export const thumbnailQueue = new Bull<ThumbnailJobData>('thumbnail', {
  redis: redisConfig,
  defaultJobOptions: {
    ...defaultJobOptions,
    timeout: 10 * 60 * 1000, // 10 minutes for image generation
  },
});

// Queue event handlers
const queues = [
  transcriptionQueue,
  shortsQueue,
  blogQueue,
  twitterQueue,
  linkedinQueue,
  instagramQueue,
  thumbnailQueue,
];

queues.forEach((queue) => {
  queue.on('completed', (job) => {
    logger.info(`Job ${job.id} in queue ${queue.name} completed`);
  });

  queue.on('failed', (job, err) => {
    logger.error(`Job ${job?.id} in queue ${queue.name} failed: ${err.message}`);
  });

  queue.on('stalled', (job) => {
    logger.warn(`Job ${job.id} in queue ${queue.name} stalled`);
  });
});

export async function closeQueues(): Promise<void> {
  await Promise.all(queues.map((q) => q.close()));
  logger.info('All queues closed');
}
