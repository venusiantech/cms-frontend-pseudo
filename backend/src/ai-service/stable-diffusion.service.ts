import axios from 'axios';
import { AppError } from '../middleware/error.middleware';
import { getStableDiffusionModel } from './ai-provider.config';

/**
 * Stable Diffusion Service - AI Image Generation
 * Uses Stability AI's API
 * https://stability.ai/
 */
export class StableDiffusionService {
  private readonly apiKey: string;
  private readonly baseUrl: string = 'https://api.stability.ai/v1';

  constructor() {
    this.apiKey = process.env.STABILITY_API_KEY || '';

    console.log('\n🤖 === STABLE DIFFUSION SERVICE INITIALIZATION ===');
    console.log(`🔑 API Key: ${this.apiKey ? '****' + this.apiKey.slice(-4) : 'NOT SET'}`);

    if (!this.apiKey) {
      console.warn('⚠️  STABILITY_API_KEY not set - Stable Diffusion features will fail');
    } else {
      console.log('✅ Stable Diffusion Service initialized');
    }
    console.log('==========================================\n');
  }

  /**
   * Generate image using Stable Diffusion
   */
  async generateImage(prompt: string, size: string = '1024x1024'): Promise<string> {
    console.log(`\n🎨 === STABLE DIFFUSION GENERATE IMAGE ===`);
    console.log(`Prompt: ${prompt.substring(0, 100)}...`);

    if (!this.apiKey) {
      throw new AppError('Stability AI API key is not configured', 500);
    }

    const model = await getStableDiffusionModel();
    console.log(`   Model: ${model}`);

    // Parse size
    const [width, height] = size.split('x').map(Number);
    const validWidth = Math.min(Math.max(width || 1024, 512), 2048);
    const validHeight = Math.min(Math.max(height || 1024, 512), 2048);

    // Map model to engine
    const engineMap: Record<string, string> = {
      'stable-diffusion-xl': 'stable-diffusion-xl-1024-v1-0',
      'stable-diffusion-3': 'stable-diffusion-v1-6',
      'sdxl-turbo': 'stable-diffusion-xl-1024-v1-0',
    };
    const engine = engineMap[model] || 'stable-diffusion-xl-1024-v1-0';

    try {
      const response = await axios.post(
        `${this.baseUrl}/generation/${engine}/text-to-image`,
        {
          text_prompts: [
            {
              text: `Professional, high-quality image: ${prompt}`,
              weight: 1,
            },
            {
              text: 'blurry, low quality, distorted, watermark, text, logo',
              weight: -1,
            },
          ],
          cfg_scale: 7,
          height: validHeight,
          width: validWidth,
          samples: 1,
          steps: 30,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          timeout: 120000, // 2 minutes for image generation
        }
      );

      const artifacts = response.data.artifacts;
      if (!artifacts || artifacts.length === 0) {
        throw new AppError('Stable Diffusion did not return any images', 500);
      }

      // The API returns base64 encoded images
      const base64Image = artifacts[0].base64;
      if (!base64Image) {
        throw new AppError('Stable Diffusion returned invalid image data', 500);
      }

      // Convert to data URL for now (could be uploaded to S3)
      const imageUrl = `data:image/png;base64,${base64Image}`;

      console.log(`✅ Image generated successfully`);
      console.log(`   Size: ${validWidth}x${validHeight}`);

      return imageUrl;
    } catch (error: any) {
      this.handleError(error, 'Image generation');
      throw error;
    }
  }

  /**
   * Generate image and upload to storage (returns URL instead of base64)
   */
  async generateImageWithStorage(
    prompt: string,
    uploadFn: (base64: string, filename: string) => Promise<string>,
    size: string = '1024x1024'
  ): Promise<string> {
    console.log(`\n🎨 === STABLE DIFFUSION GENERATE & UPLOAD IMAGE ===`);
    console.log(`Prompt: ${prompt.substring(0, 100)}...`);

    if (!this.apiKey) {
      throw new AppError('Stability AI API key is not configured', 500);
    }

    const model = await getStableDiffusionModel();
    const [width, height] = size.split('x').map(Number);
    const validWidth = Math.min(Math.max(width || 1024, 512), 2048);
    const validHeight = Math.min(Math.max(height || 1024, 512), 2048);

    const engineMap: Record<string, string> = {
      'stable-diffusion-xl': 'stable-diffusion-xl-1024-v1-0',
      'stable-diffusion-3': 'stable-diffusion-v1-6',
      'sdxl-turbo': 'stable-diffusion-xl-1024-v1-0',
    };
    const engine = engineMap[model] || 'stable-diffusion-xl-1024-v1-0';

    try {
      const response = await axios.post(
        `${this.baseUrl}/generation/${engine}/text-to-image`,
        {
          text_prompts: [
            {
              text: `Professional, high-quality image: ${prompt}`,
              weight: 1,
            },
            {
              text: 'blurry, low quality, distorted, watermark, text, logo',
              weight: -1,
            },
          ],
          cfg_scale: 7,
          height: validHeight,
          width: validWidth,
          samples: 1,
          steps: 30,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          timeout: 120000,
        }
      );

      const artifacts = response.data.artifacts;
      if (!artifacts || artifacts.length === 0 || !artifacts[0].base64) {
        throw new AppError('Stable Diffusion did not return valid image', 500);
      }

      // Upload to storage
      const filename = `sd-${Date.now()}.png`;
      const imageUrl = await uploadFn(artifacts[0].base64, filename);

      console.log(`✅ Image generated and uploaded: ${imageUrl.substring(0, 80)}...`);
      return imageUrl;
    } catch (error: any) {
      this.handleError(error, 'Image generation');
      throw error;
    }
  }

  /**
   * Get available balance/credits
   */
  async getBalance(): Promise<number> {
    if (!this.apiKey) {
      throw new AppError('Stability AI API key is not configured', 500);
    }

    try {
      const response = await axios.get(`${this.baseUrl}/user/balance`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
        timeout: 10000,
      });

      return response.data.credits || 0;
    } catch (error: any) {
      console.error('Failed to get Stability AI balance:', error.message);
      return 0;
    }
  }

  private handleError(error: any, context: string): void {
    if (error instanceof AppError) {
      throw error;
    }

    if (error.response) {
      const status = error.response.status;
      const errorData = error.response.data?.message || error.response.data;
      console.error(`❌ Stability AI Error (${status}): ${JSON.stringify(errorData)}`);
      
      if (status === 401) {
        throw new AppError('Stability AI API key is invalid.', 401);
      }
      if (status === 402) {
        throw new AppError('Stability AI: Insufficient credits. Please add more credits.', 402);
      }
      if (status === 429) {
        throw new AppError('Stability AI rate limit exceeded. Please try again later.', 429);
      }
      
      throw new AppError(`Stable Diffusion ${context} failed: ${JSON.stringify(errorData)}`, status);
    } else if (error.request) {
      console.error(`❌ No response from Stability AI: ${error.message}`);
      throw new AppError(`No response from Stability AI (timeout or network error): ${error.message}`, 500);
    } else {
      console.error(`❌ Stability AI ${context} error: ${error.message}`);
      throw new AppError(`Stable Diffusion ${context} error: ${error.message}`, 500);
    }
  }
}
