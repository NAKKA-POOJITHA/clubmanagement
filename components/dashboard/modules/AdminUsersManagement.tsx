'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/authContext';
import { dataService, useCentralDataSync } from '@/lib/dataService';
import { Profile } from '@/lib/demoData';
import {
  Users,
  KeyRound,
  ShieldAlert,
  Search,
  CheckCircle2,
  Filter,
  UserCheck,
  Building2,
  Lock
} from 'lucide-react';

export default function AdminUsersManagement() {
  useCentralDataSync();
  const { userProfile } = useAuth();
  const users = dataService.getUsers();
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  const handleRoleChange = (userId: string, newRole: any) => {
    const updated = dataService.updateUserRole(userId, newRole);
    if (updated) {
      alert(`Role successfully changed for ${updated.full_name} to ${newRole.replace('_', ' ').toUpperCase()}. Updated in central RBAC ledger.`);
    }
  };

  const filtered = (users || []).filter(u => {
    const q = (search || '').toLowerCase().trim();
    const matchesSearch =
      !q ||
      (u?.full_name || '').toLowerCase().includes(q) ||
      (u?.email || '').toLowerCase().includes(q) ||
      (u?.department || '').toLowerCase().includes(q);
    const matchesRole = filterRole === 'all' || u?.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="coursue-card p-6 bg-gradient-to-r from-primary-900 via-[#0A2540] to-primary-800 text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-primary-200 text-[11px] font-bold tracking-wide uppercase">
              <Users className="w-3.5 h-3.5" />
              <span>Platform Security & Access Governance</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              User Accounts & RBAC Authority Management
            </h1>
            <p className="text-xs text-primary-100/90 max-w-2xl leading-relaxed">
              Enforce role-based access control (RBAC), assign club officer and departmental privileges, and audit active administrative accounts across Pragati University.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white bg-white/10 px-3 py-1.5 rounded-xl border border-white/20">
              6 Configured RBAC Roles
            </span>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="coursue-card p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by stakeholder name, email, or department..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-surface border border-surface-border rounded-xl focus:outline-none focus:border-primary-600 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="text-xs p-2 rounded-xl border border-surface-border bg-surface text-ink font-semibold focus:outline-none cursor-pointer"
          >
            <option value="all">All Roles</option>
            <option value="student">Student</option>
            <option value="club_member">Club Member</option>
            <option value="club_admin">Club Admin</option>
            <option value="faculty_coordinator">Faculty Coordinator</option>
            <option value="department_admin">Department Admin</option>
            <option value="super_admin">Super Admin</option>
          </select>

          <span className="text-xs font-bold text-primary-700 bg-primary-50 px-3 py-2 rounded-xl border border-primary-100 whitespace-nowrap">
            {filtered.length} Accounts
          </span>
        </div>
      </div>

      {/* Users Table */}
      <div className="coursue-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="text-[10px] font-bold text-ink-muted uppercase tracking-wider bg-surface-muted border-b border-surface-border">
                <th className="py-3 px-4">Stakeholder Profile</th>
                <th className="py-3 px-3">Department</th>
                <th className="py-3 px-3">Institutional Roll / ID</th>
                <th className="py-3 px-3">Assigned Role</th>
                <th className="py-3 px-4 text-right">Role Modifier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-surface-subtle transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.photo_url}
                        alt={user.full_name}
                        className="w-9 h-9 rounded-full object-cover ring-2 ring-primary-100 shrink-0"
                      />
                      <div>
                        <p className="font-bold text-ink">{user.full_name}</p>
                        <p className="text-[10px] text-ink-muted font-mono">{user.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3 text-ink-muted font-medium">
                    {user.department}
                  </td>

                  <td className="py-3 px-3 font-mono text-primary-700 font-bold">
                    {user.membership_number || 'N/A'}
                  </td>

                  <td className="py-3 px-3">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-primary-50 text-primary-700 capitalize">
                      {user.role.replace('_', ' ')}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="text-xs p-1.5 rounded-lg border border-surface-border bg-surface text-ink font-semibold focus:outline-none focus:border-primary-600 cursor-pointer shadow-xs"
                    >
                      <option value="student">Student</option>
                      <option value="club_member">Club Member</option>
                      <option value="club_admin">Club Admin</option>
                      <option value="faculty_coordinator">Faculty Coordinator</option>
                      <option value="department_admin">Department Admin</option>
                      <option value="super_admin">Super Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
