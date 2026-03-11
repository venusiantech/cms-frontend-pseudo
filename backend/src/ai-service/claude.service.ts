import axios from 'axios';
import { AppError } from '../middleware/error.middleware';
import { getClaudeModel } from './ai-provider.config';

/**
 * Claude Service - Content Generation using Anthropic's Claude models
 * Uses Emergent Universal Key for API access
 */
export class ClaudeService {
  private readonly apiKey: string;
  private readonly baseUrl: string = 'https://api.anthropic.com/v1';

  constructor() {
    // Use Emergent LLM Key (Universal Key)
    this.apiKey = process.env.EMERGENT_LLM_KEY || process.env.ANTHROPIC_API_KEY || '';

    console.log('\n🤖 === CLAUDE SERVICE INITIALIZATION ===');
    console.log(`🔑 API Key: ${this.apiKey ? '****' + this.apiKey.slice(-4) : 'NOT SET'}`);

    if (!this.apiKey) {
      console.warn('⚠️  EMERGENT_LLM_KEY/ANTHROPIC_API_KEY not set - Claude features will fail');
    } else {
      console.log('✅ Claude Service initialized');
    }
    console.log('==========================================\n');
  }

  /**
   * Generate article titles using Claude
   */
  async generateTitle(topic: string, quantity: number = 1): Promise<string[]> {
    console.log(`\n🔤 === CLAUDE GENERATE TITLES ===`);
    console.log(`Topic: ${topic}`);
    console.log(`Quantity: ${quantity}`);

    if (!this.apiKey) {
      throw new AppError('Claude API key is not configured', 500);
    }

    const model = await getClaudeModel();
    console.log(`   Model: ${model}`);

    const prompt = `Generate ${quantity} unique, engaging article title(s) about: "${topic}"

Requirements:
- Each title should be compelling and SEO-friendly
- Keep titles between 40-70 characters
- Make them professional and informative
- Return ONLY the titles, one per line, no numbering or bullets`;

    try {
      const response = await axios.post(
        `${this.baseUrl}/messages`,
        {
          model,
          max_tokens: 500,
          messages: [
            { role: 'user', content: prompt },
          ],
        },
        {
          headers: {
            'x-api-key': this.apiKey,
            'anthropic-version': '2023-06-01',
            'Content-Type': 'application/json',
          },
          timeout: 30000,
        }
      );

      const content = response.data.content[0]?.text;
      if (!content) {
        throw new AppError('Claude returned empty response', 500);
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
   * Generate blog content using Claude
   */
  async generateBlogContent(title: string): Promise<string> {
    console.log(`\n📝 === CLAUDE GENERATE BLOG ===`);
    console.log(`Title: ${title}`);

    if (!this.apiKey) {
      throw new AppError('Claude API key is not configured', 500);
    }

    if (!title || title.trim().length === 0) {
      throw new AppError('Title must be a non-empty string', 400);
    }

    const model = await getClaudeModel();
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
        `${this.baseUrl}/messages`,
        {
          model,
          max_tokens: 4000,
          messages: [
            { role: 'user', content: prompt },
          ],
        },
        {
          headers: {
            'x-api-key': this.apiKey,
            'anthropic-version': '2023-06-01',
            'Content-Type': 'application/json',
          },
          timeout: 120000, // 2 minutes for longer content
        }
      );

      const content = response.data.content[0]?.text;
      if (!content || content.trim().length === 0) {
        throw new AppError('Claude returned empty content', 500);
      }

      console.log(`✅ Claude blog generated successfully`);
      console.log(`   Content Length: ${content.length} characters`);

      return content.trim();
    } catch (error: any) {
      this.handleError(error, 'Blog generation');
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
      console.error(`❌ Claude API Error (${status}): ${JSON.stringify(errorData)}`);
      
      if (status === 429) {
        throw new AppError('Claude rate limit exceeded. Please try again later.', 429);
      }
      if (status === 401) {
        throw new AppError('Claude API key is invalid or expired.', 401);
      }
      
      throw new AppError(`Claude ${context} failed: ${JSON.stringify(errorData)}`, status);
    } else if (error.request) {
      console.error(`❌ No response from Claude: ${error.message}`);
      throw new AppError(`No response from Claude (timeout or network error): ${error.message}`, 500);
    } else {
      console.error(`❌ Claude ${context} error: ${error.message}`);
      throw new AppError(`Claude ${context} error: ${error.message}`, 500);
    }
  }
}
