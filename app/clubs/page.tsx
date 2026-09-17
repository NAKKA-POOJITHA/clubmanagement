'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { dataService, useCentralDataSync } from '@/lib/dataService';
import { Search, Compass, Users, Calendar, Trophy, Sparkles, ArrowRight } from 'lucide-react';

export default function ClubsDirectoryPage() {
  const dataVersion = useCentralDataSync();
  const allClubs = dataService.getClubs();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'Technical', 'Apex Council', 'Non-Technical'];

  const filteredClubs = allClubs.filter(club => {
    const matchesSearch = club.name.toLowerCase().includes(search.toLowerCase()) ||
                          club.domain.toLowerCase().includes(search.toLowerCase()) ||
                          club.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || club.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col bg-surface-muted">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-bold">
            <Compass className="w-3.5 h-3.5" />
            <span>Autonomous Student Bodies</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-ink">Clubs & Councils Directory</h1>
          <p className="text-xs sm:text-sm text-ink-muted">
            Explore active technical societies, council leadership, and social/non-technical clubs across Pragati University.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by club name or technology..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-surface border border-surface-border rounded-2xl focus:outline-none focus:border-primary-600 shadow-sm"
            />
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-primary-600 text-white'
                    : 'bg-surface border border-surface-border text-ink-muted hover:text-ink'
                }`}
              >
                {cat === 'all' ? 'All Categories' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Clubs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClubs.map((club) => (
            <Link
              key={club.id}
              href={`/clubs/${club.slug}`}
              className="coursue-card-interactive overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Cover Image */}
                <div className="relative h-44 w-full overflow-hidden bg-surface-subtle">
                  <img
                    src={club.cover_url}
                    alt={club.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-surface/95 backdrop-blur-md px-2.5 py-1 rounded-xl text-xs font-bold text-ink shadow-md flex items-center gap-2 border border-surface-border">
                    {club.logo.startsWith('/') ? (
                      <img src={club.logo} alt={club.name} className="w-5 h-5 object-contain" />
                    ) : (
                      <span>{club.logo}</span>
                    )}
                    <span>Est. {club.established}</span>
                  </div>

                </div>

                {/* Body Content */}
                <div className="p-5 space-y-3">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-tag-blue text-primary-700">
                      {club.domain}
                    </span>
                    <h3 className="text-base font-bold text-ink group-hover:text-primary-600 transition-colors mt-2">
                      {club.name}
                    </h3>
                    <p className="text-xs text-ink-muted mt-1 leading-relaxed line-clamp-2">
                      {club.description}
                    </p>
                  </div>

                  {/* Technology Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {club.tags.map((t, idx) => (
                      <span key={idx} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-surface-muted border border-surface-border text-ink-muted">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Metrics Bar */}
              <div className="p-5 pt-3 border-t border-surface-border flex items-center justify-between text-xs text-ink-muted">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-primary-600" />
                    <strong className="text-ink">{club.members_count}</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-pink-600" />
                    <strong className="text-ink">{club.events_count}</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <Trophy className="w-3.5 h-3.5 text-emerald-600" />
                    <strong className="text-ink">{club.projects_count}</strong>
                  </span>
                </div>

                <span className="text-primary-600 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                  View <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
