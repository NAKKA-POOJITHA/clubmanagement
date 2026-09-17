'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Download, RotateCcw, ShieldCheck, CheckCircle2, QrCode } from 'lucide-react';
import { Profile } from '@/lib/demoData';
import { generateQrCodeDataUrl } from '@/lib/qr';

interface MembershipCardModalProps {
  user: Profile;
  isOpen: boolean;
  onClose: () => void;
}

export default function MembershipCardModal({ user, isOpen, onClose }: MembershipCardModalProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const membershipId = user.membership_number || `TECH-2026-${user.id.slice(0, 4).toUpperCase()}`;

  useEffect(() => {
    async function loadQr() {
      const origin = typeof window !== 'undefined' ? window.location.origin : 'https://pragati.ac.in';
      const url = `${origin}/verify/${membershipId}`;
      const qr = await generateQrCodeDataUrl(url);
      setQrDataUrl(qr);
    }
    if (isOpen) {
      loadQr();
    }
  }, [isOpen, membershipId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-ink flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary-600" />
              <span>Digital Membership Pass</span>
            </h3>
            <p className="text-xs text-ink-muted">Official Pragati University Technical Pass</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-subtle text-ink-muted hover:text-ink flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        {/* 3D Flip Card Container */}
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className="perspective-1000 w-full h-64 cursor-pointer"
        >
          <div
            className={`relative w-full h-full duration-500 transform-style-preserve-3d transition-transform ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
          >
            {/* FRONT OF CARD */}
            <div className="absolute inset-0 backface-hidden rounded-2xl bg-gradient-to-br from-[#0A2540] via-primary-800 to-indigo-900 text-white p-5 flex flex-col justify-between shadow-glow border border-white/10">
              <div className="flex items-center justify-between border-b border-white/20 pb-3">
                <div className="flex items-center gap-2">
                  <img src="/images/pragati_emblem.png" alt="Pragati" className="w-7 h-7 object-contain" />
                  <div>
                    <p className="text-xs font-bold leading-tight">PRAGATI UNIVERSITY • CSEC</p>
                    <p className="text-[9px] text-white/70">Autonomous Clubs Ecosystem</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                  ACTIVE
                </span>
              </div>

              <div className="flex items-center gap-4 my-auto">
                <img
                  src={user.photo_url}
                  alt={user.full_name}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white/50 shadow-md"
                />
                <div className="space-y-0.5">
                  <h4 className="text-base font-extrabold text-white leading-tight">{user.full_name}</h4>
                  <p className="text-xs text-primary-200 capitalize font-medium">{user.role.replace('_', ' ')}</p>
                  <p className="text-[10px] text-white/80">{user.department}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/20 text-[10px]">
                <div>
                  <p className="text-white/60 text-[8px] uppercase">Card Number</p>
                  <p className="font-mono font-bold tracking-wider">{membershipId}</p>
                </div>
                <div className="text-right">
                  <p className="text-white/60 text-[8px] uppercase">Valid Thru</p>
                  <p className="font-bold">2026-2027</p>
                </div>
              </div>
            </div>

            {/* BACK OF CARD */}
            <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl bg-gradient-to-br from-indigo-900 via-primary-800 to-[#0A2540] text-white p-5 flex flex-col justify-between shadow-glow border border-white/10">
              <div className="flex items-center justify-between border-b border-white/20 pb-2">
                <p className="text-xs font-bold">ATTENDANCE QR CODE</p>
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
              </div>

              <div className="flex items-center justify-center py-2">
                <div className="bg-white p-2 rounded-xl shadow-lg">
                  {qrDataUrl ? (
                    <img src={qrDataUrl} alt="Membership QR" className="w-24 h-24" />
                  ) : (
                    <QrCode className="w-24 h-24 text-ink" />
                  )}
                </div>
              </div>

              <div className="text-center text-[10px] text-white/80">
                <p>Present this QR code for instant check-in at club events and workshops.</p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-[11px] text-ink-muted flex items-center justify-center gap-1.5">
          <RotateCcw className="w-3.5 h-3.5 text-primary-600" />
          <span>Click card to flip between ID and QR code</span>
        </p>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => alert(`Downloaded digital membership card ${membershipId} as high-res PNG.`)}
            className="flex-1 py-2.5 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Download Pass</span>
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl border border-surface-border text-xs font-bold text-ink hover:bg-surface-subtle"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
