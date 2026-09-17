'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Sparkles, Download, Palette, Layers, Calendar, MapPin, Users, Check } from 'lucide-react';
import { EventItem } from '@/lib/demoData';

interface EventPosterModalProps {
  event: EventItem;
  isOpen: boolean;
  onClose: () => void;
}

export default function EventPosterModal({ event, isOpen, onClose }: EventPosterModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [theme, setTheme] = useState<'violet' | 'dark' | 'emerald'>('violet');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dimensions: 800 x 1000
    canvas.width = 800;
    canvas.height = 1000;

    // Background Gradient based on theme
    const bgGrad = ctx.createLinearGradient(0, 0, 800, 1000);
    if (theme === 'violet') {
      bgGrad.addColorStop(0, '#7360E8');
      bgGrad.addColorStop(0.5, '#5B48C7');
      bgGrad.addColorStop(1, '#232338');
    } else if (theme === 'dark') {
      bgGrad.addColorStop(0, '#1E1E2E');
      bgGrad.addColorStop(1, '#0F0F17');
    } else {
      bgGrad.addColorStop(0, '#059669');
      bgGrad.addColorStop(1, '#064E3B');
    }
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 800, 1000);

    // Decorative stars / sparkles
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.beginPath();
    ctx.arc(700, 150, 180, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(100, 850, 220, 0, Math.PI * 2);
    ctx.fill();

    // Top Header: College & Club Branding
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px -apple-system, sans-serif';
    ctx.fillText('PRAGATI UNIVERSITY • CSEC COUNCIL', 50, 70);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '14px -apple-system, sans-serif';
    ctx.fillText(event.club_name.toUpperCase(), 50, 95);

    // Pill Badge
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.roundRect(50, 130, 160, 36, 18);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 14px -apple-system, sans-serif';
    ctx.fillText(`★ ${event.event_type.toUpperCase()}`, 70, 153);

    // Event Title (Wrap text)
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 36px -apple-system, sans-serif';
    const words = event.title.split(' ');
    let line = '';
    let y = 230;
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > 700 && n > 0) {
        ctx.fillText(line, 50, y);
        line = words[n] + ' ';
        y += 45;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 50, y);

    // Event Description
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.font = '16px -apple-system, sans-serif';
    ctx.fillText(event.description.slice(0, 120) + '...', 50, y + 45);

    // Details Grid Card Box
    const cardY = y + 90;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.roundRect(50, cardY, 700, 220, 20);
    ctx.fill();
    ctx.stroke();

    // Venue & Date Info inside Card
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 18px -apple-system, sans-serif';
    ctx.fillText('📅 Date & Timing:', 80, cardY + 50);
    ctx.font = '15px -apple-system, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillText(new Date(event.start_time).toLocaleString(), 80, cardY + 80);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 18px -apple-system, sans-serif';
    ctx.fillText('📍 Location / Venue:', 80, cardY + 130);
    ctx.font = '15px -apple-system, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillText(event.venue, 80, cardY + 160);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 18px -apple-system, sans-serif';
    ctx.fillText('👥 Capacity:', 440, cardY + 50);
    ctx.font = '15px -apple-system, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillText(`${event.capacity} Seats (Registration Required)`, 440, cardY + 80);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 18px -apple-system, sans-serif';
    ctx.fillText('🎙️ Speaker / Lead:', 440, cardY + 130);
    ctx.font = '15px -apple-system, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillText(event.speaker || 'Club Technical Board', 440, cardY + 160);

    // Bottom Footer & Call to Action
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 22px -apple-system, sans-serif';
    ctx.fillText('SCAN DIGITAL MEMBERSHIP QR TO REGISTER & ATTEND', 50, 880);

    ctx.font = '14px -apple-system, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillText('Official Circular Issued by Central Technical Clubs Management System • Digitally Signed', 50, 915);
  }, [event, isOpen, theme]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `Poster_${event.title.replace(/\s+/g, '_')}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-surface rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-4 my-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-ink">Automated Poster & Circular Generator</h3>
              <p className="text-xs text-ink-muted">Rendered via dynamic canvas template</p>
            </div>
          </div>
          <button onClick={onClose} className="text-ink-muted hover:text-ink font-bold">✕</button>
        </div>

        {/* Theme Selectors */}
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-ink">Template Theme:</span>
          <button
            onClick={() => setTheme('violet')}
            className={`px-3 py-1 rounded-full text-xs font-semibold ${theme === 'violet' ? 'bg-primary-600 text-white' : 'bg-surface-subtle text-ink'}`}
          >
            Violet Modern
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`px-3 py-1 rounded-full text-xs font-semibold ${theme === 'dark' ? 'bg-ink text-white' : 'bg-surface-subtle text-ink'}`}
          >
            Dark Cyber
          </button>
          <button
            onClick={() => setTheme('emerald')}
            className={`px-3 py-1 rounded-full text-xs font-semibold ${theme === 'emerald' ? 'bg-emerald-600 text-white' : 'bg-surface-subtle text-ink'}`}
          >
            Emerald Innovation
          </button>
        </div>

        {/* Canvas Display */}
        <div className="flex justify-center bg-surface-muted p-3 rounded-2xl border border-surface-border">
          <canvas
            ref={canvasRef}
            className="w-full max-w-sm rounded-xl shadow-lg border border-surface-border"
          />
        </div>

        {/* Download actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleDownload}
            className="flex-1 py-2.5 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Download High-Res Poster (PNG)</span>
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl border border-surface-border text-xs font-bold text-ink hover:bg-surface-subtle"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
