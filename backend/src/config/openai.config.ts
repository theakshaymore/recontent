import OpenAI from 'openai';
import { config } from './env.config';

export const openai = new OpenAI({
  apiKey: config.openai.apiKey,
});
