import { supabaseAdmin } from '../config/supabase.config';
import { logger } from '../utils/logger';
import { NotFoundError, InsufficientCreditsError } from '../utils/errors';
import type { Video } from '../types/video.types';
import type { Content, ContentType } from '../types/content.types';

export async function createVideo(
  userId: string,
  youtubeUrl: string,
  videoId: string,
  title: string,
  duration: number
): Promise<Video> {
  const { data, error } = await supabaseAdmin
    .from('videos')
    .insert({
      user_id: userId,
      youtube_url: youtubeUrl,
      video_id: videoId,
      title,
      duration,
      transcript_status: 'pending',
    })
    .select()
    .single();

  if (error) {
    logger.error(`Failed to create video: ${error.message}`);
    throw error;
  }

  return data;
}

export async function getVideoById(videoId: string, userId: string): Promise<Video> {
  const { data, error } = await supabaseAdmin
    .from('videos')
    .select('*')
    .eq('id', videoId)
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    throw new NotFoundError('Video not found');
  }

  return data;
}

export async function getUserVideos(userId: string): Promise<Video[]> {
  const { data, error } = await supabaseAdmin
    .from('videos')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    logger.error(`Failed to fetch videos: ${error.message}`);
    throw error;
  }

  return data || [];
}

export async function updateVideoTranscript(
  videoId: string,
  transcript: string,
  status: 'completed' | 'failed',
  errorMessage?: string
): Promise<void> {
  const { error } = await supabaseAdmin
    .from('videos')
    .update({
      transcript,
      transcript_status: status,
      error_message: errorMessage,
      updated_at: new Date().toISOString(),
    })
    .eq('id', videoId);

  if (error) {
    logger.error(`Failed to update video transcript: ${error.message}`);
    throw error;
  }
}

export async function updateVideoStatus(
  videoId: string,
  status: string,
  errorMessage?: string
): Promise<void> {
  const { error } = await supabaseAdmin
    .from('videos')
    .update({
      transcript_status: status,
      error_message: errorMessage,
      updated_at: new Date().toISOString(),
    })
    .eq('id', videoId);

  if (error) {
    logger.error(`Failed to update video status: ${error.message}`);
    throw error;
  }
}

export async function deleteVideo(videoId: string, userId: string): Promise<void> {
  // Delete associated content first
  await supabaseAdmin.from('content').delete().eq('video_id', videoId);

  // Delete video
  const { error } = await supabaseAdmin
    .from('videos')
    .delete()
    .eq('id', videoId)
    .eq('user_id', userId);

  if (error) {
    logger.error(`Failed to delete video: ${error.message}`);
    throw error;
  }
}

// Content operations
export async function getContent(
  videoId: string,
  contentType: ContentType
): Promise<Content | null> {
  const { data, error } = await supabaseAdmin
    .from('content')
    .select('*')
    .eq('video_id', videoId)
    .eq('content_type', contentType)
    .maybeSingle();

  if (error) {
    logger.error(`Failed to fetch content: ${error.message}`);
    throw error;
  }

  return data;
}

export async function upsertContent(
  videoId: string,
  contentType: ContentType,
  contentData: any,
  status: 'pending' | 'processing' | 'completed' | 'failed',
  errorMessage?: string
): Promise<Content> {
  const { data, error } = await supabaseAdmin
    .from('content')
    .upsert(
      {
        video_id: videoId,
        content_type: contentType,
        content_data: contentData,
        status,
        error_message: errorMessage,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'video_id,content_type' }
    )
    .select()
    .single();

  if (error) {
    logger.error(`Failed to upsert content: ${error.message}`);
    throw error;
  }

  return data;
}

export async function deleteContent(
  videoId: string,
  contentType: ContentType
): Promise<void> {
  const { error } = await supabaseAdmin
    .from('content')
    .delete()
    .eq('video_id', videoId)
    .eq('content_type', contentType);

  if (error) {
    logger.error(`Failed to delete content: ${error.message}`);
    throw error;
  }
}

// Credit operations
export async function checkUserCredits(userId: string): Promise<number> {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('credits_remaining')
    .eq('id', userId)
    .single();

  if (error) {
    logger.error(`Failed to check credits: ${error.message}`);
    throw error;
  }

  return data?.credits_remaining || 0;
}

export async function deductCredit(userId: string): Promise<void> {
  const credits = await checkUserCredits(userId);
  
  if (credits < 1) {
    throw new InsufficientCreditsError();
  }

  const { error } = await supabaseAdmin
    .from('profiles')
    .update({
      credits_remaining: credits - 1,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (error) {
    logger.error(`Failed to deduct credit: ${error.message}`);
    throw error;
  }

  logger.info(`Deducted 1 credit from user ${userId}. Remaining: ${credits - 1}`);
}
