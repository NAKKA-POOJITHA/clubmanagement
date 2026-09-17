'use client';

import React, { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/authContext';
import { dataService, useCentralDataSync } from '@/lib/dataService';
import { Club, EventItem, ProjectItem, CertificateRecord, CouncilMember } from '@/lib/demoData';
import {
  Building2,
  Users,
  Calendar,
  UserCheck,
  QrCode,
  Award,
  Trophy,
  Sparkles,
  Image as ImageIcon,
  BookOpen,
  BarChart2,
  FileSpreadsheet,
  Bell,
  Settings,
  PlusCircle,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Download,
  Trash2,
  Edit,
  ShieldCheck,
  Clock,
  MapPin,
  Mail,
  Phone,
  Globe,
  Share2,
  FileText,
  UserPlus,
  Eye,
  X,
  TrendingUp,
  Layers,
  Upload,
  Camera,
  FolderOpen,
  Check
} from 'lucide-react';
import QrScannerModal from '@/components/dashboard/QrScannerModal';
import EventPosterModal from '@/components/dashboard/EventPosterModal';
import AdminProjectsManagement from '@/components/dashboard/modules/AdminProjectsManagement';

// Mock Members Database for Club Scope
interface ClubMemberRecord {
  id: string;
  name: string;
  collegeId: string;
  department: string;
  year: string;
  status: 'Active' | 'Pending' | 'Alumnus';
  joinedDate: string;
  email: string;
  hasDigitalPass: boolean;
}

const INITIAL_MEMBERS: ClubMemberRecord[] = [
  { id: 'm1', name: 'Vasamsetti Jahnavi Devi', collegeId: '25A31A05ET', department: 'Computer Science & Engineering', year: '2nd Year (2025-2029)', status: 'Active', joinedDate: '2025-08-15', email: '25A31A05ET@pragati.ac.in', hasDigitalPass: true },
  { id: 'm2', name: 'Bathina Surya Abhilash', collegeId: '24A31A05KF', department: 'Computer Science & Engineering', year: '3rd Year (2024-2028)', status: 'Active', joinedDate: '2024-08-10', email: '24A31A05KF@pragati.ac.in', hasDigitalPass: true },
  { id: 'm3', name: 'Nakka Poojitha', collegeId: '24A31A05JO', department: 'Computer Science & Engineering', year: '3rd Year (2024-2028)', status: 'Active', joinedDate: '2024-08-12', email: '24A31A05JO@pragati.ac.in', hasDigitalPass: true },
  { id: 'm4', name: 'Anitha Muddurthi', collegeId: '24A31A05A1', department: 'Information Technology', year: '3rd Year (2024-2028)', status: 'Active', joinedDate: '2024-09-01', email: 'anitha.m@pragati.ac.in', hasDigitalPass: true },
  { id: 'm5', name: 'Rahul Kumar Varma', collegeId: '25A31A05B8', department: 'Artificial Intelligence & DS', year: '2nd Year (2025-2029)', status: 'Active', joinedDate: '2025-09-10', email: 'rahul.k@pragati.ac.in', hasDigitalPass: true },
  { id: 'm6', name: 'Priya Sharma', collegeId: '26A31A05C4', department: 'Computer Science & Engineering', year: '1st Year (2026-2030)', status: 'Pending', joinedDate: '2026-09-14', email: 'priya.s@pragati.ac.in', hasDigitalPass: false },
  { id: 'm7', name: 'K. Sai Teja', collegeId: '24A31A05D9', department: 'Electronics & Communication', year: '3rd Year (2024-2028)', status: 'Active', joinedDate: '2024-08-20', email: 'saiteja.k@pragati.ac.in', hasDigitalPass: true },
  { id: 'm8', name: 'M. Divya Sri', collegeId: '25A31A05E2', department: 'Computer Science & Engineering', year: '2nd Year (2025-2029)', status: 'Active', joinedDate: '2025-08-22', email: 'divya.m@pragati.ac.in', hasDigitalPass: true }
];

// Club Executive Council Structure
interface ExecutiveOfficer {
  id: string;
  position: string;
  name: string;
  rollNo: string;
  yearSection: string;
  startDate: string;
  endDate: string;
  avatar: string;
  email: string;
  status: 'Active' | 'Alumni';
}

const INITIAL_COUNCIL: ExecutiveOfficer[] = [
  { id: 'ec1', position: 'President', name: 'Bathina Surya Abhilash', rollNo: '24A31A05KF', yearSection: 'III-F', startDate: '2026-07-01', endDate: '2027-06-30', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80', email: '24A31A05KF@pragati.ac.in', status: 'Active' },
  { id: 'ec2', position: 'Vice President', name: 'Rasamsetti Jishnu Tej', rollNo: '24A31A05IM', yearSection: 'III-E', startDate: '2026-07-01', endDate: '2027-06-30', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80', email: '24A31A05IM@pragati.ac.in', status: 'Active' },
  { id: 'ec3', position: 'Secretary', name: 'Naga Sharmila Patchari', rollNo: '24A31A05EB', yearSection: 'III-E', startDate: '2026-07-01', endDate: '2027-06-30', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80', email: '24A31A05EB@pragati.ac.in', status: 'Active' },
  { id: 'ec4', position: 'Technical Coordinator', name: 'Nakka Poojitha', rollNo: '24A31A05JO', yearSection: 'III-F', startDate: '2026-07-01', endDate: '2027-06-30', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80', email: '24A31A05JO@pragati.ac.in', status: 'Active' },
  { id: 'ec5', position: 'Event Coordinator', name: 'Duggirala Hemanth', rollNo: '25A31A05FC', yearSection: 'II-D', startDate: '2026-07-01', endDate: '2027-06-30', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80', email: '25A31A05FC@pragati.ac.in', status: 'Active' },
  { id: 'ec6', position: 'Media & Design Lead', name: 'Bolisetti Anusha', rollNo: '25A31A05A6', yearSection: 'II-B', startDate: '2026-07-01', endDate: '2027-06-30', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80', email: '25A31A05A6@pragati.ac.in', status: 'Active' }
];

// Campus Presets for Instant Selection
const CAMPUS_GALLERY_PRESETS = [
  {
    title: 'CodeSprint 2026 Live Hackathon & Coding Contest',
    event: 'CodeSprint 2026',
    url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80',
    tag: 'Hackathon'
  },
  {
    title: 'Faculty Evaluation & Project Presentation Stage',
    event: 'Sustainable Ideathon 2026',
    url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80',
    tag: 'Presentation'
  },
  {
    title: 'Hands-on Algorithmic Workshop in Computer Center',
    event: 'Competitive Coding Masterclass',
    url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    tag: 'Lab Session'
  },
  {
    title: 'QUANTATHON 2K26 Quantum Computing Showcase',
    event: 'QUANTATHON 2K26',
    url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80',
    tag: 'Quantum AI'
  },
  {
    title: 'Annual Tech Fest Valedictory & Award Ceremony',
    event: 'Tech Fest 2026',
    url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80',
    tag: 'Valedictory'
  },
  {
    title: 'IoT & Robotics Hardware Prototyping Workshop',
    event: 'IoT Embedded Expo',
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
    tag: 'Hardware'
  }
];

// Club Learning Resources
interface ClubResourceItem {
  id: string;
  title: string;
  topic: string;
  type: 'Notes' | 'Tutorial' | 'Video' | 'Repository';
  url: string;
  duration: string;
}

const INITIAL_RESOURCES: ClubResourceItem[] = [
  { id: 'r1', title: 'Data Structures & Algorithms Master Notes (C++ / Java)', topic: 'Competitive Programming', type: 'Notes', url: 'https://docs.pragsoft.pragati.ac.in/dsa-notes', duration: '45 Pages' },
  { id: 'r2', title: 'Full-Stack Next.js 15 & Docker Deployment Guide', topic: 'Web Development', type: 'Tutorial', url: 'https://github.com/pragsoft/nextjs-starter', duration: '2 Hours Read' },
  { id: 'r3', title: 'Graph Algorithms & Dynamic Programming Deep Dive', topic: 'Advanced Algorithms', type: 'Video', url: 'https://youtube.com/pragsoft-lectures/graphs', duration: '1.5 Hours' },
  { id: 'r4', title: 'PragCode Sandbox Architecture & Container Sandbox Source', topic: 'Systems Engineering', type: 'Repository', url: 'https://github.com/pragsoft/pragcode-ide', duration: 'Open Source' }
];

function ClubAdminContent() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';
  const { userProfile } = useAuth();
  const dataVersion = useCentralDataSync();

  // All Available Clubs for Admin Selector
  const allClubs = dataService.getClubs();
  const [selectedClubSlug, setSelectedClubSlug] = useState<string>('pragsoft');

  const currentClub = allClubs.find(c => c.slug === selectedClubSlug || c.id === selectedClubSlug) || allClubs[1] || allClubs[0];

  // Dynamic Members & Records from Centralized Data Store
  const rawMembers = dataService.getMembersForClub(currentClub.id);
  const members: ClubMemberRecord[] = rawMembers.map(m => ({
    id: m.id,
    name: m.studentName,
    collegeId: m.rollNumber,
    department: m.department,
    year: m.year,
    status: m.status,
    joinedDate: m.joinedDate,
    email: m.studentEmail,
    hasDigitalPass: m.hasDigitalPass
  }));
  const [council, setCouncil] = useState<ExecutiveOfficer[]>(INITIAL_COUNCIL);
  const [resources, setResources] = useState<ClubResourceItem[]>(INITIAL_RESOURCES);
  const events = dataService.getEvents();
  const projects = dataService.getProjects();
  const gallery = dataService.getGallery();
  const certificates = dataService.getCertificatesForClub(currentClub.id);
  const clubStats = dataService.getClubStats(currentClub.id);

  // Search & Filter States
  const [memberSearch, setMemberSearch] = useState('');
  const [memberFilterStatus, setMemberFilterStatus] = useState('All');
  const [selectedEventForReg, setSelectedEventForReg] = useState<string>(events[0]?.id || '');
  const [showScanner, setShowScanner] = useState(false);
  const [showPosterModal, setShowPosterModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [showAddCouncilModal, setShowAddCouncilModal] = useState(false);
  const [showAddResourceModal, setShowAddResourceModal] = useState(false);
  const [showUploadGalleryModal, setShowUploadGalleryModal] = useState(false);
  const [showAnnounceModal, setShowAnnounceModal] = useState(false);

  // New Event Form State
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDesc, setNewEventDesc] = useState('');
  const [newEventType, setNewEventType] = useState<'Workshop' | 'Hackathon' | 'Competition' | 'Seminar'>('Workshop');
  const [newEventVenue, setNewEventVenue] = useState('Pragati Computer Center - Lab 1 & 2');
  const [newEventSpeaker, setNewEventSpeaker] = useState('Lead Technical Problem Setters');
  const [newEventCapacity, setNewEventCapacity] = useState(100);
  const [newEventDate, setNewEventDate] = useState('2026-10-05T10:00');

  // New Member Form State
  const [newMemName, setNewMemName] = useState('');
  const [newMemRoll, setNewMemRoll] = useState('');
  const [newMemDept, setNewMemDept] = useState('Computer Science & Engineering');
  const [newMemYear, setNewMemYear] = useState('2nd Year (2025-2029)');
  const [newMemEmail, setNewMemEmail] = useState('');

  // New Council Member Form State
  const [newCouncilPos, setNewCouncilPos] = useState('Technical Coordinator');
  const [newCouncilName, setNewCouncilName] = useState('');
  const [newCouncilRoll, setNewCouncilRoll] = useState('');
  const [newCouncilYearSec, setNewCouncilYearSec] = useState('III-F');

  // New Resource Form State
  const [newResTitle, setNewResTitle] = useState('');
  const [newResTopic, setNewResTopic] = useState('Web Development');
  const [newResType, setNewResType] = useState<'Notes' | 'Tutorial' | 'Video' | 'Repository'>('Notes');
  const [newResUrl, setNewResUrl] = useState('');
  const [newResDuration, setNewResDuration] = useState('1 Hour');

  // New Announcement Form State
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnContent, setNewAnnContent] = useState('');
  const [newAnnCategory, setNewAnnCategory] = useState<'Notice' | 'Alert' | 'Recruitment' | 'Achievement'>('Notice');

  // New Gallery Photo State
  const [galleryUploadMode, setGalleryUploadMode] = useState<'device' | 'presets' | 'url'>('device');
  const [newGalTitle, setNewGalTitle] = useState('');
  const [newGalEvent, setNewGalEvent] = useState('CodeSprint 2026');
  const [newGalUrl, setNewGalUrl] = useState('');
  const [newGalFilePreview, setNewGalFilePreview] = useState<string | null>(null);
  const [newGalFileName, setNewGalFileName] = useState<string>('');
  const [isDraggingPhoto, setIsDraggingPhoto] = useState(false);

  const handleImageFileSelect = (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, JPEG, WEBP, etc.).');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      alert('Image file size is larger than 8MB. Please select a smaller photo.');
      return;
    }

    setNewGalFileName(file.name);
    if (!newGalTitle) {
      const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      setNewGalTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const resultStr = event.target?.result as string;
      setNewGalFilePreview(resultStr);
      setNewGalUrl(resultStr);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPresetPhoto = (preset: typeof CAMPUS_GALLERY_PRESETS[0]) => {
    setNewGalUrl(preset.url);
    setNewGalFilePreview(preset.url);
    setNewGalTitle(preset.title);
    setNewGalEvent(preset.event);
    setNewGalFileName(preset.tag);
  };

  // Real-time Attendance Stats for Selected Event
  const currentEvent = events.find(e => e.id === selectedEventForReg) || events[0];
  const currentEventAttendance = currentEvent ? dataService.getAttendanceStats(currentEvent.id) : { registered: 0, attended: 0, absent: 0, capacity: 0 };
  const registeredCount = currentEventAttendance.registered;
  const presentCount = currentEventAttendance.attended;
  const absentCount = currentEventAttendance.absent;

  // Club Scoped Events for Attendance
  const clubEvents = events.filter(
    e => e.club_id === currentClub.id ||
         e.club_name.toLowerCase().includes('pragsoft') ||
         e.title.toLowerCase().includes('codesprint') ||
         e.title.toLowerCase().includes('algorithm') ||
         e.title.toLowerCase().includes('next.js') ||
         e.title.toLowerCase().includes('coding')
  ).length > 0 ? events.filter(
    e => e.club_id === currentClub.id ||
         e.club_name.toLowerCase().includes('pragsoft') ||
         e.title.toLowerCase().includes('codesprint') ||
         e.title.toLowerCase().includes('algorithm') ||
         e.title.toLowerCase().includes('next.js') ||
         e.title.toLowerCase().includes('coding')
  ) : events;

  const [selectedAttendanceEventId, setSelectedAttendanceEventId] = useState<string>(clubEvents[0]?.id || '');
  const [showManualRollCallModal, setShowManualRollCallModal] = useState(false);
  const [manualRollSearch, setManualRollSearch] = useState('');
  const [manualCheckinFeedback, setManualCheckinFeedback] = useState<{ success: boolean; message: string; user?: any } | null>(null);

  const selectedAttendanceEvent = clubEvents.find(e => e.id === selectedAttendanceEventId) || null;
  const attendanceStats = selectedAttendanceEvent
    ? dataService.getAttendanceStats(selectedAttendanceEvent.id)
    : { registered: 0, attended: 0, absent: 0, capacity: 0 };

  const filteredManualMembers = members.filter(m => {
    if (!manualRollSearch.trim()) return true;
    const q = manualRollSearch.toLowerCase().trim();
    return m.name.toLowerCase().includes(q) || m.collegeId.toLowerCase().includes(q) || m.department.toLowerCase().includes(q);
  });

  // Handlers
  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemName || !newMemRoll) return;

    dataService.addClubMember(
      currentClub.id,
      {
        userId: `u-${Date.now()}`,
        studentName: newMemName,
        rollNumber: newMemRoll.toUpperCase(),
        department: newMemDept,
        year: newMemYear,
        status: 'Active',
        studentEmail: newMemEmail || `${newMemRoll.toLowerCase()}@pragati.ac.in`,
        role: 'Member',
        hasDigitalPass: true
      },
      userProfile
    );

    setShowAddMemberModal(false);
    setNewMemName('');
    setNewMemRoll('');
    alert(`Member "${newMemName}" added to ${currentClub.name}!`);
  };

  const handleToggleMemberStatus = (id: string) => {
    const mem = rawMembers.find(m => m.id === id);
    if (!mem) return;
    const nextStatus = mem.status === 'Active' ? 'Pending' : 'Active';
    dataService.updateMemberStatus(id, nextStatus, userProfile);
  };

  const handleRemoveMember = (id: string, name: string) => {
    if (confirm(`Remove member "${name}" from ${currentClub.name}?`)) {
      dataService.leaveClub(currentClub.id, { id, full_name: name, email: '' } as any);
    }
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle) return;

    const res = dataService.createEvent({
      club_id: currentClub.id,
      club_name: currentClub.name,
      title: newEventTitle,
      description: newEventDesc || 'Comprehensive hands-on technical workshop with verifiable certificate.',
      event_type: newEventType,
      venue: newEventVenue,
      start_time: new Date(newEventDate).toISOString(),
      end_time: new Date(Date.now() + 6 * 3600000).toISOString(),
      capacity: Number(newEventCapacity),
      eligibility: 'Open to All Enrolled Pragati Students',
      registration_deadline: new Date(Date.now() + 2 * 86400000).toISOString(),
      status: 'published',
      poster_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
      tag_color: 'bg-tag-blue text-primary-700',
      speaker: newEventSpeaker
    }, userProfile?.role || 'club_admin');

    if (res.success && res.event) {
      setShowAddEventModal(false);
      setNewEventTitle('');
      setNewEventDesc('');
      alert(`Event "${res.event.title}" published successfully!`);
    }
  };

  const handleAddCouncil = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouncilName || !newCouncilRoll) return;

    const newOfficer: ExecutiveOfficer = {
      id: `ec-${Date.now()}`,
      position: newCouncilPos,
      name: newCouncilName,
      rollNo: newCouncilRoll.toUpperCase(),
      yearSection: newCouncilYearSec,
      startDate: '2026-07-01',
      endDate: '2027-06-30',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      email: `${newCouncilRoll.toLowerCase()}@pragati.ac.in`,
      status: 'Active'
    };

    setCouncil(prev => [newOfficer, ...prev]);
    dataService.logAction('Appointed Executive Officer', `${newCouncilName} (${newCouncilPos})`, userProfile?.role || 'club_admin');
    setShowAddCouncilModal(false);
    setNewCouncilName('');
    setNewCouncilRoll('');
    alert(`${newCouncilName} appointed as ${newCouncilPos}!`);
  };

  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResTitle) return;

    const newRes: ClubResourceItem = {
      id: `r-${Date.now()}`,
      title: newResTitle,
      topic: newResTopic,
      type: newResType,
      url: newResUrl || 'https://github.com/pragsoft/resources',
      duration: newResDuration
    };

    setResources(prev => [newRes, ...prev]);
    dataService.logAction('Published Learning Resource', newResTitle, userProfile?.role || 'club_admin');
    setShowAddResourceModal(false);
    setNewResTitle('');
    alert(`Resource "${newResTitle}" published to club repository!`);
  };

  const handleAddAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnTitle || !newAnnContent) return;

    dataService.logAction('Broadcasted Club Announcement', newAnnTitle, userProfile?.role || 'club_admin');
    setShowAnnounceModal(false);
    setNewAnnTitle('');
    setNewAnnContent('');
    alert(`Announcement broadcasted to all ${currentClub.name} members!`);
  };

  const handleBatchIssueCertificates = () => {
    if (!currentEvent) return;
    const regs = dataService.getRegistrationsForEvent(currentEvent.id);
    const attendedRegs = regs.filter(r => r.attended || dataService.hasAttended(currentEvent.id, r.userId) || dataService.hasAttended(currentEvent.id, r.studentEmail));
    
    if (attendedRegs.length === 0) {
      dataService.issueCertificate(currentEvent.id, 'all.attendees@pragati.ac.in', 'Batch Event Attendees', userProfile);
    } else {
      attendedRegs.forEach(r => {
        dataService.issueCertificate(currentEvent.id, r.studentEmail, r.studentName, userProfile);
      });
    }
    alert(`Batch Certificates generated and issued for verified attendees of "${currentEvent.title}"!`);
  };

  const handleExportCSV = (reportName: string) => {
    const csvContent = "data:text/csv;charset=utf-8,Student Name,College ID,Department,Academic Year,Status\n" +
      members.map(m => `"${m.name}","${m.collegeId}","${m.department}","${m.year}","${m.status}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${currentClub.slug}_${reportName.toLowerCase().replace(/\s+/g, '_')}_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredMembers = members.filter(m => {
    const q = memberSearch.toLowerCase().trim();
    const matchSearch = !q || m.name.toLowerCase().includes(q) || m.collegeId.toLowerCase().includes(q) || m.department.toLowerCase().includes(q);
    const matchStatus = memberFilterStatus === 'All' || m.status === memberFilterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* 1. TOP HEADER & CLUB IDENTITY BANNER */}
      <div className="coursue-card p-6 bg-gradient-to-r from-primary-900 via-[#0A2540] to-primary-800 text-white relative overflow-hidden shadow-card border border-primary-800">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-primary-200 text-[11px] font-bold tracking-wide uppercase border border-white/10">
                <Building2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Dedicated Club Command Center</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30">
                <CheckCircle2 className="w-3 h-3" />
                <span>Status: {currentClub.status.toUpperCase()}</span>
              </span>
              <span className="text-[11px] text-primary-200 font-mono">
                AY 2026-2027 • NAAC A+
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Welcome, {userProfile.full_name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-primary-100/90 pt-1">
              <div className="flex items-center gap-1.5 font-bold text-white bg-white/10 px-3 py-1 rounded-xl">
                <ShieldCheck className="w-4 h-4 text-primary-300" />
                <span>{currentClub.name}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-primary-300" />
                <span>Faculty Coordinator: <strong>{currentClub.coordinator_name}</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Actions & Club Switcher */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            {allClubs.length > 1 && (
              <div className="bg-white/10 p-1.5 rounded-2xl border border-white/20 flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary-200 pl-2">Club:</span>
                <select
                  value={selectedClubSlug}
                  onChange={(e) => setSelectedClubSlug(e.target.value)}
                  className="bg-[#0A2540] text-white text-xs font-bold py-1.5 px-3 rounded-xl border border-white/20 focus:outline-none cursor-pointer"
                >
                  {allClubs.map((c) => (
                    <option key={c.id} value={c.slug} className="bg-primary-950 text-white">
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={() => setShowAddEventModal(true)}
              className="px-4 py-2.5 rounded-xl bg-white text-primary-900 hover:bg-primary-50 text-xs font-bold flex items-center justify-center gap-2 shadow-float transition-all hover:scale-105 cursor-pointer shrink-0"
            >
              <PlusCircle className="w-4 h-4 text-primary-700" />
              <span>Create Event</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. TAB DISPATCHER */}

      {/* TAB: OVERVIEW / DASHBOARD */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in">
          {/* 6 Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="coursue-card p-4 bg-surface border border-surface-border space-y-1 hover:shadow-md transition-all">
              <span className="text-[11px] font-bold text-ink-muted uppercase">Total Members</span>
              <div className="text-2xl font-black text-ink">{clubStats.total_members}</div>
              <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> {clubStats.active_members} active
              </span>
            </div>

            <div className="coursue-card p-4 bg-surface border border-surface-border space-y-1 hover:shadow-md transition-all">
              <span className="text-[11px] font-bold text-ink-muted uppercase">Active Events</span>
              <div className="text-2xl font-black text-primary-700">{clubStats.total_events}</div>
              <span className="text-[10px] font-semibold text-primary-600">Total hosted</span>
            </div>

            <div className="coursue-card p-4 bg-surface border border-surface-border space-y-1 hover:shadow-md transition-all">
              <span className="text-[11px] font-bold text-ink-muted uppercase">Upcoming</span>
              <div className="text-2xl font-black text-ink">{clubStats.upcoming_events}</div>
              <span className="text-[10px] font-semibold text-amber-600">Open for signups</span>
            </div>

            <div className="coursue-card p-4 bg-surface border border-surface-border space-y-1 hover:shadow-md transition-all">
              <span className="text-[11px] font-bold text-ink-muted uppercase">Projects</span>
              <div className="text-2xl font-black text-ink">{clubStats.total_projects}</div>
              <span className="text-[10px] font-semibold text-emerald-600">{clubStats.pending_review_projects} under review</span>
            </div>

            <div className="coursue-card p-4 bg-surface border border-surface-border space-y-1 hover:shadow-md transition-all">
              <span className="text-[11px] font-bold text-ink-muted uppercase">Certificates</span>
              <div className="text-2xl font-black text-emerald-700">{clubStats.certificates_issued}</div>
              <span className="text-[10px] font-semibold text-emerald-600">Verifiable QR</span>
            </div>

            <div className="coursue-card p-4 bg-surface border border-surface-border space-y-1 hover:shadow-md transition-all">
              <span className="text-[11px] font-bold text-ink-muted uppercase">Engagement</span>
              <div className="text-2xl font-black text-primary-800">{clubStats.turnout_percentage}%</div>
              <span className="text-[10px] font-semibold text-emerald-600">Active turnout</span>
            </div>
          </div>

          {/* Quick Operations Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <button
              onClick={() => setShowScanner(true)}
              className="p-4 rounded-2xl bg-surface border border-primary-200 hover:border-primary-500 shadow-sm flex items-center gap-3 transition-all hover:shadow-glow text-left cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-primary-600 text-white flex items-center justify-center shrink-0">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-ink">Live QR Attendance</h4>
                <p className="text-[10px] text-ink-muted">Scan attendee digital IDs</p>
              </div>
            </button>

            <button
              onClick={() => setShowPosterModal(true)}
              className="p-4 rounded-2xl bg-surface border border-surface-border hover:border-primary-400 shadow-sm flex items-center gap-3 transition-all text-left cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-tag-pink text-pink-700 flex items-center justify-center shrink-0">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-ink">Generate Event Poster</h4>
                <p className="text-[10px] text-ink-muted">Automated circular visual</p>
              </div>
            </button>

            <button
              onClick={() => setShowAddMemberModal(true)}
              className="p-4 rounded-2xl bg-surface border border-surface-border hover:border-primary-400 shadow-sm flex items-center gap-3 transition-all text-left cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-tag-teal text-emerald-700 flex items-center justify-center shrink-0">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-ink">Enroll New Member</h4>
                <p className="text-[10px] text-ink-muted">Register student to club</p>
              </div>
            </button>

            <button
              onClick={() => setShowAnnounceModal(true)}
              className="p-4 rounded-2xl bg-surface border border-surface-border hover:border-primary-400 shadow-sm flex items-center gap-3 transition-all text-left cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-tag-violet text-primary-700 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-ink">Post Announcement</h4>
                <p className="text-[10px] text-ink-muted">Broadcast to all members</p>
              </div>
            </button>
          </div>

          {/* 2-Column Overview Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Upcoming Events */}
            <div className="lg:col-span-2 coursue-card p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-surface-border">
                <div>
                  <h3 className="text-sm font-bold text-ink">Upcoming {currentClub.name} Events</h3>
                  <p className="text-xs text-ink-muted">Track registration capacity & schedule</p>
                </div>
                <Link
                  href="/dashboard/club-admin?tab=events"
                  className="text-xs font-bold text-primary-600 hover:underline flex items-center gap-1"
                >
                  <span>View All</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="space-y-3">
                {events.slice(0, 3).map((event) => (
                  <div key={event.id} className="p-4 rounded-2xl bg-surface-muted border border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary-100 text-primary-800">
                          {event.event_type}
                        </span>
                        <h4 className="text-xs font-bold text-ink">{event.title}</h4>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-ink-muted">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(event.start_time).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {event.venue}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-start sm:self-center">
                      <div className="text-right">
                        <div className="text-xs font-bold text-ink">{event.registered_count} / {event.capacity}</div>
                        <span className="text-[10px] text-ink-muted">Seats Reserved</span>
                      </div>
                      <Link
                        href={`/dashboard/club-admin?tab=registrations&event=${event.id}`}
                        className="p-2 rounded-xl bg-surface border border-surface-border hover:bg-primary-50 text-primary-700 text-xs font-bold transition-colors"
                        title="View Attendees Roster"
                      >
                        <UserCheck className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 1 Col: Recent Activity Feed */}
            <div className="coursue-card p-6 space-y-4">
              <div className="pb-3 border-b border-surface-border">
                <h3 className="text-sm font-bold text-ink">Recent Club Activity</h3>
                <p className="text-xs text-ink-muted">Real-time club stream</p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 flex items-start gap-2.5">
                  <UserPlus className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-emerald-900">12 New Members Enrolled</p>
                    <p className="text-[10px] text-emerald-700">Fall 2026 onboarding drive active</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-primary-50 border border-primary-100 flex items-start gap-2.5">
                  <Trophy className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-primary-900">3 Project Submissions</p>
                    <p className="text-[10px] text-primary-700">Waiting for coordinator review</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 flex items-start gap-2.5">
                  <UserCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-blue-900">68 Event Registrations</p>
                    <p className="text-[10px] text-blue-700">CodeSprint 2026 reaching capacity</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-50 border border-amber-100 flex items-start gap-2.5">
                  <Award className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-amber-900">45 Certificates Verified</p>
                    <p className="text-[10px] text-amber-700">QR credentials delivered to students</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: MY CLUB */}
      {activeTab === 'my-club' && (
        <div className="coursue-card p-6 sm:p-8 space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between pb-4 border-b border-surface-border">
            <div>
              <h2 className="text-lg font-black text-ink">Club Profile & Institutional Governance</h2>
              <p className="text-xs text-ink-muted">Configure club objectives, faculty sponsorship, and public branding.</p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
              Verified Club Entity
            </span>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); alert('Club profile saved successfully!'); }} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-ink mb-1">Official Club Name</label>
                <input
                  type="text"
                  defaultValue={currentClub.name}
                  className="w-full p-2.5 bg-surface-muted border border-surface-border rounded-xl font-bold text-ink focus:outline-none focus:border-primary-600"
                />
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">Faculty Coordinator</label>
                <input
                  type="text"
                  defaultValue={currentClub.coordinator_name}
                  className="w-full p-2.5 bg-surface-muted border border-surface-border rounded-xl font-medium text-ink focus:outline-none focus:border-primary-600"
                />
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">Domain / Category</label>
                <input
                  type="text"
                  defaultValue={currentClub.domain}
                  className="w-full p-2.5 bg-surface-muted border border-surface-border rounded-xl text-ink focus:outline-none focus:border-primary-600"
                />
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">Established Year</label>
                <input
                  type="text"
                  defaultValue={currentClub.established}
                  className="w-full p-2.5 bg-surface-muted border border-surface-border rounded-xl font-mono text-ink focus:outline-none focus:border-primary-600"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-ink mb-1">Comprehensive Description</label>
              <textarea
                rows={3}
                defaultValue={currentClub.description}
                className="w-full p-2.5 bg-surface-muted border border-surface-border rounded-xl text-ink focus:outline-none focus:border-primary-600 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-ink mb-1">Official Contact Email</label>
                <input
                  type="email"
                  defaultValue={`contact.${currentClub.slug}@pragati.ac.in`}
                  className="w-full p-2.5 bg-surface-muted border border-surface-border rounded-xl font-mono text-ink"
                />
              </div>
              <div>
                <label className="block font-bold text-ink mb-1">Room / Workstation Lab</label>
                <input
                  type="text"
                  defaultValue="PATHUB Advanced Lab 204"
                  className="w-full p-2.5 bg-surface-muted border border-surface-border rounded-xl text-ink"
                />
              </div>
              <div>
                <label className="block font-bold text-ink mb-1">GitHub / Code Repository</label>
                <input
                  type="text"
                  defaultValue={`https://github.com/pragati-${currentClub.slug}`}
                  className="w-full p-2.5 bg-surface-muted border border-surface-border rounded-xl font-mono text-ink"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#0A2540] hover:bg-[#1E3A8A] text-white text-xs font-bold rounded-xl shadow-md transition-all hover:scale-105 cursor-pointer"
              >
                Save Club Profile Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB: MEMBERS */}
      {activeTab === 'members' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="coursue-card p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                placeholder={`Search ${currentClub.name} members by name, roll number, or department...`}
                className="w-full pl-10 pr-4 py-2 text-xs bg-surface border border-surface-border rounded-xl focus:outline-none focus:border-primary-600 shadow-sm"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <select
                value={memberFilterStatus}
                onChange={(e) => setMemberFilterStatus(e.target.value)}
                className="py-2 px-3 text-xs bg-surface border border-surface-border rounded-xl font-semibold text-ink"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active Only</option>
                <option value="Pending">Pending Approval</option>
              </select>

              <button
                onClick={() => setShowAddMemberModal(true)}
                className="px-4 py-2 rounded-xl bg-[#0A2540] hover:bg-[#1E3A8A] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm whitespace-nowrap cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Enroll Member</span>
              </button>
            </div>
          </div>

          <div className="coursue-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-surface-muted border-b border-surface-border text-ink-muted font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3.5 px-4">Student Name</th>
                    <th className="py-3.5 px-4">College / Roll ID</th>
                    <th className="py-3.5 px-4">Department & Year</th>
                    <th className="py-3.5 px-4">Joined Date</th>
                    <th className="py-3.5 px-4">Digital Pass</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border bg-surface font-medium">
                  {filteredMembers.map((m) => (
                    <tr key={m.id} className="hover:bg-surface-subtle transition-colors">
                      <td className="py-3.5 px-4 font-bold text-ink">{m.name}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-primary-700">{m.collegeId}</td>
                      <td className="py-3.5 px-4">
                        <div className="text-ink">{m.department}</div>
                        <div className="text-[10px] text-ink-muted">{m.year}</div>
                      </td>
                      <td className="py-3.5 px-4 text-ink-muted">{m.joinedDate}</td>
                      <td className="py-3.5 px-4">
                        {m.hasDigitalPass ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <QrCode className="w-3 h-3" /> QR Active
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          m.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {m.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleToggleMemberStatus(m.id)}
                          className="text-[11px] font-bold text-primary-600 hover:underline cursor-pointer"
                        >
                          {m.status === 'Active' ? 'Deactivate' : 'Approve'}
                        </button>
                        <button
                          onClick={() => handleRemoveMember(m.id, m.name)}
                          className="text-[11px] font-bold text-red-600 hover:underline cursor-pointer"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: TEAM / COUNCIL */}
      {activeTab === 'team' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-surface-border">
            <div>
              <h2 className="text-lg font-black text-ink">{currentClub.name} Executive Council (2026-27)</h2>
              <p className="text-xs text-ink-muted">Official club leadership appointments, tenures, and responsibilities.</p>
            </div>
            <button
              onClick={() => setShowAddCouncilModal(true)}
              className="px-4 py-2 rounded-xl bg-[#0A2540] hover:bg-[#1E3A8A] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Appoint Officer</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {council.map((officer) => (
              <div key={officer.id} className="coursue-card p-5 bg-surface border border-surface-border space-y-3 hover:shadow-md transition-all">
                <div className="flex items-center gap-3">
                  <img
                    src={officer.avatar}
                    alt={officer.name}
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-primary-200"
                  />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary-700 bg-primary-50 px-2 py-0.5 rounded">
                      {officer.position}
                    </span>
                    <h4 className="text-sm font-bold text-ink mt-0.5">{officer.name}</h4>
                    <span className="font-mono text-xs font-bold text-primary-700">{officer.rollNo} • {officer.yearSection}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-surface-border text-[11px] text-ink-muted flex items-center justify-between">
                  <span>Tenure: {officer.startDate} to {officer.endDate}</span>
                  <span className="text-emerald-700 font-bold">Active Tenure</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: EVENTS */}
      {activeTab === 'events' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-surface-border">
            <div>
              <h2 className="text-lg font-black text-ink">{currentClub.name} Events Lifecycle</h2>
              <p className="text-xs text-ink-muted">Create, publish, inspect registrations, and manage workshops.</p>
            </div>
            <button
              onClick={() => setShowAddEventModal(true)}
              className="px-4 py-2 rounded-xl bg-[#0A2540] hover:bg-[#1E3A8A] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Create Event</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((evt) => (
              <div key={evt.id} className="coursue-card p-5 bg-surface border border-surface-border space-y-3 hover:shadow-md transition-all flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary-50 text-primary-700">
                      {evt.event_type}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {evt.status.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-ink">{evt.title}</h3>
                  <p className="text-xs text-ink-muted line-clamp-2">{evt.description}</p>
                </div>

                <div className="pt-3 border-t border-surface-border space-y-2.5 text-xs text-ink-muted">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-primary-600" /> {new Date(evt.start_time).toLocaleDateString()}</span>
                    <span className="font-bold text-ink">{evt.registered_count} / {evt.capacity} Registered</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Link
                      href={`/dashboard/club-admin?tab=registrations&event=${evt.id}`}
                      className="py-2 text-center rounded-xl bg-surface-muted hover:bg-primary-50 text-primary-700 font-bold text-[11px] border border-surface-border"
                    >
                      Registrations
                    </Link>
                    <Link
                      href={`/events/${evt.id}`}
                      className="py-2 text-center rounded-xl bg-[#0A2540] hover:bg-[#1E3A8A] text-white font-bold text-[11px]"
                    >
                      Public Page
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: EVENT REGISTRATIONS */}
      {activeTab === 'registrations' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="coursue-card p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-surface-border">
              <div>
                <h2 className="text-lg font-black text-ink">Event Attendees & Registrations Roster</h2>
                <p className="text-xs text-ink-muted">Filter registrations, check-in status, and certificate generation.</p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedEventForReg}
                  onChange={(e) => setSelectedEventForReg(e.target.value)}
                  className="py-2 px-3 text-xs bg-surface border border-surface-border rounded-xl font-bold text-ink"
                >
                  {events.map((e) => (
                    <option key={e.id} value={e.id}>{e.title}</option>
                  ))}
                </select>

                <button
                  onClick={() => handleExportCSV('Registrations')}
                  className="px-3 py-2 rounded-xl border border-surface-border hover:bg-surface-subtle text-xs font-bold text-ink flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-surface-muted text-ink-muted uppercase font-bold text-[10px]">
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">College ID</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Registration Date</th>
                    <th className="py-3 px-4">Attendance</th>
                    <th className="py-3 px-4 text-right">Certificate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border font-medium">
                  {dataService.getRegistrationsForEvent(selectedEventForReg).length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-ink-muted">
                        No registrations recorded for this event yet.
                      </td>
                    </tr>
                  ) : (
                    dataService.getRegistrationsForEvent(selectedEventForReg).map((r) => (
                      <tr key={r.id} className="hover:bg-surface-subtle transition-colors">
                        <td className="py-3 px-4 font-bold text-ink">{r.studentName}</td>
                        <td className="py-3 px-4 font-mono font-bold text-primary-700">{r.rollNumber}</td>
                        <td className="py-3 px-4 text-ink-muted">{r.department || 'Engineering'}</td>
                        <td className="py-3 px-4 text-ink-muted">{r.registeredAt || '2026-09-15'}</td>
                        <td className="py-3 px-4">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            r.attended ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {r.attended ? 'Present (QR)' : 'Registered'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            r.certificateIssued ? 'bg-primary-100 text-primary-800' : 'bg-surface-muted text-ink-muted'
                          }`}>
                            {r.certificateIssued ? 'Issued' : 'Pending'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: ATTENDANCE (QR) */}
      {activeTab === 'attendance' && (
        <div className="space-y-6 animate-in fade-in">
          {/* 1. SELECT EVENT BAR (Top of Desk) */}
          <div className="coursue-card p-6 bg-surface border border-surface-border space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-surface-border">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-100 text-primary-800 text-[11px] font-bold tracking-wide uppercase mb-1">
                  <QrCode className="w-3.5 h-3.5 text-primary-700" />
                  <span>Live Attendance Control Desk</span>
                </div>
                <h2 className="text-xl font-black text-ink">Select Event to Record Attendance</h2>
                <p className="text-xs text-ink-muted">
                  Choose the active event session before launching the scanner to record attendance records to the correct event ledger.
                </p>
              </div>

              {selectedAttendanceEvent && (
                <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 shrink-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>Live Check-in Active</span>
                </span>
              )}
            </div>

            {/* Event Dropdown Selector */}
            <div className="max-w-xl">
              <label className="block text-xs font-bold text-ink mb-1.5 uppercase tracking-wider">
                Select Event *
              </label>
              <select
                value={selectedAttendanceEventId}
                onChange={(e) => setSelectedAttendanceEventId(e.target.value)}
                className="w-full p-3 bg-surface border-2 border-primary-200 focus:border-primary-600 rounded-2xl text-xs font-bold text-ink focus:outline-none transition-colors cursor-pointer shadow-xs"
              >
                <option value="">-- Please select an event to record attendance --</option>
                {clubEvents.map((evt) => (
                  <option key={evt.id} value={evt.id}>
                    {evt.title} ({evt.event_type}) — {new Date(evt.start_time).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 2. SELECTED EVENT DETAILS & STATS */}
          {selectedAttendanceEvent ? (
            <div className="space-y-6 animate-in fade-in">
              {/* Event Meta Banner */}
              <div className="coursue-card p-5 bg-gradient-to-r from-[#0A2540] via-primary-900 to-primary-800 text-white rounded-3xl space-y-2">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/20 text-white uppercase tracking-wider">
                      Selected Event Session
                    </span>
                    <h3 className="text-base sm:text-lg font-black">{selectedAttendanceEvent.title}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-primary-100/90 pt-0.5">
                      <span>Club: <strong>PRAGSOFT</strong></span>
                      <span>•</span>
                      <span>Date: <strong>{new Date(selectedAttendanceEvent.start_time).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}</strong></span>
                      <span>•</span>
                      <span>Venue: <strong>{selectedAttendanceEvent.venue}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-white/10 text-white border border-white/20">
                      ID: {selectedAttendanceEvent.id}
                    </span>
                  </div>
                </div>
              </div>

              {/* Attendance Counts */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="coursue-card p-6 bg-surface border border-surface-border space-y-2">
                  <span className="text-xs font-bold text-ink-muted uppercase">Registered Students</span>
                  <div className="text-3xl font-black text-ink">{attendanceStats.registered}</div>
                  <span className="text-[11px] text-ink-muted">Confirmed signups for this event</span>
                </div>

                <div className="coursue-card p-6 bg-surface border border-surface-border space-y-2">
                  <span className="text-xs font-bold text-ink-muted uppercase">Present (Verified)</span>
                  <div className="text-3xl font-black text-emerald-600">{attendanceStats.attended}</div>
                  <span className="text-[11px] text-emerald-700 font-semibold">
                    Turnout: {Math.round((attendanceStats.attended / (attendanceStats.registered || 1)) * 100)}%
                  </span>
                </div>

                <div className="coursue-card p-6 bg-surface border border-surface-border space-y-2">
                  <span className="text-xs font-bold text-ink-muted uppercase">Absent / Pending</span>
                  <div className="text-3xl font-black text-red-600">{attendanceStats.absent}</div>
                  <span className="text-[11px] text-red-700 font-semibold">Not checked in yet</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="coursue-card p-6 sm:p-8 space-y-6 text-center">
                <div className="max-w-md mx-auto space-y-2">
                  <h2 className="text-xl font-black text-ink">Ready to Check In Attendees</h2>
                  <p className="text-xs text-ink-muted leading-relaxed">
                    Scan student digital pass QR or search by roll number. The system will strictly verify registration for <strong>&ldquo;{selectedAttendanceEvent.title}&rdquo;</strong> before marking attendance.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => setShowScanner(true)}
                    className="px-6 py-3 rounded-2xl bg-[#0A2540] hover:bg-[#1E3A8A] text-white text-xs font-bold shadow-md flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Launch Camera QR Scanner</span>
                  </button>

                  <button
                    onClick={() => setShowManualRollCallModal(true)}
                    className="px-6 py-3 rounded-2xl bg-surface border border-surface-border hover:bg-surface-subtle text-ink text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-xs"
                  >
                    <UserCheck className="w-4 h-4 text-primary-600" />
                    <span>Manual Roll Call Verification</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* 3. DISABLED STATE WHEN NO EVENT IS SELECTED */
            <div className="coursue-card p-10 text-center space-y-4 border-2 border-dashed border-surface-border bg-surface-muted/50 rounded-3xl">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
                <AlertCircle className="w-7 h-7" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="text-base font-bold text-ink">No Event Selected for Attendance</h3>
                <p className="text-xs text-ink-muted">
                  Please select an event from the dropdown above to open the Live Attendance Control Desk and start scanning student passes.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 opacity-50">
                <button
                  disabled
                  className="px-6 py-3 rounded-2xl bg-slate-300 text-slate-500 text-xs font-bold flex items-center gap-2 cursor-not-allowed"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Launch Camera QR Scanner (Disabled)</span>
                </button>

                <button
                  disabled
                  className="px-6 py-3 rounded-2xl bg-slate-200 text-slate-500 text-xs font-bold flex items-center gap-2 cursor-not-allowed"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Manual Roll Call (Disabled)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB: CERTIFICATES */}
      {activeTab === 'certificates' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="coursue-card p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-surface-border">
              <div>
                <h2 className="text-lg font-black text-ink">{currentClub.name} Certificate Ledger</h2>
                <p className="text-xs text-ink-muted">Generate batch participation and merit certificates for verified attendees.</p>
              </div>

              <button
                onClick={handleBatchIssueCertificates}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <Award className="w-4 h-4" />
                <span>Batch Generate ({presentCount} Attendees)</span>
              </button>
            </div>

            <div className="divide-y divide-surface-border">
              {certificates.map((cert) => (
                <div key={cert.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-ink">{cert.student_name}</h4>
                      <span className="font-mono text-[10px] font-bold text-primary-700 bg-primary-50 px-2 py-0.5 rounded border border-primary-200">
                        {cert.certificate_number}
                      </span>
                    </div>
                    <p className="text-[11px] text-ink-muted">{cert.event_title} • Issued {cert.issue_date}</p>
                  </div>

                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full self-start sm:self-center">
                    ✓ Cryptographically Valid
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: PROJECTS (Full Moderation & Showcase Workflow Scoped to PRAGSOFT) */}
      {activeTab === 'projects' && (
        <AdminProjectsManagement clubScope="PRAGSOFT" />
      )}

      {/* TAB: ANNOUNCEMENTS */}
      {activeTab === 'announcements' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-surface-border">
            <div>
              <h2 className="text-lg font-black text-ink">{currentClub.name} Broadcast Notices</h2>
              <p className="text-xs text-ink-muted">Create notices broadcasted to club member portals and the public website.</p>
            </div>
            <button
              onClick={() => setShowAnnounceModal(true)}
              className="px-4 py-2 rounded-xl bg-[#0A2540] hover:bg-[#1E3A8A] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Create Announcement</span>
            </button>
          </div>

          <div className="space-y-3">
            {dataService.getAnnouncements().map((a) => (
              <div key={a.id} className="coursue-card p-5 bg-surface border border-surface-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-100 text-primary-800">
                    {a.category}
                  </span>
                  <span className="text-[11px] text-ink-muted">{a.date}</span>
                </div>
                <h3 className="text-xs font-bold text-ink">{a.title}</h3>
                <p className="text-xs text-ink-muted leading-relaxed">{a.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: GALLERY */}
      {activeTab === 'gallery' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-surface-border">
            <div>
              <h2 className="text-lg font-black text-ink">{currentClub.name} Media Gallery</h2>
              <p className="text-xs text-ink-muted">Upload and manage official photo archives from workshops and hackathons.</p>
            </div>
            <button
              onClick={() => setShowUploadGalleryModal(true)}
              className="px-4 py-2 rounded-xl bg-[#0A2540] hover:bg-[#1E3A8A] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Upload Photo</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {gallery.map((g) => (
              <div key={g.id} className="coursue-card overflow-hidden group border border-surface-border">
                <div className="h-44 w-full relative overflow-hidden bg-surface-muted">
                  <img
                    src={g.image_url}
                    alt={g.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4 space-y-1 text-xs">
                  <span className="text-[10px] font-bold text-primary-700">{g.event_name}</span>
                  <h4 className="font-bold text-ink line-clamp-1">{g.title}</h4>
                  <p className="text-[10px] text-ink-muted">{g.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: LEARNING RESOURCES */}
      {activeTab === 'resources' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-surface-border">
            <div>
              <h2 className="text-lg font-black text-ink">{currentClub.name} Curated Learning Resources</h2>
              <p className="text-xs text-ink-muted">Publish notes, starter templates, and video tutorials for enrolled students.</p>
            </div>
            <button
              onClick={() => setShowAddResourceModal(true)}
              className="px-4 py-2 rounded-xl bg-[#0A2540] hover:bg-[#1E3A8A] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Resource</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resources.map((res) => (
              <div key={res.id} className="coursue-card p-5 bg-surface border border-surface-border space-y-3 hover:shadow-md transition-all">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary-50 text-primary-700">
                      {res.topic}
                    </span>
                    <h4 className="text-sm font-bold text-ink mt-1">{res.title}</h4>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-tag-blue text-primary-700">
                    {res.type}
                  </span>
                </div>

                <div className="pt-2 border-t border-surface-border flex items-center justify-between text-xs">
                  <span className="text-ink-muted">Duration / Scope: {res.duration}</span>
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 font-bold hover:underline flex items-center gap-1"
                  >
                    <span>Open Resource</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: CLUB ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="coursue-card p-5 bg-surface border border-surface-border space-y-1">
              <span className="text-xs font-bold text-ink-muted uppercase">Attendance Rate</span>
              <div className="text-2xl font-black text-emerald-600">84.2%</div>
              <span className="text-[10px] text-ink-muted">Average workshop turnout</span>
            </div>
            <div className="coursue-card p-5 bg-surface border border-surface-border space-y-1">
              <span className="text-xs font-bold text-ink-muted uppercase">Project Completion</span>
              <div className="text-2xl font-black text-primary-700">91.0%</div>
              <span className="text-[10px] text-ink-muted">Capstone submission rate</span>
            </div>
            <div className="coursue-card p-5 bg-surface border border-surface-border space-y-1">
              <span className="text-xs font-bold text-ink-muted uppercase">Member Growth</span>
              <div className="text-2xl font-black text-ink">+28%</div>
              <span className="text-[10px] text-emerald-600 font-semibold">Semester YoY growth</span>
            </div>
            <div className="coursue-card p-5 bg-surface border border-surface-border space-y-1">
              <span className="text-xs font-bold text-ink-muted uppercase">Satisfaction Index</span>
              <div className="text-2xl font-black text-amber-600">4.9 / 5.0</div>
              <span className="text-[10px] text-ink-muted">Post-event student ratings</span>
            </div>
          </div>

          <div className="coursue-card p-6 space-y-4">
            <h3 className="text-sm font-bold text-ink">Turnout & Participation Trend</h3>
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>CodeSprint 2026</span>
                  <span>112 / 120 (93%)</span>
                </div>
                <div className="w-full h-2.5 bg-surface-muted rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '93%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Collaborative Algorithms Workshop</span>
                  <span>88 / 100 (88%)</span>
                </div>
                <div className="w-full h-2.5 bg-surface-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary-600 rounded-full" style={{ width: '88%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Next.js Full-Stack Masterclass</span>
                  <span>95 / 100 (95%)</span>
                </div>
                <div className="w-full h-2.5 bg-surface-muted rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: '95%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: CLUB REPORTS */}
      {activeTab === 'reports' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="pb-3 border-b border-surface-border">
            <h2 className="text-lg font-black text-ink">{currentClub.name} Report Generator</h2>
            <p className="text-xs text-ink-muted">Generate scoped audit, membership, and activity reports for college records.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: 'Membership Roster Report', desc: 'Full verified member roster with roll numbers & join dates' },
              { title: 'Event Lifecycle Report', desc: 'Workshops, hackathons, speaker details & registered counts' },
              { title: 'QR Attendance Verification Report', desc: 'Detailed physical scan timestamps and check-in percentages' },
              { title: 'Certificates Ledger Report', desc: 'Official cryptographically generated certificate identifiers' },
              { title: 'Project Prototypes Report', desc: 'Showcased student code repositories and ratings' },
              { title: 'Semester Activity Summary Report', desc: 'Comprehensive NAAC A+ accreditation audit compliance summary' }
            ].map((rep, idx) => (
              <div key={idx} className="coursue-card p-5 bg-surface border border-surface-border space-y-3 flex flex-col justify-between">
                <div className="space-y-1">
                  <h3 className="text-xs font-bold text-ink flex items-center gap-1.5">
                    <FileSpreadsheet className="w-4 h-4 text-primary-600" />
                    <span>{rep.title}</span>
                  </h3>
                  <p className="text-[11px] text-ink-muted leading-relaxed">{rep.desc}</p>
                </div>

                <div className="pt-3 border-t border-surface-border flex gap-2">
                  <button
                    onClick={() => handleExportCSV(rep.title)}
                    className="flex-1 py-2 rounded-xl bg-surface-muted hover:bg-primary-50 text-primary-700 text-[11px] font-bold flex items-center justify-center gap-1 border border-surface-border cursor-pointer"
                  >
                    <Download className="w-3 h-3" />
                    <span>CSV / Excel</span>
                  </button>
                  <button
                    onClick={() => alert(`Generated PDF for "${rep.title}"!`)}
                    className="flex-1 py-2 rounded-xl bg-[#0A2540] hover:bg-[#1E3A8A] text-white text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <FileText className="w-3 h-3" />
                    <span>PDF Print</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: NOTIFICATIONS & SETTINGS */}
      {(activeTab === 'notifications' || activeTab === 'settings') && (
        <div className="coursue-card p-6 sm:p-8 space-y-4 animate-in fade-in">
          <h2 className="text-lg font-black text-ink">{currentClub.name} Preferences & Settings</h2>
          <p className="text-xs text-ink-muted">Manage automated notification triggers, member approval rules, and contact emails.</p>
          <div className="p-4 bg-primary-50 rounded-2xl border border-primary-200 text-xs text-primary-900 space-y-2">
            <div className="flex justify-between">
              <span className="font-semibold">Automated Member Onboarding:</span>
              <span className="font-bold text-emerald-700">Instant Verification Enabled</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">QR Pass Generation:</span>
              <span className="font-bold text-emerald-700">Digital Pass Ready</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Institutional Accreditation:</span>
              <span className="font-bold text-primary-800">CSEC & PATHUB Sanctioned</span>
            </div>
          </div>
        </div>
      )}

      {/* MODALS */}

      {/* Modal: Enroll Member */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-md w-full bg-surface rounded-3xl p-6 border border-surface-border shadow-float space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <h3 className="text-sm font-bold text-ink">Enroll Student to {currentClub.name}</h3>
              <button onClick={() => setShowAddMemberModal(false)} className="p-1 text-ink-muted"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleAddMember} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-ink mb-1">Student Full Name *</label>
                <input required type="text" value={newMemName} onChange={(e) => setNewMemName(e.target.value)} placeholder="e.g. Jason Ranti" className="w-full p-2.5 bg-surface border border-surface-border rounded-xl focus:border-primary-600 focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-ink mb-1">College / Roll ID *</label>
                  <input required type="text" value={newMemRoll} onChange={(e) => setNewMemRoll(e.target.value)} placeholder="e.g. 24A31A05KF" className="w-full p-2.5 bg-surface border border-surface-border rounded-xl font-mono focus:border-primary-600 focus:outline-none" />
                </div>
                <div>
                  <label className="block font-bold text-ink mb-1">Academic Year</label>
                  <select value={newMemYear} onChange={(e) => setNewMemYear(e.target.value)} className="w-full p-2.5 bg-surface border border-surface-border rounded-xl focus:border-primary-600 focus:outline-none">
                    <option value="1st Year (2026-2030)">1st Year (2026-2030)</option>
                    <option value="2nd Year (2025-2029)">2nd Year (2025-2029)</option>
                    <option value="3rd Year (2024-2028)">3rd Year (2024-2028)</option>
                    <option value="4th Year (2023-2027)">4th Year (2023-2027)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-bold text-ink mb-1">Department</label>
                <select value={newMemDept} onChange={(e) => setNewMemDept(e.target.value)} className="w-full p-2.5 bg-surface border border-surface-border rounded-xl focus:border-primary-600 focus:outline-none">
                  <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Artificial Intelligence & DS">Artificial Intelligence & DS</option>
                  <option value="Electronics & Communication">Electronics & Communication</option>
                </select>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddMemberModal(false)} className="px-3 py-1.5 text-ink-muted">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#0A2540] text-white rounded-xl font-bold cursor-pointer">Confirm Enrollment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create Event */}
      {showAddEventModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-lg w-full bg-surface rounded-3xl p-6 border border-surface-border shadow-float space-y-4 my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <h3 className="text-sm font-bold text-ink">Publish New Event for {currentClub.name}</h3>
              <button onClick={() => setShowAddEventModal(false)} className="p-1 text-ink-muted"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleAddEvent} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-ink mb-1">Event Title *</label>
                <input required type="text" value={newEventTitle} onChange={(e) => setNewEventTitle(e.target.value)} placeholder="e.g. CodeSprint 2026: Algorithmic Coding Championship" className="w-full p-2.5 bg-surface border border-surface-border rounded-xl focus:border-primary-600 focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-ink mb-1">Event Type</label>
                  <select value={newEventType} onChange={(e) => setNewEventType(e.target.value as any)} className="w-full p-2.5 bg-surface border border-surface-border rounded-xl focus:border-primary-600 focus:outline-none">
                    <option value="Workshop">Workshop</option>
                    <option value="Hackathon">Hackathon</option>
                    <option value="Competition">Competition</option>
                    <option value="Seminar">Seminar</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-ink mb-1">Capacity (Max Seats)</label>
                  <input type="number" value={newEventCapacity} onChange={(e) => setNewEventCapacity(Number(e.target.value))} className="w-full p-2.5 bg-surface border border-surface-border rounded-xl focus:border-primary-600 focus:outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-ink mb-1">Venue Location</label>
                  <input type="text" value={newEventVenue} onChange={(e) => setNewEventVenue(e.target.value)} className="w-full p-2.5 bg-surface border border-surface-border rounded-xl focus:border-primary-600 focus:outline-none" />
                </div>
                <div>
                  <label className="block font-bold text-ink mb-1">Keynote Speaker</label>
                  <input type="text" value={newEventSpeaker} onChange={(e) => setNewEventSpeaker(e.target.value)} className="w-full p-2.5 bg-surface border border-surface-border rounded-xl focus:border-primary-600 focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block font-bold text-ink mb-1">Description & Guidelines</label>
                <textarea rows={3} value={newEventDesc} onChange={(e) => setNewEventDesc(e.target.value)} placeholder="Event objectives, guidelines, and prerequisite setup..." className="w-full p-2.5 bg-surface border border-surface-border rounded-xl focus:border-primary-600 focus:outline-none resize-none" />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddEventModal(false)} className="px-3 py-1.5 text-ink-muted">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#0A2540] text-white rounded-xl font-bold cursor-pointer">Publish Event</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Appoint Council Member */}
      {showAddCouncilModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-md w-full bg-surface rounded-3xl p-6 border border-surface-border shadow-float space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <h3 className="text-sm font-bold text-ink">Appoint Executive Officer</h3>
              <button onClick={() => setShowAddCouncilModal(false)} className="p-1 text-ink-muted"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleAddCouncil} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-ink mb-1">Council Role / Position *</label>
                <select value={newCouncilPos} onChange={(e) => setNewCouncilPos(e.target.value)} className="w-full p-2.5 bg-surface border border-surface-border rounded-xl">
                  <option value="President">President</option>
                  <option value="Vice President">Vice President</option>
                  <option value="Secretary">Secretary</option>
                  <option value="Technical Coordinator">Technical Coordinator</option>
                  <option value="Event Coordinator">Event Coordinator</option>
                  <option value="Media & Design Lead">Media & Design Lead</option>
                  <option value="Documentation Coordinator">Documentation Coordinator</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-ink mb-1">Student Officer Name *</label>
                <input required type="text" value={newCouncilName} onChange={(e) => setNewCouncilName(e.target.value)} placeholder="e.g. Jason Ranti" className="w-full p-2.5 bg-surface border border-surface-border rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-ink mb-1">College / Roll ID *</label>
                  <input required type="text" value={newCouncilRoll} onChange={(e) => setNewCouncilRoll(e.target.value)} placeholder="e.g. 24A31A05KF" className="w-full p-2.5 bg-surface border border-surface-border rounded-xl font-mono" />
                </div>
                <div>
                  <label className="block font-bold text-ink mb-1">Year & Section</label>
                  <input type="text" value={newCouncilYearSec} onChange={(e) => setNewCouncilYearSec(e.target.value)} placeholder="e.g. III-F" className="w-full p-2.5 bg-surface border border-surface-border rounded-xl" />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddCouncilModal(false)} className="px-3 py-1.5 text-ink-muted">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#0A2540] text-white rounded-xl font-bold cursor-pointer">Confirm Appointment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Learning Resource */}
      {showAddResourceModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-md w-full bg-surface rounded-3xl p-6 border border-surface-border shadow-float space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <h3 className="text-sm font-bold text-ink">Publish Learning Resource</h3>
              <button onClick={() => setShowAddResourceModal(false)} className="p-1 text-ink-muted"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleAddResource} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-ink mb-1">Resource Title *</label>
                <input required type="text" value={newResTitle} onChange={(e) => setNewResTitle(e.target.value)} placeholder="e.g. Dynamic Programming Cheat Sheet" className="w-full p-2.5 bg-surface border border-surface-border rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-ink mb-1">Topic Area</label>
                  <input type="text" value={newResTopic} onChange={(e) => setNewResTopic(e.target.value)} className="w-full p-2.5 bg-surface border border-surface-border rounded-xl" />
                </div>
                <div>
                  <label className="block font-bold text-ink mb-1">Resource Type</label>
                  <select value={newResType} onChange={(e) => setNewResType(e.target.value as any)} className="w-full p-2.5 bg-surface border border-surface-border rounded-xl">
                    <option value="Notes">Notes</option>
                    <option value="Tutorial">Tutorial</option>
                    <option value="Video">Video</option>
                    <option value="Repository">Repository</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-bold text-ink mb-1">Resource URL / Link *</label>
                <input required type="text" value={newResUrl} onChange={(e) => setNewResUrl(e.target.value)} placeholder="e.g. https://github.com/pragsoft/notes" className="w-full p-2.5 bg-surface border border-surface-border rounded-xl font-mono" />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddResourceModal(false)} className="px-3 py-1.5 text-ink-muted">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#0A2540] text-white rounded-xl font-bold cursor-pointer">Publish Resource</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Post Announcement */}
      {showAnnounceModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-md w-full bg-surface rounded-3xl p-6 border border-surface-border shadow-float space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <h3 className="text-sm font-bold text-ink">Broadcast Notice to {currentClub.name}</h3>
              <button onClick={() => setShowAnnounceModal(false)} className="p-1 text-ink-muted"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleAddAnnouncement} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-ink mb-1">Announcement Title *</label>
                <input required type="text" value={newAnnTitle} onChange={(e) => setNewAnnTitle(e.target.value)} placeholder="e.g. CodeSprint 2026 Problem Setters Selected" className="w-full p-2.5 bg-surface border border-surface-border rounded-xl" />
              </div>
              <div>
                <label className="block font-bold text-ink mb-1">Category</label>
                <select value={newAnnCategory} onChange={(e) => setNewAnnCategory(e.target.value as any)} className="w-full p-2.5 bg-surface border border-surface-border rounded-xl">
                  <option value="Notice">Notice</option>
                  <option value="Alert">Alert</option>
                  <option value="Achievement">Achievement</option>
                  <option value="Recruitment">Recruitment</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-ink mb-1">Message Content *</label>
                <textarea required rows={3} value={newAnnContent} onChange={(e) => setNewAnnContent(e.target.value)} placeholder="Enter details to be sent to all enrolled club members..." className="w-full p-2.5 bg-surface border border-surface-border rounded-xl resize-none" />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowAnnounceModal(false)} className="px-3 py-1.5 text-ink-muted">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#0A2540] text-white rounded-xl font-bold cursor-pointer">Broadcast Announcement</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Upload Gallery Photo */}
      {showUploadGalleryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-lg w-full bg-surface rounded-3xl p-6 border border-surface-border shadow-float space-y-4 my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-primary-100 text-primary-800 flex items-center justify-center">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-ink">Upload Photo to {currentClub.name} Gallery</h3>
                  <p className="text-[11px] text-ink-muted">Add photos from your device gallery, campus presets, or web links.</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowUploadGalleryModal(false);
                  setNewGalFilePreview(null);
                  setNewGalFileName('');
                }}
                className="p-1.5 text-ink-muted hover:text-ink rounded-lg hover:bg-surface-muted transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Source Switcher Tabs */}
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-surface-muted rounded-2xl border border-surface-border text-xs font-semibold">
              <button
                type="button"
                onClick={() => setGalleryUploadMode('device')}
                className={`py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  galleryUploadMode === 'device'
                    ? 'bg-surface text-ink font-bold shadow-xs border border-surface-border'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                <Upload className="w-3.5 h-3.5 text-primary-600" />
                <span>Device Gallery</span>
              </button>
              <button
                type="button"
                onClick={() => setGalleryUploadMode('presets')}
                className={`py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  galleryUploadMode === 'presets'
                    ? 'bg-surface text-ink font-bold shadow-xs border border-surface-border'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                <Camera className="w-3.5 h-3.5 text-emerald-600" />
                <span>Campus Presets</span>
              </button>
              <button
                type="button"
                onClick={() => setGalleryUploadMode('url')}
                className={`py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  galleryUploadMode === 'url'
                    ? 'bg-surface text-ink font-bold shadow-xs border border-surface-border'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                <span>Web URL</span>
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newGalTitle || !newGalUrl) {
                  alert('Please select or enter an image and photo title.');
                  return;
                }
                dataService.addGalleryItem({
                  title: newGalTitle,
                  club_name: currentClub.name,
                  event_name: newGalEvent || currentEvent?.title || 'Club Event',
                  image_url: newGalUrl,
                  date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                });
                setShowUploadGalleryModal(false);
                setNewGalTitle('');
                setNewGalUrl('');
                setNewGalFilePreview(null);
                setNewGalFileName('');
                alert('Photo successfully published to official club gallery!');
              }}
              className="space-y-3.5 text-xs"
            >
              {/* MODE 1: DEVICE GALLERY UPLOAD */}
              {galleryUploadMode === 'device' && (
                <div className="space-y-2">
                  <label className="block font-bold text-ink">Choose Photo from Device / Gallery *</label>

                  <input
                    type="file"
                    id="club-admin-photo-input"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleImageFileSelect(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                  />

                  {newGalFilePreview ? (
                    <div className="relative rounded-2xl border-2 border-primary-500 overflow-hidden bg-slate-900 group">
                      <img
                        src={newGalFilePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-2">
                        <button
                          type="button"
                          onClick={() => document.getElementById('club-admin-photo-input')?.click()}
                          className="px-3 py-1.5 rounded-xl bg-white text-ink font-bold text-[11px] flex items-center gap-1 shadow-md cursor-pointer hover:bg-slate-100"
                        >
                          <Upload className="w-3.5 h-3.5 text-primary-600" />
                          <span>Change Photo</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setNewGalFilePreview(null);
                            setNewGalUrl('');
                            setNewGalFileName('');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-red-600 text-white font-bold text-[11px] flex items-center gap-1 shadow-md cursor-pointer hover:bg-red-700"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                      <div className="absolute bottom-2 left-2 right-2 bg-black/70 backdrop-blur-xs text-white text-[10px] px-2.5 py-1 rounded-lg flex items-center justify-between">
                        <span className="truncate max-w-[240px]">{newGalFileName || 'Selected from Gallery'}</span>
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <Check className="w-3 h-3" /> Ready
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDraggingPhoto(true);
                      }}
                      onDragLeave={() => setIsDraggingPhoto(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDraggingPhoto(false);
                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                          handleImageFileSelect(e.dataTransfer.files[0]);
                        }
                      }}
                      onClick={() => document.getElementById('club-admin-photo-input')?.click()}
                      className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                        isDraggingPhoto
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-surface-border bg-surface hover:bg-surface-muted/60 hover:border-primary-400'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-2xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-600">
                        <FolderOpen className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-ink text-xs">
                          Click to select from your Gallery or drag photo here
                        </p>
                        <p className="text-[11px] text-ink-muted mt-0.5">
                          Supports PNG, JPG, JPEG, WEBP from your phone or computer
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-[#0A2540] text-white text-[10px] font-bold mt-1">
                        Browse Gallery / Storage
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* MODE 2: CAMPUS PRESETS */}
              {galleryUploadMode === 'presets' && (
                <div className="space-y-2">
                  <label className="block font-bold text-ink">Choose from Campus Event Photo Library</label>
                  <div className="grid grid-cols-3 gap-2 max-h-52 overflow-y-auto pr-1">
                    {CAMPUS_GALLERY_PRESETS.map((preset, idx) => {
                      const isSelected = newGalUrl === preset.url;
                      return (
                        <div
                          key={idx}
                          onClick={() => handleSelectPresetPhoto(preset)}
                          className={`relative aspect-video rounded-xl overflow-hidden cursor-pointer group border-2 transition-all ${
                            isSelected ? 'border-primary-600 ring-2 ring-primary-500/30' : 'border-surface-border hover:border-primary-400'
                          }`}
                        >
                          <img
                            src={preset.url}
                            alt={preset.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <span className="absolute bottom-1 left-1 text-[9px] font-bold bg-black/70 text-white px-1.5 py-0.5 rounded">
                            {preset.tag}
                          </span>
                          {isSelected && (
                            <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary-600 text-white flex items-center justify-center">
                              <Check className="w-2.5 h-2.5" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* MODE 3: URL INPUT */}
              {galleryUploadMode === 'url' && (
                <div className="space-y-2">
                  <label className="block font-bold text-ink">Image Web URL *</label>
                  <input
                    type="url"
                    value={newGalUrl}
                    onChange={(e) => {
                      setNewGalUrl(e.target.value);
                      setNewGalFilePreview(e.target.value);
                    }}
                    placeholder="e.g. https://images.unsplash.com/photo-..."
                    className="w-full p-2.5 bg-surface border border-surface-border rounded-xl font-mono focus:border-primary-600 focus:outline-none"
                  />
                  {newGalUrl && (
                    <div className="rounded-xl overflow-hidden border border-surface-border aspect-video max-h-36 bg-slate-100">
                      <img
                        src={newGalUrl}
                        alt="Preview"
                        onError={(e) => {
                          (e.target as any).src = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80';
                        }}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Form Metadata Fields */}
              <div className="space-y-2.5 pt-1">
                <div>
                  <label className="block font-bold text-ink mb-1">Photo Caption / Title *</label>
                  <input
                    required
                    type="text"
                    value={newGalTitle}
                    onChange={(e) => setNewGalTitle(e.target.value)}
                    placeholder="e.g. CodeSprint 2026 Opening Ceremony"
                    className="w-full p-2.5 bg-surface border border-surface-border rounded-xl focus:border-primary-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-ink mb-1">Associated Event</label>
                  <input
                    type="text"
                    value={newGalEvent}
                    onChange={(e) => setNewGalEvent(e.target.value)}
                    placeholder="e.g. CodeSprint 2026 / Hack-o-Verse"
                    className="w-full p-2.5 bg-surface border border-surface-border rounded-xl focus:border-primary-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-surface-border flex items-center justify-between">
                <div className="text-[11px] text-ink-muted">
                  Club: <strong className="text-ink">{currentClub.name}</strong>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowUploadGalleryModal(false);
                      setNewGalFilePreview(null);
                      setNewGalFileName('');
                    }}
                    className="px-3.5 py-2 text-ink-muted hover:text-ink font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!newGalUrl}
                    className="px-5 py-2 bg-[#0A2540] hover:bg-[#1E3A8A] disabled:opacity-50 text-white rounded-xl font-bold cursor-pointer transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Publish Photo</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Attendance Scanner Modal */}
      {selectedAttendanceEvent && (
        <QrScannerModal
          eventId={selectedAttendanceEvent.id}
          eventTitle={selectedAttendanceEvent.title}
          isOpen={showScanner}
          onClose={() => setShowScanner(false)}
          onScanSuccess={() => {
            // Automatically reactive via useCentralDataSync
          }}
        />
      )}

      {/* Modal: Manual Roll Call Verification */}
      {showManualRollCallModal && selectedAttendanceEvent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-lg w-full bg-surface rounded-3xl p-6 border border-surface-border shadow-float space-y-4 my-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-primary-100 text-primary-800 flex items-center justify-center font-bold">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-ink">Manual Roll Call Verification</h3>
                  <p className="text-[11px] text-ink-muted line-clamp-1">{selectedAttendanceEvent.title}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowManualRollCallModal(false);
                  setManualCheckinFeedback(null);
                }}
                className="p-1 text-ink-muted hover:text-ink cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={manualRollSearch}
                onChange={(e) => setManualRollSearch(e.target.value)}
                placeholder="Search student by Name or College ID (e.g. 24A31A05KF)..."
                className="w-full pl-9 pr-4 py-2.5 bg-surface border border-surface-border rounded-xl text-xs focus:border-primary-600 focus:outline-none"
              />
            </div>

            {/* Feedback Alert */}
            {manualCheckinFeedback && (
              <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                manualCheckinFeedback.success ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-red-50 text-red-900 border border-red-200'
              }`}>
                {manualCheckinFeedback.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />}
                <span className="font-semibold">{manualCheckinFeedback.message}</span>
              </div>
            )}

            {/* Student List */}
            <div className="max-h-60 overflow-y-auto divide-y divide-surface-border border border-surface-border rounded-2xl">
              {filteredManualMembers.map((m) => (
                <div key={m.id} className="p-3 flex items-center justify-between gap-3 text-xs hover:bg-surface-subtle transition-colors">
                  <div>
                    <h4 className="font-bold text-ink">{m.name}</h4>
                    <p className="text-[10px] text-ink-muted font-mono">{m.collegeId} • {m.department}</p>
                  </div>

                  <button
                    onClick={() => {
                      const res = dataService.checkInUser(selectedAttendanceEvent.id, m.collegeId, 'club_admin');
                      setManualCheckinFeedback(res);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#0A2540] hover:bg-[#1E3A8A] text-white text-[11px] font-bold cursor-pointer transition-colors shrink-0"
                  >
                    Mark Present
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  setShowManualRollCallModal(false);
                  setManualCheckinFeedback(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-ink-muted hover:text-ink cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Event Poster Generator Modal */}
      {currentEvent && (
        <EventPosterModal
          event={currentEvent}
          isOpen={showPosterModal}
          onClose={() => setShowPosterModal(false)}
        />
      )}
    </div>
  );
}

export default function ClubAdminDashboardPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-ink-muted">Loading Club Admin Dashboard...</div>}>
      <ClubAdminContent />
    </Suspense>
  );
}
