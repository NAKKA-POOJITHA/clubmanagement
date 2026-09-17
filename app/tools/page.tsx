'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { dataService } from '@/lib/dataService';
import { Search, Wrench, ExternalLink, ShieldCheck, Download, Code2, Sparkles } from 'lucide-react';

export default function ToolsDirectoryPage() {
  const tools = dataService.getTools();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'IDE & Code Editors', 'API Development', 'DevOps & Containers', 'Product Design', 'Cybersecurity & Networks', 'Backend & Database'];

  const filtered = tools.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
                          t.purpose.toLowerCase().includes(search.toLowerCase()) ||
                          t.category.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'all' || t.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen flex flex-col bg-surface-muted">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tag-blue text-primary-700 text-xs font-bold">
            <Wrench className="w-3.5 h-3.5" />
            <span>Curated Software Catalog</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-ink">Software & Development Tools</h1>
          <p className="text-xs sm:text-sm text-ink-muted">
            Institutional development environments, security protocol analyzers, and cloud toolkits sanctioned for engineering curriculum and club projects.
          </p>
        </div>

        {/* Search & Categories */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tools by name or platform..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-surface border border-surface-border rounded-2xl focus:outline-none focus:border-primary-600 shadow-sm"
            />
          </div>

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

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((tool) => (
            <div key={tool.id} className="coursue-card-interactive p-6 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-primary-50 text-2xl flex items-center justify-center border border-primary-100 group-hover:scale-110 transition-transform">
                    {tool.icon}
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-tag-teal text-emerald-800">
                    {tool.license}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-primary-600 uppercase tracking-wider">{tool.category}</span>
                  <h3 className="text-base font-bold text-ink group-hover:text-primary-600 transition-colors mt-0.5">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-ink-muted mt-2 leading-relaxed">
                    {tool.purpose}
                  </p>
                </div>

                <div className="space-y-1 text-[11px] text-ink-muted pt-2 border-t border-surface-border">
                  <p><strong className="text-ink">Platform:</strong> {tool.platform}</p>
                  <p><strong className="text-ink">Recommended Stage:</strong> {tool.recommended_stage}</p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-surface-border">
                <a
                  href={tool.official_link}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 rounded-xl bg-primary-50 hover:bg-primary-600 text-primary-700 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                >
                  <span>Official Download Page</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
