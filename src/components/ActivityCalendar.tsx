'use client';

import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Clock, 
  Flame, 
  Trash2, 
  BookOpen, 
  Layers, 
  Bot, 
  RotateCw 
} from 'lucide-react';
import { StudySession, StudyCategory } from '@/lib/types';
import { deleteStudySession } from '@/lib/storage';
import { DAILY_BLOCKS } from '@/lib/roadmap-data';

interface ActivityCalendarProps {
  sessions: StudySession[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onSessionDeleted: () => void;
}

export function ActivityCalendar({ 
  sessions, 
  selectedDate, 
  onSelectDate, 
  onSessionDeleted 
}: ActivityCalendarProps) {
  const [todayStr, setTodayStr] = useState<string>('');
  const [viewDate, setViewDate] = useState<Date>(() => new Date(2026, 10, 1));

  useEffect(() => {
    const now = new Date();
    setTodayStr(now.toISOString().split('T')[0]);
    if (selectedDate) {
      const parts = selectedDate.split('-').map(Number);
      if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        setViewDate(new Date(parts[0], parts[1] - 1, 1));
        return;
      }
    }
    setViewDate(new Date(now.getFullYear(), now.getMonth(), 1));
  }, [selectedDate]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth(); // 0 to 11

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  const handleJumpToToday = () => {
    const now = new Date();
    setViewDate(new Date(now.getFullYear(), now.getMonth(), 1));
    onSelectDate(now.toISOString().split('T')[0]);
  };

  // Calendar math
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayWeekday = new Date(year, month, 1).getDay(); // 0 = Sunday

  // Sessions map by date: 'YYYY-MM-DD' => totalMinutes
  const dateMinutesMap: Record<string, number> = {};
  sessions.forEach((s) => {
    dateMinutesMap[s.session_date] = (dateMinutesMap[s.session_date] || 0) + s.duration_minutes;
  });

  // Calculate Streak
  let streak = 0;
  if (todayStr) {
    const checkDate = new Date(todayStr);
    while (true) {
      const dStr = checkDate.toISOString().split('T')[0];
      if (dateMinutesMap[dStr] && dateMinutesMap[dStr] > 0) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        // If today has no hours yet, check if yesterday had hours to continue streak
        if (dStr === todayStr) {
          checkDate.setDate(checkDate.getDate() - 1);
          const yStr = checkDate.toISOString().split('T')[0];
          if (dateMinutesMap[yStr] && dateMinutesMap[yStr] > 0) {
            continue;
          }
        }
        break;
      }
    }
  }

  // Monthly stats
  let activeDaysInMonth = 0;
  let totalMinutesInMonth = 0;
  for (let d = 1; d <= daysInMonth; d++) {
    const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const mins = dateMinutesMap[dStr] || 0;
    if (mins > 0) {
      activeDaysInMonth++;
      totalMinutesInMonth += mins;
    }
  }

  // Selected Day data
  const selectedDaySessions = sessions.filter((s) => s.session_date === selectedDate);
  const selectedDayTotalSeconds = selectedDaySessions.reduce(
    (acc, s) => acc + (s.duration_seconds !== undefined ? s.duration_seconds : s.duration_minutes * 60),
    0
  );
  const selH = Math.floor(selectedDayTotalSeconds / 3600);
  const selM = Math.floor((selectedDayTotalSeconds % 3600) / 60);
  const selS = selectedDayTotalSeconds % 60;
  const selectedDayTimeFormatted = `${selH}h ${selM}m ${selS}s`;

  const blockSeconds = (blockNum: number) => {
    return selectedDaySessions
      .filter((s) => s.block_number === blockNum)
      .reduce((acc, s) => acc + (s.duration_seconds !== undefined ? s.duration_seconds : s.duration_minutes * 60), 0);
  };

  const formatHMS = (totalSec: number) => {
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${h}h ${m}m ${s}s`;
  };

  const getIntensityClass = (minutes: number) => {
    const hours = minutes / 60;
    if (hours >= 6.5) return 'bg-emerald-500 text-zinc-950 font-semibold';
    if (hours >= 4) return 'bg-emerald-600/70 text-emerald-100 font-medium';
    if (hours >= 2) return 'bg-emerald-700/50 text-emerald-200';
    if (hours > 0) return 'bg-emerald-900/40 text-emerald-300';
    return '';
  };

  const handleDeleteSession = async (id: string) => {
    if (confirm('Delete this logged practice session?')) {
      await deleteStudySession(id);
      onSessionDeleted();
    }
  };

  const getCategoryBadge = (cat: StudyCategory) => {
    switch (cat) {
      case 'dsa':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">DSA</span>;
      case 'system_design':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">Sys Design</span>;
      case 'applied_ai':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Applied AI</span>;
      case 'core_cs':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">Core CS</span>;
      case 'revision':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">Revision</span>;
      default:
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-zinc-800 text-zinc-400">Other</span>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Calendar Card (LeetCode Style) */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-5 text-zinc-100">
        {/* Month Navigation */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrevMonth}
              className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-semibold text-white tracking-wide">
              {monthNames[month]} {year}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleJumpToToday}
            className="text-[11px] font-medium text-indigo-400 hover:text-indigo-300 px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800"
          >
            Today
          </button>
        </div>

        {/* Weekday Labels (S M T W T F S) */}
        <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-zinc-400 my-2.5">
          <span>S</span>
          <span>M</span>
          <span>T</span>
          <span>W</span>
          <span>T</span>
          <span>F</span>
          <span>S</span>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1.5">
          {/* Leading empty spaces */}
          {Array.from({ length: firstDayWeekday }).map((_, i) => (
            <div key={`empty-${i}`} className="h-9 w-full" />
          ))}

          {/* Days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const minutes = dateMinutesMap[dateStr] || 0;
            const hours = (minutes / 60).toFixed(1);
            const isSelected = selectedDate === dateStr;
            const isToday = todayStr === dateStr;
            const isPast = dateStr < todayStr;
            const intensityClass = getIntensityClass(minutes);

            return (
              <button
                key={dateStr}
                onClick={() => onSelectDate(dateStr)}
                className={`h-9 rounded-lg flex flex-col items-center justify-center transition-colors relative text-xs cursor-pointer ${
                  isSelected
                    ? 'ring-1 ring-emerald-400 bg-zinc-800 font-semibold text-white'
                    : intensityClass
                      ? intensityClass
                      : isPast
                        ? 'bg-zinc-950/70 text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-200 border border-zinc-850'
                        : 'bg-zinc-950/40 text-zinc-600 hover:bg-zinc-850 hover:text-zinc-400 border border-zinc-850/50'
                }`}
                title={`${dateStr}: ${hours}h practiced`}
              >
                <span className="leading-none text-[11px]">{dayNum}</span>
                {minutes > 0 ? (
                  <span className="text-[8px] font-mono leading-none mt-0.5 opacity-80">
                    {hours}h
                  </span>
                ) : isPast ? (
                  <span className="text-[9px] leading-none mt-0.5 opacity-40">·</span>
                ) : null}

                {/* Today tiny indicator */}
                {isToday && !isSelected && (
                  <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-amber-400" />
                )}
              </button>
            );
          })}
        </div>

        {/* Footer: Streak & Heatmap Legend */}
        <div className="mt-4 pt-3 border-t border-zinc-800 flex flex-wrap items-center justify-between text-[11px] text-zinc-400 gap-2">
          <div className="flex items-center gap-1.5 font-medium">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-zinc-200">{streak}</span> days study streak
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
            <span>Less</span>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-zinc-950 border border-zinc-800" />
              <span className="w-2.5 h-2.5 rounded bg-emerald-900/40" />
              <span className="w-2.5 h-2.5 rounded bg-emerald-700/50" />
              <span className="w-2.5 h-2.5 rounded bg-emerald-600/70" />
              <span className="w-2.5 h-2.5 rounded bg-emerald-500" />
            </div>
            <span>More</span>
          </div>
        </div>

        <div className="text-[10px] text-zinc-500 mt-1.5">
          {activeDaysInMonth} active days • {(totalMinutesInMonth / 60).toFixed(1)} hrs in {monthNames[month]}
        </div>
      </div>

      {/* Selected Day Details Inspector */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-5 space-y-3.5">
        <div className="flex items-center justify-between pb-2.5 border-b border-zinc-800">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-zinc-500 font-semibold">
              Selected Day Activity
            </div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2 mt-0.5">
              <CalendarIcon className="w-4 h-4 text-emerald-400" />
              <span>{selectedDate}</span>
              {selectedDate === todayStr && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
                  Today
                </span>
              )}
            </h3>
          </div>

          <div className="text-right">
            <span className="text-xl sm:text-2xl font-bold font-mono text-emerald-400">
              {selectedDayTimeFormatted}
            </span>
            <span className="text-[11px] text-zinc-400 block font-normal">total practiced</span>
          </div>
        </div>

        {/* 4 Block Breakdown for Selected Day (with Conic Progress Borders) */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          {DAILY_BLOCKS.map((block) => {
            const bSec = blockSeconds(block.blockNumber);
            const targetSec = block.targetMinutes * 60;
            const pct = Math.min(100, Math.max(0, (bSec / targetSec) * 100));
            const baseBorder = '#27272a';
            const conicBorder: React.CSSProperties = pct > 0
              ? {
                  background: `conic-gradient(from 0deg at 50% 50%, #059669 0%, #10b981 ${pct}%, ${baseBorder} ${pct}%, ${baseBorder} 100%)`
                }
              : {
                  backgroundColor: baseBorder
                };

            const getBlockCategoryColor = (num: number) => {
              switch (num) {
                case 1: return 'text-amber-400';
                case 2: return 'text-blue-400';
                case 3: return 'text-emerald-400';
                case 4: return 'text-purple-400';
                default: return 'text-zinc-400';
              }
            };

            const getShortCategoryName = (cat: string) => {
              switch (cat) {
                case 'dsa': return 'DSA';
                case 'system_design': return 'SysDesign';
                case 'applied_ai': return 'Applied AI';
                case 'revision': return 'Revision';
                default: return 'Practice';
              }
            };

            return (
              <div
                key={block.blockNumber}
                className={`${pct > 0 ? 'p-[2.5px]' : 'p-[1.5px]'} rounded-xl transition-all`}
                style={conicBorder}
              >
                <div className="p-2.5 bg-zinc-950 rounded-[9.5px] h-full flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-semibold uppercase ${getBlockCategoryColor(block.blockNumber)} truncate`}>
                      B{block.blockNumber}: {getShortCategoryName(block.category)}
                    </span>
                    {pct > 0 && (
                      <span className="text-[9px] font-mono font-medium text-emerald-400 shrink-0 ml-1">
                        {Math.round(pct)}%
                      </span>
                    )}
                  </div>
                  <div className="text-sm font-bold font-mono text-zinc-100 mt-1">
                    {formatHMS(bSec)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sessions list for this day */}
        <div className="space-y-2 pt-1">
          <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
            Logged Sessions ({selectedDaySessions.length})
          </div>

          {selectedDaySessions.length === 0 ? (
            <div className="text-center py-6 text-zinc-500 text-xs bg-zinc-950/40 rounded-xl border border-zinc-850">
              No sessions recorded on this day.
            </div>
          ) : (
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {selectedDaySessions.map((s) => (
                <div
                  key={s.id}
                  className="p-2.5 bg-zinc-950/80 border border-zinc-850 rounded-xl flex items-start justify-between gap-2 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      {getCategoryBadge(s.category)}
                      <span className="font-semibold text-zinc-200">{s.title || 'Study Session'}</span>
                    </div>
                    {s.notes && (
                      <p className="text-[11px] text-zinc-400 leading-relaxed bg-zinc-900/60 p-1.5 rounded border border-zinc-800/60">
                        {s.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono text-[11px] text-zinc-300 font-semibold">
                      {s.duration_seconds !== undefined
                        ? (s.duration_seconds >= 3600
                            ? `${Math.floor(s.duration_seconds / 3600)}h ${Math.floor((s.duration_seconds % 3600) / 60)}m ${s.duration_seconds % 60}s`
                            : `${Math.floor(s.duration_seconds / 60)}m ${s.duration_seconds % 60}s`)
                        : `${s.duration_minutes}m`}
                    </span>
                    <button
                      onClick={() => handleDeleteSession(s.id)}
                      className="p-1 text-zinc-500 hover:text-rose-400 transition"
                      title="Delete session"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
