'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { dataService } from '@/lib/dataService';
import { useAuth } from '@/lib/authContext';
import { Calendar, Plus, Layers, ArrowLeft, CheckCircle2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { triggerConfetti } from '@/lib/confetti';

export default function CreateEventPage() {
  const router = useRouter();
  const { userProfile } = useAuth();
  const clubs = dataService.getClubs();

  const [title, setTitle] = useState('');
  const [clubId, setClubId] = useState(clubs[0]?.id || '');
  const [eventType, setEventType] = useState<'Workshop' | 'Hackathon' | 'Competition' | 'Seminar'>('Workshop');
  const [venue, setVenue] = useState('Innovation Block A - Room 204');
  const [startTime, setStartTime] = useState(new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 16));
  const [capacity, setCapacity] = useState(75);
  const [description, setDescription] = useState('');
  const [speaker, setSpeaker] = useState('Dr. Alan Turing, AI Scientist');
  const [created, setCreated] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const club = clubs.find(c => c.id === clubId) || clubs[0];

    dataService.createEvent({
      club_id: club.id,
      club_name: club.name,
      title,
      description,
      event_type: eventType,
      venue,
      start_time: new Date(startTime).toISOString(),
      end_time: new Date(new Date(startTime).getTime() + 14400000).toISOString(),
      capacity,
      eligibility: 'All Engineering & Computer Science Students',
      registration_deadline: new Date(new Date(startTime).getTime() - 86400000).toISOString(),
      status: 'published',
      poster_url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
      tag_color: eventType === 'Hackathon' ? 'bg-tag-pink text-pink-700' : 'bg-tag-blue text-primary-700',
      speaker
    });

    triggerConfetti({
      particleCount: 100,
      spread: 70,
    });

    setCreated(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-muted">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <Link href="/dashboard/club-admin" className="inline-flex items-center gap-1.5 text-xs font-bold text-ink-muted hover:text-ink">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="coursue-card p-6 sm:p-8 space-y-6">
          {!created ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-ink">Create Technical Event & Generate Poster</h1>
                <p className="text-xs text-ink-muted mt-1">
                  Published events automatically open public registrations and create downloadable template circulars.
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-ink">Event Title *</label>
                <input
                  required
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Distributed Cloud & Kubernetes Workshop"
                  className="w-full text-xs p-3 rounded-xl border border-surface-border bg-surface-muted focus:outline-none focus:border-primary-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-ink">Host Club *</label>
                  <select
                    value={clubId}
                    onChange={(e) => setClubId(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-surface-border bg-surface-muted focus:outline-none focus:border-primary-600"
                  >
                    {clubs.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-ink">Event Type *</label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value as any)}
                    className="w-full text-xs p-3 rounded-xl border border-surface-border bg-surface-muted focus:outline-none focus:border-primary-600"
                  >
                    <option value="Workshop">Workshop</option>
                    <option value="Hackathon">Hackathon</option>
                    <option value="Competition">Competition / CTF</option>
                    <option value="Seminar">Seminar</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-ink">Date & Time *</label>
                  <input
                    required
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-surface-border bg-surface-muted focus:outline-none focus:border-primary-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-ink">Capacity (Seats Limit) *</label>
                  <input
                    required
                    type="number"
                    min="10"
                    max="500"
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="w-full text-xs p-3 rounded-xl border border-surface-border bg-surface-muted focus:outline-none focus:border-primary-600"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-ink">Location / Venue *</label>
                <input
                  required
                  type="text"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="e.g. Turing Advanced Computing Lab - Block C"
                  className="w-full text-xs p-3 rounded-xl border border-surface-border bg-surface-muted focus:outline-none focus:border-primary-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-ink">Speaker / Session Lead *</label>
                <input
                  required
                  type="text"
                  value={speaker}
                  onChange={(e) => setSpeaker(e.target.value)}
                  placeholder="e.g. Principal Cloud Architect"
                  className="w-full text-xs p-3 rounded-xl border border-surface-border bg-surface-muted focus:outline-none focus:border-primary-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-ink">Description & Session Objectives *</label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Outline key learning outcomes, prerequisites, and workstation requirements..."
                  className="w-full text-xs p-3 rounded-xl border border-surface-border bg-surface-muted focus:outline-none focus:border-primary-600"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow-glow hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Publish Event & Auto-Generate Poster</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center space-y-4 py-8">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-xl font-bold text-ink">Event Published Successfully!</h2>
              <p className="text-xs text-ink-muted max-w-md mx-auto leading-relaxed">
                Your event <strong className="text-ink">{title}</strong> is now live on the public calendar. Registrations are open, and automated posters have been prepared.
              </p>
              <div className="pt-4 flex items-center justify-center gap-3">
                <Link
                  href="/events"
                  className="px-6 py-2.5 rounded-2xl bg-primary-600 text-white text-xs font-bold shadow-sm"
                >
                  View Events Directory
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
