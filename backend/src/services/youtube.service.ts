import { exec } from 'child_process';
import { promisify } from 'util';
import { unlink } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { logger } from '../utils/logger';
import { YouTubeError } from '../utils/errors';

const execAsync = promisify(exec);

const TEMP_DIR = '/tmp';

export function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export async function getVideoInfo(youtubeUrl: string): Promise<{
  title: string;
  duration: number;
  videoId: string;
}> {
  try {
    const { stdout } = await execAsync(
      `yt-dlp --print "%(title)s|||%(duration)s|||%(id)s" --no-download "${youtubeUrl}"`,
      { timeout: 30000 }
    );

    const [title, durationStr, videoId] = stdout.trim().split('|||');
    const duration = parseInt(durationStr, 10) || 0;

    return { title, duration, videoId };
  } catch (error: any) {
    logger.error(`Failed to get video info: ${error.message}`);
    
    if (error.message.includes('Video unavailable')) {
      throw new YouTubeError('Video is unavailable or private');
    }
    if (error.message.includes('age-restricted')) {
      throw new YouTubeError('Video is age-restricted');
    }
    if (error.message.includes('copyright')) {
      throw new YouTubeError('Video has copyright restrictions');
    }
    
    throw new YouTubeError('Failed to fetch video information');
  }
}

export async function downloadAudio(youtubeUrl: string, videoId: string): Promise<string> {
  const outputPath = path.join(TEMP_DIR, `${videoId}.mp3`);

  try {
    logger.info(`Downloading audio for video: ${videoId}`);

    // Download and convert to mp3
    await execAsync(
      `yt-dlp -x --audio-format mp3 --audio-quality 0 -o "${outputPath}" "${youtubeUrl}"`,
      { timeout: 5 * 60 * 1000 } // 5 minutes timeout
    );

    if (!existsSync(outputPath)) {
      throw new Error('Audio file was not created');
    }

    logger.info(`Audio downloaded successfully: ${outputPath}`);
    return outputPath;
  } catch (error: any) {
    logger.error(`Failed to download audio: ${error.message}`);
    
    // Clean up if file exists
    await cleanupFile(outputPath);
    
    if (error.message.includes('Video unavailable')) {
      throw new YouTubeError('Video is unavailable or private');
    }
    
    throw new YouTubeError('Failed to download audio from YouTube');
  }
}

export async function cleanupFile(filePath: string): Promise<void> {
  try {
    if (existsSync(filePath)) {
      await unlink(filePath);
      logger.debug(`Cleaned up file: ${filePath}`);
    }
  } catch (error: any) {
    logger.warn(`Failed to cleanup file ${filePath}: ${error.message}`);
  }
}
