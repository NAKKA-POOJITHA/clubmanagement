'use client';

import React from 'react';
import Link from 'next/link';
import { Lock, Sparkles, X, ArrowRight, UserCheck, ShieldAlert } from 'lucide-react';
import { PragatiLogo } from './PragatiLogo';

interface AuthRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  redirectUrl?: string;
  requiredRole?: string;
}

export default function AuthRequiredModal({
  isOpen,
  onClose,
  title = 'Authentication Required',
  message = 'Please login or create an account with your College ID to perform this action.',
  redirectUrl = '/',
  requiredRole
}: AuthRequiredModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-surface rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 relative border border-surface-border animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-surface-muted hover:bg-surface-border text-ink-muted hover:text-ink flex items-center justify-center transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Icon & Brand */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-3xl bg-primary-50 border-2 border-primary-200 text-primary-600 flex items-center justify-center mx-auto shadow-sm">
            {requiredRole ? (
              <ShieldAlert className="w-7 h-7 text-amber-600" />
            ) : (
              <Lock className="w-7 h-7" />
            )}
          </div>

          <div>
            <div className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-primary-100 text-primary-800 text-[11px] font-bold mb-1.5">
              <Sparkles className="w-3 h-3 fill-current" />
              <span>Pragati University • Clubs Portal</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#0A2540] tracking-tight">
              {title}
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-ink-muted leading-relaxed max-w-sm mx-auto">
            {message}
          </p>
        </div>

        {/* Action CTAs */}
        <div className="space-y-2.5 pt-2">
          <Link
            href={`/login?redirect=${encodeURIComponent(redirectUrl)}`}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#0A2540] hover:bg-[#1E3A8A] text-white text-xs sm:text-sm font-bold shadow-glow hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
          >
            <span>LOGIN / SIGN IN</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          {!requiredRole && (
            <Link
              href={`/register?redirect=${encodeURIComponent(redirectUrl)}`}
              className="w-full py-3.5 px-4 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white text-xs sm:text-sm font-bold shadow-sm hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              <span>CREATE STUDENT ACCOUNT</span>
              <UserCheck className="w-4 h-4" />
            </Link>
          )}

          <button
            onClick={onClose}
            className="w-full py-2 text-xs font-semibold text-ink-muted hover:text-ink transition-colors"
          >
            Cancel & Return to Public Browsing
          </button>
        </div>
      </div>
    </div>
  );
}
