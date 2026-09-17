'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/lib/authContext';
import { dataService, useCentralDataSync } from '@/lib/dataService';
import { PragatiLogo, PathubBadge } from '@/components/PragatiLogo';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Calendar,
  CreditCard,
  Trophy,
  BookOpen,
  Wrench,
  Users,
  CheckCircle2,
  Award,
  Search,
  ExternalLink,
  ChevronRight,
  Code2,
  Layers,
  Heart
} from 'lucide-react';

export default function HomePage() {
  const { currentRole, userProfile, isAuthenticated } = useAuth();
  const dataVersion = useCentralDataSync();
  const clubs = dataService.getClubs();
  const stats = dataService.getGlobalStats();

  const events = dataService.getEvents();
  const projects = dataService.getProjects();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredClubs = clubs.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen flex flex-col bg-surface-muted">
      <Navbar />

      {/* Main Hero Section */}
      <section className="relative overflow-hidden pt-10 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            {/* Accreditation Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-100/80 border border-primary-200 text-primary-800 text-xs font-bold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 fill-current text-primary-600" />
              <span>Pragati University • Centralized Clubs Ecosystem (CSEC & PATHUB)</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#0A2540] tracking-tight leading-[1.15]">
              Empowering Student Innovators Across <span className="text-primary-600 underline decoration-amber-400 decoration-wavy decoration-2">Pragati University Clubs</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-base text-ink-muted leading-relaxed max-w-2xl mx-auto">
              Governed by the <strong>Computer Science Executive Council (CSEC)</strong>. Managing <strong>PRAGSOFT</strong> coding competitions, <strong>AR/VR Lab</strong>, <strong>Rotaract Club</strong>, digital QR passes, and automated certificates.
            </p>

            {/* PROMINENT SEARCH BAR BELOW MAIN HEADING (User Request) */}
            <div className="pt-2 max-w-2xl mx-auto">
              <div className="relative flex items-center shadow-float rounded-2xl bg-surface border-2 border-primary-300 focus-within:border-primary-600 transition-all p-1.5">
                <Search className="w-5 h-5 text-primary-600 ml-3.5 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search PRAGSOFT, AR/VR, Rotaract, hackathons, roadmaps, or projects..."
                  className="w-full text-xs sm:text-sm text-ink placeholder:text-ink-muted px-3 py-2.5 bg-transparent focus:outline-none"
                />
                <Link
                  href={searchQuery ? `/search?q=${encodeURIComponent(searchQuery)}` : '/search'}
                  className="px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shrink-0 transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="flex items-center justify-center gap-2 pt-2.5 text-[11px] text-ink-muted">
                <span className="font-semibold text-ink">Popular:</span>
                <button onClick={() => setSearchQuery('PRAGSOFT')} className="hover:text-primary-600 underline">PRAGSOFT</button>
                <span>•</span>
                <button onClick={() => setSearchQuery('AR/VR')} className="hover:text-primary-600 underline">AR/VR Lab</button>
                <span>•</span>
                <button onClick={() => setSearchQuery('CSEC')} className="hover:text-primary-600 underline">CSEC Council</button>
                <span>•</span>
                <button onClick={() => setSearchQuery('Rotaract')} className="hover:text-primary-600 underline">Rotaract</button>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-4">
              {isAuthenticated ? (
                <>
                  <Link
                    href={`/dashboard/${currentRole.replace('_', '-')}`}
                    className="px-6 py-3.5 rounded-full bg-[#0A2540] hover:bg-[#1E3A8A] text-white text-xs sm:text-sm font-bold shadow-glow hover:scale-105 transition-all flex items-center gap-2"
                  >
                    <span>Launch {currentRole.replace('_', ' ').toUpperCase()} Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/clubs"
                    className="px-6 py-3.5 rounded-full bg-surface border border-surface-border hover:border-primary-400 text-ink text-xs sm:text-sm font-bold transition-all hover:bg-surface-subtle"
                  >
                    Browse All 4 Clubs
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/register"
                    className="px-6 py-3.5 rounded-full bg-[#0A2540] hover:bg-[#1E3A8A] text-white text-xs sm:text-sm font-bold shadow-glow hover:scale-105 transition-all flex items-center gap-2"
                  >
                    <span>CREATE STUDENT ACCOUNT</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/login"
                    className="px-6 py-3.5 rounded-full bg-primary-600 hover:bg-primary-700 text-white text-xs sm:text-sm font-bold shadow-sm transition-all hover:scale-105"
                  >
                    <span>LOGIN / SIGN IN</span>
                  </Link>
                  <Link
                    href="/clubs"
                    className="px-6 py-3.5 rounded-full bg-surface border border-surface-border hover:border-primary-400 text-ink text-xs sm:text-sm font-bold transition-all hover:bg-surface-subtle"
                  >
                    Explore 4 Clubs
                  </Link>
                </>
              )}
            </div>


            {/* Quick Stats Ticker */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-surface-border mt-8">
              <div className="coursue-card p-4">
                <p className="text-2xl sm:text-3xl font-black text-primary-600">{clubs.length}</p>
                <p className="text-xs font-bold text-ink mt-0.5">Active Clubs & Councils</p>
                <p className="text-[10px] text-ink-muted">PRAGSOFT, AR/VR, CSEC, Rotaract</p>
              </div>

              <div className="coursue-card p-4">
                <p className="text-2xl sm:text-3xl font-black text-[#0A2540]">{stats.total_active_members}+</p>
                <p className="text-xs font-bold text-ink mt-0.5">Enrolled Pragati Students</p>
                <p className="text-[10px] text-ink-muted">Digital QR Pass Issued</p>
              </div>
              <div className="coursue-card p-4">
                <p className="text-2xl sm:text-3xl font-black text-emerald-600">{stats.total_events}+</p>
                <p className="text-xs font-bold text-ink mt-0.5">Hackathons & Coding Camps</p>
                <p className="text-[10px] text-ink-muted">Live Mobile QR Check-in</p>
              </div>
              <div className="coursue-card p-4">
                <p className="text-2xl sm:text-3xl font-black text-amber-600">A+ NAAC</p>
                <p className="text-xs font-bold text-ink mt-0.5">Accredited Excellence</p>
                <p className="text-[10px] text-ink-muted">25 Years of Leadership</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Clubs Grid featuring PRAGSOFT, AR/VR, Rotaract, CSEC */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-700 bg-primary-50 px-3 py-1 rounded-full mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Pragati University Autonomous Societies</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-ink">Technical, Council & Social Clubs</h2>
          </div>
          <Link href="/clubs" className="text-xs font-bold text-primary-600 hover:underline flex items-center gap-1">
            View All Clubs <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClubs.map((club) => (
            <Link
              key={club.id}
              href={`/clubs/${club.slug}`}
              className={`coursue-card-interactive p-6 flex flex-col justify-between group ${
                club.category === 'Apex Council' ? 'border-amber-300 bg-gradient-to-br from-amber-50/40 via-white to-surface' : ''
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-surface border border-surface-border shadow-xs flex items-center justify-center group-hover:scale-110 transition-transform overflow-hidden p-1">
                    {club.logo.startsWith('/') ? (
                      <img src={club.logo} alt={club.name} className="w-full h-full object-contain rounded-xl" />
                    ) : (
                      <span className="text-2xl">{club.logo}</span>
                    )}
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    club.category === 'Apex Council' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                    club.category === 'Non-Technical' ? 'bg-pink-100 text-pink-800 border border-pink-200' : 'bg-tag-teal text-emerald-800 border border-emerald-200'
                  }`}>
                    {club.category.toUpperCase()}
                  </span>

                </div>

                <div>
                  <h3 className="text-base font-bold text-ink group-hover:text-primary-600 transition-colors">
                    {club.name}
                  </h3>
                  <p className="text-xs text-primary-700 font-semibold mt-0.5">{club.domain}</p>
                  <p className="text-xs text-ink-muted mt-2 line-clamp-2 leading-relaxed">
                    {club.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {club.tags.map((t, idx) => (
                    <span key={idx} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-surface-muted border border-surface-border text-ink-muted">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-6 border-t border-surface-border flex items-center justify-between text-xs text-ink-muted font-medium">
                <span>👥 {club.members_count} Members</span>
                <span className="text-primary-600 font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-0.5">
                  Explore Club →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Flagship CSEC Council Governance Banner */}
      <section className="py-12 bg-surface border-y border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs font-bold text-primary-700 uppercase tracking-wider bg-primary-50 px-3 py-1 rounded-full">
                Apex Governance Body
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-ink">
                Computer Science Executive Council (CSEC)
              </h2>
              <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
                The Computer Science Executive Council acts as the central administrative pillar at Pragati University. CSEC coordinates with faculty advisors, approves executive student tenures, sanctions hackathon funding, and ensures strict Row-Level Security across all club operations.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href="/clubs/csec-council"
                  className="px-5 py-2.5 rounded-2xl bg-[#0A2540] text-white text-xs font-bold shadow-sm"
                >
                  CSEC Council Overview
                </Link>
                <Link
                  href="/teams"
                  className="px-5 py-2.5 rounded-2xl border border-surface-border text-ink text-xs font-bold hover:bg-surface-subtle"
                >
                  View Executive Tenures
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="coursue-card p-5 space-y-2">
                <Code2 className="w-8 h-8 text-primary-600" />
                <h4 className="text-xs font-bold text-ink">PRAGSOFT Coding</h4>
                <p className="text-[11px] text-ink-muted">Algorithmic competitions, DSA bootcamps & 24h hackathons.</p>
              </div>
              <div className="coursue-card p-5 space-y-2">
                <Layers className="w-8 h-8 text-blue-600" />
                <h4 className="text-xs font-bold text-ink">AR/VR Spatial Lab</h4>
                <p className="text-[11px] text-ink-muted">Unity 3D, Meta Quest VR headsets & campus metaverse.</p>
              </div>
              <div className="coursue-card p-5 space-y-2">
                <Heart className="w-8 h-8 text-pink-600" />
                <h4 className="text-xs font-bold text-ink">Rotaract Social</h4>
                <p className="text-[11px] text-ink-muted">Youth leadership, public speaking & community service.</p>
              </div>
              <div className="coursue-card p-5 space-y-2">
                <ShieldCheck className="w-8 h-8 text-emerald-600" />
                <h4 className="text-xs font-bold text-ink">PATHUB Tech Hub</h4>
                <p className="text-[11px] text-ink-muted">Advanced technology research, robotics & cloud IoT.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Rated Projects Showcase */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-ink">Top Rated Student Projects</h2>
            <p className="text-xs sm:text-sm text-ink-muted mt-1">Reviewed by Faculty Coordinators & Ranked by CSEC Council</p>
          </div>
          <Link href="/projects" className="text-xs font-bold text-primary-600 hover:underline">
            View All Projects →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="coursue-card-interactive overflow-hidden flex flex-col group">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-44 object-cover group-hover:scale-105 transition-transform"
              />
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-tag-blue text-primary-700">
                      {project.domain}
                    </span>
                    <span className="text-xs font-bold text-amber-500">★ {project.rating}/10</span>
                  </div>
                  <h3 className="text-sm font-bold text-ink mt-2 leading-snug">{project.title}</h3>
                  <p className="text-xs text-ink-muted mt-1 line-clamp-2">{project.description}</p>
                </div>

                <div className="pt-3 border-t border-surface-border flex items-center justify-between text-xs">
                  <span className="text-[11px] text-primary-700 font-semibold">{project.club_name}</span>
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-ink-muted hover:text-ink flex items-center gap-1 font-mono text-[11px]"
                  >
                    GitHub <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
