export type ContentType = 
  | 'shorts' 
  | 'blog' 
  | 'twitter' 
  | 'linkedin' 
  | 'instagram' 
  | 'thumbnail';

export interface Content {
  id: string;
  video_id: string;
  content_type: ContentType;
  content_data: ShortsData | BlogData | TwitterData | LinkedInData | InstagramData | ThumbnailData;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

export interface ShortsData {
  shorts: Array<{
    title: string;
    script: string;
    duration: string;
    hook: string;
    cta: string;
  }>;
}

export interface BlogData {
  title: string;
  meta_description: string;
  content: string;
  seo_keywords: string[];
  estimated_read_time: number;
}

export interface TwitterData {
  tweets: string[];
  total_tweets: number;
  hashtags: string[];
}

export interface LinkedInData {
  slides: Array<{
    slide_number: number;
    title: string;
    content: string;
    design_notes: string;
  }>;
  total_slides: number;
}

export interface InstagramData {
  captions: Array<{
    caption: string;
    hashtags: string[];
    emoji: string;
  }>;
}

export interface ThumbnailData {
  thumbnails: Array<{
    url: string;
    prompt: string;
    style: string;
  }>;
}
