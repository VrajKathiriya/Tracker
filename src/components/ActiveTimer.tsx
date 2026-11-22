'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Plus, 
  Check, 
  Clock, 
  Flame, 
  Sparkles,
  BookOpen,
  Layers,
  Bot,
  RotateCw
} from 'lucide-react';
import { DAILY_BLOCKS, DailyBlockConfig } from '@/lib/roadmap-data';
import { StudyCategory } from '@/lib/types';
import { saveStudySession } from '@/lib/storage';

interface ActiveTimerProps {
  onSessionLogged: () => void;
}

export function ActiveTimer({ onSessionLogged }: ActiveTimerProps) {
  // Timer States
  const [selectedBlock, setSelectedBlock] = useState<DailyBlockConfig>(DAILY_BLOCKS[0]);
  const [mode, setMode] = useState<'countdown' | 'stopwatch'>('countdown');
  const [secondsRemaining, setSecondsRemaining] = useState<number>(DAILY_BLOCKS[0].targetMinutes * 60);
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState<boolean>(false);

  // Form State for logging
  const [category, setCategory] = useState<StudyCategory>('dsa');
  const [logMinutes, setLogMinutes] = useState<number>(selectedBlock.targetMinutes);
  const [sessionTitle, setSessionTitle] = useState<string>('');
  const [sessionNotes, setSessionNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Switch block preset
  const handleSelectBlock = (block: DailyBlockConfig) => {
    setSelectedBlock(block);
    setCategory(block.category);
    setLogMinutes(block.targetMinutes);
    setIsActive(false);
    if (mode === 'countdown') {
      setSecondsRemaining(block.targetMinutes * 60);
    } else {
      setSecondsElapsed(0);
    }
  };

  // Play beep sound using Web Audio API
  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.8);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);
    } catch {
      // AudioContext may be restricted before user gesture
    }
  };

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        if (mode === 'countdown') {
          setSecondsRemaining((prev) => {
            if (prev <= 1) {
              clearInterval(timerRef.current!);
              setIsActive(false);
              playBeep();
              openLogModal(selectedBlock.targetMinutes);
              return 0;
            }
            return prev - 1;
          });
        } else {
          setSecondsElapsed((prev) => prev + 1);
        }
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, mode, selectedBlock]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    if (mode === 'countdown') {
      setSecondsRemaining(selectedBlock.targetMinutes * 60);
    } else {
      setSecondsElapsed(0);
    }
  };

  const addMinutes = (mins: number) => {
    if (mode === 'countdown') {
      setSecondsRemaining((prev) => prev + mins * 60);
    }
  };

  const openLogModal = (overrideMinutes?: number) => {
    const mins = overrideMinutes 
      ? overrideMinutes 
      : mode === 'countdown'
        ? Math.max(1, Math.round((selectedBlock.targetMinutes * 60 - secondsRemaining) / 60))
        : Math.max(1, Math.round(secondsElapsed / 60));

    setLogMinutes(mins > 0 ? mins : selectedBlock.targetMinutes);
    setCategory(selectedBlock.category);
    setSessionTitle(selectedBlock.title);
    setIsLogModalOpen(true);
  };

  const handleSaveSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (logMinutes <= 0) return;
    setIsSubmitting(true);
    try {
      await saveStudySession({
        session_date: new Date().toISOString().split('T')[0],
        category,
        duration_minutes: Number(logMinutes),
        block_number: selectedBlock.blockNumber,
        title: sessionTitle || selectedBlock.title,
        notes: sessionNotes || undefined,
      });
      setIsLogModalOpen(false);
      setSessionNotes('');
      setSessionTitle('');
      resetTimer();
      onSessionLogged();
    } catch (err) {
      console.error('Error logging session:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const displaySeconds = mode === 'countdown' ? secondsRemaining : secondsElapsed;
  const hours = Math.floor(displaySeconds / 3600);
  const minutes = Math.floor((displaySeconds % 3600) / 60);
  const seconds = displaySeconds % 60;

  const totalTargetSec = selectedBlock.targetMinutes * 60;
  const progressPercent = mode === 'countdown' 
    ? Math.min(100, Math.max(0, ((totalTargetSec - secondsRemaining) / totalTargetSec) * 100))
    : Math.min(100, (secondsElapsed / totalTargetSec) * 100);

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
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header and Mode Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Clock className="w-4 h-4" />
            </span>
            <h2 className="text-base font-semibold text-white">Daily Block Study Timer</h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Follow the 4 daily focus blocks to hit your 6.5h daily weekday target.
          </p>
        </div>

        {/* Stopwatch vs Countdown switch */}
        <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800 self-start sm:self-auto">
          <button
            onClick={() => {
              setMode('countdown');
              setIsActive(false);
              setSecondsRemaining(selectedBlock.targetMinutes * 60);
            }}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition ${
              mode === 'countdown' ? 'bg-indigo-600 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Countdown
          </button>
          <button
            onClick={() => {
              setMode('stopwatch');
              setIsActive(false);
              setSecondsElapsed(0);
            }}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition ${
              mode === 'stopwatch' ? 'bg-indigo-600 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Stopwatch
          </button>
        </div>
      </div>

      {/* 4 Daily Blocks Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 my-5">
        {DAILY_BLOCKS.map((block) => {
          const isSelected = selectedBlock.blockNumber === block.blockNumber;
          return (
            <button
              key={block.blockNumber}
              onClick={() => handleSelectBlock(block)}
              className={`p-3 rounded-xl border text-left transition-all relative ${
                isSelected
                  ? 'bg-zinc-800/90 border-indigo-500/80 shadow-md shadow-indigo-500/10'
                  : 'bg-zinc-950/60 border-zinc-800/80 hover:bg-zinc-850 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wide">
                  Block {block.blockNumber}
                </span>
                {getBlockIcon(block.blockNumber)}
              </div>
              <div className="text-xs font-semibold text-zinc-100 truncate">
                {block.title.replace(`Block ${block.blockNumber}: `, '')}
              </div>
              <div className="text-[11px] text-zinc-400 mt-1 flex items-center justify-between">
                <span>{block.timeDescription}</span>
                <span className="font-mono text-indigo-400 font-medium">{block.targetMinutes}m</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Timer Display */}
      <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-6 text-center my-4 relative">
        <div className="text-xs text-zinc-400 font-medium mb-1">
          {selectedBlock.title} — {selectedBlock.description}
        </div>

        {/* Digital Clock */}
        <div className="text-5xl sm:text-6xl font-mono font-bold tracking-tight text-white my-3">
          {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-zinc-850 rounded-full h-2 my-4 overflow-hidden border border-zinc-800">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Timer Control Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
          <button
            onClick={toggleTimer}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition shadow-lg ${
              isActive
                ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
            }`}
          >
            {isActive ? (
              <>
                <Pause className="w-4 h-4" /> Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" /> Start Block
              </>
            )}
          </button>

          <button
            onClick={resetTimer}
            className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
            title="Reset Timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {mode === 'countdown' && (
            <>
              <button
                onClick={() => addMinutes(5)}
                className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 transition"
              >
                +5m
              </button>
              <button
                onClick={() => addMinutes(15)}
                className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 transition"
              >
                +15m
              </button>
            </>
          )}

          <button
            onClick={() => openLogModal()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-600/30 text-xs font-semibold transition"
          >
            <Check className="w-4 h-4" /> Log Study Session
          </button>
        </div>
      </div>

      {/* Modal to log the study session to database */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl text-zinc-100">
            <h3 className="text-base font-semibold text-white mb-1 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" /> Log Completed Study Session
            </h3>
            <p className="text-xs text-zinc-400 mb-4">
              Add this block to your daily and weekly preparation hours tracker.
            </p>

            <form onSubmit={handleSaveSession} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-zinc-300 font-medium mb-1">Subject / Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as StudyCategory)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="dsa">DSA (Python)</option>
                  <option value="system_design">System Design & LLD</option>
                  <option value="applied_ai">Applied AI (RAG, Agents, Projects)</option>
                  <option value="core_cs">Core CS (OS, DB, Networking)</option>
                  <option value="revision">Mistakes Log & Revision</option>
                  <option value="mocks">Mock Interview / Timed Problem Set</option>
                  <option value="other">Other Preparation</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Duration (Minutes)</label>
                <input
                  type="number"
                  min="1"
                  max="720"
                  value={logMinutes}
                  onChange={(e) => setLogMinutes(Number(e.target.value))}
                  required
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Session Title / Topic</label>
                <input
                  type="text"
                  placeholder="e.g., Binary Trees DFS & Height Balanced"
                  value={sessionTitle}
                  onChange={(e) => setSessionTitle(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Notes / Problems Covered (Optional)</label>
                <textarea
                  rows={3}
                  placeholder="Notes, patterns noticed, or what to review later..."
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  {isSubmitting ? 'Saving...' : 'Save to Tracker'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
