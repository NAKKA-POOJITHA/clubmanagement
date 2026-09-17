'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/lib/authContext';
import { dataService } from '@/lib/dataService';
import AuthRequiredModal from '@/components/AuthRequiredModal';
import { Image as ImageIcon, Sparkles, Filter, Calendar, Users, ExternalLink, X, Plus, Upload, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';
import Link from 'next/link';

interface GalleryItem {
  id: string;
  title: string;
  club_name: string;
  event_name: string;
  date: string;
  image_url: string;
  category: string;
}

export default function GalleryPage() {
  const { currentRole, isAuthenticated } = useAuth();
  const [selectedClub, setSelectedClub] = useState('all');
  const [activeModalImg, setActiveModalImg] = useState<GalleryItem | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newClub, setNewClub] = useState('PRAGSOFT — Premier Technical Coding Club');
  const [newEvent, setNewEvent] = useState('');
  const [newCategory, setNewCategory] = useState('Hackathon');
  const [newUrl, setNewUrl] = useState('');

  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([
    {
      id: 'g-quantathon-poster',
      title: 'QUANTATHON 2K26: Ideas in Superposition — Official Poster',
      club_name: 'Computer Science Executive Council (CSEC)',
      event_name: 'QUANTATHON 2K26 (Sept 15, 2026)',
      date: '2026-09-15',
      image_url: '/images/events/quantathon_2k26_poster.jpg',
      category: 'Quantum Tech'
    },
    {
      id: 'g-ideathon-panel',
      title: 'Idea Presentation Before Faculty Evaluation Panel (Dr. A. Avinash & Jury)',
      club_name: 'Computer Science Executive Council (CSEC)',
      event_name: 'Sustainable Ideathon & QUANTATHON Pitch',
      date: '2026-09-16',
      image_url: '/images/events/csec_ideathon_evaluation_panel.png',
      category: 'Evaluation'
    },
    {
      id: 'g-ideathon-stage',
      title: 'Student Team Pitching Sustainable Engineering Ideas on Stage',
      club_name: 'Computer Science Executive Council (CSEC)',
      event_name: 'Engineers Day Ideathon Showcase',
      date: '2026-09-16',
      image_url: '/images/events/csec_ideathon_presentation.jpg',
      category: 'Presentation'
    },
    {
      id: 'g-ideathon-audience',
      title: 'Main Block Classroom Session & Interactive Audience Q&A',
      club_name: 'Computer Science Executive Council (CSEC)',
      event_name: 'Ideathon & Technical Conclave',
      date: '2026-09-16',
      image_url: '/images/events/csec_ideathon_classroom_audience.png',
      category: 'Live Session'
    },
    {
      id: 'g-ideathon-group',
      title: 'CSEC Council Officers & Ideathon Participants Grand Group Photo',
      club_name: 'Computer Science Executive Council (CSEC)',
      event_name: 'Valedictory & Merit Felicitation',
      date: '2026-09-16',
      image_url: '/images/events/csec_ideathon_group_participants.png',
      category: 'Felicitation'
    },
    {
      id: 'g-pragsoft-hack',
      title: 'PRAGSOFT 24-Hour Hackathon Midnight Coding Sprint',
      club_name: 'PRAGSOFT — Premier Technical Coding Club',
      event_name: 'CodeSprint 2026',
      date: '2026-08-24',
      image_url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80',
      category: 'Hackathon'
    },
    {
      id: 'g-arvr-meta',
      title: 'AR/VR Meta Quest 3 Spatial Computing Workshop',
      club_name: 'AR/VR & Metaverse Club',
      event_name: 'Spatial Computing Lab',
      date: '2026-08-15',
      image_url: 'https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?w=800&auto=format&fit=crop&q=80',
      category: 'Metaverse'
    },
    {
      id: 'g-rotaract-drive',
      title: 'Rotaract Youth Leadership & Blood Donation Camp',
      club_name: 'Rotaract Club of Pragati Surampalem Central (Non-Technical)',
      event_name: 'Pragati Seva Drive',
      date: '2026-08-05',
      image_url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80',
      category: 'Social Impact'
    }
  ]);

  const clubs = [
    'all',
    'Computer Science Executive Council (CSEC)',
    'PRAGSOFT — Premier Technical Coding Club',
    'AR/VR & Metaverse Club',
    'Rotaract Club of Pragati Surampalem Central (Non-Technical)'
  ];

  const filtered = galleryItems.filter(item =>
    selectedClub === 'all' || item.club_name === selectedClub
  );

  const handleUploadClick = () => {
    // Strictly verify role and authentication
    const isAuthorized = isAuthenticated && (currentRole === 'club_admin' || currentRole === 'super_admin');
    if (!isAuthorized) {
      setShowAuthModal(true);
      return;
    }
    setShowUploadModal(true);
  };

  const handleSaveUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || (currentRole !== 'club_admin' && currentRole !== 'super_admin')) {
      alert('Unauthorized: Only verified Club Admins can upload media.');
      return;
    }

    const newItem: GalleryItem = {
      id: 'g-' + Date.now(),
      title: newTitle || 'Event Snapshot',
      club_name: newClub,
      event_name: newEvent || 'Club Session',
      date: new Date().toISOString().split('T')[0],
      image_url: newUrl || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
      category: newCategory
    };

    setGalleryItems([newItem, ...galleryItems]);
    dataService.logAction('Uploaded Club Media', `${newItem.title} for ${newItem.club_name}`, currentRole);
    setShowUploadModal(false);
    setNewTitle('');
    setNewUrl('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-muted">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tag-pink text-pink-800 text-xs font-bold shadow-sm">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Visual Archive & Memory</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0A2540]">Club Activities & Event Gallery</h1>
            <p className="text-xs sm:text-sm text-ink-muted">
              Photographs, hackathon sprints, VR simulations, and ceremonies across all 4 Pragati University clubs.
            </p>
          </div>

          <button
            onClick={handleUploadClick}
            className="px-5 py-2.5 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm self-start sm:self-auto hover:scale-105 transition-all"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Club Media</span>
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {clubs.map((club) => (
            <button
              key={club}
              onClick={() => setSelectedClub(club)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                selectedClub === club
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-surface border border-surface-border text-ink-muted hover:text-ink'
              }`}
            >
              {club === 'all' ? 'All 4 Clubs' : club.split(' ')[0] + ' ' + (club.split(' ')[1] || '')}
            </button>
          ))}
        </div>

        {/* Gallery Masonry / Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveModalImg(item)}
              className="coursue-card-interactive overflow-hidden cursor-pointer group flex flex-col justify-between"
            >
              <div className="relative h-56 w-full overflow-hidden bg-surface-subtle">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 bg-ink/70 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-xl">
                  {item.category}
                </div>
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 text-white">
                  <p className="text-[10px] text-primary-200 font-bold">{item.club_name}</p>
                  <h3 className="text-sm font-bold leading-tight line-clamp-1">{item.title}</h3>
                </div>
              </div>

              <div className="p-3 bg-surface flex items-center justify-between text-[11px] text-ink-muted">
                <span>📍 {item.event_name}</span>
                <span>{item.date}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {activeModalImg && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-surface rounded-3xl overflow-hidden max-w-3xl w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
              <div className="relative h-96 w-full bg-black">
                <img
                  src={activeModalImg.image_url}
                  alt={activeModalImg.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setActiveModalImg(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-primary-700 bg-primary-50 px-3 py-1 rounded-full">
                    {activeModalImg.club_name}
                  </span>
                  <span className="text-xs text-ink-muted">{activeModalImg.date}</span>
                </div>
                <h2 className="text-xl font-bold text-ink">{activeModalImg.title}</h2>
                <p className="text-xs text-ink-muted">Captured during official session: {activeModalImg.event_name}</p>
              </div>
            </div>
          </div>
        )}

        {/* Upload Modal (Strictly Restricted to Authenticated Club Admin / Super Admin) */}
        {showUploadModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-surface rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Club Admin Verified</span>
                  </div>
                  <h3 className="text-base font-bold text-ink flex items-center gap-2">
                    <span>Upload Club Photograph</span>
                  </h3>
                </div>
                <button onClick={() => setShowUploadModal(false)} className="text-ink-muted hover:text-ink">✕</button>
              </div>

              <form onSubmit={handleSaveUpload} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-ink">Caption / Photo Title *</label>
                  <input
                    required
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. PRAGSOFT CodeSprint Finals"
                    className="w-full text-xs p-2.5 rounded-xl border border-surface-border bg-surface-muted focus:outline-none focus:border-primary-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-ink">Club *</label>
                  <select
                    value={newClub}
                    onChange={(e) => setNewClub(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-surface-border bg-surface-muted focus:outline-none focus:border-primary-600"
                  >
                    <option value="PRAGSOFT — Premier Technical Coding Club">PRAGSOFT — Technical Coding Club</option>
                    <option value="AR/VR & Metaverse Club">AR/VR & Metaverse Club</option>
                    <option value="Computer Science Executive Council (CSEC)">Computer Science Executive Council (CSEC)</option>
                    <option value="Rotaract Club of Pragati Surampalem Central (Non-Technical)">Rotaract Club of Pragati</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-ink">Image URL (or Supabase bucket URL) *</label>
                  <input
                    required
                    type="url"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full text-xs p-2.5 rounded-xl border border-surface-border bg-surface-muted focus:outline-none focus:border-primary-600 font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow-sm transition-all"
                >
                  Confirm & Publish to Gallery
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* Auth Guard Modal */}
      <AuthRequiredModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title="Club Admin Access Required"
        message="Only authorized Club Admins and Council Super Admins can upload event photographs and media to institutional club storage."
        requiredRole="Club Admin"
        redirectUrl="/login"
      />

      <Footer />
    </div>
  );
}
