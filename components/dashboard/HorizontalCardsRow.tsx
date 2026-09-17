'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Heart, ArrowRight } from 'lucide-react';
import { EventItem } from '@/lib/demoData';

interface HorizontalCardsRowProps {
  title?: string;
  events: EventItem[];
}

export default function HorizontalCardsRow({
  title = 'Upcoming Masterclasses & Hackathons',
  events,
}: HorizontalCardsRowProps) {
  const [bookmarked, setBookmarked] = useState<Record<string, boolean>>({});

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setBookmarked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="my-6">
      {/* Header with Title & Arrow controls matching reference image */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base sm:text-lg font-bold text-ink">{title}</h3>
        <div className="flex items-center gap-2">
          <button className="w-7 h-7 rounded-full bg-surface border border-surface-border flex items-center justify-center text-ink-muted hover:text-ink transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="w-7 h-7 rounded-full bg-primary-600 text-white flex items-center justify-center hover:bg-primary-700 transition-colors shadow-sm">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3 Horizontal Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {events.slice(0, 3).map((event) => (
          <Link
            key={event.id}
            href={`/events/${event.id}`}
            className="coursue-card-interactive overflow-hidden flex flex-col group"
          >
            {/* Thumbnail with category tag and heart */}
            <div className="relative h-40 w-full overflow-hidden bg-surface-subtle">
              <img
                src={event.poster_url}
                alt={event.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {/* Category pill */}
              <div className="absolute top-3 left-3">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${event.tag_color}`}>
                  {event.event_type.toUpperCase()}
                </span>
              </div>
              {/* Bookmark Button */}
              <button
                onClick={(e) => toggleBookmark(event.id, e)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/50 transition-colors"
              >
                <Heart
                  className={`w-4 h-4 ${bookmarked[event.id] ? 'text-red-500 fill-current' : 'text-white'}`}
                />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <h4 className="text-xs sm:text-sm font-bold text-ink leading-snug group-hover:text-primary-600 transition-colors line-clamp-2">
                {event.title}
              </h4>

              {/* Author / Mentor Info */}
              <div className="flex items-center justify-between pt-2 border-t border-surface-border">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center text-[10px] font-bold text-primary-700">
                    {event.speaker ? event.speaker.charAt(0) : 'M'}
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-ink leading-none truncate max-w-[120px]">
                      {event.speaker || event.club_name}
                    </p>
                    <p className="text-[9px] text-ink-muted">Organizer / Mentor</p>
                  </div>
                </div>

                <div className="text-[10px] font-semibold text-primary-700 bg-primary-50 px-2 py-0.5 rounded-full">
                  {event.capacity - event.registered_count} seats left
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
