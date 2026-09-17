'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { dataService } from '@/lib/dataService';
import { Mail, Bell, AlertCircle, Award, Calendar, Sparkles, Filter } from 'lucide-react';

export default function AnnouncementsPage() {
  const announcements = dataService.getAnnouncements();
  const [selectedCat, setSelectedCat] = useState('all');

  const categories = ['all', 'Alert', 'Recruitment', 'Achievement', 'Notice'];

  const filtered = announcements.filter(a =>
    selectedCat === 'all' || a.category.toLowerCase() === selectedCat.toLowerCase()
  );

  return (
    <div className="min-h-screen flex flex-col bg-surface-muted">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tag-pink text-pink-800 text-xs font-bold">
            <Bell className="w-3.5 h-3.5" />
            <span>Official Bulletins</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-ink">Club Announcements & Notices</h1>
          <p className="text-xs sm:text-sm text-ink-muted">
            Important updates, hackathon deadlines, recruitment drives, and student competition achievements.
          </p>
        </div>

        {/* Categories */}
        <div className="flex items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors ${
                selectedCat === cat
                  ? 'bg-primary-600 text-white'
                  : 'bg-surface border border-surface-border text-ink-muted hover:text-ink'
              }`}
            >
              {cat === 'all' ? 'All Notices' : cat}
            </button>
          ))}
        </div>

        {/* Announcements List */}
        <div className="space-y-4">
          {filtered.map((ann) => (
            <div
              key={ann.id}
              className={`coursue-card p-6 space-y-3 transition-all ${
                ann.important ? 'border-primary-300 bg-gradient-to-r from-primary-50/50 to-surface' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    ann.category === 'Alert' ? 'bg-red-100 text-red-800' :
                    ann.category === 'Recruitment' ? 'bg-primary-100 text-primary-800' :
                    ann.category === 'Achievement' ? 'bg-emerald-100 text-emerald-800' : 'bg-tag-blue text-primary-700'
                  }`}>
                    {ann.category.toUpperCase()}
                  </span>
                  {ann.important && (
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Important
                    </span>
                  )}
                </div>
                <span className="text-xs text-ink-muted">{ann.date}</span>
              </div>

              <h3 className="text-base font-bold text-ink leading-snug">{ann.title}</h3>
              <p className="text-xs text-ink-muted leading-relaxed">{ann.content}</p>

              <div className="pt-2 border-t border-surface-border flex items-center justify-between text-xs">
                <span className="text-primary-700 font-semibold">{ann.club_name}</span>
                <span className="text-[11px] text-ink-muted">Published to All Members</span>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
