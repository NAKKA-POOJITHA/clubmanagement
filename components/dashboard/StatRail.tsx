'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MoreVertical, Plus, UserPlus, Check, Sparkles } from 'lucide-react';
import { useAuth } from '@/lib/authContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function StatRail() {
  const { currentRole, userProfile } = useAuth();
  const [followed, setFollowed] = useState<Record<string, boolean>>({});

  // Sample weekly activity chart data
  const activityData = [
    { name: '1-10 Aug', hours: 25, active: false },
    { name: '11-20 Aug', hours: 42, active: false },
    { name: '21-30 Aug', hours: 68, active: true },
    { name: '1-10 Sep', hours: 35, active: false },
  ];

  // Mentors / Coordinators list matching screenshot
  const mentors = [
    { id: 'm1', name: 'Padhang Satrio', role: 'UI/UX Mentor', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80' },
    { id: 'm2', name: 'Zakir Horizontal', role: 'Robotics Lead', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80' },
    { id: 'm3', name: 'Leonardo Samsul', role: 'Full-Stack Mentor', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' }
  ];

  const toggleFollow = (id: string) => {
    setFollowed(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Progress percentage
  const progressPercent = currentRole === 'student' ? 78 : 92;

  return (
    <div className="w-full lg:w-80 space-y-5">
      {/* 1. Statistic Card */}
      <div className="coursue-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-ink">Statistic</h3>
          <button className="text-ink-muted hover:text-ink">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>

        {/* Circular Avatar Progress Ring matching screenshot */}
        <div className="flex flex-col items-center text-center pt-2">
          <div className="relative flex items-center justify-center">
            {/* SVG Circular Ring */}
            <svg className="w-28 h-28 transform -rotate-90">
              <circle
                cx="56"
                cy="56"
                r="48"
                stroke="#EFEBFF"
                strokeWidth="6"
                fill="transparent"
              />
              <circle
                cx="56"
                cy="56"
                r="48"
                stroke="#7360E8"
                strokeWidth="6"
                fill="transparent"
                strokeDasharray="301.6"
                strokeDashoffset={301.6 * (1 - progressPercent / 100)}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>

            {/* Avatar inside */}
            <div className="absolute w-20 h-20 rounded-full overflow-hidden p-1 bg-white shadow-sm">
              <img
                src={userProfile.photo_url}
                alt={userProfile.full_name}
                className="w-full h-full rounded-full object-cover"
              />
            </div>

            {/* Percentage Badge */}
            <div className="absolute top-0 right-0 bg-primary-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
              {progressPercent}%
            </div>
          </div>

          <div className="mt-3">
            <h4 className="text-sm font-extrabold text-ink flex items-center justify-center gap-1">
              Good Morning, {userProfile.full_name.split(' ')[0]} 🔥
            </h4>
            <p className="text-[11px] text-ink-muted mt-0.5">
              Continue your activities to earn verification badges!
            </p>
          </div>
        </div>

        {/* Activity Bar Chart */}
        <div className="pt-2">
          <div className="h-28 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#8B8DA8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: '#8B8DA8' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#232338', borderRadius: '12px', color: '#fff', fontSize: '10px' }}
                  cursor={{ fill: '#F8F7FF' }}
                />
                <Bar dataKey="hours" radius={[6, 6, 0, 0]}>
                  {activityData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.active ? '#7360E8' : '#C9BFFC'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 2. Your Mentors / Coordinators Card */}
      <div className="coursue-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-ink">Your Mentors & Leads</h3>
          <button className="w-6 h-6 rounded-full bg-surface-subtle flex items-center justify-center text-ink-muted hover:text-ink">
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Vertical List of Mentors with Follow button */}
        <div className="space-y-3.5">
          {mentors.map((mentor) => (
            <div key={mentor.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={mentor.avatar}
                  alt={mentor.name}
                  className="w-9 h-9 rounded-full object-cover ring-1 ring-primary-100"
                />
                <div>
                  <p className="text-xs font-bold text-ink leading-tight">{mentor.name}</p>
                  <p className="text-[10px] text-ink-muted leading-tight">{mentor.role}</p>
                </div>
              </div>

              <button
                onClick={() => toggleFollow(mentor.id)}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
                  followed[mentor.id]
                    ? 'bg-primary-600 text-white'
                    : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
                }`}
              >
                {followed[mentor.id] ? (
                  <>
                    <Check className="w-3 h-3" />
                    <span>Followed</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3 h-3" />
                    <span>Follow</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Full-width "See All" button matching screenshot */}
        <Link
          href="/clubs"
          className="w-full py-2.5 rounded-2xl bg-primary-50 hover:bg-primary-100 text-primary-700 text-xs font-bold flex items-center justify-center transition-colors"
        >
          See All Mentors
        </Link>
      </div>
    </div>
  );
}
