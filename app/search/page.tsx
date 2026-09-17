'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { dataService, useCentralDataSync } from '@/lib/dataService';
import { Search, Compass, Calendar, Trophy, BookOpen, Wrench, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function GlobalSearchPage() {
  const dataVersion = useCentralDataSync();
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'clubs' | 'events' | 'projects' | 'tools'>('all');

  const clubs = dataService.getClubs();
  const events = dataService.getEvents();
  const projects = dataService.getProjects();
  const tools = dataService.getTools();

  const q = query.toLowerCase();

  const filteredClubs = clubs.filter(c => c.name.toLowerCase().includes(q) || c.domain.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));
  const filteredEvents = events.filter(e => e.title.toLowerCase().includes(q) || e.club_name.toLowerCase().includes(q) || e.description.toLowerCase().includes(q));
  const filteredProjects = projects.filter(p => p.title.toLowerCase().includes(q) || p.tech_stack.some(t => t.toLowerCase().includes(q)) || p.domain.toLowerCase().includes(q));
  const filteredTools = tools.filter(t => t.name.toLowerCase().includes(q) || t.purpose.toLowerCase().includes(q) || t.category.toLowerCase().includes(q));

  const totalResults = (activeFilter === 'all' || activeFilter === 'clubs' ? filteredClubs.length : 0) +
                       (activeFilter === 'all' || activeFilter === 'events' ? filteredEvents.length : 0) +
                       (activeFilter === 'all' || activeFilter === 'projects' ? filteredProjects.length : 0) +
                       (activeFilter === 'all' || activeFilter === 'tools' ? filteredTools.length : 0);

  return (
    <div className="min-h-screen flex flex-col bg-surface-muted">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h1 className="text-3xl font-extrabold text-ink">Universal Technical Search</h1>
          <p className="text-xs sm:text-sm text-ink-muted">
            Instant search across 5 technical clubs, events, student projects, LMS learning modules, and developer toolkits.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 text-ink-muted absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type anything (e.g. 'Robotics', 'PyTorch', 'Hackathon', 'Docker')..."
            className="w-full pl-12 pr-4 py-3.5 text-sm bg-surface border border-surface-border rounded-2xl focus:outline-none focus:border-primary-600 shadow-float"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {(['all', 'clubs', 'events', 'projects', 'tools'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors ${
                activeFilter === filter
                  ? 'bg-primary-600 text-white'
                  : 'bg-surface border border-surface-border text-ink-muted hover:text-ink'
              }`}
            >
              {filter}
            </button>
          ))}
          <span className="text-xs text-ink-muted ml-auto font-medium">
            Found {totalResults} matching results
          </span>
        </div>

        {/* Results List */}
        <div className="space-y-6">
          {/* Clubs */}
          {(activeFilter === 'all' || activeFilter === 'clubs') && filteredClubs.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-ink-muted uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-primary-600" />
                <span>Technical Clubs ({filteredClubs.length})</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredClubs.map(c => (
                  <Link key={c.id} href={`/clubs/${c.slug}`} className="coursue-card p-4 hover:border-primary-400 flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{c.logo}</span>
                      <div>
                        <h4 className="text-xs font-bold text-ink group-hover:text-primary-600">{c.name}</h4>
                        <p className="text-[10px] text-ink-muted">{c.domain}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-ink-muted group-hover:translate-x-1 transition-transform" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Events */}
          {(activeFilter === 'all' || activeFilter === 'events') && filteredEvents.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-ink-muted uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-pink-600" />
                <span>Events & Hackathons ({filteredEvents.length})</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredEvents.map(e => (
                  <Link key={e.id} href={`/events/${e.id}`} className="coursue-card p-4 hover:border-primary-400 flex items-center justify-between group">
                    <div>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${e.tag_color}`}>{e.event_type}</span>
                      <h4 className="text-xs font-bold text-ink group-hover:text-primary-600 mt-1">{e.title}</h4>
                      <p className="text-[10px] text-ink-muted">{e.club_name} • {new Date(e.start_time).toLocaleDateString()}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-ink-muted group-hover:translate-x-1 transition-transform" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {(activeFilter === 'all' || activeFilter === 'projects') && filteredProjects.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-ink-muted uppercase tracking-wider flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-emerald-600" />
                <span>Showcased Projects ({filteredProjects.length})</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredProjects.map(p => (
                  <Link key={p.id} href="/projects" className="coursue-card p-4 hover:border-primary-400 flex items-center justify-between group">
                    <div>
                      <h4 className="text-xs font-bold text-ink group-hover:text-primary-600">{p.title}</h4>
                      <p className="text-[10px] text-ink-muted">{p.domain} • Score: {p.rating}/10</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-ink-muted group-hover:translate-x-1 transition-transform" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Tools */}
          {(activeFilter === 'all' || activeFilter === 'tools') && filteredTools.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-ink-muted uppercase tracking-wider flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-blue-600" />
                <span>Development Tools ({filteredTools.length})</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredTools.map(t => (
                  <a key={t.id} href={t.official_link} target="_blank" rel="noreferrer" className="coursue-card p-4 hover:border-primary-400 flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{t.icon}</span>
                      <div>
                        <h4 className="text-xs font-bold text-ink group-hover:text-primary-600">{t.name}</h4>
                        <p className="text-[10px] text-ink-muted">{t.purpose.slice(0, 45)}...</p>
                      </div>
                    </div>
                    <span className="text-xs text-primary-600 font-bold">Link ↗</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
