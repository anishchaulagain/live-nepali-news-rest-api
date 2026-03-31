import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

export const revampNewsContent = async (originalTitle: string): Promise<string> => {
  try {
    const model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
    
    const response = await groq.chat.completions.create({
      model: model,
      messages: [
        {
          role: 'system',
          content: 'You are a professional editor. Your task is to rephrase the given news headline to make it unique while strictly preserving its original meaning and keeping it as a concise one-liner. Avoid using the exact original phrasing to prevent copyright issues. Return only the rephrased headline without any additional text or quotes.'
        },
        {
          role: 'user',
          content: originalTitle
        }
      ],
      temperature: 0.7,
      max_tokens: 100,
    });

    const revampedContent = response.choices[0]?.message?.content?.trim();
    
    if (!revampedContent) {
      console.warn('AI returned empty content. Falling back to original title.');
      return originalTitle;
    }

    return revampedContent;
  } catch (error) {
    console.error(`Error revamping news with AI: ${(error as Error).message}`);
    // Fall back to original title if AI fails
    return originalTitle;
  }
};
