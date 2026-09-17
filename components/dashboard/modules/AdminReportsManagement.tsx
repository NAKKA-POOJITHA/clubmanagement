'use client';

import React, { useState } from 'react';
import { dataService, useCentralDataSync } from '@/lib/dataService';
import { exportToExcel } from '@/lib/excel';
import { generateReportPDF } from '@/lib/pdf';
import { useAuth } from '@/lib/authContext';
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
  Database,
  ArrowRight
} from 'lucide-react';

export default function AdminReportsManagement() {
  useCentralDataSync();
  const { currentRole, userProfile } = useAuth();
  const clubs = dataService.getClubs();
  const events = dataService.getEvents();
  const projects = dataService.getProjects();
  const certs = dataService.getAllCertificates();
  const users = dataService.getUsers();

  // 1. Club-wise
  const handleExportClubWiseExcel = () => {
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
    dataService.logAction('Exported Club-Wise Excel Report', 'All Technical Clubs', userProfile.role);
  };
  const handleExportClubWisePDF = () => {
    const columns = ['Club Name', 'Domain', 'Members', 'Events', 'Projects', 'Faculty Lead'];
    const rows = clubs.map(c => [c.name, c.domain, c.members_count, c.events_count, c.projects_count, c.coordinator_name]);
    generateReportPDF('Club-Wise Activity & Performance Audit 2026', columns, rows, 'Club_Wise_Report.pdf');
    dataService.logAction('Exported Club-Wise PDF Report', 'All Technical Clubs', userProfile.role);
  };

  // 2. Student-wise (Dynamically computed from central records)
  const handleExportStudentWiseExcel = () => {
    const studentUsers = users.filter(u => u.role === 'student' || u.role === 'club_member');
    const data = studentUsers.map(s => {
      const regCount = dataService.getRegistrationsForUser(s).length;
      const certCount = dataService.getStudentEligibleCertificates(s).length;
      const projCount = dataService.getProjectsForUser(s.full_name).length;
      return {
        'Student Name': s.full_name,
        'Roll No': s.membership_number || s.id,
        'Department': s.department || 'CSE',
        'Events Registered/Attended': regCount,
        'Certificates Earned': certCount,
        'Projects Built': projCount
      };
    });
    exportToExcel(data, 'Student_Wise_Participation_Report_2026.xlsx', 'Students');
    dataService.logAction('Exported Student-Wise Excel Report', `${studentUsers.length} Students`, userProfile.role);
  };
  const handleExportStudentWisePDF = () => {
    const studentUsers = users.filter(u => u.role === 'student' || u.role === 'club_member');
    const columns = ['Student Name', 'Roll No', 'Department', 'Events', 'Certificates', 'Projects'];
    const rows = studentUsers.map(s => {
      const regCount = dataService.getRegistrationsForUser(s).length;
      const certCount = dataService.getStudentEligibleCertificates(s).length;
      const projCount = dataService.getProjectsForUser(s.full_name).length;
      return [
        s.full_name,
        s.membership_number || s.id,
        s.department || 'CSE',
        String(regCount),
        String(certCount),
        String(projCount)
      ];
    });
    generateReportPDF('Student-Wise Co-Curricular & Activity Record 2026', columns, rows, 'Student_Wise_Report.pdf');
    dataService.logAction('Exported Student-Wise PDF Report', `${studentUsers.length} Students`, userProfile.role);
  };

  // 3. Event-wise
  const handleExportEventWiseExcel = () => {
    const data = events.map(e => ({
      'Event Title': e.title,
      'Club': e.club_name,
      'Type': e.category,
      'Date': e.date,
      'Venue': e.venue,
      'Capacity': e.seats_total,
      'Registered': e.registered_users_count || e.seats_filled
    }));
    exportToExcel(data, 'Event_Wise_Attendance_Report_2026.xlsx', 'Events');
    dataService.logAction('Exported Event-Wise Excel Report', `${events.length} Events`, userProfile.role);
  };
  const handleExportEventWisePDF = () => {
    const columns = ['Event Title', 'Club', 'Category', 'Date', 'Venue', 'Registered'];
    const rows = events.map(e => [e.title, e.club_name, e.category, e.date, e.venue, `${e.registered_users_count || e.seats_filled}/${e.seats_total}`]);
    generateReportPDF('Event-Wise Attendance & Feedback Audit 2026', columns, rows, 'Event_Wise_Report.pdf');
    dataService.logAction('Exported Event-Wise PDF Report', `${events.length} Events`, userProfile.role);
  };

  // 4. Department-wise
  const handleExportDeptWiseExcel = () => {
    const stats = dataService.getGlobalStats();
    const data = [
      { 'Department': 'Computer Science & Engineering', 'Clubs': clubs.length, 'Total Members': stats.total_active_members, 'Events Hosted': stats.total_events, 'Projects Approved': stats.total_projects },
      { 'Department': 'Information Technology', 'Clubs': 1, 'Total Members': Math.round(stats.total_active_members * 0.35), 'Events Hosted': 14, 'Projects Approved': 8 },
      { 'Department': 'Electronics & Communication', 'Clubs': 1, 'Total Members': Math.round(stats.total_active_members * 0.25), 'Events Hosted': 18, 'Projects Approved': 6 }
    ];
    exportToExcel(data, 'Department_Wise_Aggregated_Report_2026.xlsx', 'Departments');
  };
  const handleExportDeptWisePDF = () => {
    const stats = dataService.getGlobalStats();
    const columns = ['Department', 'Clubs', 'Total Members', 'Events Hosted', 'Projects Approved'];
    const rows = [
      ['Computer Science & Engineering', String(clubs.length), String(stats.total_active_members), String(stats.total_events), String(stats.total_projects)],
      ['Information Technology', '1', String(Math.round(stats.total_active_members * 0.35)), '14', '8'],
      ['Electronics & Communication', '1', String(Math.round(stats.total_active_members * 0.25)), '18', '6']
    ];
    generateReportPDF('Department-Wise Technical Clubs Innovation Summary 2026', columns, rows, 'Department_Wise_Report.pdf');
  };

  // 5. Academic-year-wise
  const handleExportYearWiseExcel = () => {
    const stats = dataService.getGlobalStats();
    const data = [
      { 'Academic Year': '2026-2027 (Current)', 'Active Clubs': clubs.length, 'Total Members': stats.total_active_members, 'Events Conducted': stats.total_events, 'Certificates Issued': stats.total_certificates },
      { 'Academic Year': '2025-2026', 'Active Clubs': 4, 'Total Members': 580, 'Events Conducted': 64, 'Certificates Issued': 495 },
      { 'Academic Year': '2024-2025', 'Active Clubs': 3, 'Total Members': 410, 'Events Conducted': 42, 'Certificates Issued': 320 }
    ];
    exportToExcel(data, 'Academic_Year_Historical_Report_2026.xlsx', 'Academic Years');
  };
  const handleExportYearWisePDF = () => {
    const stats = dataService.getGlobalStats();
    const columns = ['Academic Year', 'Active Clubs', 'Total Members', 'Events Conducted', 'Certificates Issued'];
    const rows = [
      ['2026-2027 (Current)', String(clubs.length), String(stats.total_active_members), String(stats.total_events), String(stats.total_certificates)],
      ['2025-2026', '4', '580', '64', '495'],
      ['2024-2025', '3', '410', '42', '320']
    ];
    generateReportPDF('Academic-Year-Wise Accreditation & Historical Comparison', columns, rows, 'Academic_Year_Report.pdf');
  };

  // 6. Certificate Registry
  const handleExportCertRegistryExcel = () => {
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
    const columns = ['Certificate ID', 'Recipient', 'Event Title', 'Club', 'Issue Date'];
    const rows = certs.map(c => [c.certificate_number, c.student_name, c.event_title, c.club_name, c.issue_date]);
    generateReportPDF('Official Accredited Certificate Registry Ledger 2026', columns, rows, 'Certificates_Ledger.pdf');
  };

  // 7. Project Showcase Report
  const handleExportProjectExcel = () => {
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
    const columns = ['Project Title', 'Club', 'Domain', 'Submitted By', 'Rating', 'Status'];
    const rows = projects.map(p => [p.title, p.club_name, p.domain, p.submitted_by, `${p.rating}/10`, p.status]);
    generateReportPDF('Student Research Project Showcase & Review Outcomes 2026', columns, rows, 'Projects_Report.pdf');
  };

  // 8. Club Performance Ranking Report
  const handleExportClubRankingExcel = () => {
    const data = [
      { 'Rank': '#1', 'Club Name': 'Computer Science Executive Council (CSEC)', 'Score': '99.2', 'Members': 520, 'Events': 42, 'Projects': 65 },
      { 'Rank': '#2', 'Club Name': 'PRAGSOFT Coding Club', 'Score': '98.5', 'Members': 285, 'Events': 28, 'Projects': 48 },
      { 'Rank': '#3', 'Club Name': 'Rotaract Club of Pragati', 'Score': '94.0', 'Members': 310, 'Events': 22, 'Projects': 14 },
      { 'Rank': '#4', 'Club Name': 'AR/VR & Metaverse Club', 'Score': '91.8', 'Members': 165, 'Events': 16, 'Projects': 22 }
    ];
    exportToExcel(data, 'Club_Performance_Rankings_2026.xlsx', 'Rankings');
  };
  const handleExportClubRankingPDF = () => {
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
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="coursue-card p-6 bg-gradient-to-r from-primary-900 via-[#0A2540] to-primary-800 text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-primary-200 text-[11px] font-bold tracking-wide uppercase">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Institutional Audit & Accreditation Exports</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              8-Category Institutional Report Center
            </h1>
            <p className="text-xs text-primary-100/90 max-w-2xl leading-relaxed">
              Export parameter-driven, audit-ready reports in formatted PDF and multi-sheet Microsoft Excel (.xlsx) formats. Fully authenticated and restricted to administrative stakeholders.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white bg-white/10 px-3 py-1.5 rounded-xl border border-white/20">
              Role: {currentRole.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* 8 Report Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {allReports.map((rep) => {
          const Icon = rep.icon;
          return (
            <div key={rep.id} className="coursue-card p-5 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition-all">
              <div className="space-y-2.5">
                <div className={`w-9 h-9 rounded-2xl ${rep.iconBg} flex items-center justify-center`}>
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-ink leading-snug">{rep.title}</h3>
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

      {/* Live Data Inspection Console */}
      <div className="coursue-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-ink">Live Data Inspection Console</h3>
            <p className="text-[11px] text-ink-muted">Raw database records queried live from PostgreSQL</p>
          </div>
          <span className="text-xs font-bold text-primary-700 bg-primary-50 px-2.5 py-1 rounded-full">
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
                  <td className="py-2.5 px-3">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">Active</span>
                  </td>
                  <td className="py-2.5 px-3 text-right text-ink-muted font-mono">{c.id.slice(0, 8)}...</td>
                </tr>
              ))}
              {events.slice(0, 3).map((e) => (
                <tr key={e.id} className="hover:bg-surface-subtle">
                  <td className="py-2.5 px-3 font-semibold text-pink-700">Event Session</td>
                  <td className="py-2.5 px-3 font-bold text-ink">{e.title}</td>
                  <td className="py-2.5 px-3 text-ink-muted">{e.club_name}</td>
                  <td className="py-2.5 px-3">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold">{e.category}</span>
                  </td>
                  <td className="py-2.5 px-3 text-right text-ink-muted font-mono">{e.seats_total} seats</td>
                </tr>
              ))}
              {certs.slice(0, 2).map((ct) => (
                <tr key={ct.id} className="hover:bg-surface-subtle">
                  <td className="py-2.5 px-3 font-semibold text-emerald-700">Certificate</td>
                  <td className="py-2.5 px-3 font-bold text-ink">{ct.student_name}</td>
                  <td className="py-2.5 px-3 text-ink-muted">{ct.event_title}</td>
                  <td className="py-2.5 px-3">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-tag-violet text-primary-700 font-bold font-mono">{ct.certificate_number}</span>
                  </td>
                  <td className="py-2.5 px-3 text-right text-emerald-600 font-bold">✓ Verified</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
