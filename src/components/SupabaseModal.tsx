'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Check, 
  Copy, 
  Database, 
  ExternalLink, 
  Key, 
  RefreshCw, 
  AlertTriangle,
  CheckCircle2,
  Terminal
} from 'lucide-react';
import { 
  getSupabaseCredentials, 
  isSupabaseConfigured, 
  checkSupabaseHealth, 
  SupabaseHealthStatus 
} from '@/lib/supabase';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStatusChange?: () => void;
}

const PERMISSION_SQL = `-- 1. Grant schema usage
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- 2. Grant table, sequence and routine privileges
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

-- 3. Set default privileges for any future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, service_role;

-- 4. Disable RLS for single-user personal tracker
ALTER TABLE study_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE problems_log DISABLE ROW LEVEL SECURITY;
ALTER TABLE system_design_log DISABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_gates DISABLE ROW LEVEL SECURITY;
ALTER TABLE project_milestones DISABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications DISABLE ROW LEVEL SECURITY;`;

export function SupabaseModal({ isOpen, onClose, onStatusChange }: SupabaseModalProps) {
  const [url, setUrl] = useState('');
  const [key, setKey] = useState('');
  const [copiedSql, setCopiedSql] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [checking, setChecking] = useState(false);
  const [health, setHealth] = useState<{ status: SupabaseHealthStatus; message?: string }>({
    status: 'not_configured'
  });

  const checkLiveHealth = async () => {
    setChecking(true);
    try {
      const res = await checkSupabaseHealth();
      setHealth(res);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      const creds = getSupabaseCredentials();
      if (creds.url) setUrl(creds.url);
      if (creds.key) setKey(creds.key);
      checkLiveHealth();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (url.trim() && key.trim()) {
      localStorage.setItem('tracker_supabase_url', url.trim());
      localStorage.setItem('tracker_supabase_key', key.trim());
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        onClose();
        if (onStatusChange) onStatusChange();
        window.location.reload();
      }, 700);
    } else {
      localStorage.removeItem('tracker_supabase_url');
      localStorage.removeItem('tracker_supabase_key');
      onClose();
      if (onStatusChange) onStatusChange();
      window.location.reload();
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(PERMISSION_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  // Derive project ID from URL if available
  const projectIdMatch = url.match(/https:\/\/([a-z0-9]+)\.supabase\.co/);
  const sqlEditorUrl = projectIdMatch 
    ? `https://supabase.com/dashboard/project/${projectIdMatch[1]}/sql/new`
    : 'https://supabase.com/dashboard/project/_/sql/new';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 text-zinc-100 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Supabase Database Connection</h2>
              <p className="text-xs text-zinc-400">
                Cloud persistence across all browsers, laptops, and mobile devices.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Status Banner */}
        <div className={`mt-4 p-3.5 rounded-xl border flex items-center justify-between text-xs font-medium ${
          health.status === 'connected'
            ? 'bg-emerald-950/40 border-emerald-700/50 text-emerald-300'
            : health.status === 'permission_denied'
            ? 'bg-rose-950/50 border-rose-700/60 text-rose-300'
            : 'bg-zinc-950 border-zinc-800 text-zinc-300'
        }`}>
          <div className="flex items-center gap-2.5">
            {health.status === 'connected' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : health.status === 'permission_denied' ? (
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            ) : (
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
            )}
            <div>
              <div className="font-semibold">
                {health.status === 'connected' && 'Database Connected & Verified'}
                {health.status === 'permission_denied' && 'Database Permissions Missing (Error 42501)'}
                {health.status === 'not_configured' && 'Local Storage Mode (Credentials Not Set)'}
                {health.status === 'error' && 'Connection Error'}
              </div>
              <div className="text-[11px] opacity-80 mt-0.5">
                {health.status === 'connected' && 'All reads and writes are saving directly to Supabase cloud.'}
                {health.status === 'permission_denied' && 'Supabase is reachable, but Postgres requires GRANT privileges for anon role.'}
                {health.status === 'not_configured' && 'Sessions are stored in your browser local storage.'}
                {health.status === 'error' && (health.message || 'Check project URL and API key.')}
              </div>
            </div>
          </div>

          <button
            onClick={checkLiveHealth}
            disabled={checking}
            className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-[11px] text-zinc-300 border border-zinc-700 shrink-0 flex items-center gap-1 transition"
            title="Re-verify live connection"
          >
            <RefreshCw className={`w-3 h-3 ${checking ? 'animate-spin' : ''}`} />
            <span>Check</span>
          </button>
        </div>

        {/* Permission Fix Section (Shown when permission denied or when configured) */}
        {health.status === 'permission_denied' && (
          <div className="mt-4 p-4 bg-rose-950/20 border border-rose-800/40 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-300 font-semibold text-xs">
                <Terminal className="w-4 h-4 text-rose-400" />
                <span>Fix 42501: Run this SQL in Supabase SQL Editor</span>
              </div>
              <a
                href={sqlEditorUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-rose-300 hover:text-white underline flex items-center gap-1"
              >
                Open SQL Editor <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-[11px] text-zinc-300 leading-relaxed">
              PostgreSQL requires table privileges for PostgREST API roles (<code className="text-rose-300">anon</code>, <code className="text-rose-300">authenticated</code>). Click below to copy the fix and run it in your Supabase dashboard:
            </p>
            <div className="relative">
              <pre className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-[11px] font-mono text-zinc-300 overflow-x-auto max-h-36">
                {PERMISSION_SQL}
              </pre>
              <button
                onClick={handleCopySql}
                className="absolute top-2 right-2 px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-white border border-zinc-700 flex items-center gap-1.5 transition"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSql ? 'Copied SQL!' : 'Copy SQL'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Credentials Inputs */}
        <div className="mt-5 space-y-4 text-xs">
          <div>
            <label className="block text-zinc-300 font-medium mb-1.5 flex items-center justify-between">
              <span>Supabase Project URL</span>
              <a 
                href="https://supabase.com/dashboard/project/_/settings/api" 
                target="_blank" 
                rel="noreferrer" 
                className="text-indigo-400 hover:underline flex items-center gap-1"
              >
                Find in Supabase <ExternalLink className="w-3 h-3" />
              </a>
            </label>
            <input
              type="text"
              placeholder="https://xyzabcdefg.supabase.co"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-indigo-500 font-mono text-xs"
            />
          </div>

          <div>
            <label className="block text-zinc-300 font-medium mb-1.5 flex items-center justify-between">
              <span>Supabase Anon / Publishable API Key</span>
              <span className="text-zinc-500 font-normal">Begins with sb_publishable_...</span>
            </label>
            <input
              type="password"
              placeholder="sb_publishable_..."
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-indigo-500 font-mono text-xs"
            />
          </div>

          <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl space-y-2 text-zinc-300">
            <div className="font-semibold text-zinc-200 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Key className="w-4 h-4 text-indigo-400" />
                <span>Need Schema or Permissions SQL?</span>
              </span>
              <button
                onClick={handleCopySql}
                className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 text-[11px]"
              >
                {copiedSql ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSql ? 'Copied' : 'Copy SQL Script'}</span>
              </button>
            </div>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Full database schema with indexes and tables is located at <code className="text-indigo-300 bg-zinc-900 px-1 py-0.5 rounded">supabase-schema.sql</code> in your repo.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center justify-between">
          <button
            onClick={() => {
              localStorage.removeItem('tracker_supabase_url');
              localStorage.removeItem('tracker_supabase_key');
              window.location.reload();
            }}
            className="text-xs text-zinc-400 hover:text-rose-400 transition"
          >
            Clear Stored Keys
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 transition"
            >
              Close
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition flex items-center gap-1.5"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Saved & Reloading
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5" /> Save & Connect
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
