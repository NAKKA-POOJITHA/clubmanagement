'use client';

import { useEffect, useState } from 'react';
import {
  DEMO_CLUBS,
  DEMO_EVENTS,
  DEMO_PROJECTS,
  DEMO_ROADMAPS,
  DEMO_TOOLS,
  DEMO_CERTIFICATES,
  DEMO_ANNOUNCEMENTS,
  DEMO_AUDIT_LOGS,
  DEMO_GALLERY,
  DEMO_PROFILES,
  DEMO_MEMBERSHIPS,
  DEMO_REGISTRATIONS,
  DEMO_ATTENDANCE,
  DEMO_NOTIFICATIONS,
  CSEC_COUNCIL_ROSTER,
  Club,
  EventItem,
  ProjectItem,
  RoadmapItem,
  ToolItem,
  CertificateRecord,
  AnnouncementItem,
  AuditLogItem,
  GalleryItem,
  Profile,
  CouncilMember,
  ClubMembershipRecord,
  EventRegistrationRecord,
  AttendanceRecord,
  NotificationRecord
} from './demoData';
import { createClient } from './supabase/client';

class DataService {
  private clubs: Club[] = [...DEMO_CLUBS];
  private events: EventItem[] = [...DEMO_EVENTS];
  private projects: ProjectItem[] = [...DEMO_PROJECTS];
  private roadmaps: RoadmapItem[] = JSON.parse(JSON.stringify(DEMO_ROADMAPS));
  private tools: ToolItem[] = [...DEMO_TOOLS];
  private gallery: GalleryItem[] = [...DEMO_GALLERY];
  private certificates: CertificateRecord[] = [...DEMO_CERTIFICATES];
  private announcements: AnnouncementItem[] = [...DEMO_ANNOUNCEMENTS];
  private auditLogs: AuditLogItem[] = [...DEMO_AUDIT_LOGS];
  private memberships: ClubMembershipRecord[] = [...DEMO_MEMBERSHIPS];
  private registrations: EventRegistrationRecord[] = [...DEMO_REGISTRATIONS];
  private attendanceList: AttendanceRecord[] = [...DEMO_ATTENDANCE];
  private notifications: NotificationRecord[] = [...DEMO_NOTIFICATIONS];
  private profiles: Profile[] = Object.values(DEMO_PROFILES);
  private officers: any[] = [
    {
      id: 'off-1',
      name: 'N. Poojitha',
      role: 'President',
      club: 'CSEC Technical Club',
      department: 'CSE',
      year: 'Final Year',
      email: 'poojitha@pragati.ac.in',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      status: 'active'
    },
    {
      id: 'off-2',
      name: 'V. Jahnavi Devi',
      role: 'Vice President',
      club: 'CSEC Technical Club',
      department: 'CSE',
      year: 'Third Year',
      email: 'jahnavi@pragati.ac.in',
      photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
      status: 'active'
    },
    {
      id: 'off-3',
      name: 'B. Surya Abhilash',
      role: 'Technical Lead',
      club: 'CSEC Technical Club',
      department: 'CSE',
      year: 'Final Year',
      email: 'surya@pragati.ac.in',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      status: 'active'
    },
    {
      id: 'off-4',
      name: 'Rohan Deshmukh',
      role: 'President & Tech Lead',
      club: 'PRAGSOFT Innovation Hub',
      department: 'CSE & IT',
      year: 'Final Year',
      email: 'rohan.d@pragati.ac.in',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
      status: 'active'
    },
    {
      id: 'off-5',
      name: 'Zakir Horizontal',
      role: 'Lead Architect',
      club: 'AR/VR & Metaverse Club',
      department: 'ECE & CSE',
      year: 'Final Year',
      email: 'zakir@pragati.ac.in',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
      status: 'active'
    },
    {
      id: 'off-6',
      name: 'K. Sai Krishna',
      role: 'President',
      club: 'Rotaract Club of Pragati',
      department: 'CSE',
      year: 'Final Year',
      email: 'rotaract.lead@pragati.ac.in',
      photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
      status: 'active'
    }
  ];

  // Real-time Pub-Sub Listener Set
  private listeners: Set<() => void> = new Set();
  private broadcastChannel: BroadcastChannel | null = null;
  private supabaseClient: any = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadStateFromStorage();

      // Cross-tab BroadcastChannel
      if ('BroadcastChannel' in window) {
        try {
          this.broadcastChannel = new BroadcastChannel('pragati_central_sync_channel');
          this.broadcastChannel.onmessage = (event) => {
            if (event.data?.type === 'PRAGATI_SYNC') {
              this.loadStateFromStorage();
              this.notifyListeners(false);
            }
          };
        } catch (e) {
          console.warn('BroadcastChannel not initialized:', e);
        }
      }

      // Cross-tab storage event
      window.addEventListener('storage', (e) => {
        if (e.key && e.key.startsWith('cm_')) {
          this.loadStateFromStorage();
          this.notifyListeners(false);
        }
      });

      // Window custom event
      window.addEventListener('pragati_central_data_sync', () => {
        this.notifyListeners(false);
      });

      // Supabase Realtime Channel Subscription
      this.initSupabaseRealtime();
    }
  }

  private initSupabaseRealtime() {
    try {
      this.supabaseClient = createClient();
      if (this.supabaseClient) {
        this.supabaseClient
          .channel('public_schema_changes')
          .on('postgres_changes', { event: '*', schema: 'public' }, (payload: any) => {
            this.notifyListeners(true);
          })
          .subscribe();
      }
    } catch (err) {
      // Offline / Local fallback mode
    }
  }

  // --- PUB / SUB REALTIME EVENT SYSTEM ---
  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(broadcast: boolean = true) {
    this.listeners.forEach((cb) => {
      try {
        cb();
      } catch (err) {
        console.error('DataService subscriber error:', err);
      }
    });

    if (broadcast && typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('pragati_central_data_sync', {
          detail: { timestamp: Date.now() }
        })
      );

      if (this.broadcastChannel) {
        try {
          this.broadcastChannel.postMessage({ type: 'PRAGATI_SYNC', timestamp: Date.now() });
        } catch (e) {}
      }
    }
  }

  private loadStateFromStorage() {
    if (typeof window === 'undefined') return;

    try {
      const savedEvents = localStorage.getItem('cm_events');
      if (savedEvents) this.events = JSON.parse(savedEvents);

      const savedProjects = localStorage.getItem('cm_projects');
      if (savedProjects) {
        const parsed = JSON.parse(savedProjects);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.projects = parsed.map((p: any) => ({
            ...p,
            status: p.status || 'pending_review',
            publication_status: p.publication_status || (p.status === 'approved' ? 'showcased' : 'private')
          }));
        }
      }

      const savedGallery = localStorage.getItem('cm_gallery');
      if (savedGallery) this.gallery = JSON.parse(savedGallery);

      const savedCertificates = localStorage.getItem('cm_certificates');
      if (savedCertificates) this.certificates = JSON.parse(savedCertificates);

      const savedMemberships = localStorage.getItem('cm_memberships');
      if (savedMemberships) this.memberships = JSON.parse(savedMemberships);

      const savedRegistrations = localStorage.getItem('cm_registrations');
      if (savedRegistrations) this.registrations = JSON.parse(savedRegistrations);

      const savedAttendance = localStorage.getItem('cm_attendance');
      if (savedAttendance) this.attendanceList = JSON.parse(savedAttendance);

      const savedNotifications = localStorage.getItem('cm_notifications');
      if (savedNotifications) this.notifications = JSON.parse(savedNotifications);

      const savedAuditLogs = localStorage.getItem('cm_audit_logs');
      if (savedAuditLogs) this.auditLogs = JSON.parse(savedAuditLogs);

      const savedProfiles = localStorage.getItem('cm_profiles');
      if (savedProfiles) this.profiles = JSON.parse(savedProfiles);

      const savedOfficers = localStorage.getItem('cm_officers');
      if (savedOfficers) this.officers = JSON.parse(savedOfficers);

      const savedRoadmaps = localStorage.getItem('cm_roadmaps');
      if (savedRoadmaps) this.roadmaps = JSON.parse(savedRoadmaps);

      const savedTools = localStorage.getItem('cm_tools');
      if (savedTools) this.tools = JSON.parse(savedTools);
    } catch (e) {
      console.warn('Error loading cached Central Data Store:', e);
    }
  }

  private saveState() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('cm_events', JSON.stringify(this.events));
        localStorage.setItem('cm_projects', JSON.stringify(this.projects));
        localStorage.setItem('cm_gallery', JSON.stringify(this.gallery));
        localStorage.setItem('cm_certificates', JSON.stringify(this.certificates));
        localStorage.setItem('cm_memberships', JSON.stringify(this.memberships));
        localStorage.setItem('cm_registrations', JSON.stringify(this.registrations));
        localStorage.setItem('cm_attendance', JSON.stringify(this.attendanceList));
        localStorage.setItem('cm_notifications', JSON.stringify(this.notifications));
        localStorage.setItem('cm_audit_logs', JSON.stringify(this.auditLogs));
        localStorage.setItem('cm_profiles', JSON.stringify(this.profiles));
        localStorage.setItem('cm_officers', JSON.stringify(this.officers));
        localStorage.setItem('cm_roadmaps', JSON.stringify(this.roadmaps));
        localStorage.setItem('cm_tools', JSON.stringify(this.tools));
      } catch (e) {
        console.warn('Error saving Central Data Store:', e);
      }
    }
    this.notifyListeners(true);
  }

  // ==========================================
  // --- DYNAMIC CLUBS & MEMBERSHIPS ENGINE ---
  // ==========================================

  getClubs(): Club[] {
    return this.clubs.map(c => this.hydrateClubStats(c));
  }

  getClubBySlug(slug: string): Club | undefined {
    const raw = this.clubs.find(c => c.slug === slug || c.id === slug);
    return raw ? this.hydrateClubStats(raw) : undefined;
  }

  getClubById(id: string): Club | undefined {
    return this.getClubBySlug(id);
  }

  private isClubMatch(club: Club, itemClubId?: string, itemClubName?: string): boolean {
    if (itemClubId && (itemClubId === club.id || itemClubId === club.slug)) return true;
    if (itemClubName) {
      const target = itemClubName.toLowerCase();
      const clubSlug = club.slug.toLowerCase();
      const clubBaseName = club.name.split('—')[0].trim().toLowerCase();
      if (target.includes(clubSlug) || target.includes(clubBaseName)) return true;
      if (club.id === 'c-pragsoft' && target.includes('pragsoft')) return true;
      if (club.id === 'c-csec' && (target.includes('csec') || target.includes('computer science'))) return true;
      if (club.id === 'c-arvr' && (target.includes('ar/vr') || target.includes('metaverse'))) return true;
      if (club.id === 'c-rotaract' && target.includes('rotaract')) return true;
    }
    return false;
  }

  private hydrateClubStats(club: Club): Club {
    const actualMembers = this.memberships.filter(
      m => this.isClubMatch(club, m.clubId, m.clubName) && m.status === 'Active'
    ).length;

    const actualEvents = this.events.filter(
      e => this.isClubMatch(club, e.club_id, e.club_name)
    ).length;

    const actualProjects = this.projects.filter(
      p => this.isClubMatch(club, p.club_id, p.club_name)
    ).length;

    return {
      ...club,
      members_count: actualMembers,
      events_count: actualEvents,
      projects_count: actualProjects
    };
  }

  getMemberships(): ClubMembershipRecord[] {
    return this.memberships;
  }

  getMembersForClub(clubIdOrName: string): ClubMembershipRecord[] {
    const target = (clubIdOrName || '').toLowerCase().trim();
    return this.memberships.filter(
      m =>
        m.clubId.toLowerCase() === target ||
        m.clubName.toLowerCase().includes(target) ||
        (target.includes('pragsoft') && (m.clubId === 'c-pragsoft' || m.clubName.toLowerCase().includes('pragsoft'))) ||
        (target.includes('csec') && (m.clubId === 'c-csec' || m.clubName.toLowerCase().includes('csec'))) ||
        (target.includes('arvr') && (m.clubId === 'c-arvr' || m.clubName.toLowerCase().includes('ar/vr'))) ||
        (target.includes('rotaract') && (m.clubId === 'c-rotaract' || m.clubName.toLowerCase().includes('rotaract')))
    );
  }

  getMembershipsForUser(identifier?: string): ClubMembershipRecord[] {
    if (!identifier) return [];
    const clean = identifier.toLowerCase().trim();
    return this.memberships.filter(
      m =>
        m.userId.toLowerCase() === clean ||
        m.studentEmail.toLowerCase() === clean ||
        m.rollNumber.toLowerCase() === clean ||
        m.studentName.toLowerCase().includes(clean)
    );
  }

  isClubMember(clubIdOrSlug: string, userIdOrEmail: string): boolean {
    if (!userIdOrEmail) return false;
    const userMemberships = this.getMembershipsForUser(userIdOrEmail);
    const target = clubIdOrSlug.toLowerCase().trim();
    return userMemberships.some(
      m =>
        m.status === 'Active' &&
        (m.clubId.toLowerCase() === target ||
         m.clubName.toLowerCase().includes(target) ||
         (target.includes('pragsoft') && m.clubName.toLowerCase().includes('pragsoft')) ||
         (target.includes('csec') && m.clubName.toLowerCase().includes('csec')) ||
         (target.includes('arvr') && m.clubName.toLowerCase().includes('ar/vr')) ||
         (target.includes('rotaract') && m.clubName.toLowerCase().includes('rotaract')))
    );
  }

  joinClub(
    clubId: string,
    user: Profile,
    role: 'Member' | 'Lead' | 'Officer' | 'Coordinator' = 'Member'
  ): { success: boolean; membership?: ClubMembershipRecord; error?: string } {
    if (!user || (!user.id && !user.email)) {
      return { success: false, error: 'Authentication required: Please log in with your college credentials.' };
    }

    const club = this.getClubBySlug(clubId) || this.clubs.find(c => c.id === clubId);
    if (!club) return { success: false, error: 'Club record not found in university directory.' };

    const existing = this.memberships.find(
      m =>
        (m.clubId === club.id || m.clubName === club.name) &&
        (m.userId === user.id || m.studentEmail.toLowerCase() === (user.email || '').toLowerCase() || (user.membership_number && m.rollNumber.toUpperCase() === user.membership_number.toUpperCase()))
    );

    if (existing) {
      if (existing.status === 'Active') {
        return { success: true, membership: existing };
      }
      existing.status = 'Active';
      this.logAction('Reactivated Club Membership', `${user.full_name} -> ${club.name}`, user.role || 'student', user.full_name);
      this.saveState();
      return { success: true, membership: existing };
    }

    const newMembership: ClubMembershipRecord = {
      id: 'mem-' + Math.random().toString(36).substr(2, 9),
      clubId: club.id,
      clubName: club.name,
      userId: user.id || `u-${Date.now()}`,
      studentName: user.full_name,
      studentEmail: user.email,
      rollNumber: user.membership_number || user.id || 'PRAG-STUDENT',
      department: user.department || 'Computer Science & Engineering',
      year: user.academic_year || '2nd Year (2025-2029)',
      status: 'Active',
      joinedDate: new Date().toISOString().split('T')[0],
      role,
      hasDigitalPass: true
    };

    this.memberships.unshift(newMembership);

    // Create In-App Notification
    this.addNotification({
      userId: user.id || user.email,
      title: 'Club Enrolment Verified',
      message: `You are now an active verified member of ${club.name}. Your digital credentials and pass have been updated.`,
      type: 'club',
      link: '/dashboard/student?tab=clubs'
    });

    this.logAction('Joined Technical Club', `${user.full_name} joined ${club.name}`, user.role || 'student', user.full_name);
    this.saveState();
    return { success: true, membership: newMembership };
  }

  leaveClub(clubId: string, user: Profile): { success: boolean; error?: string } {
    if (!user) return { success: false, error: 'Authentication required.' };
    const club = this.getClubBySlug(clubId) || this.clubs.find(c => c.id === clubId);
    const clubName = club?.name || clubId;

    this.memberships = this.memberships.filter(
      m =>
        !(
          (m.clubId === clubId || m.clubName === clubName) &&
          (m.userId === user.id || (user.email && m.studentEmail.toLowerCase() === user.email.toLowerCase()) || (user.membership_number && m.rollNumber.toUpperCase() === user.membership_number.toUpperCase()))
        )
    );

    this.addNotification({
      userId: user.id || user.email,
      title: 'Resigned from Club',
      message: `You have resigned from ${clubName}.`,
      type: 'club',
      link: '/dashboard/student?tab=clubs'
    });

    this.logAction('Left Club', `${user.full_name} resigned from ${clubName}`, user.role || 'student', user.full_name);
    this.saveState();
    return { success: true };
  }

  addClubMember(
    clubId: string,
    member: Omit<ClubMembershipRecord, 'id' | 'clubId' | 'clubName' | 'joinedDate'>,
    adminUser: Profile
  ): { success: boolean; membership?: ClubMembershipRecord; error?: string } {
    const club = this.getClubBySlug(clubId) || this.clubs.find(c => c.id === clubId) || this.clubs[1];
    const newMem: ClubMembershipRecord = {
      ...member,
      id: 'mem-' + Math.random().toString(36).substr(2, 9),
      clubId: club.id,
      clubName: club.name,
      joinedDate: new Date().toISOString().split('T')[0]
    };

    this.memberships.unshift(newMem);
    this.logAction('Registered Club Member', `${member.studentName} added to ${club.name}`, adminUser.role, adminUser.full_name);
    this.saveState();
    return { success: true, membership: newMem };
  }

  updateMemberStatus(membershipId: string, status: 'Active' | 'Pending' | 'Alumnus', adminUser: Profile): boolean {
    const mem = this.memberships.find(m => m.id === membershipId);
    if (!mem) return false;
    mem.status = status;
    this.logAction('Updated Membership Status', `${mem.studentName} -> ${status}`, adminUser.role, adminUser.full_name);
    this.saveState();
    return true;
  }

  getClubStats(clubIdOrSlug: string) {
    const club = this.getClubBySlug(clubIdOrSlug) || this.clubs[1];
    const members = this.getMembersForClub(club.id);
    const events = this.getEventsForClub(club.id);
    const projects = this.getProjectsForClub(club.id);
    const eventIds = events.map(e => e.id);
    const registrations = this.registrations.filter(r => eventIds.includes(r.eventId) && r.status === 'registered');
    const attendance = this.attendanceList.filter(a => eventIds.includes(a.eventId) && a.status === 'Attended');
    const certs = this.certificates.filter(c => this.isClubMatch(club, undefined, c.club_name));

    return {
      active_members: members.filter(m => m.status === 'Active').length,
      pending_members: members.filter(m => m.status === 'Pending').length,
      total_members: members.length,
      members_count: members.filter(m => m.status === 'Active').length,
      total_events: events.length,
      events_count: events.length,
      upcoming_events: events.filter(e => e.status !== 'Completed' && e.status !== 'completed').length,
      total_registrations: registrations.length,
      registrations_count: registrations.length,
      total_attendance: attendance.length,
      total_projects: projects.length,
      projects_count: projects.length,
      showcased_projects: projects.filter(p => p.publication_status === 'showcased').length,
      pending_review_projects: projects.filter(p => p.status === 'pending_review').length,
      certificates_issued: certs.length,
      certificates_count: certs.length,
      turnout_percentage: registrations.length > 0 ? Math.round((attendance.length / registrations.length) * 100) : 0
    };
  }

  // ==========================================
  // --- DYNAMIC EVENTS & REGISTRATIONS ENGINE ---
  // ==========================================

  getEvents(): EventItem[] {
    return this.events.map(e => this.hydrateEventStats(e));
  }

  getEventById(id: string): EventItem | undefined {
    const raw = this.events.find(e => e.id === id || e.slug === id);
    return raw ? this.hydrateEventStats(raw) : undefined;
  }

  getEventsForClub(clubIdOrName: string): EventItem[] {
    const target = (clubIdOrName || '').toLowerCase().trim();
    return this.getEvents().filter(
      e =>
        (e.club_id && e.club_id.toLowerCase() === target) ||
        (e.club_name && e.club_name.toLowerCase().includes(target)) ||
        (target.includes('pragsoft') && e.club_name.toLowerCase().includes('pragsoft')) ||
        (target.includes('csec') && e.club_name.toLowerCase().includes('csec')) ||
        (target.includes('arvr') && e.club_name.toLowerCase().includes('ar/vr')) ||
        (target.includes('rotaract') && e.club_name.toLowerCase().includes('rotaract'))
    );
  }

  private hydrateEventStats(event: EventItem): EventItem {
    const totalRegistered = this.registrations.filter(
      r => r.eventId === event.id && r.status === 'registered'
    ).length;

    const capacity = event.capacity || event.seats_total || 120;

    return {
      ...event,
      capacity,
      registered_count: totalRegistered,
      seats_total: capacity,
      seats_filled: totalRegistered,
      registered_users_count: totalRegistered
    };
  }

  createEvent(
    eventData: Partial<EventItem>,
    creatorRole: string = 'club_admin',
    creatorUser?: Profile
  ): { success: boolean; event?: EventItem; error?: string } {
    if (creatorRole !== 'club_admin' && creatorRole !== 'super_admin' && creatorRole !== 'faculty_coordinator' && creatorRole !== 'department_admin') {
      return { success: false, error: 'Forbidden: Only authorized Club Admins, Faculty Coordinators, and Super Admins can publish events.' };
    }

    const newId = 'evt-' + Date.now();
    const capacity = Number(eventData.capacity || eventData.seats_total || 120);
    const dateStr = eventData.date || new Date().toISOString().split('T')[0];
    const timeStr = eventData.time || '10:00 AM - 01:00 PM';

    const newEvent: EventItem = {
      id: newId,
      title: eventData.title || 'Technical Symposium & Workshop',
      club_name: eventData.club_name || 'PRAGSOFT — Premier Technical Coding Club',
      club_id: eventData.club_id || (eventData.club_name?.toLowerCase().includes('pragsoft') ? 'c-pragsoft' : 'c-csec'),
      description: eventData.description || 'Hands-on technical workshop organized by university engineering council.',
      event_type: (eventData.event_type || eventData.category || 'Workshop') as any,
      category: eventData.category || eventData.event_type || 'Workshop',
      venue: eventData.venue || 'Sir C.V. Raman Auditorium, Pragati University',
      date: dateStr,
      time: timeStr,
      start_time: eventData.start_time || `${dateStr} ${timeStr.split('-')[0].trim()}`,
      end_time: eventData.end_time || `${dateStr} ${timeStr.split('-')[1]?.trim() || '01:00 PM'}`,
      capacity,
      seats_total: capacity,
      seats_filled: 0,
      registered_count: 0,
      registered_users_count: 0,
      points: Number(eventData.points || 100),
      eligibility: eventData.eligibility || 'All Engineering Students',
      registration_deadline: eventData.registration_deadline || dateStr,
      status: eventData.status || 'Upcoming',
      is_registration_open: true,
      banner_url: eventData.banner_url || eventData.poster_url || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
      poster_url: eventData.poster_url || eventData.banner_url || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
      tag_color: eventData.tag_color || '#0A2540'
    };

    this.events.unshift(newEvent);

    // Global notification
    this.addNotification({
      userId: 'all',
      title: `New Event: ${newEvent.title}`,
      message: `${newEvent.club_name} announced "${newEvent.title}". Registrations are now open.`,
      type: 'event',
      link: `/events/${newEvent.id}`
    });

    this.logAction('Created New Event', `${newEvent.title} by ${newEvent.club_name}`, creatorRole, creatorUser?.full_name);
    this.saveState();
    return { success: true, event: newEvent };
  }

  updateEvent(
    eventId: string,
    updatedData: Partial<EventItem>,
    updaterRole: string = 'club_admin',
    updaterUser?: Profile
  ): { success: boolean; event?: EventItem; error?: string } {
    const event = this.events.find(e => e.id === eventId);
    if (!event) return { success: false, error: 'Event not found.' };

    Object.assign(event, updatedData);

    // Propagate date / title updates to registered users' records
    this.registrations.forEach(r => {
      if (r.eventId === eventId) {
        if (updatedData.title) r.eventTitle = updatedData.title;
      }
    });
    this.attendanceList.forEach(a => {
      if (a.eventId === eventId) {
        if (updatedData.title) a.eventTitle = updatedData.title;
      }
    });

    // Notify registered students about changes (e.g. date changes)
    if (updatedData.date || updatedData.start_time || updatedData.venue) {
      const affectedRegs = this.registrations.filter(r => r.eventId === eventId);
      affectedRegs.forEach(r => {
        this.addNotification({
          userId: r.userId,
          title: `Event Schedule Updated: ${event.title}`,
          message: `The schedule for "${event.title}" has been updated. Date: ${event.date || event.start_time}, Venue: ${event.venue}.`,
          type: 'event',
          link: `/events/${event.id}`
        });
      });
    }

    this.logAction('Updated Event Details', `${event.title} modified`, updaterRole, updaterUser?.full_name);
    this.saveState();
    return { success: true, event };
  }

  deleteEvent(id: string, deleterRole: string = 'club_admin', deleterUser?: Profile): void {
    const event = this.events.find(e => e.id === id);
    const title = event?.title || id;
    this.events = this.events.filter(e => e.id !== id);

    // Notify all registered students of cancellation
    const affectedRegs = this.registrations.filter(r => r.eventId === id);
    affectedRegs.forEach(r => {
      r.status = 'cancelled';
      this.addNotification({
        userId: r.userId,
        title: `Event Cancelled: ${title}`,
        message: `Please note that "${title}" has been cancelled by university administration.`,
        type: 'event',
        link: '/events'
      });
    });

    this.logAction('Cancelled Event', `${title} removed from schedule`, deleterRole, deleterUser?.full_name);
    this.saveState();
  }

  registerForEvent(
    eventId: string,
    user: Profile
  ): { success: boolean; status: 'registered' | 'waitlisted'; error?: string } {
    if (!user || (!user.id && !user.email)) {
      return { success: false, status: 'registered', error: 'Authentication required. Please login with your student ID.' };
    }

    const event = this.getEventById(eventId) || this.events.find(e => e.id === eventId);
    if (!event) return { success: false, status: 'registered', error: 'Event not found in college schedule.' };

    // Check existing registration
    const existing = this.registrations.find(
      r =>
        r.eventId === eventId &&
        (r.userId === user.id ||
         (user.email && r.studentEmail.toLowerCase() === user.email.toLowerCase()) ||
         (user.membership_number && r.rollNumber.toUpperCase() === user.membership_number.toUpperCase()))
    );

    if (existing) {
      if (existing.status === 'cancelled') {
        existing.status = 'registered';
        this.saveState();
      }
      return { success: true, status: existing.status as any };
    }

    const currentCount = this.registrations.filter(r => r.eventId === eventId && r.status === 'registered').length;
    const isFull = currentCount >= (event.capacity || 120);
    const status = isFull ? 'waitlisted' : 'registered';

    const newReg: EventRegistrationRecord = {
      id: 'reg-' + Math.random().toString(36).substr(2, 9),
      eventId: event.id,
      eventTitle: event.title,
      clubId: event.club_id || 'c-pragsoft',
      clubName: event.club_name,
      userId: user.id || `u-${Date.now()}`,
      studentName: user.full_name,
      studentEmail: user.email,
      rollNumber: user.membership_number || user.id || 'PRAG-STUDENT',
      department: user.department || 'Computer Science & Engineering',
      status,
      registeredAt: new Date().toISOString().split('T')[0],
      attended: false,
      certificateIssued: false
    };

    this.registrations.unshift(newReg);

    // Create confirmation notification for student
    this.addNotification({
      userId: user.id || user.email,
      title: status === 'registered' ? 'Event Registration Confirmed' : 'Waitlisted for Event',
      message: `Your registration for "${event.title}" is ${status}. Access your Digital QR Pass under Events.`,
      type: 'event',
      link: '/dashboard/student?tab=events'
    });

    this.logAction(`Registered for Event (${status})`, `${user.full_name} -> ${event.title}`, user.role || 'student', user.full_name);
    this.saveState();
    return { success: true, status };
  }

  cancelRegistration(eventId: string, user: Profile): { success: boolean; error?: string } {
    if (!user) return { success: false, error: 'Authentication required.' };
    const event = this.getEventById(eventId);

    this.registrations = this.registrations.filter(
      r =>
        !(
          r.eventId === eventId &&
          (r.userId === user.id ||
           (user.email && r.studentEmail.toLowerCase() === user.email.toLowerCase()) ||
           (user.membership_number && r.rollNumber.toUpperCase() === user.membership_number.toUpperCase()))
        )
    );

    this.logAction('Cancelled Registration', `${user.full_name} withdrawn from ${event?.title || eventId}`, user.role || 'student', user.full_name);
    this.saveState();
    return { success: true };
  }

  getRegistrations(): EventRegistrationRecord[] {
    return this.registrations;
  }

  getRegistrationsForEvent(eventId: string): EventRegistrationRecord[] {
    const cleanId = (eventId || '').trim().toLowerCase();
    const event = this.events.find(e => e.id.toLowerCase() === cleanId || (e.slug && e.slug.toLowerCase() === cleanId));
    const targetTitle = (event?.title || cleanId).toLowerCase();

    return this.registrations.filter(
      r =>
        r.eventId.toLowerCase() === cleanId ||
        (event && r.eventId.toLowerCase() === event.id.toLowerCase()) ||
        (targetTitle.includes('codesprint') && r.eventTitle.toLowerCase().includes('codesprint')) ||
        (targetTitle.includes('quantathon') && r.eventTitle.toLowerCase().includes('quantathon')) ||
        (targetTitle.includes('unity') && r.eventTitle.toLowerCase().includes('unity'))
    );
  }

  getRegistrationsForUser(user: Profile | string): EventRegistrationRecord[] {
    const userId = typeof user === 'string' ? user : user?.id;
    const email = typeof user === 'string' ? user : user?.email;
    const roll = typeof user === 'string' ? user : user?.membership_number;

    return this.registrations.filter(r => {
      if (userId && r.userId === userId) return true;
      if (email && r.studentEmail.toLowerCase() === email.toLowerCase()) return true;
      if (roll && r.rollNumber.toUpperCase() === roll.toUpperCase()) return true;
      return false;
    });
  }

  isRegistered(eventId: string, userIdOrEmail: string): boolean {
    if (!userIdOrEmail) return false;
    const clean = userIdOrEmail.toLowerCase().trim();
    const event = this.events.find(e => e.id.toLowerCase() === eventId.toLowerCase() || (e.slug && e.slug.toLowerCase() === eventId.toLowerCase()));
    const targetTitle = (event?.title || eventId).toLowerCase();

    return this.registrations.some(
      r =>
        r.status === 'registered' &&
        (r.eventId.toLowerCase() === eventId.toLowerCase() || (event && r.eventId.toLowerCase() === event.id.toLowerCase()) || (targetTitle.includes('codesprint') && r.eventTitle.toLowerCase().includes('codesprint'))) &&
        (r.userId.toLowerCase() === clean || r.studentEmail.toLowerCase() === clean || r.rollNumber.toLowerCase() === clean)
    );
  }

  // ==========================================
  // --- ATTENDANCE & QR CHECK-IN ENGINE ---
  // ==========================================

  checkInUser(
    eventId: string,
    membershipOrUserId: string,
    markedByRole: string = 'club_admin',
    markedByName: string = 'Club Officer'
  ): {
    success: boolean;
    message: string;
    user?: Profile;
    eventTitle?: string;
    time?: string;
    studentId?: string;
  } {
    if (!eventId) {
      return { success: false, message: 'No event selected. Please select an event before scanning.' };
    }

    const cleanInput = (membershipOrUserId || '').trim().toLowerCase();

    // Look up in profiles or registrations
    let profile: Profile | undefined = this.profiles.find(
      p =>
        p.id.toLowerCase() === cleanInput ||
        p.membership_number?.toLowerCase() === cleanInput ||
        p.email.toLowerCase() === cleanInput ||
        p.full_name.toLowerCase().includes(cleanInput)
    );

    if (!profile) {
      const reg = this.registrations.find(
        r =>
          r.rollNumber.toLowerCase() === cleanInput ||
          r.studentEmail.toLowerCase() === cleanInput ||
          r.studentName.toLowerCase().includes(cleanInput) ||
          r.userId.toLowerCase() === cleanInput
      );
      if (reg) {
        profile = {
          id: reg.userId,
          full_name: reg.studentName,
          email: reg.studentEmail,
          membership_number: reg.rollNumber,
          department: reg.department,
          role: 'student',
          academic_year: '2nd Year (2025-2029)',
          photo_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
          phone: '+91 9876543210'
        };
      }
    }

    if (!profile) {
      return { success: false, message: `Invalid student ID or QR code: "${membershipOrUserId}" not found in college registry.` };
    }

    const event = this.getEventById(eventId) || this.events.find(e => e.id === eventId);
    if (!event) {
      return { success: false, message: 'Event record not found in system.' };
    }

    // Check if registered
    const isReg = this.isRegistered(event.id, profile.id) || this.isRegistered(event.id, profile.email) || (profile.membership_number && this.isRegistered(event.id, profile.membership_number));
    if (!isReg) {
      return {
        success: false,
        message: `Attendance Rejected: ${profile.full_name} (${profile.membership_number || profile.id}) is NOT registered for ${event.title}.`,
        user: profile
      };
    }

    // Check if already checked in
    const alreadyCheckedIn = this.attendanceList.some(
      a => (a.eventId === event.id || a.eventId === eventId) &&
           (a.userId === profile!.id || a.studentEmail.toLowerCase() === profile!.email.toLowerCase() || (profile!.membership_number && a.rollNumber.toUpperCase() === profile!.membership_number.toUpperCase()))
    );

    if (alreadyCheckedIn) {
      return {
        success: false,
        message: `${profile.full_name} (${profile.membership_number || profile.id}) has ALREADY been checked in for this event!`,
        user: profile
      };
    }

    const now = new Date();
    const newAtt: AttendanceRecord = {
      id: 'att-' + Math.random().toString(36).substr(2, 9),
      eventId: event.id,
      eventTitle: event.title,
      clubId: event.club_id || 'c-pragsoft',
      userId: profile.id,
      studentName: profile.full_name,
      studentEmail: profile.email,
      rollNumber: profile.membership_number || profile.id,
      timestamp: now.toISOString(),
      method: 'qr',
      status: 'Attended',
      markedBy: `${markedByName} (${markedByRole.replace('_', ' ').toUpperCase()})`
    };

    this.attendanceList.unshift(newAtt);

    // Update registration record attended flag
    const regRecord = this.registrations.find(
      r => r.eventId === event.id &&
           (r.userId === profile!.id || r.studentEmail.toLowerCase() === profile!.email.toLowerCase() || (profile!.membership_number && r.rollNumber.toUpperCase() === profile!.membership_number.toUpperCase()))
    );
    if (regRecord) regRecord.attended = true;

    // Add attendance notification for student
    this.addNotification({
      userId: profile.id,
      title: 'Attendance Verified (Present)',
      message: `Your attendance for "${event.title}" was recorded at ${now.toLocaleTimeString()}. Certificate eligibility unlocked.`,
      type: 'attendance',
      link: '/dashboard/student?tab=certificates'
    });

    this.logAction('Attendance Recorded', `${profile.full_name} marked PRESENT for ${event.title}`, markedByRole, markedByName);
    this.saveState();

    return {
      success: true,
      message: '✓ ATTENDANCE VERIFIED',
      user: profile,
      eventTitle: event.title,
      time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      studentId: profile.membership_number || profile.id
    };
  }

  markAttendance(
    eventId: string,
    membershipOrUserId: string,
    status: 'Attended' | 'Absent' = 'Attended',
    markedByRole: string = 'faculty_coordinator',
    markedByName: string = 'Faculty Lead'
  ) {
    if (status === 'Attended') {
      return this.checkInUser(eventId, membershipOrUserId, markedByRole, markedByName);
    }
    // Remove or mark absent
    const cleanInput = (membershipOrUserId || '').trim().toLowerCase();
    this.attendanceList = this.attendanceList.filter(
      a => !(a.eventId === eventId && (a.userId.toLowerCase() === cleanInput || a.rollNumber.toLowerCase() === cleanInput || a.studentEmail.toLowerCase() === cleanInput))
    );
    this.saveState();
    return { success: true, message: 'Attendance updated to Absent' };
  }

  getAttendance(): AttendanceRecord[] {
    return this.attendanceList;
  }

  getAttendanceForEvent(eventId: string): AttendanceRecord[] {
    const cleanId = (eventId || '').trim().toLowerCase();
    return this.attendanceList.filter(a => a.eventId.toLowerCase() === cleanId);
  }

  getAttendanceForUser(user: Profile | string): AttendanceRecord[] {
    const userId = typeof user === 'string' ? user : user?.id;
    const email = typeof user === 'string' ? user : user?.email;
    const roll = typeof user === 'string' ? user : user?.membership_number;

    return this.attendanceList.filter(a => {
      if (userId && a.userId === userId) return true;
      if (email && a.studentEmail.toLowerCase() === email.toLowerCase()) return true;
      if (roll && a.rollNumber.toUpperCase() === roll.toUpperCase()) return true;
      return false;
    });
  }

  hasAttended(eventId: string, userIdOrEmail: string): boolean {
    const clean = (userIdOrEmail || '').toLowerCase().trim();
    return this.attendanceList.some(
      a =>
        (a.eventId === eventId || a.eventTitle.toLowerCase().includes(eventId.toLowerCase())) &&
        a.status === 'Attended' &&
        (a.userId.toLowerCase() === clean || a.studentEmail.toLowerCase() === clean || a.rollNumber.toLowerCase() === clean)
    );
  }

  getAttendanceStats(eventId: string) {
    const event = this.getEventById(eventId);
    const capacity = event?.capacity || 120;
    const regs = this.getRegistrationsForEvent(eventId);
    const registered = regs.length;
    const attended = this.attendanceList.filter(a => a.eventId === eventId && a.status === 'Attended').length;
    const absent = Math.max(0, registered - attended);

    return { registered, attended, absent, capacity };
  }

  // ==========================================
  // --- CERTIFICATES & CREDENTIALS ENGINE ---
  // ==========================================

  getCertificates(): CertificateRecord[] {
    return this.certificates;
  }

  getAllCertificates(): CertificateRecord[] {
    return this.getCertificates();
  }

  getCertificatesForClub(clubIdOrSlug: string): CertificateRecord[] {
    const club = this.getClubBySlug(clubIdOrSlug);
    if (!club) return this.certificates;
    return this.certificates.filter(c => this.isClubMatch(club, undefined, c.club_name));
  }

  getCertificatesForEvent(eventId: string): CertificateRecord[] {
    const event = this.getEventById(eventId);
    const title = (event?.title || eventId).toLowerCase();
    return this.certificates.filter(
      c => (c.event_id && c.event_id === eventId) || c.event_title.toLowerCase().includes(title)
    );
  }

  getStudentEligibleCertificates(user: Profile | any): CertificateRecord[] {
    if (!user) return [];
    const email = (user.email || '').toLowerCase().trim();
    const roll = (user.membership_number || user.id || '').toUpperCase().trim();
    const name = (user.full_name || '').toLowerCase().trim();
    const userId = user.id || '';

    return this.certificates.filter(c => {
      if (c.status !== 'Valid') return false;

      const emailMatch = c.student_email && (
        c.student_email.toLowerCase() === email ||
        (email && c.student_email.toLowerCase().includes(email))
      );
      const rollMatch = c.student_id && (c.student_id.toUpperCase() === roll || roll.includes(c.student_id.toUpperCase()));
      const userMatch = c.user_id && c.user_id === userId;
      const nameMatch = c.student_name && (c.student_name.toLowerCase() === name || (name && c.student_name.toLowerCase().includes(name)));

      return emailMatch || rollMatch || userMatch || nameMatch;
    });
  }

  verifyCertificate(idOrNumber: string): CertificateRecord | undefined {
    const query = (idOrNumber || '').trim().toLowerCase();
    return this.certificates.find(
      c => c.certificate_number.toLowerCase() === query || c.id.toLowerCase() === query
    );
  }

  issueCertificate(
    eventId: string,
    studentEmail: string,
    studentName: string,
    issuerUser?: Profile
  ): CertificateRecord {
    const event = this.getEventById(eventId) || this.events[0];
    const certNumber = `PRAG-CERT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const studentProfile = this.profiles.find(
      p => p.email.toLowerCase() === studentEmail.toLowerCase() || p.full_name.toLowerCase() === studentName.toLowerCase()
    );

    const newCert: CertificateRecord = {
      id: 'cert-' + Math.random().toString(36).substr(2, 9),
      certificate_number: certNumber,
      student_name: studentName,
      student_email: studentEmail,
      student_id: studentProfile?.membership_number || studentProfile?.id || 'PRAG-STUDENT',
      user_id: studentProfile?.id || '',
      event_id: event.id,
      event_title: event.title,
      club_name: event.club_name,
      issue_date: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
      attendance_status: 'Attended',
      verification_status: 'Verified',
      status: 'Valid'
    };

    this.certificates.unshift(newCert);

    // Update registration record
    const reg = this.registrations.find(
      r => r.eventId === event.id && r.studentEmail.toLowerCase() === studentEmail.toLowerCase()
    );
    if (reg) reg.certificateIssued = true;

    // Send notification
    if (studentProfile?.id) {
      this.addNotification({
        userId: studentProfile.id,
        title: 'Verified Certificate Issued',
        message: `Your official verifiable certificate (${certNumber}) for "${event.title}" is ready for PDF download.`,
        type: 'certificate',
        link: '/dashboard/student?tab=certificates'
      });
    }

    this.logAction('Certificate Issued', `${certNumber} issued to ${studentName}`, issuerUser?.role || 'club_admin', issuerUser?.full_name);
    this.saveState();
    return newCert;
  }

  generateCertificate(
    eventId: string,
    studentEmail: string,
    studentName: string,
    issuerUser?: Profile
  ): CertificateRecord {
    return this.issueCertificate(eventId, studentEmail, studentName, issuerUser);
  }

  verifyStudentCertificateOwnership(
    certNumberOrId: string,
    user: Profile
  ): { allowed: boolean; certificate?: CertificateRecord; error?: string } {
    if (!user) {
      return { allowed: false, error: 'Authentication Required: Please log in as a student to download your certificate.' };
    }

    const targetQuery = (certNumberOrId || '').trim().toLowerCase();
    const cert = this.certificates.find(
      c => c.certificate_number.toLowerCase() === targetQuery || c.id.toLowerCase() === targetQuery
    );

    if (!cert) {
      return { allowed: false, error: 'Certificate record not found in university credentials database.' };
    }

    if (user.role === 'super_admin' || user.role === 'faculty_coordinator' || user.role === 'department_admin') {
      return { allowed: true, certificate: cert };
    }

    if (user.role === 'club_admin') {
      return { allowed: true, certificate: cert };
    }

    const email = (user.email || '').toLowerCase().trim();
    const roll = (user.membership_number || user.id || '').toUpperCase().trim();
    const name = (user.full_name || '').toLowerCase().trim();
    const userId = user.id || '';

    const emailMatch = cert.student_email && (cert.student_email.toLowerCase() === email || (email && cert.student_email.toLowerCase().includes(email)));
    const rollMatch = cert.student_id && (cert.student_id.toUpperCase() === roll || roll.includes(cert.student_id.toUpperCase()));
    const userMatch = cert.user_id && cert.user_id === userId;
    const nameMatch = cert.student_name && (cert.student_name.toLowerCase() === name || (name && cert.student_name.toLowerCase().includes(name)));

    if (emailMatch || rollMatch || userMatch || nameMatch) {
      if (cert.status !== 'Valid') {
        return { allowed: false, error: 'This certificate has been revoked by university administration.' };
      }
      return { allowed: true, certificate: cert };
    }

    return {
      allowed: false,
      error: `Access Denied: Certificate ${cert.certificate_number} belongs to another student and cannot be downloaded by this account.`
    };
  }

  // ==========================================
  // --- PROJECTS & MODERATION ENGINE ---
  // ==========================================

  getProjects(): ProjectItem[] {
    return this.projects;
  }

  getProjectsForClub(clubIdOrName: string): ProjectItem[] {
    const target = (clubIdOrName || '').toLowerCase().trim();
    return this.projects.filter(
      p =>
        (p.club_id && p.club_id.toLowerCase() === target) ||
        (p.club_name && p.club_name.toLowerCase().includes(target)) ||
        (target.includes('pragsoft') && p.club_name.toLowerCase().includes('pragsoft')) ||
        (target.includes('arvr') && p.club_name.toLowerCase().includes('ar/vr')) ||
        (target.includes('rotaract') && p.club_name.toLowerCase().includes('rotaract'))
    );
  }

  getProjectsForUser(user: Profile | string | any): ProjectItem[] {
    const name = typeof user === 'string' ? user : user?.full_name;
    const email = typeof user === 'string' ? user : user?.email;
    const cleanName = (name || '').toLowerCase().trim();
    const cleanEmail = (email || '').toLowerCase().trim();

    return this.projects.filter(
      p =>
        (cleanEmail && p.student_email && p.student_email.toLowerCase() === cleanEmail) ||
        (cleanName && p.submitted_by && p.submitted_by.toLowerCase().includes(cleanName)) ||
        (cleanName && p.team && p.team.some(t => t.toLowerCase().includes(cleanName)))
    );
  }

  getPublicShowcaseProjects(): ProjectItem[] {
    return this.projects.filter(
      p => p.status === 'approved' && p.publication_status === 'showcased'
    );
  }

  addProject(project: Partial<ProjectItem>, user?: Profile): { success: boolean; project?: ProjectItem; error?: string } {
    const newProject: ProjectItem = {
      id: 'p-' + Math.random().toString(36).substr(2, 9),
      title: project.title || 'Technical Project Prototype',
      club_name: project.club_name || 'PRAGSOFT — Premier Technical Coding Club',
      club_id: project.club_id || (project.club_name?.toLowerCase().includes('arvr') ? 'c-arvr' : 'c-pragsoft'),
      description: project.description || 'Student technical research prototype.',
      domain: project.domain || 'Full-Stack Web & Mobile',
      tech_stack: project.tech_stack || ['Next.js', 'TypeScript', 'TailwindCSS'],
      team: project.team || [user?.full_name || 'Student Developer'],
      submitted_by: project.submitted_by || user?.full_name || 'Student Developer',
      student_id: user?.membership_number || user?.id || 'PRAG-STUDENT',
      student_email: user?.email || 'student@pragati.ac.in',
      github_url: project.github_url || 'https://github.com/pragati-clubs/showcase',
      demo_url: project.demo_url || project.live_url || 'https://prototype.pragati.ac.in',
      live_url: project.live_url || project.demo_url || 'https://prototype.pragati.ac.in',
      status: 'pending_review',
      publication_status: 'private',
      rating: 0,
      remarks: 'Submitted for club moderation',
      review_feedback: '',
      upvotes: 1,
      date: new Date().toISOString().split('T')[0],
      image: project.image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80'
    };

    this.projects.unshift(newProject);
    this.logAction('Submitted Project for Review', newProject.title, user?.role || 'student', user?.full_name);
    this.saveState();
    return { success: true, project: newProject };
  }

  submitProject(project: Partial<ProjectItem>, user?: Profile): { success: boolean; project?: ProjectItem; error?: string } {
    return this.addProject(project, user);
  }

  moderateProject(
    projectId: string,
    decision: 'approved' | 'rejected' | 'changes_requested',
    feedback: string,
    rating: number,
    user: Profile | any
  ): { success: boolean; project?: ProjectItem; error?: string } {
    if (!user) {
      return { success: false, error: 'Authentication required: Please log in as an administrator or coordinator.' };
    }

    if (user.role === 'student') {
      return { success: false, error: 'Forbidden: Students cannot moderate or review project submissions.' };
    }

    const project = this.projects.find(p => p.id === projectId);
    if (!project) {
      return { success: false, error: 'Project record not found in university registry.' };
    }

    project.status = decision;
    project.review_feedback = feedback || (decision === 'approved' ? 'Approved for showcase qualification.' : decision === 'changes_requested' ? 'Changes requested by coordinator.' : 'Submission rejected.');
    project.remarks = project.review_feedback;
    project.reviewed_by = `${user.full_name || 'Coordinator'} (${(user.role || 'club_admin').replace('_', ' ').toUpperCase()})`;
    project.reviewed_at = new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
    if (rating > 0) project.rating = rating;
    else if (decision === 'approved' && (!project.rating || project.rating === 0)) project.rating = 9.0;

    // Notify Student
    if (project.student_id || project.student_email) {
      this.addNotification({
        userId: project.student_id || project.student_email || 'all',
        title: `Project Status: ${decision.toUpperCase().replace('_', ' ')}`,
        message: `Your project "${project.title}" was evaluated: ${project.review_feedback}`,
        type: 'project',
        link: '/dashboard/student?tab=projects'
      });
    }

    this.logAction(`Project Moderated (${decision.toUpperCase()})`, `${project.title} by ${project.submitted_by}`, user.role || 'club_admin', user.full_name);
    this.saveState();
    return { success: true, project };
  }

  reviewProject(
    projectId: string,
    decision: 'approved' | 'rejected' | 'changes_requested',
    rating: number,
    remarks: string,
    reviewerRole: string = 'Faculty Coordinator'
  ) {
    return this.moderateProject(
      projectId,
      decision,
      remarks,
      rating,
      { role: reviewerRole, full_name: reviewerRole } as any
    );
  }

  showcaseProject(
    projectId: string,
    showcase: boolean,
    user: Profile | any
  ): { success: boolean; project?: ProjectItem; error?: string } {
    if (!user || (user.role !== 'club_admin' && user.role !== 'super_admin' && user.role !== 'faculty_coordinator' && user.role !== 'department_admin')) {
      return { success: false, error: 'Unauthorized: Only club coordinators and super admins can publish to showcase.' };
    }

    const project = this.projects.find(p => p.id === projectId);
    if (!project) return { success: false, error: 'Project record not found.' };

    if (showcase && project.status !== 'approved') {
      return {
        success: false,
        error: `Cannot Showcase: Project "${project.title}" is currently ${project.status.toUpperCase().replace('_', ' ')}. Projects must be APPROVED before they can be showcased on the public website.`
      };
    }

    project.publication_status = showcase ? 'showcased' : 'private';
    if (showcase) {
      project.showcased_at = new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
    }

    const logActionText = showcase ? 'Showcased Project on Public Portal' : 'Unpublished Project from Public Showcase';
    this.logAction(logActionText, project.title, user.role || 'club_admin', user.full_name);
    this.saveState();
    return { success: true, project };
  }

  resubmitProject(
    projectId: string,
    updatedData: Partial<ProjectItem>,
    user: Profile
  ): { success: boolean; project?: ProjectItem; error?: string } {
    const project = this.projects.find(p => p.id === projectId);
    if (!project) return { success: false, error: 'Project not found.' };

    if (updatedData.title) project.title = updatedData.title;
    if (updatedData.description) project.description = updatedData.description;
    if (updatedData.domain) project.domain = updatedData.domain;
    if (updatedData.tech_stack) project.tech_stack = updatedData.tech_stack;
    if (updatedData.github_url) project.github_url = updatedData.github_url;
    if (updatedData.live_url || updatedData.demo_url) {
      project.live_url = updatedData.live_url || updatedData.demo_url;
      project.demo_url = project.live_url;
    }

    project.status = 'pending_review';
    project.publication_status = 'private';
    project.date = new Date().toISOString().split('T')[0];
    project.remarks = 'Resubmitted with revisions for coordinator review';

    this.logAction('Resubmitted Project for Review', project.title, user?.role || 'student', user?.full_name);
    this.saveState();
    return { success: true, project };
  }

  upvoteProject(projectId: string): void {
    const project = this.projects.find(p => p.id === projectId);
    if (project) {
      project.upvotes += 1;
      this.saveState();
    }
  }

  // ==========================================
  // --- NOTIFICATIONS & AUDIT LEDGER ---
  // ==========================================

  getNotificationsForUser(userIdOrEmail?: string): NotificationRecord[] {
    if (!userIdOrEmail) return this.notifications;
    const clean = userIdOrEmail.toLowerCase().trim();
    return this.notifications.filter(
      n => n.userId.toLowerCase() === clean || n.userId === 'all' || clean.includes(n.userId.toLowerCase())
    );
  }

  addNotification(notification: Omit<NotificationRecord, 'id' | 'timestamp' | 'read'>): NotificationRecord {
    const newNotif: NotificationRecord = {
      ...notification,
      id: 'notif-' + Math.random().toString(36).substr(2, 9),
      timestamp: 'Just now',
      read: false
    };
    this.notifications.unshift(newNotif);
    this.saveState();
    return newNotif;
  }

  markNotificationRead(notificationId: string): void {
    const notif = this.notifications.find(n => n.id === notificationId);
    if (notif) {
      notif.read = true;
      this.saveState();
    }
  }

  getAuditLogs(userRole?: string): AuditLogItem[] {
    const allowed = ['super_admin', 'department_admin', 'faculty_coordinator', 'club_admin'];
    if (userRole && !allowed.includes(userRole)) return [];
    return this.auditLogs;
  }

  logAction(action: string, target: string, actorRole: string, actorName?: string): void {
    this.auditLogs.unshift({
      id: 'log-' + Math.random().toString(36).substr(2, 8),
      actor_name: actorName || (actorRole === 'super_admin' ? 'Bathina Surya Abhilash' : actorRole === 'club_admin' ? 'Nakka Poojitha' : 'System Automation'),
      actor_role: actorRole,
      action,
      target,
      timestamp: new Date().toLocaleString(),
      status: action.includes('Approved') || action.includes('Issued') || action.includes('Verified') || action.includes('Joined') ? 'Success' : 'Info'
    });
  }

  // ==========================================
  // --- USERS & RBAC ACCOUNTS ---
  // ==========================================

  getUsers(): Profile[] {
    return this.profiles;
  }

  getUserById(id: string): Profile | undefined {
    const clean = (id || '').toLowerCase().trim();
    return this.profiles.find(
      u => u.id.toLowerCase() === clean || u.email.toLowerCase() === clean || (u.membership_number && u.membership_number.toLowerCase() === clean)
    );
  }

  updateUserRole(userId: string, newRole: any): Profile | undefined {
    const user = this.profiles.find(u => u.id === userId);
    if (user) {
      user.role = newRole;
      this.logAction('Super Admin Role Modification', `${user.full_name} updated to ${newRole}`, 'super_admin');
      this.saveState();
    }
    return user;
  }

  addUser(profile: Profile): Profile {
    this.profiles.unshift(profile);
    this.saveState();
    return profile;
  }

  // ==========================================
  // --- OFFICERS & EXECUTIVE TENURES ---
  // ==========================================

  getOfficers(): any[] {
    return this.officers;
  }

  addOfficer(officer: any): any {
    const newOfficer = {
      ...officer,
      id: 'off-' + Math.random().toString(36).substr(2, 9),
      status: 'active'
    };
    this.officers.unshift(newOfficer);
    this.logAction('Executive Appointment', `${officer.name} appointed as ${officer.role} in ${officer.club}`, 'super_admin');
    this.saveState();
    return newOfficer;
  }

  removeOfficer(id: string): void {
    const off = this.officers.find(o => o.id === id);
    if (off) {
      this.officers = this.officers.filter(o => o.id !== id);
      this.logAction('Officer Tenure Concluded', `${off.name} - ${off.role}`, 'super_admin');
      this.saveState();
    }
  }

  // ==========================================
  // --- ROADMAPS, TOOLS & GALLERY ---
  // ==========================================

  getRoadmaps(): RoadmapItem[] {
    return this.roadmaps;
  }

  addRoadmap(track: any): RoadmapItem {
    const newRoadmap: RoadmapItem = {
      id: 'track-' + Math.random().toString(36).substr(2, 9),
      technology: track.title,
      domain: track.club_name || 'Engineering',
      icon: '💻',
      color: 'from-purple-500 to-indigo-600',
      stages: track.modules ? track.modules.map((m: any) => ({
        stage: m.title || 'Beginner',
        title: m.title,
        description: m.description || '',
        duration: m.duration || '2 Weeks',
        badge: 'Technical Badge',
        skills: [],
        resources: m.resources || []
      })) : []
    };
    this.roadmaps.unshift(newRoadmap);
    this.saveState();
    return newRoadmap;
  }

  deleteRoadmap(id: string): void {
    this.roadmaps = this.roadmaps.filter(r => r.id !== id);
    this.saveState();
  }

  getTools(): ToolItem[] {
    return this.tools;
  }

  addTool(tool: any): ToolItem {
    const newTool: ToolItem = {
      id: 'tool-' + Math.random().toString(36).substr(2, 9),
      name: tool.title || tool.name,
      category: tool.category || 'General',
      purpose: tool.description || tool.purpose,
      platform: tool.platform || 'Cross-Platform',
      license: tool.perk || tool.license || 'Free Academic License',
      official_link: tool.url || tool.official_link,
      recommended_stage: 'All Stages',
      icon: '🛠️'
    };
    this.tools.unshift(newTool);
    this.saveState();
    return newTool;
  }

  deleteTool(id: string): void {
    this.tools = this.tools.filter(t => t.id !== id);
    this.saveState();
  }

  getGallery(): GalleryItem[] {
    return this.gallery;
  }

  addGalleryItem(item: Omit<GalleryItem, 'id'>): GalleryItem {
    const newItem: GalleryItem = {
      ...item,
      id: 'gal-' + Math.random().toString(36).substr(2, 9)
    };
    this.gallery.unshift(newItem);
    this.saveState();
    return newItem;
  }

  deleteGalleryItem(id: string): void {
    this.gallery = this.gallery.filter(g => g.id !== id);
    this.saveState();
  }

  getAnnouncements(): AnnouncementItem[] {
    return this.announcements;
  }

  getCsecCouncilRoster(): CouncilMember[] {
    return CSEC_COUNCIL_ROSTER;
  }

  // --- ROADMAP COMPLETION & TRACKING ---
  toggleUserResourceComplete(userId: string, roadmapId: string, stageIdx: number, resIdx: number): { allStageCompleted: boolean; badgeName?: string } {
    const key = `rm_${userId}_${roadmapId}_${stageIdx}_${resIdx}`;
    const wasCompleted = typeof window !== 'undefined' ? localStorage.getItem(key) === 'true' : false;
    const nowCompleted = !wasCompleted;
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, String(nowCompleted));
    }

    const rm = this.roadmaps.find(r => r.id === roadmapId);
    const stage = rm?.stages[stageIdx];
    const total = stage?.resources.length || 1;
    const stats = this.getUserStageStats(userId, roadmapId, stageIdx, total);

    this.saveState();
    return {
      allStageCompleted: stats.isComplete,
      badgeName: stats.isComplete ? `${stage?.stage || 'Specialist'} Achievement Badge` : undefined
    };
  }

  getUserStageStats(userId?: string, roadmapId?: string, stageIdx?: number, total: number = 1) {
    if (!userId || !roadmapId || stageIdx === undefined) {
      return { completed: 0, total, percent: 0, isComplete: false };
    }
    let completed = 0;
    if (typeof window !== 'undefined') {
      for (let i = 0; i < total; i++) {
        if (localStorage.getItem(`rm_${userId}_${roadmapId}_${stageIdx}_${i}`) === 'true') {
          completed++;
        }
      }
    }
    const percent = Math.round((completed / (total || 1)) * 100);
    return { completed, total, percent, isComplete: completed >= total && total > 0 };
  }

  isResourceCompleted(userId?: string, roadmapId?: string, stageIdx?: number, resIdx?: number): boolean {
    if (!userId || !roadmapId || stageIdx === undefined || resIdx === undefined) return false;
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(`rm_${userId}_${roadmapId}_${stageIdx}_${resIdx}`) === 'true';
  }

  // --- EVENT FEEDBACK & INSTANT CERTIFICATE CLAIM ---
  submitFeedback(eventId: string, user: Profile, rating: number, comments: string): { success: boolean; certificate?: CertificateRecord } {
    const cert = this.issueCertificate(eventId, user.email, user.full_name, user);
    this.logAction('Submitted Event Feedback', `Rated ${rating}/5 for event`, user.role, user.full_name);
    return { success: true, certificate: cert };
  }

  // Global Dynamic Stats for Super Admin & University Analytics
  getGlobalStats() {
    const totalActiveMembers = this.memberships.filter(m => m.status === 'Active').length;
    const totalRegistrations = this.registrations.filter(r => r.status === 'registered').length;
    const totalAttendance = this.attendanceList.filter(a => a.status === 'Attended').length;
    const totalCerts = this.certificates.filter(c => c.status === 'Valid').length;
    const totalProjects = this.projects.length;
    const totalShowcased = this.projects.filter(p => p.publication_status === 'showcased').length;

    return {
      total_clubs: this.clubs.length,
      total_active_members: totalActiveMembers,
      total_events: this.events.length,
      total_registrations: totalRegistrations,
      total_attendance: totalAttendance,
      total_certificates: totalCerts,
      total_projects: totalProjects,
      total_showcased_projects: totalShowcased
    };
  }
}

export const dataService = new DataService();

/**
 * React Hook for seamless real-time synchronization across tabs and dashboards.
 * Causes the consuming component to re-render whenever any data changes in the central store.
 */
export function useCentralDataSync(): number {
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const handleSync = () => {
      setVersion(v => v + 1);
    };

    const unsubscribe = dataService.subscribe(handleSync);
    return () => {
      unsubscribe();
    };
  }, []);

  return version;
}