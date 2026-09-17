'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { dataService, useCentralDataSync } from '@/lib/dataService';
import { useAuth } from '@/lib/authContext';
import { Search, Trophy, ThumbsUp, Star, ExternalLink, Plus, Code2, Sparkles, Filter } from 'lucide-react';
import AuthRequiredModal from '@/components/AuthRequiredModal';
import { useRouter } from 'next/navigation';

export default function ProjectsShowcasePage() {
  const router = useRouter();
  const dataVersion = useCentralDataSync();
  const projects = dataService.getPublicShowcaseProjects();
  const [search, setSearch] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { currentRole, isAuthenticated } = useAuth();

  const domains = ['all', 'AI & Machine Learning', 'Competitive Programming', 'Software Engineering & Compilers', 'Spatial Computing & VR', 'Healthcare & Social Impact', 'Full-Stack'];

  const filtered = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
                          p.club_name.toLowerCase().includes(search.toLowerCase()) ||
                          p.submitted_by.toLowerCase().includes(search.toLowerCase()) ||
                          p.tech_stack.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchesDomain = selectedDomain === 'all' || p.domain.toLowerCase().includes(selectedDomain.toLowerCase());
    return matchesSearch && matchesDomain;
  });

  const handleUpvote = (id: string) => {
    dataService.upvoteProject(id);
  };

  const handleSubmitProjectClick = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    router.push('/projects/submit');
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-muted">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-surface-border pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tag-blue text-primary-700 text-xs font-bold">
              <Trophy className="w-3.5 h-3.5" />
              <span>Student Innovation Registry</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-ink">Project Showcase & Leaderboard</h1>
            <p className="text-xs sm:text-sm text-ink-muted">
              Peer-reviewed technical research, open-source repositories, and autonomous software prototypes.
            </p>
          </div>

          <button
            onClick={handleSubmitProjectClick}
            className="px-5 py-3 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold flex items-center gap-2 shadow-glow hover:scale-105 transition-all self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Submit New Project</span>
          </button>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, stack, or domain..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-surface border border-surface-border rounded-2xl focus:outline-none focus:border-primary-600 shadow-sm"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            {domains.map((dom) => (
              <button
                key={dom}
                onClick={() => setSelectedDomain(dom)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedDomain === dom
                    ? 'bg-primary-600 text-white'
                    : 'bg-surface border border-surface-border text-ink-muted hover:text-ink'
                }`}
              >
                {dom === 'all' ? 'All Domains' : dom}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((proj, rank) => (
            <div key={proj.id} className="coursue-card-interactive overflow-hidden flex flex-col justify-between group">
              <div>
                {/* Thumbnail */}
                <div className="relative h-44 w-full overflow-hidden bg-surface-subtle">
                  <img
                    src={proj.image}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-ink/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-xl flex items-center gap-1">
                    <span>Rank #{rank + 1}</span>
                  </div>
                  <div className="absolute top-3 right-3 bg-surface/90 backdrop-blur-md text-primary-700 text-xs font-extrabold px-2.5 py-1 rounded-xl shadow-sm flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{proj.rating || '9.0'}/10</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-tag-blue text-primary-700">
                        {proj.domain}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-900 text-white">
                        {proj.club_name.split('—')[0].trim()}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-ink leading-snug group-hover:text-primary-600 transition-colors">
                      {proj.title}
                    </h3>
                    <p className="text-[11px] font-semibold text-primary-600 mt-1">
                      By {proj.submitted_by}
                    </p>
                    <p className="text-xs text-ink-muted mt-1.5 leading-relaxed line-clamp-3">
                      {proj.description}
                    </p>
                  </div>

                  {/* Remarks by Faculty */}
                  {proj.remarks && (
                    <div className="p-2.5 bg-primary-50 rounded-xl border border-primary-100 text-[11px] text-primary-800 italic">
                      "{proj.remarks}"
                    </div>
                  )}

                  {/* Tech Stack Pills */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {proj.tech_stack.map((tech, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-surface-muted border border-surface-border text-ink-muted">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-5 pt-3 border-t border-surface-border flex items-center justify-between text-xs">
                <button
                  onClick={() => handleUpvote(proj.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-subtle hover:bg-primary-50 hover:text-primary-700 text-ink font-semibold transition-colors"
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-primary-600" />
                  <span>{proj.upvotes}</span>
                </button>

                <div className="flex items-center gap-3">
                  <a
                    href={proj.github_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-ink hover:text-primary-600 flex items-center gap-1"
                  >
                    GitHub <ExternalLink className="w-3 h-3" />
                  </a>
                  {proj.demo_url && (
                    <a
                      href={proj.demo_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-bold text-primary-600 hover:underline flex items-center gap-1"
                    >
                      Demo <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <AuthRequiredModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title="Student Login Required to Submit Project"
        message="Please login or create an account with your Pragati College ID to submit your engineering project to the institutional showcase for faculty review and leaderboard scoring."
        redirectUrl="/projects/submit"
      />

      <Footer />
    </div>
  );
}
