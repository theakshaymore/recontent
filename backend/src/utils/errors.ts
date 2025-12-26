export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404);
  }
}

export class InsufficientCreditsError extends AppError {
  constructor() {
    super('Insufficient credits. Please upgrade your plan.', 402);
  }
}

export class YouTubeError extends AppError {
  constructor(message: string) {
    super(`YouTube Error: ${message}`, 400);
  }
}

export class TranscriptionError extends AppError {
  constructor(message: string) {
    super(`Transcription Error: ${message}`, 500);
  }
}

export class ContentGenerationError extends AppError {
  constructor(message: string) {
    super(`Content Generation Error: ${message}`, 500);
  }
}
