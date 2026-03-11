'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI, type AiProvider, type AiProviderTask, type ProviderInfo, type ModelOption } from '@/lib/api';
import { 
  Bot, Type, FileText, ImageIcon, Check, Loader2, Cpu, 
  Sparkles, Zap, Cloud, DollarSign, Shield, AlertCircle,
  ChevronDown, Settings
} from 'lucide-react';
import toast from 'react-hot-toast';

// ═══════════════════════════════════════════════════════════════════════════════
// PROVIDER METADATA (UI Display)
// ═══════════════════════════════════════════════════════════════════════════════

interface ProviderMeta {
  label: string;
  tagline: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

const PROVIDER_META: Record<AiProvider, ProviderMeta> = {
  aaddyy: {
    label: 'Aaddyy AI',
    tagline: 'Full-featured AI with research',
    color: 'rgb(56, 189, 248)', // sky-400
    bgColor: 'rgba(56, 189, 248, 0.1)',
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  gemini: {
    label: 'Google Gemini',
    tagline: 'Advanced AI content generation',
    color: 'rgb(167, 139, 250)', // violet-400
    bgColor: 'rgba(167, 139, 250, 0.1)',
    borderColor: 'rgba(167, 139, 250, 0.3)',
  },
  openai: {
    label: 'OpenAI GPT',
    tagline: 'Industry-leading GPT models',
    color: 'rgb(52, 211, 153)', // emerald-400
    bgColor: 'rgba(52, 211, 153, 0.1)',
    borderColor: 'rgba(52, 211, 153, 0.3)',
  },
  claude: {
    label: 'Anthropic Claude',
    tagline: 'Advanced reasoning AI',
    color: 'rgb(251, 146, 60)', // orange-400
    bgColor: 'rgba(251, 146, 60, 0.1)',
    borderColor: 'rgba(251, 146, 60, 0.3)',
  },
  deepai: {
    label: 'DeepAI',
    tagline: 'Cost-effective AI solution',
    color: 'rgb(244, 114, 182)', // pink-400
    bgColor: 'rgba(244, 114, 182, 0.1)',
    borderColor: 'rgba(244, 114, 182, 0.3)',
  },
  rytr: {
    label: 'Rytr',
    tagline: 'AI copywriting assistant',
    color: 'rgb(250, 204, 21)', // yellow-400
    bgColor: 'rgba(250, 204, 21, 0.1)',
    borderColor: 'rgba(250, 204, 21, 0.3)',
  },
  'stable-diffusion': {
    label: 'Stable Diffusion',
    tagline: 'High-quality AI images',
    color: 'rgb(239, 68, 68)', // red-400
    bgColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  pexels: {
    label: 'Pexels',
    tagline: 'Free stock photography',
    color: 'rgb(34, 197, 94)', // green-400
    bgColor: 'rgba(34, 197, 94, 0.1)',
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
};

const TASK_INFO: Record<AiProviderTask, { label: string; description: string; icon: React.ReactNode }> = {
  title: {
    label: 'Title Generation',
    description: 'Generates SEO-optimized article titles',
    icon: <Type size={16} />,
  },
  blog: {
    label: 'Blog Content',
    description: 'Creates full markdown blog posts',
    icon: <FileText size={16} />,
  },
  image: {
    label: 'Image Generation',
    description: 'Creates featured images for content',
    icon: <ImageIcon size={16} />,
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// PROVIDER CARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

function ProviderCard({
  provider,
  isActive,
  isConfigured,
  isSaving,
  onSelect,
}: {
  provider: AiProvider;
  isActive: boolean;
  isConfigured: boolean;
  isSaving: boolean;
  onSelect: () => void;
}) {
  const meta = PROVIDER_META[provider];
  
  return (
    <button
      type="button"
      disabled={isSaving}
      onClick={onSelect}
      className={`
        w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-200
        ${isActive 
          ? 'bg-[rgb(218,255,1)]/5 border-[rgb(218,255,1)]/30' 
          : 'bg-neutral-900/30 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/50'
        }
        ${!isConfigured ? 'opacity-50' : ''}
        ${isSaving ? 'cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      {/* Provider Icon */}
      <div 
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: meta.bgColor, border: `1px solid ${meta.borderColor}` }}
      >
        <Sparkles size={20} style={{ color: meta.color }} />
      </div>

      {/* Provider Info */}
      <div className="flex-1 text-left min-w-0">
        <div className="flex items-center gap-2">
          <p className={`text-sm font-semibold ${isActive ? 'text-[rgb(218,255,1)]' : 'text-white'}`}>
            {meta.label}
          </p>
          {!isConfigured && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
              No API Key
            </span>
          )}
        </div>
        <p className="text-xs text-neutral-500 mt-0.5">{meta.tagline}</p>
      </div>

      {/* Selection Indicator */}
      <div className={`
        w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all
        ${isActive ? 'bg-[rgb(218,255,1)]' : 'border-2 border-neutral-700'}
      `}>
        {isSaving ? (
          <Loader2 size={10} className="animate-spin text-[#0a0a0a]" />
        ) : isActive ? (
          <Check size={10} strokeWidth={3} className="text-[#0a0a0a]" />
        ) : null}
      </div>
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MODEL SELECTOR COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

function ModelSelector({
  provider,
  currentModel,
  models,
  onSelect,
  isSaving,
}: {
  provider: string;
  currentModel: string;
  models: ModelOption[];
  onSelect: (model: string) => void;
  isSaving: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const meta = PROVIDER_META[provider as AiProvider];

  return (
    <div className="mt-3 pt-3 border-t border-neutral-800">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 rounded-lg bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Cpu size={14} style={{ color: meta?.color }} />
          <span className="text-xs font-medium text-neutral-300">Model: {currentModel}</span>
        </div>
        <ChevronDown size={14} className={`text-neutral-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="mt-2 space-y-1.5">
          {models.map((m) => {
            const isActive = currentModel === m.id;
            return (
              <button
                key={m.id}
                type="button"
                disabled={isSaving}
                onClick={() => { onSelect(m.id); setIsOpen(false); }}
                className={`
                  w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all
                  ${isActive
                    ? 'bg-[rgb(218,255,1)]/5 border-[rgb(218,255,1)]/30'
                    : 'bg-neutral-900/30 border-neutral-800 hover:border-neutral-700'
                  }
                  ${isSaving ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
                `}
              >
                <div className={`
                  w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0
                  ${isActive ? 'bg-[rgb(218,255,1)]' : 'border-2 border-neutral-700'}
                `}>
                  {isActive && <Check size={8} strokeWidth={3} className="text-[#0a0a0a]" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium ${isActive ? 'text-[rgb(218,255,1)]' : 'text-white'}`}>
                    {m.label}
                  </p>
                  <p className="text-[10px] text-neutral-500 mt-0.5">{m.bestFor}</p>
                </div>
                {m.quota && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-800 text-neutral-400">
                    {m.quota}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TASK CARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

function TaskCard({
  task,
  currentProvider,
  availableProviders,
  providerStatus,
  models,
  isSaving,
  onSelectProvider,
  onSelectModel,
  modelSaving,
}: {
  task: AiProviderTask;
  currentProvider: AiProvider;
  availableProviders: ProviderInfo[];
  providerStatus: Record<string, { configured: boolean; keyName: string }>;
  models: {
    gemini?: { current: string; models: ModelOption[] };
    openai?: { current: string; models: ModelOption[] };
    claude?: { current: string; models: ModelOption[] };
    stableDiffusion?: { current: string; models: ModelOption[] };
  };
  isSaving: boolean;
  onSelectProvider: (provider: AiProvider) => void;
  onSelectModel: (provider: string, model: string) => void;
  modelSaving: string | null;
}) {
  const taskInfo = TASK_INFO[task];
  const currentMeta = PROVIDER_META[currentProvider];

  // Filter providers that support this task
  const taskProviders = availableProviders.filter(p => p.supportedTasks.includes(task));

  return (
    <div className="rounded-2xl border border-neutral-800 bg-[#0d0d0d] overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-neutral-800 bg-neutral-900/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[rgb(218,255,1)]/10 border border-[rgb(218,255,1)]/20 flex items-center justify-center text-[rgb(218,255,1)]">
            {taskInfo.icon}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">{taskInfo.label}</p>
            <p className="text-xs text-neutral-500">{taskInfo.description}</p>
          </div>
          <span 
            className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
            style={{ 
              backgroundColor: currentMeta.bgColor, 
              color: currentMeta.color,
              border: `1px solid ${currentMeta.borderColor}`
            }}
          >
            {currentMeta.label}
          </span>
        </div>
      </div>

      {/* Provider List */}
      <div className="p-4 space-y-2">
        {taskProviders.map((providerInfo) => {
          const isActive = currentProvider === providerInfo.id;
          const isConfigured = providerStatus[providerInfo.id]?.configured ?? false;
          
          return (
            <div key={providerInfo.id}>
              <ProviderCard
                provider={providerInfo.id}
                isActive={isActive}
                isConfigured={isConfigured}
                isSaving={isSaving}
                onSelect={() => onSelectProvider(providerInfo.id)}
              />
              
              {/* Model Selector - Show when provider is active */}
              {isActive && providerInfo.id === 'gemini' && models.gemini && (
                <ModelSelector
                  provider="gemini"
                  currentModel={models.gemini.current}
                  models={models.gemini.models}
                  onSelect={(model) => onSelectModel('gemini', model)}
                  isSaving={modelSaving === 'gemini'}
                />
              )}
              {isActive && providerInfo.id === 'openai' && models.openai && (
                <ModelSelector
                  provider="openai"
                  currentModel={models.openai.current}
                  models={models.openai.models}
                  onSelect={(model) => onSelectModel('openai', model)}
                  isSaving={modelSaving === 'openai'}
                />
              )}
              {isActive && providerInfo.id === 'claude' && models.claude && (
                <ModelSelector
                  provider="claude"
                  currentModel={models.claude.current}
                  models={models.claude.models}
                  onSelect={(model) => onSelectModel('claude', model)}
                  isSaving={modelSaving === 'claude'}
                />
              )}
              {isActive && providerInfo.id === 'stable-diffusion' && models.stableDiffusion && (
                <ModelSelector
                  provider="stable-diffusion"
                  currentModel={models.stableDiffusion.current}
                  models={models.stableDiffusion.models}
                  onSelect={(model) => onSelectModel('stableDiffusion', model)}
                  isSaving={modelSaving === 'stableDiffusion'}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function AiProviderPage() {
  const queryClient = useQueryClient();
  const [savingTask, setSavingTask] = useState<AiProviderTask | null>(null);
  const [savingModel, setSavingModel] = useState<string | null>(null);

  // Fetch all AI provider data
  const { data, isLoading, error } = useQuery({
    queryKey: ['ai-providers-full'],
    queryFn: () => adminAPI.getAiProviders().then((r) => r.data),
  });

  // Provider mutation
  const providerMutation = useMutation({
    mutationFn: ({ task, provider }: { task: AiProviderTask; provider: AiProvider }) =>
      adminAPI.setAiProvider(task, provider),
    onMutate: ({ task }) => setSavingTask(task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-providers-full'] });
      toast.success('Provider updated');
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to update provider'),
    onSettled: () => setSavingTask(null),
  });

  // Model mutations
  const geminiModelMutation = useMutation({
    mutationFn: (model: string) => adminAPI.setGeminiModel(model),
    onMutate: () => setSavingModel('gemini'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-providers-full'] });
      toast.success('Gemini model updated');
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to update model'),
    onSettled: () => setSavingModel(null),
  });

  const openaiModelMutation = useMutation({
    mutationFn: (model: string) => adminAPI.setOpenAIModel(model),
    onMutate: () => setSavingModel('openai'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-providers-full'] });
      toast.success('OpenAI model updated');
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to update model'),
    onSettled: () => setSavingModel(null),
  });

  const claudeModelMutation = useMutation({
    mutationFn: (model: string) => adminAPI.setClaudeModel(model),
    onMutate: () => setSavingModel('claude'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-providers-full'] });
      toast.success('Claude model updated');
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to update model'),
    onSettled: () => setSavingModel(null),
  });

  const sdModelMutation = useMutation({
    mutationFn: (model: string) => adminAPI.setStableDiffusionModel(model),
    onMutate: () => setSavingModel('stableDiffusion'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-providers-full'] });
      toast.success('Stable Diffusion model updated');
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to update model'),
    onSettled: () => setSavingModel(null),
  });

  const handleProviderChange = (task: AiProviderTask, provider: AiProvider) => {
    if (data?.current[task] === provider) return;
    providerMutation.mutate({ task, provider });
  };

  const handleModelChange = (provider: string, model: string) => {
    switch (provider) {
      case 'gemini': geminiModelMutation.mutate(model); break;
      case 'openai': openaiModelMutation.mutate(model); break;
      case 'claude': claudeModelMutation.mutate(model); break;
      case 'stableDiffusion': sdModelMutation.mutate(model); break;
    }
  };

  if (error) {
    return (
      <div className="flex items-center gap-3 p-6 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
        <AlertCircle size={20} />
        <p>Failed to load AI providers. Please check backend connection.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-[rgb(218,255,1)]/10 border border-[rgb(218,255,1)]/20 flex items-center justify-center">
          <Bot size={24} className="text-[rgb(218,255,1)]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">AI Providers</h1>
          <p className="text-sm text-neutral-500">
            Configure which AI service powers each generation task
          </p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5">
        <div className="flex items-start gap-3">
          <Settings size={18} className="text-neutral-500 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-white mb-2">Required Environment Variables</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
              {[
                { provider: 'Aaddyy', key: 'AADDYY_API_KEY', color: 'text-sky-400' },
                { provider: 'Gemini', key: 'GEMINI_API_KEY', color: 'text-violet-400' },
                { provider: 'OpenAI/Claude', key: 'EMERGENT_LLM_KEY', color: 'text-emerald-400' },
                { provider: 'DeepAI', key: 'DEEPAI_API_KEY', color: 'text-pink-400' },
                { provider: 'Rytr', key: 'RYTR_API_KEY', color: 'text-yellow-400' },
                { provider: 'Stable Diffusion', key: 'STABILITY_API_KEY', color: 'text-red-400' },
                { provider: 'Pexels', key: 'PEXELS_API_KEY', color: 'text-green-400' },
              ].map(({ provider, key, color }) => (
                <span key={key}>
                  <span className={`font-medium ${color}`}>{provider}</span>
                  <span className="text-neutral-500"> → </span>
                  <code className="bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-400">{key}</code>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center gap-3 py-20 text-neutral-500">
          <Loader2 size={20} className="animate-spin" />
          <span>Loading providers...</span>
        </div>
      ) : (
        /* Task Cards Grid */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {(['title', 'blog', 'image'] as AiProviderTask[]).map((task) => (
            <TaskCard
              key={task}
              task={task}
              currentProvider={data?.current[task] ?? 'aaddyy'}
              availableProviders={data?.availableProviders ?? []}
              providerStatus={data?.status ?? {}}
              models={data?.models}
              isSaving={savingTask === task}
              onSelectProvider={(provider) => handleProviderChange(task, provider)}
              onSelectModel={handleModelChange}
              modelSaving={savingModel}
            />
          ))}
        </div>
      )}

      {/* Provider Status Grid */}
      {data?.status && (
        <div className="rounded-xl border border-neutral-800 bg-[#0d0d0d] p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Shield size={16} className="text-[rgb(218,255,1)]" />
            Provider Configuration Status
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(data.status).map(([provider, status]) => {
              const meta = PROVIDER_META[provider as AiProvider];
              return (
                <div
                  key={provider}
                  className={`
                    p-3 rounded-lg border
                    ${status.configured 
                      ? 'bg-emerald-500/5 border-emerald-500/20' 
                      : 'bg-neutral-900/30 border-neutral-800'
                    }
                  `}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-2 h-2 rounded-full ${status.configured ? 'bg-emerald-400' : 'bg-neutral-600'}`} />
                    <span className="text-xs font-medium text-white">{meta?.label || provider}</span>
                  </div>
                  <p className="text-[10px] text-neutral-500">
                    {status.configured ? 'Configured' : 'Not configured'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
