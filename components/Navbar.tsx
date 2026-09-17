'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { PragatiLogo, PathubBadge } from '@/components/PragatiLogo';
import {
  Compass,
  Calendar,
  BookOpen,
  Wrench,
  Trophy,
  ShieldCheck,
  Image as ImageIcon,
  Users,
  Menu,
  X,
  ArrowRight,
  LogIn,
  UserPlus,
  LogOut,
  User
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentRole, userProfile, isAuthenticated, switchRole, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthorizedAdmin = isAuthenticated && ['super_admin', 'department_admin', 'faculty_coordinator', 'club_admin'].includes(currentRole);

  const baseNavLinks = [
    { label: 'Clubs', href: '/clubs', icon: Compass },
    { label: 'Events', href: '/events', icon: Calendar },
    { label: 'Projects', href: '/projects', icon: Trophy },
    { label: 'Roadmaps', href: '/roadmaps', icon: BookOpen },
    { label: 'Tools', href: '/tools', icon: Wrench },
    { label: 'Gallery', href: '/gallery', icon: ImageIcon },
    { label: 'Teams', href: '/teams', icon: Users },
  ];

  const navLinks = isAuthorizedAdmin
    ? [...baseNavLinks, { label: 'Reports', href: '/reports', icon: ShieldCheck }]
    : baseNavLinks;

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-md border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Official Pragati University Logo Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <PragatiLogo className="h-11" />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 font-bold'
                      : 'text-ink-muted hover:text-ink hover:bg-surface-subtle'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-primary-600' : 'text-ink-muted'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Area */}
          <div className="hidden md:flex items-center gap-3">
            <PathubBadge />

            {isAuthenticated ? (
              <>
                {/* Authenticated User Badge */}
                <div className="flex items-center gap-2 bg-surface px-3 py-1.5 rounded-xl border border-surface-border">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-ink">{userProfile.full_name.split(' ')[0]}</span>
                  <span className="text-[10px] font-bold text-primary-700 uppercase bg-primary-50 px-1.5 py-0.5 rounded">
                    {currentRole === 'super_admin' ? 'Super Admin' : currentRole.replace('_', ' ')}
                  </span>
                </div>

                {/* Dashboard CTA */}
                <Link
                  href={`/dashboard/${currentRole.replace('_', '-')}`}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0A2540] hover:bg-[#1E3A8A] text-white text-xs font-bold shadow-sm transition-all hover:scale-105"
                >
                  <span>{isAuthorizedAdmin ? 'Admin Panel' : 'Dashboard'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  title="Logout session"
                  className="p-2 rounded-xl text-ink-muted hover:text-red-600 hover:bg-red-50 border border-surface-border transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              /* Public / Unauthenticated state */
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface hover:bg-primary-50 text-primary-700 border border-primary-200 text-xs font-bold shadow-xs transition-all"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>LOGIN</span>
                </Link>

                <Link
                  href="/register"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0A2540] hover:bg-[#1E3A8A] text-white text-xs font-bold shadow-sm transition-all hover:scale-105"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>REGISTER</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex items-center xl:hidden gap-2">
            {isAuthenticated ? (
              <Link
                href={`/dashboard/${currentRole.replace('_', '-')}`}
                className="px-3 py-1.5 rounded-lg bg-[#0A2540] text-white text-xs font-bold"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-3 py-1.5 rounded-lg bg-primary-600 text-white text-xs font-bold"
              >
                Login
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-ink-muted hover:text-ink hover:bg-surface-subtle"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-b border-surface-border bg-surface px-4 pt-2 pb-4 space-y-2">
          <div className="pb-2 mb-2 border-b border-surface-border">
            <PathubBadge />
          </div>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-ink hover:bg-primary-50"
            >
              <link.icon className="w-4 h-4 text-primary-600" />
              <span>{link.label}</span>
            </Link>
          ))}

          {isAuthenticated ? (
            <div className="pt-2 border-t border-surface-border flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs px-1">
                <span className="font-bold text-ink">{userProfile.full_name}</span>
                <span className="text-[10px] font-bold text-primary-700 uppercase bg-primary-50 px-2 py-0.5 rounded">
                  {currentRole === 'super_admin' ? 'Super Admin' : currentRole.replace('_', ' ')}
                </span>
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 rounded-lg bg-red-50 text-red-600 text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout Session</span>
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-surface-border flex gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 py-2 text-center rounded-lg border border-primary-300 text-primary-700 text-xs font-bold"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 py-2 text-center rounded-lg bg-primary-600 text-white text-xs font-bold"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

