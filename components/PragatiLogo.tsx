import React from 'react';
import Image from 'next/image';

export function PragatiLogo({ className = "h-11 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Official Pragati University Logo */}
      <img
        src="/images/pragati_university_logo.png"
        alt="Pragati University Logo"
        className="h-10 sm:h-12 w-auto object-contain drop-shadow-sm hover:scale-[1.02] transition-transform"
      />
    </div>
  );
}

export function PragatiEmblemOnly({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <img
      src="/images/pragati_emblem.png"
      alt="Pragati Emblem"
      className={`${className} object-contain`}
    />
  );
}

export function PathubBadge({ className = "" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-2 p-1 rounded-2xl bg-surface border border-surface-border shadow-xs ${className}`}>
      <img
        src="/images/pathub_accreditation_banner.png"
        alt="PATHUB - NAAC A+ - 25 Years of Excellence"
        className="h-8 sm:h-9 w-auto object-contain"
      />
    </div>
  );
}

