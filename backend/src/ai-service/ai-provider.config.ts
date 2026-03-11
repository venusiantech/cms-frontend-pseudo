import prisma from '../config/prisma';

// ═══════════════════════════════════════════════════════════════════════════════
// AI PROVIDER CONFIGURATION - Multi-Provider Support
// ═══════════════════════════════════════════════════════════════════════════════

export type AiProviderTask = 'title' | 'blog' | 'image';

// Extended provider list with new integrations
export type AiProvider = 
  | 'aaddyy' 
  | 'gemini' 
  | 'pexels' 
  | 'openai' 
  | 'claude' 
  | 'deepai' 
  | 'rytr' 
  | 'stable-diffusion';

export type GeminiModel = 'gemini-2.5-pro' | 'gemini-2.5-flash' | 'gemini-2.5-flash-lite';
export type OpenAIModel = 'gpt-5.2' | 'gpt-5.1' | 'gpt-4o' | 'gpt-4.1';
export type ClaudeModel = 'claude-sonnet-4-5-20250929' | 'claude-4-sonnet-20250514' | 'claude-haiku-4-5-20251001';
export type StableDiffusionModel = 'stable-diffusion-xl' | 'stable-diffusion-3' | 'sdxl-turbo';

// ─── Provider Metadata ────────────────────────────────────────────────────────

export interface ProviderInfo {
  id: AiProvider;
  label: string;
  supportedTasks: AiProviderTask[];
  description: string;
  requiresKey: string; // Environment variable name
  costTier: 'free' | 'low' | 'medium' | 'high';
}

export const AI_PROVIDERS: ProviderInfo[] = [
  {
    id: 'aaddyy',
    label: 'Aaddyy AI',
    supportedTasks: ['title', 'blog', 'image'],
    description: 'Full-featured AI service with research-based content',
    requiresKey: 'AADDYY_API_KEY',
    costTier: 'medium',
  },
  {
    id: 'gemini',
    label: 'Google Gemini',
    supportedTasks: ['title', 'blog'],
    description: 'Google\'s advanced AI with high-quality content generation',
    requiresKey: 'GEMINI_API_KEY',
    costTier: 'low',
  },
  {
    id: 'openai',
    label: 'OpenAI GPT',
    supportedTasks: ['title', 'blog'],
    description: 'Industry-leading AI for professional content',
    requiresKey: 'EMERGENT_LLM_KEY',
    costTier: 'medium',
  },
  {
    id: 'claude',
    label: 'Anthropic Claude',
    supportedTasks: ['title', 'blog'],
    description: 'Advanced reasoning and long-form content generation',
    requiresKey: 'EMERGENT_LLM_KEY',
    costTier: 'medium',
  },
  {
    id: 'deepai',
    label: 'DeepAI',
    supportedTasks: ['title', 'blog', 'image'],
    description: 'Cost-effective AI for various content types',
    requiresKey: 'DEEPAI_API_KEY',
    costTier: 'low',
  },
  {
    id: 'rytr',
    label: 'Rytr',
    supportedTasks: ['title', 'blog'],
    description: 'Specialized AI copywriting assistant',
    requiresKey: 'RYTR_API_KEY',
    costTier: 'low',
  },
  {
    id: 'stable-diffusion',
    label: 'Stable Diffusion',
    supportedTasks: ['image'],
    description: 'High-quality AI image generation',
    requiresKey: 'STABILITY_API_KEY',
    costTier: 'medium',
  },
  {
    id: 'pexels',
    label: 'Pexels',
    supportedTasks: ['image'],
    description: 'Free stock photos (no AI generation)',
    requiresKey: 'PEXELS_API_KEY',
    costTier: 'free',
  },
];

// ─── Model Configurations ─────────────────────────────────────────────────────

export const GEMINI_MODELS: { id: GeminiModel; label: string; bestFor: string; quota: string }[] = [
  { id: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro', bestFor: 'Highest quality, complex reasoning', quota: '~25 req/day (free tier)' },
  { id: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash', bestFor: 'Balanced speed & quality', quota: '~500 req/day (free tier)' },
  { id: 'gemini-2.5-flash-lite', label: 'Gemini 2.5 Flash-Lite', bestFor: 'Fastest, lightweight tasks', quota: '~1500 req/day (free tier)' },
];

export const OPENAI_MODELS: { id: OpenAIModel; label: string; bestFor: string }[] = [
  { id: 'gpt-5.2', label: 'GPT-5.2', bestFor: 'Latest and most capable model' },
  { id: 'gpt-5.1', label: 'GPT-5.1', bestFor: 'Recommended for most use cases' },
  { id: 'gpt-4o', label: 'GPT-4o', bestFor: 'Fast and efficient' },
  { id: 'gpt-4.1', label: 'GPT-4.1', bestFor: 'Cost-effective option' },
];

export const CLAUDE_MODELS: { id: ClaudeModel; label: string; bestFor: string }[] = [
  { id: 'claude-sonnet-4-5-20250929', label: 'Claude Sonnet 4.5', bestFor: 'Balanced performance' },
  { id: 'claude-4-sonnet-20250514', label: 'Claude 4 Sonnet', bestFor: 'Recommended for content' },
  { id: 'claude-haiku-4-5-20251001', label: 'Claude Haiku 4.5', bestFor: 'Fast and cost-effective' },
];

export const STABLE_DIFFUSION_MODELS: { id: StableDiffusionModel; label: string; bestFor: string }[] = [
  { id: 'stable-diffusion-xl', label: 'SDXL', bestFor: 'High-quality detailed images' },
  { id: 'stable-diffusion-3', label: 'SD 3.0', bestFor: 'Latest generation' },
  { id: 'sdxl-turbo', label: 'SDXL Turbo', bestFor: 'Fast generation' },
];

// ─── Valid Provider Lists ─────────────────────────────────────────────────────

const VALID_PROVIDERS: AiProvider[] = AI_PROVIDERS.map(p => p.id);
const VALID_GEMINI_MODELS: GeminiModel[] = GEMINI_MODELS.map(m => m.id);
const VALID_OPENAI_MODELS: OpenAIModel[] = OPENAI_MODELS.map(m => m.id);
const VALID_CLAUDE_MODELS: ClaudeModel[] = CLAUDE_MODELS.map(m => m.id);
const VALID_SD_MODELS: StableDiffusionModel[] = STABLE_DIFFUSION_MODELS.map(m => m.id);

// ─── Database Keys ────────────────────────────────────────────────────────────

const DB_KEYS: Record<AiProviderTask, string> = {
  title: 'ai_provider_title',
  blog: 'ai_provider_blog',
  image: 'ai_provider_image',
};

const MODEL_KEYS = {
  gemini: 'gemini_model',
  openai: 'openai_model',
  claude: 'claude_model',
  stableDiffusion: 'stable_diffusion_model',
};

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_PROVIDERS: Record<AiProviderTask, AiProvider> = {
  title: 'aaddyy',
  blog: 'aaddyy',
  image: 'aaddyy',
};

const DEFAULT_MODELS = {
  gemini: 'gemini-2.5-flash' as GeminiModel,
  openai: 'gpt-5.2' as OpenAIModel,
  claude: 'claude-4-sonnet-20250514' as ClaudeModel,
  stableDiffusion: 'stable-diffusion-xl' as StableDiffusionModel,
};

// ═══════════════════════════════════════════════════════════════════════════════
// PROVIDER MANAGEMENT FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export async function getAiProvider(task: AiProviderTask): Promise<AiProvider> {
  try {
    const row = await prisma.appSetting.findUnique({ where: { key: DB_KEYS[task] } });
    if (row && VALID_PROVIDERS.includes(row.value as AiProvider)) {
      return row.value as AiProvider;
    }
  } catch (err) {
    console.warn(`⚠️ Could not read AI provider for "${task}" from DB, using default:`, err);
  }
  return DEFAULT_PROVIDERS[task];
}

export async function getAllAiProviders(): Promise<Record<AiProviderTask, AiProvider>> {
  const [title, blog, image] = await Promise.all([
    getAiProvider('title'),
    getAiProvider('blog'),
    getAiProvider('image'),
  ]);
  return { title, blog, image };
}

export async function setAiProvider(task: AiProviderTask, provider: AiProvider): Promise<void> {
  if (!VALID_PROVIDERS.includes(provider)) {
    throw new Error(`Provider must be one of: ${VALID_PROVIDERS.join(', ')}`);
  }
  
  // Validate provider supports the task
  const providerInfo = AI_PROVIDERS.find(p => p.id === provider);
  if (providerInfo && !providerInfo.supportedTasks.includes(task)) {
    throw new Error(`Provider "${provider}" does not support task "${task}". Supported tasks: ${providerInfo.supportedTasks.join(', ')}`);
  }
  
  const key = DB_KEYS[task];
  await prisma.appSetting.upsert({
    where: { key },
    create: { key, value: provider },
    update: { value: provider },
  });
  console.log(`✅ AI provider for "${task}" set to: ${provider} (saved to DB)`);
}

export function getProvidersForTask(task: AiProviderTask): ProviderInfo[] {
  return AI_PROVIDERS.filter(p => p.supportedTasks.includes(task));
}

// ═══════════════════════════════════════════════════════════════════════════════
// MODEL MANAGEMENT FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

// Gemini Model
export async function getGeminiModel(): Promise<GeminiModel> {
  try {
    const row = await prisma.appSetting.findUnique({ where: { key: MODEL_KEYS.gemini } });
    if (row && VALID_GEMINI_MODELS.includes(row.value as GeminiModel)) {
      return row.value as GeminiModel;
    }
  } catch (err) {
    console.warn('⚠️ Could not read Gemini model from DB, using default:', err);
  }
  return DEFAULT_MODELS.gemini;
}

export async function setGeminiModel(model: GeminiModel): Promise<void> {
  if (!VALID_GEMINI_MODELS.includes(model)) {
    throw new Error(`Gemini model must be one of: ${VALID_GEMINI_MODELS.join(', ')}`);
  }
  await prisma.appSetting.upsert({
    where: { key: MODEL_KEYS.gemini },
    create: { key: MODEL_KEYS.gemini, value: model },
    update: { value: model },
  });
  console.log(`✅ Gemini model set to: ${model} (saved to DB)`);
}

// OpenAI Model
export async function getOpenAIModel(): Promise<OpenAIModel> {
  try {
    const row = await prisma.appSetting.findUnique({ where: { key: MODEL_KEYS.openai } });
    if (row && VALID_OPENAI_MODELS.includes(row.value as OpenAIModel)) {
      return row.value as OpenAIModel;
    }
  } catch (err) {
    console.warn('⚠️ Could not read OpenAI model from DB, using default:', err);
  }
  return DEFAULT_MODELS.openai;
}

export async function setOpenAIModel(model: OpenAIModel): Promise<void> {
  if (!VALID_OPENAI_MODELS.includes(model)) {
    throw new Error(`OpenAI model must be one of: ${VALID_OPENAI_MODELS.join(', ')}`);
  }
  await prisma.appSetting.upsert({
    where: { key: MODEL_KEYS.openai },
    create: { key: MODEL_KEYS.openai, value: model },
    update: { value: model },
  });
  console.log(`✅ OpenAI model set to: ${model} (saved to DB)`);
}

// Claude Model
export async function getClaudeModel(): Promise<ClaudeModel> {
  try {
    const row = await prisma.appSetting.findUnique({ where: { key: MODEL_KEYS.claude } });
    if (row && VALID_CLAUDE_MODELS.includes(row.value as ClaudeModel)) {
      return row.value as ClaudeModel;
    }
  } catch (err) {
    console.warn('⚠️ Could not read Claude model from DB, using default:', err);
  }
  return DEFAULT_MODELS.claude;
}

export async function setClaudeModel(model: ClaudeModel): Promise<void> {
  if (!VALID_CLAUDE_MODELS.includes(model)) {
    throw new Error(`Claude model must be one of: ${VALID_CLAUDE_MODELS.join(', ')}`);
  }
  await prisma.appSetting.upsert({
    where: { key: MODEL_KEYS.claude },
    create: { key: MODEL_KEYS.claude, value: model },
    update: { value: model },
  });
  console.log(`✅ Claude model set to: ${model} (saved to DB)`);
}

// Stable Diffusion Model
export async function getStableDiffusionModel(): Promise<StableDiffusionModel> {
  try {
    const row = await prisma.appSetting.findUnique({ where: { key: MODEL_KEYS.stableDiffusion } });
    if (row && VALID_SD_MODELS.includes(row.value as StableDiffusionModel)) {
      return row.value as StableDiffusionModel;
    }
  } catch (err) {
    console.warn('⚠️ Could not read Stable Diffusion model from DB, using default:', err);
  }
  return DEFAULT_MODELS.stableDiffusion;
}

export async function setStableDiffusionModel(model: StableDiffusionModel): Promise<void> {
  if (!VALID_SD_MODELS.includes(model)) {
    throw new Error(`Stable Diffusion model must be one of: ${VALID_SD_MODELS.join(', ')}`);
  }
  await prisma.appSetting.upsert({
    where: { key: MODEL_KEYS.stableDiffusion },
    create: { key: MODEL_KEYS.stableDiffusion, value: model },
    update: { value: model },
  });
  console.log(`✅ Stable Diffusion model set to: ${model} (saved to DB)`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// AGGREGATED MODEL INFO
// ═══════════════════════════════════════════════════════════════════════════════

export async function getAllModels() {
  const [gemini, openai, claude, stableDiffusion] = await Promise.all([
    getGeminiModel(),
    getOpenAIModel(),
    getClaudeModel(),
    getStableDiffusionModel(),
  ]);
  
  return {
    gemini: {
      current: gemini,
      models: GEMINI_MODELS,
    },
    openai: {
      current: openai,
      models: OPENAI_MODELS,
    },
    claude: {
      current: claude,
      models: CLAUDE_MODELS,
    },
    stableDiffusion: {
      current: stableDiffusion,
      models: STABLE_DIFFUSION_MODELS,
    },
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROVIDER STATUS CHECK
// ═══════════════════════════════════════════════════════════════════════════════

export function getProviderStatus(): Record<AiProvider, { configured: boolean; keyName: string }> {
  const status: Record<string, { configured: boolean; keyName: string }> = {};
  
  for (const provider of AI_PROVIDERS) {
    const keyValue = process.env[provider.requiresKey];
    status[provider.id] = {
      configured: !!keyValue && keyValue.length > 0,
      keyName: provider.requiresKey,
    };
  }
  
  return status as Record<AiProvider, { configured: boolean; keyName: string }>;
}
