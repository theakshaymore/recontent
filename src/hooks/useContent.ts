import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuthQuery } from './useAuthQuery';
import type { ContentType, GeneratedContent, ShortsContent, InstagramContent, TwitterContent, LinkedInContent } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Query keys
export const contentKeys = {
  all: ['content'] as const,
  byVideo: (videoId: string) => ['content', videoId] as const,
  byType: (videoId: string, contentType: ContentType) => ['content', videoId, contentType] as const,
};

/**
 * Get auth token for API calls
 */
async function getAuthToken(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token ?? null;
}

/**
 * Hook to fetch content for a specific video and content type
 */
export function useContent<T extends ContentType>(videoId: string, contentType: T) {
  const { user } = useAuthQuery();

  return useQuery({
    queryKey: contentKeys.byType(videoId, contentType),
    queryFn: async (): Promise<GeneratedContent<T> | null> => {
      if (!user?.id || !videoId) return null;

      const token = await getAuthToken();
      if (!token) throw new Error('Not authenticated');

      const response = await fetch(
        `${API_BASE_URL}/api/content/${videoId}/${contentType}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 404) {
        return null; // Not generated yet
      }

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Failed to fetch content' }));
        throw new Error(error.message);
      }

      return response.json();
    },
    enabled: !!user?.id && !!videoId,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to generate content for a specific video and content type
 */
export function useGenerateContent<T extends ContentType>(videoId: string, contentType: T) {
  const queryClient = useQueryClient();
  const { user } = useAuthQuery();

  return useMutation({
    mutationFn: async (options?: { regenerate?: boolean }): Promise<GeneratedContent<T>> => {
      const regenerate = options?.regenerate ?? false;
      if (!user?.id) throw new Error('Not authenticated');

      const token = await getAuthToken();
      if (!token) throw new Error('Not authenticated');

      const response = await fetch(
        `${API_BASE_URL}/api/content/${contentType}/${videoId}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ regenerate }),
        }
      );

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Generation failed' }));
        throw new Error(error.message || 'Failed to generate content');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate content query to refetch
      queryClient.invalidateQueries({
        queryKey: contentKeys.byType(videoId, contentType),
      });
      // Refetch user profile to update credits
      queryClient.invalidateQueries({
        queryKey: ['profile'],
      });
    },
  });
}

// Typed hooks for each content type
export function useShortsContent(videoId: string) {
  return useContent<'shorts'>(videoId, 'shorts');
}

export function useInstagramContent(videoId: string) {
  return useContent<'instagram'>(videoId, 'instagram');
}

export function useTwitterContent(videoId: string) {
  return useContent<'twitter'>(videoId, 'twitter');
}

export function useLinkedInContent(videoId: string) {
  return useContent<'linkedin'>(videoId, 'linkedin');
}

export function useGenerateShorts(videoId: string) {
  return useGenerateContent<'shorts'>(videoId, 'shorts');
}

export function useGenerateInstagram(videoId: string) {
  return useGenerateContent<'instagram'>(videoId, 'instagram');
}

export function useGenerateTwitter(videoId: string) {
  return useGenerateContent<'twitter'>(videoId, 'twitter');
}

export function useGenerateLinkedIn(videoId: string) {
  return useGenerateContent<'linkedin'>(videoId, 'linkedin');
}
