'use client';

import React, { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { dataService, useCentralDataSync } from '@/lib/dataService';
import MembershipCardModal from '@/components/dashboard/MembershipCardModal';
import Link from 'next/link';
import {
  Sparkles,
  Calendar,
  CreditCard,
  Award,
  BookOpen,
  Trophy,
  Users,
  Layers,
  CheckCircle2,
  Clock,
  ArrowRight,
  MapPin,
  ShieldCheck,
  TrendingUp,
  Flame,
  QrCode,
  Bell,
  Settings as SettingsIcon,
  ExternalLink,
  ChevronRight,
  Download,
  Eye,
  UserCheck,
  UserPlus
} from 'lucide-react';
import { generateCertificatePDF } from '@/lib/pdf';
import { CertificateRecord } from '@/lib/demoData';
import CertificateViewerModal from '@/components/CertificateViewerModal';

// Sub-modules
import AdminProjectsManagement from '@/components/dashboard/modules/AdminProjectsManagement';
import AdminRoadmapsManagement from '@/components/dashboard/modules/AdminRoadmapsManagement';
import AdminToolsManagement from '@/components/dashboard/modules/AdminToolsManagement';
import AdminGalleryManagement from '@/components/dashboard/modules/AdminGalleryManagement';
import AdminDigitalIdManagement from '@/components/dashboard/modules/AdminDigitalIdManagement';

function StudentOverview() {
  const { userProfile } = useAuth();
  const [showCardModal, setShowCardModal] = useState(false);
  const dataVersion = useCentralDataSync();

  const events = dataService.getEvents();
  const allClubs = dataService.getClubs();
  const userMemberships = dataService.getMembershipsForUser(userProfile?.id || userProfile?.email);
  const myClubs = allClubs.filter(c =>
    userMemberships.some(m => m.clubId === c.id || m.clubName.toLowerCase().includes(c.slug.toLowerCase()))
  );
  const certs = dataService.getStudentEligibleCertificates(userProfile);
  const studentProjects = dataService.getProjectsForUser(userProfile);
  const userRegistrations = dataService.getRegistrationsForUser(userProfile);

  // Progress metrics
  const learningProgress = 68;

  const notifications = dataService.getNotificationsForUser(userProfile?.id || userProfile?.email);
  const recentActivities = notifications.slice(0, 4).map(n => ({
    id: n.id,
    title: n.title,
    desc: n.message,
    timestamp: n.timestamp,
    type: n.type,
    icon: n.type === 'event' ? Sparkles : n.type === 'certificate' ? Award : n.type === 'project' ? Trophy : Layers,
    iconColor: n.type === 'event' ? 'bg-primary-100 text-primary-700' : n.type === 'certificate' ? 'bg-amber-100 text-amber-800' : 'bg-purple-100 text-purple-700'
  }));

  return (
    <div className="space-y-6">
      {/* 1. Welcome Header Banner */}
      <div className="coursue-card p-6 sm:p-8 bg-gradient-to-r from-primary-950 via-[#0A2540] to-primary-900 text-white relative overflow-hidden rounded-3xl shadow-xl border border-primary-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-primary-200 text-xs font-bold backdrop-blur-xs border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-current" />
              <span>Pragati University Student Portal • Active Academic Session</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              Welcome Back, {userProfile.full_name || 'Student'}
            </h1>

            <p className="text-xs sm:text-sm text-primary-100/90 max-w-xl leading-relaxed">
              {userProfile.department || 'Computer Science & Engineering'} •{' '}
              {userProfile.academic_year || '2nd Year (2025-2029)'} • Roll:{' '}
              <span className="font-mono font-bold text-amber-300">
                {userProfile.membership_number || userProfile.id}
              </span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setShowCardModal(true)}
              className="px-4 py-2.5 rounded-2xl bg-white text-primary-950 hover:bg-primary-50 text-xs font-extrabold flex items-center gap-2 shadow-lg transition-all hover:scale-105"
            >
              <CreditCard className="w-4 h-4 text-primary-700" />
              <span>Digital 3D Pass</span>
            </button>

            <Link
              href="/dashboard/student?tab=events"
              className="px-4 py-2.5 rounded-2xl bg-primary-600/80 hover:bg-primary-600 text-white text-xs font-bold border border-white/20 transition-all flex items-center gap-1.5"
            >
              <span>Explore Events</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Decorative Background Glow */}
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-16 w-48 h-48 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* 2. 4 Quick Stat Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: My Clubs */}
        <Link
          href="/dashboard/student?tab=clubs"
          className="coursue-card p-5 bg-surface hover:border-primary-300 transition-all shadow-sm flex items-center justify-between group"
        >
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
              My Clubs
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-ink">{myClubs.length}</span>
              <span className="text-xs font-semibold text-emerald-600">Active</span>
            </div>
            <p className="text-[11px] text-ink-muted">
              {myClubs.map(c => c.name.split('—')[0].trim()).join(' & ') || 'Explore Clubs'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-700 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Layers className="w-6 h-6" />
          </div>
        </Link>

        {/* Card 2: Upcoming Events */}
        <Link
          href="/dashboard/student?tab=events"
          className="coursue-card p-5 bg-surface hover:border-primary-300 transition-all shadow-sm flex items-center justify-between group"
        >
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
              Registered Events
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-ink">{userRegistrations.length}</span>
              <span className="text-xs font-semibold text-primary-600">Enrolled</span>
            </div>
            <p className="text-[11px] text-ink-muted">
              {userRegistrations.length > 0 ? `${userRegistrations[0].eventTitle.split(':')[0]} Active` : 'Browse Schedule'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-tag-blue text-primary-700 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Calendar className="w-6 h-6" />
          </div>
        </Link>

        {/* Card 3: Certificates */}
        <Link
          href="/dashboard/student?tab=certificates"
          className="coursue-card p-5 bg-surface hover:border-primary-300 transition-all shadow-sm flex items-center justify-between group"
        >
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
              Certificates
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-ink">{certs.length}</span>
              <span className="text-xs font-semibold text-emerald-600">Verified</span>
            </div>
            <p className="text-[11px] text-ink-muted">
              {certs.length > 0 ? `${certs[0].certificate_number}` : 'Attend events to earn'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-tag-teal text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Award className="w-6 h-6" />
          </div>
        </Link>

        {/* Card 4: My Projects */}
        <Link
          href="/dashboard/student?tab=projects"
          className="coursue-card p-5 bg-surface hover:border-primary-300 transition-all shadow-sm flex items-center justify-between group"
        >
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
              Projects
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-ink">{studentProjects.length}</span>
              <span className="text-xs font-semibold text-purple-600">Submitted</span>
            </div>
            <p className="text-[11px] text-ink-muted">
              {studentProjects.filter(p => p.status === 'approved').length} Approved • {studentProjects.filter(p => p.status === 'pending_review').length} In Review
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-tag-violet text-primary-700 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Trophy className="w-6 h-6" />
          </div>
        </Link>
      </div>

      {/* 3. Learning Progress Bar & Summary */}
      <div className="coursue-card p-6 bg-surface border border-surface-border space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary-600" />
              <h2 className="text-sm font-bold text-ink uppercase tracking-wide">
                LMS Learning Progress & Skill Tracks
              </h2>
            </div>
            <p className="text-xs text-ink-muted">
              Interactive DSA & Spatial Computing milestone tracks completed this semester.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-primary-700 font-mono">
              {learningProgress}%
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Stage 2 Active
            </span>
          </div>
        </div>

        {/* Custom Progress Bar */}
        <div className="space-y-2">
          <div className="w-full bg-surface-muted rounded-full h-3.5 overflow-hidden p-0.5 border border-surface-border">
            <div
              className="bg-gradient-to-r from-primary-600 via-primary-500 to-emerald-500 h-full rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${learningProgress}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-ink-muted font-semibold">
            <span>Beginner (Mastered)</span>
            <span className="text-primary-700 font-bold">Intermediate: Graphs & Unity XR (68%)</span>
            <span>Advanced (Unlocked Next)</span>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap gap-2">
          <Link
            href="/dashboard/student?tab=roadmaps"
            className="text-xs font-bold text-primary-700 hover:text-primary-800 bg-primary-50 px-3 py-1.5 rounded-xl border border-primary-200 inline-flex items-center gap-1.5 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Continue LMS Roadmap</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 4. Two-Column Layout: Upcoming Events + My Clubs & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Upcoming Events */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary-600" />
              <h3 className="text-base font-bold text-ink">Upcoming Events & Hackathons</h3>
            </div>
            <Link
              href="/dashboard/student?tab=events"
              className="text-xs font-bold text-primary-600 hover:underline flex items-center gap-1"
            >
              <span>View All ({events.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {events.slice(0, 3).map((event) => {
              const isEventRegistered = dataService.isRegistered(event.id, userProfile.id);
              return (
                <div
                  key={event.id}
                  className="coursue-card p-5 bg-surface hover:border-primary-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <img
                      src={event.poster_url}
                      alt={event.title}
                      className="w-16 h-16 rounded-2xl object-cover ring-1 ring-surface-border shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${event.tag_color}`}>
                          {event.event_type}
                        </span>
                        <span className="text-xs font-bold text-primary-700">
                          {event.club_name}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-ink leading-snug">
                        {event.title}
                      </h4>
                      <div className="flex items-center gap-3 text-[11px] text-ink-muted">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-primary-600" />
                          {new Date(event.start_time).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-pink-600" />
                          {event.venue.split(',')[0]}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {isEventRegistered ? (
                      <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Pass Active</span>
                      </span>
                    ) : (
                      <Link
                        href={`/events/${event.id}`}
                        className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Register</span>
                      </Link>
                    )}

                    <Link
                      href={`/events/${event.id}`}
                      className="p-2 rounded-xl border border-surface-border hover:bg-surface-subtle text-ink-muted hover:text-ink text-xs transition-colors"
                      title="View Details"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: My Clubs & Recent Activity */}
        <div className="space-y-6">
          {/* My Clubs Widget */}
          <div className="coursue-card p-5 space-y-3 bg-surface border border-surface-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-primary-600" />
                <h3 className="text-sm font-bold text-ink">My Enrolled Clubs</h3>
              </div>
              <Link href="/clubs" className="text-[11px] font-bold text-primary-600 hover:underline">
                Explore Clubs
              </Link>
            </div>

            <div className="space-y-2.5">
              {myClubs.map((club) => (
                <div
                  key={club.id}
                  className="p-3 bg-surface-muted rounded-2xl border border-surface-border flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-ink truncate">{club.name}</p>
                    <p className="text-[10px] text-ink-muted truncate">{club.domain}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-100 text-primary-800 shrink-0">
                    Member
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="coursue-card p-5 space-y-3 bg-surface border border-surface-border">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-primary-600" />
              <h3 className="text-sm font-bold text-ink">Recent Activity</h3>
            </div>

            <div className="space-y-3">
              {recentActivities.map((act) => {
                const Icon = act.icon;
                return (
                  <div key={act.id} className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-xl ${act.iconColor} flex items-center justify-center shrink-0 mt-0.5 shadow-xs`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 space-y-0.5">
                      <p className="text-xs font-bold text-ink leading-tight">{act.title}</p>
                      <p className="text-[11px] text-ink-muted leading-tight">{act.desc}</p>
                      <span className="text-[10px] text-ink-muted/80 block font-mono">{act.timestamp}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Digital Pass Modal */}
      <MembershipCardModal
        user={userProfile}
        isOpen={showCardModal}
        onClose={() => setShowCardModal(false)}
      />
    </div>
  );
}

function StudentTabDispatcher() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';
  const { userProfile } = useAuth();
  const dataVersion = useCentralDataSync();

  const certs = dataService.getStudentEligibleCertificates(userProfile);
  const events = dataService.getEvents();
  const clubs = dataService.getClubs();
  const [selectedCert, setSelectedCert] = useState<CertificateRecord | null>(null);
  const [showViewerModal, setShowViewerModal] = useState(false);

  const handleToggleClubMembership = (clubId: string) => {
    const isEnrolled = dataService.isClubMember(clubId, userProfile?.id || userProfile?.email);
    if (isEnrolled) {
      if (confirm('Are you sure you want to leave this club?')) {
        dataService.leaveClub(clubId, userProfile);
      }
    } else {
      const res = dataService.joinClub(clubId, userProfile);
      if (res.success) {
        alert('🎉 Congratulations! You have successfully enrolled as an active club member. Your Digital 3D Pass and attendance eligibility have been activated.');
      } else {
        alert(res.error || 'Failed to join club.');
      }
    }
  };

  const handleDownload = (cert: CertificateRecord) => {
    const authCheck = dataService.verifyStudentCertificateOwnership(cert.certificate_number, userProfile);
    if (!authCheck.allowed || !authCheck.certificate) {
      alert(authCheck.error || 'Access Denied: Certificate does not belong to your student account.');
      return;
    }

    generateCertificatePDF({
      studentName: authCheck.certificate.student_name,
      eventName: authCheck.certificate.event_title,
      clubName: authCheck.certificate.club_name,
      date: authCheck.certificate.issue_date,
      certificateNumber: authCheck.certificate.certificate_number
    });
  };

  const handleViewCertificate = (cert: CertificateRecord) => {
    const authCheck = dataService.verifyStudentCertificateOwnership(cert.certificate_number, userProfile);
    if (!authCheck.allowed || !authCheck.certificate) {
      alert(authCheck.error || 'Access Denied: Certificate does not belong to your student account.');
      return;
    }
    setSelectedCert(authCheck.certificate);
    setShowViewerModal(true);
  };

  if (activeTab === 'events') {
    return (
      <div className="space-y-6">
        <div className="coursue-card p-6 bg-gradient-to-r from-primary-900 via-[#0A2540] to-primary-800 text-white rounded-3xl">
          <h2 className="text-xl font-black">Student Workshop & Event Portal</h2>
          <p className="text-xs text-primary-100/90 mt-1 max-w-xl">
            Browse upcoming accredited sessions, view your registration status, and access verified event digital passes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map((ev) => {
            const isReg = dataService.isRegistered(ev.id, userProfile?.id || userProfile?.email);
            const isAttended = dataService.hasAttended(ev.id, userProfile?.id || userProfile?.email);

            return (
              <div key={ev.id} className="coursue-card overflow-hidden flex flex-col justify-between group hover:border-primary-300 transition-all">
                <div>
                  <div className="relative h-44 w-full overflow-hidden bg-surface-subtle">
                    <img src={ev.poster_url} alt={ev.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute top-3 left-3">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-xl shadow-md ${ev.tag_color}`}>
                        {ev.event_type}
                      </span>
                    </div>
                    {isAttended ? (
                      <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-xl shadow-md flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Attended (Present)</span>
                      </div>
                    ) : isReg ? (
                      <div className="absolute top-3 right-3 bg-primary-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-xl shadow-md flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Pass Active</span>
                      </div>
                    ) : null}
                  </div>

                  <div className="p-5 space-y-3">
                    <span className="text-xs font-bold text-primary-700 block">
                      {ev.club_name}
                    </span>
                    <h3 className="text-sm font-bold text-ink leading-snug line-clamp-2">
                      {ev.title}
                    </h3>
                    <p className="text-xs text-ink-muted line-clamp-2">
                      {ev.description}
                    </p>

                    <div className="space-y-1 pt-1 text-[11px] text-ink-muted">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Clock className="w-3.5 h-3.5 text-primary-600" />
                        <span>{new Date(ev.start_time).toLocaleDateString()} • {ev.time || '10:00 AM'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-pink-600" />
                        <span className="truncate">{ev.venue}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-surface-border">
                        <span className="font-semibold text-ink">Capacity Roster:</span>
                        <span className="font-bold text-primary-700">{ev.registered_count} / {ev.capacity} Registered</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link
                    href={`/events/${ev.id}`}
                    className={`w-full py-2.5 text-center block rounded-xl text-xs font-bold shadow-sm transition-all ${
                      isReg
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-primary-600 hover:bg-primary-700 text-white'
                    }`}
                  >
                    {isReg ? 'View Event Pass & Details →' : 'Register for Event →'}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (activeTab === 'digital-id') {
    return <AdminDigitalIdManagement />;
  }

  if (activeTab === 'clubs') {
    return (
      <div className="space-y-6">
        <div className="coursue-card p-6 bg-gradient-to-r from-primary-900 via-[#0A2540] to-primary-800 text-white rounded-3xl">
          <h2 className="text-xl font-black">Technical & Non-Technical Clubs Directory</h2>
          <p className="text-xs text-primary-100/90 mt-1 max-w-xl">
            Explore official student technical societies, active wings, hackathon teams, and faculty coordinators.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {clubs.map((c) => {
            const isEnrolled = dataService.isClubMember(c.id, userProfile?.id || userProfile?.email) ||
                               dataService.isClubMember(c.slug, userProfile?.id || userProfile?.email);

            return (
              <div key={c.id} className="coursue-card p-5 space-y-4 bg-surface border border-surface-border flex flex-col justify-between rounded-3xl hover:border-primary-300 transition-all">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-lg shadow-xs shrink-0">
                        {c.logo && c.logo.startsWith('/') ? <img src={c.logo} className="w-8 h-8 object-contain" /> : c.logo || '💻'}
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-ink leading-tight">{c.name}</h3>
                        <span className="text-[10px] text-primary-700 font-semibold">{c.domain}</span>
                      </div>
                    </div>
                    {isEnrolled && (
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 shrink-0 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Enrolled</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-ink-muted line-clamp-2 leading-relaxed">{c.description}</p>
                  
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-surface-border text-center">
                    <div className="p-2 rounded-xl bg-surface-subtle">
                      <p className="text-sm font-black text-ink">{c.members_count}</p>
                      <p className="text-[10px] text-ink-muted">Members</p>
                    </div>
                    <div className="p-2 rounded-xl bg-surface-subtle">
                      <p className="text-sm font-black text-primary-700">{c.events_count}</p>
                      <p className="text-[10px] text-ink-muted">Events</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => handleToggleClubMembership(c.id)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                      isEnrolled
                        ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                        : 'bg-primary-600 hover:bg-primary-700 text-white shadow-xs'
                    }`}
                  >
                    {isEnrolled ? (
                      <>
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Leave Club</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Join Club</span>
                      </>
                    )}
                  </button>

                  <Link
                    href={`/clubs/${c.slug}`}
                    className="p-2 rounded-xl border border-surface-border hover:bg-surface-subtle text-ink-muted hover:text-ink text-xs transition-colors"
                    title="View Club Profile"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (activeTab === 'certificates') {
    return (
      <div className="space-y-6">
        <div className="coursue-card p-6 bg-gradient-to-r from-primary-900 via-[#0A2540] to-primary-800 text-white rounded-3xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-primary-200 text-[11px] font-bold tracking-wide uppercase mb-2">
                <Award className="w-3.5 h-3.5" />
                <span>Verified Credentials</span>
              </div>
              <h2 className="text-xl font-black">Your Certificates</h2>
              <p className="text-xs text-primary-100/90 mt-1 max-w-xl">
                View and download certificates that you have earned through eligible events and activities.
              </p>
            </div>
            <span className="text-xs font-bold bg-white text-primary-900 px-3.5 py-1.5 rounded-full shadow-sm hidden sm:inline-block">
              {certs.length} Earned
            </span>
          </div>
        </div>

        {certs.length > 0 ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {certs.map((cert) => (
                <div key={cert.id} className="coursue-card p-6 bg-surface border border-surface-border shadow-card flex flex-col justify-between space-y-5 rounded-3xl hover:border-primary-300 transition-all">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-mono text-xs font-bold text-primary-700 bg-primary-50 px-2.5 py-1 rounded-lg border border-primary-200">
                        {cert.certificate_number}
                      </span>
                      <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1 shadow-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Valid & Verified</span>
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-base font-black text-ink leading-snug">
                        {cert.event_title}
                      </h3>
                      <p className="text-xs text-ink font-semibold">
                        Issued by: <strong className="text-primary-800">{cert.club_name}</strong>
                      </p>
                      <p className="text-xs text-ink-muted">
                        Date: <span className="font-medium text-ink">{cert.issue_date}</span>
                      </p>
                      <p className="text-[11px] text-ink-muted font-mono">
                        Certificate ID: <span className="font-bold text-ink">{cert.certificate_number}</span>
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-surface-border flex flex-col sm:flex-row items-center justify-between gap-2.5">
                    <button
                      onClick={() => handleViewCertificate(cert)}
                      className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl border border-surface-border hover:bg-surface-subtle text-ink text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-primary-600" />
                      <span>View Certificate</span>
                    </button>

                    <button
                      onClick={() => handleDownload(cert)}
                      className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl bg-[#0A2540] hover:bg-[#1E3A8A] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all hover:scale-105 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Attendance & Certificate Eligibility Policy Banner */}
            <div className="p-5 bg-surface rounded-2xl border border-surface-border space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-ink">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Certificate Eligibility Rule</span>
              </div>
              <p className="text-ink-muted leading-relaxed">
                Only events with verified physical QR attendance check-in generate official certificates. If you registered for an upcoming event, your certificate download button will activate as soon as the event coordinator marks your attendance.
              </p>
            </div>
          </div>
        ) : (
          <div className="coursue-card p-12 text-center space-y-4 bg-surface rounded-3xl border border-surface-border">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
              <Award className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-ink">No Certificates Issued Yet</h3>
              <p className="text-xs text-ink-muted max-w-md mx-auto leading-relaxed">
                Attend technical workshops, CTFs, and hackathons to unlock your cryptographically signed participation credentials.
              </p>
            </div>
            <Link
              href="/events"
              className="inline-block mt-2 px-6 py-2.5 rounded-2xl bg-[#0A2540] hover:bg-[#1E3A8A] text-white text-xs font-bold"
            >
              Explore Upcoming Events →
            </Link>
          </div>
        )}

        {/* Interactive Certificate Viewer Modal */}
        <CertificateViewerModal
          certificate={selectedCert}
          isOpen={showViewerModal}
          onClose={() => setShowViewerModal(false)}
        />
      </div>
    );
  }

  if (activeTab === 'attendance') {
    return (
      <div className="space-y-6">
        <div className="coursue-card p-6 bg-gradient-to-r from-primary-900 via-[#0A2540] to-primary-800 text-white rounded-3xl">
          <h2 className="text-xl font-black">Event Attendance & Check-in Desk</h2>
          <p className="text-xs text-primary-100/90 mt-1 max-w-xl">
            Present your digital membership QR code at event entrances to log instantaneous attendance and unlock verified certificates.
          </p>
        </div>
        <AdminDigitalIdManagement />
      </div>
    );
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

  if (activeTab === 'announcements') {
    const ann = dataService.getAnnouncements();
    return (
      <div className="space-y-6">
        <div className="coursue-card p-6 bg-gradient-to-r from-primary-900 via-[#0A2540] to-primary-800 text-white rounded-3xl">
          <h2 className="text-xl font-black">Official University Notices & Circulars</h2>
          <p className="text-xs text-primary-100/90 mt-1 max-w-xl">
            Live notices, hackathon announcements, and schedules released by CSEC Executive Council and clubs.
          </p>
        </div>
        <div className="space-y-3">
          {ann.map((a) => (
            <div key={a.id} className="coursue-card p-5 bg-surface space-y-1.5 border border-surface-border">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-100 text-primary-800">{a.category}</span>
                <span className="text-[11px] text-ink-muted">{a.date}</span>
              </div>
              <h3 className="text-xs font-bold text-ink">{a.title}</h3>
              <p className="text-xs text-ink-muted leading-relaxed">{a.content}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeTab === 'profile' || activeTab === 'settings') {
    return (
      <div className="coursue-card p-6 bg-surface max-w-xl space-y-4">
        <h2 className="text-base font-bold text-ink">Student Profile & Settings</h2>
        <div className="space-y-3 text-xs">
          <div><span className="text-ink-muted block font-semibold">Name:</span> <strong className="text-ink">{userProfile.full_name}</strong></div>
          <div><span className="text-ink-muted block font-semibold">Email:</span> <strong className="font-mono text-ink">{userProfile.email}</strong></div>
          <div><span className="text-ink-muted block font-semibold">Roll Number:</span> <strong className="font-mono text-primary-700">{userProfile.membership_number || userProfile.id}</strong></div>
          <div><span className="text-ink-muted block font-semibold">Department:</span> <strong className="text-ink">{userProfile.department}</strong></div>
          <div><span className="text-ink-muted block font-semibold">Academic Year:</span> <strong className="text-ink">{userProfile.academic_year}</strong></div>
        </div>
      </div>
    );
  }

  return <StudentOverview />;
}

export default function StudentDashboardPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-ink-muted">Loading Student Dashboard...</div>}>
      <StudentTabDispatcher />
    </Suspense>
  );
}
