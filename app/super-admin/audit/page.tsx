'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { dataService } from '@/lib/dataService';
import { useAuth } from '@/lib/authContext';
import { History, ShieldAlert, ArrowLeft, Search, CheckCircle2, Lock } from 'lucide-react';
import Link from 'next/link';

export default function AuditLogsPage() {
  const { currentRole, isAuthenticated } = useAuth();
  const isSuperAdmin = isAuthenticated && currentRole === 'super_admin';
  const auditLogs = dataService.getAuditLogs(currentRole);
  const [search, setSearch] = useState('');

  if (!isSuperAdmin) {
    return (
      <div className="min-h-screen flex flex-col bg-surface-muted">
        <Navbar />
        <main className="flex-1 max-w-md w-full mx-auto px-4 py-16 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-ink">Super Admin Authorization Required</h2>
          <p className="text-xs text-ink-muted">Audit trail ledger is restricted to platform Super Administrators.</p>
          <Link href="/dashboard/student" className="inline-block px-4 py-2 rounded-xl bg-primary-600 text-white text-xs font-bold">
            Return to Student Dashboard
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const filtered = auditLogs.filter(log =>
    log.action.toLowerCase().includes(search.toLowerCase()) ||
    log.target.toLowerCase().includes(search.toLowerCase()) ||
    log.actor_name.toLowerCase().includes(search.toLowerCase()) ||
    log.actor_role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-surface-muted">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <Link href="/dashboard/super-admin" className="inline-flex items-center gap-1.5 text-xs font-bold text-ink-muted hover:text-ink">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Super Admin Dashboard</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tag-pink text-pink-800 text-xs font-bold">
              <History className="w-3.5 h-3.5" />
              <span>Immutable System Ledger</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink">System Audit Trail & Security Logs</h1>
            <p className="text-xs text-ink-muted">
              Chronological log of all administrative actions, role updates, team approvals, and certificate issuances.
            </p>
          </div>
          <span className="text-xs font-bold text-primary-700 bg-primary-50 px-3 py-1.5 rounded-full border border-primary-100">
            {auditLogs.length} Logged Actions
          </span>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search audit actions, actors, or targets..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-surface border border-surface-border rounded-2xl focus:outline-none focus:border-primary-600 shadow-sm"
          />
        </div>

        {/* Audit Log Table */}
        <div className="coursue-card p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-bold text-ink-muted uppercase tracking-wider border-b border-surface-border">
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3">Action</th>
                  <th className="pb-3 px-3">Target / Entity</th>
                  <th className="pb-3 px-3">Actor / Role</th>
                  <th className="pb-3 px-3 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border text-xs">
                {filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-surface-subtle transition-colors">
                    <td className="py-3 px-3">
                      <span className={`w-2.5 h-2.5 rounded-full inline-block ${
                        log.status === 'Success' ? 'bg-emerald-500' : 'bg-primary-500'
                      }`} />
                    </td>
                    <td className="py-3 px-3 font-bold text-ink">{log.action}</td>
                    <td className="py-3 px-3 text-ink-muted max-w-xs truncate">{log.target}</td>
                    <td className="py-3 px-3">
                      <span className="text-[10px] font-semibold text-primary-700 bg-primary-50 px-2.5 py-0.5 rounded-full">
                        {log.actor_name} ({log.actor_role})
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-[11px] text-ink-muted">
                      {log.timestamp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
