'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { PragatiLogo } from '@/components/PragatiLogo';
import {
  Sparkles,
  LayoutDashboard,
  Calendar,
  CreditCard,
  Trophy,
  BookOpen,
  Wrench,
  FileSpreadsheet,
  QrCode,
  ShieldAlert,
  Settings,
  LogOut,
  Users,
  CheckCircle,
  Image as ImageIcon,
  Layers,
  Globe,
  ArrowUpRight,
  Award,
  Building2,
  UserCheck,
  BarChart2,
  Bell,
  FileText,
  TrendingUp
} from 'lucide-react';

function SidebarNavContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';
  const { currentRole, userProfile, logout } = useAuth();

  const isSuperAdmin = currentRole === 'super_admin';
  const isFaculty = currentRole === 'faculty_coordinator' || isSuperAdmin;
  const isClubAdmin = currentRole === 'club_admin';
  const basePath = `/dashboard/${currentRole.replace('_', '-')}`;

  const studentNav = [
    { label: 'Dashboard', tab: 'overview', href: basePath, icon: LayoutDashboard },
    { label: 'My Profile', tab: 'profile', href: `${basePath}?tab=profile`, icon: Users },
    { label: 'Digital Pass', tab: 'digital-id', href: `${basePath}?tab=digital-id`, icon: CreditCard },
    { label: 'My Clubs', tab: 'clubs', href: `${basePath}?tab=clubs`, icon: Layers },
    { label: 'Events & Registrations', tab: 'events', href: `${basePath}?tab=events`, icon: Calendar },
    { label: 'Attendance', tab: 'attendance', href: `${basePath}?tab=attendance`, icon: QrCode },
    { label: 'Certificates', tab: 'certificates', href: `${basePath}?tab=certificates`, icon: Award },
    { label: 'My Projects', tab: 'projects', href: `${basePath}?tab=projects`, icon: Trophy },
    { label: 'LMS Roadmaps', tab: 'roadmaps', href: `${basePath}?tab=roadmaps`, icon: BookOpen },
    { label: 'Tools Directory', tab: 'tools', href: `${basePath}?tab=tools`, icon: Wrench },
    { label: 'Gallery', tab: 'gallery', href: `${basePath}?tab=gallery`, icon: ImageIcon },
    { label: 'Announcements', tab: 'announcements', href: `${basePath}?tab=announcements`, icon: Sparkles },
    { label: 'Settings', tab: 'settings', href: `${basePath}?tab=settings`, icon: Settings },
  ];

  const clubAdminNav = [
    { label: 'Dashboard', tab: 'overview', href: basePath, icon: LayoutDashboard },
    { label: 'My Club', tab: 'my-club', href: `${basePath}?tab=my-club`, icon: Building2 },
    { label: 'Members', tab: 'members', href: `${basePath}?tab=members`, icon: Users },
    { label: 'Team / Council', tab: 'team', href: `${basePath}?tab=team`, icon: CheckCircle },
    { label: 'Events', tab: 'events', href: `${basePath}?tab=events`, icon: Calendar },
    { label: 'Event Registrations', tab: 'registrations', href: `${basePath}?tab=registrations`, icon: UserCheck },
    { label: 'QR Attendance', tab: 'attendance', href: `${basePath}?tab=attendance`, icon: QrCode },
    { label: 'Certificates', tab: 'certificates', href: `${basePath}?tab=certificates`, icon: Award },
    { label: 'Projects', tab: 'projects', href: `${basePath}?tab=projects`, icon: Trophy },
    { label: 'Announcements', tab: 'announcements', href: `${basePath}?tab=announcements`, icon: Sparkles },
    { label: 'Gallery', tab: 'gallery', href: `${basePath}?tab=gallery`, icon: ImageIcon },
    { label: 'Learning Resources', tab: 'resources', href: `${basePath}?tab=resources`, icon: BookOpen },
    { label: 'Club Analytics', tab: 'analytics', href: `${basePath}?tab=analytics`, icon: BarChart2 },
    { label: 'Club Reports', tab: 'reports', href: `${basePath}?tab=reports`, icon: FileSpreadsheet },
    { label: 'Notifications', tab: 'notifications', href: `${basePath}?tab=notifications`, icon: Bell },
    { label: 'Settings', tab: 'settings', href: `${basePath}?tab=settings`, icon: Settings },
  ];

  const adminNavBase = [
    { label: 'Dashboard', tab: 'overview', href: basePath, icon: LayoutDashboard },
    { label: 'Events & Calendar', tab: 'events', href: `${basePath}?tab=events`, icon: Calendar },
    { label: 'Digital ID Card', tab: 'digital-id', href: `${basePath}?tab=digital-id`, icon: CreditCard },
    { label: 'Projects Showcase', tab: 'projects', href: `${basePath}?tab=projects`, icon: Trophy },
    { label: 'LMS Roadmaps', tab: 'roadmaps', href: `${basePath}?tab=roadmaps`, icon: BookOpen },
    { label: 'Tools Directory', tab: 'tools', href: `${basePath}?tab=tools`, icon: Wrench },
    { label: 'Event Gallery', tab: 'gallery', href: `${basePath}?tab=gallery`, icon: ImageIcon },
    { label: 'Executive Teams', tab: 'teams', href: `${basePath}?tab=teams`, icon: Users },
    { label: '8-Report Center', tab: 'reports', href: `${basePath}?tab=reports`, icon: FileSpreadsheet },
  ];

  let mainNav = adminNavBase;
  if (currentRole === 'student') {
    mainNav = studentNav;
  } else if (currentRole === 'club_admin') {
    mainNav = clubAdminNav;
  }

  const adminNav: { label: string; tab: string; href: string; icon: any }[] = [];
  if (isFaculty) {
    adminNav.push({ label: 'Approvals Queue', tab: 'approvals', href: `${basePath}?tab=approvals`, icon: CheckCircle });
  }
  if (isSuperAdmin) {
    adminNav.push({ label: 'Users & Roles', tab: 'users', href: `${basePath}?tab=users`, icon: Users });
    adminNav.push({ label: 'Audit Logs', tab: 'audit', href: `${basePath}?tab=audit`, icon: ShieldAlert });
  }

  const friends = [
    { name: 'Dr. A. Avinash', role: 'Faculty Coordinator', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
    { name: 'Rohan Deshmukh', role: 'PRAGSOFT Lead', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80' },
    { name: 'Zakir Horizontal', role: 'AR/VR Tech Lead', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80' }
  ];

  return (
    <aside className="w-64 bg-surface border-r border-surface-border flex flex-col justify-between h-screen sticky top-0 px-4 py-6 select-none overflow-y-auto shrink-0">
      <div className="space-y-5">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 px-2">
          <div className="w-9 h-9 rounded-2xl bg-[#0A2540] text-white flex items-center justify-center shadow-md">
            <Sparkles className="w-5 h-5 fill-current text-primary-300" />
          </div>
          <div>
            <span className="font-extrabold text-lg text-ink tracking-tight block leading-tight">Coursue</span>
            <span className="text-[9px] font-bold uppercase tracking-wider text-primary-700">Campus Cloud</span>
          </div>
        </Link>

        {/* View Public Website Link Button */}
        <Link
          href="/"
          className="flex items-center justify-between gap-2 w-full py-2.5 px-3 rounded-2xl bg-primary-50/80 hover:bg-primary-100 text-primary-800 text-xs font-bold border border-primary-200/80 shadow-xs transition-all group"
          title="Go to Public Website without logging out"
        >
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary-600" />
            <span>Public Website</span>
          </div>
          <ArrowUpRight className="w-3.5 h-3.5 text-primary-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>

        {/* Overview Navigation */}
        <div>
          <div className="text-[11px] font-bold text-ink-muted uppercase tracking-wider px-3 mb-1.5">
            Overview & Modules
          </div>
          <nav className="space-y-0.5">
            {mainNav.map((item) => {
              const Icon = item.icon;
              const isActive = (item.tab === 'overview' && (!searchParams.get('tab') || searchParams.get('tab') === 'overview')) ||
                               (item.tab !== 'overview' && activeTab === item.tab);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2 rounded-2xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 shadow-xs font-bold border border-primary-100'
                      : 'text-ink-muted hover:text-ink hover:bg-surface-subtle'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-primary-700' : 'text-ink-muted'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Management / Admin Tools if applicable */}
        {adminNav.length > 0 && (
          <div>
            <div className="text-[11px] font-bold text-primary-700 uppercase tracking-wider px-3 mb-1.5">
              Management & Operations
            </div>
            <nav className="space-y-0.5">
              {adminNav.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.tab;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center gap-3 px-3.5 py-2 rounded-2xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-primary-100 text-primary-800 font-bold border border-primary-200'
                        : 'text-ink-muted hover:text-ink hover:bg-surface-subtle'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-primary-700' : 'text-ink-muted'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}

        {/* Peers & Mentors */}
        <div>
          <div className="text-[11px] font-bold text-ink-muted uppercase tracking-wider px-3 mb-2">
            Peers & Mentors
          </div>
          <div className="space-y-2 px-2">
            {friends.map((friend, idx) => (
              <div key={idx} className="flex items-center gap-2.5 group cursor-pointer">
                <img
                  src={friend.avatar}
                  alt={friend.name}
                  className="w-7 h-7 rounded-full object-cover ring-2 ring-primary-100"
                />
                <div className="truncate">
                  <p className="text-xs font-semibold text-ink group-hover:text-primary-600 transition-colors truncate">
                    {friend.name}
                  </p>
                  <p className="text-[10px] text-ink-muted leading-none">{friend.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Logout */}
      <div className="pt-3 border-t border-surface-border space-y-1">
        <button
          onClick={() => {
            logout();
            if (typeof window !== 'undefined') window.location.href = '/';
          }}
          className="w-full flex items-center gap-3 px-3.5 py-2 rounded-2xl text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors text-left"
        >
          <LogOut className="w-4 h-4 text-red-500" />
          <span>Logout Session</span>
        </button>
      </div>
    </aside>
  );
}

export default function DashboardSidebar() {
  return (
    <Suspense fallback={<div className="w-64 bg-surface border-r border-surface-border h-screen sticky top-0" />}>
      <SidebarNavContent />
    </Suspense>
  );
}
