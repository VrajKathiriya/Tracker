'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Check, 
  Clock, 
  Flame, 
  Layers, 
  Bot, 
  RotateCw,
  X
} from 'lucide-react';
import { DAILY_BLOCKS, DailyBlockConfig } from '@/lib/roadmap-data';
import { StudySession } from '@/lib/types';
import { saveStudySession, updateStudySession } from '@/lib/storage';

interface ActiveTimerProps {
  sessions: StudySession[];
  onSessionLogged: () => void;
}

const STOPWATCH_STORAGE_KEY = 'roadmap_stopwatch_state_v3';

interface PersistedStopwatchState {
  blockNumber: 1 | 2 | 3 | 4;
  isActive: boolean;
  startTimestamp: number;
  sessionDate: string;
}

export function ActiveTimer({ sessions, onSessionLogged }: ActiveTimerProps) {
  const [selectedBlock, setSelectedBlock] = useState<DailyBlockConfig>(DAILY_BLOCKS[0]);
  const [todayStr, setTodayStr] = useState<string>('');
  
  // Stopwatch active tracking
  const [isActive, setIsActive] = useState<boolean>(false);
  const [startTimestamp, setStartTimestamp] = useState<number | null>(null);
  const [sessionElapsedSeconds, setSessionElapsedSeconds] = useState<number>(0);

  // Notes Modal State (pops up on pause when session is auto-logged)
  const [justLoggedSession, setJustLoggedSession] = useState<StudySession | null>(null);
  const [notesInput, setNotesInput] = useState<string>('');
  const [isSavingNotes, setIsSavingNotes] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize today's date string
  useEffect(() => {
    setTodayStr(new Date().toISOString().split('T')[0]);
  }, []);

  // Calculate total seconds already logged today for a given block
  const getBlockTodaySeconds = useCallback((blockNum: number): number => {
    if (!todayStr) return 0;
    return sessions
      .filter((s) => s.session_date === todayStr && s.block_number === blockNum)
      .reduce((acc, s) => {
        const sec = s.duration_seconds !== undefined ? s.duration_seconds : s.duration_minutes * 60;
        return acc + sec;
      }, 0);
  }, [sessions, todayStr]);

  // Base seconds already saved in database/storage for currently selected block today
  const baseBlockSeconds = getBlockTodaySeconds(selectedBlock.blockNumber);

  // Total seconds to display on the stopwatch clock
  const totalDisplaySeconds = baseBlockSeconds + (isActive ? sessionElapsedSeconds : 0);

  // Restore running stopwatch state from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const raw = localStorage.getItem(STOPWATCH_STORAGE_KEY);
    if (raw) {
      try {
        const parsed: PersistedStopwatchState = JSON.parse(raw);
        const currentToday = new Date().toISOString().split('T')[0];
        
        // Only restore if it was started today
        if (parsed.isActive && parsed.sessionDate === currentToday && parsed.startTimestamp) {
          const now = Date.now();
          const elapsed = Math.floor((now - parsed.startTimestamp) / 1000);
          const block = DAILY_BLOCKS.find((b) => b.blockNumber === parsed.blockNumber) || DAILY_BLOCKS[0];
          
          setSelectedBlock(block);
          setIsActive(true);
          setStartTimestamp(parsed.startTimestamp);
          setSessionElapsedSeconds(elapsed);
        } else {
          localStorage.removeItem(STOPWATCH_STORAGE_KEY);
        }
      } catch (err) {
        console.error('Failed to parse stopwatch state:', err);
      }
    }
  }, []);

  // Synchronize elapsed seconds with wall-clock time
  const syncElapsedFromClock = useCallback(() => {
    if (isActive && startTimestamp) {
      const now = Date.now();
      const elapsed = Math.floor((now - startTimestamp) / 1000);
      setSessionElapsedSeconds(elapsed);
    }
  }, [isActive, startTimestamp]);

  // Tab refocus sync
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        syncElapsedFromClock();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [syncElapsedFromClock]);

  // 1-second interval loop
  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        syncElapsedFromClock();
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, syncElapsedFromClock]);

  // Update browser document title with live stopwatch
  useEffect(() => {
    if (!isActive) {
      document.title = '10-Month SDE & Applied AI Roadmap Tracker';
      return;
    }

    const h = Math.floor(totalDisplaySeconds / 3600);
    const m = Math.floor((totalDisplaySeconds % 3600) / 60);
    const s = totalDisplaySeconds % 60;
    const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    document.title = `(${timeStr}) Block ${selectedBlock.blockNumber}: ${selectedBlock.title.replace(`Block ${selectedBlock.blockNumber}: `, '')}`;

    return () => {
      document.title = '10-Month SDE & Applied AI Roadmap Tracker';
    };
  }, [isActive, totalDisplaySeconds, selectedBlock]);

  // Switch block
  const handleSelectBlock = (block: DailyBlockConfig) => {
    if (isActive) {
      if (!confirm(`Stopwatch is currently running on Block ${selectedBlock.blockNumber}. Pause & save this session before switching?`)) {
        return;
      }
      handlePauseAndLog();
    }
    setSelectedBlock(block);
    setSessionElapsedSeconds(0);
    setStartTimestamp(null);
    setIsActive(false);
    localStorage.removeItem(STOPWATCH_STORAGE_KEY);
  };

  // Start Stopwatch
  const handleStart = () => {
    const now = Date.now();
    setIsActive(true);
    setStartTimestamp(now);
    setSessionElapsedSeconds(0);

    const stateToSave: PersistedStopwatchState = {
      blockNumber: selectedBlock.blockNumber,
      isActive: true,
      startTimestamp: now,
      sessionDate: todayStr || new Date().toISOString().split('T')[0],
    };
    localStorage.setItem(STOPWATCH_STORAGE_KEY, JSON.stringify(stateToSave));
  };

  // Pause Stopwatch -> LOGS THIS SESSION TO DATABASE!
  const handlePauseAndLog = async () => {
    const now = Date.now();
    let currentSessionSeconds = sessionElapsedSeconds;
    if (startTimestamp) {
      currentSessionSeconds = Math.max(1, Math.floor((now - startTimestamp) / 1000));
    }

    // Clear active ticking state
    setIsActive(false);
    setStartTimestamp(null);
    setSessionElapsedSeconds(0);
    localStorage.removeItem(STOPWATCH_STORAGE_KEY);

    if (currentSessionSeconds <= 0) return;

    const minutesToLog = Math.max(1, Math.round(currentSessionSeconds / 60));

    try {
      const saved = await saveStudySession({
        session_date: todayStr || new Date().toISOString().split('T')[0],
        category: selectedBlock.category,
        duration_minutes: minutesToLog,
        duration_seconds: currentSessionSeconds,
        block_number: selectedBlock.blockNumber,
        title: selectedBlock.title,
      });

      // Show notes modal
      setJustLoggedSession(saved);
      setNotesInput('');
      onSessionLogged();
    } catch (err) {
      console.error('Error auto-logging study session:', err);
    }
  };

  // Discard current active session without logging
  const handleDiscard = () => {
    if (confirm('Discard the current ongoing session without saving?')) {
      setIsActive(false);
      setStartTimestamp(null);
      setSessionElapsedSeconds(0);
      localStorage.removeItem(STOPWATCH_STORAGE_KEY);
    }
  };

  // Save notes
  const handleSaveNotes = async () => {
    if (!justLoggedSession) return;
    setIsSavingNotes(true);
    try {
      if (notesInput.trim()) {
        await updateStudySession({
          ...justLoggedSession,
          notes: notesInput.trim(),
        });
        onSessionLogged();
      }
      setJustLoggedSession(null);
    } catch (err) {
      console.error('Error saving session notes:', err);
    } finally {
      setIsSavingNotes(false);
    }
  };

  // Clock formatting
  const hours = Math.floor(totalDisplaySeconds / 3600);
  const minutes = Math.floor((totalDisplaySeconds % 3600) / 60);
  const seconds = totalDisplaySeconds % 60;

  const sessionH = Math.floor(sessionElapsedSeconds / 3600);
  const sessionM = Math.floor((sessionElapsedSeconds % 3600) / 60);
  const sessionS = sessionElapsedSeconds % 60;

  const getBlockIcon = (num: number) => {
    switch (num) {
      case 1: return <Flame className="w-4 h-4 text-amber-400" />;
      case 2: return <Layers className="w-4 h-4 text-blue-400" />;
      case 3: return <Bot className="w-4 h-4 text-emerald-400" />;
      case 4: return <RotateCw className="w-4 h-4 text-purple-400" />;
      default: return <Clock className="w-4 h-4 text-zinc-400" />;
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 sm:p-6 text-zinc-100">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
              <Clock className="w-3.5 h-3.5" />
            </span>
            <h2 className="text-sm font-semibold text-white">Focus Stopwatch</h2>
            {isActive && (
              <span className="flex items-center gap-1.5 text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Tracking Practice
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Counts your daily accumulated practice for each block. Pausing saves a session and keeps your total time.
          </p>
        </div>
      </div>

      {/* 4 Daily Blocks Selector with Direct Hours, Minutes, Seconds */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 my-4">
        {DAILY_BLOCKS.map((block) => {
          const isSelected = selectedBlock.blockNumber === block.blockNumber;
          const isRunningHere = isActive && isSelected;
          const blockSec = getBlockTodaySeconds(block.blockNumber) + (isRunningHere ? sessionElapsedSeconds : 0);
          
          const bH = Math.floor(blockSec / 3600);
          const bM = Math.floor((blockSec % 3600) / 60);
          const bS = blockSec % 60;
          const blockTimeStr = `${bH}h ${bM}m ${bS}s`;

          return (
            <button
              key={block.blockNumber}
              onClick={() => handleSelectBlock(block)}
              className={`p-3 rounded-lg border text-left transition-colors cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-zinc-800 border-zinc-600 text-white'
                  : 'bg-zinc-950/60 border-zinc-800/80 hover:bg-zinc-850 hover:border-zinc-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wide">
                    Block {block.blockNumber}
                  </span>
                  {getBlockIcon(block.blockNumber)}
                </div>
                <div className="text-xs font-semibold text-zinc-100 truncate">
                  {block.title.replace(`Block ${block.blockNumber}: `, '')}
                </div>
                <div className="text-[10px] text-zinc-400 mt-0.5">
                  {block.timeDescription}
                </div>
              </div>

              {/* Directly visible Daily Time: Hours, Minutes, Seconds */}
              <div className="mt-2.5 pt-1.5 border-t border-zinc-800/80 flex items-center justify-between">
                <span className="text-[10px] text-zinc-400 font-medium">Today:</span>
                <span className={`text-xs font-mono font-bold ${
                  isRunningHere 
                    ? 'text-emerald-400 animate-pulse' 
                    : blockSec > 0 
                    ? 'text-emerald-400' 
                    : 'text-zinc-500'
                }`}>
                  {blockTimeStr}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Stopwatch Display */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 text-center my-3">
        <div className="text-xs text-zinc-400 mb-1">
          {selectedBlock.title} — {selectedBlock.description}
        </div>

        {/* Digital Clock (Counts Up in Positive Direction from Accumulated Block Time) */}
        <div className="text-4xl sm:text-5xl font-mono font-bold tracking-tight text-white my-3">
          {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>

        <div className="text-xs text-zinc-400 mb-4">
          {isActive ? (
            <span className="text-emerald-400 font-medium">
              Current Session: +{String(sessionH).padStart(2, '0')}:{String(sessionM).padStart(2, '0')}:{String(sessionS).padStart(2, '0')} (Total: {hours}h {minutes}m {seconds}s)
            </span>
          ) : totalDisplaySeconds > 0 ? (
            `${hours}h ${minutes}m ${seconds}s accumulated today on Block ${selectedBlock.blockNumber}. Click Start to continue.`
          ) : (
            `0h 0m 0s recorded today on Block ${selectedBlock.blockNumber}. Click Start Stopwatch to begin.`
          )}
        </div>

        {/* Stopwatch Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {!isActive ? (
            <button
              onClick={handleStart}
              className="flex items-center gap-1.5 px-5 py-2 rounded-lg font-medium text-xs bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white transition cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>{totalDisplaySeconds > 0 ? 'Resume Stopwatch' : 'Start Stopwatch'}</span>
            </button>
          ) : (
            <button
              onClick={handlePauseAndLog}
              className="flex items-center gap-1.5 px-5 py-2 rounded-lg font-medium text-xs bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white transition cursor-pointer"
            >
              <Pause className="w-3.5 h-3.5 fill-white" />
              <span>Pause &amp; Save Session</span>
            </button>
          )}

          {isActive && (
            <button
              onClick={handleDiscard}
              className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 transition cursor-pointer"
              title="Discard current ongoing session without saving"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Optional Notes Modal (Triggered automatically on Pause) */}
      {justLoggedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md p-5 text-zinc-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-emerald-500/20 text-emerald-400">
                  <Check className="w-3.5 h-3.5" />
                </span>
                <h3 className="text-sm font-semibold text-white">Session Logged</h3>
              </div>
              <button 
                onClick={() => setJustLoggedSession(null)}
                className="text-zinc-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs space-y-1">
              <div className="font-medium text-emerald-400">
                {justLoggedSession.duration_seconds !== undefined
                  ? `${Math.floor(justLoggedSession.duration_seconds / 60)}m ${justLoggedSession.duration_seconds % 60}s logged to ${justLoggedSession.title}`
                  : `${justLoggedSession.duration_minutes}m logged to ${justLoggedSession.title}`}
              </div>
              <div className="text-zinc-400 text-[11px]">
                Date: {justLoggedSession.session_date}
              </div>
            </div>

            <div>
              <label className="block text-zinc-300 text-xs font-medium mb-1.5 flex items-center justify-between">
                <span>Add Optional Notes / Problems Solved:</span>
                <span className="text-[10px] text-zinc-500">(Optional)</span>
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Solved LeetCode 102 & 104; reviewed tree BFS pattern..."
                value={notesInput}
                onChange={(e) => setNotesInput(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 focus:outline-none focus:border-zinc-600 resize-none"
                autoFocus
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setJustLoggedSession(null)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 transition"
              >
                Skip / Done
              </button>
              <button
                type="button"
                onClick={handleSaveNotes}
                disabled={isSavingNotes}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-500 transition flex items-center gap-1.5"
              >
                <Check className="w-3 h-3" />
                {isSavingNotes ? 'Saving...' : 'Save Notes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
