'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/lib/authContext';
import { dataService } from '@/lib/dataService';
import { Sparkles, User, Mail, Lock, ShieldCheck, ArrowRight, CheckCircle2, Phone, GraduationCap, Building2, AlertCircle, LogIn } from 'lucide-react';
import Link from 'next/link';
import { triggerConfetti } from '@/lib/confetti';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const clubs = dataService.getClubs();

  const [fullName, setFullName] = useState('');
  const [collegeId, setCollegeId] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [academicYear, setAcademicYear] = useState('2nd Year (2025-2029)');
  const [selectedClub, setSelectedClub] = useState('pragsoft');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [issuedMembershipId, setIssuedMembershipId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await register({
        fullName,
        collegeId,
        email,
        phone,
        department,
        academicYear,
        club: selectedClub,
        password,
      });

      if (!result.success) {
        setErrorMsg(result.error || 'Registration failed. Please check your credentials.');
        setIsSubmitting(false);
        return;
      }

      setIssuedMembershipId(result.user?.membership_number || collegeId);

      triggerConfetti({
        particleCount: 120,
        spread: 80,
      });

      setRegistered(true);
      setIsSubmitting(false);
    } catch (err: any) {
      setErrorMsg('Unable to complete registration. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleEnterDashboard = () => {
    router.push('/dashboard/student');
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-muted">
      <Navbar />

      <main className="flex-1 max-w-xl w-full mx-auto px-4 py-12 flex flex-col justify-center space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#0A2540] text-white flex items-center justify-center mx-auto shadow-glow">
            <Sparkles className="w-6 h-6 text-amber-400 fill-current" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0A2540] tracking-tight">
            Create Student Account
          </h1>
          <p className="text-xs text-ink-muted max-w-md mx-auto">
            Join Pragati University's Centralized Technical Clubs Ecosystem. Get your official digital QR pass and access hackathons, LMS roadmaps, and verifiable certificates.
          </p>
        </div>

        <div className="coursue-card p-6 sm:p-8 space-y-5 shadow-card bg-surface">
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {!registered ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-ink">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    required
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Jason Ranti"
                    className="w-full text-xs pl-10 pr-3 py-2.5 rounded-xl border border-surface-border bg-surface-muted focus:outline-none focus:border-primary-600 font-medium"
                  />
                </div>
              </div>

              {/* College ID & Phone (2 cols) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-ink">College ID / Student ID *</label>
                  <input
                    required
                    type="text"
                    value={collegeId}
                    onChange={(e) => setCollegeId(e.target.value)}
                    placeholder="e.g. 24A31A05KF"
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-surface-border bg-surface-muted focus:outline-none focus:border-primary-600 font-mono font-bold text-primary-700"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-ink">Phone Number *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      required
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +91 9876543210"
                      className="w-full text-xs pl-10 pr-3 py-2.5 rounded-xl border border-surface-border bg-surface-muted focus:outline-none focus:border-primary-600"
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-ink">Institutional Email *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. student@pragati.ac.in"
                    className="w-full text-xs pl-10 pr-3 py-2.5 rounded-xl border border-surface-border bg-surface-muted focus:outline-none focus:border-primary-600 font-mono"
                  />
                </div>
              </div>

              {/* Department & Academic Year (2 cols) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-ink">Department *</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-surface-border bg-surface-muted focus:outline-none focus:border-primary-600 font-medium"
                  >
                    <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Artificial Intelligence & DS">Artificial Intelligence & DS</option>
                    <option value="Electronics & Communication">Electronics & Communication</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-ink">Academic Year / Batch *</label>
                  <select
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-surface-border bg-surface-muted focus:outline-none focus:border-primary-600 font-medium"
                  >
                    <option value="1st Year (2026-2030)">1st Year (2026-2030)</option>
                    <option value="2nd Year (2025-2029)">2nd Year (2025-2029)</option>
                    <option value="3rd Year (2024-2028)">3rd Year (2024-2028)</option>
                    <option value="4th Year (2023-2027)">4th Year (2023-2027)</option>
                  </select>
                </div>
              </div>

              {/* Primary Club Selection */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-ink">Select Primary Club to Join *</label>
                <select
                  value={selectedClub}
                  onChange={(e) => setSelectedClub(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-primary-200 bg-primary-50/50 focus:outline-none focus:border-primary-600 font-semibold text-primary-900"
                >
                  <option value="pragsoft">💻 PRAGSOFT — Technical Coding Club</option>
                  <option value="arvr-club">🥽 AR/VR & Metaverse Club</option>
                  <option value="rotaract">🤝 Rotaract Club of Pragati Surampalem Central (Non-Technical)</option>
                  <option value="csec-council">👑 Computer Science Executive Council (CSEC)</option>
                </select>
              </div>

              {/* Password & Confirm Password (2 cols) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-ink">Password *</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      required
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full text-xs pl-10 pr-3 py-2.5 rounded-xl border border-surface-border bg-surface-muted focus:outline-none focus:border-primary-600 font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-ink">Confirm Password *</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      required
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full text-xs pl-10 pr-3 py-2.5 rounded-xl border border-surface-border bg-surface-muted focus:outline-none focus:border-primary-600 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-primary-50 rounded-xl border border-primary-100 text-[11px] text-primary-800 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
                <span>Upon registration, your account is immediately verified with <strong>Student & Club Member</strong> permissions, and your credentials can be used for instant sign-in.</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-[#0A2540] hover:bg-[#1E3A8A] disabled:opacity-70 text-white text-xs font-bold shadow-md hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{isSubmitting ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div className="text-center space-y-4 py-4 animate-in fade-in zoom-in-95">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wide">
                  Account Created & Verified
                </span>
                <h2 className="text-2xl font-black text-[#0A2540] mt-2">
                  Registration successful!
                </h2>
                <p className="text-xs text-ink-muted max-w-sm mx-auto">
                  Your student account has been created. You can access your personal dashboard now or sign in anytime with your credentials.
                </p>
              </div>

              <div className="p-4 bg-primary-50 rounded-2xl border border-primary-200 text-left space-y-2 text-xs text-ink">
                <div className="flex justify-between">
                  <span className="text-ink-muted">Student Name:</span>
                  <span className="font-bold text-ink">{fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted">College / Student ID:</span>
                  <span className="font-mono font-bold text-primary-700">{collegeId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted">Institutional Email:</span>
                  <span className="font-mono font-bold text-ink">{email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted">Primary Club:</span>
                  <span className="font-bold capitalize">{selectedClub.replace('-', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted">Assigned Role:</span>
                  <span className="font-bold text-emerald-700 uppercase">STUDENT</span>
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                <button
                  onClick={handleEnterDashboard}
                  className="w-full py-3.5 rounded-xl bg-[#0A2540] hover:bg-[#1E3A8A] text-white text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.01] cursor-pointer"
                >
                  <span>Launch Student Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <Link
                  href={`/login?registered=true&id=${encodeURIComponent(collegeId || email)}`}
                  className="w-full py-3 rounded-xl border border-surface-border hover:bg-surface-subtle text-ink font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <LogIn className="w-4 h-4 text-primary-600" />
                  <span>Go to Login Page</span>
                </Link>
              </div>
            </div>
          )}

          <div className="text-center pt-2 border-t border-surface-border">
            <p className="text-xs text-ink-muted">
              Already have an account?{' '}
              <Link href="/login" className="text-primary-600 font-bold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
