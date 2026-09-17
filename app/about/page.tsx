'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Sparkles, ShieldCheck, Target, Award, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface-muted">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Hero */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Autonomous Technical Council</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-ink tracking-tight">
            Centralized Technical Clubs Management
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
            Unifying college innovation bodies under an automated governance framework. Replacing disjointed communication with cryptographic verification, instant certificates, and research showcases.
          </p>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="coursue-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-tag-violet text-primary-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-ink">Two-Tier RBAC & RLS Security</h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              Every database row in Supabase PostgreSQL is enforced with Row-Level Security policies checking role scope from Student to Super Admin.
            </p>
          </div>

          <div className="coursue-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-tag-pink text-pink-600 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-ink">Fully Automated Lifecycles</h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              From dynamic HTML poster generation to live QR check-ins and feedback-driven automated certificates with unique serial numbers.
            </p>
          </div>

          <div className="coursue-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-tag-teal text-emerald-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-ink">Verifiable Credentials</h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              Digital membership cards and certificates feature cryptographically linked QR verification pages for seamless offline/online audit.
            </p>
          </div>
        </div>

        {/* Faculty Oversight Section */}
        <div className="coursue-card p-8 bg-gradient-to-br from-surface to-primary-50/50 space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-ink">Governance & Faculty Oversight</h2>
            <p className="text-xs text-ink-muted">Accountability structure led by university professors and platform administrators.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-surface border border-surface-border">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-primary-200"
              />
              <div>
                <h4 className="text-sm font-bold text-ink">Nakka Poojitha</h4>
                <p className="text-xs text-primary-700 font-semibold">Super Admin & Faculty Head</p>
                <p className="text-[11px] text-ink-muted">Computer Science & Engineering</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-surface border border-surface-border">
              <img
                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80"
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-primary-200"
              />
              <div>
                <h4 className="text-sm font-bold text-ink">Dr. Rajeshwari Kulkarni</h4>
                <p className="text-xs text-primary-700 font-semibold">Faculty Coordinator</p>
                <p className="text-[11px] text-ink-muted">Department Technical Advisor</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
