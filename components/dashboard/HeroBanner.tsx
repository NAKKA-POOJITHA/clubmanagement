'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '@/lib/authContext';

interface HeroBannerProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  badgeText?: string;
}

export default function HeroBanner({
  title = 'Sharpen Your Skills with Technical Masterclasses & Hackathons',
  subtitle = 'Join high-impact workshops, verify attendance via QR, build innovative projects, and earn accredited certificates.',
  buttonText = 'Explore Events',
  buttonLink = '/events',
  badgeText = 'CENTRAL TECHNICAL ECOSYSTEM',
}: HeroBannerProps) {
  const { currentRole } = useAuth();

  return (
    <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-r from-primary-600 via-primary-700 to-indigo-700 text-white p-6 sm:p-8 shadow-glow">
      {/* Decorative background sparkles */}
      <div className="absolute top-4 right-12 text-white/20 pointer-events-none animate-pulse">
        <Sparkles className="w-24 h-24 stroke-[1]" />
      </div>
      <div className="absolute -bottom-10 right-32 text-white/10 pointer-events-none">
        <Sparkles className="w-32 h-32 stroke-[0.8]" />
      </div>
      <div className="absolute top-8 right-1/3 text-white/15 pointer-events-none">
        <Sparkles className="w-12 h-12 stroke-[1.2]" />
      </div>

      <div className="relative z-10 max-w-xl space-y-4">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-[10px] font-bold tracking-wider uppercase text-white/90">
          <Sparkles className="w-3 h-3 fill-current" />
          <span>{badgeText}</span>
        </div>

        {/* Headline */}
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
          {title}
        </h1>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-white/80 leading-relaxed max-w-lg">
          {subtitle}
        </p>

        {/* Action Button matching screenshot */}
        <div className="pt-2 flex items-center gap-3">
          <Link
            href={buttonLink}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink-DEFAULT hover:bg-black text-white text-xs font-bold transition-all transform hover:scale-105 shadow-md group"
          >
            <span>{buttonText}</span>
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
              <ArrowRight className="w-3 h-3 text-white" />
            </div>
          </Link>

          {currentRole === 'student' && (
            <Link
              href="/student/card"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-xs font-bold transition-all"
            >
              View Membership ID
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
