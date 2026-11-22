'use client';

import React, { useState, useEffect } from 'react';
import { X, Check, Copy, Database, ExternalLink, Key, RefreshCw } from 'lucide-react';
import { getSupabaseCredentials, isSupabaseConfigured } from '@/lib/supabase';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SupabaseModal({ isOpen, onClose }: SupabaseModalProps) {
  const [url, setUrl] = useState('');
  const [key, setKey] = useState('');
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const creds = getSupabaseCredentials();
    if (creds.url) setUrl(creds.url);
    if (creds.key) setKey(creds.key);
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
        window.location.reload();
      }, 800);
    } else {
      localStorage.removeItem('tracker_supabase_url');
      localStorage.removeItem('tracker_supabase_key');
      onClose();
      window.location.reload();
    }
  };

  const handleCopySqlInstructions = () => {
    navigator.clipboard.writeText(`-- View supabase-schema.sql in repository root and run it in Supabase SQL Editor`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isConnected = isSupabaseConfigured();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl text-zinc-100">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Supabase Connection Settings</h2>
              <p className="text-xs text-zinc-400">
                Sync all sessions, DSA problems, and weekly reviews to your Supabase PostgreSQL.
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

        {/* Current Status banner */}
        <div className="mt-4 p-3 rounded-xl border flex items-center justify-between text-xs font-medium"
          style={{
            backgroundColor: isConnected ? 'rgba(6, 78, 59, 0.2)' : 'rgba(120, 53, 15, 0.2)',
            borderColor: isConnected ? 'rgba(5, 150, 105, 0.4)' : 'rgba(217, 119, 6, 0.4)'
          }}
        >
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span className={isConnected ? 'text-emerald-300' : 'text-amber-300'}>
              {isConnected 
                ? 'Active: Connected to Supabase Database' 
                : 'Using Local Storage: Data is stored safely in your browser until keys are entered'}
            </span>
          </div>
        </div>

        {/* Setup Guide */}
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
              <span>Supabase Anon Public API Key</span>
              <span className="text-zinc-500 font-normal">Begins with eyJhbGci...</span>
            </label>
            <input
              type="password"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-indigo-500 font-mono text-xs"
            />
          </div>

          <div className="p-3.5 bg-zinc-950 border border-zinc-800/80 rounded-xl space-y-2 text-zinc-300">
            <div className="font-semibold text-zinc-200 flex items-center gap-2">
              <Key className="w-4 h-4 text-indigo-400" />
              <span>Step 2: Database Table Setup</span>
            </div>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              We have generated <code className="text-indigo-300 bg-zinc-900 px-1 py-0.5 rounded">supabase-schema.sql</code> in the project. 
              Open your <strong>Supabase Dashboard &gt; SQL Editor &gt; New Query</strong>, paste the contents of that file, and click <strong>Run</strong>.
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
            className="text-xs text-zinc-400 hover:text-red-400 transition"
          >
            Clear Stored Keys
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
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
