'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { dataService } from '@/lib/dataService';
import { CouncilMember } from '@/lib/demoData';
import {
  Users,
  ShieldCheck,
  Award,
  CheckCircle2,
  Search,
  Mail,
  GraduationCap,
  Sparkles,
  Layers,
  FileSpreadsheet,
  BadgeCheck,
  ChevronRight,
  ExternalLink,
  Code2,
  Heart
} from 'lucide-react';
import Link from 'next/link';

// PRAGSOFT Coding Club Team Roster
const PRAGSOFT_TEAM = [
  {
    sNo: 1,
    rollNo: '23A31A0501',
    name: 'Rohan Deshmukh',
    role: 'President & Lead Architect',
    yearSection: 'IV-A',
    department: 'CSE',
    category: 'Core Leadership',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80',
    email: '23A31A0501@pragati.ac.in',
    status: 'Active'
  },
  {
    sNo: 2,
    rollNo: '23A31A0512',
    name: 'M. Sai Teja',
    role: 'Vice President (DSA & CP Wing)',
    yearSection: 'IV-B',
    department: 'CSE',
    category: 'Competitive Programming',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    email: '23A31A0512@pragati.ac.in',
    status: 'Active'
  },
  {
    sNo: 3,
    rollNo: '24A31A0518',
    name: 'K. Sri Harsha',
    role: 'Competitive Contest Lead (LeetCode Sprint)',
    yearSection: 'III-A',
    department: 'CSE',
    category: 'Algorithms & Problem Solving',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    email: '24A31A0518@pragati.ac.in',
    status: 'Active'
  },
  {
    sNo: 4,
    rollNo: '24A31A1208',
    name: 'P. Divya',
    role: 'Full-Stack Web & Next.js Lead',
    yearSection: 'III-B',
    department: 'IT',
    category: 'Web Engineering',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    email: '24A31A1208@pragati.ac.in',
    status: 'Active'
  },
  {
    sNo: 5,
    rollNo: '24A31A0534',
    name: 'G. Tarun Kumar',
    role: 'Hackathon Operations Coordinator',
    yearSection: 'III-C',
    department: 'CSE',
    category: 'Event Operations',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    email: '24A31A0534@pragati.ac.in',
    status: 'Active'
  },
  {
    sNo: 6,
    rollNo: '25A31A0522',
    name: 'S. Keerthana',
    role: 'Code Reviewer & Junior Contest Lead',
    yearSection: 'II-B',
    department: 'CSE',
    category: 'Mentorship & Review',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    email: '25A31A0522@pragati.ac.in',
    status: 'Active'
  }
];

// AR/VR & Metaverse Club Team Roster
const ARVR_TEAM = [
  {
    sNo: 1,
    rollNo: '24A31A05JO',
    name: 'Nakka Poojitha',
    role: 'President & Spatial Computing Lead',
    yearSection: 'III-F',
    department: 'CSE',
    category: 'Core Leadership',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80',
    email: '24A31A05JO@pragati.ac.in',
    status: 'Active'
  },
  {
    sNo: 2,
    rollNo: '23A31A1215',
    name: 'Ananya Verma',
    role: 'Unity 3D Simulation & Quest SDK Lead',
    yearSection: 'IV-A',
    department: 'IT',
    category: 'Unity Development',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    email: '23A31A1215@pragati.ac.in',
    status: 'Active'
  },
  {
    sNo: 3,
    rollNo: '24A31A0541',
    name: 'Aarav Sharma',
    role: 'Metaverse Campus Digital Twin Lead',
    yearSection: 'III-D',
    department: 'CSE',
    category: 'Digital Twins & Metaverse',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    email: '24A31A0541@pragati.ac.in',
    status: 'Active'
  },
  {
    sNo: 4,
    rollNo: '24A31A0550',
    name: 'V. Rohit',
    role: 'Unreal Engine & Shaders Specialist',
    yearSection: 'III-E',
    department: 'CSE',
    category: 'Unreal Engine Wing',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    email: '24A31A0550@pragati.ac.in',
    status: 'Active'
  },
  {
    sNo: 5,
    rollNo: '25A31A0419',
    name: 'M. Sneha',
    role: '3D Assets & Blender Modeling Lead',
    yearSection: 'II-A',
    department: 'ECE',
    category: '3D Asset Creation',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    email: '25A31A0419@pragati.ac.in',
    status: 'Active'
  },
  {
    sNo: 6,
    rollNo: '25A31A0433',
    name: 'Ch. Naveen',
    role: 'VR Headset & Sensor Hardware Tech',
    yearSection: 'II-C',
    department: 'ECE',
    category: 'Hardware & Sensor Testing',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    email: '25A31A0433@pragati.ac.in',
    status: 'Active'
  }
];

// Rotaract Club Team Roster
const ROTARACT_TEAM = [
  {
    sNo: 1,
    rollNo: '23A31A0401',
    name: 'Karthik Rao',
    role: 'President & Youth Chair',
    yearSection: 'IV-A',
    department: 'ECE',
    category: 'Core Leadership',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    email: '23A31A0401@pragati.ac.in',
    status: 'Active'
  },
  {
    sNo: 2,
    rollNo: '24A31A0562',
    name: 'R. Sushmitha',
    role: 'Vice President & Public Relations',
    yearSection: 'III-B',
    department: 'CSE',
    category: 'Public Relations & Outreach',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    email: '24A31A0562@pragati.ac.in',
    status: 'Active'
  },
  {
    sNo: 3,
    rollNo: '24A31A1220',
    name: 'Vikram Paul',
    role: 'Community Service & BloodBridge Project Lead',
    yearSection: 'III-A',
    department: 'IT',
    category: 'Community Initiatives',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80',
    email: '24A31A1220@pragati.ac.in',
    status: 'Active'
  },
  {
    sNo: 4,
    rollNo: '24A31A0577',
    name: 'Pooja Reddy',
    role: 'Social Impact & Rural Literacy Coordinator',
    yearSection: 'III-C',
    department: 'CSE',
    category: 'Social Impact',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    email: '24A31A0577@pragati.ac.in',
    status: 'Active'
  },
  {
    sNo: 5,
    rollNo: '25A31A0445',
    name: 'N. Akhil',
    role: 'Editorial & Public Speaking Wing Lead',
    yearSection: 'II-B',
    department: 'ECE',
    category: 'Public Speaking & Debate',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    email: '25A31A0445@pragati.ac.in',
    status: 'Active'
  },
  {
    sNo: 6,
    rollNo: '25A31A0589',
    name: 'T. Manisha',
    role: 'Youth Cultural Exchange & Events Secretary',
    yearSection: 'II-D',
    department: 'CSE',
    category: 'Event Operations',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    email: '25A31A0589@pragati.ac.in',
    status: 'Active'
  }
];

export default function TeamManagementPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedClub, setSelectedClub] = useState<'csec' | 'pragsoft' | 'arvr' | 'rotaract'>('csec');

  const csecRoster = dataService.getCsecCouncilRoster();

  const clubTabs = [
    {
      id: 'csec' as const,
      name: 'Computer Science Executive Council (CSEC)',
      shortName: '👑 CSEC Council (24 Officers)',
      logo: '/images/csec_council_logo.png',
      isImage: true,
      category: 'Apex Body',
      facultyName: 'Dr. A. Avinash',
      facultyTitle: 'Apex Faculty Coordinator — Computer Science Executive Council (CSEC)',
      facultyDept: 'Department of Computer Science & Engineering',
      facultyBio: 'Supervising 24 Student Executive Officers, inter-club event funding sanctions, and institutional compliance.',
      facultyPhoto: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
      officersCount: 24,
      tag: 'Apex Council'
    },
    {
      id: 'pragsoft' as const,
      name: 'PRAGSOFT — Premier Technical Coding Club',
      shortName: '💻 PRAGSOFT Coding Club',
      logo: '/images/pragsoft_logo.png',
      isImage: true,
      category: 'Technical',
      facultyName: 'Dr. Rajeshwari Kulkarni & Dr. A. Avinash (CSEC)',
      facultyTitle: 'Faculty Advisors — PRAGSOFT Coding Club',
      facultyDept: 'Department of Computer Science & Engineering',
      facultyBio: 'Guiding 24-hour hackathons, algorithmic coding competitions, competitive programming camps, and LeetCode masterclasses.',
      facultyPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      officersCount: PRAGSOFT_TEAM.length,
      tag: 'Flagship Coding'
    },
    {
      id: 'arvr' as const,
      name: 'AR/VR & Metaverse Club',
      shortName: '🥽 AR/VR & Metaverse Club',
      logo: '🥽',
      isImage: false,
      category: 'Technical',
      facultyName: 'Dr. K. Venkata Rao & Dr. A. Avinash (CSEC)',
      facultyTitle: 'Faculty Advisors — Spatial Computing & Metaverse Lab',
      facultyDept: 'Department of Computer Science & Engineering',
      facultyBio: 'Overseeing Unity 3D simulations, Meta Quest VR standalone deployments, and the official 1:1 Pragati University Virtual Campus tour.',
      facultyPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      officersCount: ARVR_TEAM.length,
      tag: 'Spatial Tech'
    },
    {
      id: 'rotaract' as const,
      name: 'Rotaract Club of Pragati Surampalem Central',
      shortName: '🤝 Rotaract Club of Pragati',
      logo: '/images/rotaract_logo.png',
      isImage: true,
      category: 'Non-Technical',
      facultyName: 'Mr. Y. Manas Kumar',
      facultyTitle: 'Faculty Coordinator — Rotaract Club of Pragati',
      facultyDept: 'Faculty Advisor & Social Impact Officer',
      facultyBio: 'Fostering youth leadership, public speaking, community health initiatives, BloodBridge emergency donor matrix, and rural outreach.',
      facultyPhoto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      officersCount: ROTARACT_TEAM.length,
      tag: 'Social Impact'
    }
  ];

  const currentClubInfo = clubTabs.find(c => c.id === selectedClub)!;

  // Active roster based on selected club
  const activeRoster =
    selectedClub === 'csec'
      ? csecRoster
      : selectedClub === 'pragsoft'
      ? PRAGSOFT_TEAM
      : selectedClub === 'arvr'
      ? ARVR_TEAM
      : ROTARACT_TEAM;

  const csecCategories = [
    { id: 'all', label: 'All Officers (24)' },
    { id: 'Core Leadership', label: 'Core Leadership (6)' },
    { id: 'Technical Wing', label: 'Technical Wing (5)' },
    { id: 'Media & Design', label: 'Media & Design (4)' },
    { id: 'Event Operations', label: 'Event Operations (5)' },
    { id: 'Documentation & Records', label: 'Documentation & Records (4)' }
  ];

  const filteredMembers = activeRoster.filter(m => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.rollNo.toLowerCase().includes(search.toLowerCase()) ||
      m.role.toLowerCase().includes(search.toLowerCase()) ||
      m.yearSection.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedClub !== 'csec' ||
      selectedCategory === 'all' ||
      (m as CouncilMember).category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col bg-surface-muted">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tag-violet text-primary-700 text-xs font-bold shadow-sm">
              <Users className="w-3.5 h-3.5" />
              <span>Official Governance & Executive Tenures (2026-2027)</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0A2540] tracking-tight">
              Executive Council & Club Officers Roster
            </h1>
            <p className="text-xs sm:text-sm text-ink-muted max-w-3xl">
              Organized club-by-club: View verified student executive boards, faculty coordinators, and operational leadership across Pragati University.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/faculty-coordinator"
              className="px-5 py-2.5 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Faculty Approvals Queue</span>
            </Link>
          </div>
        </div>

        {/* PROMINENT FACULTY COORDINATOR BANNER (DYNAMIC PER CLUB) */}
        <div className="coursue-card p-6 sm:p-8 bg-gradient-to-br from-primary-900 via-primary-800 to-[#0A2540] text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative">
                <img
                  src={currentClubInfo.facultyPhoto}
                  alt={currentClubInfo.facultyName}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-white/20 shadow-lg"
                />
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1 rounded-full shadow">
                  <BadgeCheck className="w-4 h-4" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold text-amber-300">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{currentClubInfo.tag} Faculty Head</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  {currentClubInfo.facultyName}
                </h2>
                <p className="text-xs text-primary-200 font-semibold">
                  {currentClubInfo.facultyTitle}
                </p>
                <p className="text-[11px] text-white/80 max-w-xl">
                  {currentClubInfo.facultyDept} • {currentClubInfo.facultyBio}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-2.5 shrink-0">
              <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 text-center min-w-[120px]">
                <p className="text-xl font-black text-amber-300">{currentClubInfo.officersCount}</p>
                <p className="text-[10px] text-white/80 uppercase font-bold">Executive Officers</p>
              </div>
              <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 text-center min-w-[120px]">
                <p className="text-xl font-black text-emerald-300">100%</p>
                <p className="text-[10px] text-white/80 uppercase font-bold">Sanctioned & Active</p>
              </div>
            </div>
          </div>
        </div>

        {/* CLUB-BY-CLUB ORGANIZED TABS (User Request) */}
        <div className="flex items-center gap-2 overflow-x-auto border-b border-surface-border pb-3">
          {clubTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setSelectedClub(tab.id);
                setSelectedCategory('all');
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                selectedClub === tab.id
                  ? 'bg-primary-600 text-white shadow-md ring-2 ring-primary-300'
                  : 'bg-surface border border-surface-border text-ink-muted hover:text-ink hover:bg-surface-subtle'
              }`}
            >
              {tab.isImage ? (
                <img src={tab.logo} alt={tab.name} className="w-4 h-4 object-contain rounded-md" />
              ) : (
                <span className="text-sm">{tab.logo}</span>
              )}
              <span>{tab.shortName}</span>
            </button>
          ))}
        </div>

        {/* Active Club Team Area */}
        <div className="space-y-6">
          {/* Search and (if CSEC) Category Filters */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Search Bar */}
            <div className="relative w-full lg:w-96">
              <Search className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Search ${currentClubInfo.name} officers by name, roll no, section, or role...`}
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-surface border border-surface-border rounded-2xl focus:outline-none focus:border-primary-600 shadow-sm"
              />
            </div>

            {/* Committee Category Pills (Only for CSEC 24-member council) */}
            {selectedClub === 'csec' && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0">
                {csecCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-primary-600 text-white shadow-sm'
                        : 'bg-surface border border-surface-border text-ink-muted hover:text-ink'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Results Count Banner */}
          <div className="flex items-center justify-between text-xs text-ink-muted px-1">
            <span>
              Showing <strong>{filteredMembers.length}</strong> of <strong>{currentClubInfo.officersCount}</strong> officers in <strong>{currentClubInfo.name}</strong>
            </span>
            <span className="font-semibold text-primary-700">
              Tenure: 2026-2027 Academic Year
            </span>
          </div>

          {/* TEAM ROSTER GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredMembers.map((member) => (
              <div
                key={member.rollNo}
                className="coursue-card p-5 flex flex-col justify-between space-y-4 shadow-card hover:shadow-card-hover transition-all group border-surface-border"
              >
                <div className="space-y-3.5">
                  {/* Top Row: S.No & Section Badge & Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-6 h-6 rounded-lg bg-primary-100 text-primary-800 font-mono text-[11px] font-bold flex items-center justify-center">
                        #{member.sNo}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-tag-blue text-primary-700 font-mono">
                        Sec: {member.yearSection}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{member.status}</span>
                    </span>
                  </div>

                  {/* Member Info */}
                  <div className="flex items-start gap-3.5">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl object-cover ring-2 ring-primary-200 group-hover:scale-105 transition-transform shrink-0"
                    />
                    <div className="space-y-0.5 min-w-0">
                      <h3 className="text-sm sm:text-base font-bold text-ink truncate group-hover:text-primary-600 transition-colors">
                        {member.name}
                      </h3>
                      <p className="text-xs font-black text-primary-700 leading-tight">
                        {member.role}
                      </p>
                      <p className="text-[10px] font-mono text-ink-muted tracking-wide pt-0.5">
                        Roll: <span className="font-bold text-ink">{member.rollNo}</span>
                      </p>
                    </div>
                  </div>

                  {/* Details Box */}
                  <div className="p-3 bg-surface-muted rounded-xl border border-surface-border text-xs space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-ink-muted">Wing / Focus:</span>
                      <span className="font-bold text-primary-700 truncate max-w-[170px]">{member.category}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-ink-muted">Department:</span>
                      <span className="text-ink font-medium">{member.department}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-ink-muted">Faculty Head:</span>
                      <span className="text-emerald-700 font-semibold truncate max-w-[170px]">
                        {selectedClub === 'rotaract' ? 'Mr. Y. Manas Kumar' : 'Dr. A. Avinash'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Footer: Institutional Email */}
                <div className="pt-2.5 border-t border-surface-border flex items-center justify-between text-[11px] text-ink-muted">
                  <span className="flex items-center gap-1 font-mono text-[10px] truncate max-w-[200px]">
                    <Mail className="w-3 h-3 text-primary-600 shrink-0" />
                    <span>{member.email}</span>
                  </span>
                  <span className="text-primary-600 font-bold text-[10px]">
                    Active
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
