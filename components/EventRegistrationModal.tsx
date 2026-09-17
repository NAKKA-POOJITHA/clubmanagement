'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/authContext';
import { dataService } from '@/lib/dataService';
import { EventItem } from '@/lib/demoData';
import {
  Sparkles,
  User,
  Mail,
  Phone,
  Building2,
  Users,
  CheckCircle2,
  X,
  ArrowRight,
  ShieldCheck,
  QrCode,
  Lock
} from 'lucide-react';
import { triggerConfetti } from '@/lib/confetti';

interface EventRegistrationModalProps {
  event: EventItem;
  isOpen: boolean;
  onClose: () => void;
  onRegistrationSuccess: () => void;
}

export default function EventRegistrationModal({
  event,
  isOpen,
  onClose,
  onRegistrationSuccess,
}: EventRegistrationModalProps) {
  const { userProfile, isAuthenticated, login } = useAuth();

  const [fullName, setFullName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [academicYear, setAcademicYear] = useState('3rd Year (2024-2028)');
  const [teamName, setTeamName] = useState('');
  const [teamMembers, setTeamMembers] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [registrationToken, setRegistrationToken] = useState('');

  // Pre-fill if authenticated
  useEffect(() => {
    if (isAuthenticated && userProfile) {
      setFullName(userProfile.full_name || '');
      setRollNumber(userProfile.membership_number || userProfile.id || '');
      setEmail(userProfile.email || '');
      setPhone(userProfile.phone || '');
      setDepartment(userProfile.department || 'Computer Science & Engineering');
    }
  }, [isAuthenticated, userProfile, isOpen]);

  if (!isOpen) return null;

  const isTeamEvent = event.title.toLowerCase().includes('quantathon') ||
                      event.title.toLowerCase().includes('hack') ||
                      event.event_type.toLowerCase() === 'hackathon';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const studentData = {
      id: userProfile?.id || `u-${Date.now()}`,
      full_name: fullName,
      email: email,
      membership_number: rollNumber,
      department: department,
      phone: phone,
      role: (userProfile?.role || 'student') as any,
      academic_year: academicYear,
      photo_url: userProfile?.photo_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'
    };

    // If not authenticated, authenticate the session with provided details
    if (!isAuthenticated) {
      login(email, undefined, 'student', studentData);
    }

    // Register for event in dataService
    dataService.registerForEvent(event.id, studentData);

    const token = `PASS-${event.id.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setRegistrationToken(token);

    triggerConfetti({
      particleCount: 100,
      spread: 70,
    });

    setIsSubmitting(false);
    setIsCompleted(true);
    onRegistrationSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-surface rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-5 relative border border-surface-border my-8 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-surface-muted hover:bg-surface-border text-ink-muted hover:text-ink flex items-center justify-center transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {!isCompleted ? (
          <>
            {/* Header */}
            <div className="space-y-1.5 pr-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-[11px] font-bold border border-primary-100">
                <Sparkles className="w-3.5 h-3.5 fill-current" />
                <span>Event Registration • {event.club_name}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#0A2540] tracking-tight">
                {event.title}
              </h2>
              <p className="text-xs text-ink-muted">
                Fill in your student credentials below to reserve your seat and activate your instant QR entry pass.
              </p>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-bold text-ink">Student Full Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      required
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Bathina Surya Abhilash"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-surface-border bg-surface-muted focus:bg-surface focus:outline-none focus:border-primary-600 font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-ink">Roll Number / Student ID *</label>
                  <input
                    required
                    type="text"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    placeholder="e.g. 24A31A05KF"
                    className="w-full px-3 py-2.5 rounded-xl border border-surface-border bg-surface-muted focus:bg-surface focus:outline-none focus:border-primary-600 font-mono font-bold text-primary-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-bold text-ink">Institutional Email *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@pragati.ac.in"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-surface-border bg-surface-muted focus:bg-surface focus:outline-none focus:border-primary-600 font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-ink">Phone Number *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      required
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 9876543210"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-surface-border bg-surface-muted focus:bg-surface focus:outline-none focus:border-primary-600"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-bold text-ink">Academic Department *</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-surface-border bg-surface-muted focus:bg-surface focus:outline-none focus:border-primary-600 font-medium"
                  >
                    <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Artificial Intelligence & DS">Artificial Intelligence & DS</option>
                    <option value="Electronics & Communication">Electronics & Communication</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-ink">Academic Year *</label>
                  <select
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-surface-border bg-surface-muted focus:bg-surface focus:outline-none focus:border-primary-600 font-medium"
                  >
                    <option value="1st Year (2026-2030)">1st Year (2026-2030)</option>
                    <option value="2nd Year (2025-2029)">2nd Year (2025-2029)</option>
                    <option value="3rd Year (2024-2028)">3rd Year (2024-2028)</option>
                    <option value="4th Year (2023-2027)">4th Year (2023-2027)</option>
                  </select>
                </div>
              </div>

              {/* Team Event Fields (For Quantathon / Hackathons) */}
              {isTeamEvent && (
                <div className="p-3.5 bg-primary-50/70 rounded-2xl border border-primary-100 space-y-3">
                  <div className="flex items-center gap-1.5 font-bold text-primary-800 text-xs">
                    <Users className="w-4 h-4 text-primary-600" />
                    <span>Team Details (Team Size: 3 Members for Quantathon)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block font-semibold text-ink text-[11px] mb-1">Team Name</label>
                      <input
                        type="text"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        placeholder="e.g. Quantum Innovators"
                        className="w-full p-2 rounded-lg border border-surface-border bg-surface text-xs focus:outline-none focus:border-primary-600"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-ink text-[11px] mb-1">Co-Members (Name & Roll)</label>
                      <input
                        type="text"
                        value={teamMembers}
                        onChange={(e) => setTeamMembers(e.target.value)}
                        placeholder="Member 2 (Roll), Member 3 (Roll)"
                        className="w-full p-2 rounded-lg border border-surface-border bg-surface text-xs focus:outline-none focus:border-primary-600"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-surface-border text-ink-muted hover:bg-surface-subtle font-semibold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-[#0A2540] hover:bg-[#1E3A8A] text-white font-bold shadow-md hover:scale-[1.02] transition-all flex items-center gap-2"
                >
                  <span>{isSubmitting ? 'CONFIRMING...' : 'CONFIRM REGISTRATION'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </>
        ) : (
          /* Confirmation & Pass Unlock */
          <div className="text-center space-y-4 py-2 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wide">
                Registration Confirmed & Pass Unlocked
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-[#0A2540] mt-2">
                You're In, {fullName}!
              </h3>
              <p className="text-xs text-ink-muted max-w-sm mx-auto">
                Your entry for <strong>{event.title}</strong> is confirmed. Your digital pass has been activated.
              </p>
            </div>

            {/* Pass Token Box */}
            <div className="p-4 bg-surface-muted rounded-2xl border border-surface-border text-left space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-ink-muted">Participant:</span>
                <span className="font-bold text-ink">{fullName} ({rollNumber})</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-ink-muted">Event Date:</span>
                <span className="font-bold text-ink">{new Date(event.start_time).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-ink-muted">Entry Token:</span>
                <span className="font-mono font-bold text-primary-700 bg-primary-50 px-2 py-0.5 rounded border border-primary-200">
                  {registrationToken}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-[#0A2540] hover:bg-[#1E3A8A] text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>View Unlocked Digital Pass</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
