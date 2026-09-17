'use client';

import React, { useState } from 'react';
import { dataService, useCentralDataSync } from '@/lib/dataService';
import { ProjectItem } from '@/lib/demoData';
import { useAuth } from '@/lib/authContext';
import {
  Trophy,
  Star,
  CheckCircle2,
  XCircle,
  PlusCircle,
  Search,
  Filter,
  Github,
  Globe,
  Tag,
  ShieldCheck,
  Award,
  Sparkles,
  X,
  AlertTriangle,
  UploadCloud,
  Eye,
  Edit3,
  Check,
  Share2,
  FileCode,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  Lock,
  RefreshCw
} from 'lucide-react';

interface AdminProjectsManagementProps {
  clubScope?: string;
}

export default function AdminProjectsManagement({ clubScope }: AdminProjectsManagementProps) {
  useCentralDataSync();
  const { userProfile } = useAuth();
  const projects = dataService.getProjects();
  const [search, setSearch] = useState('');
  const [filterDomain, setFilterDomain] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPublication, setFilterPublication] = useState('all');

  const isStudent = userProfile?.role === 'student';
  const isClubAdmin = userProfile?.role === 'club_admin';
  const isSuperAdminOrFaculty = userProfile?.role === 'super_admin' || userProfile?.role === 'faculty_coordinator' || userProfile?.role === 'department_admin';
  const canModerate = isClubAdmin || isSuperAdminOrFaculty;

  // Active club for Club Admin
  const targetClubName = clubScope || (isClubAdmin ? 'PRAGSOFT — Premier Technical Coding Club' : 'all');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProjectForDetails, setSelectedProjectForDetails] = useState<ProjectItem | null>(null);
  const [projectForAction, setProjectForAction] = useState<ProjectItem | null>(null);
  const [actionType, setActionType] = useState<'request_changes' | 'reject' | 'approve' | 'edit_resubmit' | null>(null);
  const [actionFeedback, setActionFeedback] = useState('');
  const [actionRating, setActionRating] = useState<number>(9.0);

  // Resubmit state for student
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editDomain, setEditDomain] = useState('');
  const [editTechStack, setEditTechStack] = useState('');
  const [editGithub, setEditGithub] = useState('');
  const [editLive, setEditLive] = useState('');

  // New project state
  const [newTitle, setNewTitle] = useState('');
  const [newClub, setNewClub] = useState(isClubAdmin ? 'PRAGSOFT — Premier Technical Coding Club' : 'PRAGSOFT — Premier Technical Coding Club');
  const [newStudent, setNewStudent] = useState(userProfile?.full_name || 'Student Developer');
  const [newDomain, setNewDomain] = useState('Software Engineering & Compilers');
  const [newTechStack, setNewTechStack] = useState('Next.js, TypeScript, TailwindCSS');
  const [newDesc, setNewDesc] = useState('');
  const [newGithub, setNewGithub] = useState('https://github.com/pragsoft/showcase');
  const [newLive, setNewLive] = useState('https://prototype.pragati.ac.in');

  // Upvotes state
  const [upvotes, setUpvotes] = useState<Record<string, number>>({});
  const [userUpvoted, setUserUpvoted] = useState<Record<string, boolean>>({});

  const clubs = dataService.getClubs();

  const refreshProjects = () => {
    // Automatically reactive via useCentralDataSync
  };

  const handleUpvote = (projectId: string) => {
    setUserUpvoted(prev => {
      const currentlyUpvoted = !!prev[projectId];
      const nextUpvoted = !currentlyUpvoted;
      setUpvotes(u => ({
        ...u,
        [projectId]: (u[projectId] || 25) + (nextUpvoted ? 1 : -1)
      }));
      return { ...prev, [projectId]: nextUpvoted };
    });
    dataService.upvoteProject(projectId);
  };

  const handleQuickApprove = (proj: ProjectItem) => {
    const res = dataService.moderateProject(
      proj.id,
      'approved',
      'Approved by club coordinator. Ready for showcase qualification.',
      proj.rating || 9.0,
      userProfile
    );
    if (!res.success) {
      alert(res.error || 'Failed to approve project.');
      return;
    }
    refreshProjects();
    alert(`✓ Project "${proj.title}" APPROVED!\n\nIt is now approved. Click "Showcase Project" whenever you wish to publish it to the Public Projects Showcase.`);
  };

  const handleOpenActionModal = (proj: ProjectItem, type: 'request_changes' | 'reject' | 'approve' | 'edit_resubmit') => {
    setProjectForAction(proj);
    setActionType(type);
    setActionFeedback(proj.review_feedback || proj.remarks || '');
    setActionRating(proj.rating || 9.0);

    if (type === 'edit_resubmit') {
      setEditTitle(proj.title);
      setEditDesc(proj.description);
      setEditDomain(proj.domain);
      setEditTechStack(proj.tech_stack.join(', '));
      setEditGithub(proj.github_url);
      setEditLive(proj.live_url || proj.demo_url || '');
    }
  };

  const handleSubmitAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForAction || !actionType) return;

    if (actionType === 'approve') {
      const res = dataService.moderateProject(
        projectForAction.id,
        'approved',
        actionFeedback || 'Approved by club coordinator for showcase qualification.',
        actionRating || 9.0,
        userProfile
      );
      if (!res.success) {
        alert(res.error || 'Failed to approve project.');
        return;
      }
      refreshProjects();
      alert(`✓ Project "${projectForAction.title}" APPROVED!`);
    } else if (actionType === 'request_changes') {
      if (!actionFeedback.trim()) {
        alert('Please enter specific revision feedback for the student.');
        return;
      }
      const res = dataService.moderateProject(
        projectForAction.id,
        'changes_requested',
        actionFeedback,
        0,
        userProfile
      );
      if (!res.success) {
        alert(res.error || 'Failed to request changes.');
        return;
      }
      refreshProjects();
      alert(`⚠️ Changes Requested on "${projectForAction.title}". The student has been notified and can revise & resubmit.`);
    } else if (actionType === 'reject') {
      if (!actionFeedback.trim()) {
        alert('Please enter a reason for rejecting the project.');
        return;
      }
      const res = dataService.moderateProject(
        projectForAction.id,
        'rejected',
        actionFeedback,
        0,
        userProfile
      );
      if (!res.success) {
        alert(res.error || 'Failed to reject project.');
        return;
      }
      refreshProjects();
      alert(`Project "${projectForAction.title}" marked as REJECTED with feedback.`);
    } else if (actionType === 'edit_resubmit') {
      if (!editTitle.trim() || !editDesc.trim()) {
        alert('Title and description are required.');
        return;
      }
      const res = dataService.resubmitProject(
        projectForAction.id,
        {
          title: editTitle,
          description: editDesc,
          domain: editDomain || projectForAction.domain,
          tech_stack: editTechStack.split(',').map(s => s.trim()).filter(Boolean),
          github_url: editGithub,
          live_url: editLive,
          demo_url: editLive
        },
        userProfile
      );
      if (!res.success) {
        alert(res.error || 'Failed to resubmit project.');
        return;
      }
      refreshProjects();
      alert(`✓ Project "${editTitle}" successfully resubmitted for Club Admin review!`);
    }

    setProjectForAction(null);
    setActionType(null);
    setActionFeedback('');
  };

  const handleToggleShowcase = (proj: ProjectItem) => {
    const isCurrentlyShowcased = proj.publication_status === 'showcased';
    const res = dataService.showcaseProject(proj.id, !isCurrentlyShowcased, userProfile);
    if (!res.success) {
      alert(res.error || 'Failed to update showcase status.');
      return;
    }
    refreshProjects();
    if (!isCurrentlyShowcased) {
      alert(`🚀 Project "${proj.title}" is now SHOWCASED on the Public Website!\n\nAnyone visiting the public Projects page can now discover and explore this project.`);
    } else {
      alert(`Project "${proj.title}" removed from the public showcase (now private).`);
    }
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const res = dataService.addProject(
      {
        title: newTitle,
        club_name: newClub,
        submitted_by: newStudent,
        domain: newDomain,
        tech_stack: newTechStack.split(',').map(s => s.trim()).filter(Boolean),
        description: newDesc || 'Innovative university student prototype.',
        github_url: newGithub || 'https://github.com/pragati-clubs/showcase',
        live_url: newLive || 'https://prototype.pragati.ac.in',
        demo_url: newLive || 'https://prototype.pragati.ac.in'
      },
      userProfile
    );

    if (!res.success) {
      alert(res.error || 'Failed to register project.');
      return;
    }

    refreshProjects();
    setShowAddModal(false);
    setNewTitle('');
    setNewDesc('');
    alert(`✓ Project "${newTitle}" submitted! Status: PENDING REVIEW by ${newClub} coordinators.`);
  };

  // Filter projects by club scoping, search, domain, status, publication
  const filtered = (projects || []).filter(p => {
    // Club Scoping: if targetClubName is not 'all', filter strictly
    if (targetClubName !== 'all') {
      const matchClub = (p?.club_name || '').toLowerCase().includes(targetClubName.toLowerCase()) ||
                        (targetClubName.toLowerCase().includes('pragsoft') && (p?.club_name || '').toLowerCase().includes('pragsoft'));
      if (!matchClub) return false;
    }

    const q = (search || '').toLowerCase().trim();
    const matchesSearch =
      !q ||
      (p?.title || '').toLowerCase().includes(q) ||
      (p?.submitted_by || '').toLowerCase().includes(q) ||
      (p?.club_name || '').toLowerCase().includes(q) ||
      (p?.tech_stack || []).some(t => t.toLowerCase().includes(q));

    const matchesDomain = filterDomain === 'all' || p?.domain === filterDomain;
    const matchesStatus = filterStatus === 'all' || p?.status === filterStatus;
    const matchesPub = filterPublication === 'all' ||
      (filterPublication === 'showcased' && p?.publication_status === 'showcased') ||
      (filterPublication === 'private' && p?.publication_status !== 'showcased');

    return matchesSearch && matchesDomain && matchesStatus && matchesPub;
  });

  const pendingCount = (projects || []).filter(p =>
    (targetClubName === 'all' || p.club_name.toLowerCase().includes('pragsoft')) && p.status === 'pending_review'
  ).length;

  const showcasedCount = (projects || []).filter(p =>
    (targetClubName === 'all' || p.club_name.toLowerCase().includes('pragsoft')) && p.publication_status === 'showcased'
  ).length;

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header Banner */}
      <div className="coursue-card p-6 bg-gradient-to-r from-primary-950 via-[#0A2540] to-primary-900 text-white relative overflow-hidden rounded-3xl shadow-xl border border-primary-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-primary-200 text-[11px] font-bold tracking-wide uppercase">
              <Trophy className="w-3.5 h-3.5 text-amber-300" />
              <span>
                {isStudent
                  ? 'Student Project Showcase & Submissions'
                  : isClubAdmin
                  ? 'PRAGSOFT — Project Submissions & Moderation Desk'
                  : 'University Project Governance & Showcase'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              {isStudent
                ? 'Student Technical Projects & Research Prototypes'
                : isClubAdmin
                ? 'PRAGSOFT Project Approval & Public Showcase'
                : 'Project Review & Public Showcase Moderation'}
            </h1>
            <p className="text-xs text-primary-100/90 max-w-2xl leading-relaxed">
              {isStudent
                ? 'Explore peer prototypes, track moderation feedback from club coordinators, and submit technical prototypes for platform review.'
                : 'Review student engineering prototypes for your club. Moderate submissions with Approve, Request Changes, or Reject, and publish approved projects to the Public Showcase.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-center shrink-0">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 rounded-xl bg-white text-primary-900 hover:bg-primary-50 text-xs font-bold flex items-center gap-2 shadow-float transition-all hover:scale-105 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-primary-700" />
              <span>{isStudent ? 'Submit New Prototype' : 'Register New Prototype'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Lifecycle Flow Explanation Ribbon (for Admins) */}
      {canModerate && (
        <div className="p-4 bg-surface rounded-2xl border border-surface-border grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-900">
              <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 font-black flex items-center justify-center text-[10px]">1</span>
              <span>Pending Review</span>
            </div>
            <p className="text-[11px] text-amber-800">Student submits prototype awaiting club review.</p>
          </div>

          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-blue-900">
              <span className="w-5 h-5 rounded-full bg-blue-200 text-blue-900 font-black flex items-center justify-center text-[10px]">2</span>
              <span>Review & Moderation</span>
            </div>
            <p className="text-[11px] text-blue-800">Club Admin chooses Approve, Request Changes, or Reject.</p>
          </div>

          <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-emerald-900">
              <span className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-900 font-black flex items-center justify-center text-[10px]">3</span>
              <span>Approved (Private)</span>
            </div>
            <p className="text-[11px] text-emerald-800">Passed club evaluation. Not yet public.</p>
          </div>

          <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-indigo-900">
              <span className="w-5 h-5 rounded-full bg-indigo-200 text-indigo-900 font-black flex items-center justify-center text-[10px]">4</span>
              <span>Public Showcase 🌐</span>
            </div>
            <p className="text-[11px] text-indigo-800">Click &ldquo;Showcase Project&rdquo; to publish to public website.</p>
          </div>
        </div>
      )}

      {/* Control Bar & Filter Tabs */}
      <div className="coursue-card p-4 space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by project title, developer name, tech stack, or club..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-surface border border-surface-border rounded-xl focus:outline-none focus:border-primary-600 shadow-sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <select
              value={filterDomain}
              onChange={(e) => setFilterDomain(e.target.value)}
              className="text-xs p-2 rounded-xl border border-surface-border bg-surface text-ink font-semibold focus:outline-none cursor-pointer"
            >
              <option value="all">All Domains</option>
              <option value="Software Engineering & Compilers">Software Engineering</option>
              <option value="AI & Machine Learning">AI & Machine Learning</option>
              <option value="Spatial Computing & VR">Spatial Computing & VR</option>
              <option value="Algorithms & Visualization">Algorithms & Visualization</option>
              <option value="Healthcare & Social Impact">Healthcare & Social Impact</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs p-2 rounded-xl border border-surface-border bg-surface text-ink font-semibold focus:outline-none cursor-pointer"
            >
              <option value="all">All Moderation Statuses</option>
              <option value="pending_review">Pending Review</option>
              <option value="changes_requested">Changes Requested</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>

            <select
              value={filterPublication}
              onChange={(e) => setFilterPublication(e.target.value)}
              className="text-xs p-2 rounded-xl border border-surface-border bg-surface text-ink font-semibold focus:outline-none cursor-pointer"
            >
              <option value="all">All Visibility</option>
              <option value="showcased">Showcased (Public Website)</option>
              <option value="private">Private (Not Showcased)</option>
            </select>

            <span className="text-xs font-bold text-primary-700 bg-primary-50 px-3 py-2 rounded-xl border border-primary-100 whitespace-nowrap">
              {filtered.length} Projects
            </span>
          </div>
        </div>
      </div>

      {/* Projects Queue Grid */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="coursue-card p-12 text-center space-y-3 bg-surface rounded-3xl border border-surface-border">
            <div className="w-12 h-12 rounded-2xl bg-surface-muted text-ink-muted flex items-center justify-center mx-auto">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-ink">No Project Prototypes Match Filters</h3>
            <p className="text-xs text-ink-muted max-w-md mx-auto">
              Try resetting the domain or status filter, or submit a new project prototype.
            </p>
          </div>
        ) : (
          filtered.map((proj) => {
            const isUpvoted = !!userUpvoted[proj.id];
            const voteCount = upvotes[proj.id] || (proj.upvotes || 24);
            const isShowcased = proj.publication_status === 'showcased';

            return (
              <div
                key={proj.id}
                className="coursue-card p-5 space-y-4 transition-all hover:shadow-md border border-surface-border rounded-2xl bg-surface"
              >
                {/* Header: Title, Badges, Links */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm sm:text-base font-bold text-ink">{proj.title}</h3>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-tag-blue text-primary-700">
                        {proj.domain}
                      </span>

                      {/* Moderation Status Badge */}
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                        proj.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : proj.status === 'changes_requested'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : proj.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-900'
                      }`}>
                        {proj.status === 'approved' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        {proj.status === 'changes_requested' && <AlertTriangle className="w-3 h-3 text-amber-600" />}
                        {proj.status === 'rejected' && <XCircle className="w-3 h-3 text-red-600" />}
                        {proj.status === 'pending_review' && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />}
                        <span>
                          {proj.status === 'approved'
                            ? 'APPROVED'
                            : proj.status === 'changes_requested'
                            ? 'CHANGES REQUESTED'
                            : proj.status === 'rejected'
                            ? 'REJECTED'
                            : 'PENDING REVIEW'}
                        </span>
                      </span>

                      {/* Publication Status Badge */}
                      {isShowcased ? (
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-900 border border-indigo-200 flex items-center gap-1">
                          <Globe className="w-3 h-3 text-indigo-600" />
                          <span>SHOWCASED (Public Site)</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5" />
                          <span>Private / Unpublished</span>
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-primary-700 font-medium">
                      {proj.club_name} • Submitted by <span className="font-bold text-ink">{proj.submitted_by}</span>
                      {proj.student_id && <span className="text-ink-muted font-mono ml-1">({proj.student_id})</span>}
                    </p>

                    <p className="text-xs text-ink-muted leading-relaxed max-w-4xl">
                      {proj.description}
                    </p>
                  </div>

                  {/* Top Right Quick Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-start">
                    <button
                      onClick={() => setSelectedProjectForDetails(proj)}
                      className="p-2 rounded-xl bg-surface-muted hover:bg-surface border border-surface-border text-ink-muted hover:text-ink text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                      title="View Full Details"
                    >
                      <Eye className="w-4 h-4 text-primary-600" />
                      <span className="hidden sm:inline">Details</span>
                    </button>

                    {proj.github_url && (
                      <a
                        href={proj.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-surface-muted hover:bg-surface border border-surface-border text-ink hover:text-primary-600 transition-colors"
                        title="GitHub Repository"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}

                    {(proj.live_url || proj.demo_url) && (
                      <a
                        href={proj.live_url || proj.demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-surface-muted hover:bg-surface border border-surface-border text-ink hover:text-primary-600 transition-colors"
                        title="Live Demo Prototype"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Tech Stack Pills */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {proj.tech_stack.map((t, idx) => (
                    <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-surface-muted border border-surface-border text-ink-muted font-medium">
                      {t}
                    </span>
                  ))}
                </div>

                {/* Review Feedback / Remark Note if exists */}
                {(proj.review_feedback || proj.remarks) && (
                  <div className={`p-3 rounded-xl border text-xs space-y-1 ${
                    proj.status === 'changes_requested'
                      ? 'bg-amber-50/80 border-amber-200 text-amber-900'
                      : proj.status === 'rejected'
                      ? 'bg-red-50/80 border-red-200 text-red-900'
                      : 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                  }`}>
                    <div className="flex items-center justify-between font-bold text-[11px]">
                      <span className="flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>
                          {proj.status === 'changes_requested'
                            ? 'Coordinator Requested Changes:'
                            : proj.status === 'rejected'
                            ? 'Rejection Rationale:'
                            : 'Coordinator Review Remarks:'}
                        </span>
                      </span>
                      {proj.reviewed_by && (
                        <span className="text-[10px] font-normal opacity-80 font-mono">
                          By {proj.reviewed_by} {proj.reviewed_at ? `on ${proj.reviewed_at}` : ''}
                        </span>
                      )}
                    </div>
                    <p className="text-xs italic leading-relaxed">
                      &ldquo;{proj.review_feedback || proj.remarks}&rdquo;
                    </p>
                  </div>
                )}

                {/* BOTTOM ACTION DESK — ROLE SEPARATED */}

                {/* 1. STUDENT VIEW */}
                {isStudent ? (
                  <div className="p-3.5 bg-surface-muted rounded-2xl border border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      {proj.rating > 0 ? (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-black">
                          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                          <span>Score: {proj.rating}/10</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 font-semibold">
                          <ShieldCheck className="w-4 h-4 text-blue-600" />
                          <span>Under Review</span>
                        </div>
                      )}

                      <span className="text-xs text-ink-muted">
                        {proj.status === 'approved' && isShowcased
                          ? '✓ Verified & live on public showcase.'
                          : proj.status === 'approved'
                          ? '✓ Approved by club coordinator.'
                          : proj.status === 'changes_requested'
                          ? '⚠️ Please review coordinator feedback and resubmit.'
                          : proj.status === 'rejected'
                          ? '❌ Submission rejected. You can revise & resubmit.'
                          : '⏳ In moderation queue.'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      {/* Peer Upvote Button */}
                      <button
                        onClick={() => handleUpvote(proj.id)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          isUpvoted
                            ? 'bg-primary-50 border-primary-300 text-primary-700 shadow-xs'
                            : 'bg-surface border-surface-border text-ink-muted hover:text-ink'
                        }`}
                        title="Upvote Project"
                      >
                        <Sparkles className={`w-3.5 h-3.5 ${isUpvoted ? 'text-primary-600 fill-primary-600' : 'text-ink-muted'}`} />
                        <span>{voteCount} Upvotes</span>
                      </button>

                      {/* Edit & Resubmit Action for student if changes requested or rejected */}
                      {(proj.status === 'changes_requested' || proj.status === 'rejected') && (
                        <button
                          onClick={() => handleOpenActionModal(proj, 'edit_resubmit')}
                          className="px-3.5 py-1.5 rounded-xl bg-[#0A2540] hover:bg-[#1E3A8A] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit & Resubmit</span>
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  /* 2. CLUB ADMIN & SUPER ADMIN MODERATION CONTROL STRIP */
                  <div className="p-3.5 bg-surface-muted rounded-2xl border border-surface-border flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
                    {/* Left: Current Moderation Info */}
                    <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                      <div className="flex items-center gap-1 font-bold text-ink">
                        <span>Moderation Actions:</span>
                      </div>

                      {proj.status === 'approved' && (
                        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>Approved (Rating: {proj.rating || 9}/10)</span>
                        </span>
                      )}
                    </div>

                    {/* Right: Explicit Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
                      {/* State 1: Pending or Changes Requested -> Show Approve, Request Changes, Reject */}
                      {(proj.status === 'pending_review' || proj.status === 'changes_requested') && (
                        <>
                          <button
                            onClick={() => handleQuickApprove(proj)}
                            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                            title="Approve this prototype"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Approve</span>
                          </button>

                          <button
                            onClick={() => handleOpenActionModal(proj, 'request_changes')}
                            className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                            title="Request revisions before approving"
                          >
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Request Changes</span>
                          </button>

                          <button
                            onClick={() => handleOpenActionModal(proj, 'reject')}
                            className="px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-red-200"
                            title="Reject prototype"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>Reject</span>
                          </button>
                        </>
                      )}

                      {/* State 2: Approved -> Show Showcase Project or Remove from Showcase */}
                      {proj.status === 'approved' && (
                        <>
                          {!isShowcased ? (
                            <button
                              onClick={() => handleToggleShowcase(proj)}
                              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-primary-700 hover:from-indigo-700 hover:to-primary-800 text-white font-black flex items-center gap-1.5 shadow-md hover:scale-105 transition-all cursor-pointer"
                            >
                              <UploadCloud className="w-4 h-4" />
                              <span>Showcase Project 🌐</span>
                            </button>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1.5 rounded-xl border border-indigo-200 flex items-center gap-1">
                                <Globe className="w-3.5 h-3.5 text-indigo-600" />
                                <span>Live on Public Showcase</span>
                              </span>
                              <button
                                onClick={() => handleToggleShowcase(proj)}
                                className="px-3 py-1.5 rounded-xl border border-surface-border bg-surface hover:bg-surface-subtle text-ink-muted hover:text-ink font-semibold text-xs transition-colors cursor-pointer"
                              >
                                Remove from Public
                              </button>
                            </div>
                          )}

                          {/* Allow re-evaluating if needed */}
                          <button
                            onClick={() => handleOpenActionModal(proj, 'request_changes')}
                            className="px-2.5 py-1.5 rounded-xl border border-surface-border text-ink-muted hover:text-ink text-[11px] font-medium"
                          >
                            Modify Feedback
                          </button>
                        </>
                      )}

                      {/* State 3: Rejected -> Show Re-open Review option */}
                      {proj.status === 'rejected' && (
                        <button
                          onClick={() => handleQuickApprove(proj)}
                          className="px-3 py-1.5 rounded-xl bg-surface border border-surface-border hover:bg-emerald-50 text-emerald-700 font-bold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Re-open & Approve</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* MODAL 1: REQUEST CHANGES / REJECT / APPROVE WITH REMARKS */}
      {projectForAction && actionType && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-md w-full bg-surface rounded-3xl p-6 border border-surface-border shadow-float space-y-4 my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <div className="flex items-center gap-2">
                {actionType === 'request_changes' && (
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                )}
                {actionType === 'reject' && (
                  <div className="w-8 h-8 rounded-xl bg-red-100 text-red-800 flex items-center justify-center">
                    <XCircle className="w-4 h-4" />
                  </div>
                )}
                {actionType === 'edit_resubmit' && (
                  <div className="w-8 h-8 rounded-xl bg-primary-100 text-primary-800 flex items-center justify-center">
                    <Edit3 className="w-4 h-4" />
                  </div>
                )}
                <div>
                  <h3 className="text-sm font-bold text-ink">
                    {actionType === 'request_changes' && 'Request Changes from Student'}
                    {actionType === 'reject' && 'Reject Project Prototype'}
                    {actionType === 'edit_resubmit' && 'Edit & Resubmit Prototype'}
                  </h3>
                  <p className="text-[11px] text-ink-muted truncate max-w-[240px]">
                    {projectForAction.title}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setProjectForAction(null);
                  setActionType(null);
                }}
                className="p-1.5 rounded-lg text-ink-muted hover:bg-surface-muted cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* FORM FOR REQUEST CHANGES OR REJECT */}
            {(actionType === 'request_changes' || actionType === 'reject') && (
              <form onSubmit={handleSubmitAction} className="space-y-3.5 text-xs">
                <div className="p-3 bg-surface-muted rounded-xl border border-surface-border space-y-1">
                  <p className="font-bold text-ink">Project: {projectForAction.title}</p>
                  <p className="text-[11px] text-ink-muted">Submitted by: {projectForAction.submitted_by} ({projectForAction.club_name})</p>
                </div>

                <div>
                  <label className="block font-bold text-ink mb-1.5">
                    {actionType === 'request_changes' ? 'Revision Instructions & Feedback *' : 'Rejection Reason *'}
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={actionFeedback}
                    onChange={(e) => setActionFeedback(e.target.value)}
                    placeholder={
                      actionType === 'request_changes'
                        ? 'e.g. Please update Docker container memory limits to 128MB and add unit tests for Python 3.12 before resubmitting...'
                        : 'e.g. Project does not meet the technical depth requirements for PRAGSOFT showcase...'
                    }
                    className="w-full p-3 bg-surface border border-surface-border rounded-xl focus:border-primary-600 focus:outline-none resize-none text-xs text-ink"
                  />
                </div>

                <div className="pt-2 border-t border-surface-border flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setProjectForAction(null);
                      setActionType(null);
                    }}
                    className="px-4 py-2 rounded-xl text-ink-muted hover:bg-surface-muted font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`px-5 py-2 rounded-xl font-bold text-white shadow-sm cursor-pointer transition-all ${
                      actionType === 'request_changes'
                        ? 'bg-amber-600 hover:bg-amber-700'
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    {actionType === 'request_changes' ? 'Send Change Request' : 'Confirm Rejection'}
                  </button>
                </div>
              </form>
            )}

            {/* FORM FOR STUDENT EDIT & RESUBMIT */}
            {actionType === 'edit_resubmit' && (
              <form onSubmit={handleSubmitAction} className="space-y-3 text-xs max-h-[70vh] overflow-y-auto pr-1">
                {projectForAction.review_feedback && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 space-y-1">
                    <span className="font-bold flex items-center gap-1 text-[11px]">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Coordinator Feedback to Address:</span>
                    </span>
                    <p className="text-xs italic">&ldquo;{projectForAction.review_feedback}&rdquo;</p>
                  </div>
                )}

                <div>
                  <label className="block font-bold text-ink mb-1">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full p-2.5 bg-surface border border-surface-border rounded-xl focus:border-primary-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-ink mb-1">Domain</label>
                  <select
                    value={editDomain}
                    onChange={(e) => setEditDomain(e.target.value)}
                    className="w-full p-2.5 bg-surface border border-surface-border rounded-xl focus:border-primary-600 focus:outline-none"
                  >
                    <option value="Software Engineering & Compilers">Software Engineering & Compilers</option>
                    <option value="AI & Machine Learning">AI & Machine Learning</option>
                    <option value="Spatial Computing & VR">Spatial Computing & VR</option>
                    <option value="Algorithms & Visualization">Algorithms & Visualization</option>
                    <option value="Healthcare & Social Impact">Healthcare & Social Impact</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-ink mb-1">Tech Stack (comma separated)</label>
                  <input
                    type="text"
                    value={editTechStack}
                    onChange={(e) => setEditTechStack(e.target.value)}
                    className="w-full p-2.5 bg-surface border border-surface-border rounded-xl focus:border-primary-600 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-ink mb-1">GitHub Repo URL</label>
                    <input
                      type="url"
                      value={editGithub}
                      onChange={(e) => setEditGithub(e.target.value)}
                      className="w-full p-2.5 bg-surface border border-surface-border rounded-xl focus:border-primary-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-ink mb-1">Live Demo URL</label>
                    <input
                      type="url"
                      value={editLive}
                      onChange={(e) => setEditLive(e.target.value)}
                      className="w-full p-2.5 bg-surface border border-surface-border rounded-xl focus:border-primary-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-ink mb-1">Abstract & Description *</label>
                  <textarea
                    rows={3}
                    required
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    className="w-full p-2.5 bg-surface border border-surface-border rounded-xl focus:border-primary-600 focus:outline-none resize-none"
                  />
                </div>

                <div className="pt-2 border-t border-surface-border flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setProjectForAction(null);
                      setActionType(null);
                    }}
                    className="px-4 py-2 rounded-xl text-ink-muted hover:bg-surface-muted font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#0A2540] hover:bg-[#1E3A8A] text-white font-bold shadow-sm cursor-pointer transition-all"
                  >
                    Resubmit Prototype →
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: VIEW FULL DETAILS & TECHNICAL BREAKDOWN */}
      {selectedProjectForDetails && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-lg w-full bg-surface rounded-3xl p-6 border border-surface-border shadow-float space-y-4 my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between pb-3 border-b border-surface-border">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-tag-blue text-primary-700">
                    {selectedProjectForDetails.domain}
                  </span>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    selectedProjectForDetails.status === 'approved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : selectedProjectForDetails.status === 'changes_requested'
                      ? 'bg-amber-100 text-amber-900'
                      : selectedProjectForDetails.status === 'rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-blue-100 text-blue-900'
                  }`}>
                    {selectedProjectForDetails.status.toUpperCase().replace('_', ' ')}
                  </span>
                </div>
                <h3 className="text-base font-black text-ink">{selectedProjectForDetails.title}</h3>
                <p className="text-xs text-primary-700 font-semibold">{selectedProjectForDetails.club_name}</p>
              </div>

              <button
                onClick={() => setSelectedProjectForDetails(null)}
                className="p-1.5 rounded-lg text-ink-muted hover:bg-surface-muted cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <h4 className="font-bold text-ink uppercase tracking-wider text-[10px] text-ink-muted mb-1">Description & Methodology</h4>
                <p className="text-ink leading-relaxed p-3 bg-surface-muted rounded-xl border border-surface-border">
                  {selectedProjectForDetails.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-surface-muted rounded-xl border border-surface-border">
                  <span className="text-[10px] font-bold text-ink-muted uppercase">Lead Developer</span>
                  <p className="font-bold text-ink mt-0.5">{selectedProjectForDetails.submitted_by}</p>
                  <p className="text-[11px] text-ink-muted font-mono">{selectedProjectForDetails.student_id || 'ID: 24A31A05EB'}</p>
                </div>

                <div className="p-3 bg-surface-muted rounded-xl border border-surface-border">
                  <span className="text-[10px] font-bold text-ink-muted uppercase">Showcase Publication</span>
                  <p className="font-bold text-ink mt-0.5">
                    {selectedProjectForDetails.publication_status === 'showcased' ? '🌐 Publicly Showcased' : '🔒 Private Submission'}
                  </p>
                  <p className="text-[11px] text-ink-muted">
                    {selectedProjectForDetails.showcased_at ? `Published on ${selectedProjectForDetails.showcased_at}` : 'Awaiting showcase action'}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-ink uppercase tracking-wider text-[10px] text-ink-muted mb-1.5">Technologies</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProjectForDetails.tech_stack.map((t, idx) => (
                    <span key={idx} className="text-xs font-semibold px-2.5 py-1 bg-surface-muted border border-surface-border rounded-lg text-ink">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
                {selectedProjectForDetails.github_url && (
                  <a
                    href={selectedProjectForDetails.github_url}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-1/2 py-2 px-3 rounded-xl bg-surface-muted hover:bg-surface border border-surface-border text-ink font-bold flex items-center justify-center gap-1.5"
                  >
                    <Github className="w-4 h-4" />
                    <span>View Repository</span>
                  </a>
                )}
                {(selectedProjectForDetails.live_url || selectedProjectForDetails.demo_url) && (
                  <a
                    href={selectedProjectForDetails.live_url || selectedProjectForDetails.demo_url}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-1/2 py-2 px-3 rounded-xl bg-[#0A2540] hover:bg-[#1E3A8A] text-white font-bold flex items-center justify-center gap-1.5"
                  >
                    <Globe className="w-4 h-4" />
                    <span>Launch Live Demo</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: REGISTER NEW PROTOTYPE */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-lg w-full bg-surface rounded-3xl p-6 border border-surface-border shadow-float space-y-4 my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-ink">Register Project Prototype</h3>
                  <p className="text-[11px] text-ink-muted">Submit for club review and platform showcase</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-ink-muted hover:bg-surface-muted cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-ink mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Distributed Compiler Sandbox with Docker"
                  className="w-full p-2.5 bg-surface border border-surface-border rounded-xl focus:border-primary-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-ink mb-1">Affiliated Club</label>
                  <select
                    value={newClub}
                    onChange={(e) => setNewClub(e.target.value)}
                    className="w-full p-2.5 bg-surface border border-surface-border rounded-xl focus:border-primary-600 focus:outline-none"
                  >
                    {clubs.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-ink mb-1">Domain</label>
                  <select
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    className="w-full p-2.5 bg-surface border border-surface-border rounded-xl focus:border-primary-600 focus:outline-none"
                  >
                    <option value="Software Engineering & Compilers">Software Engineering & Compilers</option>
                    <option value="AI & Machine Learning">AI & Machine Learning</option>
                    <option value="Spatial Computing & VR">Spatial Computing & VR</option>
                    <option value="Algorithms & Visualization">Algorithms & Visualization</option>
                    <option value="Healthcare & Social Impact">Healthcare & Social Impact</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">Lead Developer Name</label>
                <input
                  type="text"
                  value={newStudent}
                  onChange={(e) => setNewStudent(e.target.value)}
                  className="w-full p-2.5 bg-surface border border-surface-border rounded-xl focus:border-primary-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">Tech Stack (comma separated)</label>
                <input
                  type="text"
                  value={newTechStack}
                  onChange={(e) => setNewTechStack(e.target.value)}
                  placeholder="Next.js, Docker, WebSockets, Go"
                  className="w-full p-2.5 bg-surface border border-surface-border rounded-xl focus:border-primary-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-ink mb-1">GitHub Repo URL</label>
                  <input
                    type="url"
                    value={newGithub}
                    onChange={(e) => setNewGithub(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full p-2.5 bg-surface border border-surface-border rounded-xl focus:border-primary-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-ink mb-1">Live Demo URL</label>
                  <input
                    type="url"
                    value={newLive}
                    onChange={(e) => setNewLive(e.target.value)}
                    placeholder="https://..."
                    className="w-full p-2.5 bg-surface border border-surface-border rounded-xl focus:border-primary-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">Abstract & Description</label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Explain problem statement, methodology, and outcome..."
                  className="w-full p-2.5 bg-surface border border-surface-border rounded-xl focus:border-primary-600 focus:outline-none resize-none"
                />
              </div>

              <div className="pt-3 border-t border-surface-border flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-ink-muted hover:bg-surface-muted font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0A2540] hover:bg-[#1E3A8A] text-white font-bold shadow-sm cursor-pointer transition-all"
                >
                  Submit Prototype
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
