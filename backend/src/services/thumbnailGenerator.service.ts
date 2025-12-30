import { openai } from "../config/openai.config";
import { supabaseAdmin } from "../config/supabase.config";
import { logger } from "../utils/logger";
import { ContentGenerationError } from "../utils/errors";
import type { ThumbnailData } from "../types/content.types";

export async function generateThumbnails(
  transcript: string,
  videoTitle: string,
  videoId: string
): Promise<ThumbnailData> {
  logger.info("Generating thumbnails");

  // Extract main topic from transcript
  const topicPrompt = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "Extract the main topic/theme in 10 words or less.",
      },
      {
        role: "user",
        content: `Video: "${videoTitle}"\n\nTranscript excerpt: ${transcript.substring(
          0,
          2000
        )}`,
      },
    ],
    max_tokens: 50,
  });

  const mainTopic = topicPrompt.choices[0]?.message?.content || videoTitle;

  const thumbnailStyles = [
    { style: "professional", description: "clean, corporate, blue tones" },
    {
      style: "bold",
      description: "high contrast, yellow/black, attention-grabbing",
    },
    {
      style: "minimal",
      description: "simple, white background, elegant typography",
    },
  ];

  const thumbnails: ThumbnailData["thumbnails"] = [];

  for (const { style, description } of thumbnailStyles) {
    try {
      const prompt = `Professional YouTube thumbnail for video about: ${mainTopic}. 
Style: ${description}. 
Modern, eye-catching, 16:9 aspect ratio.
No text overlays, abstract/conceptual design.
High quality, vibrant colors.`;

      logger.info(`Generating ${style} thumbnail`);

      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt,
        n: 1,
        size: "1792x1024",
        quality: "standard",
      });

      const imageUrl = response.data?.[0]?.url;

      if (imageUrl) {
        // Download and upload to Supabase Storage
        const storedUrl = await uploadThumbnail(imageUrl, videoId, style);

        thumbnails.push({
          url: storedUrl || imageUrl,
          prompt,
          style,
        });
      }
    } catch (error: any) {
      logger.error(`Failed to generate ${style} thumbnail: ${error.message}`);
      // Continue with other styles even if one fails
    }
  }

  if (thumbnails.length === 0) {
    throw new ContentGenerationError("Failed to generate any thumbnails");
  }

  return { thumbnails };
}

async function uploadThumbnail(
  imageUrl: string,
  videoId: string,
  style: string
): Promise<string | null> {
  try {
    // Fetch the image
    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const fileName = `${videoId}/${style}-${Date.now()}.png`;

    // Upload to Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from("thumbnails")
      .upload(fileName, buffer, {
        contentType: "image/png",
        upsert: true,
      });

    if (error) {
      logger.error(`Failed to upload thumbnail: ${error.message}`);
      return null;
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from("thumbnails").getPublicUrl(data.path);

    return publicUrl;
  } catch (error: any) {
    logger.error(`Failed to upload thumbnail: ${error.message}`);
    return null;
  }
}
