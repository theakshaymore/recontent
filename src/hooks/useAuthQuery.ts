import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';

// Query keys
export const authKeys = {
  session: ['auth', 'session'] as const,
  user: ['auth', 'user'] as const,
};

// Fetch session
async function fetchSession(): Promise<{ user: User | null; session: Session | null }> {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return { user: session?.user ?? null, session };
}

// Auth hook using TanStack Query
export function useAuthQuery() {
  const queryClient = useQueryClient();

  // Session query
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: authKeys.session,
    queryFn: fetchSession,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
    retry: false,
  });

  // Listen to auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        // Synchronously update the query cache
        queryClient.setQueryData(authKeys.session, {
          user: session?.user ?? null,
          session,
        });
      }
    );

    return () => subscription.unsubscribe();
  }, [queryClient]);

  // Sign out mutation
  const signOutMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.setQueryData(authKeys.session, { user: null, session: null });
      queryClient.invalidateQueries({ queryKey: authKeys.session });
    },
  });

  // Sign in with email mutation
  const signInMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(authKeys.session, {
        user: data.user,
        session: data.session,
      });
    },
  });

  // Sign up mutation
  const signUpMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      if (data.user && data.session) {
        queryClient.setQueryData(authKeys.session, {
          user: data.user,
          session: data.session,
        });
      }
    },
  });

  // Sign in with Google
  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });
    if (error) throw error;
  };

  return {
    user: data?.user ?? null,
    session: data?.session ?? null,
    isLoading,
    error,
    refetch,
    signOut: signOutMutation.mutateAsync,
    signIn: signInMutation.mutateAsync,
    signUp: signUpMutation.mutateAsync,
    signInWithGoogle,
    isSigningOut: signOutMutation.isPending,
    isSigningIn: signInMutation.isPending,
    isSigningUp: signUpMutation.isPending,
    signInError: signInMutation.error,
    signUpError: signUpMutation.error,
  };
}
