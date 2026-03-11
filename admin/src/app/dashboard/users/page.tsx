'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { 
  Users, Shield, Trash2, Edit2, Search, X, Loader2, 
  UserPlus, Mail, Calendar, Crown, User, Filter,
  ArrowUpDown, MoreHorizontal, ChevronDown, Eye,
  Globe, CreditCard, Activity
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════════
// USER STATS COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

function UserStats({ users }: { users: any[] }) {
  const totalUsers = users.length;
  const adminUsers = users.filter(u => u.role === 'SUPER_ADMIN').length;
  const regularUsers = totalUsers - adminUsers;
  const thisMonth = users.filter(u => {
    const created = new Date(u.createdAt);
    const now = new Date();
    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
  }).length;

  const stats = [
    { label: 'Total Users', value: totalUsers, icon: Users, color: 'rgb(218, 255, 1)' },
    { label: 'Admins', value: adminUsers, icon: Crown, color: 'rgb(167, 139, 250)' },
    { label: 'Regular Users', value: regularUsers, icon: User, color: 'rgb(56, 189, 248)' },
    { label: 'New This Month', value: thisMonth, icon: UserPlus, color: 'rgb(52, 211, 153)' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div 
          key={stat.label}
          className="p-4 rounded-xl border border-neutral-800 bg-[#0d0d0d] hover:border-neutral-700 transition-colors"
        >
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
            style={{ backgroundColor: `${stat.color}15`, border: `1px solid ${stat.color}30` }}
          >
            <stat.icon size={18} style={{ color: stat.color }} />
          </div>
          <p className="text-2xl font-bold text-white">{stat.value}</p>
          <p className="text-xs text-neutral-500">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// USER ROW COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

function UserRow({ 
  user, 
  onEdit, 
  onDelete,
  onViewDetails 
}: { 
  user: any; 
  onEdit: () => void; 
  onDelete: () => void;
  onViewDetails: () => void;
}) {
  const isAdmin = user.role === 'SUPER_ADMIN';
  
  return (
    <tr className="group hover:bg-[rgb(218,255,1)]/[0.02] transition-colors border-b border-neutral-800 last:border-0">
      {/* User Info */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className={`
            w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
            ${isAdmin 
              ? 'bg-violet-500/15 border border-violet-500/30' 
              : 'bg-[rgb(218,255,1)]/10 border border-[rgb(218,255,1)]/20'
            }
          `}>
            <span className={`text-sm font-bold ${isAdmin ? 'text-violet-400' : 'text-[rgb(218,255,1)]'}`}>
              {user.email[0].toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="font-medium text-white truncate">{user.email}</p>
            <p className="text-xs text-neutral-600 font-mono">{user.id.slice(0, 16)}...</p>
          </div>
        </div>
      </td>

      {/* Role Badge */}
      <td className="px-5 py-4">
        <span className={`
          inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
          ${isAdmin 
            ? 'bg-violet-500/15 text-violet-400 border border-violet-500/25' 
            : 'bg-sky-500/15 text-sky-400 border border-sky-500/25'
          }
        `}>
          {isAdmin ? <Crown size={12} /> : <User size={12} />}
          {isAdmin ? 'Super Admin' : 'User'}
        </span>
      </td>

      {/* Stats */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-4 text-xs text-neutral-500">
          <span className="flex items-center gap-1.5">
            <Globe size={12} className="text-neutral-600" />
            {user._count?.domains || 0} domains
          </span>
          <span className="flex items-center gap-1.5">
            <Activity size={12} className="text-neutral-600" />
            {user._count?.websites || 0} sites
          </span>
        </div>
      </td>

      {/* Joined Date */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-1.5 text-xs text-neutral-500">
          <Calendar size={12} className="text-neutral-600" />
          {new Date(user.createdAt).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          })}
        </div>
      </td>

      {/* Actions */}
      <td className="px-5 py-4">
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onViewDetails}
            className="p-2 rounded-lg text-neutral-500 hover:text-[rgb(218,255,1)] hover:bg-[rgb(218,255,1)]/10 transition-colors"
            title="View details"
          >
            <Eye size={15} />
          </button>
          <button
            onClick={onEdit}
            className="p-2 rounded-lg text-neutral-500 hover:text-[rgb(218,255,1)] hover:bg-[rgb(218,255,1)]/10 transition-colors"
            title="Edit role"
          >
            <Edit2 size={15} />
          </button>
          <button
            onClick={onDelete}
            className="p-2 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Delete user"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </td>
    </tr>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// USER DETAILS MODAL
// ═══════════════════════════════════════════════════════════════════════════════

function UserDetailsModal({ user, onClose }: { user: any; onClose: () => void }) {
  const isAdmin = user.role === 'SUPER_ADMIN';

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0d0d0d] border border-neutral-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-800">
          <h2 className="text-lg font-semibold text-white">User Details</h2>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-500 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">
          {/* User Avatar & Basic Info */}
          <div className="flex items-center gap-4">
            <div className={`
              w-16 h-16 rounded-2xl flex items-center justify-center
              ${isAdmin 
                ? 'bg-violet-500/15 border border-violet-500/30' 
                : 'bg-[rgb(218,255,1)]/10 border border-[rgb(218,255,1)]/20'
              }
            `}>
              <span className={`text-2xl font-bold ${isAdmin ? 'text-violet-400' : 'text-[rgb(218,255,1)]'}`}>
                {user.email[0].toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-lg font-semibold text-white">{user.email}</p>
              <span className={`
                inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold mt-1
                ${isAdmin 
                  ? 'bg-violet-500/15 text-violet-400' 
                  : 'bg-sky-500/15 text-sky-400'
                }
              `}>
                {isAdmin ? <Crown size={11} /> : <User size={11} />}
                {isAdmin ? 'Super Admin' : 'Regular User'}
              </span>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'User ID', value: user.id.slice(0, 20) + '...', icon: User },
              { label: 'Joined', value: new Date(user.createdAt).toLocaleDateString(), icon: Calendar },
              { label: 'Domains', value: user._count?.domains || 0, icon: Globe },
              { label: 'Websites', value: user._count?.websites || 0, icon: Activity },
            ].map((item) => (
              <div 
                key={item.label}
                className="p-3 rounded-xl bg-neutral-900/50 border border-neutral-800"
              >
                <div className="flex items-center gap-2 text-neutral-500 mb-1">
                  <item.icon size={12} />
                  <span className="text-xs">{item.label}</span>
                </div>
                <p className="text-sm font-medium text-white truncate">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Subscription Info */}
          <div className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800">
            <div className="flex items-center gap-2 text-neutral-500 mb-2">
              <CreditCard size={14} />
              <span className="text-sm font-medium">Subscription</span>
            </div>
            {user.subscription ? (
              <div className="flex items-center justify-between">
                <span className="text-sm text-white">{user.subscription.plan?.name || 'Active Plan'}</span>
                <span className="badge-green text-xs">Active</span>
              </div>
            ) : (
              <p className="text-sm text-neutral-500">No active subscription</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-neutral-800 bg-neutral-900/30">
          <button onClick={onClose} className="btn-secondary w-full justify-center">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// EDIT ROLE MODAL
// ═══════════════════════════════════════════════════════════════════════════════

function EditRoleModal({ 
  user, 
  onClose, 
  onSave,
  isPending 
}: { 
  user: any; 
  onClose: () => void; 
  onSave: (role: 'USER' | 'SUPER_ADMIN') => void;
  isPending: boolean;
}) {
  const [selectedRole, setSelectedRole] = useState<'USER' | 'SUPER_ADMIN'>(user.role);

  const roles = [
    { 
      id: 'USER' as const, 
      label: 'Regular User', 
      description: 'Standard platform access with basic features',
      icon: User,
      color: 'rgb(56, 189, 248)'
    },
    { 
      id: 'SUPER_ADMIN' as const, 
      label: 'Super Admin', 
      description: 'Full administrative access to all platform features',
      icon: Crown,
      color: 'rgb(167, 139, 250)'
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0d0d0d] border border-neutral-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-800">
          <div>
            <h2 className="text-lg font-semibold text-white">Edit User Role</h2>
            <p className="text-xs text-neutral-500 mt-0.5">{user.email}</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-500 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          {roles.map((role) => {
            const isSelected = selectedRole === role.id;
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => setSelectedRole(role.id)}
                className={`
                  w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all
                  ${isSelected 
                    ? 'bg-[rgb(218,255,1)]/5 border-[rgb(218,255,1)]/30' 
                    : 'bg-neutral-900/30 border-neutral-800 hover:border-neutral-700'
                  }
                `}
              >
                <div 
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ 
                    backgroundColor: `${role.color}15`, 
                    border: `1px solid ${role.color}30` 
                  }}
                >
                  <role.icon size={20} style={{ color: role.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${isSelected ? 'text-[rgb(218,255,1)]' : 'text-white'}`}>
                    {role.label}
                  </p>
                  <p className="text-xs text-neutral-500 mt-0.5">{role.description}</p>
                </div>
                <div className={`
                  w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all
                  ${isSelected ? 'bg-[rgb(218,255,1)]' : 'border-2 border-neutral-700'}
                `}>
                  {isSelected && (
                    <svg className="w-3 h-3 text-[#0a0a0a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-5 border-t border-neutral-800 bg-neutral-900/30">
          <button onClick={onClose} className="btn-secondary flex-1 justify-center">
            Cancel
          </button>
          <button
            onClick={() => onSave(selectedRole)}
            disabled={isPending || selectedRole === user.role}
            className="btn-primary flex-1 justify-center disabled:opacity-50"
          >
            {isPending ? <Loader2 size={16} className="animate-spin" /> : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export default function UsersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'USER' | 'SUPER_ADMIN'>('all');
  const [editingUser, setEditingUser] = useState<any>(null);
  const [viewingUser, setViewingUser] = useState<any>(null);
  const [sortField, setSortField] = useState<'createdAt' | 'email'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await adminAPI.getAllUsers();
      return res.data;
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: 'USER' | 'SUPER_ADMIN' }) =>
      adminAPI.updateUserRole(userId, role),
    onSuccess: () => {
      toast.success('User role updated successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setEditingUser(null);
    },
    onError: () => toast.error('Failed to update user role'),
  });

  const deleteMutation = useMutation({
    mutationFn: (userId: string) => adminAPI.deleteUser(userId),
    onSuccess: () => {
      toast.success('User deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: () => toast.error('Failed to delete user'),
  });

  // Filter and sort users
  const filteredUsers = users
    .filter((u: any) => {
      const matchesSearch = u.email.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === 'all' || u.role === roleFilter;
      return matchesSearch && matchesRole;
    })
    .sort((a: any, b: any) => {
      const aVal = sortField === 'email' ? a.email.toLowerCase() : new Date(a.createdAt).getTime();
      const bVal = sortField === 'email' ? b.email.toLowerCase() : new Date(b.createdAt).getTime();
      if (sortOrder === 'asc') return aVal > bVal ? 1 : -1;
      return aVal < bVal ? 1 : -1;
    });

  const handleDelete = (user: any) => {
    if (confirm(`Are you sure you want to delete ${user.email}? This action cannot be undone.`)) {
      deleteMutation.mutate(user.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-[rgb(218,255,1)]/10 border border-[rgb(218,255,1)]/20 flex items-center justify-center">
          <Users size={24} className="text-[rgb(218,255,1)]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <p className="text-sm text-neutral-500">Manage platform users and permissions</p>
        </div>
      </div>

      {/* Stats */}
      <UserStats users={users} />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by email..."
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-neutral-900/50 border border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:border-[rgb(218,255,1)] transition-colors"
          />
        </div>

        {/* Role Filter */}
        <div className="relative">
          <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
            className="appearance-none pl-9 pr-10 py-3 rounded-xl bg-neutral-900/50 border border-neutral-800 text-white text-sm focus:outline-none focus:border-[rgb(218,255,1)] transition-colors cursor-pointer"
          >
            <option value="all">All Roles</option>
            <option value="USER">Users Only</option>
            <option value="SUPER_ADMIN">Admins Only</option>
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" />
        </div>

        {/* Sort */}
        <button
          onClick={() => {
            if (sortField === 'createdAt') {
              setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
            } else {
              setSortField('createdAt');
              setSortOrder('desc');
            }
          }}
          className="flex items-center gap-2 px-4 py-3 rounded-xl bg-neutral-900/50 border border-neutral-800 text-neutral-400 text-sm hover:border-neutral-700 transition-colors"
        >
          <ArrowUpDown size={14} />
          {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
        </button>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-neutral-800 bg-[#0d0d0d] overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center gap-3 py-20">
            <Loader2 className="animate-spin text-[rgb(218,255,1)]" size={24} />
            <span className="text-neutral-500">Loading users...</span>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-900/30">
                <th className="px-5 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">User</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Role</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Usage</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Joined</th>
                <th className="px-5 py-4 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user: any) => (
                <UserRow
                  key={user.id}
                  user={user}
                  onEdit={() => setEditingUser(user)}
                  onDelete={() => handleDelete(user)}
                  onViewDetails={() => setViewingUser(user)}
                />
              ))}
            </tbody>
          </table>
        )}
        
        {!isLoading && filteredUsers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <Users size={40} className="text-neutral-700 mb-3" />
            <p className="text-neutral-500">No users found</p>
            <p className="text-xs text-neutral-600 mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Results Count */}
      {!isLoading && (
        <p className="text-xs text-neutral-600 text-center">
          Showing {filteredUsers.length} of {users.length} users
        </p>
      )}

      {/* Edit Role Modal */}
      {editingUser && (
        <EditRoleModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={(role) => updateRoleMutation.mutate({ userId: editingUser.id, role })}
          isPending={updateRoleMutation.isPending}
        />
      )}

      {/* User Details Modal */}
      {viewingUser && (
        <UserDetailsModal
          user={viewingUser}
          onClose={() => setViewingUser(null)}
        />
      )}
    </div>
  );
}
