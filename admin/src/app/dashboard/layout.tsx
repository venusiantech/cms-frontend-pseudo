'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import {
  LogOut,
  BarChart3,
  Users,
  Layout,
  Globe,
  Inbox,
  HardDrive,
  Bot,
  ChevronRight,
  ChevronDown,
  CreditCard,
  Sparkles,
  Settings,
  FileText,
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════════
// NAVIGATION CONFIG
// ═══════════════════════════════════════════════════════════════════════════════

const navLinks: { href: string; label: string; icon: LucideIcon }[] = [
  { href: '/dashboard',           label: 'Overview',     icon: BarChart3 },
  { href: '/dashboard/users',     label: 'Users',        icon: Users     },
  { href: '/dashboard/websites',  label: 'Websites',     icon: Layout    },
  { href: '/dashboard/domains',   label: 'Domains',      icon: Globe     },
  { href: '/dashboard/leads',     label: 'Leads',        icon: Inbox     },
  { href: '/dashboard/ai-provider', label: 'AI Providers', icon: Bot     },
  { href: '/dashboard/prompts',   label: 'AI Prompts',   icon: FileText  },
];

const storageDropdown = {
  label: 'Storage',
  icon: HardDrive,
  children: [
    { href: '/dashboard/storage/provider', label: 'Provider' },
    { href: '/dashboard/storage', label: 'Websites Storage' },
  ],
};

const subscriptionsDropdown = {
  label: 'Subscriptions',
  icon: CreditCard,
  children: [
    { href: '/dashboard/subscriptions/plans', label: 'Plans' },
    { href: '/dashboard/subscriptions/assign', label: 'Assign' },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// NAV DROPDOWN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

function NavDropdown({
  config,
  pathname,
  basePrefix,
}: {
  config: { label: string; icon: LucideIcon; children: { href: string; label: string }[] };
  pathname: string;
  basePrefix: string;
}) {
  const isActive = pathname.startsWith(basePrefix);
  const [open, setOpen] = useState(isActive);
  const isOpen = open || isActive;
  const Icon = config.icon;

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`
          w-full group flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium
          transition-all duration-200
          ${isActive
            ? 'bg-[rgb(218,255,1)]/10 text-[rgb(218,255,1)] border border-[rgb(218,255,1)]/20'
            : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-white border border-transparent'
          }
        `}
      >
        <span className="flex items-center gap-3">
          <Icon size={18} className={isActive ? 'text-[rgb(218,255,1)]' : 'text-neutral-500 group-hover:text-[rgb(218,255,1)]'} />
          {config.label}
        </span>
        <ChevronDown
          size={14}
          className={`text-neutral-500 transition-transform duration-200 ${isOpen ? 'rotate-0' : '-rotate-90'}`}
        />
      </button>
      
      {isOpen && (
        <div className="pl-4 ml-5 border-l border-neutral-800 space-y-1">
          {config.children.map(({ href, label }) => {
            const isChildActive = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                className={`
                  flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200
                  ${isChildActive
                    ? 'bg-[rgb(218,255,1)]/10 text-[rgb(218,255,1)]'
                    : 'text-neutral-500 hover:bg-neutral-800/50 hover:text-white'
                  }
                `}
              >
                {label}
                {isChildActive && <ChevronRight size={12} className="text-[rgb(218,255,1)]" />}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN LAYOUT
// ═══════════════════════════════════════════════════════════════════════════════

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, logout, admin } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated()) router.push('/login');
  }, [isAuthenticated, router]);

  if (!isAuthenticated()) return null;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0a0a]">
      {/* ── Sidebar ───────────────────────────────────────────── */}
      <aside className="flex flex-col w-64 flex-shrink-0 bg-[#080808] border-r border-neutral-800">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2 px-5 py-6 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[rgb(218,255,1)] flex items-center justify-center">
              <Sparkles size={20} className="text-[#0a0a0a]" />
            </div>
            <div>
              <p className="text-lg font-bold text-white tracking-tight">FASTOFY</p>
              <p className="text-[10px] text-[rgb(218,255,1)] font-semibold tracking-widest uppercase">Admin Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const exact = href === '/dashboard';
            const isActive = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`
                  group flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-200
                  ${isActive
                    ? 'bg-[rgb(218,255,1)]/10 text-[rgb(218,255,1)] border border-[rgb(218,255,1)]/20'
                    : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-white border border-transparent'
                  }
                `}
              >
                <span className="flex items-center gap-3">
                  <Icon size={18} className={isActive ? 'text-[rgb(218,255,1)]' : 'text-neutral-500 group-hover:text-[rgb(218,255,1)]'} />
                  {label}
                </span>
                {isActive && <ChevronRight size={14} className="text-[rgb(218,255,1)]" />}
              </Link>
            );
          })}

          {/* Dropdowns */}
          <div className="pt-2">
            <NavDropdown config={storageDropdown} pathname={pathname} basePrefix="/dashboard/storage" />
          </div>
          <NavDropdown config={subscriptionsDropdown} pathname={pathname} basePrefix="/dashboard/subscriptions" />
        </nav>

        {/* User Section */}
        <div className="border-t border-neutral-800 px-4 py-4">
          <div className="flex items-center gap-3 mb-3 p-2 rounded-xl bg-neutral-900/50">
            <div className="w-9 h-9 rounded-full bg-[rgb(218,255,1)]/20 border border-[rgb(218,255,1)]/30 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-[rgb(218,255,1)]">
                {admin?.email?.[0]?.toUpperCase() ?? 'A'}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white truncate">{admin?.email}</p>
              <p className="text-[10px] text-[rgb(218,255,1)] font-medium">Super Admin</p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main Content ───────────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-neutral-800 bg-[#0d0d0d] flex-shrink-0">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-neutral-500">Dashboard</span>
            <ChevronRight size={14} className="text-neutral-600" />
            {navLinks.map(({ href, label }) => {
              const exact = href === '/dashboard';
              const isActive = exact ? pathname === href : pathname.startsWith(href);
              if (!isActive) return null;
              return (
                <span key={href} className="text-white font-medium">{label}</span>
              );
            })}
            {pathname.startsWith('/dashboard/storage') && (
              <span className="text-white font-medium">
                {pathname === '/dashboard/storage/provider' ? 'Storage Provider' : 'Websites Storage'}
              </span>
            )}
            {pathname.startsWith('/dashboard/subscriptions') && (
              <span className="text-white font-medium">
                {pathname === '/dashboard/subscriptions/plans' ? 'Plans' : 'Assign'}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-lg hover:bg-neutral-800 transition-colors">
              <Settings size={18} className="text-neutral-500" />
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#0a0a0a]">
          {children}
        </main>
      </div>
    </div>
  );
}
