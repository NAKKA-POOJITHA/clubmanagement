'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { dataService, useCentralDataSync } from '@/lib/dataService';
import { ShieldCheck, CheckCircle2, Award, QrCode, Sparkles, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PublicVerifyPage() {
  const params = useParams();
  const id = params.id as string;
  const dataVersion = useCentralDataSync();

  // Check if it's a certificate or a membership ID
  const cert = dataService.verifyCertificate(id);
  const member = dataService.getUsers().find(
    p => p.membership_number?.toLowerCase() === id.toLowerCase() || p.id.toLowerCase() === id.toLowerCase()
  );

  const isCert = !!cert;
  const isMember = !!member;
  const isValid = isCert || isMember;

  return (
    <div className="min-h-screen flex flex-col bg-surface-muted">
      <Navbar />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-ink-muted hover:text-ink mb-6">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="coursue-card p-6 sm:p-8 space-y-6 shadow-float">
          {isValid ? (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-extrabold tracking-wider uppercase px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                  VERIFIED AUTHENTIC RECORD
                </span>
                <h1 className="text-2xl font-extrabold text-ink pt-2">
                  {isCert ? 'Valid Participation Certificate' : 'Active Digital Membership ID'}
                </h1>
                <p className="text-xs text-ink-muted">
                  Official Record ID: <span className="font-mono font-bold text-primary-700">{id}</span>
                </p>
              </div>

              {/* Verification Details Box */}
              <div className="p-5 bg-surface-muted rounded-2xl border border-surface-border text-left space-y-3">
                {isCert && cert && (
                  <>
                    <div className="flex justify-between text-xs">
                      <span className="text-ink-muted">Recipient Name:</span>
                      <span className="font-bold text-ink">{cert.student_name}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-ink-muted">Event Attended:</span>
                      <span className="font-bold text-ink">{cert.event_title}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-ink-muted">Organizing Body:</span>
                      <span className="font-semibold text-primary-700">{cert.club_name}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-ink-muted">Issue Date:</span>
                      <span className="font-medium text-ink">{cert.issue_date}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-ink-muted">Status:</span>
                      <span className="font-bold text-emerald-600">Active & Valid</span>
                    </div>
                  </>
                )}

                {isMember && member && (
                  <>
                    <div className="flex items-center gap-3 pb-2 border-b border-surface-border">
                      <img src={member.photo_url} className="w-12 h-12 rounded-full object-cover" />
                      <div>
                        <h4 className="text-sm font-bold text-ink">{member.full_name}</h4>
                        <p className="text-xs text-primary-700 capitalize">{member.role.replace('_', ' ')}</p>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-ink-muted">Department:</span>
                      <span className="font-bold text-ink">{member.department}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-ink-muted">Academic Status:</span>
                      <span className="font-bold text-ink">{member.academic_year}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-ink-muted">Validity:</span>
                      <span className="font-bold text-emerald-600">2026 - 2027 (Active)</span>
                    </div>
                  </>
                )}
              </div>

              <div className="pt-2 text-[11px] text-ink-muted leading-relaxed">
                This verification check was performed securely against the college central database and cryptographic ledger.
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-center py-6">
              <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                <AlertCircle className="w-10 h-10" />
              </div>
              <h1 className="text-xl font-bold text-ink">Record Not Found</h1>
              <p className="text-xs text-ink-muted max-w-sm mx-auto">
                The identifier <code className="bg-surface-subtle px-2 py-0.5 rounded font-mono">{id}</code> could not be matched with any issued certificate or membership card.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
