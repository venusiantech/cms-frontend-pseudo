import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../../middleware/validation.middleware';
import { asyncHandler } from '../../middleware/error.middleware';
import {
  getAllAiProviders,
  setAiProvider,
  getGeminiModel,
  setGeminiModel,
  getOpenAIModel,
  setOpenAIModel,
  getClaudeModel,
  setClaudeModel,
  getStableDiffusionModel,
  setStableDiffusionModel,
  getAllModels,
  getProviderStatus,
  getProvidersForTask,
  AI_PROVIDERS,
  GEMINI_MODELS,
  OPENAI_MODELS,
  CLAUDE_MODELS,
  STABLE_DIFFUSION_MODELS,
  type AiProviderTask,
  type AiProvider,
  type GeminiModel,
  type OpenAIModel,
  type ClaudeModel,
  type StableDiffusionModel,
} from '../../ai-service/ai-provider.config';

const router = Router();

// ═══════════════════════════════════════════════════════════════════════════════
// PROVIDER MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * GET /admin/ai-provider
 * Returns current AI provider for each task and all available providers
 */
router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const [providers, models, status] = await Promise.all([
      getAllAiProviders(),
      getAllModels(),
      Promise.resolve(getProviderStatus()),
    ]);
    
    res.json({
      current: providers,
      models,
      status,
      availableProviders: AI_PROVIDERS,
    });
  })
);

/**
 * GET /admin/ai-provider/status
 * Returns configuration status of all providers (which have API keys set)
 */
router.get(
  '/status',
  asyncHandler(async (_req, res) => {
    res.json(getProviderStatus());
  })
);

/**
 * GET /admin/ai-provider/for-task/:task
 * Returns providers available for a specific task
 */
router.get(
  '/for-task/:task',
  asyncHandler(async (req, res) => {
    const task = req.params.task as AiProviderTask;
    if (!['title', 'blog', 'image'].includes(task)) {
      return res.status(400).json({ error: 'Task must be one of: title, blog, image' });
    }
    res.json(getProvidersForTask(task));
  })
);

/**
 * PUT /admin/ai-provider
 * Set AI provider for a specific task
 * Body: { task: 'title' | 'blog' | 'image', provider: AiProvider }
 */
router.put(
  '/',
  validate([
    body('task')
      .isIn(['title', 'blog', 'image'])
      .withMessage('task must be one of: title, blog, image'),
    body('provider')
      .isIn(AI_PROVIDERS.map(p => p.id))
      .withMessage(`provider must be one of: ${AI_PROVIDERS.map(p => p.id).join(', ')}`),
  ]),
  asyncHandler(async (req, res) => {
    const { task, provider } = req.body as { task: AiProviderTask; provider: AiProvider };
    await setAiProvider(task, provider);
    
    const [providers, status] = await Promise.all([
      getAllAiProviders(),
      Promise.resolve(getProviderStatus()),
    ]);
    
    res.json({ current: providers, status });
  })
);

// ═══════════════════════════════════════════════════════════════════════════════
// MODEL MANAGEMENT - GEMINI
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * GET /admin/ai-provider/gemini-model
 * Returns current Gemini model and available models
 */
router.get(
  '/gemini-model',
  asyncHandler(async (_req, res) => {
    res.json({ current: await getGeminiModel(), models: GEMINI_MODELS });
  })
);

/**
 * PUT /admin/ai-provider/gemini-model
 * Set Gemini model
 */
router.put(
  '/gemini-model',
  validate([
    body('model')
      .isIn(GEMINI_MODELS.map(m => m.id))
      .withMessage(`model must be one of: ${GEMINI_MODELS.map(m => m.id).join(', ')}`),
  ]),
  asyncHandler(async (req, res) => {
    const { model } = req.body as { model: GeminiModel };
    await setGeminiModel(model);
    res.json({ current: await getGeminiModel(), models: GEMINI_MODELS });
  })
);

// ═══════════════════════════════════════════════════════════════════════════════
// MODEL MANAGEMENT - OPENAI
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * GET /admin/ai-provider/openai-model
 * Returns current OpenAI model and available models
 */
router.get(
  '/openai-model',
  asyncHandler(async (_req, res) => {
    res.json({ current: await getOpenAIModel(), models: OPENAI_MODELS });
  })
);

/**
 * PUT /admin/ai-provider/openai-model
 * Set OpenAI model
 */
router.put(
  '/openai-model',
  validate([
    body('model')
      .isIn(OPENAI_MODELS.map(m => m.id))
      .withMessage(`model must be one of: ${OPENAI_MODELS.map(m => m.id).join(', ')}`),
  ]),
  asyncHandler(async (req, res) => {
    const { model } = req.body as { model: OpenAIModel };
    await setOpenAIModel(model);
    res.json({ current: await getOpenAIModel(), models: OPENAI_MODELS });
  })
);

// ═══════════════════════════════════════════════════════════════════════════════
// MODEL MANAGEMENT - CLAUDE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * GET /admin/ai-provider/claude-model
 * Returns current Claude model and available models
 */
router.get(
  '/claude-model',
  asyncHandler(async (_req, res) => {
    res.json({ current: await getClaudeModel(), models: CLAUDE_MODELS });
  })
);

/**
 * PUT /admin/ai-provider/claude-model
 * Set Claude model
 */
router.put(
  '/claude-model',
  validate([
    body('model')
      .isIn(CLAUDE_MODELS.map(m => m.id))
      .withMessage(`model must be one of: ${CLAUDE_MODELS.map(m => m.id).join(', ')}`),
  ]),
  asyncHandler(async (req, res) => {
    const { model } = req.body as { model: ClaudeModel };
    await setClaudeModel(model);
    res.json({ current: await getClaudeModel(), models: CLAUDE_MODELS });
  })
);

// ═══════════════════════════════════════════════════════════════════════════════
// MODEL MANAGEMENT - STABLE DIFFUSION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * GET /admin/ai-provider/stable-diffusion-model
 * Returns current Stable Diffusion model and available models
 */
router.get(
  '/stable-diffusion-model',
  asyncHandler(async (_req, res) => {
    res.json({ current: await getStableDiffusionModel(), models: STABLE_DIFFUSION_MODELS });
  })
);

/**
 * PUT /admin/ai-provider/stable-diffusion-model
 * Set Stable Diffusion model
 */
router.put(
  '/stable-diffusion-model',
  validate([
    body('model')
      .isIn(STABLE_DIFFUSION_MODELS.map(m => m.id))
      .withMessage(`model must be one of: ${STABLE_DIFFUSION_MODELS.map(m => m.id).join(', ')}`),
  ]),
  asyncHandler(async (req, res) => {
    const { model } = req.body as { model: StableDiffusionModel };
    await setStableDiffusionModel(model);
    res.json({ current: await getStableDiffusionModel(), models: STABLE_DIFFUSION_MODELS });
  })
);

// ═══════════════════════════════════════════════════════════════════════════════
// ALL MODELS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * GET /admin/ai-provider/models
 * Returns all models for all providers
 */
router.get(
  '/models',
  asyncHandler(async (_req, res) => {
    res.json(await getAllModels());
  })
);

export default router;
