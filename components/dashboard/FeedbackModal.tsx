'use client';

import React, { useState } from 'react';
import { Star, Award, CheckCircle2, Download, Sparkles } from 'lucide-react';
import { useAuth } from '@/lib/authContext';
import { dataService } from '@/lib/dataService';
import { generateCertificatePDF } from '@/lib/pdf';
import confetti from 'canvas-confetti';

interface FeedbackModalProps {
  eventId: string;
  eventTitle: string;
  clubName: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function FeedbackModal({ eventId, eventTitle, clubName, isOpen, onClose }: FeedbackModalProps) {
  const { userProfile } = useAuth();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comments, setComments] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [issuedCert, setIssuedCert] = useState<any>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = dataService.submitFeedback(eventId, userProfile, rating, comments);

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#7360E8', '#5B48C7', '#C9BFFC', '#FDEEF6']
    });

    setSubmitted(true);
    if (result.certificate) {
      setIssuedCert(result.certificate);
    }
  };

  const handleDownloadPDF = () => {
    if (!issuedCert) return;
    generateCertificatePDF({
      studentName: userProfile.full_name,
      eventName: eventTitle,
      clubName: clubName,
      date: new Date().toLocaleDateString(),
      certificateNumber: issuedCert.certificate_number
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-ink">Submit Event Feedback</h3>
                <p className="text-xs text-ink-muted">{eventTitle}</p>
              </div>
              <button type="button" onClick={onClose} className="text-ink-muted hover:text-ink">✕</button>
            </div>

            <div className="p-3 bg-primary-50 rounded-2xl border border-primary-100 flex items-center gap-2.5">
              <Award className="w-5 h-5 text-primary-600 shrink-0" />
              <p className="text-[11px] text-primary-800 leading-tight">
                Feedback completion automatically verifies attendance and generates your verifiable digital certificate!
              </p>
            </div>

            {/* Star Rating */}
            <div className="space-y-1.5 text-center py-2">
              <label className="text-xs font-bold text-ink">Rate this Workshop / Event</label>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform hover:scale-125"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        (hoverRating || rating) >= star
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Comments */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-ink">Key Takeaways & Feedback</label>
              <textarea
                required
                rows={3}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="What did you learn? Any suggestions for future technical sessions?"
                className="w-full text-xs p-3 rounded-xl border border-surface-border bg-surface-muted focus:outline-none focus:border-primary-600"
              />
            </div>

            {/* Submit */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow-sm"
              >
                Submit & Claim Certificate
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-2xl border border-surface-border text-xs font-bold text-ink"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center space-y-4 py-2">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-bold text-ink">Certificate Auto-Issued!</h4>
              <p className="text-xs text-ink-muted max-w-xs mx-auto">
                Thank you for your feedback. Your official participation credential is now verified on the blockchain registry.
              </p>
            </div>

            {issuedCert && (
              <div className="p-3 bg-surface-muted rounded-2xl border border-surface-border text-xs space-y-1">
                <p className="font-mono font-bold text-primary-700">{issuedCert.certificate_number}</p>
                <p className="text-[11px] text-ink-muted">Issued to: {userProfile.full_name}</p>
              </div>
            )}

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={handleDownloadPDF}
                className="w-full py-2.5 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Download Official Certificate PDF</span>
              </button>
              <button
                onClick={onClose}
                className="w-full py-2 rounded-2xl border border-surface-border text-xs font-semibold text-ink hover:bg-surface-subtle"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
