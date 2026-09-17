'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Award, ShieldCheck, Download, Eye, ExternalLink } from 'lucide-react';
import { CertificateRecord } from '@/lib/demoData';
import { generateCertificatePDF } from '@/lib/pdf';
import { useAuth } from '@/lib/authContext';
import { dataService } from '@/lib/dataService';
import CertificateViewerModal from '@/components/CertificateViewerModal';

interface DataTableProps {
  title?: string;
  certificates?: CertificateRecord[];
}

export default function DataTable({
  title = 'Your Earned & Verified Certificates',
  certificates,
}: DataTableProps) {
  const { userProfile } = useAuth();
  const [selectedCert, setSelectedCert] = useState<CertificateRecord | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Use passed certificates or strictly get verified certificates belonging to authenticated student
  const certList = certificates && certificates.length > 0
    ? certificates
    : dataService.getStudentEligibleCertificates(userProfile);

  const handleDownloadCert = (cert: CertificateRecord) => {
    const authCheck = dataService.verifyStudentCertificateOwnership(cert.certificate_number, userProfile);
    if (!authCheck.allowed || !authCheck.certificate) {
      alert(authCheck.error || 'Access Denied: Certificate does not belong to your account.');
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

  const handleViewCert = (cert: CertificateRecord) => {
    const authCheck = dataService.verifyStudentCertificateOwnership(cert.certificate_number, userProfile);
    if (!authCheck.allowed || !authCheck.certificate) {
      alert(authCheck.error || 'Access Denied: Certificate does not belong to your account.');
      return;
    }
    setSelectedCert(authCheck.certificate);
    setShowModal(true);
  };

  return (
    <div className="coursue-card p-5 mt-6 border border-surface-border">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-ink">{title}</h3>
          <p className="text-[11px] text-ink-muted">Cryptographically verified credentials awarded for completed events.</p>
        </div>
        <Link href="/student/certificates" className="text-xs font-semibold text-primary-600 hover:text-primary-700">
          See all ({certList.length})
        </Link>
      </div>

      {certList.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-bold text-ink-muted uppercase tracking-wider border-b border-surface-border">
                <th className="pb-3 px-3">Organizing Club</th>
                <th className="pb-3 px-3">Event / Workshop</th>
                <th className="pb-3 px-3">Certificate ID</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border text-xs">
              {certList.map((cert) => (
                <tr key={cert.id} className="hover:bg-surface-subtle transition-colors group">
                  {/* Club */}
                  <td className="py-3.5 px-3 font-bold text-ink">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-primary-100 text-primary-800 flex items-center justify-center font-bold text-xs">
                        {cert.club_name.charAt(0)}
                      </div>
                      <div>
                        <p className="leading-tight">{cert.club_name}</p>
                        <p className="text-[10px] text-ink-muted leading-tight">{cert.issue_date}</p>
                      </div>
                    </div>
                  </td>

                  {/* Event */}
                  <td className="py-3.5 px-3">
                    <p className="font-semibold text-ink leading-snug line-clamp-1">{cert.event_title}</p>
                    <p className="text-[10px] text-ink-muted">Awarded to {cert.student_name}</p>
                  </td>

                  {/* ID */}
                  <td className="py-3.5 px-3">
                    <span className="font-mono text-[10px] font-bold text-primary-700 bg-primary-50 px-2 py-0.5 rounded border border-primary-200">
                      {cert.certificate_number}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-3">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1 w-max">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>Valid</span>
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleViewCert(cert)}
                        className="p-1.5 rounded-lg border border-surface-border hover:bg-surface text-ink-muted hover:text-primary-600 transition-colors cursor-pointer"
                        title="View Certificate"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDownloadCert(cert)}
                        className="px-2.5 py-1.5 rounded-lg bg-[#0A2540] hover:bg-[#1E3A8A] text-white text-[11px] font-bold flex items-center gap-1 shadow-xs transition-all cursor-pointer"
                        title="Download Certificate PDF"
                      >
                        <Download className="w-3 h-3" />
                        <span>Download</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="py-8 text-center space-y-2">
          <Award className="w-8 h-8 text-ink-muted mx-auto" />
          <p className="text-xs font-bold text-ink">No Certificates Earned Yet</p>
          <p className="text-[11px] text-ink-muted">Participate in workshops and events to earn verifiable certificates.</p>
        </div>
      )}

      <CertificateViewerModal
        certificate={selectedCert}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}
