'use client';

import React from 'react';
import { CertificateRecord } from '@/lib/demoData';
import { generateCertificatePDF } from '@/lib/pdf';
import { Award, Download, ShieldCheck, ExternalLink, X, CheckCircle2, QrCode } from 'lucide-react';
import Link from 'next/link';

interface CertificateViewerModalProps {
  certificate: CertificateRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function CertificateViewerModal({
  certificate,
  isOpen,
  onClose
}: CertificateViewerModalProps) {
  if (!isOpen || !certificate) return null;

  const handleDownload = () => {
    generateCertificatePDF({
      studentName: certificate.student_name,
      eventName: certificate.event_title,
      clubName: certificate.club_name,
      date: certificate.issue_date,
      certificateNumber: certificate.certificate_number
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="max-w-2xl w-full bg-surface rounded-3xl border border-surface-border shadow-float overflow-hidden animate-in fade-in zoom-in-95 my-6">
        {/* Modal Top Bar */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold">Verifiable Academic Credential</h3>
              <p className="text-[10px] text-slate-400 font-mono">ID: {certificate.certificate_number}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Certificate Visual Canvas Preview */}
        <div className="p-6 sm:p-8 bg-gradient-to-br from-amber-50/40 via-white to-primary-50/30">
          <div className="relative p-6 sm:p-8 rounded-2xl border-4 border-double border-primary-300/80 bg-white shadow-md text-center space-y-4">
            {/* Watermark / Seal Icon */}
            <div className="flex justify-center items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary-100 border border-primary-200 flex items-center justify-center text-primary-700">
                <Award className="w-5 h-5" />
              </div>
            </div>

            {/* University & Department Header */}
            <div className="space-y-0.5">
              <span className="text-[9px] font-black tracking-widest text-primary-800 uppercase block">
                PRAGATI ENGINEERING COLLEGE (AUTONOMOUS)
              </span>
              <span className="text-[8px] font-semibold text-ink-muted uppercase block">
                NAAC A+ Accredited • Central Technical Clubs Network
              </span>
            </div>

            {/* Certificate Title */}
            <div className="py-1">
              <h2 className="text-lg sm:text-xl font-black text-ink tracking-tight uppercase">
                Certificate of Participation
              </h2>
              <span className="text-[10px] text-ink-muted block uppercase tracking-wider mt-0.5">
                This is proudly presented to
              </span>
            </div>

            {/* Student Name */}
            <div className="py-1 border-b border-primary-200 max-w-sm mx-auto">
              <h1 className="text-lg sm:text-2xl font-black text-primary-900 tracking-wide">
                {certificate.student_name}
              </h1>
              {certificate.student_id && (
                <span className="text-[10px] font-mono font-bold text-primary-700 block">
                  Roll No: {certificate.student_id}
                </span>
              )}
            </div>

            {/* Body Description */}
            <div className="space-y-1 text-xs text-ink max-w-lg mx-auto">
              <p className="text-[11px] text-ink-muted leading-relaxed">
                for successful active participation and verified completion in
              </p>
              <h3 className="font-extrabold text-sm sm:text-base text-primary-800 leading-snug">
                &ldquo;{certificate.event_title}&rdquo;
              </h3>
              <p className="text-[11px] text-ink-muted pt-1">
                Conducted by <strong className="text-ink">{certificate.club_name}</strong> on <strong>{certificate.issue_date}</strong>.
              </p>
            </div>

            {/* Signatures & Security Badge */}
            <div className="pt-4 grid grid-cols-3 items-end gap-2 text-[10px] border-t border-slate-100">
              <div className="space-y-0.5 text-left">
                <div className="font-serif italic font-bold text-slate-700 text-xs border-b border-slate-300 pb-0.5">
                  R. Jishnu Tej
                </div>
                <span className="text-[9px] font-bold text-ink block">Club Admin</span>
                <span className="text-[8px] text-ink-muted block">{certificate.club_name}</span>
              </div>

              <div className="flex flex-col items-center justify-center space-y-1">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shadow-xs">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <span className="text-[8px] font-extrabold text-emerald-800 uppercase">
                  ✓ Valid Record
                </span>
              </div>

              <div className="space-y-0.5 text-right">
                <div className="font-serif italic font-bold text-slate-700 text-xs border-b border-slate-300 pb-0.5">
                  Dr. A. Avinash
                </div>
                <span className="text-[9px] font-bold text-ink block">Faculty Coordinator</span>
                <span className="text-[8px] text-ink-muted block">Central Tech Council</span>
              </div>
            </div>

            {/* Verification Footer */}
            <div className="pt-2 flex items-center justify-between text-[9px] text-ink-muted font-mono bg-slate-50 p-2 rounded-xl border border-slate-200">
              <span>LEDGER ID: {certificate.certificate_number}</span>
              <span className="text-emerald-700 font-bold">STATUS: AUTHENTICATED</span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-surface border-t border-surface-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <Link
            href={`/verify/${certificate.certificate_number}`}
            target="_blank"
            className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Public Verification Page</span>
          </Link>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-semibold text-ink-muted hover:text-ink hover:bg-surface-muted transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handleDownload}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-[#0A2540] hover:bg-[#1E3A8A] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-105 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Official PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
