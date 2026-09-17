'use client';

import React, { useState } from 'react';
import { dataService } from '@/lib/dataService';
import { useAuth } from '@/lib/authContext';
import {
  Wrench,
  PlusCircle,
  ExternalLink,
  Search,
  Filter,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  X
} from 'lucide-react';

export interface ToolResource {
  id: string;
  title: string;
  category: string;
  description: string;
  url: string;
  is_recommended: boolean;
  perk?: string;
}

function normalizeTools(items: any[]): ToolResource[] {
  return (items || []).map((t, idx) => ({
    id: t.id || `tool-${idx}`,
    title: t.title || t.name || 'Developer Utility',
    category: t.category || 'Development',
    description: t.description || t.purpose || 'Official software and development tool for campus projects.',
    url: t.url || t.official_link || 'https://developer.pragati.ac.in',
    is_recommended: t.is_recommended ?? true,
    perk: t.perk || t.license || 'Free Academic License'
  }));
}

export default function AdminToolsManagement() {
  const { userProfile } = useAuth();
  const isStudent = userProfile?.role === 'student';
  const [tools, setTools] = useState<ToolResource[]>(() => normalizeTools(dataService.getTools()));
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New tool form
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Cloud & DevOps');
  const [newDesc, setNewDesc] = useState('');
  const [newUrl, setNewUrl] = useState('https://developer.pragati.ac.in');
  const [newPerk, setNewPerk] = useState('100% Free Educational License');

  const handleAddTool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTool: ToolResource = {
      id: `tool-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      description: newDesc || 'Verified engineering tool provided to Pragati University students.',
      url: newUrl,
      is_recommended: true,
      perk: newPerk
    };

    setTools(prev => [newTool, ...prev]);
    dataService.logAction('Added Developer Tool to Directory', newTitle, userProfile?.role || 'super_admin');
    setShowAddModal(false);
    setNewTitle('');
    setNewDesc('');
    alert(`Tool "${newTitle}" added to official directory.`);
  };

  const handleDeleteTool = (id: string, name: string) => {
    if (confirm(`Remove tool "${name}" from directory?`)) {
      setTools(prev => prev.filter(t => t.id !== id));
      dataService.logAction('Removed Tool from Directory', name, userProfile?.role || 'super_admin');
    }
  };

  const filtered = (tools || []).filter(t => {
    const titleStr = t?.title || '';
    const descStr = t?.description || '';
    const query = (search || '').toLowerCase().trim();
    const matchesSearch = !query || titleStr.toLowerCase().includes(query) || descStr.toLowerCase().includes(query);
    const matchesCat = filterCategory === 'all' || t?.category === filterCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="coursue-card p-6 bg-gradient-to-r from-primary-900 via-[#0A2540] to-primary-800 text-white relative overflow-hidden rounded-3xl shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-primary-200 text-[11px] font-bold tracking-wide uppercase">
              <Wrench className="w-3.5 h-3.5" />
              <span>{isStudent ? 'Developer Tools & Academic Perks' : 'Developer Resources & Tooling Administration'}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              {isStudent ? 'Software Tooling & Student Developer Perks' : 'Tools Directory & Student Software Perks Registry'}
            </h1>
            <p className="text-xs text-primary-100/90 max-w-2xl leading-relaxed">
              {isStudent
                ? 'Access curated engineering tools, claim free university cloud credits, and get free developer software licenses.'
                : 'Curate developer tooling, manage free student cloud credits, and publish verified university tool kits for workshops and hackathons.'}
            </p>
          </div>

          {!isStudent && (
            <button
              onClick={() => setShowAddModal(true)}
              className="self-start md:self-center px-4 py-2.5 rounded-xl bg-white text-primary-900 hover:bg-primary-50 text-xs font-bold flex items-center gap-2 shadow-float transition-all hover:scale-105 shrink-0 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-primary-700" />
              <span>Add Tool to Directory</span>
            </button>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="coursue-card p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search software tools and developer perks..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-surface border border-surface-border rounded-xl focus:outline-none focus:border-primary-600 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="text-xs p-2 rounded-xl border border-surface-border bg-surface text-ink font-semibold focus:outline-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="Cloud & DevOps">Cloud & DevOps</option>
            <option value="AI & Data Science">AI & Data Science</option>
            <option value="Design & Prototyping">Design & Prototyping</option>
            <option value="Developer Productivity">Productivity</option>
          </select>

          <span className="text-xs font-bold text-primary-700 bg-primary-50 px-3 py-2 rounded-xl border border-primary-100 whitespace-nowrap">
            {filtered.length} Tools Listed
          </span>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((tool) => (
          <div key={tool.id} className="coursue-card p-5 space-y-3 flex flex-col justify-between hover:shadow-md transition-all">
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-tag-blue text-primary-700">
                  {tool.category}
                </span>
                {!isStudent && (
                  <button
                    onClick={() => handleDeleteTool(tool.id, tool.title)}
                    className="p-1 rounded text-ink-muted hover:text-red-600 cursor-pointer"
                    title="Delete Tool"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <h3 className="text-sm font-bold text-ink">{tool.title}</h3>
              <p className="text-xs text-ink-muted leading-relaxed line-clamp-3">
                {tool.description}
              </p>
            </div>

            <div className="pt-3 border-t border-surface-border space-y-2.5">
              {tool.perk && (
                <div className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                  🎁 {tool.perk}
                </div>
              )}
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 rounded-xl bg-surface-muted hover:bg-primary-50 text-ink hover:text-primary-700 text-xs font-bold flex items-center justify-center gap-1.5 border border-surface-border transition-colors"
              >
                <span>Direct Access</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Add Tool */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-md w-full bg-surface rounded-3xl p-6 border border-surface-border shadow-float space-y-4 my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <h3 className="text-sm font-bold text-ink">Add Verified Tool</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-ink-muted">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddTool} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-ink mb-1">Tool Name *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. GitHub Copilot Student Pack"
                  className="w-full p-2.5 bg-surface border border-surface-border rounded-xl focus:border-primary-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full p-2.5 bg-surface border border-surface-border rounded-xl focus:border-primary-600 focus:outline-none"
                >
                  <option value="Cloud & DevOps">Cloud & DevOps</option>
                  <option value="AI & Data Science">AI & Data Science</option>
                  <option value="Design & Prototyping">Design & Prototyping</option>
                  <option value="Developer Productivity">Developer Productivity</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">Access URL</label>
                <input
                  type="url"
                  required
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full p-2.5 bg-surface border border-surface-border rounded-xl focus:border-primary-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">Student Perk / Benefit</label>
                <input
                  type="text"
                  value={newPerk}
                  onChange={(e) => setNewPerk(e.target.value)}
                  placeholder="e.g. 100% Free Unlimited Access"
                  className="w-full p-2.5 bg-surface border border-surface-border rounded-xl focus:border-primary-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">Description</label>
                <textarea
                  rows={2}
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
                  Add Tool
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
