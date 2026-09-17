'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { dataService } from '@/lib/dataService';
import { useAuth } from '@/lib/authContext';
import { BookOpen, CheckCircle2, Award, Sparkles, Clock, ArrowRight, Wrench, Lock, Check } from 'lucide-react';
import Link from 'next/link';
import { triggerConfetti } from '@/lib/confetti';
import AuthRequiredModal from '@/components/AuthRequiredModal';

export default function RoadmapsPage() {
  const roadmaps = dataService.getRoadmaps();
  const [selectedRoadmapId, setSelectedRoadmapId] = useState(roadmaps[0]?.id || 'r-dsa');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [progressVersion, setProgressVersion] = useState(0);
  const { userProfile, currentRole, isAuthenticated } = useAuth();

  const currentRoadmap = roadmaps.find(r => r.id === selectedRoadmapId) || roadmaps[0];

  const handleToggleResource = (roadmapId: string, stageIdx: number, resIdx: number) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    const userId = userProfile?.id || 'guest';
    const result = dataService.toggleUserResourceComplete(userId, roadmapId, stageIdx, resIdx);
    setProgressVersion(v => v + 1);

    if (result.allStageCompleted && result.badgeName) {
      triggerConfetti({
        particleCount: 110,
        spread: 75,
      });
      dataService.logAction('Unlocked Skill Badge', `${result.badgeName} awarded to ${userProfile?.full_name || 'Student'}`, currentRole);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-muted">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tag-violet text-primary-700 text-xs font-bold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Structured Technical Learning Paths</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-ink">Interactive LMS Roadmaps</h1>
          <p className="text-xs sm:text-sm text-ink-muted">
            Master engineering disciplines with Beginner → Intermediate → Advanced step-by-step roadmaps. Complete practical milestones to unlock verifiable credentials.
          </p>
        </div>

        {/* Authentication State Notification Banner */}
        {!isAuthenticated ? (
          <div className="coursue-card p-5 bg-gradient-to-r from-primary-50 via-white to-primary-50/30 border-2 border-primary-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl shadow-sm">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-primary-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Lock className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-ink">Personal Learning Progress Tracking</h3>
                <p className="text-xs text-ink-muted">
                  Sign in with your Pragati student ID to track completed modules, view personal progress percentages, and claim verified skill badges.
                </p>
              </div>
            </div>
            <Link
              href="/login"
              className="px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shrink-0 shadow-sm transition-all hover:scale-105"
            >
              Login to Track Progress
            </Link>
          </div>
        ) : (
          <div className="coursue-card p-4 bg-emerald-50/70 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-900">
                  Student Learning Profile: <span className="underline">{userProfile?.full_name}</span> ({userProfile?.membership_number || userProfile?.academic_year || 'Pragati ID'})
                </p>
                <p className="text-[11px] text-emerald-700">
                  Your module completions and skill badges are isolated and saved to your personal student account.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 self-start sm:self-center">
              ✓ Personal Sync Active
            </span>
          </div>
        )}

        {/* Roadmap Selector Tabs */}
        <div className="flex items-center justify-center gap-3 overflow-x-auto pb-2">
          {roadmaps.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelectedRoadmapId(r.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all ${
                selectedRoadmapId === r.id
                  ? 'bg-primary-600 text-white shadow-glow'
                  : 'bg-surface border border-surface-border text-ink hover:bg-surface-subtle'
              }`}
            >
              <span>{r.icon}</span>
              <span>{r.technology}</span>
            </button>
          ))}
        </div>

        {/* Selected Roadmap Stages Grid */}
        <div className="space-y-6">
          {currentRoadmap.stages.map((stage, sIdx) => {
            const total = stage.resources.length;
            const stats = isAuthenticated
              ? dataService.getUserStageStats(userProfile?.id, currentRoadmap.id, sIdx, total)
              : { completed: 0, total, percent: 0, isComplete: false };

            return (
              <div
                key={`${stage.stage}-${sIdx}-${progressVersion}`}
                className={`coursue-card p-6 sm:p-8 space-y-6 transition-all ${
                  isAuthenticated && stats.isComplete
                    ? 'border-emerald-300 bg-gradient-to-r from-emerald-50/40 via-white to-surface shadow-sm'
                    : ''
                }`}
              >
                {/* Stage Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        stage.stage === 'Beginner' ? 'bg-emerald-100 text-emerald-800' :
                        stage.stage === 'Intermediate' ? 'bg-primary-100 text-primary-800' : 'bg-pink-100 text-pink-800'
                      }`}>
                        Stage {sIdx + 1}: {stage.stage.toUpperCase()}
                      </span>
                      <span className="text-xs text-ink-muted flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {stage.duration}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-ink">{stage.title}</h3>
                    <p className="text-xs text-ink-muted max-w-2xl">{stage.description}</p>
                  </div>

                  {/* Progress & Badge */}
                  <div className="flex items-center gap-4 self-start sm:self-center">
                    {isAuthenticated ? (
                      /* Authenticated Student Progress */
                      <>
                        <div className="text-right min-w-[120px]">
                          <p className="text-xs font-bold text-ink">{stats.completed}/{total} Completed</p>
                          <div className="w-28 h-2 bg-surface-subtle rounded-full overflow-hidden mt-1">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                stats.isComplete ? 'bg-emerald-600' : 'bg-primary-600'
                              }`}
                              style={{ width: `${stats.percent}%` }}
                            />
                          </div>
                        </div>

                        <div className={`px-3 py-2 rounded-2xl flex items-center gap-1.5 text-xs font-bold transition-all ${
                          stats.isComplete
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm'
                            : 'bg-surface-subtle text-ink-muted border border-surface-border'
                        }`}>
                          <Award className={`w-4 h-4 ${stats.isComplete ? 'text-emerald-600' : 'text-ink-muted'}`} />
                          <span>{stage.badge}</span>
                        </div>
                      </>
                    ) : (
                      /* Public Unauthenticated Neutral State */
                      <>
                        <div className="flex items-center gap-1.5 bg-surface-subtle px-3 py-1.5 rounded-xl border border-surface-border text-ink-muted text-xs">
                          <Lock className="w-3.5 h-3.5 text-primary-600" />
                          <span>Login to track</span>
                        </div>

                        <div className="px-3 py-1.5 rounded-2xl bg-surface-subtle text-ink-muted flex items-center gap-1.5 text-xs font-semibold border border-surface-border" title="Login with student account to unlock this badge">
                          <Award className="w-4 h-4 text-ink-muted" />
                          <span>{stage.badge}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Skills Learned */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-ink uppercase tracking-wider">Key Competencies:</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {stage.skills.map((skill, k) => (
                      <span key={k} className="text-xs font-medium px-2.5 py-1 rounded-lg bg-surface-muted border border-surface-border text-ink">
                        ✓ {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Interactive Milestone Checkpoints */}
                <div className="space-y-2.5 pt-2">
                  <h4 className="text-xs font-bold text-ink uppercase tracking-wider">Milestone Modules & Workstations:</h4>
                  <div className="divide-y divide-surface-border bg-surface-muted rounded-2xl p-2 border border-surface-border">
                    {stage.resources.map((res, rIdx) => {
                      const isCompleted = isAuthenticated
                        ? dataService.isResourceCompleted(userProfile?.id, currentRoadmap.id, sIdx, rIdx)
                        : false;

                      return (
                        <div
                          key={rIdx}
                          onClick={() => handleToggleResource(currentRoadmap.id, sIdx, rIdx)}
                          className="py-3 px-3 flex items-center justify-between cursor-pointer hover:bg-surface rounded-xl transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            {isAuthenticated ? (
                              <button
                                type="button"
                                className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors cursor-pointer ${
                                  isCompleted
                                    ? 'bg-primary-600 border-primary-600 text-white'
                                    : 'border-surface-border bg-surface hover:border-primary-400'
                                }`}
                              >
                                {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                              </button>
                            ) : (
                              <div className="w-5 h-5 rounded-md border border-surface-border bg-surface flex items-center justify-center text-[10px] text-ink-muted font-bold">
                                {rIdx + 1}
                              </div>
                            )}

                            <div>
                              <p className={`text-xs font-bold ${isCompleted ? 'line-through text-ink-muted' : 'text-ink group-hover:text-primary-600'}`}>
                                {res.title}
                              </p>
                              <span className="text-[10px] text-ink-muted">{res.type} • {res.duration}</span>
                            </div>
                          </div>

                          <span className="text-[11px] font-semibold text-primary-600 group-hover:underline">
                            {isAuthenticated ? (isCompleted ? 'Completed ✓' : 'Mark as Done →') : 'Preview Topic →'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tools Directory Cross-link */}
        <div className="coursue-card p-6 bg-gradient-to-r from-primary-600 to-indigo-700 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Wrench className="w-5 h-5 text-primary-200" />
              <span>Recommended Development Tools for These Roadmaps</span>
            </h3>
            <p className="text-xs text-white/80">
              Browse IDE extensions, API test suites, and Docker container frameworks verified for college workstations.
            </p>
          </div>
          <Link
            href="/tools"
            className="px-5 py-2.5 rounded-full bg-white text-primary-700 hover:bg-white/90 text-xs font-bold whitespace-nowrap shadow-sm"
          >
            Explore Tools Directory →
          </Link>
        </div>
      </main>

      <AuthRequiredModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title="Student Login Required to Track LMS Progress"
        message="Please login or create an account with your Pragati College ID to track progress across LMS roadmaps and earn verifiable skill badges."
        redirectUrl="/roadmaps"
      />

      <Footer />
    </div>
  );
}
