'use client';

import React, { useState } from 'react';
import { dataService, useCentralDataSync } from '@/lib/dataService';
import { useAuth } from '@/lib/authContext';
import {
  ShieldAlert,
  History,
  Search,
  CheckCircle2,
  Lock,
  Clock,
  User,
  Database
} from 'lucide-react';

export default function AdminAuditManagement() {
  useCentralDataSync();
  const { userProfile, currentRole } = useAuth();
  const logs = dataService.getAuditLogs(currentRole);
  const [search, setSearch] = useState('');

  const filtered = (logs || []).filter(l => {
    const q = (search || '').toLowerCase().trim();
    return (
      !q ||
      (l?.action || '').toLowerCase().includes(q) ||
      (l?.target || '').toLowerCase().includes(q) ||
      (l?.actor_name || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="coursue-card p-6 bg-gradient-to-r from-primary-900 via-[#0A2540] to-primary-800 text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-primary-200 text-[11px] font-bold tracking-wide uppercase">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Immutable Ledger & Security Trail</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              Platform-Wide Security Audit Logs & Action Stream
            </h1>
            <p className="text-xs text-primary-100/90 max-w-2xl leading-relaxed">
              Real-time audit records of all administrative actions, certificate issues, role modifications, project sanctions, and attendance check-ins.
            </p>
          </div>

          <span className="text-xs font-bold text-white bg-white/10 px-3 py-1.5 rounded-xl border border-white/20 shrink-0">
            Row-Level Security Enforced
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="coursue-card p-4">
        <div className="relative">
          <Search className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search audit trail by action, actor, or target entity..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-surface border border-surface-border rounded-xl focus:outline-none focus:border-primary-600 shadow-sm"
          />
        </div>
      </div>

      {/* Logs Table */}
      <div className="coursue-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="text-[10px] font-bold text-ink-muted uppercase tracking-wider bg-surface-muted border-b border-surface-border">
                <th className="py-3 px-4">Event / Action</th>
                <th className="py-3 px-3">Target Details</th>
                <th className="py-3 px-3">Actor / Stakeholder</th>
                <th className="py-3 px-3">Timestamp</th>
                <th className="py-3 px-4 text-right">Ledger Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-surface-subtle transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2 h-2 rounded-full ${
                        log.status === 'Success' ? 'bg-emerald-500' : 'bg-primary-500'
                      }`} />
                      <span className="font-bold text-ink">{log.action}</span>
                    </div>
                  </td>

                  <td className="py-3 px-3 text-ink-muted font-medium">
                    {log.target}
                  </td>

                  <td className="py-3 px-3">
                    <span className="text-[10px] font-mono text-primary-700 bg-primary-50 px-2 py-0.5 rounded-md border border-primary-100 font-bold">
                      {log.actor_name}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-ink-muted text-[11px] font-mono">
                    {log.timestamp}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{log.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
