import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/env.config';
import { errorHandler } from './middleware/error.middleware';
import { generalLimiter } from './middleware/rateLimiter.middleware';
import { logger } from './utils/logger';
import { startAllWorkers } from './workers';
import videosRouter from './routes/videos';
import contentRouter from './routes/content';
import healthRouter from './routes/health';

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: config.frontendUrl, credentials: true }));
app.use(express.json());
app.use(generalLimiter);

// Routes
app.use('/api/health', healthRouter);
app.use('/api/videos', videosRouter);
app.use('/api/content', contentRouter);

// Error handler
app.use(errorHandler);

// Start server
app.listen(config.port, () => {
  logger.info(`Server running on port ${config.port}`);
  startAllWorkers();
});
