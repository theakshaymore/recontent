import { openai } from '../config/openai.config';
import { logger } from '../utils/logger';
import { ContentGenerationError } from '../utils/errors';
import type {
  ShortsData,
  BlogData,
  TwitterData,
  LinkedInData,
  InstagramData,
} from '../types/content.types';

async function generateWithGPT(
  systemPrompt: string,
  userPrompt: string,
  maxTokens: number = 2000
): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: maxTokens,
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content || '';
  } catch (error: any) {
    logger.error(`GPT generation failed: ${error.message}`);
    throw new ContentGenerationError(error.message);
  }
}

function parseJSON<T>(content: string, fallback: T): T {
  try {
    // Try to extract JSON from the response
    const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || 
                      content.match(/(\{[\s\S]*\})/) ||
                      content.match(/(\[[\s\S]*\])/);
    
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1]);
    }
    return JSON.parse(content);
  } catch {
    logger.warn('Failed to parse JSON response, using fallback');
    return fallback;
  }
}

export async function generateShorts(transcript: string, title: string): Promise<ShortsData> {
  logger.info('Generating YouTube Shorts scripts');

  const systemPrompt = `You are a YouTube Shorts script writer. Create viral, engaging short video scripts.`;
  
  const userPrompt = `Create 3-5 YouTube Shorts scripts (30-60 seconds each) from this video transcript.

Video Title: "${title}"

Transcript:
${transcript.substring(0, 8000)}

For each short, provide:
- Catchy title (max 50 chars)
- Hook (first 3 seconds - must grab attention)
- Main script (the spoken content)
- Call-to-action
- Estimated duration

Return as JSON:
{
  "shorts": [
    {
      "title": "...",
      "hook": "...",
      "script": "...",
      "cta": "...",
      "duration": "30s"
    }
  ]
}`;

  const response = await generateWithGPT(systemPrompt, userPrompt, 2500);
  return parseJSON<ShortsData>(response, { shorts: [] });
}

export async function generateBlogPost(transcript: string, title: string): Promise<BlogData> {
  logger.info('Generating blog post');

  const systemPrompt = `You are an SEO expert blog writer. Create comprehensive, well-structured blog posts.`;
  
  const userPrompt = `Convert this video transcript into an SEO-optimized blog post.

Video Title: "${title}"

Transcript:
${transcript.substring(0, 10000)}

Requirements:
- 1500-2000 words
- Markdown format with H2 and H3 headers
- Engaging introduction
- Clear sections with subheadings
- Conclusion with CTA
- SEO meta title and description
- 5-10 relevant keywords

Return as JSON:
{
  "title": "SEO-optimized title",
  "meta_description": "150-160 char description",
  "content": "Full markdown content...",
  "seo_keywords": ["keyword1", "keyword2"],
  "estimated_read_time": 7
}`;

  const response = await generateWithGPT(systemPrompt, userPrompt, 4000);
  return parseJSON<BlogData>(response, {
    title: title,
    meta_description: '',
    content: '',
    seo_keywords: [],
    estimated_read_time: 5,
  });
}

export async function generateTwitterThread(transcript: string, _title: string): Promise<TwitterData> {
  logger.info('Generating Twitter thread');

  const systemPrompt = `You are a viral Twitter thread creator. Create engaging, shareable threads.`;
  
  const userPrompt = `Create a viral Twitter thread from this transcript.

Transcript:
${transcript.substring(0, 6000)}

Requirements:
- 7-10 tweets maximum
- First tweet must be a hook that grabs attention
- Each tweet MAX 280 characters
- Use line breaks for readability
- Include 2-3 relevant hashtags at the end
- Last tweet has CTA (follow, share, etc.)
- Make it engaging and shareable

Return as JSON:
{
  "tweets": ["Tweet 1...", "Tweet 2...", "..."],
  "total_tweets": 8,
  "hashtags": ["#topic1", "#topic2"]
}`;

  const response = await generateWithGPT(systemPrompt, userPrompt, 1500);
  return parseJSON<TwitterData>(response, {
    tweets: [],
    total_tweets: 0,
    hashtags: [],
  });
}

export async function generateLinkedInCarousel(transcript: string, title: string): Promise<LinkedInData> {
  logger.info('Generating LinkedIn carousel');

  const systemPrompt = `You are a LinkedIn content strategist. Create professional, value-driven carousel content.`;
  
  const userPrompt = `Create a 10-slide LinkedIn carousel from this content.

Topic: "${title}"

Transcript:
${transcript.substring(0, 8000)}

Requirements:
- Exactly 10 slides
- Slide 1: Eye-catching title/hook
- Slides 2-9: Key insights (max 30 words per slide)
- Slide 10: Conclusion + CTA
- Professional tone
- Actionable takeaways
- Include design notes for each slide

Return as JSON:
{
  "slides": [
    {
      "slide_number": 1,
      "title": "Hook Title",
      "content": "Slide content...",
      "design_notes": "Bold white text on blue gradient"
    }
  ],
  "total_slides": 10
}`;

  const response = await generateWithGPT(systemPrompt, userPrompt, 2500);
  return parseJSON<LinkedInData>(response, {
    slides: [],
    total_slides: 0,
  });
}

export async function generateInstagramCaptions(transcript: string, _title: string): Promise<InstagramData> {
  logger.info('Generating Instagram captions');

  const systemPrompt = `You are an Instagram content creator. Create engaging captions with strategic hashtags.`;
  
  const userPrompt = `Create 3 Instagram caption variations from this content.

Transcript:
${transcript.substring(0, 4000)}

Requirements:
- Caption 1: Professional tone (150-200 chars)
- Caption 2: Casual/Friendly tone (150-200 chars)  
- Caption 3: Story-driven tone (150-200 chars)
- Each with 10-15 relevant hashtags
- Include relevant emojis
- End with question or CTA

Return as JSON:
{
  "captions": [
    {
      "caption": "Caption text...",
      "hashtags": ["#hashtag1", "#hashtag2"],
      "emoji": "✨"
    }
  ]
}`;

  const response = await generateWithGPT(systemPrompt, userPrompt, 1500);
  return parseJSON<InstagramData>(response, {
    captions: [],
  });
}
