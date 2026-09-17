'use client';

import React, { useState } from 'react';
import { dataService } from '@/lib/dataService';
import { useAuth } from '@/lib/authContext';
import {
  BookOpen,
  PlusCircle,
  CheckCircle2,
  Users,
  Clock,
  Award,
  Layers,
  Sparkles,
  BarChart2,
  ChevronRight,
  Search,
  X
} from 'lucide-react';

export interface RoadmapTrack {
  id: string;
  title: string;
  club_name: string;
  description: string;
  estimated_hours: string;
  level: string;
  modules: {
    id: string;
    title: string;
    duration: string;
    completed: boolean;
    resources: string[];
  }[];
}

function normalizeRoadmaps(items: any[]): RoadmapTrack[] {
  return (items || []).map((item, idx) => ({
    id: item.id || `track-${idx}`,
    title: item.title || item.technology || 'Core Technical Track',
    club_name: item.club_name || item.domain || 'CSEC Technical Council',
    description: item.description || 'Structured multi-stage hands-on curriculum track with verifiable milestones.',
    estimated_hours: item.estimated_hours || (item.stages ? `${item.stages.length * 15} Hours` : '40 Hours'),
    level: item.level || 'Intermediate',
    modules: item.modules || (item.stages || []).map((s: any, sIdx: number) => ({
      id: `mod-${item.id || idx}-${sIdx}`,
      title: s.title || `${s.stage || 'Stage'} Module`,
      duration: s.duration || '6 Weeks',
      completed: false,
      resources: (s.resources || []).map((r: any) => typeof r === 'string' ? r : (r?.title || 'Guide'))
    }))
  }));
}

export default function AdminRoadmapsManagement() {
  const { userProfile } = useAuth();
  const isStudent = userProfile?.role === 'student';
  const [tracks, setTracks] = useState<RoadmapTrack[]>(() => normalizeRoadmaps(dataService.getRoadmaps()));
  const [search, setSearch] = useState('');
  const [selectedTrack, setSelectedTrack] = useState<RoadmapTrack | null>(() => {
    const initial = normalizeRoadmaps(dataService.getRoadmaps());
    return initial[0] || null;
  });
  const [showAddModal, setShowAddModal] = useState(false);

  // New track form
  const [newTitle, setNewTitle] = useState('');
  const [newClub, setNewClub] = useState('CSEC Technical Club');
  const [newEstHours, setNewEstHours] = useState('40 hours');
  const [newLevel, setNewLevel] = useState('Intermediate');
  const [newDesc, setNewDesc] = useState('');

  const clubs = dataService.getClubs();

  const handleCreateTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTrk: RoadmapTrack = {
      id: `track-${Date.now()}`,
      title: newTitle,
      club_name: newClub,
      description: newDesc || 'Comprehensive hands-on technical curriculum track.',
      estimated_hours: newEstHours,
      level: newLevel,
      modules: [
        {
          id: `mod-${Date.now()}-1`,
          title: 'Foundations & Core Prerequisites',
          duration: '8 Hours',
          completed: false,
          resources: ['Documentation', 'Setup Guide', 'First Exercise']
        },
        {
          id: `mod-${Date.now()}-2`,
          title: 'Advanced Architecture & Capstone Prototype',
          duration: '12 Hours',
          completed: false,
          resources: ['Industry Reference', 'Code Repository', 'Final Exam']
        }
      ]
    };

    setTracks(prev => [newTrk, ...prev]);
    dataService.logAction('Created LMS Roadmap Track', newTitle, userProfile?.role || 'super_admin');
    setShowAddModal(false);
    setNewTitle('');
    alert(`Roadmap "${newTitle}" created successfully!`);
  };

  const filtered = (tracks || []).filter(t =>
    (t?.title || '').toLowerCase().includes(search.toLowerCase().trim()) ||
    (t?.club_name || '').toLowerCase().includes(search.toLowerCase().trim()) ||
    (t?.description || '').toLowerCase().includes(search.toLowerCase().trim())
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="coursue-card p-6 bg-gradient-to-r from-primary-900 via-[#0A2540] to-primary-800 text-white relative overflow-hidden rounded-3xl shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-primary-200 text-[11px] font-bold tracking-wide uppercase">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{isStudent ? 'LMS Learning Tracks & Syllabi' : 'Curriculum & LMS Governance'}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              {isStudent ? 'Interactive Learning Roadmaps & Skill Pathways' : 'LMS Learning Roadmaps & Skill Tracks Administration'}
            </h1>
            <p className="text-xs text-primary-100/90 max-w-2xl leading-relaxed">
              {isStudent
                ? 'Master structured multi-stage technical syllabi curated by university clubs, follow milestone modules, and build capstone projects.'
                : 'Design multi-stage learning roadmaps, manage hands-on syllabus modules, review student progress analytics, and issue milestone badges.'}
            </p>
          </div>

          {!isStudent && (
            <button
              onClick={() => setShowAddModal(true)}
              className="self-start md:self-center px-4 py-2.5 rounded-xl bg-white text-primary-900 hover:bg-primary-50 text-xs font-bold flex items-center gap-2 shadow-float transition-all hover:scale-105 shrink-0 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-primary-700" />
              <span>Create New Learning Track</span>
            </button>
          )}
        </div>
      </div>

      {/* Control Bar */}
      <div className="coursue-card p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search learning roadmaps by track name or club..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-surface border border-surface-border rounded-xl focus:outline-none focus:border-primary-600 shadow-sm"
          />
        </div>

        <span className="text-xs font-bold text-primary-700 bg-primary-50 px-3 py-2 rounded-xl border border-primary-100 whitespace-nowrap">
          {filtered.length} Active Tracks
        </span>
      </div>

      {/* Tracks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((track) => (
          <div
            key={track.id}
            onClick={() => setSelectedTrack(track)}
            className={`coursue-card p-5 space-y-3 cursor-pointer transition-all hover:shadow-md border-2 ${
              selectedTrack?.id === track.id ? 'border-primary-500 bg-primary-50/20' : 'border-transparent'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-primary-50 text-primary-700">
                  {track.club_name}
                </span>
                <h3 className="text-sm font-bold text-ink mt-1.5">{track.title}</h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-tag-blue text-primary-700 whitespace-nowrap">
                {track.level}
              </span>
            </div>

            <p className="text-xs text-ink-muted line-clamp-2 leading-relaxed">
              {track.description}
            </p>

            <div className="pt-2 border-t border-surface-border flex items-center justify-between text-xs text-ink-muted">
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-primary-600" />
                <span className="font-semibold text-ink">{track.estimated_hours}</span>
              </div>
              <div className="flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-primary-600" />
                <span className="font-semibold text-ink">{track.modules.length} Modules</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Track Detail Inspector */}
      {selectedTrack && (
        <div className="coursue-card p-6 space-y-4">
          <div className="flex items-start justify-between pb-3 border-b border-surface-border">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-ink">{selectedTrack.title}</h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Active Syllabus
                </span>
              </div>
              <p className="text-xs text-ink-muted mt-0.5">{selectedTrack.club_name} • {selectedTrack.estimated_hours} Total Curriculum Duration</p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-ink uppercase tracking-wider">Curriculum Modules & Milestones</h4>
            <div className="divide-y divide-surface-border">
              {selectedTrack.modules.map((mod, idx) => (
                <div key={mod.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center text-[11px]">
                      {idx + 1}
                    </div>
                    <div>
                      <h5 className="font-bold text-ink">{mod.title}</h5>
                      <div className="flex items-center gap-2 text-[10px] text-ink-muted mt-0.5">
                        <span>Duration: {mod.duration}</span>
                        <span>•</span>
                        <span>{mod.resources.length} Learning Resources Attached</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                    Accredited
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create Track */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-lg w-full bg-surface rounded-3xl p-6 border border-surface-border shadow-float space-y-4 my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <h3 className="text-sm font-bold text-ink">Create New Roadmap Track</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 rounded text-ink-muted">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTrack} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-ink mb-1">Track Name *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Cloud-Native Kubernetes & Microservices"
                  className="w-full p-2.5 bg-surface border border-surface-border rounded-xl focus:border-primary-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-ink mb-1">Managing Club</label>
                  <select
                    value={newClub}
                    onChange={(e) => setNewClub(e.target.value)}
                    className="w-full p-2.5 bg-surface border border-surface-border rounded-xl focus:border-primary-600 focus:outline-none"
                  >
                    {clubs.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-ink mb-1">Target Level</label>
                  <select
                    value={newLevel}
                    onChange={(e) => setNewLevel(e.target.value)}
                    className="w-full p-2.5 bg-surface border border-surface-border rounded-xl focus:border-primary-600 focus:outline-none"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">Estimated Hours</label>
                <input
                  type="text"
                  value={newEstHours}
                  onChange={(e) => setNewEstHours(e.target.value)}
                  className="w-full p-2.5 bg-surface border border-surface-border rounded-xl focus:border-primary-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full p-2.5 bg-surface border border-surface-border rounded-xl focus:border-primary-600 focus:outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-3 py-1.5 text-ink-muted">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-xl font-bold">
                  Publish Track
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
