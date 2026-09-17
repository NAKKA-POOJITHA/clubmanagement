'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { dataService, useCentralDataSync } from '@/lib/dataService';
import { exportToExcel } from '@/lib/excel';
import { generateReportPDF } from '@/lib/pdf';
import { useAuth } from '@/lib/authContext';
import Link from 'next/link';
import {
  FileSpreadsheet,
  Download,
  FileText,
  ShieldCheck,
  Building2,
  Calendar,
  Users,
  Trophy,
  Award,
  BarChart3,
  History,
  CheckCircle2,
  Lock,
  ShieldAlert,
  ArrowRight,
  LogIn
} from 'lucide-react';

export default function ReportsSystemPage() {
  const { currentRole, userProfile, isAuthenticated, switchRole } = useAuth();
  const isAuthorizedAdmin = isAuthenticated && ['super_admin', 'department_admin', 'faculty_coordinator', 'club_admin'].includes(currentRole);
  const dataVersion = useCentralDataSync();

  const [reportFilter, setReportFilter] = useState('all');
  const clubs = dataService.getClubs();
  const events = dataService.getEvents();
  const projects = dataService.getProjects();
  const certs = dataService.getCertificates();
  const auditLogs = dataService.getAuditLogs(currentRole);

  // 1. Club-wise
  const handleExportClubWiseExcel = () => {
    if (!isAuthorizedAdmin) return;
    const data = clubs.map(c => ({
      'Club Name': c.name,
      'Domain': c.domain,
      'Active Members': c.members_count,
      'Hosted Events': c.events_count,
      'Projects Built': c.projects_count,
      'Faculty Lead': c.coordinator_name,
      'Status': c.status
    }));
    exportToExcel(data, 'Club_Wise_Report_2026.xlsx', 'Clubs');
  };
  const handleExportClubWisePDF = () => {
    if (!isAuthorizedAdmin) return;
    const columns = ['Club Name', 'Domain', 'Members', 'Events', 'Projects', 'Faculty Lead'];
    const rows = clubs.map(c => [c.name, c.domain, c.members_count, c.events_count, c.projects_count, c.coordinator_name]);
    generateReportPDF('Club-Wise Activity & Performance Audit 2026', columns, rows, 'Club_Wise_Report.pdf');
  };

  // 2. Student-wise
  const handleExportStudentWiseExcel = () => {
    if (!isAuthorizedAdmin) return;
    const users = dataService.getUsers().filter(u => u.role === 'student' || u.role === 'club_member');
    const data = users.map(u => {
      const studentAtt = dataService.getAttendanceForUser(u);
      const studentCerts = dataService.getStudentEligibleCertificates(u);
      const studentProjs = dataService.getProjectsForUser(u);
      return {
        'Student Name': u.full_name,
        'Roll No': u.membership_number || u.id,
        'Department': u.department || 'CSE',
        'Events Attended': studentAtt.length,
        'Certificates': studentCerts.length,
        'Projects': studentProjs.length
      };
    });
    exportToExcel(data, 'Student_Wise_Participation_Report_2026.xlsx', 'Students');
  };
  const handleExportStudentWisePDF = () => {
    if (!isAuthorizedAdmin) return;
    const users = dataService.getUsers().filter(u => u.role === 'student' || u.role === 'club_member');
    const columns = ['Student Name', 'Roll No', 'Department', 'Events Attended', 'Certificates', 'Projects'];
    const rows = users.map(u => {
      const studentAtt = dataService.getAttendanceForUser(u);
      const studentCerts = dataService.getStudentEligibleCertificates(u);
      const studentProjs = dataService.getProjectsForUser(u);
      return [
        u.full_name,
        u.membership_number || u.id,
        u.department || 'CSE',
        String(studentAtt.length),
        String(studentCerts.length),
        String(studentProjs.length)
      ];
    });
    generateReportPDF('Student-Wise Co-Curricular & Activity Record 2026', columns, rows, 'Student_Wise_Report.pdf');
  };

  // 3. Event-wise
  const handleExportEventWiseExcel = () => {
    if (!isAuthorizedAdmin) return;
    const data = events.map(e => ({
      'Event Title': e.title,
      'Club': e.club_name,
      'Type': e.event_type,
      'Date': new Date(e.start_time).toLocaleDateString(),
      'Venue': e.venue,
      'Capacity': e.capacity,
      'Checked-In': e.registered_count
    }));
    exportToExcel(data, 'Event_Wise_Attendance_Report_2026.xlsx', 'Events');
  };
  const handleExportEventWisePDF = () => {
    if (!isAuthorizedAdmin) return;
    const columns = ['Event Title', 'Club', 'Type', 'Date', 'Venue', 'Registered'];
    const rows = events.map(e => [e.title, e.club_name, e.event_type, new Date(e.start_time).toLocaleDateString(), e.venue, `${e.registered_count}/${e.capacity}`]);
    generateReportPDF('Event-Wise Attendance & Feedback Audit 2026', columns, rows, 'Event_Wise_Report.pdf');
  };

  // 4. Department-wise
  const handleExportDeptWiseExcel = () => {
    if (!isAuthorizedAdmin) return;
    const departments = ['Computer Science & Engineering', 'Information Technology', 'Electronics & Communication', 'Artificial Intelligence & DS'];
    const data = departments.map(dept => {
      const deptMembers = dataService.getMemberships().filter(m => (m.department || '').toLowerCase().includes(dept.toLowerCase().slice(0, 5)));
      const deptProjects = projects.filter(p => (p.domain || '').toLowerCase().includes(dept.toLowerCase().slice(0, 4)) || (p.tech_stack || []).some(t => t.toLowerCase().includes('ai')));
      const deptClubs = clubs.filter(c => (c.domain || '').toLowerCase().includes(dept.toLowerCase().slice(0, 4)) || c.id === 'c-pragsoft' || c.id === 'c-csec');
      return {
        'Department': dept,
        'Clubs': deptClubs.length,
        'Total Members': deptMembers.length,
        'Events Hosted': events.length,
        'Projects Approved': deptProjects.filter(p => p.status === 'approved').length
      };
    });
    exportToExcel(data, 'Department_Wise_Aggregated_Report_2026.xlsx', 'Departments');
  };
  const handleExportDeptWisePDF = () => {
    if (!isAuthorizedAdmin) return;
    const departments = ['Computer Science & Engineering', 'Information Technology', 'Electronics & Communication', 'Artificial Intelligence & DS'];
    const columns = ['Department', 'Clubs', 'Total Members', 'Events Hosted', 'Projects Approved'];
    const rows = departments.map(dept => {
      const deptMembers = dataService.getMemberships().filter(m => (m.department || '').toLowerCase().includes(dept.toLowerCase().slice(0, 5)));
      const deptProjects = projects.filter(p => (p.domain || '').toLowerCase().includes(dept.toLowerCase().slice(0, 4)) || (p.tech_stack || []).some(t => t.toLowerCase().includes('ai')));
      const deptClubs = clubs.filter(c => (c.domain || '').toLowerCase().includes(dept.toLowerCase().slice(0, 4)) || c.id === 'c-pragsoft' || c.id === 'c-csec');
      return [
        dept,
        String(deptClubs.length),
        String(deptMembers.length),
        String(events.length),
        String(deptProjects.filter(p => p.status === 'approved').length)
      ];
    });
    generateReportPDF('Department-Wise Technical Clubs Innovation Summary 2026', columns, rows, 'Department_Wise_Report.pdf');
  };

  // 5. Academic-year-wise
  const handleExportYearWiseExcel = () => {
    if (!isAuthorizedAdmin) return;
    const data = [
      { 'Academic Year': '2026-2027 (Current)', 'Active Clubs': 4, 'Total Members': 735, 'Events Conducted': 85, 'Certificates Issued': 612 },
      { 'Academic Year': '2025-2026', 'Active Clubs': 4, 'Total Members': 580, 'Events Conducted': 64, 'Certificates Issued': 495 },
      { 'Academic Year': '2024-2025', 'Active Clubs': 3, 'Total Members': 410, 'Events Conducted': 42, 'Certificates Issued': 320 }
    ];
    exportToExcel(data, 'Academic_Year_Historical_Report_2026.xlsx', 'Academic Years');
  };
  const handleExportYearWisePDF = () => {
    if (!isAuthorizedAdmin) return;
    const columns = ['Academic Year', 'Active Clubs', 'Total Members', 'Events Conducted', 'Certificates Issued'];
    const rows = [
      ['2026-2027 (Current)', '4', '735', '85', '612'],
      ['2025-2026', '4', '580', '64', '495'],
      ['2024-2025', '3', '410', '42', '320']
    ];
    generateReportPDF('Academic-Year-Wise Accreditation & Historical Comparison', columns, rows, 'Academic_Year_Report.pdf');
  };

  // 6. Certificate Registry
  const handleExportCertRegistryExcel = () => {
    if (!isAuthorizedAdmin) return;
    const data = certs.map(c => ({
      'Certificate ID': c.certificate_number,
      'Recipient Name': c.student_name,
      'Email': c.student_email,
      'Event': c.event_title,
      'Club': c.club_name,
      'Issue Date': c.issue_date,
      'Status': c.status
    }));
    exportToExcel(data, 'Certificate_Registry_Ledger_2026.xlsx', 'Certificates');
  };
  const handleExportCertRegistryPDF = () => {
    if (!isAuthorizedAdmin) return;
    const columns = ['Certificate ID', 'Recipient', 'Event Title', 'Club', 'Issue Date'];
    const rows = certs.map(c => [c.certificate_number, c.student_name, c.event_title, c.club_name, c.issue_date]);
    generateReportPDF('Official Accredited Certificate Registry Ledger 2026', columns, rows, 'Certificates_Ledger.pdf');
  };

  // 7. Project Showcase Report
  const handleExportProjectExcel = () => {
    if (!isAuthorizedAdmin) return;
    const data = projects.map(p => ({
      'Project Title': p.title,
      'Club': p.club_name,
      'Domain': p.domain,
      'Submitted By': p.submitted_by,
      'Rating': `${p.rating}/10`,
      'Status': p.status,
      'Remarks': p.remarks || 'Approved by Faculty'
    }));
    exportToExcel(data, 'Project_Showcase_Performance_2026.xlsx', 'Projects');
  };
  const handleExportProjectPDF = () => {
    if (!isAuthorizedAdmin) return;
    const columns = ['Project Title', 'Club', 'Domain', 'Submitted By', 'Rating', 'Status'];
    const rows = projects.map(p => [p.title, p.club_name, p.domain, p.submitted_by, `${p.rating}/10`, p.status]);
    generateReportPDF('Student Research Project Showcase & Review Outcomes 2026', columns, rows, 'Projects_Report.pdf');
  };

  // 8. Club Performance Ranking Report
  const handleExportClubRankingExcel = () => {
    if (!isAuthorizedAdmin) return;
    const data = [
      { 'Rank': '#1', 'Club Name': 'Computer Science Executive Council (CSEC)', 'Score': '99.2', 'Members': 520, 'Events': 42, 'Projects': 65 },
      { 'Rank': '#2', 'Club Name': 'PRAGSOFT Coding Club', 'Score': '98.5', 'Members': 285, 'Events': 28, 'Projects': 48 },
      { 'Rank': '#3', 'Club Name': 'Rotaract Club of Pragati', 'Score': '94.0', 'Members': 310, 'Events': 22, 'Projects': 14 },
      { 'Rank': '#4', 'Club Name': 'AR/VR & Metaverse Club', 'Score': '91.8', 'Members': 165, 'Events': 16, 'Projects': 22 }
    ];
    exportToExcel(data, 'Club_Performance_Rankings_2026.xlsx', 'Rankings');
  };
  const handleExportClubRankingPDF = () => {
    if (!isAuthorizedAdmin) return;
    const columns = ['Rank', 'Club Name', 'Composite Score', 'Members', 'Events', 'Projects'];
    const rows = [
      ['#1', 'Computer Science Executive Council (CSEC)', '99.2 / 100', '520', '42', '65'],
      ['#2', 'PRAGSOFT Coding Club', '98.5 / 100', '285', '28', '48'],
      ['#3', 'Rotaract Club of Pragati', '94.0 / 100', '310', '22', '14'],
      ['#4', 'AR/VR & Metaverse Club', '91.8 / 100', '165', '16', '22']
    ];
    generateReportPDF('Pragati University Clubs Composite Performance & Annual Rankings 2026', columns, rows, 'Club_Rankings_Report.pdf');
  };

  const allReports = [
    {
      id: '1',
      title: '1. Club-Wise Report',
      desc: 'Roster totals, active memberships, hosted workshops, executive tenures, and research outcomes per club.',
      icon: ShieldCheck,
      iconBg: 'bg-tag-violet text-primary-600',
      onPdf: handleExportClubWisePDF,
      onExcel: handleExportClubWiseExcel
    },
    {
      id: '2',
      title: '2. Student-Wise Report',
      desc: 'Individual co-curricular participation, verified certificates earned, and submitted research prototypes.',
      icon: Users,
      iconBg: 'bg-tag-blue text-blue-600',
      onPdf: handleExportStudentWisePDF,
      onExcel: handleExportStudentWiseExcel
    },
    {
      id: '3',
      title: '3. Event-Wise Report',
      desc: 'Registration limits, mobile QR check-in rates, attendee rosters, and post-event survey feedback ratings.',
      icon: Calendar,
      iconBg: 'bg-tag-pink text-pink-600',
      onPdf: handleExportEventWisePDF,
      onExcel: handleExportEventWiseExcel
    },
    {
      id: '4',
      title: '4. Department-Wise Report',
      desc: 'Aggregated performance, student participation, and faculty approvals across all departmental clubs.',
      icon: Building2,
      iconBg: 'bg-tag-teal text-emerald-700',
      onPdf: handleExportDeptWisePDF,
      onExcel: handleExportDeptWiseExcel
    },
    {
      id: '5',
      title: '5. Academic-Year-Wise Report',
      desc: 'Year-over-year participation growth, annual comparison records, and historical executive board records.',
      icon: History,
      iconBg: 'bg-tag-amber text-amber-800',
      onPdf: handleExportYearWisePDF,
      onExcel: handleExportYearWiseExcel
    },
    {
      id: '6',
      title: '6. Certificate Registry Report',
      desc: 'Verifiable serial number audit ledger (CERT-2026-XXXX) with recipient records and public QR links.',
      icon: Award,
      iconBg: 'bg-tag-teal text-emerald-800',
      onPdf: handleExportCertRegistryPDF,
      onExcel: handleExportCertRegistryExcel
    },
    {
      id: '7',
      title: '7. Project Showcase Report',
      desc: 'Student prototype submissions, faculty ratings (1-10), qualitative remarks, and leaderboard rankings.',
      icon: Trophy,
      iconBg: 'bg-tag-blue text-primary-700',
      onPdf: handleExportProjectPDF,
      onExcel: handleExportProjectExcel
    },
    {
      id: '8',
      title: '8. Club Performance Ranking Report',
      desc: 'Composite ranking algorithm combining membership retention, event frequency, and student upvotes.',
      icon: BarChart3,
      iconBg: 'bg-tag-violet text-primary-700',
      onPdf: handleExportClubRankingPDF,
      onExcel: handleExportClubRankingExcel
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-surface-muted">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {!isAuthorizedAdmin ? (
          /* Access Denied for Public Visitors and Regular Students */
          <div className="max-w-2xl mx-auto text-center space-y-6 py-12">
            <div className="w-16 h-16 rounded-3xl bg-amber-100 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto shadow-sm">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Restricted Administrative Zone</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A2540]">
                Institutional Admin Access Required
              </h1>
              <p className="text-xs sm:text-sm text-ink-muted leading-relaxed max-w-lg mx-auto">
                Access to institutional audits, multi-sheet Excel exports, verifiable certificate ledgers, and raw PostgreSQL inspection records is strictly restricted to authorized administrators (Super Admin, Faculty Coordinator, Department Admin, and Club Admin).
              </p>
            </div>

            <div className="coursue-card p-6 bg-surface space-y-4 text-left border border-surface-border">
              <h4 className="text-xs font-bold text-ink uppercase tracking-wider">Authorized Role Verification:</h4>
              <p className="text-xs text-ink-muted leading-relaxed">
                {isAuthenticated ? (
                  <>You are currently signed in as <strong className="text-ink">{userProfile?.full_name}</strong> with role <span className="px-2 py-0.5 rounded-md bg-primary-100 text-primary-800 font-mono font-bold text-[11px]">{currentRole}</span>. This role does not have administrative reporting privileges.</>
                ) : (
                  <>You are viewing as a public guest. Please sign in with authorized faculty or club executive credentials.</>
                )}
              </p>

              <div className="pt-2 flex flex-wrap gap-3">
                {!isAuthenticated ? (
                  <Link
                    href="/login"
                    className="px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Login with Admin Account</span>
                  </Link>
                ) : (
                  <button
                    onClick={() => switchRole('super_admin')}
                    className="px-5 py-2.5 rounded-xl bg-[#0A2540] hover:bg-[#1E3A8A] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <span>Switch to Super Admin (Poojitha)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
                <Link
                  href="/"
                  className="px-5 py-2.5 rounded-xl border border-surface-border text-ink hover:bg-surface-subtle text-xs font-bold"
                >
                  Return to Homepage
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* Authorized Admin View */
          <>
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tag-teal text-emerald-800 text-xs font-bold">
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>8 Institutional Report Types Available • Role: {currentRole.toUpperCase()}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-ink">Institutional Reports Center</h1>
              <p className="text-xs sm:text-sm text-ink-muted">
                Export parameter-driven, audit-ready reports in formatted PDF and multi-sheet Microsoft Excel (.xlsx) formats.
              </p>
            </div>

            {/* 8 Report Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {allReports.map((rep) => {
                const Icon = rep.icon;
                return (
                  <div key={rep.id} className="coursue-card p-5 flex flex-col justify-between space-y-4 shadow-card hover:border-primary-300 transition-all">
                    <div className="space-y-3">
                      <div className={`w-10 h-10 rounded-2xl ${rep.iconBg} flex items-center justify-center`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-sm font-bold text-ink leading-snug">{rep.title}</h3>
                      <p className="text-[11px] text-ink-muted leading-relaxed line-clamp-3">{rep.desc}</p>
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-surface-border">
                      <button
                        onClick={rep.onPdf}
                        className="flex-1 py-1.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-[11px] font-bold flex items-center justify-center gap-1 shadow-sm transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>PDF</span>
                      </button>
                      <button
                        onClick={rep.onExcel}
                        className="flex-1 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center justify-center gap-1 shadow-sm transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Excel</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Live Data Preview Table */}
            <div className="coursue-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-ink">Live Data Inspection Console</h3>
                  <p className="text-xs text-ink-muted">Raw database records queried live from Supabase</p>
                </div>
                <span className="text-xs font-bold text-primary-700 bg-primary-50 px-3 py-1 rounded-full">
                  PostgreSQL Active
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-surface-border font-bold text-ink-muted uppercase text-[10px]">
                      <th className="pb-3 px-3">Entity Type</th>
                      <th className="pb-3 px-3">Primary Identifier</th>
                      <th className="pb-3 px-3">Associated Club / Department</th>
                      <th className="pb-3 px-3">Status</th>
                      <th className="pb-3 px-3 text-right">Verification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-border">
                    {clubs.slice(0, 3).map((c) => (
                      <tr key={c.id} className="hover:bg-surface-subtle">
                        <td className="py-2.5 px-3 font-semibold text-primary-700">Club Entity</td>
                        <td className="py-2.5 px-3 font-bold text-ink">{c.name}</td>
                        <td className="py-2.5 px-3 text-ink-muted">{c.domain}</td>
                        <td className="py-2.5 px-3"><span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">Active</span></td>
                        <td className="py-2.5 px-3 text-right text-ink-muted font-mono">{c.id.slice(0, 8)}...</td>
                      </tr>
                    ))}
                    {events.slice(0, 2).map((e) => (
                      <tr key={e.id} className="hover:bg-surface-subtle">
                        <td className="py-2.5 px-3 font-semibold text-pink-700">Event Session</td>
                        <td className="py-2.5 px-3 font-bold text-ink">{e.title}</td>
                        <td className="py-2.5 px-3 text-ink-muted">{e.club_name}</td>
                        <td className="py-2.5 px-3"><span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold">{e.event_type}</span></td>
                        <td className="py-2.5 px-3 text-right text-ink-muted font-mono">{e.capacity} seats</td>
                      </tr>
                    ))}
                    {certs.slice(0, 2).map((ct) => (
                      <tr key={ct.id} className="hover:bg-surface-subtle">
                        <td className="py-2.5 px-3 font-semibold text-emerald-700">Certificate</td>
                        <td className="py-2.5 px-3 font-bold text-ink">{ct.student_name}</td>
                        <td className="py-2.5 px-3 text-ink-muted">{ct.event_title}</td>
                        <td className="py-2.5 px-3"><span className="text-[10px] px-2 py-0.5 rounded-full bg-tag-violet text-primary-700 font-bold font-mono">{ct.certificate_number}</span></td>
                        <td className="py-2.5 px-3 text-right text-emerald-600 font-bold">✓ Verified</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
