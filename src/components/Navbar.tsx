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
  AlertCircle,
  Calendar as CalendarIcon
} from 'lucide-react';
import { isSupabaseConfigured, ensureSupabaseConfig, checkSupabaseHealth, SupabaseHealthStatus } from '@/lib/supabase';
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
  const [healthStatus, setHealthStatus] = useState<SupabaseHealthStatus>('not_configured');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [todayFormatted, setTodayFormatted] = useState('');

  const refreshHealth = async () => {
    await ensureSupabaseConfig();
    const res = await checkSupabaseHealth();
    setHealthStatus(res.status);
  };

  useEffect(() => {
    setTodayFormatted(new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));
    refreshHealth();
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
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between min-h-[56px] sm:h-16 py-2 sm:py-0 gap-2">
            {/* Logo and Target */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-white text-xs shrink-0">
                10M
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="font-semibold text-xs sm:text-base tracking-tight text-white truncate">
                    <span className="sm:hidden">SDE + AI Tracker</span>
                    <span className="hidden sm:inline">SDE + Applied AI Tracker</span>
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 sm:px-2 py-0.5 rounded-full shrink-0">
                    <span className="sm:hidden">30+ LPA</span>
                    <span className="hidden sm:inline">Target: 30+ LPA</span>
                  </span>
                </div>
                <div className="text-[11px] sm:text-xs text-zinc-400 flex items-center gap-1.5 sm:gap-2 truncate">
                  <span className="truncate">{getPhaseName(currentWeek)}</span>
                  <span>•</span>
                  <span className="shrink-0">
                    <span className="sm:hidden">Wk {currentWeek}/44</span>
                    <span className="hidden sm:inline">Week {currentWeek} of 44</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Stats & Controls */}
            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
              {/* Total Hours Badge (Desktop only) */}
              <div className="hidden md:flex flex-col items-end px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-right">
                <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">Total Progress</span>
                <span className="text-xs font-semibold text-zinc-200">
                  {totalHoursCompleted.toFixed(1)} <span className="text-zinc-500">/ 1,760 hrs</span>
                </span>
              </div>

              {/* Today's Date Badge */}
              <div className="flex items-center gap-1 sm:gap-1.5 bg-zinc-900 border border-zinc-800 rounded-lg px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs text-zinc-300 font-medium shrink-0">
                <CalendarIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400 shrink-0" />
                <span>
                  <span className="sm:hidden">
                    {todayFormatted ? todayFormatted.split(',')[0] : 'Today'}
                  </span>
                  <span className="hidden sm:inline">
                    {todayFormatted || 'Today'}
                  </span>
                </span>
              </div>

              {/* Database Status Button */}
              <button
                onClick={() => setIsModalOpen(true)}
                className={`flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs px-2 sm:px-2.5 py-1 rounded-lg border transition-all shrink-0 ${
                  healthStatus === 'connected'
                    ? 'bg-emerald-950/40 border-emerald-700/50 text-emerald-300 hover:bg-emerald-900/50'
                    : healthStatus === 'permission_denied'
                    ? 'bg-rose-950/40 border-rose-700/60 text-rose-300 hover:bg-rose-900/50'
                    : 'bg-amber-950/40 border-amber-700/50 text-amber-300 hover:bg-amber-900/50'
                }`}
                title={
                  healthStatus === 'connected'
                    ? 'Supabase database live & sync ready'
                    : healthStatus === 'permission_denied'
                    ? 'Action needed: PostgreSQL permission denied (42501) - Click to fix'
                    : 'Local storage mode - click to connect Supabase'
                }
              >
                <Database className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                <span className="hidden lg:inline">
                  {healthStatus === 'connected'
                    ? 'Supabase Connected'
                    : healthStatus === 'permission_denied'
                    ? 'DB Permission Needed'
                    : 'Local Storage'}
                </span>
                {healthStatus === 'connected' ? (
                  <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className={`w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 ${healthStatus === 'permission_denied' ? 'text-rose-400' : 'text-amber-400'}`} />
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
                      ? 'bg-zinc-800 text-white border border-zinc-700'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
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
            refreshHealth();
          }} 
          onStatusChange={refreshHealth}
        />
      )}
    </>
  );
}
