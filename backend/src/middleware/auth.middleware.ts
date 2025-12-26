import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import { config } from '../config/env.config';
import { UnauthorizedError } from '../utils/errors';
import { logger } from '../utils/logger';

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
  };
  accessToken: string;
}

export async function authenticateUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided');
    }

    const token = authHeader.replace('Bearer ', '');

    // Verify token with Supabase
    const supabase = createClient(config.supabase.url, config.supabase.anonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      logger.warn(`Invalid token attempt: ${error?.message || 'No user found'}`);
      throw new UnauthorizedError('Invalid token');
    }

    // Attach user info to request
    (req as AuthenticatedRequest).user = {
      id: user.id,
      email: user.email || '',
    };
    (req as AuthenticatedRequest).accessToken = token;

    next();
  } catch (error) {
    next(error);
  }
}
