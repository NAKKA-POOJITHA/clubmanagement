'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Mail, Phone, MapPin, Send, CheckCircle2, Sparkles } from 'lucide-react';
import { triggerConfetti } from '@/lib/confetti';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerConfetti({
      particleCount: 80,
      spread: 60,
    });
    setSent(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-muted">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-bold">
            <Mail className="w-3.5 h-3.5" />
            <span>Advisory & Support</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-ink">Contact Technical Club Coordinators</h1>
          <p className="text-xs sm:text-sm text-ink-muted">
            Have questions about club affiliations, hackathon sponsorships, or faculty approvals? Reach out directly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Info Side */}
          <div className="space-y-6">
            <div className="coursue-card p-6 space-y-4">
              <h3 className="text-sm font-bold text-ink">Central Council Office</h3>
              <div className="space-y-3 text-xs text-ink-muted">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
                  <span>Innovation Block C, 4th Floor, Technical Clubs Council Secretariat</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-pink-600 shrink-0" />
                  <span className="font-mono">poojithampc10@gmail.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>+91 98765 43210</span>
                </div>
              </div>
            </div>

            <div className="coursue-card p-6 space-y-3 bg-primary-50 border-primary-200">
              <h4 className="text-xs font-bold text-primary-800">Faculty Coordinator Office Hours</h4>
              <p className="text-xs text-primary-900 leading-relaxed">
                Monday - Friday: 3:30 PM - 5:30 PM<br />
                Turing Computing Center - Room 302
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2 coursue-card p-6 sm:p-8">
            {!sent ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-base font-bold text-ink">Send an Official Inquiry</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-ink">Your Full Name *</label>
                    <input
                      required
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Jason Ranti"
                      className="w-full text-xs p-3 rounded-xl border border-surface-border bg-surface-muted focus:outline-none focus:border-primary-600"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-ink">College Email *</label>
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@college.edu"
                      className="w-full text-xs p-3 rounded-xl border border-surface-border bg-surface-muted focus:outline-none focus:border-primary-600"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-ink">Subject *</label>
                  <input
                    required
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Hackathon Sponsorship / Executive Team Query"
                    className="w-full text-xs p-3 rounded-xl border border-surface-border bg-surface-muted focus:outline-none focus:border-primary-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-ink">Message *</label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter message details..."
                    className="w-full text-xs p-3 rounded-xl border border-surface-border bg-surface-muted focus:outline-none focus:border-primary-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow-glow hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message to Faculty</span>
                </button>
              </form>
            ) : (
              <div className="text-center space-y-4 py-12">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-ink">Message Transmitted!</h3>
                <p className="text-xs text-ink-muted max-w-sm mx-auto">
                  Your communication has been received by the Technical Clubs Council. Faculty coordinators will review your query within 24 hours.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
