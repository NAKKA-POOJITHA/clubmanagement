'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEMO_PROFILES, Profile } from './demoData';
import { hashPassword, verifyPassword } from './authCrypto';

export type RoleType = 'student' | 'club_member' | 'club_admin' | 'faculty_coordinator' | 'department_admin' | 'super_admin';

export interface UserAccount {
  id: string;
  email: string;
  collegeId: string;
  passwordHash: string;
  profile: Profile;
  createdAt: string;
}

export interface AuthResult {
  success: boolean;
  error?: string;
  role?: RoleType;
  user?: Profile;
  message?: string;
}

export interface RegisterResult {
  success: boolean;
  error?: string;
  user?: Profile;
  message?: string;
}

interface AuthContextType {
  currentRole: RoleType;
  userProfile: Profile;
  isAuthenticated: boolean;
  switchRole: (role: RoleType) => void;
  login: (emailOrId: string, password?: string, role?: RoleType, customProfile?: Partial<Profile>) => Promise<AuthResult>;
  register: (userData: {
    fullName: string;
    collegeId: string;
    email: string;
    phone: string;
    department: string;
    academicYear: string;
    club: string;
    password?: string;
  }) => Promise<RegisterResult>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SEED_ACCOUNTS: UserAccount[] = [
  // 1. Super Admin Account
  {
    id: 'a0000000-0000-0000-0000-000000000001',
    email: 'admin@pragati.ac.in',
    collegeId: 'ADMIN',
    passwordHash: hashPassword('admin123'),
    profile: {
      ...DEMO_PROFILES.super_admin,
      full_name: 'Bathina Surya Abhilash (Super Admin)',
      email: 'admin@pragati.ac.in',
      role: 'super_admin',
      membership_number: 'ADMIN-01'
    },
    createdAt: '2026-09-01T00:00:00.000Z'
  },
  {
    id: 'a0000000-0000-0000-0000-000000000001-alt',
    email: 'poojitha@pragati.ac.in',
    collegeId: '24A31A05JO',
    passwordHash: hashPassword('admin123'),
    profile: {
      ...DEMO_PROFILES.super_admin,
      full_name: 'Nakka Poojitha (Super Admin)',
      email: 'poojitha@pragati.ac.in',
      role: 'super_admin',
      membership_number: '24A31A05JO'
    },
    createdAt: '2026-09-01T00:00:00.000Z'
  },
  // 2. Demo Student Account
  {
    id: 'a0000000-0000-0000-0000-000000000002',
    email: 'student@pragati.ac.in',
    collegeId: '25A31A05ET',
    passwordHash: hashPassword('student123'),
    profile: {
      ...DEMO_PROFILES.student,
      full_name: 'Vasamsetti Jahnavi Devi',
      email: 'student@pragati.ac.in',
      role: 'student',
      membership_number: '25A31A05ET'
    },
    createdAt: '2026-09-01T00:00:00.000Z'
  },
  // 3. Faculty Coordinator Account
  {
    id: 'a0000000-0000-0000-0000-000000000005',
    email: 'faculty@pragati.ac.in',
    collegeId: 'FACULTY01',
    passwordHash: hashPassword('faculty123'),
    profile: {
      ...DEMO_PROFILES.faculty_coordinator,
      full_name: 'Dr. A. Avinash (Faculty Head)',
      email: 'faculty@pragati.ac.in',
      role: 'faculty_coordinator'
    },
    createdAt: '2026-09-01T00:00:00.000Z'
  },
  // 4. Club Admin Account
  {
    id: 'a0000000-0000-0000-0000-000000000004',
    email: 'clubadmin@pragati.ac.in',
    collegeId: 'CLUBADMIN01',
    passwordHash: hashPassword('clubadmin123'),
    profile: {
      ...DEMO_PROFILES.club_admin,
      full_name: 'Rasamsetti Jishnu Tej (Club Admin)',
      email: 'clubadmin@pragati.ac.in',
      role: 'club_admin',
      membership_number: '24A31A05IM'
    },
    createdAt: '2026-09-01T00:00:00.000Z'
  },
  {
    id: 'a0000000-0000-0000-0000-000000000004-alt',
    email: 'jishnu@pragati.ac.in',
    collegeId: '24A31A05IM',
    passwordHash: hashPassword('clubadmin123'),
    profile: {
      ...DEMO_PROFILES.club_admin,
      full_name: 'Rasamsetti Jishnu Tej (Club Admin)',
      email: 'jishnu@pragati.ac.in',
      role: 'club_admin',
      membership_number: '24A31A05IM'
    },
    createdAt: '2026-09-01T00:00:00.000Z'
  }
];

function getStoredAccounts(): UserAccount[] {
  if (typeof window === 'undefined') return SEED_ACCOUNTS;
  try {
    const raw = localStorage.getItem('pragati_accounts_registry');
    let accounts: UserAccount[] = [];
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          accounts = parsed;
        }
      } catch {
        accounts = [];
      }
    }

    // Always ensure seed accounts (Super Admin, Faculty, Student, Club Admin) are present
    const combined = [...accounts];
    for (const seed of SEED_ACCOUNTS) {
      const exists = combined.some(
        a =>
          a.email?.toLowerCase() === seed.email.toLowerCase() ||
          a.collegeId?.toUpperCase() === seed.collegeId.toUpperCase() ||
          a.id === seed.id
      );
      if (!exists) {
        combined.push(seed);
      }
    }

    // Save back to localStorage if changes were merged
    if (combined.length !== accounts.length || !raw) {
      localStorage.setItem('pragati_accounts_registry', JSON.stringify(combined));
    }

    return combined;
  } catch (e) {
    return SEED_ACCOUNTS;
  }
}

function saveStoredAccounts(accounts: UserAccount[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('pragati_accounts_registry', JSON.stringify(accounts));
  } catch (e) {
    console.error('Error persisting accounts:', e);
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentRole, setCurrentRole] = useState<RoleType>('student');
  const [userProfile, setUserProfile] = useState<Profile>(DEMO_PROFILES.student);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  // Initialize registry and restore active session
  useEffect(() => {
    try {
      getStoredAccounts();

      const savedAuth = localStorage.getItem('pragati_is_authenticated');
      const savedRole = localStorage.getItem('pragati_user_role') as RoleType;
      const savedProfile = localStorage.getItem('pragati_user_profile');

      if (savedAuth === 'true') {
        setIsAuthenticated(true);
        if (savedProfile) {
          const parsed = JSON.parse(savedProfile);
          setUserProfile(parsed);
          setCurrentRole(parsed.role || savedRole || 'student');
        } else if (savedRole && DEMO_PROFILES[savedRole]) {
          setCurrentRole(savedRole);
          setUserProfile(DEMO_PROFILES[savedRole]);
        }
      }
    } catch (e) {
      console.error('Error loading auth state:', e);
    } finally {
      setMounted(true);
    }
  }, []);

  const switchRole = (role: RoleType) => {
    if (DEMO_PROFILES[role]) {
      const profile = DEMO_PROFILES[role];
      setCurrentRole(role);
      setUserProfile(profile);
      setIsAuthenticated(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('pragati_is_authenticated', 'true');
        localStorage.setItem('pragati_user_role', role);
        localStorage.setItem('pragati_user_profile', JSON.stringify(profile));
      }
    }
  };

  const login = async (
    emailOrId: string,
    password?: string,
    fallbackRole?: RoleType,
    customProfile?: Partial<Profile>
  ): Promise<AuthResult> => {
    const rawId = (emailOrId || '').trim();
    const rawPassword = (password || '').trim();

    if (!rawId) {
      return { success: false, error: 'Please enter your Institutional Email or College ID.' };
    }

    const accounts = getStoredAccounts();
    const lowerQuery = rawId.toLowerCase();
    const upperQuery = rawId.toUpperCase();

    // 1. Direct match by email, college ID, membership number, or name
    let matchedAccount = accounts.find(
      acc =>
        acc.email.toLowerCase() === lowerQuery ||
        acc.collegeId.toUpperCase() === upperQuery ||
        acc.collegeId.toLowerCase() === lowerQuery ||
        acc.profile.membership_number?.toUpperCase() === upperQuery ||
        acc.profile.membership_number?.toLowerCase() === lowerQuery ||
        acc.profile.full_name?.toLowerCase() === lowerQuery
    );

    // 2. Fallback keyword matching for super admin & institutional officers
    if (!matchedAccount) {
      if (
        lowerQuery === 'admin' ||
        lowerQuery === 'superadmin' ||
        lowerQuery.includes('super') ||
        lowerQuery.includes('poojitha') ||
        lowerQuery.includes('admin@pragati')
      ) {
        matchedAccount = accounts.find(a => a.profile.role === 'super_admin') || SEED_ACCOUNTS[0];
      } else if (lowerQuery.includes('faculty') || lowerQuery.includes('avinash')) {
        matchedAccount = accounts.find(a => a.profile.role === 'faculty_coordinator') || SEED_ACCOUNTS[3];
      } else if (lowerQuery.includes('clubadmin') || lowerQuery.includes('jishnu') || lowerQuery.includes('pragsoft.admin')) {
        matchedAccount = accounts.find(a => a.profile.role === 'club_admin') || SEED_ACCOUNTS[4];
      } else if (lowerQuery.includes('student') || lowerQuery.includes('jahnavi')) {
        matchedAccount = accounts.find(a => a.profile.role === 'student') || SEED_ACCOUNTS[2];
      }
    }

    if (!matchedAccount) {
      return {
        success: false,
        error: 'No account found with these credentials. Please register first.'
      };
    }

    // 3. Password Verification
    if (rawPassword) {
      const isPasswordValid = verifyPassword(rawPassword, matchedAccount.passwordHash);
      if (!isPasswordValid) {
        return {
          success: false,
          error: 'Invalid college ID/email or password.'
        };
      }
    }

    // 4. Success — Set Active Session
    const finalRole = fallbackRole || matchedAccount.profile.role || 'student';
    const finalProfile: Profile = {
      ...matchedAccount.profile,
      ...customProfile,
      role: finalRole
    };

    setCurrentRole(finalRole);
    setUserProfile(finalProfile);
    setIsAuthenticated(true);

    if (typeof window !== 'undefined') {
      localStorage.setItem('pragati_is_authenticated', 'true');
      localStorage.setItem('pragati_user_role', finalRole);
      localStorage.setItem('pragati_user_profile', JSON.stringify(finalProfile));
      localStorage.setItem('pragati_current_user_id', matchedAccount.id);
    }

    return {
      success: true,
      role: finalRole,
      user: finalProfile,
      message: 'Login successful.'
    };
  };

  const register = async (userData: {
    fullName: string;
    collegeId: string;
    email: string;
    phone: string;
    department: string;
    academicYear: string;
    club: string;
    password?: string;
  }): Promise<RegisterResult> => {
    const normFullName = (userData.fullName || '').trim();
    const normCollegeId = (userData.collegeId || '').trim().toUpperCase();
    const normEmail = (userData.email || '').trim().toLowerCase();
    const rawPassword = (userData.password || '').trim();

    if (!normFullName) {
      return { success: false, error: 'Please enter your full name.' };
    }
    if (!normCollegeId) {
      return { success: false, error: 'Please enter your College / Student ID.' };
    }
    if (!normEmail || !normEmail.includes('@')) {
      return { success: false, error: 'Please enter a valid institutional email.' };
    }
    if (!rawPassword || rawPassword.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    const accounts = getStoredAccounts();

    // Check if account already exists; if so, update password & credentials cleanly
    const existingIndex = accounts.findIndex(
      acc => acc.email.toLowerCase() === normEmail || acc.collegeId.toUpperCase() === normCollegeId
    );

    const userId = existingIndex >= 0 ? accounts[existingIndex].id : `u_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const newProfile: Profile = {
      id: userId,
      full_name: normFullName,
      email: normEmail,
      role: 'student', // Automatically assigned role: STUDENT
      department: userData.department || 'Computer Science & Engineering',
      academic_year: userData.academicYear || '2nd Year (2025-2029)',
      photo_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      phone: (userData.phone || '').trim() || '+91 9876543210',
      membership_number: normCollegeId,
      points: 100, // Onboarding welcome bonus
    };

    const newAccount: UserAccount = {
      id: userId,
      email: normEmail,
      collegeId: normCollegeId,
      passwordHash: hashPassword(rawPassword),
      profile: newProfile,
      createdAt: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      accounts[existingIndex] = newAccount;
    } else {
      accounts.push(newAccount);
    }

    saveStoredAccounts(accounts);

    // Set as active session
    setCurrentRole('student');
    setUserProfile(newProfile);
    setIsAuthenticated(true);

    if (typeof window !== 'undefined') {
      localStorage.setItem('pragati_is_authenticated', 'true');
      localStorage.setItem('pragati_user_role', 'student');
      localStorage.setItem('pragati_user_profile', JSON.stringify(newProfile));
      localStorage.setItem('pragati_current_user_id', userId);
    }

    return {
      success: true,
      user: newProfile,
      message: 'Registration successful. Your student account has been created.'
    };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentRole('student');
    setUserProfile(DEMO_PROFILES.student);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('pragati_is_authenticated');
      localStorage.removeItem('pragati_user_role');
      localStorage.removeItem('pragati_user_profile');
      localStorage.removeItem('pragati_current_user_id');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentRole,
        userProfile,
        isAuthenticated,
        switchRole,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
