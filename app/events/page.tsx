'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { dataService, useCentralDataSync } from '@/lib/dataService';
import { Search, Calendar, MapPin, Users, Sparkles, Heart, ArrowRight } from 'lucide-react';

export default function EventsDirectoryPage() {
  const dataVersion = useCentralDataSync();
  const allEvents = dataService.getEvents();
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  const eventTypes = ['all', 'Workshop', 'Hackathon', 'Competition', 'Bootcamp'];

  const filteredEvents = allEvents.filter(ev => {
    const matchesSearch = ev.title.toLowerCase().includes(search.toLowerCase()) ||
                          ev.club_name.toLowerCase().includes(search.toLowerCase()) ||
                          ev.venue.toLowerCase().includes(search.toLowerCase());
    const matchesType = selectedType === 'all' || ev.event_type.toLowerCase() === selectedType.toLowerCase();
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen flex flex-col bg-surface-muted">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-bold">
            <Calendar className="w-3.5 h-3.5" />
            <span>Official College Technical Calendar</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-ink">Workshops & Hackathons</h1>
          <p className="text-xs sm:text-sm text-ink-muted">
            Register for hands-on technical masterclasses, 24-hour hackathons, and security CTFs. Scan your digital ID to check in.
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
              placeholder="Search by title, club or venue..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-surface border border-surface-border rounded-2xl focus:outline-none focus:border-primary-600 shadow-sm"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            {eventTypes.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedType === t
                    ? 'bg-primary-600 text-white'
                    : 'bg-surface border border-surface-border text-ink-muted hover:text-ink'
                }`}
              >
                {t === 'all' ? 'All Types' : t}
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => {
            const seatsLeft = event.capacity - event.registered_count;
            return (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="coursue-card-interactive overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-44 w-full overflow-hidden bg-surface-subtle">
                    <img
                      src={event.poster_url}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${event.tag_color}`}>
                        {event.event_type.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <p className="text-[11px] font-bold text-primary-700">{event.club_name}</p>
                    <h3 className="text-sm sm:text-base font-bold text-ink group-hover:text-primary-600 transition-colors leading-snug line-clamp-2">
                      {event.title}
                    </h3>
                    <p className="text-xs text-ink-muted line-clamp-2 leading-relaxed">
                      {event.description}
                    </p>

                    <div className="space-y-1 text-xs text-ink-muted pt-2 border-t border-surface-border">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-primary-600" />
                        <span>{new Date(event.start_time).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-pink-600" />
                        <span className="truncate">{event.venue}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-3 border-t border-surface-border flex items-center justify-between text-xs">
                  <span className={`font-semibold ${seatsLeft > 0 ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {seatsLeft > 0 ? `${seatsLeft} Seats Available` : 'Waitlist Active'}
                  </span>
                  <span className="text-primary-600 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                    View Details →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
