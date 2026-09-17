'use client';

import React, { useState } from 'react';
import { QrCode, CheckCircle2, AlertCircle, Sparkles, UserCheck, Search, ShieldCheck, X, Clock, Calendar, Check, AlertTriangle } from 'lucide-react';
import { dataService } from '@/lib/dataService';
import { DEMO_PROFILES } from '@/lib/demoData';
import confetti from 'canvas-confetti';

interface QrScannerModalProps {
  eventId: string;
  eventTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess?: () => void;
}

export default function QrScannerModal({
  eventId,
  eventTitle,
  isOpen,
  onClose,
  onScanSuccess
}: QrScannerModalProps) {
  const [manualCode, setManualCode] = useState('');
  const [scanResult, setScanResult] = useState<{
    success: boolean;
    message: string;
    user?: any;
    eventTitle?: string;
    time?: string;
    studentId?: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleVerifyCode = (code: string) => {
    if (!code.trim()) return;
    const res = dataService.checkInUser(eventId, code.trim(), 'club_admin');
    setScanResult(res);
    if (res.success) {
      if (onScanSuccess) onScanSuccess();
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#0A2540', '#10B981', '#3B82F6']
        });
      } catch (e) {}
    }
  };

  const simulateQuickScan = (memberId: string) => {
    setManualCode(memberId);
    handleVerifyCode(memberId);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-surface rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-float border border-surface-border space-y-5 animate-in fade-in zoom-in-95 my-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-surface-border">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary-100 text-primary-800 flex items-center justify-center font-bold">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary-700 block">
                Live Attendance Scanner
              </span>
              <h3 className="text-sm sm:text-base font-black text-ink line-clamp-1">{eventTitle}</h3>
            </div>
          </div>
          <button
            onClick={() => {
              setScanResult(null);
              setManualCode('');
              onClose();
            }}
            className="p-1.5 text-ink-muted hover:text-ink rounded-lg hover:bg-surface-muted transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Viewfinder simulation box */}
        <div className="relative aspect-video bg-slate-950 rounded-2xl overflow-hidden flex flex-col items-center justify-center border-2 border-primary-600 shadow-inner">
          {/* Laser scanning beam line animation */}
          <div className="absolute inset-x-6 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-pulse shadow-glow" />

          <div className="w-36 h-36 border-2 border-dashed border-emerald-400/80 rounded-2xl flex items-center justify-center relative bg-emerald-500/5">
            <div className="absolute -top-1.5 -left-1.5 w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
            <div className="absolute -top-1.5 -right-1.5 w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
            <div className="absolute -bottom-1.5 -left-1.5 w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
            <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 border-b-2 border-r-2 border-emerald-400" />
            <QrCode className="w-14 h-14 text-white/40" />
          </div>
          <p className="text-[11px] font-semibold text-white/90 mt-3">
            Aim camera at Student Digital Pass QR
          </p>
        </div>

        {/* Scan Result Details Card */}
        {scanResult && (
          <div
            className={`p-4 rounded-2xl border text-left animate-in fade-in space-y-2 ${
              scanResult.success
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-red-50 border-red-300 text-red-950'
            }`}
          >
            {scanResult.success ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 pb-1.5 border-b border-emerald-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="text-xs font-black tracking-wider text-emerald-800 uppercase">
                    ✓ ATTENDANCE VERIFIED
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-emerald-800 font-semibold block uppercase">Student Name:</span>
                    <strong className="text-ink">{scanResult.user?.full_name}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-800 font-semibold block uppercase">Student ID / Roll:</span>
                    <strong className="font-mono text-primary-800">{scanResult.studentId || scanResult.user?.membership_number}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-800 font-semibold block uppercase">Event:</span>
                    <span className="font-medium text-ink line-clamp-1">{scanResult.eventTitle || eventTitle}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-800 font-semibold block uppercase">Status & Time:</span>
                    <span className="font-bold text-emerald-700">PRESENT • {scanResult.time || 'Just now'}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
                  <span className="text-xs font-black tracking-wider text-red-800 uppercase">
                    ATTENDANCE REJECTED
                  </span>
                </div>
                <p className="text-xs font-semibold text-red-900 leading-relaxed">
                  {scanResult.message}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Quick Test Attendee Buttons */}
        <div className="space-y-2 pt-1">
          <p className="text-[10px] font-bold text-ink-muted uppercase tracking-wider">
            Simulate Student QR Scans (Evaluator Test Desk):
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => simulateQuickScan('24A31A05KF')}
              className="p-2 text-left bg-surface hover:bg-primary-50 rounded-xl border border-surface-border text-xs flex items-center gap-2 transition-colors cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                S
              </div>
              <div className="min-w-0">
                <p className="font-bold text-ink truncate">Surya Abhilash</p>
                <p className="text-[10px] text-emerald-700 font-semibold">Registered ✓</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => simulateQuickScan('25A31A05ET')}
              className="p-2 text-left bg-surface hover:bg-primary-50 rounded-xl border border-surface-border text-xs flex items-center gap-2 transition-colors cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-primary-100 text-primary-800 flex items-center justify-center font-bold text-xs shrink-0">
                J
              </div>
              <div className="min-w-0">
                <p className="font-bold text-ink truncate">Jahnavi Devi</p>
                <p className="text-[10px] text-emerald-700 font-semibold">Registered ✓</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => simulateQuickScan('26A31A05C4')}
              className="p-2 text-left bg-surface hover:bg-red-50 rounded-xl border border-surface-border text-xs flex items-center gap-2 transition-colors cursor-pointer col-span-2"
            >
              <div className="w-7 h-7 rounded-lg bg-red-100 text-red-800 flex items-center justify-center font-bold text-xs shrink-0">
                P
              </div>
              <div className="min-w-0 flex-1 flex items-center justify-between">
                <div>
                  <p className="font-bold text-ink">Priya Sharma (26A31A05C4)</p>
                  <p className="text-[10px] text-red-600 font-semibold">Not Registered (Test Wrong Event Rejection)</p>
                </div>
                <span className="text-[10px] font-mono text-ink-muted">Scan ✗</span>
              </div>
            </button>
          </div>
        </div>

        {/* Manual Code / Roll Number Input */}
        <div className="pt-2 border-t border-surface-border space-y-1.5">
          <label className="block text-[11px] font-bold text-ink">Manual Roll / Membership Number Check-in:</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="e.g. 24A31A05KF or 25A31A05ET"
              className="flex-1 text-xs p-2.5 rounded-xl border border-surface-border bg-surface focus:outline-none focus:border-primary-600 font-mono font-bold"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleVerifyCode(manualCode);
              }}
            />
            <button
              type="button"
              onClick={() => handleVerifyCode(manualCode)}
              disabled={!manualCode.trim()}
              className="px-4 py-2.5 rounded-xl bg-[#0A2540] hover:bg-[#1E3A8A] disabled:opacity-50 text-white text-xs font-bold cursor-pointer transition-colors"
            >
              Check In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
