'use client';

import React, { useState, useEffect } from 'react';
import { 
  Timer, 
  BookOpen, 
  Layers, 
  Rocket, 
  ShieldCheck, 
  CalendarCheck, 
  Briefcase, 
  Database,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase';
import { SupabaseModal } from './SupabaseModal';

export type ActiveTab = 
  | 'timer' 
  | 'mistakes' 
  | 'system_design' 
  | 'projects' 
  | 'gates' 
  | 'sunday' 
  | 'jobs';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  currentWeek: number;
  onWeekChange: (week: number) => void;
  totalHoursCompleted: number;
}

export function Navbar({ 
  activeTab, 
  onTabChange, 
  currentWeek, 
  onWeekChange,
  totalHoursCompleted 
}: NavbarProps) {
  const [supabaseConnected, setSupabaseConnected] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setSupabaseConnected(isSupabaseConfigured());
  }, []);

  const getPhaseName = (week: number) => {
    if (week <= 13) return 'Phase 1: Foundations';
    if (week <= 26) return 'Phase 2: Depth & Projects';
    if (week <= 35) return 'Phase 3: Design & Practice Loops';
    return 'Phase 4: Interview Mode';
  };

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'timer', label: 'Daily Tracker & Timer', icon: <Timer className="w-4 h-4" /> },
    { id: 'mistakes', label: 'DSA & Mistakes Queue', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'system_design', label: 'System Design & LLD', icon: <Layers className="w-4 h-4" /> },
    { id: 'projects', label: 'AI Projects (3)', icon: <Rocket className="w-4 h-4" /> },
    { id: 'gates', label: 'Roadmap & Gates', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'sunday', label: 'Sunday Review', icon: <CalendarCheck className="w-4 h-4" /> },
    { id: 'jobs', label: 'Applications & CRM', icon: <Briefcase className="w-4 h-4" /> },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800 text-zinc-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Target */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 font-bold text-white text-base">
                10M
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm sm:text-base tracking-tight text-white">
                    SDE + Applied AI Tracker
                  </span>
                  <span className="text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    Target: 30+ LPA
                  </span>
                </div>
                <div className="text-xs text-zinc-400 flex items-center gap-2">
                  <span>{getPhaseName(currentWeek)}</span>
                  <span>•</span>
                  <span>Week {currentWeek} of 44</span>
                </div>
              </div>
            </div>

            {/* Quick Stats & Controls */}
            <div className="flex items-center gap-3">
              {/* Total Hours Badge */}
              <div className="hidden md:flex flex-col items-end px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-right">
                <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">Total Progress</span>
                <span className="text-xs font-semibold text-zinc-200">
                  {totalHoursCompleted.toFixed(1)} <span className="text-zinc-500">/ 1,760 hrs</span>
                </span>
              </div>

              {/* Week selector */}
              <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1 text-xs text-zinc-300">
                <span className="text-zinc-500">Wk:</span>
                <select
                  value={currentWeek}
                  onChange={(e) => onWeekChange(Number(e.target.value))}
                  className="bg-transparent border-none text-zinc-200 font-medium focus:outline-none cursor-pointer"
                >
                  {Array.from({ length: 44 }, (_, i) => i + 1).map((w) => (
                    <option key={w} value={w} className="bg-zinc-900 text-zinc-200">
                      Week {w}
                    </option>
                  ))}
                </select>
              </div>

              {/* Database Status Button */}
              <button
                onClick={() => setIsModalOpen(true)}
                className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg border transition-all ${
                  supabaseConnected
                    ? 'bg-emerald-950/40 border-emerald-700/50 text-emerald-300 hover:bg-emerald-900/50'
                    : 'bg-amber-950/40 border-amber-700/50 text-amber-300 hover:bg-amber-900/50'
                }`}
                title={supabaseConnected ? 'Supabase connected' : 'Local storage mode - click to connect Supabase'}
              >
                <Database className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  {supabaseConnected ? 'Supabase Connected' : 'Local Storage'}
                </span>
                {supabaseConnected ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                )}
              </button>
            </div>
          </div>

          {/* Navigation Bar Tabs */}
          <nav className="flex space-x-1 overflow-x-auto py-2 scrollbar-none border-t border-zinc-800/60">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Supabase Connection Modal */}
      {isModalOpen && (
        <SupabaseModal 
          isOpen={isModalOpen} 
          onClose={() => {
            setIsModalOpen(false);
            setSupabaseConnected(isSupabaseConfigured());
          }} 
        />
      )}
    </>
  );
}
