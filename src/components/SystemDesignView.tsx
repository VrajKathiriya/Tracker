'use client';

import React, { useState } from 'react';
import { 
  Layers, 
  Plus, 
  Clock, 
  Mic, 
  CheckCircle2, 
  Code, 
  X, 
  FileText,
  ListOrdered
} from 'lucide-react';
import { SystemDesignLog, DesignType } from '@/lib/types';
import { saveSystemDesignLog } from '@/lib/storage';

interface SystemDesignViewProps {
  logs: SystemDesignLog[];
  onRefresh: () => void;
}

const COMMON_DESIGNS = [
  { name: 'URL Shortener (TinyURL)', type: 'HLD', phase: 'Month 1-2' },
  { name: 'Rate Limiter (Token Bucket / Sliding Window)', type: 'HLD', phase: 'Month 2' },
  { name: 'Distributed Unique ID Generator (Snowflake)', type: 'HLD', phase: 'Month 3' },
  { name: 'Distributed Key-Value Store (Dynamo)', type: 'HLD', phase: 'Month 3' },
  { name: 'Notification System', type: 'HLD', phase: 'Month 3' },
  { name: 'Distributed Web Crawler', type: 'HLD', phase: 'Month 4' },
  { name: 'News Feed System', type: 'HLD', phase: 'Month 4' },
  { name: 'Chat Application (WhatsApp / Slack)', type: 'HLD', phase: 'Month 4' },
  { name: 'Search Autocomplete (Trie)', type: 'HLD', phase: 'Month 4' },
  { name: 'Payment System (Idempotency & Retries)', type: 'HLD', phase: 'Month 5' },
  { name: 'File Sync (Dropbox / Google Drive)', type: 'HLD', phase: 'Month 5' },
  { name: 'Video Streaming (YouTube / Netflix)', type: 'HLD', phase: 'Month 5' },
  { name: 'Ticket Booking System (Concurrency & Locks)', type: 'HLD', phase: 'Month 5' },
  { name: 'Enterprise RAG Platform / LLM Gateway', type: 'AI_SYSTEM', phase: 'Month 6-8' },
  { name: 'Parking Lot System', type: 'LLD', phase: 'Month 6' },
  { name: 'LRU Cache with Pluggable Eviction', type: 'LLD', phase: 'Month 6' },
  { name: 'Splitwise (Expense Sharing)', type: 'LLD', phase: 'Month 7' },
  { name: 'In-Memory Key-Value DB with Transactions', type: 'LLD', phase: 'Month 7' },
  { name: 'Distributed Task Scheduler', type: 'LLD', phase: 'Month 7' },
  { name: 'Elevator Control System', type: 'LLD', phase: 'Month 7' },
  { name: 'BookMyShow (Movie Ticket Booking)', type: 'LLD', phase: 'Month 7' },
];

export function SystemDesignView({ logs, onRefresh }: SystemDesignViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [designType, setDesignType] = useState<DesignType>('HLD');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [isTimed, setIsTimed] = useState(true);
  const [recordedOutLoud, setRecordedOutLoud] = useState(false);
  const [frameworkFollowed, setFrameworkFollowed] = useState(true);
  const [notes, setNotes] = useState('');
  const [practicedDate, setPracticedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setIsSubmitting(true);
    try {
      await saveSystemDesignLog({
        title: title.trim(),
        design_type: designType,
        duration_minutes: Number(durationMinutes),
        is_timed: isTimed,
        recorded_out_loud: recordedOutLoud,
        framework_followed: frameworkFollowed,
        notes: notes.trim() || undefined,
        practiced_date: practicedDate,
      });
      setIsModalOpen(false);
      setTitle('');
      setNotes('');
      onRefresh();
    } catch (err) {
      console.error('Failed to save system design log:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const hldCount = logs.filter(l => l.design_type === 'HLD').length;
  const lldCount = logs.filter(l => l.design_type === 'LLD').length;
  const aiSysCount = logs.filter(l => l.design_type === 'AI_SYSTEM').length;

  return (
    <div className="space-y-6">
      {/* Header and Stats */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
          <div>
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400" />
              <span>System Design &amp; LLD Practice Log</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Target: 15+ HLD designs &amp; 10+ LLD problems timed under 45/90 minutes with trade-offs.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-600/30 transition self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> Log Design Session
          </button>
        </div>

        {/* Counter Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
          <div className="p-3 bg-zinc-950/60 border border-zinc-800/80 rounded-xl text-center">
            <span className="text-[10px] uppercase font-semibold text-zinc-500">HLD Designs Completed</span>
            <div className="text-xl font-bold font-mono text-blue-400 mt-0.5">{hldCount}</div>
            <span className="text-[10px] text-zinc-500">Target: 15+ by Month 8</span>
          </div>
          <div className="p-3 bg-zinc-950/60 border border-zinc-800/80 rounded-xl text-center">
            <span className="text-[10px] uppercase font-semibold text-zinc-500">LLD / Machine Coding</span>
            <div className="text-xl font-bold font-mono text-purple-400 mt-0.5">{lldCount}</div>
            <span className="text-[10px] text-zinc-500">Target: 10+ with tests</span>
          </div>
          <div className="p-3 bg-zinc-950/60 border border-zinc-800/80 rounded-xl text-center">
            <span className="text-[10px] uppercase font-semibold text-zinc-500">AI Systems</span>
            <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">{aiSysCount}</div>
            <span className="text-[10px] text-zinc-500">RAG &amp; Gateway designs</span>
          </div>
          <div className="p-3 bg-zinc-950/60 border border-zinc-800/80 rounded-xl text-center">
            <span className="text-[10px] uppercase font-semibold text-zinc-500">Recorded Out Loud</span>
            <div className="text-xl font-bold font-mono text-pink-400 mt-0.5">
              {logs.filter(l => l.recorded_out_loud).length}
            </div>
            <span className="text-[10px] text-zinc-500">2-min spoken delivery</span>
          </div>
        </div>
      </div>

      {/* Suggested Systems Checklist from Roadmap */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 shadow-xl">
        <h3 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider mb-3 flex items-center gap-2">
          <ListOrdered className="w-4 h-4 text-indigo-400" />
          <span>Roadmap Target Systems Checklist</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {COMMON_DESIGNS.map((item) => {
            const hasDone = logs.some(l => l.title.toLowerCase().includes(item.name.toLowerCase().split('(')[0].trim()));
            return (
              <div 
                key={item.name}
                onClick={() => {
                  setTitle(item.name);
                  setDesignType(item.type as DesignType);
                  setIsModalOpen(true);
                }}
                className={`p-2.5 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition ${
                  hasDone 
                    ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200 hover:bg-emerald-900/30' 
                    : 'bg-zinc-950/60 border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                <div className="truncate mr-2">
                  <div className="font-medium truncate">{item.name}</div>
                  <div className="text-[10px] text-zinc-500">{item.phase}</div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                    {item.type}
                  </span>
                  {hasDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Practice Log History */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 shadow-xl">
        <h3 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider mb-3">
          Completed Design Sessions ({logs.length})
        </h3>
        {logs.length === 0 ? (
          <div className="text-center py-10 text-zinc-500 text-xs">
            No design sessions logged yet. Pick one of the suggested systems above to record your first session!
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => (
              <div key={log.id} className="p-3.5 bg-zinc-950/70 border border-zinc-850 rounded-xl space-y-1.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                      log.design_type === 'HLD' 
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                        : log.design_type === 'LLD'
                          ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    }`}>
                      {log.design_type}
                    </span>
                    <span className="font-semibold text-sm text-zinc-100">{log.title}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <span className="font-mono text-[11px]">{log.duration_minutes} mins</span>
                    {log.is_timed && <span className="text-[10px] text-zinc-400 bg-zinc-900 px-1.5 py-0.5 rounded">Timed</span>}
                    {log.recorded_out_loud && (
                      <span className="text-[10px] text-pink-400 bg-pink-500/10 border border-pink-500/20 px-1.5 py-0.5 rounded flex items-center gap-1">
                        <Mic className="w-2.5 h-2.5" /> Spoken
                      </span>
                    )}
                    <span className="text-[11px] text-zinc-500 font-mono">{log.practiced_date}</span>
                  </div>
                </div>

                {log.notes && (
                  <p className="text-xs text-zinc-400 bg-zinc-900/60 p-2 rounded-lg border border-zinc-800/60">
                    {log.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl text-zinc-100">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-400" /> Log System Design / LLD Practice
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block text-zinc-300 font-medium mb-1">System / Problem Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., URL Shortener or Splitwise LLD"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Type</label>
                  <select
                    value={designType}
                    onChange={(e) => setDesignType(e.target.value as DesignType)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="HLD">HLD (High-Level Design)</option>
                    <option value="LLD">LLD / Machine Coding</option>
                    <option value="AI_SYSTEM">AI System Architecture</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Duration (Minutes)</label>
                  <input
                    type="number"
                    min="10"
                    max="180"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isTimed}
                    onChange={(e) => setIsTimed(e.target.checked)}
                    className="rounded border-zinc-700 text-blue-600 focus:ring-0 bg-zinc-950"
                  />
                  <span className="text-zinc-300">Timed session (strict 40-45m for HLD or 90m for LLD)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={recordedOutLoud}
                    onChange={(e) => setRecordedOutLoud(e.target.checked)}
                    className="rounded border-zinc-700 text-blue-600 focus:ring-0 bg-zinc-950"
                  />
                  <span className="text-zinc-300">Spoken out loud / recorded (2-min elevator pitch)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={frameworkFollowed}
                    onChange={(e) => setFrameworkFollowed(e.target.checked)}
                    className="rounded border-zinc-700 text-blue-600 focus:ring-0 bg-zinc-950"
                  />
                  <span className="text-zinc-300">Followed Hello Interview / Alex Xu framework</span>
                </label>
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Design Decisions &amp; Trade-offs</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Partitioning strategy (hash of user_id vs range), caching layer (write-through Redis), consistency vs latency trade-off..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-blue-500 resize-none"
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
                  className="px-4 py-2 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-500 transition shadow-md shadow-blue-600/30"
                >
                  {isSubmitting ? 'Saving...' : 'Save Design Log'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
