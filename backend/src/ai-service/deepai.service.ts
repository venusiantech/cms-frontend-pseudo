import axios from 'axios';
import { AppError } from '../middleware/error.middleware';

/**
 * DeepAI Service - Content and Image Generation
 * https://deepai.org/
 */
export class DeepAIService {
  private readonly apiKey: string;
  private readonly baseUrl: string = 'https://api.deepai.org/api';

  constructor() {
    this.apiKey = process.env.DEEPAI_API_KEY || '';

    console.log('\n🤖 === DEEPAI SERVICE INITIALIZATION ===');
    console.log(`🔑 API Key: ${this.apiKey ? '****' + this.apiKey.slice(-4) : 'NOT SET'}`);

    if (!this.apiKey) {
      console.warn('⚠️  DEEPAI_API_KEY not set - DeepAI features will fail');
    } else {
      console.log('✅ DeepAI Service initialized');
    }
    console.log('==========================================\n');
  }

  /**
   * Generate article titles using DeepAI's text generation
   */
  async generateTitle(topic: string, quantity: number = 1): Promise<string[]> {
    console.log(`\n🔤 === DEEPAI GENERATE TITLES ===`);
    console.log(`Topic: ${topic}`);
    console.log(`Quantity: ${quantity}`);

    if (!this.apiKey) {
      throw new AppError('DeepAI API key is not configured', 500);
    }

    const prompt = `Generate ${quantity} unique, engaging article titles about: "${topic}". Return only the titles, one per line.`;

    try {
      const formData = new URLSearchParams();
      formData.append('text', prompt);

      const response = await axios.post(
        `${this.baseUrl}/text-generator`,
        formData,
        {
          headers: {
            'api-key': this.apiKey,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          timeout: 30000,
        }
      );

      const output = response.data.output;
      if (!output) {
        throw new AppError('DeepAI returned empty response', 500);
      }

      const titles = output
        .split('\n')
        .map((t: string) => t.trim())
        .filter((t: string) => t.length > 0 && t.length < 150)
        .slice(0, quantity);

      if (titles.length === 0) {
        // Fallback: use the topic itself as a title
        titles.push(topic);
      }

      console.log(`✅ Generated ${titles.length} titles`);
      return titles;
    } catch (error: any) {
      this.handleError(error, 'Title generation');
      throw error;
    }
  }

  /**
   * Generate blog content using DeepAI
   */
  async generateBlogContent(title: string): Promise<string> {
    console.log(`\n📝 === DEEPAI GENERATE BLOG ===`);
    console.log(`Title: ${title}`);

    if (!this.apiKey) {
      throw new AppError('DeepAI API key is not configured', 500);
    }

    if (!title || title.trim().length === 0) {
      throw new AppError('Title must be a non-empty string', 400);
    }

    const prompt = `Write a comprehensive blog post with the title: "${title}"

Include:
- An introduction
- 4-5 detailed sections with subheadings
- A conclusion

Format the article in clean Markdown with proper headings (# for title, ## for sections).
Make it professional, informative, and engaging.
Length: approximately 800-1000 words.`;

    try {
      const formData = new URLSearchParams();
      formData.append('text', prompt);

      const response = await axios.post(
        `${this.baseUrl}/text-generator`,
        formData,
        {
          headers: {
            'api-key': this.apiKey,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          timeout: 120000,
        }
      );

      const content = response.data.output;
      if (!content || content.trim().length === 0) {
        throw new AppError('DeepAI returned empty content', 500);
      }

      // Format as markdown if not already
      let formattedContent = content;
      if (!content.startsWith('#')) {
        formattedContent = `# ${title}\n\n${content}`;
      }

      console.log(`✅ DeepAI blog generated successfully`);
      console.log(`   Content Length: ${formattedContent.length} characters`);

      return formattedContent.trim();
    } catch (error: any) {
      this.handleError(error, 'Blog generation');
      throw error;
    }
  }

  /**
   * Generate image using DeepAI
   */
  async generateImage(prompt: string): Promise<string> {
    console.log(`\n🎨 === DEEPAI GENERATE IMAGE ===`);
    console.log(`Prompt: ${prompt.substring(0, 100)}...`);

    if (!this.apiKey) {
      throw new AppError('DeepAI API key is not configured', 500);
    }

    try {
      const formData = new URLSearchParams();
      formData.append('text', `Professional high-quality image: ${prompt}`);

      const response = await axios.post(
        `${this.baseUrl}/text2img`,
        formData,
        {
          headers: {
            'api-key': this.apiKey,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          timeout: 60000,
        }
      );

      const imageUrl = response.data.output_url;
      if (!imageUrl) {
        throw new AppError('DeepAI did not return an image URL', 500);
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
      const errorData = error.response.data?.err || error.response.data;
      console.error(`❌ DeepAI API Error (${status}): ${JSON.stringify(errorData)}`);
      
      if (status === 401 || status === 403) {
        throw new AppError('DeepAI API key is invalid or expired.', 401);
      }
      
      throw new AppError(`DeepAI ${context} failed: ${JSON.stringify(errorData)}`, status);
    } else if (error.request) {
      console.error(`❌ No response from DeepAI: ${error.message}`);
      throw new AppError(`No response from DeepAI (timeout or network error): ${error.message}`, 500);
    } else {
      console.error(`❌ DeepAI ${context} error: ${error.message}`);
      throw new AppError(`DeepAI ${context} error: ${error.message}`, 500);
    }
  }
}
