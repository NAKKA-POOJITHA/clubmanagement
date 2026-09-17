'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/authContext';
import { Search, Mail, Bell, Check, Sparkles, LogOut } from 'lucide-react';
import { dataService } from '@/lib/dataService';

export default function DashboardTopBar() {
  const { currentRole, userProfile, switchRole, logout } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const announcements = dataService.getAnnouncements();

  return (
    <div className="flex items-center justify-between gap-4 py-4 px-6 bg-surface-muted border-b border-surface-border sticky top-0 z-30">
      {/* Search Input Bar (Pill with subtle background matching screenshot) */}
      <div className="relative flex-1 max-w-xl">
        <Search className="w-4 h-4 text-ink-muted absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search your events, roadmaps, tools, projects..."
          className="w-full bg-surface border border-surface-border rounded-full pl-11 pr-4 py-2.5 text-xs text-ink placeholder:text-ink-muted focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
        />
      </div>

      {/* Right Action Icons & User Avatar */}
      <div className="flex items-center gap-3">
        {/* View Public Website Link Button */}
        <Link
          href="/"
          className="hidden lg:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface border border-primary-200 text-primary-700 hover:bg-primary-50 text-xs font-bold shadow-xs transition-all hover:scale-105"
          title="Return to Public Website (Keep Session Active)"
        >
          <span>🌐 View Public Website</span>
        </Link>


        {/* Inbox Button */}
        <Link
          href="/announcements"
          className="w-9 h-9 rounded-full bg-surface border border-surface-border flex items-center justify-center text-ink-muted hover:text-ink hover:bg-surface-subtle transition-colors relative"
          title="Announcements"
        >
          <Mail className="w-4 h-4" />
        </Link>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 rounded-full bg-surface border border-surface-border flex items-center justify-center text-ink-muted hover:text-ink hover:bg-surface-subtle transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary-600 animate-pulse" />
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-surface border border-surface-border rounded-2xl shadow-float p-3 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 border-b border-surface-border">
                <span className="text-xs font-bold text-ink">Notifications</span>
                <span className="text-[10px] text-primary-600 font-semibold cursor-pointer">Mark all as read</span>
              </div>
              <div className="divide-y divide-surface-border max-h-60 overflow-y-auto mt-2">
                {announcements.map((ann, i) => (
                  <div key={i} className="py-2 px-1 hover:bg-surface-muted rounded-lg transition-colors">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-600"></span>
                      <p className="text-[11px] font-bold text-ink truncate">{ann.title}</p>
                    </div>
                    <p className="text-[10px] text-ink-muted line-clamp-2 mt-0.5">{ann.content}</p>
                    <span className="text-[9px] text-primary-600 font-medium">{ann.club_name} • {ann.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar matching screenshot */}
        <div className="flex items-center gap-2.5 pl-2">
          <img
            src={userProfile.photo_url}
            alt={userProfile.full_name}
            className="w-9 h-9 rounded-full object-cover ring-2 ring-primary-300"
          />
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-ink leading-tight">{userProfile.full_name}</p>
            <p className="text-[10px] text-primary-600 font-semibold capitalize leading-none">
              {userProfile.role.replace('_', ' ')}
            </p>
          </div>

          <button
            onClick={() => {
              logout();
              if (typeof window !== 'undefined') window.location.href = '/';
            }}
            title="Sign out to Public Home"
            className="ml-1 p-2 rounded-full text-ink-muted hover:text-red-600 hover:bg-red-50 transition-colors border border-surface-border"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

