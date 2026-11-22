'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  TrendingUp, 
  Award, 
  Trash2, 
  Layers, 
  Flame, 
  Bot, 
  RotateCw, 
  CheckCircle2 
} from 'lucide-react';
import { StudySession, StudyCategory } from '@/lib/types';
import { deleteStudySession } from '@/lib/storage';

interface HoursAnalyticsProps {
  sessions: StudySession[];
  onSessionDeleted: () => void;
  currentWeek: number;
}

export function HoursAnalytics({ sessions, onSessionDeleted, currentWeek }: HoursAnalyticsProps) {
  const [todayStr, setTodayStr] = useState<string>('');
  const [currentDayOfWeek, setCurrentDayOfWeek] = useState<number>(1);
  const [monday, setMonday] = useState<Date | null>(null);

  React.useEffect(() => {
    const now = new Date();
    setTodayStr(now.toISOString().split('T')[0]);
    const d = now.getDay();
    setCurrentDayOfWeek(d);
    const diff = now.getDate() - d + (d === 0 ? -6 : 1);
    const mon = new Date(now.setDate(diff));
    mon.setHours(0, 0, 0, 0);
    setMonday(mon);
  }, []);

  // Daily target: Sunday = 2.5h, Weekday = 6.5h, Saturday = 6.5h
  const dailyTargetHours = currentDayOfWeek === 0 ? 2.5 : 6.5;

  // 1. Calculate Today's Hours
  const todaySessions = todayStr ? sessions.filter(s => s.session_date === todayStr) : [];
  const todayMinutes = todaySessions.reduce((acc, s) => acc + s.duration_minutes, 0);
  const todayHours = todayMinutes / 60;
  const todayProgressPercent = Math.min(100, (todayHours / dailyTargetHours) * 100);

  // 2. Calculate This Week's Hours (Monday to Sunday)
  const thisWeekSessions = monday ? sessions.filter(s => {
    const sessionDate = new Date(s.session_date);
    return sessionDate >= monday;
  }) : [];

  const weekMinutes = thisWeekSessions.reduce((acc, s) => acc + s.duration_minutes, 0);
  const weekHours = weekMinutes / 60;
  const weeklyTarget = 40;
  const weekProgressPercent = Math.min(100, (weekHours / weeklyTarget) * 100);

  // 3. Calculate This Month's Hours
  const currentMonthStr = todayStr ? todayStr.substring(0, 7) : ''; // YYYY-MM
  const monthSessions = currentMonthStr ? sessions.filter(s => s.session_date.startsWith(currentMonthStr)) : [];
  const monthMinutes = monthSessions.reduce((acc, s) => acc + s.duration_minutes, 0);
  const monthHours = monthMinutes / 60;
  const monthlyTarget = 160;
  const monthProgressPercent = Math.min(100, (monthHours / monthlyTarget) * 100);

  // 4. Overall 10-Month Cumulative Hours
  const totalMinutes = sessions.reduce((acc, s) => acc + s.duration_minutes, 0);
  const totalHours = totalMinutes / 60;
  const grandTargetHours = 1760;
  const totalProgressPercent = Math.min(100, (totalHours / grandTargetHours) * 100);

  // Breakdown by category this week
  const categoryHours = (cat: StudyCategory) => {
    const mins = thisWeekSessions
      .filter(s => s.category === cat)
      .reduce((acc, s) => acc + s.duration_minutes, 0);
    return mins / 60;
  };

  const dsaHrs = categoryHours('dsa');
  const sysDesignHrs = categoryHours('system_design');
  const aiHrs = categoryHours('applied_ai');
  const coreCsHrs = categoryHours('core_cs');
  const revisionHrs = categoryHours('revision');

  const handleDelete = async (id: string) => {
    if (confirm('Delete this logged study session?')) {
      await deleteStudySession(id);
      onSessionDeleted();
    }
  };

  const getCategoryBadge = (cat: StudyCategory) => {
    switch (cat) {
      case 'dsa':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">DSA (Python)</span>;
      case 'system_design':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">System Design</span>;
      case 'applied_ai':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Applied AI</span>;
      case 'core_cs':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">Core CS</span>;
      case 'revision':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">Revision</span>;
      case 'mocks':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-pink-500/10 text-pink-400 border border-pink-500/20">Mocks</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-zinc-800 text-zinc-300">Other</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* 4 Stat Cards: Daily, Weekly, Monthly, 10-Month Overall */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Daily Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider">Today&apos;s Hours</span>
            <Clock className="w-3.5 h-3.5 text-zinc-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-white font-mono">{todayHours.toFixed(1)}</span>
            <span className="text-[11px] text-zinc-400">/ {dailyTargetHours}h target</span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-zinc-800 rounded-full h-1.5 mt-2.5 overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${todayHours >= dailyTargetHours ? 'bg-emerald-500' : 'bg-zinc-400'}`} 
              style={{ width: `${todayProgressPercent}%` }}
            />
          </div>
          <div className="text-[10px] text-zinc-500 mt-2 flex justify-between">
            <span>{todaySessions.length} session(s) today</span>
            <span>{Math.round(todayProgressPercent)}%</span>
          </div>
        </div>

        {/* Weekly Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider">This Week (Wk {currentWeek})</span>
            <Calendar className="w-3.5 h-3.5 text-zinc-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-white font-mono">{weekHours.toFixed(1)}</span>
            <span className="text-[11px] text-zinc-400">/ {weeklyTarget}h target</span>
          </div>
          <div className="w-full bg-zinc-800 rounded-full h-1.5 mt-2.5 overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${weekHours >= weeklyTarget ? 'bg-emerald-500' : 'bg-emerald-600'}`} 
              style={{ width: `${weekProgressPercent}%` }}
            />
          </div>
          <div className="text-[10px] text-zinc-500 mt-2 flex justify-between">
            <span>{weeklyTarget - weekHours > 0 ? `${(weeklyTarget - weekHours).toFixed(1)}h remaining` : 'Target achieved!'}</span>
            <span>{Math.round(weekProgressPercent)}%</span>
          </div>
        </div>

        {/* Monthly Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider">This Month</span>
            <TrendingUp className="w-3.5 h-3.5 text-zinc-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-white font-mono">{monthHours.toFixed(1)}</span>
            <span className="text-[11px] text-zinc-400">/ ~{monthlyTarget}h target</span>
          </div>
          <div className="w-full bg-zinc-800 rounded-full h-1.5 mt-2.5 overflow-hidden">
            <div 
              className="h-full bg-zinc-400 transition-all duration-300" 
              style={{ width: `${monthProgressPercent}%` }}
            />
          </div>
          <div className="text-[10px] text-zinc-500 mt-2 flex justify-between">
            <span>Current Month</span>
            <span>{Math.round(monthProgressPercent)}%</span>
          </div>
        </div>

        {/* 10-Month Overall Trajectory */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider">10-Month Goal</span>
            <Award className="w-3.5 h-3.5 text-zinc-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-white font-mono">{totalHours.toFixed(1)}</span>
            <span className="text-[11px] text-zinc-400">/ 1,760h</span>
          </div>
          <div className="w-full bg-zinc-800 rounded-full h-1.5 mt-2.5 overflow-hidden">
            <div 
              className="h-full bg-emerald-500 transition-all duration-300" 
              style={{ width: `${totalProgressPercent}%` }}
            />
          </div>
          <div className="text-[10px] text-zinc-500 mt-2 flex justify-between">
            <span>Goal: 44 Weeks</span>
            <span>{totalProgressPercent.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Weekly Subject Split Breakdown */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-5">
        <h3 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider mb-3">
          This Week&apos;s Split vs Roadmap Targets (40h/week)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-center">
          <div className="p-2.5 bg-zinc-950 border border-zinc-800/80 rounded-lg">
            <span className="text-[11px] text-amber-400 font-medium">DSA (Python)</span>
            <div className="text-base font-bold text-white font-mono mt-0.5">{dsaHrs.toFixed(1)}h</div>
            <span className="text-[10px] text-zinc-500">Plan: 18h (P1)</span>
          </div>
          <div className="p-2.5 bg-zinc-950 border border-zinc-800/80 rounded-lg">
            <span className="text-[11px] text-blue-400 font-medium">System Design</span>
            <div className="text-base font-bold text-white font-mono mt-0.5">{sysDesignHrs.toFixed(1)}h</div>
            <span className="text-[10px] text-zinc-500">Plan: 9h (P1)</span>
          </div>
          <div className="p-2.5 bg-zinc-950 border border-zinc-800/80 rounded-lg">
            <span className="text-[11px] text-emerald-400 font-medium">Applied AI</span>
            <div className="text-base font-bold text-white font-mono mt-0.5">{aiHrs.toFixed(1)}h</div>
            <span className="text-[10px] text-zinc-500">Plan: 9h (P1)</span>
          </div>
          <div className="p-2.5 bg-zinc-950 border border-zinc-800/80 rounded-lg">
            <span className="text-[11px] text-cyan-400 font-medium">Core CS</span>
            <div className="text-base font-bold text-white font-mono mt-0.5">{coreCsHrs.toFixed(1)}h</div>
            <span className="text-[10px] text-zinc-500">Months 7-10</span>
          </div>
          <div className="p-2.5 bg-zinc-950 border border-zinc-800/80 rounded-lg">
            <span className="text-[11px] text-purple-400 font-medium">Revision / Buffer</span>
            <div className="text-base font-bold text-white font-mono mt-0.5">{revisionHrs.toFixed(1)}h</div>
            <span className="text-[10px] text-zinc-500">Plan: 4h</span>
          </div>
        </div>
      </div>

      {/* Recent Sessions Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-5">
        <h3 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider mb-3 flex items-center justify-between">
          <span>Recent Logged Sessions</span>
          <span className="text-zinc-500 font-normal">{sessions.length} total entries</span>
        </h3>

        {sessions.length === 0 ? (
          <div className="text-center py-8 text-zinc-500 text-xs">
            No study sessions logged yet. Use the timer above or click &quot;Log Study Session&quot; to add your first block.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="text-[11px] uppercase tracking-wider text-zinc-400 border-b border-zinc-800">
                <tr>
                  <th className="pb-2 font-medium">Date</th>
                  <th className="pb-2 font-medium">Track</th>
                  <th className="pb-2 font-medium">Title / Topic</th>
                  <th className="pb-2 font-medium text-right">Duration</th>
                  <th className="pb-2 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-850">
                {sessions.slice(0, 8).map((s) => (
                  <tr key={s.id} className="hover:bg-zinc-850/50 transition">
                    <td className="py-2.5 font-mono text-zinc-400 whitespace-nowrap">{s.session_date}</td>
                    <td className="py-2.5 whitespace-nowrap">{getCategoryBadge(s.category)}</td>
                    <td className="py-2.5 font-medium text-zinc-200">
                      <div>{s.title || 'Study Session'}</div>
                      {s.notes && <div className="text-[11px] text-zinc-400 line-clamp-1">{s.notes}</div>}
                    </td>
                    <td className="py-2.5 font-mono text-right text-zinc-100 whitespace-nowrap">
                      {s.duration_minutes}m ({(s.duration_minutes / 60).toFixed(1)}h)
                    </td>
                    <td className="py-2.5 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="p-1 rounded text-zinc-500 hover:text-red-400 hover:bg-zinc-800 transition"
                        title="Delete session"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
