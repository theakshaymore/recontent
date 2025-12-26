export interface Video {
  id: string;
  user_id: string;
  youtube_url: string;
  video_id: string;
  title: string | null;
  duration: number | null;
  transcript: string | null;
  transcript_status: 'pending' | 'processing' | 'completed' | 'failed';
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateVideoInput {
  youtube_url: string;
}

export interface VideoResponse {
  video_id: string;
  status: string;
  message: string;
}
