import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ValidationError } from '../utils/errors';

export function validate(schema: Joi.ObjectSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const messages = error.details.map((d) => d.message).join(', ');
      throw new ValidationError(messages);
    }
    
    next();
  };
}

// Validation schemas
export const schemas = {
  createVideo: Joi.object({
    youtube_url: Joi.string()
      .uri()
      .pattern(/^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/)|youtu\.be\/)[\w-]{11}/)
      .required()
      .messages({
        'string.pattern.base': 'Invalid YouTube URL format',
        'any.required': 'YouTube URL is required',
      }),
  }),

  generateContent: Joi.object({
    regenerate: Joi.boolean().default(false),
  }),
};
