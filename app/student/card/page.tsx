'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/lib/authContext';
import { generateQrCodeDataUrl } from '@/lib/qr';
import { Sparkles, Download, RotateCcw, ShieldCheck, QrCode, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function DigitalCardPage() {
  const { userProfile } = useAuth();
  const [isFlipped, setIsFlipped] = useState(false);
  const [qrUrl, setQrUrl] = useState('');

  const membershipId = userProfile.membership_number || `PRAG-2026-4821`;

  useEffect(() => {
    async function load() {
      const origin = typeof window !== 'undefined' ? window.location.origin : 'https://pragati.ac.in';
      const url = `${origin}/verify/${membershipId}`;
      const qr = await generateQrCodeDataUrl(url);
      setQrUrl(qr);
    }
    load();
  }, [membershipId]);

  return (
    <div className="min-h-screen flex flex-col bg-surface-muted">
      <Navbar />

      <main className="flex-1 max-w-xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <Link href={`/dashboard/${userProfile.role.replace('_', '-')}`} className="inline-flex items-center gap-1.5 text-xs font-bold text-ink-muted hover:text-ink">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-100 text-primary-800 text-xs font-bold border border-primary-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Official Pragati University Identity Pass</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink">Digital Membership Pass</h1>
          <p className="text-xs text-ink-muted">
            Governed by CSEC & PATHUB. Present this pass at workshops and hackathons for instant live QR attendance verification.
          </p>
        </div>

        {/* 3D Flip Card Container */}
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className="perspective-1000 w-full h-72 sm:h-80 cursor-pointer my-6"
        >
          <div
            className={`relative w-full h-full duration-500 transform-style-preserve-3d transition-transform ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
          >
            {/* FRONT OF CARD */}
            <div className="absolute inset-0 backface-hidden rounded-3xl bg-gradient-to-br from-[#0A2540] via-primary-800 to-indigo-900 text-white p-6 flex flex-col justify-between shadow-glow border border-white/10">
              <div className="flex items-center justify-between border-b border-white/20 pb-3">
                <div className="flex items-center gap-2.5">
                  <img src="/images/pragati_emblem.png" alt="Pragati" className="w-9 h-9 object-contain" />
                  <div>
                    <p className="text-xs font-extrabold leading-tight">PRAGATI UNIVERSITY • CSEC</p>
                    <p className="text-[9px] text-white/70">Central Technical Clubs Ecosystem</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                  VERIFIED ACTIVE
                </span>
              </div>

              <div className="flex items-center gap-4 my-auto">
                <img
                  src={userProfile.photo_url}
                  alt={userProfile.full_name}
                  className="w-20 h-20 rounded-2xl object-cover ring-2 ring-white/50 shadow-md"
                />
                <div className="space-y-0.5">
                  <h4 className="text-lg font-extrabold text-white leading-tight">{userProfile.full_name}</h4>
                  <p className="text-xs text-primary-200 capitalize font-medium">{userProfile.role.replace('_', ' ')}</p>
                  <p className="text-xs text-white/80">{userProfile.department}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/20 text-xs">
                <div>
                  <p className="text-white/60 text-[9px] uppercase">Member Token</p>
                  <p className="font-mono font-bold tracking-wider">{membershipId}</p>
                </div>
                <div className="text-right">
                  <p className="text-white/60 text-[9px] uppercase">Academic Year</p>
                  <p className="font-bold">2026 - 2027</p>
                </div>
              </div>
            </div>

            {/* BACK OF CARD */}
            <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-3xl bg-gradient-to-br from-indigo-900 via-primary-800 to-[#0A2540] text-white p-6 flex flex-col justify-between shadow-glow border border-white/10">
              <div className="flex items-center justify-between border-b border-white/20 pb-2">
                <p className="text-xs font-bold">QR ATTENDANCE BARCODE</p>
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
              </div>

              <div className="flex items-center justify-center py-3">
                <div className="bg-white p-3 rounded-2xl shadow-lg">
                  {qrUrl ? (
                    <img src={qrUrl} alt="QR Pass" className="w-28 h-28" />
                  ) : (
                    <QrCode className="w-28 h-28 text-ink" />
                  )}
                </div>
              </div>

              <div className="text-center text-xs text-white/80">
                <p>Scan to authenticate student credentials and register attendance.</p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-ink-muted flex items-center justify-center gap-1.5">
          <RotateCcw className="w-4 h-4 text-primary-600" />
          <span>Click card to flip between photo ID and QR verification barcode</span>
        </p>

        <div className="pt-2">
          <button
            onClick={() => alert(`Downloaded digital membership pass ${membershipId} as PNG.`)}
            className="w-full py-3 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Download Offline Card (PNG)</span>
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}

