'use client';

import React, { useState } from 'react';
import { dataService, useCentralDataSync } from '@/lib/dataService';
import { EventItem } from '@/lib/demoData';
import { exportToExcel } from '@/lib/excel';
import { useAuth } from '@/lib/authContext';
import QrScannerModal from '@/components/dashboard/QrScannerModal';
import EventPosterModal from '@/components/dashboard/EventPosterModal';
import {
  Calendar,
  PlusCircle,
  Search,
  Filter,
  Users,
  QrCode,
  Image as ImageIcon,
  Award,
  Download,
  Trash2,
  Edit,
  CheckCircle2,
  Clock,
  MapPin,
  X,
  ExternalLink,
  ShieldCheck,
  Check,
  Sparkles
} from 'lucide-react';

export default function AdminEventsManagement() {
  const { currentRole, userProfile } = useAuth();
  const dataVersion = useCentralDataSync();
  const events = dataService.getEvents();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterClub, setFilterClub] = useState('all');

  // Modals state
  const [selectedEventForRegs, setSelectedEventForRegs] = useState<EventItem | null>(null);
  const [selectedEventForScanner, setSelectedEventForScanner] = useState<EventItem | null>(null);
  const [selectedEventForPoster, setSelectedEventForPoster] = useState<EventItem | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState<EventItem | null>(null);

  // New Event Form State
  const [newTitle, setNewTitle] = useState('');
  const [newClub, setNewClub] = useState('CSEC Technical Club');
  const [newDate, setNewDate] = useState('2026-09-25');
  const [newTime, setNewTime] = useState('10:00 AM - 01:00 PM');
  const [newVenue, setNewVenue] = useState('Sir C.V. Raman Auditorium, Pragati University');
  const [newCategory, setNewCategory] = useState('Workshop');
  const [newSeats, setNewSeats] = useState(120);
  const [newPoints, setNewPoints] = useState(100);
  const [newDesc, setNewDesc] = useState('');

  const clubs = dataService.getClubs();

  // Filter events
  const filteredEvents = (events || []).filter((e) => {
    const q = (searchQuery || '').toLowerCase().trim();
    const matchesSearch =
      !q ||
      (e?.title || '').toLowerCase().includes(q) ||
      (e?.club_name || '').toLowerCase().includes(q) ||
      (e?.venue || '').toLowerCase().includes(q);
    const eventCategory = (e?.category || e?.event_type || '').toLowerCase();
    const matchesCategory = filterCategory === 'all' || eventCategory === filterCategory.toLowerCase();
    const matchesClub = filterClub === 'all' || e?.club_name === filterClub;
    return matchesSearch && matchesCategory && matchesClub;
  });

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newEvt: EventItem = {
      id: `evt-${Date.now()}`,
      title: newTitle,
      club_name: newClub,
      club_id: newClub.toLowerCase().includes('pragsoft') ? 'c-pragsoft' : newClub.toLowerCase().includes('arvr') ? 'c-arvr' : 'c-rotaract',
      date: newDate,
      time: newTime,
      start_time: `${newDate} ${newTime}`,
      end_time: `${newDate} ${newTime}`,
      venue: newVenue,
      category: newCategory,
      event_type: newCategory as any,
      capacity: Number(newSeats),
      seats_total: Number(newSeats),
      seats_filled: 0,
      registered_count: 0,
      points: Number(newPoints),
      eligibility: 'All Engineering Students',
      registration_deadline: newDate,
      description: newDesc || 'Join us for this exciting practical technical session organized by Pragati University.',
      banner_url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
      poster_url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
      tag_color: '#0A2540',
      status: 'Upcoming',
      is_registration_open: true,
      registered_users_count: 0
    };

    dataService.createEvent(newEvt, userProfile?.role || 'club_admin', userProfile);
    setShowCreateModal(false);
    setNewTitle('');
    setNewDesc('');
    alert(`Event "${newTitle}" successfully published!`);
  };

  const handleDeleteEvent = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete event "${title}"?`)) {
      dataService.deleteEvent(id, userProfile?.role || 'club_admin', userProfile);
      dataService.logAction('Deleted Event', title, userProfile?.role || 'club_admin', userProfile?.full_name);
    }
  };

  const handleExportRegistrations = (event: EventItem) => {
    const registrations = dataService.getRegistrationsForEvent(event.id);
    const data = registrations.map((r, i) => ({
      'S.No': i + 1,
      'Student Name': r.studentName || (r as any).student_name,
      'Roll Number': r.rollNumber || (r as any).roll_number,
      'Email': r.studentEmail || (r as any).student_email,
      'Department': r.department,
      'Event Title': event.title,
      'Club Name': event.club_name,
      'Registration Date': r.registeredAt || (r as any).registered_at,
      'Attendance Status': r.attended ? 'Attended' : 'Registered',
      'Certificate Issued': r.certificateIssued ? 'Issued' : 'Pending'
    }));

    exportToExcel(data, `${event.title.replace(/[^a-zA-Z0-9]/g, '_')}_Registrations.xlsx`, 'Registrations');
  };

  const handleIssueAllCertificates = (event: EventItem) => {
    const regs = dataService.getRegistrationsForEvent(event.id);
    regs.forEach(r => {
      dataService.issueCertificate(
        event.id,
        r.studentEmail || (r as any).student_email,
        r.studentName || (r as any).student_name,
        userProfile
      );
    });
    alert(`Successfully generated and issued verified certificates for all ${regs.length} confirmed attendees of ${event.title}!`);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="coursue-card p-6 bg-gradient-to-r from-primary-900 via-[#0A2540] to-primary-800 text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-primary-200 text-[11px] font-bold tracking-wide uppercase">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Administrative Event Management Module</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              Platform-Wide Events & Workshops Control Center
            </h1>
            <p className="text-xs text-primary-100/90 max-w-2xl leading-relaxed">
              Create, curate, publish, and govern all university technical events. Manage live attendee check-ins via QR scanner, generate instant promotional flyers, review registrations, and issue cryptographically verifiable credentials.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="self-start md:self-center px-4 py-2.5 rounded-xl bg-white text-primary-900 hover:bg-primary-50 text-xs font-bold flex items-center gap-2 shadow-float transition-all hover:scale-105 shrink-0"
          >
            <PlusCircle className="w-4 h-4 text-primary-700" />
            <span>Create New Event</span>
          </button>
        </div>
      </div>

      {/* Control & Search Bar */}
      <div className="coursue-card p-4 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by event title, organizing club, or venue..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-surface border border-surface-border rounded-xl focus:outline-none focus:border-primary-600 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="text-xs p-2 rounded-xl border border-surface-border bg-surface text-ink font-semibold focus:outline-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="Workshop">Workshops</option>
            <option value="Hackathon">Hackathons</option>
            <option value="Bootcamp">Bootcamps</option>
            <option value="Webinar">Webinars</option>
            <option value="Contest">Contests</option>
          </select>

          <select
            value={filterClub}
            onChange={(e) => setFilterClub(e.target.value)}
            className="text-xs p-2 rounded-xl border border-surface-border bg-surface text-ink font-semibold focus:outline-none cursor-pointer"
          >
            <option value="all">All Organizing Clubs</option>
            {clubs.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <span className="text-xs font-bold text-primary-700 bg-primary-50 px-3 py-2 rounded-xl border border-primary-100 whitespace-nowrap">
            {filteredEvents.length} Events Total
          </span>
        </div>
      </div>

      {/* Event Management Table */}
      <div className="coursue-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-bold text-ink-muted uppercase tracking-wider bg-surface-muted border-b border-surface-border">
                <th className="py-3 px-4">Event Details</th>
                <th className="py-3 px-3">Organizing Club</th>
                <th className="py-3 px-3">Date & Venue</th>
                <th className="py-3 px-3">Capacity / Status</th>
                <th className="py-3 px-4 text-right">Administrative Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border text-xs">
              {filteredEvents.map((evt) => {
                const totalSeats = evt.seats_total || evt.capacity || 100;
                const regs = dataService.getRegistrationsForEvent(evt.id);
                const isFull = regs.length >= totalSeats;

                return (
                  <tr key={evt.id} className="hover:bg-surface-subtle transition-colors">
                    {/* Event Details */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={evt.banner_url || evt.poster_url || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80'}
                          alt={evt.title}
                          className="w-12 h-12 rounded-xl object-cover ring-1 ring-surface-border shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-ink hover:text-primary-600 transition-colors truncate">
                              {evt.title}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-tag-blue text-primary-700 shrink-0">
                              {evt.category || evt.event_type}
                            </span>
                          </div>
                          <p className="text-[11px] text-ink-muted line-clamp-1 mt-0.5">
                            {evt.description}
                          </p>
                          <span className="text-[10px] font-mono text-primary-600 font-semibold">
                            +{evt.points || 100} Activity Points
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Club */}
                    <td className="py-3.5 px-3">
                      <span className="font-semibold text-ink text-xs">{evt.club_name}</span>
                    </td>

                    {/* Date & Venue */}
                    <td className="py-3.5 px-3">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-ink font-semibold">
                          <Calendar className="w-3.5 h-3.5 text-primary-600" />
                          <span>{evt.date || evt.start_time?.split(' ')[0]}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-ink-muted">
                          <MapPin className="w-3 h-3 text-ink-muted shrink-0" />
                          <span className="truncate max-w-[140px]">{evt.venue}</span>
                        </div>
                      </div>
                    </td>

                    {/* Capacity & Status */}
                    <td className="py-3.5 px-3">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-ink">{regs.length} / {totalSeats}</span>
                          <span className="text-[10px] text-ink-muted">
                            {Math.round((regs.length / totalSeats) * 100)}%
                          </span>
                        </div>
                        <div className="w-24 bg-surface-muted rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              isFull ? 'bg-amber-500' : 'bg-primary-600'
                            }`}
                            style={{ width: `${Math.min(100, (regs.length / totalSeats) * 100)}%` }}
                          />
                        </div>
                        <span className={`inline-block text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          evt.status === 'Completed'
                            ? 'bg-slate-100 text-slate-700'
                            : evt.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-primary-50 text-primary-700'
                        }`}>
                          {evt.status}
                        </span>
                      </div>
                    </td>

                    {/* Administrative Action Suite */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 flex-wrap">
                        {/* View Registrations */}
                        <button
                          onClick={() => setSelectedEventForRegs(evt)}
                          title="Manage Registrations & Attendees"
                          className="p-2 rounded-lg bg-surface border border-surface-border text-ink hover:text-primary-600 hover:border-primary-300 shadow-xs transition-colors flex items-center gap-1 text-[11px] font-semibold"
                        >
                          <Users className="w-3.5 h-3.5 text-primary-600" />
                          <span>Attendees ({regs.length})</span>
                        </button>

                        {/* QR Scanner */}
                        <button
                          onClick={() => setSelectedEventForScanner(evt)}
                          title="Launch Live QR Check-in Scanner"
                          className="p-2 rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-100 border border-primary-200 transition-colors"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                        </button>

                        {/* Auto Poster */}
                        <button
                          onClick={() => setSelectedEventForPoster(evt)}
                          title="Generate Auto Poster Flyer"
                          className="p-2 rounded-lg bg-tag-pink text-pink-700 hover:bg-pink-100 border border-pink-200 transition-colors"
                        >
                          <ImageIcon className="w-3.5 h-3.5" />
                        </button>

                        {/* Issue Certificates */}
                        <button
                          onClick={() => handleIssueAllCertificates(evt)}
                          title="Trigger E-Certificates for Attendees"
                          className="p-2 rounded-lg bg-tag-teal text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                        >
                          <Award className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDeleteEvent(evt.id, evt.title)}
                          title="Delete Event"
                          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 1. Modal: Create New Event */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-xl w-full bg-surface rounded-3xl p-6 border border-surface-border shadow-float space-y-4 my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center font-bold">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-ink">Publish New Technical Event</h3>
                  <p className="text-[11px] text-ink-muted">Set scheduling, seats, and points</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 rounded-lg text-ink-muted hover:bg-surface-muted"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-ink mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. AI-Powered Autonomous Drone Systems"
                  className="w-full p-2.5 bg-surface border border-surface-border rounded-xl focus:border-primary-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-ink mb-1">Organizing Club</label>
                  <select
                    value={newClub}
                    onChange={(e) => setNewClub(e.target.value)}
                    className="w-full p-2.5 bg-surface border border-surface-border rounded-xl focus:border-primary-600 focus:outline-none"
                  >
                    {clubs.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-ink mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full p-2.5 bg-surface border border-surface-border rounded-xl focus:border-primary-600 focus:outline-none"
                  >
                    <option value="Workshop">Workshop</option>
                    <option value="Hackathon">Hackathon</option>
                    <option value="Bootcamp">Bootcamp</option>
                    <option value="Webinar">Webinar</option>
                    <option value="Contest">Contest</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-ink mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full p-2.5 bg-surface border border-surface-border rounded-xl focus:border-primary-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-ink mb-1">Time Range</label>
                  <input
                    type="text"
                    required
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    placeholder="09:00 AM - 04:00 PM"
                    className="w-full p-2.5 bg-surface border border-surface-border rounded-xl focus:border-primary-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">Campus Venue</label>
                <input
                  type="text"
                  required
                  value={newVenue}
                  onChange={(e) => setNewVenue(e.target.value)}
                  placeholder="Main Block Seminar Hall, Pragati University"
                  className="w-full p-2.5 bg-surface border border-surface-border rounded-xl focus:border-primary-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-ink mb-1">Total Capacity / Seats</label>
                  <input
                    type="number"
                    min="10"
                    max="1000"
                    value={newSeats}
                    onChange={(e) => setNewSeats(Number(e.target.value))}
                    className="w-full p-2.5 bg-surface border border-surface-border rounded-xl focus:border-primary-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-ink mb-1">Activity Points Awarded</label>
                  <input
                    type="number"
                    min="0"
                    max="500"
                    value={newPoints}
                    onChange={(e) => setNewPoints(Number(e.target.value))}
                    className="w-full p-2.5 bg-surface border border-surface-border rounded-xl focus:border-primary-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">Description & Key Highlights</label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Provide syllabus, prerequisites, and learning outcomes..."
                  className="w-full p-2.5 bg-surface border border-surface-border rounded-xl focus:border-primary-600 focus:outline-none resize-none"
                />
              </div>

              <div className="pt-3 border-t border-surface-border flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-ink-muted hover:bg-surface-subtle font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold shadow-sm"
                >
                  Publish Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Modal / Drawer: Manage Registrations */}
      {selectedEventForRegs && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-3xl w-full bg-surface rounded-3xl p-6 border border-surface-border shadow-float space-y-4 my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between pb-3 border-b border-surface-border">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-ink">{selectedEventForRegs.title}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-50 text-primary-700">
                    {selectedEventForRegs.club_name}
                  </span>
                </div>
                <p className="text-xs text-ink-muted mt-0.5">
                  Attendee Roster & Certificate Issuance Registry • {dataService.getRegistrationsForEvent(selectedEventForRegs.id).length} registered students
                </p>
              </div>
              <button
                onClick={() => setSelectedEventForRegs(null)}
                className="p-1.5 rounded-lg text-ink-muted hover:bg-surface-muted"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-surface-muted rounded-2xl">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-ink">Total Confirmed:</span>
                <span className="text-xs font-bold text-primary-700 bg-primary-50 px-2 py-0.5 rounded-md border border-primary-100">
                  {dataService.getRegistrationsForEvent(selectedEventForRegs.id).length} / {selectedEventForRegs.seats_total} Seats
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleExportRegistrations(selectedEventForRegs)}
                  className="px-3 py-1.5 rounded-xl bg-surface border border-surface-border hover:bg-surface-subtle text-xs font-bold text-ink flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-primary-600" />
                  <span>Export Excel</span>
                </button>

                <button
                  onClick={() => handleIssueAllCertificates(selectedEventForRegs)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Issue All Certificates</span>
                </button>
              </div>
            </div>

            {/* Registered Users Table */}
            <div className="overflow-x-auto max-h-80 overflow-y-auto border border-surface-border rounded-2xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="text-[10px] font-bold text-ink-muted uppercase tracking-wider bg-surface-muted sticky top-0 border-b border-surface-border">
                    <th className="py-2.5 px-3">Student Name</th>
                    <th className="py-2.5 px-3">Roll Number</th>
                    <th className="py-2.5 px-3">Department</th>
                    <th className="py-2.5 px-3">Registered At</th>
                    <th className="py-2.5 px-3">Attendance</th>
                    <th className="py-2.5 px-3 text-right">Certificate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {dataService.getRegistrationsForEvent(selectedEventForRegs.id).map((reg) => (
                    <tr key={reg.id} className="hover:bg-surface-subtle transition-colors">
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-ink">{reg.studentName}</div>
                        <div className="text-[10px] text-ink-muted font-mono">{reg.studentEmail}</div>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-primary-700 font-bold">{reg.rollNumber}</td>
                      <td className="py-2.5 px-3 text-ink-muted">{reg.department}</td>
                      <td className="py-2.5 px-3 text-[10px] text-ink-muted">{reg.registeredAt}</td>
                      <td className="py-2.5 px-3">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          reg.attended ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {reg.attended ? <Check className="w-3 h-3" /> : null}
                          <span>{reg.attended ? 'Attended (QR)' : 'Registered'}</span>
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {reg.certificateIssued ? (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            Issued ✓
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              dataService.issueCertificate(selectedEventForRegs.id, reg.studentEmail, reg.studentName, userProfile);
                              alert(`Issued verified certificate to ${reg.studentName}!`);
                            }}
                            className="text-[10px] font-bold text-primary-700 hover:text-primary-800 bg-primary-50 px-2 py-0.5 rounded-md border border-primary-200 cursor-pointer"
                          >
                            Issue Now
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedEventForRegs(null)}
                className="px-4 py-2 rounded-xl bg-surface border border-surface-border text-xs font-bold text-ink cursor-pointer"
              >
                Close Roster
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Scanner Modal */}
      {selectedEventForScanner && (
        <QrScannerModal
          eventId={selectedEventForScanner.id}
          eventTitle={selectedEventForScanner.title}
          isOpen={!!selectedEventForScanner}
          onClose={() => {
            setSelectedEventForScanner(null);
          }}
        />
      )}

      {/* Event Poster Modal */}
      {selectedEventForPoster && (
        <EventPosterModal
          event={selectedEventForPoster}
          isOpen={!!selectedEventForPoster}
          onClose={() => setSelectedEventForPoster(null)}
        />
      )}
    </div>
  );
}
