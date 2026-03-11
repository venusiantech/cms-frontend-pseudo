import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('admin_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ═══════════════════════════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════════

export type AiProvider = 
  | 'aaddyy' 
  | 'gemini' 
  | 'pexels' 
  | 'openai' 
  | 'claude' 
  | 'deepai' 
  | 'rytr' 
  | 'stable-diffusion';

export type AiProviderTask = 'title' | 'blog' | 'image';

export interface ProviderInfo {
  id: AiProvider;
  label: string;
  supportedTasks: AiProviderTask[];
  description: string;
  requiresKey: string;
  costTier: 'free' | 'low' | 'medium' | 'high';
}

export interface ModelOption {
  id: string;
  label: string;
  bestFor: string;
  quota?: string;
}

export interface AllModelsResponse {
  gemini: { current: string; models: ModelOption[] };
  openai: { current: string; models: ModelOption[] };
  claude: { current: string; models: ModelOption[] };
  stableDiffusion: { current: string; models: ModelOption[] };
}

export interface ProviderStatusResponse {
  [key: string]: { configured: boolean; keyName: string };
}

export interface AiProviderResponse {
  current: Record<AiProviderTask, AiProvider>;
  models: AllModelsResponse;
  status: ProviderStatusResponse;
  availableProviders: ProviderInfo[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN API
// ═══════════════════════════════════════════════════════════════════════════════

export const adminAPI = {
  // ── Auth ──────────────────────────────────────────────────────────────────
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  // ── Stats ─────────────────────────────────────────────────────────────────
  getStats: () => api.get('/admin/stats'),

  // ── Users ─────────────────────────────────────────────────────────────────
  getAllUsers: () => api.get('/admin/users'),
  updateUserRole: (userId: string, role: 'USER' | 'SUPER_ADMIN') =>
    api.patch(`/admin/users/${userId}/role`, { role }),
  deleteUser: (userId: string) => api.delete(`/admin/users/${userId}`),

  // ── AI Prompts ────────────────────────────────────────────────────────────
  getAllPrompts: (templateKey?: string) =>
    api.get('/admin/ai-prompts', { params: templateKey ? { templateKey } : {} }),
  createPrompt: (data: {
    promptKey: string;
    promptText: string;
    promptType: 'TEXT' | 'IMAGE';
    templateKey: string;
  }) => api.post('/admin/ai-prompts', data),
  updatePrompt: (id: string, data: { promptText?: string; promptType?: 'TEXT' | 'IMAGE' }) =>
    api.put(`/admin/ai-prompts/${id}`, data),
  deletePrompt: (id: string) => api.delete(`/admin/ai-prompts/${id}`),

  // ── Websites ──────────────────────────────────────────────────────────────
  getAllWebsites: () => api.get('/admin/websites'),
  getWebsite: (id: string) => api.get(`/admin/websites/${id}`),
  updateWebsiteSettings: (id: string, data: Record<string, any>) =>
    api.put(`/admin/websites/${id}/settings`, data),
  approveAds: (id: string, approved: boolean) =>
    api.put(`/admin/websites/${id}/approve-ads`, { approved }),

  // ── Domains ───────────────────────────────────────────────────────────────
  getAllDomains: () => api.get('/admin/domains'),
  getDomain: (id: string) => api.get(`/admin/domains/${id}`),
  deleteDomain: (id: string) => api.delete(`/admin/domains/${id}`),

  // ── Leads ─────────────────────────────────────────────────────────────────
  getAllLeads: () => api.get('/admin/leads'),
  deleteLead: (id: string) => api.delete(`/admin/leads/${id}`),

  // ── Storage ───────────────────────────────────────────────────────────────
  getStorageOverview: () => api.get('/admin/storage'),
  getWebsiteStorage: (websiteId: string) => api.get(`/admin/storage/${websiteId}`),
  deleteBlogSection: (sectionId: string) => api.delete(`/admin/storage/section/${sectionId}`),
  deleteBlock: (blockId: string) => api.delete(`/admin/storage/block/${blockId}`),
  deleteAllWebsiteContent: (websiteId: string) => api.delete(`/admin/storage/${websiteId}/all-content`),

  // ── Storage Provider ─────────────────────────────────────────────────────
  getStorageProvider: () => api.get<{ provider: 'railway' | 'cloudinary' }>('/admin/storage-provider'),
  setStorageProvider: (provider: 'railway' | 'cloudinary') =>
    api.put<{ provider: 'railway' | 'cloudinary' }>('/admin/storage-provider', { provider }),

  // ═══════════════════════════════════════════════════════════════════════════
  // AI PROVIDER API - Extended for all providers
  // ═══════════════════════════════════════════════════════════════════════════

  // Get all AI provider settings, models, and status
  getAiProviders: () => api.get<AiProviderResponse>('/admin/ai-provider'),

  // Get provider status (which have API keys configured)
  getAiProviderStatus: () => api.get<ProviderStatusResponse>('/admin/ai-provider/status'),

  // Get providers available for a specific task
  getProvidersForTask: (task: AiProviderTask) => 
    api.get<ProviderInfo[]>(`/admin/ai-provider/for-task/${task}`),

  // Set AI provider for a specific task
  setAiProvider: (task: AiProviderTask, provider: AiProvider) =>
    api.put('/admin/ai-provider', { task, provider }),

  // ── Gemini Model ──────────────────────────────────────────────────────────
  getGeminiModel: () =>
    api.get<{ current: string; models: ModelOption[] }>('/admin/ai-provider/gemini-model'),
  setGeminiModel: (model: string) =>
    api.put<{ current: string; models: ModelOption[] }>('/admin/ai-provider/gemini-model', { model }),

  // ── OpenAI Model ──────────────────────────────────────────────────────────
  getOpenAIModel: () =>
    api.get<{ current: string; models: ModelOption[] }>('/admin/ai-provider/openai-model'),
  setOpenAIModel: (model: string) =>
    api.put<{ current: string; models: ModelOption[] }>('/admin/ai-provider/openai-model', { model }),

  // ── Claude Model ──────────────────────────────────────────────────────────
  getClaudeModel: () =>
    api.get<{ current: string; models: ModelOption[] }>('/admin/ai-provider/claude-model'),
  setClaudeModel: (model: string) =>
    api.put<{ current: string; models: ModelOption[] }>('/admin/ai-provider/claude-model', { model }),

  // ── Stable Diffusion Model ────────────────────────────────────────────────
  getStableDiffusionModel: () =>
    api.get<{ current: string; models: ModelOption[] }>('/admin/ai-provider/stable-diffusion-model'),
  setStableDiffusionModel: (model: string) =>
    api.put<{ current: string; models: ModelOption[] }>('/admin/ai-provider/stable-diffusion-model', { model }),

  // ── All Models ────────────────────────────────────────────────────────────
  getAllModels: () => api.get<AllModelsResponse>('/admin/ai-provider/models'),
};

// ═══════════════════════════════════════════════════════════════════════════════
// BILLING API
// ═══════════════════════════════════════════════════════════════════════════════

export interface PlanPayload {
  name: string;
  price: number;
  creditsPerMonth: number;
  maxWebsites: number;
  isCustom?: boolean;
  stripePriceId?: string;
}

export const billingAPI = {
  getPlans: () => api.get('/admin/billing/plans'),
  createPlan: (data: PlanPayload) => api.post('/admin/billing/plans', data),
  updatePlan: (id: string, data: Partial<PlanPayload>) => api.put(`/admin/billing/plans/${id}`, data),
  deactivatePlan: (id: string) => api.delete(`/admin/billing/plans/${id}`),
  getUserSubscription: (userId: string) => api.get(`/admin/billing/users/${userId}/subscription`),
  assignSubscription: (userId: string, planId: string, amountUsd?: number) =>
    api.post(`/admin/billing/users/${userId}/subscription`, { planId, amountUsd }),
  getCustomPlanRequests: () => api.get('/admin/billing/custom-plan-requests'),
  updateCustomPlanRequest: (id: string, data: { status?: string; adminNote?: string }) =>
    api.patch(`/admin/billing/custom-plan-requests/${id}`, data),
  assignAdHocCustomPlan: (
    userId: string,
    data: { amountUsd: number; creditsPerMonth: number; maxWebsites: number; label?: string },
  ) => api.post(`/admin/billing/users/${userId}/custom-plan`, data),
};
