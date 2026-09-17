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
import { ShieldCheck, Check, X, Star, Trophy, Users, AlertCircle, FileSpreadsheet } from 'lucide-react';
import Link from 'next/link';

// Import Admin Modules
import AdminEventsManagement from '@/components/dashboard/modules/AdminEventsManagement';
import AdminProjectsManagement from '@/components/dashboard/modules/AdminProjectsManagement';
import AdminRoadmapsManagement from '@/components/dashboard/modules/AdminRoadmapsManagement';
import AdminToolsManagement from '@/components/dashboard/modules/AdminToolsManagement';
import AdminGalleryManagement from '@/components/dashboard/modules/AdminGalleryManagement';
import AdminTeamsManagement from '@/components/dashboard/modules/AdminTeamsManagement';
import AdminReportsManagement from '@/components/dashboard/modules/AdminReportsManagement';
import AdminDigitalIdManagement from '@/components/dashboard/modules/AdminDigitalIdManagement';

function FacultyContent() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';
  const { userProfile } = useAuth();
  const dataVersion = useCentralDataSync();
  const events = dataService.getEvents();
  const projects = dataService.getProjects();

  const [teamApprovals, setTeamApprovals] = useState([
    { id: 'app-1', student: 'Rohan Deshmukh', club: 'AI & Robotics Innovation Lab', position: 'Lead Student Architect', year: '2026-2027', status: 'pending' },
    { id: 'app-2', student: 'Ananya Verma', club: 'Web & Mobile Full-Stack Guild', position: 'Vice President & Hackathon Coordinator', year: '2026-2027', status: 'pending' },
  ]);

  const [reviewRating, setReviewRating] = useState<Record<string, number>>({});
  const [reviewRemarks, setReviewRemarks] = useState<Record<string, string>>({});

  const handleApproveTeam = (id: string) => {
    setTeamApprovals(prev => prev.map(a => a.id === id ? { ...a, status: 'approved' } : a));
    dataService.logAction('Faculty Approved Team Position', 'Tenure 2026-2027 Confirmed', 'Faculty Coordinator');
  };

  const handleRejectTeam = (id: string) => {
    setTeamApprovals(prev => prev.map(a => a.id === id ? { ...a, status: 'rejected' } : a));
    dataService.logAction('Faculty Rejected Team Position', 'Proposal returned to Club Admin', 'Faculty Coordinator');
  };

  const handleGradeProject = (projectId: string, decision: 'approved' | 'rejected') => {
    const rating = reviewRating[projectId] || 9;
    const remarks = reviewRemarks[projectId] || 'Excellent research engineering prototype.';
    dataService.reviewProject(projectId, decision, rating, remarks, 'Faculty Coordinator');
    alert(`Project marked as ${decision.toUpperCase()} with rating ${rating}/10.`);
  };

  const facultyPills = [
    { id: '1', metric: '5 Supervised', label: 'Technical Clubs', iconBg: 'bg-tag-violet', iconColor: 'text-primary-600', icon: ShieldCheck },
    { id: '2', metric: `${teamApprovals.filter(t => t.status === 'pending').length} Pending`, label: 'Team Approvals', iconBg: 'bg-tag-amber', iconColor: 'text-amber-700', icon: Users },
    { id: '3', metric: '3 Submissions', label: 'Project Reviews', iconBg: 'bg-tag-teal', iconColor: 'text-emerald-700', icon: Trophy }
  ];

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
  if (activeTab === 'teams' || activeTab === 'approvals') {
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
          title="Faculty Advisory & Club Governance Portal"
          subtitle="Sanction club executive appointments, review student research project submissions with qualitative grading, and oversee inter-departmental innovation events."
          buttonText="Export Department Reports"
          buttonLink="/dashboard/faculty-coordinator?tab=reports"
          badgeText="FACULTY ACCOUNTABILITY LAYER"
        />

        <ActivePillsRow pills={facultyPills} />

        {/* 1. Executive Team Approvals Queue */}
        <div className="coursue-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-ink">Executive Team Tenure Approvals Queue</h3>
              <p className="text-[11px] text-ink-muted">Proposed by Club Admins for Academic Year 2026-2027</p>
            </div>
            <span className="text-xs font-bold text-primary-700 bg-primary-50 px-2.5 py-1 rounded-full">
              {teamApprovals.filter(t => t.status === 'pending').length} Actionable
            </span>
          </div>

          <div className="divide-y divide-surface-border">
            {teamApprovals.map((item) => (
              <div key={item.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-ink">{item.student}</span>
                    <span className="text-[10px] font-semibold text-primary-700 bg-primary-50 px-2 py-0.5 rounded-full">
                      {item.position}
                    </span>
                  </div>
                  <p className="text-[11px] text-ink-muted mt-0.5">{item.club} • Academic Year {item.year}</p>
                </div>

                {item.status === 'pending' ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleApproveTeam(item.id)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => handleRejectTeam(item.id)}
                      className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                ) : (
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    item.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {item.status.toUpperCase()}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 2. Project Review & Grading Workflow */}
        <div className="coursue-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-ink">Student Project Review & Showcase Grading</h3>
              <p className="text-[11px] text-ink-muted">Rate prototypes from 1-10 with qualitative feedback</p>
            </div>
            <Link href="/dashboard/faculty-coordinator?tab=projects" className="text-xs font-semibold text-primary-600">
              Showcase Leaderboard →
            </Link>
          </div>

          <div className="space-y-4">
            {projects.slice(0, 2).map((proj) => (
              <div key={proj.id} className="p-4 rounded-2xl bg-surface-muted border border-surface-border space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-ink">{proj.title}</h4>
                    <p className="text-[11px] text-primary-700 font-medium">{proj.club_name} • Submitted by {proj.submitted_by}</p>
                    <p className="text-xs text-ink-muted mt-1 leading-relaxed">{proj.description}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-tag-blue text-primary-700">
                    {proj.domain}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {proj.tech_stack.map((t, idx) => (
                    <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-surface border text-ink-muted">
                      {t}
                    </span>
                  ))}
                </div>

                {/* Rating Input & Actions */}
                <div className="pt-2 border-t border-surface-border flex flex-col sm:flex-row items-center gap-3">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <span className="text-[11px] font-bold text-ink">Rating:</span>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      defaultValue={proj.rating || 9}
                      onChange={(e) => setReviewRating({ ...reviewRating, [proj.id]: Number(e.target.value) })}
                      className="w-16 p-1.5 text-xs text-center border rounded-lg bg-surface font-bold text-primary-700"
                    />
                    <span className="text-xs text-ink-muted">/10</span>
                  </div>

                  <input
                    type="text"
                    placeholder="Enter review remarks..."
                    defaultValue={proj.remarks || ''}
                    onChange={(e) => setReviewRemarks({ ...reviewRemarks, [proj.id]: e.target.value })}
                    className="flex-1 text-xs p-1.5 rounded-lg border bg-surface text-ink"
                  />

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleGradeProject(proj.id, 'approved')}
                      className="px-3 py-1.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold"
                    >
                      Save & Approve
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <HorizontalCardsRow
          title="Upcoming Department Workshops"
          events={events}
        />
      </div>

      <StatRail />
    </div>
  );
}

export default function FacultyCoordinatorDashboardPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-ink-muted">Loading Faculty Advisory Module...</div>}>
      <FacultyContent />
    </Suspense>
  );
}
