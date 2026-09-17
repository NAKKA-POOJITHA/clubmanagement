'use client';

import React, { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import HeroBanner from '@/components/dashboard/HeroBanner';
import ActivePillsRow from '@/components/dashboard/ActivePillsRow';
import HorizontalCardsRow from '@/components/dashboard/HorizontalCardsRow';
import DataTable from '@/components/dashboard/DataTable';
import StatRail from '@/components/dashboard/StatRail';
import { useAuth } from '@/lib/authContext';
import { dataService, useCentralDataSync } from '@/lib/dataService';
import { Profile } from '@/lib/demoData';
import {
  ShieldAlert,
  Users,
  Database,
  FileSpreadsheet,
  KeyRound,
  CheckCircle2,
  History,
  Layers,
  Calendar,
  Trophy,
  BookOpen,
  Wrench,
  Image as ImageIcon
} from 'lucide-react';
import Link from 'next/link';

// Import Admin Modules
import AdminEventsManagement from '@/components/dashboard/modules/AdminEventsManagement';
import AdminProjectsManagement from '@/components/dashboard/modules/AdminProjectsManagement';
import AdminRoadmapsManagement from '@/components/dashboard/modules/AdminRoadmapsManagement';
import AdminToolsManagement from '@/components/dashboard/modules/AdminToolsManagement';
import AdminGalleryManagement from '@/components/dashboard/modules/AdminGalleryManagement';
import AdminTeamsManagement from '@/components/dashboard/modules/AdminTeamsManagement';
import AdminReportsManagement from '@/components/dashboard/modules/AdminReportsManagement';
import AdminUsersManagement from '@/components/dashboard/modules/AdminUsersManagement';
import AdminAuditManagement from '@/components/dashboard/modules/AdminAuditManagement';
import AdminDigitalIdManagement from '@/components/dashboard/modules/AdminDigitalIdManagement';

function SuperAdminContent() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';
  const { userProfile } = useAuth();
  const dataVersion = useCentralDataSync();
  const users = dataService.getUsers();
  const events = dataService.getEvents();
  const auditLogs = dataService.getAuditLogs(userProfile?.role);
  const globalStats = dataService.getGlobalStats();

  const handleRoleChange = (userId: string, newRole: any) => {
    const updated = dataService.updateUserRole(userId, newRole);
    if (updated) {
      alert(`Updated role for ${updated.full_name} to ${newRole}. Recorded in immutable audit log.`);
    }
  };

  const superPills = [
    { id: '1', metric: 'Platform-wide', label: 'Super Admin Access', iconBg: 'bg-tag-violet', iconColor: 'text-primary-600', icon: ShieldAlert },
    { id: '2', metric: '6 Roles Configured', label: 'RBAC Enforcement', iconBg: 'bg-tag-blue', iconColor: 'text-blue-700', icon: KeyRound },
    { id: '3', metric: '100% Up-time', label: 'Postgres Database', iconBg: 'bg-tag-teal', iconColor: 'text-emerald-700', icon: Database }
  ];

  // Render specific administrative module based on activeTab
  if (activeTab === 'events' || activeTab === 'checkin' || activeTab === 'poster') {
    return <AdminEventsManagement />;
  }
  if (activeTab === 'projects') {
    return <AdminProjectsManagement />;
  }
  if (activeTab === 'roadmaps') {
    return <AdminRoadmapsManagement />;
  }
  if (activeTab === 'tools') {
    return <AdminToolsManagement />;
  }
  if (activeTab === 'gallery') {
    return <AdminGalleryManagement />;
  }
  if (activeTab === 'teams') {
    return <AdminTeamsManagement />;
  }
  if (activeTab === 'reports') {
    return <AdminReportsManagement />;
  }
  if (activeTab === 'users') {
    return <AdminUsersManagement />;
  }
  if (activeTab === 'audit') {
    return <AdminAuditManagement />;
  }
  if (activeTab === 'digital-id') {
    return <AdminDigitalIdManagement />;
  }
  if (activeTab === 'approvals') {
    return <AdminProjectsManagement />;
  }

  // Default Overview Dashboard
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 min-w-0 space-y-6">
        <HeroBanner
          title="Central Technical Platform Owner Dashboard"
          subtitle="Full platform-wide scope: manage global user roles, enforce database Row-Level Security policies, moderate content, review audit logs, and export reports."
          buttonText="Export System Audit Report"
          buttonLink="/dashboard/super-admin?tab=reports"
          badgeText="PLATFORM OWNER & SUPER ADMIN"
        />

        <ActivePillsRow pills={superPills} />

        {/* 1. User & Role Management Table */}
        <div className="coursue-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-ink">User & Stakeholder Role Management</h3>
              <p className="text-[11px] text-ink-muted">Assign and modify RBAC permissions across all college technical clubs</p>
            </div>
            <Link
              href="/dashboard/super-admin?tab=users"
              className="text-xs font-bold text-primary-700 bg-primary-50 hover:bg-primary-100 px-3 py-1 rounded-full transition-colors"
            >
              Manage {users.length} Accounts →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-bold text-ink-muted uppercase tracking-wider border-b border-surface-border">
                  <th className="pb-3 px-3">User Profile</th>
                  <th className="pb-3 px-3">Department</th>
                  <th className="pb-3 px-3">Assigned Role</th>
                  <th className="pb-3 px-3 text-right">Role Modifier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-surface-subtle transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={user.photo_url}
                          alt={user.full_name}
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-primary-100"
                        />
                        <div>
                          <p className="text-xs font-bold text-ink">{user.full_name}</p>
                          <p className="text-[10px] text-ink-muted font-mono">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-xs text-ink-muted">{user.department}</td>
                    <td className="py-3 px-3">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-primary-50 text-primary-700 capitalize">
                        {user.role.replace('_', ' ')}
                      </span>
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

        {/* 2. Platform Audit Log Viewer */}
        <div className="coursue-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-primary-600" />
              <div>
                <h3 className="text-sm font-bold text-ink">System Audit Trail & Security Logs</h3>
                <p className="text-[11px] text-ink-muted">Real-time immutable ledger of all administrative events</p>
              </div>
            </div>
            <Link href="/dashboard/super-admin?tab=audit" className="text-xs font-semibold text-primary-600 hover:underline">
              View All Logs →
            </Link>
          </div>

          <div className="divide-y divide-surface-border">
            {auditLogs.slice(0, 4).map((log) => (
              <div key={log.id} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <span className={`w-2 h-2 rounded-full ${log.status === 'Success' ? 'bg-emerald-500' : 'bg-primary-500'}`} />
                  <div>
                    <span className="font-bold text-ink">{log.action}: </span>
                    <span className="text-ink-muted">{log.target}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-primary-700 bg-primary-50 px-2 py-0.5 rounded-md">
                    {log.actor_name}
                  </span>
                  <p className="text-[9px] text-ink-muted mt-0.5">{log.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <HorizontalCardsRow
          title="Platform-Wide Active Technical Events"
          events={events}
        />
      </div>

      <StatRail />
    </div>
  );
}

export default function SuperAdminDashboardPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-ink-muted">Loading Super Admin Module...</div>}>
      <SuperAdminContent />
    </Suspense>
  );
}
