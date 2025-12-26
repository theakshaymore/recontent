import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Video, VideoWithContent, Content } from '@/types';
import { useAuthQuery } from './useAuthQuery';

// Query keys
export const videoKeys = {
  all: ['videos'] as const,
  list: (userId: string) => ['videos', 'list', userId] as const,
  detail: (videoId: string) => ['videos', 'detail', videoId] as const,
  content: (videoId: string) => ['videos', 'content', videoId] as const,
};

/**
 * Hook to fetch user's videos
 */
export function useVideos() {
  const { user } = useAuthQuery();

  const query = useQuery({
    queryKey: videoKeys.list(user?.id ?? ''),
    queryFn: async (): Promise<Video[]> => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data as Video[]) ?? [];
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 2, // 2 minutes
    // Auto-refresh if any video is processing
    refetchInterval: (query) => {
      const videos = query.state.data;
      const hasProcessing = videos?.some(v => v.status === 'queued' || v.status === 'processing');
      return hasProcessing ? 5000 : false; // Poll every 5 seconds if processing
    },
  });

  return query;
}

/**
 * Hook to fetch a single video with its content
 */
export function useVideoWithContent(videoId: string) {
  const { user } = useAuthQuery();

  return useQuery({
    queryKey: videoKeys.detail(videoId),
    queryFn: async (): Promise<VideoWithContent | null> => {
      if (!user?.id || !videoId) return null;

      // Fetch video
      const { data: video, error: videoError } = await supabase
        .from('videos')
        .select('*')
        .eq('id', videoId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (videoError) throw videoError;
      if (!video) return null;

      // Fetch content
      const { data: content, error: contentError } = await supabase
        .from('content')
        .select('*')
        .eq('video_id', videoId)
        .maybeSingle();

      if (contentError) throw contentError;

      // Type cast the JSONB fields properly
      const typedContent = content ? {
        id: content.id,
        video_id: content.video_id,
        content_type: content.content_type as Content['content_type'],
        content_data: content.content_data as Content['content_data'],
        status: content.status as Content['status'],
        blog_post: content.blog_post,
        tweets: content.tweets as unknown as Content['tweets'],
        carousel: content.carousel as unknown as Content['carousel'],
        instagram_captions: content.instagram_captions as unknown as Content['instagram_captions'],
        thumbnail_urls: content.thumbnail_urls as unknown as Content['thumbnail_urls'],
        created_at: content.created_at,
      } : undefined;

      return {
        ...(video as Video),
        content: typedContent,
      };
    },
    enabled: !!user?.id && !!videoId,
    staleTime: 1000 * 60 * 1, // 1 minute
  });
}

/**
 * Hook to create a new video entry and trigger processing
 */
export function useCreateVideo() {
  const queryClient = useQueryClient();
  const { user } = useAuthQuery();

  return useMutation({
    mutationFn: async (youtubeUrl: string): Promise<Video> => {
      if (!user?.id) throw new Error('User not authenticated');

      // Create video entry
      const { data, error } = await supabase
        .from('videos')
        .insert({
          user_id: user.id,
          youtube_url: youtubeUrl,
          status: 'queued',
        })
        .select()
        .single();

      if (error) throw error;

      // Trigger processing in background (don't await)
      supabase.functions.invoke('process-video', {
        body: { videoId: data.id }
      }).catch(err => {
        console.error('Failed to trigger video processing:', err);
      });

      return data as Video;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: videoKeys.list(user?.id ?? '') });
    },
  });
}

/**
 * Hook to delete a video
 */
export function useDeleteVideo() {
  const queryClient = useQueryClient();
  const { user } = useAuthQuery();

  return useMutation({
    mutationFn: async (videoId: string): Promise<void> => {
      if (!user?.id) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', videoId)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: videoKeys.list(user?.id ?? '') });
    },
  });
}
