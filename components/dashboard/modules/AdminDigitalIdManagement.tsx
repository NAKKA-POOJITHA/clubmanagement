'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/authContext';
import { PragatiLogo } from '@/components/PragatiLogo';
import {
  CreditCard,
  QrCode,
  ShieldCheck,
  Award,
  Sparkles,
  Download,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

export default function AdminDigitalIdManagement() {
  const { userProfile, currentRole } = useAuth();
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="coursue-card p-6 bg-gradient-to-r from-primary-900 via-[#0A2540] to-primary-800 text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-primary-200 text-[11px] font-bold tracking-wide uppercase">
              <CreditCard className="w-3.5 h-3.5" />
              <span>Cryptographic Identity Credential</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              Verified Digital Institutional Pass & ID Card
            </h1>
            <p className="text-xs text-primary-100/90 max-w-2xl leading-relaxed">
              Official electronic credentials for Pragati University technical clubs. QR pass enables contactless check-in at workshop entry points and live verification.
            </p>
          </div>

          <button
            onClick={() => setIsFlipped(!isFlipped)}
            className="self-start md:self-center px-4 py-2.5 rounded-xl bg-white text-primary-900 hover:bg-primary-50 text-xs font-bold flex items-center gap-2 shadow-float transition-all hover:scale-105 shrink-0"
          >
            <RefreshCw className="w-4 h-4 text-primary-700" />
            <span>{isFlipped ? 'View Front Side' : 'Flip to QR Pass'}</span>
          </button>
        </div>
      </div>

      {/* Card Preview Container */}
      <div className="flex flex-col items-center justify-center py-6">
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className="cursor-pointer max-w-md w-full transition-transform duration-500 transform hover:scale-[1.02]"
        >
          {!isFlipped ? (
            /* Front of Card */
            <div className="bg-gradient-to-br from-[#0A2540] via-[#112F55] to-primary-900 text-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-primary-500/30 relative overflow-hidden space-y-5">
              {/* Background Glow */}
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary-500/20 rounded-full blur-2xl pointer-events-none" />

              {/* Header with Logo */}
              <div className="flex items-center justify-between border-b border-white/15 pb-4">
                <PragatiLogo className="h-9 brightness-0 invert" />
                <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-white/10 text-primary-200 border border-white/10 uppercase tracking-wider">
                  Verified ID
                </span>
              </div>

              {/* User Identity Info */}
              <div className="flex items-center gap-4 pt-1">
                <img
                  src={userProfile.photo_url}
                  alt={userProfile.full_name}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-primary-400 shrink-0 shadow-md"
                />
                <div className="space-y-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-black tracking-tight truncate">{userProfile.full_name}</h3>
                  <p className="text-xs text-primary-200 font-semibold capitalize">{userProfile.role.replace('_', ' ')}</p>
                  <p className="text-[11px] text-white/70 truncate">{userProfile.department}</p>
                </div>
              </div>

              {/* Meta Grid */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/15 text-[11px]">
                <div>
                  <p className="text-white/60 text-[10px] uppercase font-bold tracking-wider">Membership No</p>
                  <p className="font-mono font-bold text-primary-200 text-xs mt-0.5">{userProfile.membership_number || '24A31A05JO'}</p>
                </div>
                <div>
                  <p className="text-white/60 text-[10px] uppercase font-bold tracking-wider">Academic Year</p>
                  <p className="font-semibold text-white text-xs mt-0.5">2026 - 2027</p>
                </div>
              </div>

              {/* Footer Indicator */}
              <div className="flex items-center justify-between text-[10px] text-white/60 pt-1">
                <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Officially Accredited</span>
                </span>
                <span className="font-mono">Click card to flip ↗</span>
              </div>
            </div>
          ) : (
            /* Back of Card (QR Verification) */
            <div className="bg-gradient-to-br from-[#0A2540] via-[#112F55] to-primary-900 text-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-primary-500/30 relative overflow-hidden space-y-4 text-center">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Official Event Check-In Pass</h4>
                <p className="text-[11px] text-primary-200">Scan at any university workshop scanner</p>
              </div>

              {/* QR Code Container */}
              <div className="bg-white p-4 rounded-2xl w-44 h-44 mx-auto flex items-center justify-center shadow-lg border border-primary-300">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                    JSON.stringify({
                      name: userProfile.full_name,
                      role: userProfile.role,
                      id: userProfile.membership_number || userProfile.id,
                      college: 'Pragati University'
                    })
                  )}`}
                  alt="QR Pass"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="font-mono text-xs text-primary-200 font-bold">
                TOKEN: {userProfile.id?.slice(0, 16).toUpperCase()}
              </div>

              <p className="text-[10px] text-white/60">
                Valid for all 2026-2027 technical sessions • Click to return to front
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
