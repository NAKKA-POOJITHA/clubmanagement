'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/lib/authContext';
import { dataService } from '@/lib/dataService';
import { DEMO_PROFILES, Profile } from '@/lib/demoData';
import { Users, KeyRound, ShieldAlert, ArrowLeft, Search, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function SuperAdminUsersPage() {
  const { currentRole, isAuthenticated } = useAuth();
  const isSuperAdmin = isAuthenticated && currentRole === 'super_admin';
  const [users, setUsers] = useState<Profile[]>(Object.values(DEMO_PROFILES));
  const [search, setSearch] = useState('');

  if (!isSuperAdmin) {
    return (
      <div className="min-h-screen flex flex-col bg-surface-muted">
        <Navbar />
        <main className="flex-1 max-w-md w-full mx-auto px-4 py-16 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
            <KeyRound className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-ink">Super Admin Authorization Required</h2>
          <p className="text-xs text-ink-muted">User and Role Management is restricted to platform Super Administrators.</p>
          <Link href="/dashboard/student" className="inline-block px-4 py-2 rounded-xl bg-primary-600 text-white text-xs font-bold">
            Return to Student Dashboard
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const filtered = users.filter(u =>
    u.full_name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  const handleRoleChange = (userId: string, newRole: any) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    const user = users.find(u => u.id === userId);
    if (user) {
      dataService.logAction('Super Admin Role Modification', `${user.full_name} updated to ${newRole}`, 'Super Admin');
      alert(`Role successfully changed for ${user.full_name} to ${newRole}. Updated in database.`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-muted">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <Link href="/dashboard/super-admin" className="inline-flex items-center gap-1.5 text-xs font-bold text-ink-muted hover:text-ink">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Super Admin Dashboard</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tag-violet text-primary-700 text-xs font-bold">
              <Users className="w-3.5 h-3.5" />
              <span>Platform-Wide Scope</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink">User & Role Management</h1>
            <p className="text-xs text-ink-muted">
              Modify role authority and assign departmental or club administrative privileges.
            </p>
          </div>
          <span className="text-xs font-bold text-primary-700 bg-primary-50 px-3 py-1.5 rounded-full border border-primary-100">
            {users.length} Total Users
          </span>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or role..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-surface border border-surface-border rounded-2xl focus:outline-none focus:border-primary-600 shadow-sm"
          />
        </div>

        {/* Users Table */}
        <div className="coursue-card p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-bold text-ink-muted uppercase tracking-wider border-b border-surface-border">
                  <th className="pb-3 px-3">Stakeholder Profile</th>
                  <th className="pb-3 px-3">Department</th>
                  <th className="pb-3 px-3">Membership / Roll ID</th>
                  <th className="pb-3 px-3 text-right">Scope & Role Assignment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border text-xs">
                {filtered.map((user) => (
                  <tr key={user.id} className="hover:bg-surface-subtle transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <img src={user.photo_url} className="w-8 h-8 rounded-full object-cover ring-1 ring-primary-100" />
                        <div>
                          <p className="font-bold text-ink">{user.full_name}</p>
                          <p className="text-[10px] text-ink-muted font-mono">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-ink-muted">{user.department}</td>
                    <td className="py-3 px-3 font-mono text-primary-700 font-bold">
                      {user.membership_number || 'N/A'}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="text-xs p-1.5 rounded-lg border border-surface-border bg-surface text-ink font-semibold focus:outline-none focus:border-primary-600 cursor-pointer"
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
      </main>

      <Footer />
    </div>
  );
}
