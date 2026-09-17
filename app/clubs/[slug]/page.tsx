'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { dataService, useCentralDataSync } from '@/lib/dataService';
import { useAuth } from '@/lib/authContext';
import {
  Users,
  Calendar,
  Trophy,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  BookOpen,
  Mail,
  UserPlus
} from 'lucide-react';
import Link from 'next/link';
import { triggerConfetti } from '@/lib/confetti';
import AuthRequiredModal from '@/components/AuthRequiredModal';

export default function ClubDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const dataVersion = useCentralDataSync();
  const club = dataService.getClubBySlug(slug) || dataService.getClubs()[0];
  const { currentRole, userProfile, isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const isMember = isAuthenticated && userProfile
    ? dataService.isClubMember(club.id, userProfile.id || userProfile.email)
    : false;

  const clubEvents = dataService.getEvents().filter(e => e.club_id === club.id);
  const clubProjects = dataService.getProjects().filter(p => p.club_id === club.id);

  const handleJoinClub = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    const res = dataService.joinClub(club.id, userProfile);
    if (res.success) {
      triggerConfetti({
        particleCount: 100,
        spread: 70,
      });
    } else {
      alert(res.error || 'Failed to join club');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-muted">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Cover Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden h-64 sm:h-80 w-full bg-ink shadow-lg">
          <img
            src={club.cover_url}
            alt={club.name}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />

          {/* Overlay Text & Join CTA */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl text-white">
              <div className="flex items-center gap-3">
                {club.logo.startsWith('/') ? (
                  <img src={club.logo} alt={club.name} className="w-14 h-14 sm:w-16 sm:h-16 object-contain rounded-2xl bg-black/40 backdrop-blur-md p-1.5 border border-white/30 shadow-lg shrink-0" />
                ) : (
                  <span className="text-3xl sm:text-4xl">{club.logo}</span>
                )}
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20">
                  {club.domain}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {club.name}
              </h1>
              <p className="text-xs sm:text-sm text-white/80 line-clamp-2">
                {club.description}
              </p>
            </div>

            {/* Join Action */}
            <div>
              {!isMember ? (
                <button
                  onClick={handleJoinClub}
                  className="px-6 py-3 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white text-xs sm:text-sm font-bold shadow-glow hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Join This Club</span>
                </button>
              ) : (
                <div className="px-5 py-2.5 rounded-2xl bg-emerald-500/90 text-white text-xs font-bold flex items-center gap-2 backdrop-blur-md">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Official Member Active</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3 Core Content Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (2 Cols) */}
          <div className="lg:col-span-2 space-y-8">
            {/* 1. About & Objectives */}
            <div className="coursue-card p-6 space-y-4">
              <h2 className="text-lg font-bold text-ink">Objectives & Research Focus</h2>
              <p className="text-xs text-ink-muted leading-relaxed">
                The {club.name} operates as an autonomous student research and development body. Our mission is to bridge academic theory with industry engineering practices through student-led projects, competitive hackathons, open-source development, and peer mentorship.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {club.tags.map((tag, i) => (
                  <span key={i} className="text-xs font-semibold px-3 py-1 rounded-xl bg-primary-50 text-primary-700 border border-primary-100">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* 2. Events by this Club */}
            <div className="coursue-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-ink">Club Workshops & Hackathons</h2>
                <span className="text-xs text-ink-muted">{clubEvents.length} Sessions</span>
              </div>

              <div className="space-y-3">
                {clubEvents.map((event) => (
                  <Link
                    key={event.id}
                    href={`/events/${event.id}`}
                    className="p-4 rounded-2xl bg-surface-muted border border-surface-border hover:border-primary-400 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all group"
                  >
                    <div className="space-y-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${event.tag_color}`}>
                        {event.event_type}
                      </span>
                      <h4 className="text-sm font-bold text-ink group-hover:text-primary-600 transition-colors">
                        {event.title}
                      </h4>
                      <p className="text-xs text-ink-muted">{event.venue} • {new Date(event.start_time).toLocaleDateString()}</p>
                    </div>
                    <span className="text-xs font-bold text-primary-600 group-hover:translate-x-1 transition-transform">
                      Details →
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* 3. Projects Built by Members */}
            <div className="coursue-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-ink">Showcased Club Projects</h2>
                <Link href="/projects" className="text-xs font-semibold text-primary-600">
                  All Projects →
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {clubProjects.map((proj) => (
                  <div key={proj.id} className="p-4 rounded-2xl bg-surface-muted border border-surface-border space-y-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-tag-blue text-primary-700">
                      ★ {proj.rating}/10
                    </span>
                    <h4 className="text-xs font-bold text-ink">{proj.title}</h4>
                    <p className="text-[11px] text-ink-muted line-clamp-2">{proj.description}</p>
                    <div className="pt-2 border-t border-surface-border flex items-center justify-between text-[11px]">
                      <span className="text-ink-muted">By {proj.submitted_by}</span>
                      <a href={proj.github_url} target="_blank" className="text-primary-600 font-semibold hover:underline">
                        Code ↗
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Governance & Team */}
          <div className="space-y-6">
            {/* Faculty Advisor Card */}
            <div className="coursue-card p-6 space-y-4">
              <div className="flex items-center gap-2 text-primary-700 font-bold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>Faculty Coordinator</span>
              </div>
              <div className="flex items-center gap-3">
                <img
                  src={club.slug === 'csec-council' ? "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80" : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-primary-200"
                  alt="Faculty Head"
                />
                <div>
                  <h4 className="text-sm font-bold text-ink">{club.coordinator_name}</h4>
                  <p className="text-[11px] text-ink-muted">
                    {club.slug === 'csec-council' ? 'Apex Faculty Coordinator (CSE)' : 'Faculty Head & Accountability Officer'}
                  </p>
                </div>
              </div>
            </div>

            {/* Executive Student Board */}
            <div className="coursue-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-ink">Executive Student Board (2026-27)</h3>
                {club.slug === 'csec-council' && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-100 text-primary-800">
                    24 Officers
                  </span>
                )}
              </div>

              {club.slug === 'csec-council' ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-primary-200"
                    />
                    <div>
                      <p className="text-xs font-bold text-ink">Bathina Surya Abhilash</p>
                      <p className="text-[10px] text-primary-600 font-bold">President (III-F • 24A31A05KF)</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-primary-200"
                    />
                    <div>
                      <p className="text-xs font-bold text-ink">Vasamsetti Jahnavi Devi</p>
                      <p className="text-[10px] text-primary-600 font-bold">Deputy President (II-D • 25A31A05ET)</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80"
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-primary-200"
                    />
                    <div>
                      <p className="text-xs font-bold text-ink">Nakka Poojitha</p>
                      <p className="text-[10px] text-primary-600 font-bold">Chief Technical Coordinator (III-F)</p>
                    </div>
                  </div>

                  <Link
                    href="/teams"
                    className="block text-center py-2 px-3 rounded-xl bg-surface-muted hover:bg-surface border border-surface-border text-xs font-bold text-primary-700 hover:text-primary-800 transition-colors"
                  >
                    View Full 24 Council Officers →
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80"
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-xs font-bold text-ink">Rohan Deshmukh</p>
                      <p className="text-[10px] text-primary-600 font-semibold">Club President / Admin</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-xs font-bold text-ink">Ananya Verma</p>
                      <p className="text-[10px] text-primary-600 font-semibold">Vice President & Tech Lead</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Roadmaps Shortcut */}
            <div className="coursue-card p-6 space-y-3 bg-gradient-to-br from-primary-50 to-primary-100/50 border-primary-200">
              <div className="flex items-center gap-2 text-primary-700 font-bold text-xs">
                <BookOpen className="w-4 h-4" />
                <span>Club Learning Roadmap</span>
              </div>
              <p className="text-xs text-ink-muted">
                Follow the 3-stage curated roadmap for this club and earn verifiable skill completion credentials.
              </p>
              <Link
                href="/roadmaps"
                className="w-full py-2 rounded-xl bg-primary-600 text-white text-xs font-bold flex items-center justify-center gap-1 shadow-sm"
              >
                Open Roadmap →
              </Link>
            </div>
          </div>
        </div>
      </main>

      <AuthRequiredModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title="Join Club Requires Student Account"
        message={`Please login or create an account with your Pragati College ID to join ${club.name} and receive an active digital membership card.`}
        redirectUrl={`/clubs/${club.slug}`}
      />

      <Footer />
    </div>
  );
}
