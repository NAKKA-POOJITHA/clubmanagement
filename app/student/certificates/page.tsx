'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { dataService } from '@/lib/dataService';
import { useAuth } from '@/lib/authContext';
import { generateCertificatePDF } from '@/lib/pdf';
import { CertificateRecord } from '@/lib/demoData';
import CertificateViewerModal from '@/components/CertificateViewerModal';
import { Award, Download, ShieldCheck, ArrowLeft, ExternalLink, Eye, AlertCircle, CheckCircle2, Lock } from 'lucide-react';
import Link from 'next/link';

export default function StudentCertificatesPage() {
  const { userProfile } = useAuth();
  const [selectedCert, setSelectedCert] = useState<CertificateRecord | null>(null);
  const [showViewerModal, setShowViewerModal] = useState(false);

  // Strictly get only verified certificates belonging to this student
  const certs = dataService.getStudentEligibleCertificates(userProfile);

  const handleDownload = (cert: CertificateRecord) => {
    // Strict backend ownership verification
    const authCheck = dataService.verifyStudentCertificateOwnership(cert.certificate_number, userProfile);
    if (!authCheck.allowed || !authCheck.certificate) {
      alert(authCheck.error || 'Access Denied: Certificate does not belong to your student account.');
      return;
    }

    generateCertificatePDF({
      studentName: authCheck.certificate.student_name,
      eventName: authCheck.certificate.event_title,
      clubName: authCheck.certificate.club_name,
      date: authCheck.certificate.issue_date,
      certificateNumber: authCheck.certificate.certificate_number
    });
  };

  const handleViewCertificate = (cert: CertificateRecord) => {
    const authCheck = dataService.verifyStudentCertificateOwnership(cert.certificate_number, userProfile);
    if (!authCheck.allowed || !authCheck.certificate) {
      alert(authCheck.error || 'Access Denied: Certificate does not belong to your student account.');
      return;
    }
    setSelectedCert(authCheck.certificate);
    setShowViewerModal(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-muted">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <Link href="/dashboard/student" className="inline-flex items-center gap-1.5 text-xs font-bold text-ink-muted hover:text-ink">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Student Dashboard</span>
        </Link>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              <Award className="w-3.5 h-3.5" />
              <span>Verified Credentials</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">Your Certificates</h1>
            <p className="text-xs text-ink-muted">
              View and download certificates that you have earned through eligible events and activities.
            </p>
          </div>
          <span className="text-xs font-bold text-primary-700 bg-primary-50 px-3.5 py-1.5 rounded-full border border-primary-200">
            {certs.length} Earned Credential{certs.length === 1 ? '' : 's'}
          </span>
        </div>

        {/* Certificates Grid */}
        {certs.length > 0 ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {certs.map((cert) => (
                <div key={cert.id} className="coursue-card p-6 bg-surface border border-surface-border shadow-card flex flex-col justify-between space-y-5 rounded-3xl hover:border-primary-300 transition-all">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-mono text-xs font-bold text-primary-700 bg-primary-50 px-2.5 py-1 rounded-lg border border-primary-200">
                        {cert.certificate_number}
                      </span>
                      <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1 shadow-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Valid & Verified</span>
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-base font-black text-ink leading-snug">
                        {cert.event_title}
                      </h3>
                      <p className="text-xs text-ink font-semibold">
                        Issued by: <strong className="text-primary-800">{cert.club_name}</strong>
                      </p>
                      <p className="text-xs text-ink-muted">
                        Date: <span className="font-medium text-ink">{cert.issue_date}</span>
                      </p>
                      <p className="text-[11px] text-ink-muted font-mono">
                        Certificate ID: <span className="font-bold text-ink">{cert.certificate_number}</span>
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-surface-border flex flex-col sm:flex-row items-center justify-between gap-2.5">
                    <button
                      onClick={() => handleViewCertificate(cert)}
                      className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl border border-surface-border hover:bg-surface-subtle text-ink text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-primary-600" />
                      <span>View Certificate</span>
                    </button>

                    <button
                      onClick={() => handleDownload(cert)}
                      className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl bg-[#0A2540] hover:bg-[#1E3A8A] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all hover:scale-105 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Attendance & Certificate Eligibility Policy Banner */}
            <div className="p-5 bg-surface rounded-2xl border border-surface-border space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-ink">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Automated Certificate Issuance Rule</span>
              </div>
              <p className="text-ink-muted leading-relaxed">
                Certificates are issued only after verified physical QR attendance check-in by the Faculty Coordinator or Club Admin. If you have registered for an event that has not yet concluded, your credential will become available immediately upon attendance check-in.
              </p>
            </div>
          </div>
        ) : (
          <div className="coursue-card p-12 text-center space-y-4 bg-surface rounded-3xl border border-surface-border">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
              <Award className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-ink">No Certificates Issued Yet</h3>
              <p className="text-xs text-ink-muted max-w-md mx-auto leading-relaxed">
                Certificates appear here automatically once your attendance is verified at enrolled technical workshops, hackathons, or competitions.
              </p>
            </div>
            <Link
              href="/events"
              className="inline-block mt-2 px-6 py-2.5 rounded-2xl bg-[#0A2540] hover:bg-[#1E3A8A] text-white text-xs font-bold"
            >
              Browse Upcoming Events →
            </Link>
          </div>
        )}
      </main>

      {/* Interactive Certificate Viewer Modal */}
      <CertificateViewerModal
        certificate={selectedCert}
        isOpen={showViewerModal}
        onClose={() => setShowViewerModal(false)}
      />

      <Footer />
    </div>
  );
}
