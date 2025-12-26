import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { videoId } = await req.json();
    
    if (!videoId) {
      throw new Error('Video ID is required');
    }

    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    // Initialize Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log(`Processing video: ${videoId}`);

    // Get video details
    const { data: video, error: videoError } = await supabase
      .from('videos')
      .select('*')
      .eq('id', videoId)
      .single();

    if (videoError || !video) {
      throw new Error(`Video not found: ${videoError?.message}`);
    }

    // Update status to processing
    await supabase
      .from('videos')
      .update({ status: 'processing' })
      .eq('id', videoId);

    console.log(`Video URL: ${video.youtube_url}`);

    // Extract video ID from YouTube URL
    const youtubeVideoId = extractYoutubeVideoId(video.youtube_url);
    if (!youtubeVideoId) {
      throw new Error('Invalid YouTube URL');
    }

    // For now, we'll simulate the transcription since we can't download YouTube audio directly
    // In production, you'd use yt-dlp on a backend server or a YouTube API
    const mockTranscript = `This is a sample transcript for demonstration purposes. 
    In a production environment, you would use OpenAI Whisper to transcribe the actual audio 
    from the YouTube video. The transcript would contain the full spoken content of the video, 
    which would then be used to generate various content formats including blog posts, 
    social media content, and more.`;

    // Generate content using OpenAI
    console.log('Generating blog post...');
    const blogPost = await generateBlogPost(mockTranscript, video.title || 'Video Content');
    
    console.log('Generating tweets...');
    const tweets = await generateTweets(mockTranscript);
    
    console.log('Generating carousel content...');
    const carousel = await generateCarousel(mockTranscript);
    
    console.log('Generating Instagram captions...');
    const instagramCaptions = await generateInstagramCaptions(mockTranscript);

    // Save generated content
    const { error: contentError } = await supabase
      .from('content')
      .insert({
        video_id: videoId,
        blog_post: blogPost,
        tweets: tweets,
        carousel: carousel,
        instagram_captions: instagramCaptions,
        thumbnail_urls: [],
      });

    if (contentError) {
      throw new Error(`Failed to save content: ${contentError.message}`);
    }

    // Update video status to completed
    await supabase
      .from('videos')
      .update({ 
        status: 'completed',
        title: video.title || `Video ${youtubeVideoId}`,
      })
      .eq('id', videoId);

    // Deduct credit from user
    const { error: creditError } = await supabase.rpc('decrement_credits', { 
      user_id_param: video.user_id 
    });

    if (creditError) {
      console.error('Failed to deduct credit:', creditError);
    }

    console.log(`Video processing completed: ${videoId}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Video processed successfully',
        videoId 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error processing video:', errorMessage);

    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

function extractYoutubeVideoId(url: string): string | null {
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

async function generateBlogPost(transcript: string, title: string): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { 
          role: 'system', 
          content: 'You are an expert content writer. Create engaging, SEO-optimized blog posts from video transcripts. Use markdown formatting with headers, bullet points, and clear structure.' 
        },
        { 
          role: 'user', 
          content: `Create a comprehensive blog post based on this video transcript. Title: "${title}"\n\nTranscript:\n${transcript}` 
        }
      ],
      max_tokens: 2000,
    }),
  });

  const data = await response.json();
  return data.choices?.[0]?.message?.content || 'Failed to generate blog post';
}

async function generateTweets(transcript: string): Promise<string[]> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { 
          role: 'system', 
          content: 'You are a social media expert. Create engaging tweet threads from video content. Each tweet should be under 280 characters. Return tweets as a JSON array of strings.' 
        },
        { 
          role: 'user', 
          content: `Create a thread of 5-7 engaging tweets based on this transcript. Return as JSON array:\n\n${transcript}` 
        }
      ],
      max_tokens: 1000,
    }),
  });

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || '[]';
  
  try {
    // Try to parse JSON directly
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return [content];
  } catch {
    return [content];
  }
}

async function generateCarousel(transcript: string): Promise<{ slides: Array<{ title: string; content: string }> }> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { 
          role: 'system', 
          content: 'You are a LinkedIn content creator. Create engaging carousel slides. Each slide should have a title and content. Return as JSON with format: {"slides": [{"title": "...", "content": "..."}]}' 
        },
        { 
          role: 'user', 
          content: `Create 5-8 LinkedIn carousel slides based on this transcript. Return as JSON:\n\n${transcript}` 
        }
      ],
      max_tokens: 1500,
    }),
  });

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || '{"slides": []}';
  
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return { slides: [] };
  } catch {
    return { slides: [] };
  }
}

async function generateInstagramCaptions(transcript: string): Promise<string[]> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { 
          role: 'system', 
          content: 'You are an Instagram content creator. Create engaging captions with relevant hashtags. Return as JSON array of strings.' 
        },
        { 
          role: 'user', 
          content: `Create 3 Instagram caption variations based on this transcript. Include relevant hashtags. Return as JSON array:\n\n${transcript}` 
        }
      ],
      max_tokens: 1000,
    }),
  });

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || '[]';
  
  try {
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return [content];
  } catch {
    return [content];
  }
}
