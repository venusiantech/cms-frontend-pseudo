'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { adminAPI } from '@/lib/api';
import { Shield, Loader2, AlertCircle, Sparkles, Lock } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await adminAPI.login(email, password);
      const { user, token } = response.data;
      if (user.role !== 'SUPER_ADMIN') {
        setError('Access denied. Super Admin privileges required.');
        return;
      }
      setAuth(user, token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(218,255,1,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(218,255,1,0.3) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
        {/* Glows */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[rgb(218,255,1)]/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-violet-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[rgb(218,255,1)] mb-4">
            <Sparkles size={28} className="text-[#0a0a0a]" />
          </div>
          <h1 className="text-3xl font-bold text-white">FASTOFY</h1>
          <p className="text-sm text-[rgb(218,255,1)] font-medium tracking-widest uppercase mt-1">
            Admin Portal
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#0d0d0d] border border-neutral-800 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Shield size={18} className="text-[rgb(218,255,1)]" />
            <span className="text-sm text-neutral-400">Secure Admin Login</span>
          </div>

          {error && (
            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-xl mb-6">
              <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
              <span className="text-sm text-red-400">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-2 uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl bg-neutral-900/50 border border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:border-[rgb(218,255,1)] focus:ring-2 focus:ring-[rgb(218,255,1)]/20 transition-all"
                placeholder="admin@fastofy.com"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-2 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl bg-neutral-900/50 border border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:border-[rgb(218,255,1)] focus:ring-2 focus:ring-[rgb(218,255,1)]/20 transition-all pr-12"
                  placeholder="••••••••••••"
                  required
                />
                <Lock size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-600" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-[rgb(218,255,1)] text-[#0a0a0a] font-semibold text-sm hover:bg-[rgb(190,225,1)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[rgb(218,255,1)]/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in to Dashboard'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-neutral-600 mt-6">
          Restricted to Super Admin users only
        </p>
      </div>
    </div>
  );
}
