'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import HeroBanner from '@/components/dashboard/HeroBanner';
import ActivePillsRow from '@/components/dashboard/ActivePillsRow';
import HorizontalCardsRow from '@/components/dashboard/HorizontalCardsRow';
import DataTable from '@/components/dashboard/DataTable';
import StatRail from '@/components/dashboard/StatRail';
import { useAuth } from '@/lib/authContext';
import { dataService } from '@/lib/dataService';
import { Building2, Users, Trophy, FileSpreadsheet, Download } from 'lucide-react';
import { exportToExcel } from '@/lib/excel';

// Import Admin Modules
import AdminEventsManagement from '@/components/dashboard/modules/AdminEventsManagement';
import AdminProjectsManagement from '@/components/dashboard/modules/AdminProjectsManagement';
import AdminRoadmapsManagement from '@/components/dashboard/modules/AdminRoadmapsManagement';
import AdminToolsManagement from '@/components/dashboard/modules/AdminToolsManagement';
import AdminGalleryManagement from '@/components/dashboard/modules/AdminGalleryManagement';
import AdminTeamsManagement from '@/components/dashboard/modules/AdminTeamsManagement';
import AdminReportsManagement from '@/components/dashboard/modules/AdminReportsManagement';
import AdminDigitalIdManagement from '@/components/dashboard/modules/AdminDigitalIdManagement';

function DepartmentAdminContent() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';
  const { userProfile } = useAuth();
  const events = dataService.getEvents();
  const clubs = dataService.getClubs();

  const deptPills = [
    { id: '1', metric: 'CSE & IT', label: 'Academic Department', iconBg: 'bg-tag-violet', iconColor: 'text-primary-600', icon: Building2 },
    { id: '2', metric: '735 Active', label: 'Enrolled Students', iconBg: 'bg-tag-teal', iconColor: 'text-emerald-700', icon: Users },
    { id: '3', metric: '5 Active', label: 'Department Clubs', iconBg: 'bg-tag-blue', iconColor: 'text-blue-700', icon: Trophy }
  ];

  const handleExportDeptSummary = () => {
    const data = clubs.map(c => ({
      'Club Name': c.name,
      'Domain': c.domain,
      'Active Members': c.members_count,
      'Hosted Events': c.events_count,
      'Projects Built': c.projects_count,
      'Faculty Lead': c.coordinator_name,
      'Status': c.status
    }));
    exportToExcel(data, 'Department_Clubs_Summary_2026.xlsx', 'Department Overview');
  };

  // Specific Module View Dispatcher
  if (activeTab === 'events') {
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
  if (activeTab === 'digital-id') {
    return <AdminDigitalIdManagement />;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 min-w-0 space-y-6">
        <HeroBanner
          title="Departmental Technical Innovation & Activity Analytics"
          subtitle="Department of Computer Science & Engineering. Oversee cross-club participation, monitor faculty approvals, and generate institutional accreditation summaries."
          buttonText="Export Department Excel"
          buttonLink="/dashboard/department-admin?tab=reports"
          badgeText="DEPARTMENT ADMIN OVERSIGHT"
        />

        <ActivePillsRow pills={deptPills} />

        {/* Department Club Performance Grid */}
        <div className="coursue-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-ink">Department Clubs Health & Participation</h3>
              <p className="text-[11px] text-ink-muted">Aggregated analytics across all technical clubs</p>
            </div>
            <button
              onClick={handleExportDeptSummary}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary-50 text-primary-700 hover:bg-primary-100 text-xs font-bold transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Excel</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {clubs.map((club) => (
              <div key={club.id} className="p-4 rounded-2xl bg-surface-muted border border-surface-border space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{club.logo}</span>
                    <h4 className="text-xs font-bold text-ink">{club.name}</h4>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Active
                  </span>
                </div>
                <p className="text-[11px] text-ink-muted line-clamp-2">{club.description}</p>
                <div className="flex items-center justify-between pt-2 border-t border-surface-border text-[10px] text-primary-700 font-semibold">
                  <span>👥 {club.members_count} Members</span>
                  <span>📅 {club.events_count} Events</span>
                  <span>🚀 {club.projects_count} Projects</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <HorizontalCardsRow
          title="All Departmental Events & Hackathons"
          events={events}
        />
      </div>

      <StatRail />
    </div>
  );
}

export default function DepartmentAdminDashboardPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-ink-muted">Loading Department Module...</div>}>
      <DepartmentAdminContent />
    </Suspense>
  );
}
