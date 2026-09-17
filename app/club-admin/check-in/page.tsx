'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { dataService, useCentralDataSync } from '@/lib/dataService';
import { useAuth } from '@/lib/authContext';
import { QrCode, CheckCircle2, AlertCircle, Users, ArrowLeft, Search } from 'lucide-react';
import Link from 'next/link';
import { triggerConfetti } from '@/lib/confetti';

export default function CheckInConsolePage() {
  const dataVersion = useCentralDataSync();
  const events = dataService.getEvents();
  const [selectedEventId, setSelectedEventId] = useState(events[0]?.id || '');
  const [manualCode, setManualCode] = useState('');
  const [scanResult, setScanResult] = useState<{ success: boolean; message: string; user?: any } | null>(null);
  const [recentScans, setRecentScans] = useState<any[]>([]);

  const selectedEvent = events.find(e => e.id === selectedEventId) || events[0];

  const handleVerify = (code: string) => {
    if (!code) return;
    const res = dataService.checkInUser(selectedEvent.id, code);
    setScanResult(res);

    if (res.success) {
      triggerConfetti({
        particleCount: 80,
        spread: 60,
      });
      if (res.user) {
        setRecentScans(prev => [
          { ...res.user, time: new Date().toLocaleTimeString() },
          ...prev.slice(0, 4)
        ]);
      }
    }
  };

  const simulateQuickScan = (memberId: string) => {
    setManualCode(memberId);
    handleVerify(memberId);
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-muted">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="flex items-center justify-between">
          <Link href="/dashboard/club-admin" className="inline-flex items-center gap-1.5 text-xs font-bold text-ink-muted hover:text-ink">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Club Admin Dashboard</span>
          </Link>
          <span className="text-xs font-bold text-primary-700 bg-primary-50 px-3 py-1 rounded-full">
            Admin Check-In Console
          </span>
        </div>

        {/* Event Select Dropdown Header */}
        <div className="coursue-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-ink">Live Event QR Attendance Scanner</h1>
            <p className="text-xs text-ink-muted mt-0.5">Select active session and authenticate attendee QR cards</p>
          </div>

          <div className="w-full sm:w-72">
            <label className="text-[11px] font-bold text-ink block mb-1">Active Event Session:</label>
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-surface-border bg-surface-muted text-xs font-bold text-ink focus:outline-none focus:border-primary-600"
            >
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>{ev.title}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Two-Column Scanner Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Scanner Viewfinder Box */}
          <div className="coursue-card p-6 space-y-4">
            <h3 className="text-sm font-bold text-ink">Live Camera Scanner Stream</h3>

            <div className="relative aspect-video bg-ink rounded-2xl overflow-hidden flex flex-col items-center justify-center border-2 border-primary-500 shadow-glow">
              <div className="absolute inset-x-8 h-0.5 bg-gradient-to-r from-transparent via-primary-400 to-transparent animate-bounce shadow-glow" />
              <div className="w-40 h-40 border-2 border-dashed border-primary-300/60 rounded-2xl flex items-center justify-center relative">
                <QrCode className="w-16 h-16 text-white/30" />
              </div>
              <p className="text-[11px] font-semibold text-white/80 mt-3">Scan attendee digital card QR barcode</p>
            </div>

            {/* Quick Test Attendee Buttons */}
            <div className="space-y-2 pt-2">
              <p className="text-[11px] font-bold text-ink-muted uppercase">Simulate Registered Attendee Scans:</p>
              <div className="grid grid-cols-2 gap-2">
                {dataService.getUsers().filter(u => u.role === 'student' || u.role === 'club_member').slice(0, 4).map((stud) => (
                  <button
                    key={stud.id}
                    onClick={() => simulateQuickScan(stud.membership_number || stud.id)}
                    className="p-2 text-left bg-surface-muted hover:bg-primary-50 rounded-xl border border-surface-border text-xs flex items-center gap-2 transition-colors"
                  >
                    <img src={stud.photo_url} className="w-7 h-7 rounded-full object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-ink truncate">{stud.full_name}</p>
                      <p className="text-[9px] text-primary-600 font-mono truncate">{stud.membership_number || stud.id}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Manual Roll Number Search */}
            <div className="flex items-center gap-2 pt-2 border-t border-surface-border">
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="Enter Membership Number manually..."
                className="flex-1 text-xs p-2.5 rounded-xl border border-surface-border bg-surface-muted focus:outline-none focus:border-primary-600 font-mono"
              />
              <button
                onClick={() => handleVerify(manualCode)}
                className="px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow-sm"
              >
                Mark Attendance
              </button>
            </div>
          </div>

          {/* Right Column: Scan Result & Realtime Roster */}
          <div className="space-y-6">
            {/* Feedback Alert */}
            {scanResult ? (
              <div
                className={`p-4 rounded-2xl border flex items-center gap-3 animate-in fade-in ${
                  scanResult.success
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}
              >
                {scanResult.success ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
                )}
                <div>
                  <p className="text-xs font-bold">{scanResult.message}</p>
                  {scanResult.user && (
                    <p className="text-[11px] text-ink-muted mt-0.5">
                      Name: {scanResult.user.full_name} • Roll: {scanResult.user.membership_number}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-surface border border-surface-border text-xs text-ink-muted flex items-center gap-2">
                <QrCode className="w-4 h-4 text-primary-600" />
                <span>Ready to scan. Present card or click a test attendee.</span>
              </div>
            )}

            {/* Live Check-in Roster */}
            <div className="coursue-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-ink">Recent Checked-In Attendees</h3>
                <span className="text-xs font-bold text-primary-700 bg-primary-50 px-2.5 py-1 rounded-full">
                  Live Stream
                </span>
              </div>

              {recentScans.length > 0 ? (
                <div className="divide-y divide-surface-border">
                  {recentScans.map((user, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img src={user.photo_url} className="w-8 h-8 rounded-full object-cover" />
                        <div>
                          <p className="text-xs font-bold text-ink">{user.full_name}</p>
                          <p className="text-[10px] text-ink-muted">{user.department}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                          ✓ Verified
                        </span>
                        <p className="text-[9px] text-ink-muted mt-0.5">{user.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-ink-muted text-center py-6">
                  No attendees scanned yet in this session.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
