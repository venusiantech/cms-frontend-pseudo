import axios from 'axios';
import { AppError } from '../middleware/error.middleware';
import { StorageService } from '../storage/storage.service';
import { 
  getAiProvider, 
  AiProvider,
  AiProviderTask,
} from './ai-provider.config';

// Import all provider services
import { GeminiService } from './gemini.service';
import { PexelsService } from './pexels.service';
import { OpenAIService } from './openai.service';
import { ClaudeService } from './claude.service';
import { DeepAIService } from './deepai.service';
import { RytrService } from './rytr.service';
import { StableDiffusionService } from './stable-diffusion.service';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * AI SERVICE - Multi-Provider Content Generation Hub
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Supported Providers:
 * - Aaddyy (default): Full-featured AI service
 * - Gemini: Google's AI for content generation
 * - OpenAI: GPT models for content generation
 * - Claude: Anthropic's Claude for long-form content
 * - DeepAI: Cost-effective AI for various content
 * - Rytr: AI copywriting assistant
 * - Pexels: Stock photo integration
 * - Stable Diffusion: AI image generation
 */
export class AiService {
  private readonly aaddyyApiKey: string;
  private readonly aaddyyApiUrl: string;
  private readonly storageService: StorageService;
  
  // Provider services
  private readonly geminiService: GeminiService;
  private readonly pexelsService: PexelsService;
  private readonly openaiService: OpenAIService;
  private readonly claudeService: ClaudeService;
  private readonly deepaiService: DeepAIService;
  private readonly rytrService: RytrService;
  private readonly stableDiffusionService: StableDiffusionService;

  constructor() {
    this.aaddyyApiKey = process.env.AADDYY_API_KEY || '';
    this.aaddyyApiUrl = process.env.AADDYY_API_URL || 'https://backend.aaddyy.com';
    this.storageService = new StorageService();
    
    // Initialize all provider services
    this.geminiService = new GeminiService();
    this.pexelsService = new PexelsService();
    this.openaiService = new OpenAIService();
    this.claudeService = new ClaudeService();
    this.deepaiService = new DeepAIService();
    this.rytrService = new RytrService();
    this.stableDiffusionService = new StableDiffusionService();

    console.log('\n🤖 === MULTI-PROVIDER AI SERVICE INITIALIZED ===');
    console.log(`📋 Aaddyy API URL: ${this.aaddyyApiUrl}`);
    console.log(`🔑 Aaddyy API Key: ${this.aaddyyApiKey ? '****' + this.aaddyyApiKey.slice(-4) : 'NOT SET'}`);
    console.log('✅ All provider services loaded');
    console.log('==========================================\n');
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // TITLE GENERATION
  // ═══════════════════════════════════════════════════════════════════════════════

  /**
   * Generate article titles using the configured AI provider
   */
  async generateTitle(topic: string, quantity: number = 1): Promise<string[]> {
    const provider = await getAiProvider('title');
    console.log(`\n🔤 === GENERATE TITLES (provider: ${provider}) ===`);
    console.log(`Topic: ${topic}`);
    console.log(`Quantity: ${quantity}`);

    // Validation
    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      throw new AppError('Invalid topic: Topic must be a non-empty string', 400);
    }

    if (topic.length > 200) {
      throw new AppError(`Invalid topic: Topic too long (${topic.length} chars, max 200)`, 400);
    }

    // Route to appropriate provider
    switch (provider) {
      case 'openai':
        return this.openaiService.generateTitle(topic, quantity);
      
      case 'claude':
        return this.claudeService.generateTitle(topic, quantity);
      
      case 'gemini':
        // Gemini doesn't have a dedicated title endpoint, use blog generation
        const content = await this.geminiService.generateBlogContent(`Generate ${quantity} title(s) for: ${topic}`);
        return content.split('\n').filter(t => t.trim().length > 0).slice(0, quantity);
      
      case 'deepai':
        return this.deepaiService.generateTitle(topic, quantity);
      
      case 'rytr':
        return this.rytrService.generateTitle(topic, quantity);
      
      case 'aaddyy':
      default:
        return this.generateTitleWithAaddyy(topic, quantity);
    }
  }

  private async generateTitleWithAaddyy(topic: string, quantity: number): Promise<string[]> {
    if (!this.aaddyyApiKey) {
      throw new AppError('AADDYY_API_KEY is not configured. Cannot generate titles.', 500);
    }

    console.log(`Calling: POST ${this.aaddyyApiUrl}/api/ai/article-title`);

    try {
      const response = await axios.post(
        `${this.aaddyyApiUrl}/api/ai/article-title`,
        {
          topic,
          tone: 'professional',
          quantity,
          audience: 'general',
          keywords: topic,
          maxLength: 100,
          includeNumbers: false,
        },
        {
          headers: {
            Authorization: `Bearer ${this.aaddyyApiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 60000,
        }
      );

      if (response.data.success) {
        console.log(`✅ Aaddyy API Success!`);
        console.log(`   Cost: $${response.data.data?.cost || 0}`);
        console.log(`   Remaining Credits: $${response.data.data?.remainingCredits || 0}`);

        const titles = response.data.data?.titles;
        if (!titles || !Array.isArray(titles) || titles.length === 0) {
          throw new AppError('No titles returned from API', 500);
        }

        return titles;
      } else {
        throw new AppError(`Title generation failed: ${JSON.stringify(response.data.error)}`, 500);
      }
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      this.handleAaddyyError(error, 'Title generation');
      throw error;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // BLOG CONTENT GENERATION
  // ═══════════════════════════════════════════════════════════════════════════════

  /**
   * Generate blog content using the configured AI provider
   */
  async generateBlogContent(title: string): Promise<string> {
    const provider = await getAiProvider('blog');
    console.log(`\n📝 === GENERATE BLOG (provider: ${provider}) ===`);
    console.log(`Topic: ${title}`);

    // Validation
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      throw new AppError('Invalid topic: Topic must be a non-empty string', 400);
    }

    if (title.length > 500) {
      throw new AppError(`Invalid topic: Topic too long (${title.length} chars, max 500)`, 400);
    }

    // Detect invalid topics
    const lowerTitle = title.toLowerCase();
    if (
      (lowerTitle.includes('apologies') && lowerTitle.includes('confusion')) ||
      (lowerTitle.includes('placeholder') && lowerTitle.includes('{{')) ||
      lowerTitle.includes('target audience:')
    ) {
      throw new AppError('Invalid topic: Topic appears to be an error message or placeholder', 400);
    }

    // Route to appropriate provider
    switch (provider) {
      case 'openai':
        return this.openaiService.generateBlogContent(title);
      
      case 'claude':
        return this.claudeService.generateBlogContent(title);
      
      case 'gemini':
        return this.geminiService.generateBlogContent(title);
      
      case 'deepai':
        return this.deepaiService.generateBlogContent(title);
      
      case 'rytr':
        return this.rytrService.generateBlogContent(title);
      
      case 'aaddyy':
      default:
        return this.generateBlogWithAaddyy(title);
    }
  }

  private async generateBlogWithAaddyy(title: string): Promise<string> {
    if (!this.aaddyyApiKey) {
      throw new AppError('AADDYY_API_KEY is not configured. Cannot generate content.', 500);
    }

    console.log(`Calling: POST ${this.aaddyyApiUrl}/api/ai/research-blog-writer`);

    try {
      const response = await axios.post(
        `${this.aaddyyApiUrl}/api/ai/research-blog-writer`,
        {
          topic: title,
          includeResearch: true,
          articleType: 'Feature Article',
          autoDetectType: false,
        },
        {
          headers: {
            Authorization: `Bearer ${this.aaddyyApiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 300000, // 5 minutes
        }
      );

      if (response.data.success) {
        console.log(`✅ Aaddyy API Success!`);
        const content = response.data.data?.content;
        if (!content) {
          throw new AppError('Content field is missing from API response', 500);
        }
        console.log(`   Content Length: ${content.length} characters`);
        return content;
      } else {
        throw new AppError(`Blog generation failed: ${JSON.stringify(response.data.error)}`, 500);
      }
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      this.handleAaddyyError(error, 'Blog generation');
      throw error;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // IMAGE GENERATION
  // ═══════════════════════════════════════════════════════════════════════════════

  /**
   * Generate image using the configured AI provider
   */
  async generateImage(prompt: string, size: string = '1024x1024'): Promise<string> {
    const provider = await getAiProvider('image');
    console.log(`\n🎨 === GENERATE IMAGE (provider: ${provider}) ===`);
    console.log(`Prompt: ${prompt.substring(0, 100)}...`);

    // Route to appropriate provider
    switch (provider) {
      case 'pexels':
        return this.pexelsService.fetchImage(prompt);
      
      case 'stable-diffusion':
        const base64Image = await this.stableDiffusionService.generateImage(prompt, size);
        // If it's a data URL, upload to storage
        if (base64Image.startsWith('data:')) {
          const base64Data = base64Image.split(',')[1];
          return this.storageService.uploadBase64Image(base64Data, `sd-${Date.now()}.png`);
        }
        return base64Image;
      
      case 'deepai':
        const deepaiUrl = await this.deepaiService.generateImage(prompt);
        // Upload to storage for consistency
        return this.storageService.uploadImageFromUrl(deepaiUrl);
      
      case 'openai':
        const dalleUrl = await this.openaiService.generateImage(prompt, size);
        return this.storageService.uploadImageFromUrl(dalleUrl);
      
      case 'aaddyy':
      default:
        return this.generateImageWithAaddyy(prompt, size);
    }
  }

  private async generateImageWithAaddyy(prompt: string, size: string): Promise<string> {
    if (!this.aaddyyApiKey) {
      throw new AppError('AADDYY_API_KEY is not configured. Cannot generate image.', 500);
    }

    console.log(`Calling: POST ${this.aaddyyApiUrl}/api/ai/image-generation`);

    try {
      const response = await axios.post(
        `${this.aaddyyApiUrl}/api/ai/image-generation`,
        {
          prompt,
          size,
          num_images: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${this.aaddyyApiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 60000,
        }
      );

      if (response.data.success) {
        console.log(`✅ Aaddyy API Success!`);

        let imageUrl: string | null = null;

        if (response.data.data?.images && response.data.data.images.length > 0) {
          imageUrl = response.data.data.images[0].url;
        } else if (response.data.data?.url) {
          imageUrl = response.data.data.url;
        }

        if (!imageUrl) {
          throw new AppError('Image URL is missing from API response', 500);
        }

        // Upload to storage
        const s3SignedUrl = await this.storageService.uploadImageFromUrl(imageUrl);
        console.log(`   ✅ Uploaded to storage: ${s3SignedUrl.substring(0, 100)}...`);
        
        return s3SignedUrl;
      } else {
        throw new AppError(`Image generation failed: ${JSON.stringify(response.data.error)}`, 500);
      }
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      this.handleAaddyyError(error, 'Image generation');
      throw error;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // UTILITY METHODS
  // ═══════════════════════════════════════════════════════════════════════════════

  /**
   * Find synonyms for a word (Aaddyy only)
   */
  async findSynonyms(word: string, count: number = 5): Promise<Record<string, string>> {
    console.log(`\n🔍 === FIND SYNONYMS ===`);
    console.log(`Topic: ${word}`);

    if (!this.aaddyyApiKey) {
      console.warn('⚠️ AADDYY_API_KEY not set - returning empty synonyms');
      return {};
    }

    try {
      const response = await axios.post(
        `${this.aaddyyApiUrl}/api/ai/synonym-finder`,
        { topic: word, similarWordsCount: count },
        {
          headers: {
            Authorization: `Bearer ${this.aaddyyApiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        return response.data.data?.synonyms || {};
      }
      return {};
    } catch (error: any) {
      console.error('❌ Synonym lookup failed:', error.message);
      return {};
    }
  }

  /**
   * Generate content with a custom prompt
   */
  async generateWithPrompt(prompt: string, context?: Record<string, any>): Promise<string> {
    // Replace placeholders
    let processedPrompt = prompt;
    if (context) {
      Object.keys(context).forEach((key) => {
        processedPrompt = processedPrompt.replace(new RegExp(`{${key}}`, 'g'), context[key]);
      });
    }

    const provider = await getAiProvider('blog');
    console.log(`\n🎯 === GENERATE WITH CUSTOM PROMPT (provider: ${provider}) ===`);

    // Use the blog generation method which will route to the right provider
    return this.generateBlogContent(processedPrompt);
  }

  /**
   * Generate content with a specific provider (override default)
   */
  async generateWithProvider(
    provider: AiProvider,
    task: 'title' | 'blog' | 'image',
    input: string,
    options?: { quantity?: number; size?: string }
  ): Promise<string | string[]> {
    console.log(`\n🎯 === GENERATE WITH SPECIFIC PROVIDER ===`);
    console.log(`Provider: ${provider}`);
    console.log(`Task: ${task}`);

    switch (task) {
      case 'title':
        const quantity = options?.quantity || 1;
        switch (provider) {
          case 'openai': return this.openaiService.generateTitle(input, quantity);
          case 'claude': return this.claudeService.generateTitle(input, quantity);
          case 'deepai': return this.deepaiService.generateTitle(input, quantity);
          case 'rytr': return this.rytrService.generateTitle(input, quantity);
          default: return this.generateTitleWithAaddyy(input, quantity);
        }

      case 'blog':
        switch (provider) {
          case 'openai': return this.openaiService.generateBlogContent(input);
          case 'claude': return this.claudeService.generateBlogContent(input);
          case 'gemini': return this.geminiService.generateBlogContent(input);
          case 'deepai': return this.deepaiService.generateBlogContent(input);
          case 'rytr': return this.rytrService.generateBlogContent(input);
          default: return this.generateBlogWithAaddyy(input);
        }

      case 'image':
        const size = options?.size || '1024x1024';
        switch (provider) {
          case 'pexels': return this.pexelsService.fetchImage(input);
          case 'stable-diffusion': return this.stableDiffusionService.generateImage(input, size);
          case 'deepai': return this.deepaiService.generateImage(input);
          case 'openai': return this.openaiService.generateImage(input, size);
          default: return this.generateImageWithAaddyy(input, size);
        }

      default:
        throw new AppError(`Unknown task: ${task}`, 400);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // ERROR HANDLING
  // ═══════════════════════════════════════════════════════════════════════════════

  private handleAaddyyError(error: any, context: string): void {
    if (error.response) {
      const status = error.response.status;
      const errorData = error.response.data?.error || error.response.data;
      console.error(`❌ Aaddyy API Error (${status}): ${JSON.stringify(errorData)}`);
      throw new AppError(`AI API Error (${status}): ${JSON.stringify(errorData)}`, status);
    } else if (error.request) {
      console.error(`❌ No response from AI API: ${error.message}`);
      throw new AppError(`No response from AI API: ${error.message}`, 500);
    } else {
      console.error(`❌ ${context} error: ${error.message}`);
      throw new AppError(`${context} error: ${error.message}`, 500);
    }
  }
}
