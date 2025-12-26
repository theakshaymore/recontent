import { supabase } from '@/integrations/supabase/client';
import type { ProcessVideoRequest, ProcessVideoResponse, ApiError } from '@/types';

// API base URL - will be configured for Express backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Get the current user's JWT token for API calls
 */
async function getAuthToken(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token ?? null;
}

/**
 * Create headers with auth token
 */
async function createAuthHeaders(): Promise<HeadersInit> {
  const token = await getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
}

/**
 * Handle API response
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error: ApiError = await response.json().catch(() => ({
      error: 'Unknown error',
      message: 'An unexpected error occurred',
      status: response.status,
    }));
    throw new Error(error.message || 'Request failed');
  }
  return response.json();
}

/**
 * API client for Express backend
 */
export const api = {
  /**
   * Process a YouTube video
   */
  async processVideo(data: ProcessVideoRequest): Promise<ProcessVideoResponse> {
    const headers = await createAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/videos/process`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    return handleResponse<ProcessVideoResponse>(response);
  },

  /**
   * Get video processing status
   */
  async getVideoStatus(videoId: string): Promise<{ status: string; progress?: number }> {
    const headers = await createAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/videos/${videoId}/status`, {
      method: 'GET',
      headers,
    });
    return handleResponse(response);
  },

  /**
   * Create Razorpay checkout session
   */
  async createCheckoutSession(planType: 'pro' | 'agency'): Promise<{ subscription_id: string; order_id: string }> {
    const headers = await createAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/subscriptions/checkout`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ plan_type: planType }),
    });
    return handleResponse(response);
  },

  /**
   * Cancel subscription
   */
  async cancelSubscription(): Promise<{ success: boolean }> {
    const headers = await createAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/subscriptions/cancel`, {
      method: 'POST',
      headers,
    });
    return handleResponse(response);
  },
};

export default api;
