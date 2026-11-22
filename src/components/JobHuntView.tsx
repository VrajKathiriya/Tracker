'use client';

import React, { useState } from 'react';
import { 
  Briefcase, 
  Plus, 
  ExternalLink, 
  X, 
  AlertOctagon, 
  Building, 
  UserCheck, 
  Filter,
  Trash2
} from 'lucide-react';
import { JobApplication, ApplicationTier, ApplicationStatus } from '@/lib/types';
import { saveJobApplication, updateJobApplication, deleteJobApplication } from '@/lib/storage';

interface JobHuntViewProps {
  applications: JobApplication[];
  onRefresh: () => void;
}

const DEFAULT_TARGET_COMPANIES = [
  { company: 'Amazon', tier: 'FAANG-tier', role: 'SDE-1 / SDE-2' },
  { company: 'Microsoft', tier: 'FAANG-tier', role: 'SDE-2' },
  { company: 'Razorpay', tier: 'Strong Startup', role: 'SDE-2 (Machine Coding & Agentic)' },
  { company: 'CRED', tier: 'Strong Startup', role: 'SDE-2 (30+ LPA)' },
  { company: 'Swiggy', tier: 'Strong Startup', role: 'SDE-2' },
  { company: 'Zomato', tier: 'Strong Startup', role: 'SDE-2' },
];

export function JobHuntView({ applications, onRefresh }: JobHuntViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('SDE-1 / SDE-2');
  const [tier, setTier] = useState<ApplicationTier>('Strong Startup');
  const [contactPerson, setContactPerson] = useState('');
  const [contactPlatform, setContactPlatform] = useState('GTU Alumni / LinkedIn');
  const [status, setStatus] = useState<ApplicationStatus>('Identified');
  const [rejectionCause, setRejectionCause] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim()) return;
    setIsSubmitting(true);
    try {
      await saveJobApplication({
        company: company.trim(),
        role: role.trim(),
        tier,
        contact_person: contactPerson.trim() || undefined,
        contact_platform: contactPlatform.trim() || undefined,
        status,
        rejection_cause: rejectionCause.trim() || undefined,
        notes: notes.trim() || undefined,
        applied_date: new Date().toISOString().split('T')[0],
      });
      setIsModalOpen(false);
      setCompany('');
      setRejectionCause('');
      setNotes('');
      onRefresh();
    } catch (err) {
      console.error('Failed to save application:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async (app: JobApplication, newStatus: ApplicationStatus) => {
    await updateJobApplication({ ...app, status: newStatus });
    onRefresh();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this application record?')) {
      await deleteJobApplication(id);
      onRefresh();
    }
  };

  const getTierBadge = (t: ApplicationTier) => {
    switch (t) {
      case 'FAANG-tier':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">FAANG (Month 9-10)</span>;
      case 'Strong Startup':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Strong Startup (30+ LPA)</span>;
      case 'Practice':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-zinc-800 text-zinc-300">Practice (Months 7-8)</span>;
    }
  };

  const getStatusColor = (st: ApplicationStatus) => {
    switch (st) {
      case 'Offer': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Interview': return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
      case 'OA': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'Applied': return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
      case 'Referral Requested': return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      case 'Rejected': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      default: return 'text-zinc-400 bg-zinc-800 border-zinc-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Briefcase className="w-5 h-5" />
              </span>
              <h2 className="text-base font-semibold text-white">Outreach &amp; Application Pipeline</h2>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              &quot;Two interviews from 200 applications says the funnel breaks before the interview. Stop mass-applying, get referrals.&quot;
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs-600/30 transition self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> Add Company Application
          </button>
        </div>

        {/* Sequencing Rules from Roadmap */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-zinc-950/60 border border-zinc-850 rounded-xl">
            <span className="font-semibold text-zinc-200">1. Practice Tier (Months 7-8)</span>
            <p className="text-zinc-400 text-[11px] mt-1">Mid-tier product companies &amp; startups for real interview feedback at zero cooldown cost.</p>
          </div>
          <div className="p-3 bg-zinc-950/60 border border-zinc-850 rounded-xl">
            <span className="font-semibold text-emerald-300">2. Strong Startups (Months 8-9)</span>
            <p className="text-zinc-400 text-[11px] mt-1">Razorpay, CRED, Swiggy, Zomato: 30+ LPA chances with machine coding drills.</p>
          </div>
          <div className="p-3 bg-zinc-950/60 border border-zinc-850 rounded-xl">
            <span className="font-semibold text-amber-300">3. FAANG-Tier (Months 9-10)</span>
            <p className="text-zinc-400 text-[11px] mt-1">Amazon &amp; Microsoft: Apply through referrals only after passing Month 8 gate.</p>
          </div>
        </div>
      </div>

      {/* Target Companies Quick-Add Suggestions */}
      {applications.length === 0 && (
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-5">
          <h3 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider mb-3">
            Suggested Target Companies from Roadmap
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {DEFAULT_TARGET_COMPANIES.map((c) => (
              <div
                key={c.company}
                onClick={() => {
                  setCompany(c.company);
                  setTier(c.tier as ApplicationTier);
                  setRole(c.role);
                  setIsModalOpen(true);
                }}
                className="p-3 bg-zinc-950/60 border border-zinc-850 rounded-xl hover:border-zinc-700 cursor-pointer flex items-center justify-between transition"
              >
                <div>
                  <div className="font-semibold text-sm text-zinc-100">{c.company}</div>
                  <div className="text-[11px] text-zinc-500">{c.role}</div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                  {c.tier}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pipeline List */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-5">
        <h3 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider mb-4 flex items-center justify-between">
          <span>Active Applications ({applications.length})</span>
          <span className="text-zinc-500 font-normal">Target: 30-40 Companies</span>
        </h3>

        {applications.length === 0 ? (
          <div className="text-center py-10 text-zinc-500 text-xs">
            No applications logged yet. Click &quot;Add Company Application&quot; or select one of the suggested companies above.
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => (
              <div
                key={app.id}
                className="p-4 bg-zinc-950/70 border border-zinc-850 rounded-xl space-y-2 hover:border-zinc-700 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-zinc-400" />
                    <span className="font-semibold text-sm text-white">{app.company}</span>
                    <span className="text-xs text-zinc-400">({app.role})</span>
                    {getTierBadge(app.tier)}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Status dropdown */}
                    <select
                      value={app.status}
                      onChange={(e) => handleUpdateStatus(app, e.target.value as ApplicationStatus)}
                      className={`text-xs px-2.5 py-1 rounded-lg border font-semibold focus:outline-none cursor-pointer ${getStatusColor(app.status)}`}
                    >
                      <option value="Identified">Identified</option>
                      <option value="Referral Requested">Referral Requested</option>
                      <option value="Applied">Applied</option>
                      <option value="OA">OA (Online Assessment)</option>
                      <option value="Interview">Interview Loop</option>
                      <option value="Offer">Offer Received</option>
                      <option value="Rejected">Rejected</option>
                    </select>

                    <button
                      onClick={() => handleDelete(app.id)}
                      className="p-1 text-zinc-600 hover:text-rose-400 transition"
                      title="Delete entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-400">
                  {app.contact_person && (
                    <span className="flex items-center gap-1 text-zinc-300">
                      <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                      {app.contact_person} ({app.contact_platform})
                    </span>
                  )}
                  {app.applied_date && (
                    <span className="text-zinc-500 font-mono text-[11px]">
                      Applied: {app.applied_date}
                    </span>
                  )}
                </div>

                {/* Rejection Root Cause mapping (Crucial Roadmap Rule) */}
                {app.status === 'Rejected' && (
                  <div className="p-2.5 bg-rose-950/20 border border-rose-800/40 rounded-lg text-xs text-rose-300">
                    <span className="font-semibold flex items-center gap-1 text-rose-400 mb-0.5">
                      <AlertOctagon className="w-3.5 h-3.5" /> Rejection Root Cause Mapped:
                    </span>
                    <p className="text-zinc-300">{app.rejection_cause || 'No root cause noted yet. (Rule: Map rejection to DSA, Design, or Resume weakness).'}</p>
                  </div>
                )}

                {app.notes && (
                  <p className="text-xs text-zinc-400 bg-zinc-900/60 p-2 rounded-lg border border-zinc-800/50">
                    {app.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Application Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-lg p-6 text-zinc-100">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-400" /> Add Target Company / Application
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Company Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Amazon, Razorpay"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Target Role</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Company Tier</label>
                  <select
                    value={tier}
                    onChange={(e) => setTier(e.target.value as ApplicationTier)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Practice">Practice (Months 7-8)</option>
                    <option value="Strong Startup">Strong Startup (Months 8-9)</option>
                    <option value="FAANG-tier">FAANG-tier (Months 9-10)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Identified">Identified</option>
                    <option value="Referral Requested">Referral Requested</option>
                    <option value="Applied">Applied</option>
                    <option value="OA">OA</option>
                    <option value="Interview">Interview</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Referral / Contact Person</label>
                  <input
                    type="text"
                    placeholder="e.g., Ex-colleague, GTU Alumni"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Platform</label>
                  <input
                    type="text"
                    placeholder="e.g., LinkedIn, WhatsApp, Referral"
                    value={contactPlatform}
                    onChange={(e) => setContactPlatform(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {status === 'Rejected' && (
                <div>
                  <label className="block text-rose-300 font-medium mb-1">
                    Rejection Root Cause (Roadmap Rule)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Missed DP optimization in coding round; needed more LLD trade-off depth"
                    value={rejectionCause}
                    onChange={(e) => setRejectionCause(e.target.value)}
                    className="w-full bg-zinc-950 border border-rose-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-rose-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Notes / Next Steps</label>
                <textarea
                  rows={2}
                  placeholder="Notes, job link, recruiter feedback..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-600/30"
                >
                  {isSubmitting ? 'Saving...' : 'Save Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
