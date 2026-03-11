'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminAPI, type AiProvider } from '@/lib/api';
import { 
  BarChart3, TrendingUp, DollarSign, Zap, Clock, Activity,
  Sparkles, FileText, ImageIcon, Type, ArrowUpRight, ArrowDownRight,
  Loader2, AlertCircle, RefreshCw, Calendar, Filter, Download
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════════
// MOCK DATA - Replace with actual API calls when backend is ready
// ═══════════════════════════════════════════════════════════════════════════════

const MOCK_ANALYTICS = {
  summary: {
    totalRequests: 45892,
    totalCost: 1247.56,
    avgResponseTime: 2.3,
    successRate: 98.7,
    requestsChange: 12.5,
    costChange: -8.2,
  },
  providerStats: [
    { 
      id: 'aaddyy', 
      label: 'Aaddyy AI',
      requests: 18500, 
      cost: 425.30, 
      avgTime: 2.8, 
      successRate: 99.1,
      color: 'rgb(56, 189, 248)',
      trend: 15.2
    },
    { 
      id: 'openai', 
      label: 'OpenAI GPT',
      requests: 12400, 
      cost: 380.20, 
      avgTime: 1.9, 
      successRate: 98.5,
      color: 'rgb(52, 211, 153)',
      trend: 8.7
    },
    { 
      id: 'claude', 
      label: 'Claude',
      requests: 8200, 
      cost: 295.80, 
      avgTime: 2.1, 
      successRate: 99.3,
      color: 'rgb(251, 146, 60)',
      trend: 22.1
    },
    { 
      id: 'gemini', 
      label: 'Gemini',
      requests: 3800, 
      cost: 85.40, 
      avgTime: 1.8, 
      successRate: 97.8,
      color: 'rgb(167, 139, 250)',
      trend: -5.3
    },
    { 
      id: 'deepai', 
      label: 'DeepAI',
      requests: 1800, 
      cost: 32.50, 
      avgTime: 3.2, 
      successRate: 96.5,
      color: 'rgb(244, 114, 182)',
      trend: 3.1
    },
    { 
      id: 'rytr', 
      label: 'Rytr',
      requests: 892, 
      cost: 18.20, 
      avgTime: 2.5, 
      successRate: 97.2,
      color: 'rgb(250, 204, 21)',
      trend: -12.4
    },
    { 
      id: 'stable-diffusion', 
      label: 'Stable Diffusion',
      requests: 200, 
      cost: 8.16, 
      avgTime: 8.5, 
      successRate: 94.5,
      color: 'rgb(239, 68, 68)',
      trend: 45.2
    },
    { 
      id: 'pexels', 
      label: 'Pexels',
      requests: 102, 
      cost: 0, 
      avgTime: 0.8, 
      successRate: 99.8,
      color: 'rgb(34, 197, 94)',
      trend: -8.1
    },
  ],
  taskBreakdown: {
    title: { requests: 15200, percentage: 33.1 },
    blog: { requests: 22450, percentage: 48.9 },
    image: { requests: 8242, percentage: 18.0 },
  },
  dailyUsage: [
    { date: '2026-01-05', requests: 1520, cost: 35.20 },
    { date: '2026-01-06', requests: 1680, cost: 42.50 },
    { date: '2026-01-07', requests: 1420, cost: 38.10 },
    { date: '2026-01-08', requests: 1890, cost: 48.90 },
    { date: '2026-01-09', requests: 2100, cost: 52.30 },
    { date: '2026-01-10', requests: 1950, cost: 45.80 },
    { date: '2026-01-11', requests: 2200, cost: 58.40 },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// SUMMARY STAT CARD
// ═══════════════════════════════════════════════════════════════════════════════

function SummaryStat({
  label,
  value,
  change,
  icon: Icon,
  color,
  format = 'number',
}: {
  label: string;
  value: number;
  change?: number;
  icon: React.ElementType;
  color: string;
  format?: 'number' | 'currency' | 'time' | 'percent';
}) {
  const formatValue = () => {
    switch (format) {
      case 'currency': return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
      case 'time': return `${value}s`;
      case 'percent': return `${value}%`;
      default: return value.toLocaleString();
    }
  };

  return (
    <div className="p-5 rounded-2xl border border-neutral-800 bg-[#0d0d0d] hover:border-neutral-700 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div 
          className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }}
        >
          <Icon size={20} style={{ color }} />
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-medium ${change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {change >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <p className="text-3xl font-bold text-white">{formatValue()}</p>
      <p className="text-sm text-neutral-500 mt-1">{label}</p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROVIDER STATS TABLE
// ═══════════════════════════════════════════════════════════════════════════════

function ProviderStatsTable({ providers }: { providers: typeof MOCK_ANALYTICS.providerStats }) {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-[#0d0d0d] overflow-hidden">
      <div className="px-5 py-4 border-b border-neutral-800">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Sparkles size={16} className="text-[rgb(218,255,1)]" />
          Provider Performance
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-800 bg-neutral-900/30">
              <th className="px-5 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">Provider</th>
              <th className="px-5 py-3 text-right text-xs font-semibold text-neutral-500 uppercase">Requests</th>
              <th className="px-5 py-3 text-right text-xs font-semibold text-neutral-500 uppercase">Cost</th>
              <th className="px-5 py-3 text-right text-xs font-semibold text-neutral-500 uppercase">Avg Time</th>
              <th className="px-5 py-3 text-right text-xs font-semibold text-neutral-500 uppercase">Success</th>
              <th className="px-5 py-3 text-right text-xs font-semibold text-neutral-500 uppercase">Trend</th>
            </tr>
          </thead>
          <tbody>
            {providers.map((provider) => (
              <tr key={provider.id} className="border-b border-neutral-800 last:border-0 hover:bg-[rgb(218,255,1)]/[0.02] transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: provider.color }}
                    />
                    <span className="text-sm font-medium text-white">{provider.label}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-right">
                  <span className="text-sm text-neutral-300">{provider.requests.toLocaleString()}</span>
                </td>
                <td className="px-5 py-4 text-right">
                  <span className="text-sm text-neutral-300">
                    ${provider.cost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <span className="text-sm text-neutral-300">{provider.avgTime}s</span>
                </td>
                <td className="px-5 py-4 text-right">
                  <span className={`text-sm ${provider.successRate >= 98 ? 'text-emerald-400' : provider.successRate >= 95 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {provider.successRate}%
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <div className={`inline-flex items-center gap-1 text-xs font-medium ${provider.trend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {provider.trend >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {Math.abs(provider.trend)}%
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TASK BREAKDOWN CHART
// ═══════════════════════════════════════════════════════════════════════════════

function TaskBreakdownChart({ data }: { data: typeof MOCK_ANALYTICS.taskBreakdown }) {
  const tasks = [
    { key: 'title', label: 'Title Generation', icon: Type, color: 'rgb(56, 189, 248)', ...data.title },
    { key: 'blog', label: 'Blog Content', icon: FileText, color: 'rgb(218, 255, 1)', ...data.blog },
    { key: 'image', label: 'Image Generation', icon: ImageIcon, color: 'rgb(167, 139, 250)', ...data.image },
  ];

  return (
    <div className="rounded-2xl border border-neutral-800 bg-[#0d0d0d] p-5">
      <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-5">
        <Activity size={16} className="text-[rgb(218,255,1)]" />
        Task Breakdown
      </h3>
      
      {/* Bar Chart */}
      <div className="flex h-8 rounded-lg overflow-hidden mb-5">
        {tasks.map((task) => (
          <div 
            key={task.key}
            className="relative group"
            style={{ width: `${task.percentage}%`, backgroundColor: task.color }}
          >
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="space-y-3">
        {tasks.map((task) => (
          <div key={task.key} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${task.color}20` }}
              >
                <task.icon size={14} style={{ color: task.color }} />
              </div>
              <span className="text-sm text-neutral-300">{task.label}</span>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-white">{task.requests.toLocaleString()}</p>
              <p className="text-xs text-neutral-500">{task.percentage}%</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DAILY USAGE CHART
// ═══════════════════════════════════════════════════════════════════════════════

function DailyUsageChart({ data }: { data: typeof MOCK_ANALYTICS.dailyUsage }) {
  const maxRequests = Math.max(...data.map(d => d.requests));

  return (
    <div className="rounded-2xl border border-neutral-800 bg-[#0d0d0d] p-5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <TrendingUp size={16} className="text-[rgb(218,255,1)]" />
          Daily Usage (Last 7 Days)
        </h3>
        <span className="text-xs text-neutral-500">Requests & Cost</span>
      </div>

      {/* Chart */}
      <div className="flex items-end gap-2 h-40 mb-4">
        {data.map((day, i) => {
          const height = (day.requests / maxRequests) * 100;
          const date = new Date(day.date);
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
              <div className="relative w-full flex flex-col items-center">
                {/* Tooltip */}
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <div className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-xs whitespace-nowrap">
                    <p className="text-white font-medium">{day.requests.toLocaleString()} requests</p>
                    <p className="text-neutral-400">${day.cost.toFixed(2)} spent</p>
                  </div>
                </div>
                {/* Bar */}
                <div 
                  className="w-full bg-[rgb(218,255,1)]/20 rounded-t-lg transition-all group-hover:bg-[rgb(218,255,1)]/30"
                  style={{ height: `${height}%`, minHeight: '8px' }}
                >
                  <div 
                    className="w-full h-full bg-gradient-to-t from-[rgb(218,255,1)]/60 to-[rgb(218,255,1)]/20 rounded-t-lg"
                  />
                </div>
              </div>
              <span className="text-[10px] text-neutral-500">
                {date.toLocaleDateString('en-US', { weekday: 'short' })}
              </span>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
        <div>
          <p className="text-xs text-neutral-500">Total Requests</p>
          <p className="text-lg font-semibold text-white">
            {data.reduce((sum, d) => sum + d.requests, 0).toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-neutral-500">Total Cost</p>
          <p className="text-lg font-semibold text-[rgb(218,255,1)]">
            ${data.reduce((sum, d) => sum + d.cost, 0).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// COST BREAKDOWN DONUT
// ═══════════════════════════════════════════════════════════════════════════════

function CostBreakdownChart({ providers }: { providers: typeof MOCK_ANALYTICS.providerStats }) {
  const totalCost = providers.reduce((sum, p) => sum + p.cost, 0);
  const sortedProviders = [...providers].sort((a, b) => b.cost - a.cost).slice(0, 5);

  // Calculate cumulative percentages for the donut chart
  let cumulativePercent = 0;

  return (
    <div className="rounded-2xl border border-neutral-800 bg-[#0d0d0d] p-5">
      <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-5">
        <DollarSign size={16} className="text-[rgb(218,255,1)]" />
        Cost by Provider
      </h3>

      {/* Donut Chart Visualization */}
      <div className="relative w-40 h-40 mx-auto mb-5">
        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
          {sortedProviders.map((provider, i) => {
            const percent = (provider.cost / totalCost) * 100;
            const dashArray = `${percent} ${100 - percent}`;
            const dashOffset = -cumulativePercent;
            cumulativePercent += percent;
            
            return (
              <circle
                key={provider.id}
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke={provider.color}
                strokeWidth="4"
                strokeDasharray={dashArray}
                strokeDashoffset={dashOffset}
                className="transition-all"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-2xl font-bold text-white">${totalCost.toFixed(0)}</p>
          <p className="text-xs text-neutral-500">Total</p>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-2">
        {sortedProviders.map((provider) => (
          <div key={provider.id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div 
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: provider.color }}
              />
              <span className="text-xs text-neutral-400">{provider.label}</span>
            </div>
            <span className="text-xs font-medium text-white">
              ${provider.cost.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export default function ProviderAnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');
  
  // In production, replace with actual API call
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['provider-analytics', timeRange],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return MOCK_ANALYTICS;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-3 py-32">
        <Loader2 className="animate-spin text-[rgb(218,255,1)]" size={24} />
        <span className="text-neutral-500">Loading analytics...</span>
      </div>
    );
  }

  const data = analytics || MOCK_ANALYTICS;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[rgb(218,255,1)]/10 border border-[rgb(218,255,1)]/20 flex items-center justify-center">
            <BarChart3 size={24} className="text-[rgb(218,255,1)]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Provider Analytics</h1>
            <p className="text-sm text-neutral-500">Usage, costs, and performance metrics</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Time Range Selector */}
          <div className="flex items-center p-1 rounded-xl bg-neutral-900/50 border border-neutral-800">
            {(['7d', '30d', '90d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 text-xs font-medium rounded-lg transition-all ${
                  timeRange === range
                    ? 'bg-[rgb(218,255,1)] text-[#0a0a0a]'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
              </button>
            ))}
          </div>

          {/* Export Button */}
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900/50 border border-neutral-800 text-neutral-400 text-sm hover:border-neutral-700 transition-colors">
            <Download size={14} />
            Export
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryStat
          label="Total Requests"
          value={data.summary.totalRequests}
          change={data.summary.requestsChange}
          icon={Zap}
          color="rgb(218, 255, 1)"
        />
        <SummaryStat
          label="Total Cost"
          value={data.summary.totalCost}
          change={data.summary.costChange}
          icon={DollarSign}
          color="rgb(52, 211, 153)"
          format="currency"
        />
        <SummaryStat
          label="Avg Response Time"
          value={data.summary.avgResponseTime}
          icon={Clock}
          color="rgb(56, 189, 248)"
          format="time"
        />
        <SummaryStat
          label="Success Rate"
          value={data.summary.successRate}
          icon={Activity}
          color="rgb(167, 139, 250)"
          format="percent"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Provider Stats Table - Full Width on Mobile */}
        <div className="lg:col-span-2">
          <ProviderStatsTable providers={data.providerStats} />
        </div>

        {/* Task Breakdown */}
        <TaskBreakdownChart data={data.taskBreakdown} />
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Usage Chart */}
        <div className="lg:col-span-2">
          <DailyUsageChart data={data.dailyUsage} />
        </div>

        {/* Cost Breakdown */}
        <CostBreakdownChart providers={data.providerStats} />
      </div>

      {/* Info Notice */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
        <AlertCircle size={18} className="text-blue-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm text-blue-300 font-medium">Analytics Data</p>
          <p className="text-xs text-blue-400/70 mt-1">
            This dashboard displays aggregated usage metrics across all AI providers. 
            Data refreshes every 5 minutes. For real-time monitoring, check individual provider dashboards.
          </p>
        </div>
      </div>
    </div>
  );
}
