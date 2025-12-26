// User and Profile Types
export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  subscription_tier: 'free' | 'pro' | 'agency';
  credits_remaining: number;
  razorpay_customer_id: string | null;
  created_at: string;
  updated_at: string;
}

// Video Types
export interface Video {
  id: string;
  user_id: string;
  youtube_url: string;
  title: string | null;
  duration: number | null;
  transcript: string | null;
  transcript_status: 'pending' | 'processing' | 'completed' | 'failed' | null;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

// Content Types - Updated for tab-based generation
export type ContentType = 'shorts' | 'instagram' | 'twitter' | 'linkedin';

export interface ShortScript {
  title: string;
  duration: string;
  hook: string;
  script: string;
  cta: string;
}

export interface ShortsContent {
  shorts: ShortScript[];
}

export interface ReelScript {
  title: string;
  duration: string;
  hook: string;
  script: string;
  caption: string;
  hashtags: string[];
}

export interface InstagramContent {
  reels: ReelScript[];
}

export interface TwitterContent {
  tweets: string[];
  total_tweets: number;
  hashtags: string[];
}

export interface CarouselSlide {
  slide_number: number;
  title: string;
  content: string;
  design_notes: string;
}

export interface LinkedInContent {
  slides: CarouselSlide[];
  total_slides: number;
}

export interface ContentData {
  shorts: ShortsContent;
  instagram: InstagramContent;
  twitter: TwitterContent;
  linkedin: LinkedInContent;
}

export interface GeneratedContent<T extends ContentType = ContentType> {
  content_id: string;
  content_type: T;
  data: ContentData[T];
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
}

// Legacy Content Types (for backward compatibility)
export interface Content {
  id: string;
  video_id: string;
  content_type: ContentType | null;
  content_data: Record<string, unknown> | null;
  status: string | null;
  blog_post: string | null;
  tweets: TweetThread | null;
  carousel: CarouselSlide[] | null;
  instagram_captions: InstagramCaption[] | null;
  thumbnail_urls: string[] | null;
  created_at: string;
}

export interface TweetThread {
  tweets: string[];
}

export interface InstagramCaption {
  caption: string;
  hashtags: string[];
}

// Subscription Types
export interface Subscription {
  id: string;
  user_id: string;
  razorpay_subscription_id: string | null;
  plan_type: 'free' | 'pro' | 'agency';
  status: 'active' | 'cancelled' | 'past_due' | 'trialing';
  current_period_start: string | null;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
}

// API Request/Response Types
export interface ProcessVideoRequest {
  youtube_url: string;
}

export interface ProcessVideoResponse {
  video_id: string;
  status: string;
  message: string;
}

export interface ApiError {
  error: string;
  message: string;
  status: number;
}

// Video with Content (joined)
export interface VideoWithContent extends Video {
  content?: Content;
}

// Subscription Plan Details
export interface PlanDetails {
  name: string;
  price: number;
  currency: string;
  videos_per_month: number | 'unlimited';
  features: string[];
}

export const PLAN_DETAILS: Record<string, PlanDetails> = {
  free: {
    name: 'Free',
    price: 0,
    currency: 'INR',
    videos_per_month: 2,
    features: ['2 videos per month', 'All content formats', 'Basic AI thumbnails', 'Email support'],
  },
  pro: {
    name: 'Pro',
    price: 999,
    currency: 'INR',
    videos_per_month: 20,
    features: ['20 videos per month', 'All content formats', 'Premium AI thumbnails', 'Priority support', 'Early access to features', 'Analytics dashboard'],
  },
  agency: {
    name: 'Agency',
    price: 4999,
    currency: 'INR',
    videos_per_month: 'unlimited',
    features: ['Unlimited videos', 'All content formats', 'Premium AI thumbnails', 'Dedicated support', 'Custom branding', 'Team collaboration', 'API access'],
  },
};
