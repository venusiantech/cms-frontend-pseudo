import axios from 'axios';
import { AppError } from '../middleware/error.middleware';
import { getOpenAIModel } from './ai-provider.config';

/**
 * OpenAI Service - Content Generation using GPT models
 * Uses Emergent Universal Key for API access
 */
export class OpenAIService {
  private readonly apiKey: string;
  private readonly baseUrl: string = 'https://api.openai.com/v1';

  constructor() {
    // Use Emergent LLM Key (Universal Key)
    this.apiKey = process.env.EMERGENT_LLM_KEY || process.env.OPENAI_API_KEY || '';

    console.log('\n🤖 === OPENAI SERVICE INITIALIZATION ===');
    console.log(`🔑 API Key: ${this.apiKey ? '****' + this.apiKey.slice(-4) : 'NOT SET'}`);

    if (!this.apiKey) {
      console.warn('⚠️  EMERGENT_LLM_KEY/OPENAI_API_KEY not set - OpenAI features will fail');
    } else {
      console.log('✅ OpenAI Service initialized');
    }
    console.log('==========================================\n');
  }

  /**
   * Generate article titles using OpenAI
   */
  async generateTitle(topic: string, quantity: number = 1): Promise<string[]> {
    console.log(`\n🔤 === OPENAI GENERATE TITLES ===`);
    console.log(`Topic: ${topic}`);
    console.log(`Quantity: ${quantity}`);

    if (!this.apiKey) {
      throw new AppError('OpenAI API key is not configured', 500);
    }

    const model = await getOpenAIModel();
    console.log(`   Model: ${model}`);

    const prompt = `Generate ${quantity} unique, engaging article title(s) about: "${topic}"

Requirements:
- Each title should be compelling and SEO-friendly
- Keep titles between 40-70 characters
- Make them professional and informative
- Return ONLY the titles, one per line, no numbering or bullets`;

    try {
      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model,
          messages: [
            { role: 'system', content: 'You are a professional content writer specializing in creating engaging article titles.' },
            { role: 'user', content: prompt },
          ],
          temperature: 0.8,
          max_tokens: 500,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 30000,
        }
      );

      const content = response.data.choices[0]?.message?.content;
      if (!content) {
        throw new AppError('OpenAI returned empty response', 500);
      }

      const titles = content
        .split('\n')
        .map((t: string) => t.trim())
        .filter((t: string) => t.length > 0 && !t.match(/^\d+\./))
        .slice(0, quantity);

      console.log(`✅ Generated ${titles.length} titles`);
      return titles;
    } catch (error: any) {
      this.handleError(error, 'Title generation');
      throw error;
    }
  }

  /**
   * Generate blog content using OpenAI
   */
  async generateBlogContent(title: string): Promise<string> {
    console.log(`\n📝 === OPENAI GENERATE BLOG ===`);
    console.log(`Title: ${title}`);

    if (!this.apiKey) {
      throw new AppError('OpenAI API key is not configured', 500);
    }

    if (!title || title.trim().length === 0) {
      throw new AppError('Title must be a non-empty string', 400);
    }

    const model = await getOpenAIModel();
    console.log(`   Model: ${model}`);

    const prompt = `Write a comprehensive, well-researched blog post about: "${title}"

Requirements:
- Start with a single # heading that is the article title
- Use ## for section headings (4-6 sections)
- Include a short introduction paragraph before the first section
- Each section should have 2-3 paragraphs of detailed, informative content
- End with a ## Conclusion section that summarizes key takeaways
- Length: 800-1200 words
- Tone: professional, informative, and engaging
- Format: clean Markdown only — no HTML, no frontmatter, no preamble
- Return ONLY the markdown content, nothing else`;

    try {
      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model,
          messages: [
            { role: 'system', content: 'You are a professional content writer who creates comprehensive, well-structured blog posts in Markdown format.' },
            { role: 'user', content: prompt },
          ],
          temperature: 0.7,
          max_tokens: 4000,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 120000, // 2 minutes for longer content
        }
      );

      const content = response.data.choices[0]?.message?.content;
      if (!content || content.trim().length === 0) {
        throw new AppError('OpenAI returned empty content', 500);
      }

      console.log(`✅ OpenAI blog generated successfully`);
      console.log(`   Content Length: ${content.length} characters`);

      return content.trim();
    } catch (error: any) {
      this.handleError(error, 'Blog generation');
      throw error;
    }
  }

  /**
   * Generate image using DALL-E (OpenAI's image generation)
   */
  async generateImage(prompt: string, size: string = '1024x1024'): Promise<string> {
    console.log(`\n🎨 === OPENAI GENERATE IMAGE (DALL-E) ===`);
    console.log(`Prompt: ${prompt.substring(0, 100)}...`);

    if (!this.apiKey) {
      throw new AppError('OpenAI API key is not configured', 500);
    }

    try {
      const response = await axios.post(
        `${this.baseUrl}/images/generations`,
        {
          model: 'dall-e-3',
          prompt: `Professional, high-quality image: ${prompt}`,
          n: 1,
          size,
          quality: 'standard',
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 60000,
        }
      );

      const imageUrl = response.data.data[0]?.url;
      if (!imageUrl) {
        throw new AppError('OpenAI did not return an image URL', 500);
      }

      console.log(`✅ Image generated: ${imageUrl.substring(0, 80)}...`);
      return imageUrl;
    } catch (error: any) {
      this.handleError(error, 'Image generation');
      throw error;
    }
  }

  private handleError(error: any, context: string): void {
    if (error instanceof AppError) {
      throw error;
    }

    if (error.response) {
      const status = error.response.status;
      const errorData = error.response.data?.error?.message || error.response.data;
      console.error(`❌ OpenAI API Error (${status}): ${JSON.stringify(errorData)}`);
      
      if (status === 429) {
        throw new AppError('OpenAI rate limit exceeded. Please try again later.', 429);
      }
      if (status === 401) {
        throw new AppError('OpenAI API key is invalid or expired.', 401);
      }
      
      throw new AppError(`OpenAI ${context} failed: ${JSON.stringify(errorData)}`, status);
    } else if (error.request) {
      console.error(`❌ No response from OpenAI: ${error.message}`);
      throw new AppError(`No response from OpenAI (timeout or network error): ${error.message}`, 500);
    } else {
      console.error(`❌ OpenAI ${context} error: ${error.message}`);
      throw new AppError(`OpenAI ${context} error: ${error.message}`, 500);
    }
  }
}
