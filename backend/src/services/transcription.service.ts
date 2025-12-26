import { createReadStream } from 'fs';
import { stat } from 'fs/promises';
import { openai } from '../config/openai.config';
import { logger } from '../utils/logger';
import { TranscriptionError } from '../utils/errors';

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB - Whisper limit

export async function transcribeAudio(audioPath: string): Promise<string> {
  try {
    // Check file size
    const stats = await stat(audioPath);
    if (stats.size > MAX_FILE_SIZE) {
      throw new TranscriptionError('Audio file too large (max 25MB). Video may be too long.');
    }

    logger.info(`Transcribing audio file: ${audioPath} (${(stats.size / 1024 / 1024).toFixed(2)}MB)`);

    const transcription = await openai.audio.transcriptions.create({
      file: createReadStream(audioPath) as any,
      model: 'whisper-1',
      response_format: 'text',
      language: 'en', // Can be made configurable
    });

    logger.info(`Transcription completed. Length: ${transcription.length} characters`);

    return transcription;
  } catch (error: any) {
    logger.error(`Transcription failed: ${error.message}`);

    if (error.message?.includes('Invalid file format')) {
      throw new TranscriptionError('Invalid audio format');
    }
    if (error.message?.includes('rate limit')) {
      throw new TranscriptionError('Rate limit exceeded. Please try again later.');
    }

    throw new TranscriptionError(error.message || 'Failed to transcribe audio');
  }
}
