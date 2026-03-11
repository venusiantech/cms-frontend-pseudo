'use client';

import { useQuery } from '@tanstack/react-query';
import { adminAPI } from '@/lib/api';
import { 
  Users, Globe, Inbox, Layout, TrendingUp, Clock, HardDrive, 
  ArrowUpRight, Loader2, Sparkles, BarChart3, Zap
} from 'lucide-react';
import Link from 'next/link';

// ═══════════════════════════════════════════════════════════════════════════════
// STAT CARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  href,
  isLoading,
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
  href: string;
  isLoading: boolean;
}) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-2xl border border-neutral-800 bg-[#0d0d0d] p-5 transition-all duration-300 hover:border-[rgb(218,255,1)]/30 hover:-translate-y-1"
    >
      {/* Background Glow */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(300px circle at 80% 20%, ${color}15, transparent 60%)`,
        }}
      />
      
      <div className="relative">
        <div 
          className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
          style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }}
        >
          <Icon size={18} style={{ color }} />
        </div>
        
        <p className="text-3xl font-bold text-white mb-1">
          {isLoading ? (
            <span className="text-neutral-600 animate-pulse">···</span>
          ) : (
            value
          )}
        </p>
        
        <div className="flex items-center justify-between">
          <p className="text-sm text-neutral-500">{label}</p>
          <ArrowUpRight size={14} className="text-neutral-600 group-hover:text-[rgb(218,255,1)] transition-colors" />
        </div>
      </div>
    </Link>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// RECENT LIST COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

function RecentList({
  title,
  icon: Icon,
  href,
  items,
  renderItem,
  isLoading,
}: {
  title: string;
  icon: React.ElementType;
  href: string;
  items: any[];
  renderItem: (item: any) => React.ReactNode;
  isLoading: boolean;
}) {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-[#0d0d0d] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Icon size={16} className="text-[rgb(218,255,1)]" />
          {title}
        </h3>
        <Link href={href} className="text-xs text-[rgb(218,255,1)] hover:underline flex items-center gap-1">
          View all
          <ArrowUpRight size={12} />
        </Link>
      </div>
      
      <div className="divide-y divide-neutral-800">
        {isLoading ? (
          [...Array(5)].map((_, i) => (
            <div key={i} className="px-5 py-3">
              <div className="h-5 bg-neutral-800 rounded animate-pulse" />
            </div>
          ))
        ) : items?.length > 0 ? (
          items.map((item, i) => (
            <div key={i} className="px-5 py-3 hover:bg-neutral-900/50 transition-colors">
              {renderItem(item)}
            </div>
          ))
        ) : (
          <div className="px-5 py-8 text-center text-neutral-500 text-sm">
            No data available
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export default function DashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const res = await adminAPI.getStats();
      return res.data;
    },
  });

  const statCards = [
    { 
      label: 'Total Users', 
      value: stats?.totalUsers ?? 0, 
      icon: Users, 
      color: 'rgb(56, 189, 248)', // sky
      href: '/dashboard/users' 
    },
    { 
      label: 'Total Domains', 
      value: stats?.totalDomains ?? 0, 
      icon: Globe, 
      color: 'rgb(167, 139, 250)', // violet
      href: '/dashboard/domains' 
    },
    { 
      label: 'Total Websites', 
      value: stats?.totalWebsites ?? 0, 
      icon: Layout, 
      color: 'rgb(218, 255, 1)', // neon
      href: '/dashboard/websites' 
    },
    { 
      label: 'Total Leads', 
      value: stats?.totalLeads ?? 0, 
      icon: Inbox, 
      color: 'rgb(251, 146, 60)', // orange
      href: '/dashboard/leads' 
    },
    { 
      label: 'Storage', 
      value: '—', 
      icon: HardDrive, 
      color: 'rgb(244, 114, 182)', // pink
      href: '/dashboard/storage' 
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[rgb(218,255,1)]/10 border border-[rgb(218,255,1)]/20 flex items-center justify-center">
            <BarChart3 size={24} className="text-[rgb(218,255,1)]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
            <p className="text-sm text-neutral-500">Platform statistics at a glance</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[rgb(218,255,1)]/10 border border-[rgb(218,255,1)]/20">
          <Sparkles size={14} className="text-[rgb(218,255,1)]" />
          <span className="text-sm font-medium text-[rgb(218,255,1)]">Live Data</span>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card) => (
          <StatCard
            key={card.label}
            label={card.label}
            value={card.value}
            icon={card.icon}
            color={card.color}
            href={card.href}
            isLoading={isLoading}
          />
        ))}
      </div>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentList
          title="Recent Users"
          icon={Clock}
          href="/dashboard/users"
          items={stats?.recentUsers || []}
          isLoading={isLoading}
          renderItem={(user) => (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[rgb(218,255,1)]/10 flex items-center justify-center">
                  <span className="text-xs font-bold text-[rgb(218,255,1)]">
                    {user.email?.[0]?.toUpperCase()}
                  </span>
                </div>
                <span className="text-sm text-white truncate max-w-[180px]">{user.email}</span>
              </div>
              <span className={`badge text-[10px] ${user.role === 'SUPER_ADMIN' ? 'badge-purple' : 'badge-blue'}`}>
                {user.role === 'SUPER_ADMIN' ? 'Admin' : 'User'}
              </span>
            </div>
          )}
        />

        <RecentList
          title="Recent Domains"
          icon={TrendingUp}
          href="/dashboard/domains"
          items={stats?.recentDomains || []}
          isLoading={isLoading}
          renderItem={(domain) => (
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-violet-500/10 flex items-center justify-center">
                  <Globe size={14} className="text-violet-400" />
                </div>
                <span className="text-sm font-mono text-white truncate">{domain.domainName}</span>
              </div>
              <span className="text-xs text-neutral-500 truncate max-w-[120px]">
                {domain.user?.email}
              </span>
            </div>
          )}
        />
      </div>

      {/* Quick Actions */}
      <div className="rounded-2xl border border-neutral-800 bg-[#0d0d0d] p-6">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Zap size={16} className="text-[rgb(218,255,1)]" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Manage Users', href: '/dashboard/users', icon: Users },
            { label: 'View Websites', href: '/dashboard/websites', icon: Layout },
            { label: 'AI Providers', href: '/dashboard/ai-provider', icon: Sparkles },
            { label: 'Storage', href: '/dashboard/storage', icon: HardDrive },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="flex items-center gap-3 p-4 rounded-xl border border-neutral-800 bg-neutral-900/30 hover:border-[rgb(218,255,1)]/30 hover:bg-neutral-900/50 transition-all"
            >
              <action.icon size={18} className="text-neutral-500" />
              <span className="text-sm font-medium text-white">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
