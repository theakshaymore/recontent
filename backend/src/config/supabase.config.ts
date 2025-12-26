import { createClient } from '@supabase/supabase-js';
import { config } from './env.config';

// Service role client for server-side operations
export const supabaseAdmin = createClient(
  config.supabase.url,
  config.supabase.serviceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Create client with user token for authenticated operations
export function createUserClient(accessToken: string) {
  return createClient(config.supabase.url, config.supabase.anonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });
}
