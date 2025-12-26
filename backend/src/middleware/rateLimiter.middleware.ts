import rateLimit from 'express-rate-limit';
import { logger } from '../utils/logger';

// Video creation: 10 per hour per user
export const videoCreationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: {
    success: false,
    error: 'Too many video requests. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => (req as any).user?.id || req.ip,
  handler: (req, res, _next, options) => {
    logger.warn(`Rate limit exceeded for user ${(req as any).user?.id || req.ip}`);
    res.status(options.statusCode).json(options.message);
  },
});

// Content generation: 20 per hour per user
export const contentGenerationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  message: {
    success: false,
    error: 'Too many content generation requests. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => (req as any).user?.id || req.ip,
});

// General API: 100 per 15 minutes per IP
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    success: false,
    error: 'Too many requests. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
