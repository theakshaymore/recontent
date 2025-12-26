import { transcriptionQueue } from '../services/queue.service';
import { downloadAudio, cleanupFile } from '../services/youtube.service';
import { transcribeAudio } from '../services/transcription.service';
import { updateVideoTranscript, updateVideoStatus } from '../services/supabase.service';
import { logger } from '../utils/logger';
import type { TranscriptionJobData } from '../types/queue.types';

export function setupTranscriptionWorker(): void {
  transcriptionQueue.process(2, async (job) => {
    const { videoId, youtubeUrl } = job.data as TranscriptionJobData;
    let audioPath: string | null = null;

    try {
      logger.info(`Starting transcription job for video: ${videoId}`);
      
      // Update status to processing
      await updateVideoStatus(videoId, 'processing');

      // Extract video ID from URL for file naming
      const ytVideoId = youtubeUrl.match(/(?:v=|youtu\.be\/)([^&\n?#]+)/)?.[1] || videoId;

      // Download audio
      audioPath = await downloadAudio(youtubeUrl, ytVideoId);

      // Transcribe
      const transcript = await transcribeAudio(audioPath);

      // Save transcript
      await updateVideoTranscript(videoId, transcript, 'completed');

      logger.info(`Transcription completed for video: ${videoId}`);

      return { success: true, videoId };
    } catch (error: any) {
      logger.error(`Transcription job failed for video ${videoId}: ${error.message}`);

      await updateVideoTranscript(videoId, '', 'failed', error.message);

      throw error;
    } finally {
      // Cleanup audio file
      if (audioPath) {
        await cleanupFile(audioPath);
      }
    }
  });

  logger.info('Transcription worker started');
}
