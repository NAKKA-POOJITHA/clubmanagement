'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { dataService } from '@/lib/dataService';
import { useAuth } from '@/lib/authContext';
import { Trophy, Plus, CheckCircle2, ArrowLeft, Github, Globe, Lock, ArrowRight, UserCheck } from 'lucide-react';
import Link from 'next/link';
import { triggerConfetti } from '@/lib/confetti';

export default function SubmitProjectPage() {
  const router = useRouter();
  const { userProfile, isAuthenticated } = useAuth();
  const clubs = dataService.getClubs();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [clubId, setClubId] = useState(clubs[0]?.id || '');
  const [domain, setDomain] = useState('Full-Stack Web Engineering');
  const [techStack, setTechStack] = useState('');
  const [teamMembers, setTeamMembers] = useState(userProfile?.full_name || '');
  const [githubUrl, setGithubUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return;

    const club = clubs.find(c => c.id === clubId) || clubs[0];

    dataService.submitProject({
      title,
      description,
      club_id: club.id,
      club_name: club.name,
      domain,
      tech_stack: techStack.split(',').map(s => s.trim()).filter(Boolean),
      team: teamMembers.split(',').map(s => s.trim()).filter(Boolean),
      submitted_by: userProfile.full_name,
      github_url: githubUrl || 'https://github.com',
      demo_url: demoUrl || '',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80'
    }, userProfile);

    triggerConfetti({
      particleCount: 100,
      spread: 70,
    });

    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-muted">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <Link href="/projects" className="inline-flex items-center gap-1.5 text-xs font-bold text-ink-muted hover:text-ink">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects Showcase</span>
        </Link>

        {!isAuthenticated ? (
          <div className="coursue-card p-8 sm:p-10 text-center space-y-5">
            <div className="w-16 h-16 rounded-3xl bg-primary-50 border-2 border-primary-200 text-primary-600 flex items-center justify-center mx-auto shadow-sm">
              <Lock className="w-8 h-8" />
            </div>
            <div className="space-y-2 max-w-md mx-auto">
              <h1 className="text-2xl font-black text-[#0A2540]">
                Authentication Required to Submit Projects
              </h1>
              <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
                The project showcase is open for public viewing, but project submission requires an active student account so faculty coordinators can verify and score your contribution.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <Link
                href="/login?redirect=/projects/submit"
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#0A2540] hover:bg-[#1E3A8A] text-white text-xs font-bold shadow-sm flex items-center justify-center gap-2"
              >
                <span>LOGIN / SIGN IN</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/register?redirect=/projects/submit"
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow-sm flex items-center justify-center gap-2"
              >
                <span>CREATE STUDENT ACCOUNT</span>
                <UserCheck className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="coursue-card p-6 sm:p-8 space-y-6">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h1 className="text-xl sm:text-2xl font-extrabold text-ink">Submit Project for Showcase</h1>
                  <p className="text-xs text-ink-muted mt-1">
                    Submissions enter the Faculty Coordinator review queue for qualitative feedback and leaderboard scoring.
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-ink">Project Title *</label>
                  <input
                    required
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Autonomous SLAM Robot or Next.js App"
                    className="w-full text-xs p-3 rounded-xl border border-surface-border bg-surface-muted focus:outline-none focus:border-primary-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-ink">Associated Technical Club *</label>
                    <select
                      value={clubId}
                      onChange={(e) => setClubId(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-surface-border bg-surface-muted focus:outline-none focus:border-primary-600"
                    >
                      {clubs.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-ink">Domain / Track *</label>
                    <input
                      required
                      type="text"
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      placeholder="e.g. Competitive Programming, AR/VR, Web Dev"
                      className="w-full text-xs p-3 rounded-xl border border-surface-border bg-surface-muted focus:outline-none focus:border-primary-600"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-ink">Abstract & Architecture Description *</label>
                  <textarea
                    required
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Explain the problem statement, technical stack, architecture, and prototype capabilities..."
                    className="w-full text-xs p-3 rounded-xl border border-surface-border bg-surface-muted focus:outline-none focus:border-primary-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-ink">Technologies Used (comma separated) *</label>
                  <input
                    required
                    type="text"
                    value={techStack}
                    onChange={(e) => setTechStack(e.target.value)}
                    placeholder="e.g. Next.js, PyTorch, Docker, Unity 3D, Supabase"
                    className="w-full text-xs p-3 rounded-xl border border-surface-border bg-surface-muted focus:outline-none focus:border-primary-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-ink">GitHub Repository URL *</label>
                    <input
                      required
                      type="url"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      placeholder="https://github.com/username/project"
                      className="w-full text-xs p-3 rounded-xl border border-surface-border bg-surface-muted focus:outline-none focus:border-primary-600 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-ink">Live Demo / Documentation Link</label>
                    <input
                      type="url"
                      value={demoUrl}
                      onChange={(e) => setDemoUrl(e.target.value)}
                      placeholder="https://my-demo-app.com"
                      className="w-full text-xs p-3 rounded-xl border border-surface-border bg-surface-muted focus:outline-none focus:border-primary-600 font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-ink">Team Members (comma separated) *</label>
                  <input
                    required
                    type="text"
                    value={teamMembers}
                    onChange={(e) => setTeamMembers(e.target.value)}
                    placeholder="e.g. Bathina Surya Abhilash, Vasamsetti Jahnavi Devi"
                    className="w-full text-xs p-3 rounded-xl border border-surface-border bg-surface-muted focus:outline-none focus:border-primary-600"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow-glow hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
                  >
                    <Trophy className="w-4 h-4" />
                    <span>Submit Project for Review</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center space-y-4 py-8">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-xl font-bold text-ink">Project Successfully Submitted!</h2>
                <p className="text-xs text-ink-muted max-w-md mx-auto leading-relaxed">
                  Your prototype has been added to the review queue for <strong className="text-ink">Dr. A. Avinash</strong> and Faculty Advisors. Once rated and approved, it will be ranked on the public leaderboard.
                </p>
                <div className="pt-4 flex items-center justify-center gap-3">
                  <Link
                    href="/projects"
                    className="px-6 py-2.5 rounded-2xl bg-primary-600 text-white text-xs font-bold shadow-sm"
                  >
                    View Showcase
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
