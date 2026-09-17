import React from 'react';
import Link from 'next/link';
import { Sparkles, ShieldCheck, Heart, Mail, ExternalLink, MapPin, Phone, Globe } from 'lucide-react';
import { PragatiLogo, PathubBadge } from '@/components/PragatiLogo';

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-surface-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="inline-block">
              <PragatiLogo className="h-10" />
            </Link>
            <p className="text-xs text-ink-muted leading-relaxed">
              <strong>Pragati University Centralized Clubs Ecosystem</strong>. Empowered by <strong>PATHUB</strong> & governed by <strong>CSEC</strong>. Managing PRAGSOFT coding competitions, AR/VR lab, Rotaract youth initiatives, digital QR passes, and automated certificates.
            </p>
            <div className="pt-1">
              <PathubBadge />
            </div>
          </div>

          {/* Col 2: Clubs & Councils */}
          <div>
            <h4 className="text-xs font-bold text-ink uppercase tracking-wider mb-3">Clubs & Councils</h4>
            <ul className="space-y-2 text-xs text-ink-muted">
              <li><Link href="/clubs/csec-council" className="hover:text-primary-600 font-bold text-primary-700 transition-colors">👑 CSEC Council (Apex Body)</Link></li>
              <li><Link href="/clubs/pragsoft" className="hover:text-primary-600 transition-colors">💻 PRAGSOFT (Coding Competitions)</Link></li>
              <li><Link href="/clubs/arvr-club" className="hover:text-primary-600 transition-colors">🥽 AR/VR & Metaverse Club</Link></li>
              <li><Link href="/clubs/rotaract" className="hover:text-primary-600 transition-colors">🤝 Rotaract Club of Pragati</Link></li>
            </ul>
          </div>


          {/* Col 3: Student Tools & Academic Resources */}
          <div>
            <h4 className="text-xs font-bold text-ink uppercase tracking-wider mb-3">Student Hub & Tools</h4>
            <ul className="space-y-2 text-xs text-ink-muted">
              <li><Link href="/events" className="hover:text-primary-600 transition-colors">Hackathons & Coding Camps</Link></li>
              <li><Link href="/roadmaps" className="hover:text-primary-600 transition-colors">Interactive LMS Roadmaps & Badges</Link></li>
              <li><Link href="/projects" className="hover:text-primary-600 transition-colors">Student Project Showcase & Leaderboard</Link></li>
              <li><Link href="/tools" className="hover:text-primary-600 transition-colors">Curated Developer Tools Directory</Link></li>
              <li><Link href="/gallery" className="hover:text-primary-600 transition-colors">Campus Activity & Event Highlights</Link></li>
            </ul>
          </div>

          {/* Col 4: Official Pragati Contact & Location */}
          <div>
            <h4 className="text-xs font-bold text-ink uppercase tracking-wider mb-3">Pragati Campus & Contact</h4>
            <div className="space-y-2.5 text-xs text-ink-muted">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-primary-600 shrink-0 mt-0.5" />
                <span>ADB Road, Surampalem, Near Peddapuram, Kakinada District, AP - 533437</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-primary-600 shrink-0" />
                <a href="mailto:csec@pragati.ac.in" className="hover:text-primary-600">csec@pragati.ac.in</a>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-primary-600 shrink-0" />
                <a href="https://pragati.ac.in/" target="_blank" rel="noopener noreferrer" className="text-primary-600 font-semibold hover:underline flex items-center gap-1">
                  Official Website (pragati.ac.in) <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="pt-2 border-t border-surface-border">
                <Link href="/verify/CERT-2026-AI-8891" className="inline-flex items-center gap-1 text-primary-600 font-semibold hover:underline text-[11px]">
                  Public Certificate Verification Portal <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-surface-border mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-muted">
          <p>© 2026 Pragati University — DIGITwinTHON Centralized Clubs Management System. NAAC A+ Accredited.</p>
          <div className="flex items-center gap-4">
            <a href="https://pragati.ac.in/" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 flex items-center gap-1">
              Pragati University Home <ExternalLink className="w-3 h-3" />
            </a>
            <Link href="/about" className="hover:text-primary-600">About Platform</Link>
            <span className="flex items-center gap-1">Crafted with <Heart className="w-3 h-3 text-red-500 fill-current" /> for Student Innovators</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

