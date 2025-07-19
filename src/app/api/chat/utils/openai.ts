import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not defined in environment variables');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const MODEL = process.env.OPENAI_MODEL || 'gpt-4-turbo-preview';
export const TEMPERATURE = parseFloat(process.env.OPENAI_TEMPERATURE || '0.7');