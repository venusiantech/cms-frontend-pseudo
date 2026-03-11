import axios from 'axios';
import { AppError } from '../middleware/error.middleware';

/**
 * Rytr Service - AI Copywriting Assistant
 * https://rytr.me/
 */
export class RytrService {
  private readonly apiKey: string;
  private readonly baseUrl: string = 'https://api.rytr.me/v1';

  constructor() {
    this.apiKey = process.env.RYTR_API_KEY || '';

    console.log('\n🤖 === RYTR SERVICE INITIALIZATION ===');
    console.log(`🔑 API Key: ${this.apiKey ? '****' + this.apiKey.slice(-4) : 'NOT SET'}`);

    if (!this.apiKey) {
      console.warn('⚠️  RYTR_API_KEY not set - Rytr features will fail');
    } else {
      console.log('✅ Rytr Service initialized');
    }
    console.log('==========================================\n');
  }

  // Rytr use case IDs (from their API documentation)
  private readonly USE_CASES = {
    blogIdea: '60a40cf5da9d76d35c0aec51',      // Blog Idea & Outline
    blogSection: '60584cf2c2cdaa000c2a7954',   // Blog Section Writing
    blogTitle: '605851eb4bd4c8001c2d5dd9',     // Blog Title
    articleIdea: '60a411fdd7d4af00c18f0001',   // Article Idea & Outline
    seoTitle: '60785f2eb4e7520010bc961a',      // SEO Meta Title
    seoDescription: '605856edc2cdaa000c2a7957', // SEO Meta Description
  };

  // Rytr tone IDs
  private readonly TONES = {
    informative: '60572a639bdd4272b8fe358a',
    professional: '6058207930f7b1000c1c4f85',
    convincing: '604db9e3f00d5400d88c9336',
    engaging: '60583256c2cdaa000c2a7963',
  };

  /**
   * Generate article titles using Rytr
   */
  async generateTitle(topic: string, quantity: number = 1): Promise<string[]> {
    console.log(`\n🔤 === RYTR GENERATE TITLES ===`);
    console.log(`Topic: ${topic}`);
    console.log(`Quantity: ${quantity}`);

    if (!this.apiKey) {
      throw new AppError('Rytr API key is not configured', 500);
    }

    try {
      const response = await axios.post(
        `${this.baseUrl}/ryte`,
        {
          languageId: '607adac76f8fe5000c1e636d', // English
          toneId: this.TONES.professional,
          useCaseId: this.USE_CASES.blogTitle,
          inputContexts: {
            BLOG_TOPIC_LABEL: topic,
          },
          variations: Math.min(quantity, 3), // Rytr supports up to 3 variations
          userId: 'fastofy-cms',
          format: 'text',
        },
        {
          headers: {
            'Authentication': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 30000,
        }
      );

      const data = response.data.data;
      if (!data || !Array.isArray(data)) {
        throw new AppError('Rytr returned invalid response', 500);
      }

      const titles = data
        .map((item: any) => item.text?.trim())
        .filter((t: string) => t && t.length > 0)
        .slice(0, quantity);

      if (titles.length === 0) {
        // Fallback: return a formatted version of the topic
        titles.push(`The Complete Guide to ${topic}`);
      }

      console.log(`✅ Generated ${titles.length} titles`);
      return titles;
    } catch (error: any) {
      this.handleError(error, 'Title generation');
      throw error;
    }
  }

  /**
   * Generate blog content using Rytr
   */
  async generateBlogContent(title: string): Promise<string> {
    console.log(`\n📝 === RYTR GENERATE BLOG ===`);
    console.log(`Title: ${title}`);

    if (!this.apiKey) {
      throw new AppError('Rytr API key is not configured', 500);
    }

    if (!title || title.trim().length === 0) {
      throw new AppError('Title must be a non-empty string', 400);
    }

    try {
      // First, generate an outline
      const outlineResponse = await axios.post(
        `${this.baseUrl}/ryte`,
        {
          languageId: '607adac76f8fe5000c1e636d', // English
          toneId: this.TONES.informative,
          useCaseId: this.USE_CASES.blogIdea,
          inputContexts: {
            BLOG_TOPIC_LABEL: title,
          },
          variations: 1,
          userId: 'fastofy-cms',
          format: 'text',
        },
        {
          headers: {
            'Authentication': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 30000,
        }
      );

      const outline = outlineResponse.data.data?.[0]?.text || '';

      // Then generate blog sections based on the title
      const sectionResponse = await axios.post(
        `${this.baseUrl}/ryte`,
        {
          languageId: '607adac76f8fe5000c1e636d', // English
          toneId: this.TONES.informative,
          useCaseId: this.USE_CASES.blogSection,
          inputContexts: {
            SECTION_TOPIC_LABEL: title,
            SECTION_KEYWORDS_LABEL: title.split(' ').slice(0, 5).join(', '),
          },
          variations: 3, // Get multiple sections
          userId: 'fastofy-cms',
          format: 'text',
        },
        {
          headers: {
            'Authentication': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 60000,
        }
      );

      const sections = sectionResponse.data.data || [];
      
      // Combine into a markdown article
      let content = `# ${title}\n\n`;
      
      // Add introduction from outline
      if (outline) {
        content += `${outline}\n\n`;
      }

      // Add sections
      sections.forEach((section: any, index: number) => {
        if (section.text) {
          content += `## Section ${index + 1}\n\n`;
          content += `${section.text.trim()}\n\n`;
        }
      });

      // Add conclusion
      content += `## Conclusion\n\n`;
      content += `In summary, ${title.toLowerCase()} is an important topic that deserves careful consideration. `;
      content += `By understanding the key aspects covered in this article, you can make more informed decisions and achieve better results.\n`;

      if (content.length < 500) {
        throw new AppError('Rytr generated insufficient content', 500);
      }

      console.log(`✅ Rytr blog generated successfully`);
      console.log(`   Content Length: ${content.length} characters`);

      return content.trim();
    } catch (error: any) {
      this.handleError(error, 'Blog generation');
      throw error;
    }
  }

  /**
   * Generate SEO metadata using Rytr
   */
  async generateSEO(topic: string): Promise<{ title: string; description: string }> {
    console.log(`\n🔍 === RYTR GENERATE SEO ===`);
    console.log(`Topic: ${topic}`);

    if (!this.apiKey) {
      throw new AppError('Rytr API key is not configured', 500);
    }

    try {
      // Generate SEO title
      const titleResponse = await axios.post(
        `${this.baseUrl}/ryte`,
        {
          languageId: '607adac76f8fe5000c1e636d',
          toneId: this.TONES.professional,
          useCaseId: this.USE_CASES.seoTitle,
          inputContexts: {
            TARGET_KEYWORD_LABEL: topic,
          },
          variations: 1,
          userId: 'fastofy-cms',
          format: 'text',
        },
        {
          headers: {
            'Authentication': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 30000,
        }
      );

      // Generate SEO description
      const descResponse = await axios.post(
        `${this.baseUrl}/ryte`,
        {
          languageId: '607adac76f8fe5000c1e636d',
          toneId: this.TONES.convincing,
          useCaseId: this.USE_CASES.seoDescription,
          inputContexts: {
            PAGE_TITLE_LABEL: topic,
          },
          variations: 1,
          userId: 'fastofy-cms',
          format: 'text',
        },
        {
          headers: {
            'Authentication': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 30000,
        }
      );

      const seoTitle = titleResponse.data.data?.[0]?.text?.trim() || topic;
      const seoDescription = descResponse.data.data?.[0]?.text?.trim() || `Learn about ${topic}`;

      console.log(`✅ SEO generated successfully`);
      return { title: seoTitle, description: seoDescription };
    } catch (error: any) {
      this.handleError(error, 'SEO generation');
      throw error;
    }
  }

  private handleError(error: any, context: string): void {
    if (error instanceof AppError) {
      throw error;
    }

    if (error.response) {
      const status = error.response.status;
      const errorData = error.response.data?.error || error.response.data;
      console.error(`❌ Rytr API Error (${status}): ${JSON.stringify(errorData)}`);
      
      if (status === 401 || status === 403) {
        throw new AppError('Rytr API key is invalid or expired.', 401);
      }
      if (status === 429) {
        throw new AppError('Rytr rate limit exceeded. Please try again later.', 429);
      }
      
      throw new AppError(`Rytr ${context} failed: ${JSON.stringify(errorData)}`, status);
    } else if (error.request) {
      console.error(`❌ No response from Rytr: ${error.message}`);
      throw new AppError(`No response from Rytr (timeout or network error): ${error.message}`, 500);
    } else {
      console.error(`❌ Rytr ${context} error: ${error.message}`);
      throw new AppError(`Rytr ${context} error: ${error.message}`, 500);
    }
  }
}
