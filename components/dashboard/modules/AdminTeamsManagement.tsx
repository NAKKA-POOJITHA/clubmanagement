'use client';

import React, { useState } from 'react';
import { dataService, useCentralDataSync } from '@/lib/dataService';
import { useAuth } from '@/lib/authContext';
import {
  Users,
  PlusCircle,
  ShieldCheck,
  Award,
  CheckCircle2,
  Mail,
  Linkedin,
  Github,
  Trash2,
  X
} from 'lucide-react';

interface Officer {
  id: string;
  name: string;
  role: string;
  club: string;
  department: string;
  year: string;
  email: string;
  photo: string;
  status: 'active' | 'pending';
}

export default function AdminTeamsManagement() {
  useCentralDataSync();
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'csec' | 'pragsoft' | 'arvr' | 'rotaract'>('csec');
  const officers: Officer[] = dataService.getOfficers();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('Executive Member');
  const [newClub, setNewClub] = useState('CSEC Technical Club');
  const [newDept, setNewDept] = useState('Computer Science & Engineering');
  const [newEmail, setNewEmail] = useState('');

  const clubs = dataService.getClubs();

  const handleAddOfficer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    dataService.addOfficer({
      name: newName,
      role: newRole,
      club: newClub,
      department: newDept,
      year: 'Academic Year 2026-2027',
      email: newEmail || `${newName.toLowerCase().replace(/\s+/g, '.')}@pragati.ac.in`,
      photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
      status: 'active'
    });

    setShowAddModal(false);
    setNewName('');
    alert(`Appointed ${newName} as ${newRole} for ${newClub}!`);
  };

  const handleRemoveOfficer = (id: string, name: string) => {
    if (confirm(`Remove ${name} from executive council?`)) {
      dataService.removeOfficer(id);
    }
  };

  const clubNameMap: Record<string, string> = {
    csec: 'CSEC Technical Club',
    pragsoft: 'PRAGSOFT Innovation Hub',
    arvr: 'AR/VR & Metaverse Club',
    rotaract: 'Rotaract Club of Pragati'
  };

  const currentClubName = clubNameMap[activeTab];
  const filteredOfficers = (officers || []).filter(o => o.club === currentClubName || (o?.club || '').toLowerCase().includes(activeTab || ''));

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="coursue-card p-6 bg-gradient-to-r from-primary-900 via-[#0A2540] to-primary-800 text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-primary-200 text-[11px] font-bold tracking-wide uppercase">
              <Users className="w-3.5 h-3.5" />
              <span>Leadership & Council Governance</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              Executive Council & Club Officer Roster Administration
            </h1>
            <p className="text-xs text-primary-100/90 max-w-2xl leading-relaxed">
              Appoint student executives, ratify faculty coordinators, manage department tenure records for 2026-2027, and maintain verified leadership directories.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="self-start md:self-center px-4 py-2.5 rounded-xl bg-white text-primary-900 hover:bg-primary-50 text-xs font-bold flex items-center gap-2 shadow-float transition-all hover:scale-105 shrink-0"
          >
            <PlusCircle className="w-4 h-4 text-primary-700" />
            <span>Appoint New Officer</span>
          </button>
        </div>
      </div>

      {/* Club Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-surface-border">
        <button
          onClick={() => setActiveTab('csec')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'csec'
              ? 'bg-[#0A2540] text-white shadow-sm'
              : 'bg-surface text-ink-muted hover:text-ink border border-surface-border'
          }`}
        >
          ⚡ CSEC Club (24 Officers)
        </button>

        <button
          onClick={() => setActiveTab('pragsoft')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'pragsoft'
              ? 'bg-[#0A2540] text-white shadow-sm'
              : 'bg-surface text-ink-muted hover:text-ink border border-surface-border'
          }`}
        >
          🚀 PRAGSOFT Innovation Hub
        </button>

        <button
          onClick={() => setActiveTab('arvr')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'arvr'
              ? 'bg-[#0A2540] text-white shadow-sm'
              : 'bg-surface text-ink-muted hover:text-ink border border-surface-border'
          }`}
        >
          🥽 AR/VR & Metaverse Club
        </button>

        <button
          onClick={() => setActiveTab('rotaract')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'rotaract'
              ? 'bg-[#0A2540] text-white shadow-sm'
              : 'bg-surface text-ink-muted hover:text-ink border border-surface-border'
          }`}
        >
          🤝 Rotaract Club of Pragati
        </button>
      </div>

      {/* Officers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOfficers.map((officer) => (
          <div key={officer.id} className="coursue-card p-5 space-y-4 hover:shadow-md transition-all flex flex-col justify-between">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={officer.photo}
                  alt={officer.name}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-primary-100 shrink-0"
                />
                <div>
                  <h3 className="text-sm font-bold text-ink">{officer.name}</h3>
                  <p className="text-xs font-semibold text-primary-700">{officer.role}</p>
                  <p className="text-[10px] text-ink-muted font-mono">{officer.email}</p>
                </div>
              </div>

              <button
                onClick={() => handleRemoveOfficer(officer.id, officer.name)}
                className="p-1.5 rounded-lg text-ink-muted hover:text-red-600 hover:bg-red-50"
                title="Remove Officer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="pt-3 border-t border-surface-border flex items-center justify-between text-[11px] text-ink-muted">
              <span>{officer.department}</span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                Tenure 2026-2027 Confirmed ✓
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Appoint Officer */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-md w-full bg-surface rounded-3xl p-6 border border-surface-border shadow-float space-y-4 my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <h3 className="text-sm font-bold text-ink">Appoint Executive Officer</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-ink-muted">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddOfficer} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-ink mb-1">Student Full Name *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. K. Sai Krishna"
                  className="w-full p-2.5 bg-surface border border-surface-border rounded-xl focus:border-primary-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">Designation / Executive Role</label>
                <input
                  type="text"
                  required
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  placeholder="e.g. Technical Secretary & Hackathon Lead"
                  className="w-full p-2.5 bg-surface border border-surface-border rounded-xl focus:border-primary-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">Club Organization</label>
                <select
                  value={newClub}
                  onChange={(e) => setNewClub(e.target.value)}
                  className="w-full p-2.5 bg-surface border border-surface-border rounded-xl focus:border-primary-600 focus:outline-none"
                >
                  {clubs.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">Department</label>
                <input
                  type="text"
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  className="w-full p-2.5 bg-surface border border-surface-border rounded-xl focus:border-primary-600 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-3 py-1.5 text-ink-muted">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-xl font-bold">
                  Appoint Officer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
