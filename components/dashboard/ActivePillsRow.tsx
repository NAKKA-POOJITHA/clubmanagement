'use client';

import React from 'react';
import { MoreVertical, Palette, Code2, Cpu, ShieldCheck } from 'lucide-react';

interface ActivePill {
  id: string;
  metric: string;
  label: string;
  iconBg: string;
  iconColor: string;
  icon: any;
}

interface ActivePillsRowProps {
  pills?: ActivePill[];
}

export default function ActivePillsRow({ pills }: ActivePillsRowProps) {
  const defaultPills: ActivePill[] = [
    {
      id: '1',
      metric: '2/8 attended',
      label: 'UI/UX Design',
      iconBg: 'bg-tag-violet',
      iconColor: 'text-primary-600',
      icon: Palette
    },
    {
      id: '2',
      metric: '3/8 completed',
      label: 'Full-Stack Dev',
      iconBg: 'bg-tag-pink',
      iconColor: 'text-pink-600',
      icon: Code2
    },
    {
      id: '3',
      metric: '6/12 active',
      label: 'AI & Robotics',
      iconBg: 'bg-tag-blue',
      iconColor: 'text-blue-600',
      icon: Cpu
    }
  ];

  const items = pills || defaultPills;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 my-5">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.id}
            className="coursue-card-interactive p-3.5 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              {/* Icon with soft pill background */}
              <div className={`w-10 h-10 rounded-2xl ${item.iconBg} ${item.iconColor} flex items-center justify-center shrink-0`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-ink-muted leading-tight">{item.metric}</p>
                <h4 className="text-sm font-bold text-ink leading-snug">{item.label}</h4>
              </div>
            </div>
            <button className="text-ink-muted hover:text-ink p-1 rounded-lg hover:bg-surface-subtle transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
