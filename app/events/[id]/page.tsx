'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/lib/authContext';
import { dataService, useCentralDataSync } from '@/lib/dataService';
import EventPosterModal from '@/components/dashboard/EventPosterModal';
import FeedbackModal from '@/components/dashboard/FeedbackModal';
import EventRegistrationModal from '@/components/EventRegistrationModal';
import {
  Calendar,
  MapPin,
  Users,
  Sparkles,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Award,
  Download,
  Share2,
  Layers,
  ArrowRight,
  Lock,
  QrCode
} from 'lucide-react';
import Link from 'next/link';
import AuthRequiredModal from '@/components/AuthRequiredModal';

function EventDetailContent() {
  const params = useParams();
  const eventId = (params?.id as string) || '';
  const dataVersion = useCentralDataSync();
  const event = dataService.getEventById(eventId) || dataService.getEvents().find(e => e.id === eventId || e.slug === eventId) || dataService.getEvents()[0];
  const { userProfile, currentRole, isAuthenticated } = useAuth();

  const [isRegistered, setIsRegistered] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showPosterModal, setShowPosterModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (event && userProfile) {
      setIsRegistered(
        dataService.isRegistered(event.id, userProfile.id) ||
        dataService.isRegistered(event.id, userProfile.email) ||
        (userProfile.membership_number ? dataService.isRegistered(event.id, userProfile.membership_number) : false)
      );
    }
  }, [event, userProfile, dataVersion]);

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col bg-surface-muted">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xs text-ink-muted">Event not found.</p>
        </div>
        <Footer />
      </div>
    );
  }

  const seatsLeft = event.capacity - event.registered_count;

  const handleRegister = () => {
    setShowRegisterModal(true);
  };

  const handleClaimCertificateClick = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    setShowFeedbackModal(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-muted">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Top Header Card */}
        <div className="coursue-card overflow-hidden">
          <div className="relative h-64 sm:h-80 w-full">
            <img
              src={event.poster_url}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute top-4 left-4">
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${event.tag_color}`}>
                {event.event_type.toUpperCase()}
              </span>
            </div>
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
              <p className="text-xs text-primary-200 font-bold uppercase">{event.club_name}</p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                {event.title}
              </h1>
            </div>
          </div>

          {/* Action Row */}
          <div className="p-6 bg-surface flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-surface-border">
            <div className="flex items-center gap-4 text-xs text-ink-muted">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-primary-600" />
                <span className="font-semibold text-ink">{new Date(event.start_time).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold text-ink">{seatsLeft} Seats Left</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Automated Poster View - Restricted to Club Admin / Super Admin */}
              {isAuthenticated && (currentRole === 'club_admin' || currentRole === 'super_admin') && (
                <button
                  onClick={() => setShowPosterModal(true)}
                  className="px-4 py-2.5 rounded-2xl border border-primary-200 bg-primary-50/60 text-primary-700 hover:bg-primary-100 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  title="Generate dynamic social media flyer (Club Admin only)"
                >
                  <Layers className="w-4 h-4 text-primary-600" />
                  <span>Auto Poster</span>
                </button>
              )}

              {/* Registration Action */}
              {!isRegistered ? (
                <button
                  onClick={handleRegister}
                  className="px-6 py-2.5 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow-glow hover:scale-105 transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Register for Event</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="px-4 py-2.5 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Registered (Pass Active)</span>
                  </div>
                  {/* Feedback Modal Trigger */}
                  <button
                    onClick={handleClaimCertificateClick}
                    className="px-4 py-2.5 rounded-2xl bg-tag-violet text-primary-700 hover:bg-primary-100 text-xs font-bold flex items-center gap-1.5"
                  >
                    <Award className="w-4 h-4 text-primary-600" />
                    <span>Claim Certificate</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left 2 Cols: Description & Schedule */}
          <div className="md:col-span-2 space-y-6">
            <div className="coursue-card p-6 space-y-4">
              <h2 className="text-base font-bold text-ink">Session Overview</h2>
              <p className="text-xs text-ink-muted leading-relaxed">
                {event.description}
              </p>
              <div className="p-4 bg-primary-50 rounded-2xl border border-primary-100 space-y-2">
                <h4 className="text-xs font-bold text-primary-800">What You Will Gain:</h4>
                <ul className="text-xs text-ink-muted space-y-1 list-disc pl-4">
                  <li>Hands-on practical implementation with mentor support.</li>
                  <li>Automated Verifiable Certificate upon check-in and feedback.</li>
                  <li>Contribution points added to your student leaderboard profile.</li>
                </ul>
              </div>
            </div>

            {/* Timeline Details */}
            <div className="coursue-card p-6 space-y-4">
              <h2 className="text-base font-bold text-ink">Date, Time & Venue</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-surface-muted rounded-xl border border-surface-border space-y-1">
                  <span className="text-ink-muted flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-primary-600" /> Timing</span>
                  <p className="font-bold text-ink">10:00 AM – 04:00 PM IST</p>
                </div>
                <div className="p-3 bg-surface-muted rounded-xl border border-surface-border space-y-1">
                  <span className="text-ink-muted flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-pink-600" /> Location</span>
                  <p className="font-bold text-ink">{event.venue}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Host Club & Sanction */}
          <div className="space-y-6">
            <div className="coursue-card p-6 space-y-4">
              <div className="flex items-center gap-2 text-primary-700 font-bold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>Host Technical Society</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-ink">{event.club_name}</h3>
                <p className="text-xs text-ink-muted mt-1">
                  Official event sanctioned under Pragati University Technical Councils & Dean of Student Affairs.
                </p>
              </div>
              <Link
                href="/clubs"
                className="w-full py-2 rounded-xl bg-surface-muted hover:bg-surface border border-surface-border text-xs font-bold text-ink flex items-center justify-center gap-1"
              >
                <span>View Club Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Check-in QR Prompt - ONLY ENABLED AFTER REGISTRATION */}
            <div className={`coursue-card p-6 text-center space-y-3 transition-all ${
              isRegistered
                ? 'bg-gradient-to-br from-emerald-50 via-white to-emerald-50/40 border-2 border-emerald-300 shadow-sm'
                : 'bg-surface border border-surface-border'
            }`}>
              {isRegistered ? (
                <>
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wide">
                      Pass Unlocked & Active
                    </span>
                    <h4 className="text-xs font-bold text-ink mt-1.5">QR Check-in At Venue</h4>
                    <p className="text-[11px] text-ink-muted mt-0.5">
                      Your entry is confirmed. Present your digital QR pass at the entrance desk for instant check-in.
                    </p>
                  </div>
                  <Link
                    href="/dashboard/student"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all hover:scale-105"
                  >
                    <span>Open Digital ID Pass</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-2xl bg-surface-muted text-ink-muted flex items-center justify-center mx-auto border border-surface-border">
                    <Lock className="w-5 h-5 text-ink-muted" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-surface-muted text-ink-muted uppercase tracking-wide border border-surface-border">
                      Digital Pass Locked
                    </span>
                    <h4 className="text-xs font-bold text-ink mt-1.5">QR Check-in At Venue</h4>
                    <p className="text-[11px] text-ink-muted mt-0.5">
                      Digital QR entry pass is locked. Please register for this event above to generate and activate your pass.
                    </p>
                  </div>
                  <button
                    onClick={handleRegister}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface-muted hover:bg-surface text-ink-muted hover:text-ink border border-surface-border text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5 text-primary-600" />
                    <span>Register to Unlock Pass</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <EventRegistrationModal
        event={event}
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onRegistrationSuccess={() => setIsRegistered(true)}
      />

      <AuthRequiredModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title="Event Registration Requires Login"
        message={`Please login or create an account with your Pragati College ID to register for "${event.title}" and receive your instant digital QR pass.`}
        redirectUrl={`/events/${event.id}`}
      />

      <EventPosterModal
        event={event}
        isOpen={showPosterModal}
        onClose={() => setShowPosterModal(false)}
      />

      <FeedbackModal
        eventId={event.id}
        eventTitle={event.title}
        clubName={event.club_name}
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
      />

      <Footer />
    </div>
  );
}

export default function EventDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-surface-muted">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
        </div>
      }
    >
      <EventDetailContent />
    </Suspense>
  );
}

