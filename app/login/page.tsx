'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/lib/authContext';
import { Sparkles, Lock, Mail, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect');
  const justRegistered = searchParams.get('registered') === 'true';
  const prefillId = searchParams.get('id') || '';
  const { login } = useAuth();

  const [emailOrId, setEmailOrId] = useState(prefillId);
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrId.trim()) {
      setErrorMsg('Please enter your Institutional Email or College ID.');
      return;
    }
    if (!password.trim()) {
      setErrorMsg('Please enter your account password.');
      return;
    }

    setErrorMsg('');
    setIsLoading(true);

    try {
      // Authenticate against persistent account database
      const res = await login(emailOrId.trim(), password.trim());

      if (res.success && res.role) {
        if (redirectPath) {
          router.push(redirectPath);
        } else if (res.role === 'student') {
          router.push('/dashboard/student');
        } else {
          router.push(`/dashboard/${res.role.replace('_', '-')}`);
        }
      } else {
        setErrorMsg(res.error || 'Invalid college ID/email or password.');
        setIsLoading(false);
      }
    } catch (err: any) {
      setErrorMsg('Unable to sign in right now. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-muted">
      <Navbar />

      <main className="flex-1 max-w-md w-full mx-auto px-4 py-12 flex flex-col justify-center space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#0A2540] text-white flex items-center justify-center mx-auto shadow-md">
            <Sparkles className="w-6 h-6 fill-current text-primary-300" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0A2540] tracking-tight">
            Welcome Back
          </h1>
          <p className="text-xs text-ink-muted">
            Pragati University • Centralized Technical Clubs Platform
          </p>
        </div>

        {/* Clean Production Login Form Card */}
        <div className="coursue-card p-6 sm:p-8 space-y-5 shadow-card bg-surface border border-surface-border">
          {justRegistered && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Registration Successful! Enter your password to log in.</span>
            </div>
          )}

          {errorMsg && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {forgotSent && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Password reset instructions sent to your institutional email.</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-ink">Email / College ID</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  required
                  type="text"
                  value={emailOrId}
                  onChange={(e) => setEmailOrId(e.target.value)}
                  placeholder="e.g. 24A31A05KF or student@pragati.ac.in"
                  className="w-full text-xs pl-10 pr-3 py-2.5 rounded-xl border border-surface-border bg-surface-muted focus:outline-none focus:border-primary-600 focus:bg-surface font-medium transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-ink">Password</label>
                <button
                  type="button"
                  onClick={() => setForgotSent(true)}
                  className="text-[11px] font-semibold text-primary-600 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full text-xs pl-10 pr-3 py-2.5 rounded-xl border border-surface-border bg-surface-muted focus:outline-none focus:border-primary-600 focus:bg-surface font-mono transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-[#0A2540] hover:bg-[#1E3A8A] disabled:opacity-70 text-white text-xs font-bold shadow-md hover:scale-[1.01] transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
            >
              <span>{isLoading ? 'SIGNING IN...' : 'LOGIN'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="border-t border-surface-border pt-4 text-center space-y-2">
            <p className="text-xs text-ink-muted">Don't have an account?</p>
            <Link
              href="/register"
              className="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-xl border border-primary-300 text-primary-700 bg-primary-50/50 hover:bg-primary-50 text-xs font-bold transition-all"
            >
              CREATE ACCOUNT
            </Link>
          </div>
        </div>

        <div className="text-center text-[11px] text-ink-muted">
          <span>Protected by Pragati University CSEC Identity Provider • NAAC A+</span>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-surface-muted">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
