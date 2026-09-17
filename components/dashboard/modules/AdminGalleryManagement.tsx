'use client';

import React, { useState } from 'react';
import { dataService } from '@/lib/dataService';
import { GalleryItem } from '@/lib/demoData';
import { useAuth } from '@/lib/authContext';
import {
  Image as ImageIcon,
  PlusCircle,
  Search,
  Filter,
  Trash2,
  Calendar,
  Sparkles,
  X,
  Upload,
  Camera,
  FolderOpen,
  Check,
  Globe
} from 'lucide-react';

const CAMPUS_GALLERY_PRESETS = [
  {
    title: 'CodeSprint 2026 Live Hackathon & Coding Contest',
    club: 'PRAGSOFT',
    event: 'CodeSprint 2026',
    url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80',
    tag: 'Hackathon'
  },
  {
    title: 'Faculty Evaluation & Project Presentation Stage',
    club: 'CSEC Technical Club',
    event: 'Sustainable Ideathon 2026',
    url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80',
    tag: 'Presentation'
  },
  {
    title: 'Hands-on Algorithmic Workshop in Computer Center',
    club: 'PATHUB Innovation Center',
    event: 'Competitive Coding Masterclass',
    url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    tag: 'Lab Session'
  },
  {
    title: 'QUANTATHON 2K26 Quantum Computing Showcase',
    club: 'PRAGSOFT',
    event: 'QUANTATHON 2K26',
    url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80',
    tag: 'Quantum AI'
  },
  {
    title: 'Annual Tech Fest Valedictory & Award Ceremony',
    club: 'CSEC Technical Club',
    event: 'Tech Fest 2026',
    url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80',
    tag: 'Valedictory'
  },
  {
    title: 'IoT & Robotics Hardware Prototyping Workshop',
    club: 'PATHUB Innovation Center',
    event: 'IoT Embedded Expo',
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
    tag: 'Hardware'
  }
];

export default function AdminGalleryManagement() {
  const { userProfile } = useAuth();
  const isStudent = userProfile?.role === 'student';
  const [gallery, setGallery] = useState<GalleryItem[]>(() => dataService.getGallery());
  const [search, setSearch] = useState('');
  const [filterClub, setFilterClub] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);

  // New photo form
  const [uploadMode, setUploadMode] = useState<'device' | 'presets' | 'url'>('device');
  const [newTitle, setNewTitle] = useState('');
  const [newClub, setNewClub] = useState('PRAGSOFT');
  const [newEvent, setNewEvent] = useState('CodeSprint 2026');
  const [newDate, setNewDate] = useState('September 2026');
  const [newUrl, setNewUrl] = useState('');
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const clubs = dataService.getClubs();

  const handleFileSelect = (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, JPEG, WEBP, etc.).');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      alert('Image file size is larger than 8MB. Please select a smaller photo.');
      return;
    }

    setFileName(file.name);
    if (!newTitle) {
      const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      setNewTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const resultStr = event.target?.result as string;
      setFilePreview(resultStr);
      setNewUrl(resultStr);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (preset: typeof CAMPUS_GALLERY_PRESETS[0]) => {
    setNewUrl(preset.url);
    setFilePreview(preset.url);
    setNewTitle(preset.title);
    setNewEvent(preset.event);
    setNewClub(preset.club);
    setFileName(preset.tag);
  };

  const handleUploadPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl) {
      alert('Please select or enter an image and photo title.');
      return;
    }

    const newItem = dataService.addGalleryItem({
      title: newTitle,
      club_name: newClub,
      event_name: newEvent,
      image_url: newUrl,
      date: newDate || new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    });

    setGallery(dataService.getGallery());
    dataService.logAction('Uploaded Photo to Event Gallery', newTitle, userProfile?.role || 'super_admin');
    setShowUploadModal(false);
    setNewTitle('');
    setNewUrl('');
    setFilePreview(null);
    setFileName('');
    alert(`Photo "${newTitle}" added to official event gallery!`);
  };

  const handleDeletePhoto = (id: string, title: string) => {
    if (confirm(`Delete photo "${title}"?`)) {
      dataService.deleteGalleryItem(id);
      setGallery(dataService.getGallery());
      dataService.logAction('Deleted Event Photo', title, userProfile?.role || 'super_admin');
    }
  };

  const filtered = (gallery || []).filter(g => {
    const q = (search || '').toLowerCase().trim();
    const matchesSearch = !q || (g?.title || '').toLowerCase().includes(q) || (g?.event_name || '').toLowerCase().includes(q);
    const matchesClub = filterClub === 'all' || g?.club_name === filterClub;
    return matchesSearch && matchesClub;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="coursue-card p-6 bg-gradient-to-r from-primary-900 via-[#0A2540] to-primary-800 text-white relative overflow-hidden rounded-3xl shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-primary-200 text-[11px] font-bold tracking-wide uppercase">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>{isStudent ? 'Campus Event Photo Gallery' : 'Campus Media & Visual Archive'}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              {isStudent ? 'Event Highlights & Campus Media Gallery' : 'Event Photo Gallery & Media Administration'}
            </h1>
            <p className="text-xs text-primary-100/90 max-w-2xl leading-relaxed">
              {isStudent
                ? 'Explore captured memories, hackathon project presentations, and club workshop photos across campus.'
                : 'Curate high-resolution event media, organize albums across all university technical clubs, and publish photo highlights of hackathons and workshops.'}
            </p>
          </div>

          {!isStudent && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="self-start md:self-center px-4 py-2.5 rounded-xl bg-white text-primary-900 hover:bg-primary-50 text-xs font-bold flex items-center gap-2 shadow-float transition-all hover:scale-105 shrink-0 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-primary-700" />
              <span>Upload New Photo</span>
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
            placeholder="Search gallery by caption or event name..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-surface border border-surface-border rounded-xl focus:outline-none focus:border-primary-600 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterClub}
            onChange={(e) => setFilterClub(e.target.value)}
            className="text-xs p-2 rounded-xl border border-surface-border bg-surface text-ink font-semibold focus:outline-none cursor-pointer"
          >
            <option value="all">All Clubs</option>
            {clubs.map((c) => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>

          <span className="text-xs font-bold text-primary-700 bg-primary-50 px-3 py-2 rounded-xl border border-primary-100 whitespace-nowrap">
            {filtered.length} Photos
          </span>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div key={item.id} className="coursue-card overflow-hidden group hover:shadow-md transition-all flex flex-col justify-between border border-surface-border">
            <div className="relative aspect-video overflow-hidden bg-slate-100">
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-xs text-white">
                {item.club_name}
              </span>
              {!isStudent && (
                <button
                  onClick={() => handleDeletePhoto(item.id, item.title)}
                  className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/70 backdrop-blur-xs text-red-400 hover:text-red-300 hover:bg-black/90 transition-colors cursor-pointer"
                  title="Delete Photo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="p-4 space-y-1">
              <h3 className="text-xs font-bold text-ink line-clamp-1">{item.title}</h3>
              <p className="text-[11px] text-primary-700 font-semibold">{item.event_name}</p>
              <div className="flex items-center gap-1 text-[10px] text-ink-muted pt-1">
                <Calendar className="w-3 h-3" />
                <span>{item.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Upload Photo */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-lg w-full bg-surface rounded-3xl p-6 border border-surface-border shadow-float space-y-4 my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-primary-100 text-primary-800 flex items-center justify-center">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-ink">Upload Campus Event Photo</h3>
                  <p className="text-[11px] text-ink-muted">Add photos from device gallery, campus photo presets, or web links.</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setFilePreview(null);
                  setFileName('');
                }}
                className="p-1.5 text-ink-muted hover:text-ink rounded-lg hover:bg-surface-muted transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Source Switcher Tabs */}
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-surface-muted rounded-2xl border border-surface-border text-xs font-semibold">
              <button
                type="button"
                onClick={() => setUploadMode('device')}
                className={`py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  uploadMode === 'device'
                    ? 'bg-surface text-ink font-bold shadow-xs border border-surface-border'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                <Upload className="w-3.5 h-3.5 text-primary-600" />
                <span>Device Gallery</span>
              </button>
              <button
                type="button"
                onClick={() => setUploadMode('presets')}
                className={`py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  uploadMode === 'presets'
                    ? 'bg-surface text-ink font-bold shadow-xs border border-surface-border'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                <Camera className="w-3.5 h-3.5 text-emerald-600" />
                <span>Campus Presets</span>
              </button>
              <button
                type="button"
                onClick={() => setUploadMode('url')}
                className={`py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  uploadMode === 'url'
                    ? 'bg-surface text-ink font-bold shadow-xs border border-surface-border'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                <span>Web URL</span>
              </button>
            </div>

            <form onSubmit={handleUploadPhoto} className="space-y-3.5 text-xs">
              {/* MODE 1: DEVICE GALLERY UPLOAD */}
              {uploadMode === 'device' && (
                <div className="space-y-2">
                  <label className="block font-bold text-ink">Choose Photo from Device / Gallery *</label>

                  <input
                    type="file"
                    id="admin-photo-file-input"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileSelect(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                  />

                  {filePreview ? (
                    <div className="relative rounded-2xl border-2 border-primary-500 overflow-hidden bg-slate-900 group">
                      <img
                        src={filePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-2">
                        <button
                          type="button"
                          onClick={() => document.getElementById('admin-photo-file-input')?.click()}
                          className="px-3 py-1.5 rounded-xl bg-white text-ink font-bold text-[11px] flex items-center gap-1 shadow-md cursor-pointer hover:bg-slate-100"
                        >
                          <Upload className="w-3.5 h-3.5 text-primary-600" />
                          <span>Change Photo</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setFilePreview(null);
                            setNewUrl('');
                            setFileName('');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-red-600 text-white font-bold text-[11px] flex items-center gap-1 shadow-md cursor-pointer hover:bg-red-700"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                      <div className="absolute bottom-2 left-2 right-2 bg-black/70 backdrop-blur-xs text-white text-[10px] px-2.5 py-1 rounded-lg flex items-center justify-between">
                        <span className="truncate max-w-[240px]">{fileName || 'Selected from Gallery'}</span>
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <Check className="w-3 h-3" /> Ready
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                          handleFileSelect(e.dataTransfer.files[0]);
                        }
                      }}
                      onClick={() => document.getElementById('admin-photo-file-input')?.click()}
                      className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                        isDragging
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-surface-border bg-surface hover:bg-surface-muted/60 hover:border-primary-400'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-2xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-600">
                        <FolderOpen className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-ink text-xs">
                          Click to select from your Gallery or drag photo here
                        </p>
                        <p className="text-[11px] text-ink-muted mt-0.5">
                          Supports PNG, JPG, JPEG, WEBP from your phone or computer
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-[#0A2540] text-white text-[10px] font-bold mt-1">
                        Browse Gallery / Storage
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* MODE 2: CAMPUS PRESETS */}
              {uploadMode === 'presets' && (
                <div className="space-y-2">
                  <label className="block font-bold text-ink">Choose from Campus Event Photo Library</label>
                  <div className="grid grid-cols-3 gap-2 max-h-52 overflow-y-auto pr-1">
                    {CAMPUS_GALLERY_PRESETS.map((preset, idx) => {
                      const isSelected = newUrl === preset.url;
                      return (
                        <div
                          key={idx}
                          onClick={() => handleSelectPreset(preset)}
                          className={`relative aspect-video rounded-xl overflow-hidden cursor-pointer group border-2 transition-all ${
                            isSelected ? 'border-primary-600 ring-2 ring-primary-500/30' : 'border-surface-border hover:border-primary-400'
                          }`}
                        >
                          <img
                            src={preset.url}
                            alt={preset.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <span className="absolute bottom-1 left-1 text-[9px] font-bold bg-black/70 text-white px-1.5 py-0.5 rounded">
                            {preset.tag}
                          </span>
                          {isSelected && (
                            <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary-600 text-white flex items-center justify-center">
                              <Check className="w-2.5 h-2.5" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* MODE 3: URL INPUT */}
              {uploadMode === 'url' && (
                <div className="space-y-2">
                  <label className="block font-bold text-ink">Image Web URL *</label>
                  <input
                    type="url"
                    value={newUrl}
                    onChange={(e) => {
                      setNewUrl(e.target.value);
                      setFilePreview(e.target.value);
                    }}
                    placeholder="e.g. https://images.unsplash.com/photo-..."
                    className="w-full p-2.5 bg-surface border border-surface-border rounded-xl font-mono focus:border-primary-600 focus:outline-none"
                  />
                  {newUrl && (
                    <div className="rounded-xl overflow-hidden border border-surface-border aspect-video max-h-36 bg-slate-100">
                      <img
                        src={newUrl}
                        alt="Preview"
                        onError={(e) => {
                          (e.target as any).src = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80';
                        }}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Form Metadata Fields */}
              <div className="space-y-2.5 pt-1">
                <div>
                  <label className="block font-bold text-ink mb-1">Caption / Title *</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Grand Finale Hackathon Ideation Round"
                    className="w-full p-2.5 bg-surface border border-surface-border rounded-xl focus:border-primary-600 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-ink mb-1">Associated Club</label>
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
                    <label className="block font-bold text-ink mb-1">Event Name</label>
                    <input
                      type="text"
                      value={newEvent}
                      onChange={(e) => setNewEvent(e.target.value)}
                      placeholder="e.g. CodeSprint 2026"
                      className="w-full p-2.5 bg-surface border border-surface-border rounded-xl focus:border-primary-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-surface-border flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadModal(false);
                    setFilePreview(null);
                    setFileName('');
                  }}
                  className="px-3.5 py-2 text-ink-muted hover:text-ink font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newUrl}
                  className="px-5 py-2 bg-[#0A2540] hover:bg-[#1E3A8A] disabled:opacity-50 text-white rounded-xl font-bold cursor-pointer transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Save Photo</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

