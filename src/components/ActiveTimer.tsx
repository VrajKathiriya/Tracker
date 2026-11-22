'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Check, 
  Clock, 
  Flame, 
  Sparkles, 
  Layers, 
  Bot, 
  RotateCw,
  X
} from 'lucide-react';
import { DAILY_BLOCKS, DailyBlockConfig } from '@/lib/roadmap-data';
import { StudyCategory, StudySession } from '@/lib/types';
import { saveStudySession, updateStudySession } from '@/lib/storage';

interface ActiveTimerProps {
  onSessionLogged: () => void;
}

const STOPWATCH_STORAGE_KEY = 'roadmap_stopwatch_state_v2';

interface PersistedStopwatchState {
  blockNumber: 1 | 2 | 3 | 4;
  isActive: boolean;
  startTimestamp: number | null; // Date.now() when started/resumed
  accumulatedSeconds: number;
}

export function ActiveTimer({ onSessionLogged }: ActiveTimerProps) {
  const [selectedBlock, setSelectedBlock] = useState<DailyBlockConfig>(DAILY_BLOCKS[0]);
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);

  // Notes Modal State (pops up on pause when session is auto-logged)
  const [justLoggedSession, setJustLoggedSession] = useState<StudySession | null>(null);
  const [notesInput, setNotesInput] = useState<string>('');
  const [isSavingNotes, setIsSavingNotes] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const stopwatchStateRef = useRef<PersistedStopwatchState | null>(null);

  // Save to localStorage
  const saveStopwatchToStorage = (state: PersistedStopwatchState | null) => {
    stopwatchStateRef.current = state;
    if (typeof window === 'undefined') return;
    if (!state) {
      localStorage.removeItem(STOPWATCH_STORAGE_KEY);
    } else {
      localStorage.setItem(STOPWATCH_STORAGE_KEY, JSON.stringify(state));
    }
  };

  // Sync elapsed seconds from wall-clock time
  const syncFromState = useCallback((state: PersistedStopwatchState) => {
    const now = Date.now();
    const elapsedSinceStart = (state.isActive && state.startTimestamp) 
      ? Math.floor((now - state.startTimestamp) / 1000) 
      : 0;
    const total = state.accumulatedSeconds + elapsedSinceStart;
    setSecondsElapsed(total);
    setIsActive(state.isActive);
  }, []);

  // Restore on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const raw = localStorage.getItem(STOPWATCH_STORAGE_KEY);
    if (raw) {
      try {
        const parsed: PersistedStopwatchState = JSON.parse(raw);
        stopwatchStateRef.current = parsed;
        const block = DAILY_BLOCKS.find((b) => b.blockNumber === parsed.blockNumber) || DAILY_BLOCKS[0];
        setSelectedBlock(block);
        syncFromState(parsed);
      } catch (err) {
        console.error('Failed to parse stopwatch state:', err);
      }
    }
  }, [syncFromState]);

  // Handle visibility change (tab refocus)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && stopwatchStateRef.current) {
        syncFromState(stopwatchStateRef.current);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [syncFromState]);

  // Tick loop
  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        if (stopwatchStateRef.current) {
          syncFromState(stopwatchStateRef.current);
        }
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, syncFromState]);

  // Update browser tab title
  useEffect(() => {
    if (!isActive) {
      document.title = '10-Month SDE & Applied AI Roadmap Tracker';
      return;
    }

    const h = Math.floor(secondsElapsed / 3600);
    const m = Math.floor((secondsElapsed % 3600) / 60);
    const s = secondsElapsed % 60;
    const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    document.title = `(${timeStr}) Block ${selectedBlock.blockNumber}: ${selectedBlock.title.replace(`Block ${selectedBlock.blockNumber}: `, '')} - Tracker`;

    return () => {
      document.title = '10-Month SDE & Applied AI Roadmap Tracker';
    };
  }, [isActive, secondsElapsed, selectedBlock]);

  // Switch active block
  const handleSelectBlock = (block: DailyBlockConfig) => {
    if (isActive) {
      if (!confirm('You have a stopwatch running. Switching block will pause & save this session. Continue?')) {
        return;
      }
      handlePauseAndLog();
    }
    setSelectedBlock(block);
    setSecondsElapsed(0);
    saveStopwatchToStorage(null);
  };

  // Start stopwatch
  const handleStart = () => {
    const now = Date.now();
    const existing = stopwatchStateRef.current;
    const accum = existing ? existing.accumulatedSeconds : secondsElapsed;

    const newState: PersistedStopwatchState = {
      blockNumber: selectedBlock.blockNumber,
      isActive: true,
      startTimestamp: now,
      accumulatedSeconds: accum,
    };

    saveStopwatchToStorage(newState);
    setIsActive(true);
  };

  // Pause stopwatch -> AUTOMATICALLY LOGS SESSION!
  const handlePauseAndLog = async () => {
    const now = Date.now();
    const existing = stopwatchStateRef.current;
    let finalSeconds = secondsElapsed;

    if (existing && existing.startTimestamp) {
      const elapsedSinceStart = Math.floor((now - existing.startTimestamp) / 1000);
      finalSeconds = existing.accumulatedSeconds + elapsedSinceStart;
    }

    // Reset stopwatch state
    saveStopwatchToStorage(null);
    setIsActive(false);
    setSecondsElapsed(0);

    // Only log if at least 15 seconds were elapsed, or round to 1 min
    const minutesToLog = Math.max(1, Math.round(finalSeconds / 60));

    try {
      const saved = await saveStudySession({
        session_date: new Date().toISOString().split('T')[0],
        category: selectedBlock.category,
        duration_minutes: minutesToLog,
        block_number: selectedBlock.blockNumber,
        title: selectedBlock.title,
      });

      // Prompt for optional notes
      setJustLoggedSession(saved);
      setNotesInput('');
      onSessionLogged();
    } catch (err) {
      console.error('Auto-log session error:', err);
    }
  };

  // Discard without saving
  const handleDiscard = () => {
    if (confirm('Discard current timer without saving?')) {
      saveStopwatchToStorage(null);
      setIsActive(false);
      setSecondsElapsed(0);
    }
  };

  // Save notes to the auto-logged session
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
      console.error('Error updating session notes:', err);
    } finally {
      setIsSavingNotes(false);
    }
  };

  const hours = Math.floor(secondsElapsed / 3600);
  const minutes = Math.floor((secondsElapsed % 3600) / 60);
  const seconds = secondsElapsed % 60;

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
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Tracking Practice
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Starts from 00:00:00. Pausing automatically logs your practice to your calendar.
          </p>
        </div>
      </div>

      {/* 4 Daily Blocks Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 my-4">
        {DAILY_BLOCKS.map((block) => {
          const isSelected = selectedBlock.blockNumber === block.blockNumber;
          return (
            <button
              key={block.blockNumber}
              onClick={() => handleSelectBlock(block)}
              className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-zinc-800 border-zinc-600 text-white'
                  : 'bg-zinc-950/60 border-zinc-800/80 hover:bg-zinc-850 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wide">
                  Block {block.blockNumber}
                </span>
                {getBlockIcon(block.blockNumber)}
              </div>
              <div className="text-xs font-medium text-zinc-100 truncate">
                {block.title.replace(`Block ${block.blockNumber}: `, '')}
              </div>
              <div className="text-[11px] text-zinc-400 mt-1">
                {block.timeDescription}
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

        {/* Digital Clock (Counts Up in Positive Direction from 00:00:00) */}
        <div className="text-4xl sm:text-5xl font-mono font-bold tracking-tight text-white my-3">
          {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>

        <div className="text-xs text-zinc-400 mb-4">
          {secondsElapsed > 0 
            ? `${(secondsElapsed / 3600).toFixed(2)} hours accumulated in this session`
            : 'Click Start to begin timing this block'}
        </div>

        {/* Stopwatch Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {!isActive ? (
            <button
              onClick={handleStart}
              className="flex items-center gap-1.5 px-5 py-2 rounded-lg font-medium text-xs bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white transition cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-white" /> Start Stopwatch
            </button>
          ) : (
            <button
              onClick={handlePauseAndLog}
              className="flex items-center gap-1.5 px-5 py-2 rounded-lg font-medium text-xs bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white transition cursor-pointer"
            >
              <Pause className="w-3.5 h-3.5 fill-white" /> Pause &amp; Save Session
            </button>
          )}

          {secondsElapsed > 0 && (
            <button
              onClick={handleDiscard}
              className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 transition cursor-pointer"
              title="Discard timer without logging"
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
                {justLoggedSession.duration_minutes} minutes logged to {justLoggedSession.title}
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
