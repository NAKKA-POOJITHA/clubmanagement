'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Network, Sparkles, Layers, ShieldCheck, Calendar, Trophy, FileSpreadsheet, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function WorkflowArchitecturePage() {
  const [activeTab, setActiveTab] = useState<'human' | 'event' | 'rbac' | 'reports'>('human');

  return (
    <div className="min-h-screen flex flex-col bg-surface-muted">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tag-violet text-primary-700 text-xs font-bold">
            <Network className="w-3.5 h-3.5" />
            <span>Full System Theory, Flows & Architecture</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-ink">System Workflow & Architecture Blueprint</h1>
          <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
            A comprehensive visual blueprint explaining how human stakeholders, PostgreSQL Row-Level Security, automated event pipelines, and report compilation engines connect end-to-end.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('human')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'human'
                ? 'bg-primary-600 text-white shadow-glow'
                : 'bg-surface border border-surface-border text-ink hover:bg-surface-subtle'
            }`}
          >
            👥 Full Human Workflow
          </button>
          <button
            onClick={() => setActiveTab('event')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'event'
                ? 'bg-primary-600 text-white shadow-glow'
                : 'bg-surface border border-surface-border text-ink hover:bg-surface-subtle'
            }`}
          >
            ⚡ Event Automation Pipeline
          </button>
          <button
            onClick={() => setActiveTab('rbac')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'rbac'
                ? 'bg-primary-600 text-white shadow-glow'
                : 'bg-surface border border-surface-border text-ink hover:bg-surface-subtle'
            }`}
          >
            🔐 RBAC & Row-Level Security
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'reports'
                ? 'bg-primary-600 text-white shadow-glow'
                : 'bg-surface border border-surface-border text-ink hover:bg-surface-subtle'
            }`}
          >
            📊 8 Report Types Matrix
          </button>
        </div>

        {/* Tab 1: Human Workflow */}
        {activeTab === 'human' && (
          <div className="space-y-6">
            <div className="coursue-card p-6 sm:p-8 space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-ink">The Full Human Workflow & Data Pathways</h2>
                <p className="text-xs text-ink-muted leading-relaxed">
                  How the 4 primary stakeholder groups enter through the central Supabase Auth & RBAC gateway, interact with core modules, and receive cryptographically verified artifacts.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. Purple Tier */}
                <div className="p-5 rounded-3xl bg-primary-50 border border-primary-200 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary-600 text-white flex items-center justify-center text-xs font-bold">1</span>
                    <h3 className="text-sm font-bold text-primary-900">Stakeholder Input Tier</h3>
                  </div>
                  <ul className="text-xs text-primary-800 space-y-2 list-disc list-inside">
                    <li><strong>Students:</strong> Self-register with College ID, view 3D QR pass, register for events.</li>
                    <li><strong>Club Admins:</strong> Create workshops, generate canvas posters, scan QR attendance.</li>
                    <li><strong>Faculty Coordinators:</strong> Sanction team appointments & grade project prototypes.</li>
                    <li><strong>Super Admin:</strong> Platform owner managing user roles and system audit logs.</li>
                  </ul>
                </div>

                {/* 2. Teal Tier */}
                <div className="p-5 rounded-3xl bg-tag-teal/60 border border-teal-300 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-teal-800 text-white flex items-center justify-center text-xs font-bold">2</span>
                    <h3 className="text-sm font-bold text-teal-950">Central Gateway & Processing</h3>
                  </div>
                  <ul className="text-xs text-teal-900 space-y-2 list-disc list-inside">
                    <li><strong>Supabase Auth:</strong> Issues JWT claims carrying user role and email verification.</li>
                    <li><strong>PostgreSQL RLS:</strong> Evaluates row-level scope on every read/write query.</li>
                    <li><strong>Reactive Automation:</strong> Handles waitlists, check-in matches, and certificate triggers.</li>
                  </ul>
                </div>

                {/* 3. Output Tier */}
                <div className="p-5 rounded-3xl bg-surface-muted border border-surface-border space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-ink text-white flex items-center justify-center text-xs font-bold">3</span>
                    <h3 className="text-sm font-bold text-ink">Generated Artifacts & Outputs</h3>
                  </div>
                  <ul className="text-xs text-ink-muted space-y-2 list-disc list-inside">
                    <li><strong>Verified Certificates:</strong> Unique serial number + high-res PDF + QR check URL.</li>
                    <li><strong>Institutional Reports:</strong> Multi-sheet Excel (.xlsx) and printable PDF reports.</li>
                    <li><strong>Realtime Notifications:</strong> In-app popover and transactional alerts.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Event Pipeline */}
        {activeTab === 'event' && (
          <div className="coursue-card p-6 sm:p-8 space-y-6">
            <h2 className="text-xl font-bold text-ink">8-Stage Automated Event Lifecycle</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-surface-muted border border-surface-border space-y-1">
                <span className="text-[10px] font-bold text-primary-600 uppercase">Stage 1</span>
                <h4 className="text-xs font-bold text-ink">Create Event</h4>
                <p className="text-[11px] text-ink-muted">Club Admin sets title, date, capacity, venue & eligibility.</p>
              </div>
              <div className="p-4 rounded-2xl bg-surface-muted border border-surface-border space-y-1">
                <span className="text-[10px] font-bold text-primary-600 uppercase">Stage 2</span>
                <h4 className="text-xs font-bold text-ink">Poster & Circular</h4>
                <p className="text-[11px] text-ink-muted">Canvas template auto-renders high-res downloadable banner.</p>
              </div>
              <div className="p-4 rounded-2xl bg-surface-muted border border-surface-border space-y-1">
                <span className="text-[10px] font-bold text-primary-600 uppercase">Stage 3</span>
                <h4 className="text-xs font-bold text-ink">Registration & Waitlist</h4>
                <p className="text-[11px] text-ink-muted">Students register; capacity limits trigger auto-waitlist queue.</p>
              </div>
              <div className="p-4 rounded-2xl bg-surface-muted border border-surface-border space-y-1">
                <span className="text-[10px] font-bold text-primary-600 uppercase">Stage 4</span>
                <h4 className="text-xs font-bold text-ink">Live QR Check-in</h4>
                <p className="text-[11px] text-ink-muted">Admin scans membership card QR code at venue entrance.</p>
              </div>
              <div className="p-4 rounded-2xl bg-surface-muted border border-surface-border space-y-1">
                <span className="text-[10px] font-bold text-primary-600 uppercase">Stage 5</span>
                <h4 className="text-xs font-bold text-ink">Attendance Insert</h4>
                <p className="text-[11px] text-ink-muted">Database logs timestamp and verified attendee profile.</p>
              </div>
              <div className="p-4 rounded-2xl bg-surface-muted border border-surface-border space-y-1">
                <span className="text-[10px] font-bold text-primary-600 uppercase">Stage 6</span>
                <h4 className="text-xs font-bold text-ink">Feedback Collection</h4>
                <p className="text-[11px] text-ink-muted">Student submits 1-5 star survey & qualitative remarks.</p>
              </div>
              <div className="p-4 rounded-2xl bg-surface-muted border border-surface-border space-y-1 bg-gradient-to-br from-primary-50 to-primary-100/50 border-primary-200">
                <span className="text-[10px] font-bold text-primary-700 uppercase">Stage 7</span>
                <h4 className="text-xs font-bold text-ink">Auto-Certificate</h4>
                <p className="text-[11px] text-ink-muted">Trigger verifies attendance + feedback, issues instant PDF certificate.</p>
              </div>
              <div className="p-4 rounded-2xl bg-surface-muted border border-surface-border space-y-1">
                <span className="text-[10px] font-bold text-primary-600 uppercase">Stage 8</span>
                <h4 className="text-xs font-bold text-ink">Compiled Report</h4>
                <p className="text-[11px] text-ink-muted">Exports complete attendance & feedback analytics to Excel/PDF.</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: RBAC */}
        {activeTab === 'rbac' && (
          <div className="coursue-card p-6 sm:p-8 space-y-6">
            <h2 className="text-xl font-bold text-ink">Role Scoping & Row-Level Security (RLS)</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-surface-border font-bold text-ink-muted uppercase text-[10px]">
                    <th className="pb-3 px-3">Role Hierarchy</th>
                    <th className="pb-3 px-3">Enforced Scope</th>
                    <th className="pb-3 px-3">Database Write Privileges</th>
                    <th className="pb-3 px-3">Primary User Dashboard</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  <tr>
                    <td className="py-3 px-3 font-bold text-ink">Student</td>
                    <td className="py-3 px-3 text-ink-muted">Self (user_id)</td>
                    <td className="py-3 px-3">Register, submit feedback, submit projects</td>
                    <td className="py-3 px-3 text-primary-600 font-semibold">/dashboard/student</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-bold text-ink">Club Member</td>
                    <td className="py-3 px-3 text-ink-muted">Self + Club</td>
                    <td className="py-3 px-3">Same + member-exclusive discussions & workshops</td>
                    <td className="py-3 px-3 text-primary-600 font-semibold">/dashboard/club-member</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-bold text-ink">Club Admin</td>
                    <td className="py-3 px-3 text-ink-muted">Own Club (club_id)</td>
                    <td className="py-3 px-3">Create events, posters, scan QR attendance</td>
                    <td className="py-3 px-3 text-primary-600 font-semibold">/dashboard/club-admin</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-bold text-ink">Faculty Coordinator</td>
                    <td className="py-3 px-3 text-ink-muted">Supervised Clubs</td>
                    <td className="py-3 px-3">Approve executive team tenures, grade project prototypes</td>
                    <td className="py-3 px-3 text-primary-600 font-semibold">/dashboard/faculty-coordinator</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-bold text-ink">Department Admin</td>
                    <td className="py-3 px-3 text-ink-muted">Department-wide</td>
                    <td className="py-3 px-3">Department moderation, inter-club event approvals</td>
                    <td className="py-3 px-3 text-primary-600 font-semibold">/dashboard/department-admin</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-bold text-primary-700">Super Admin (Nakka Poojitha)</td>
                    <td className="py-3 px-3 font-bold text-primary-700">Platform-wide</td>
                    <td className="py-3 px-3 font-semibold">Unrestricted access, global user roles, audit log viewer</td>
                    <td className="py-3 px-3 text-primary-700 font-bold">/dashboard/super-admin</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: 8 Report Types */}
        {activeTab === 'reports' && (
          <div className="coursue-card p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-ink">8 Institutional Exportable Report Types</h2>
                <p className="text-xs text-ink-muted">All downloadable on demand in PDF and Microsoft Excel format</p>
              </div>
              <Link href="/reports" className="px-4 py-2 rounded-xl bg-primary-600 text-white text-xs font-bold">
                Open Reports Center →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-surface-muted border space-y-1">
                <h4 className="font-bold text-ink">1. Club-Wise Report</h4>
                <p className="text-ink-muted">Activity, active membership count, events run, and research outcomes per club.</p>
              </div>
              <div className="p-4 rounded-2xl bg-surface-muted border space-y-1">
                <h4 className="font-bold text-ink">2. Student-Wise Report</h4>
                <p className="text-ink-muted">Individual participation history, certificates earned, and submitted prototypes.</p>
              </div>
              <div className="p-4 rounded-2xl bg-surface-muted border space-y-1">
                <h4 className="font-bold text-ink">3. Event-Wise Report</h4>
                <p className="text-ink-muted">Registrations, QR attendance rates, feedback ratings, and speaker details.</p>
              </div>
              <div className="p-4 rounded-2xl bg-surface-muted border space-y-1">
                <h4 className="font-bold text-ink">4. Department-Wise Report</h4>
                <p className="text-ink-muted">Aggregated performance and participation metrics across departmental clubs.</p>
              </div>
              <div className="p-4 rounded-2xl bg-surface-muted border space-y-1">
                <h4 className="font-bold text-ink">5. Academic-Year-Wise Report</h4>
                <p className="text-ink-muted">Year-over-year participation growth and historical executive board records.</p>
              </div>
              <div className="p-4 rounded-2xl bg-surface-muted border space-y-1">
                <h4 className="font-bold text-ink">6. Certificate Registry Report</h4>
                <p className="text-ink-muted">Serial ID audit ledger (`CERT-2026-XXXX`) with recipient records & verification links.</p>
              </div>
              <div className="p-4 rounded-2xl bg-surface-muted border space-y-1">
                <h4 className="font-bold text-ink">7. Project Showcase Report</h4>
                <p className="text-ink-muted">Prototype submission ratings, faculty grading remarks, and leaderboard rankings.</p>
              </div>
              <div className="p-4 rounded-2xl bg-surface-muted border space-y-1">
                <h4 className="font-bold text-ink">8. Club Performance Ranking Report</h4>
                <p className="text-ink-muted">Composite metric combining retention, workshop frequency, and student upvotes.</p>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
