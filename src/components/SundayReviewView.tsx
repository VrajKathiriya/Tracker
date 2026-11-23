'use client';

import React, { useState } from 'react';
import { 
  CalendarCheck, 
  TrendingUp, 
  CheckCircle2, 
  Send, 
  BrainCircuit, 
  Award,
  Save,
  Clock
} from 'lucide-react';
import { WeeklyReview } from '@/lib/types';
import { saveWeeklyReview } from '@/lib/storage';

interface SundayReviewViewProps {
  reviews: WeeklyReview[];
  onRefresh: () => void;
  currentWeek: number;
}

export function SundayReviewView({ reviews, onRefresh, currentWeek }: SundayReviewViewProps) {
  const [selectedWeek, setSelectedWeek] = useState(currentWeek);
  const [problemsSolved, setProblemsSolved] = useState(25);
  const [mocksDone, setMocksDone] = useState(0);
  const [outreachSent, setOutreachSent] = useState(0);
  const [hoursCompleted, setHoursCompleted] = useState(40);
  const [reflectionNotes, setReflectionNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const existingReview = reviews.find((r) => r.week_number === selectedWeek);

  const handleSelectWeek = (week: number) => {
    setSelectedWeek(week);
    const rev = reviews.find((r) => r.week_number === week);
    if (rev) {
      setProblemsSolved(rev.problems_solved_count);
      setMocksDone(rev.mocks_done_count);
      setOutreachSent(rev.outreach_sent_count);
      setHoursCompleted(Number(rev.hours_completed));
      setReflectionNotes(rev.reflection_notes || '');
    } else {
      setProblemsSolved(0);
      setMocksDone(0);
      setOutreachSent(0);
      setHoursCompleted(0);
      setReflectionNotes('');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const today = new Date();
      await saveWeeklyReview({
        week_number: selectedWeek,
        week_start_date: today.toISOString().split('T')[0],
        problems_solved_count: Number(problemsSolved),
        mocks_done_count: Number(mocksDone),
        outreach_sent_count: Number(outreachSent),
        hours_completed: Number(hoursCompleted),
        target_hours: 40,
        reflection_notes: reflectionNotes.trim() || undefined,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
      onRefresh();
    } catch (err) {
      console.error('Failed to save weekly review:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sunday Ritual Banner */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <CalendarCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">The Sunday 3-Number Review Ritual</h2>
            <p className="text-xs text-zinc-400">
              Roadmap Rule: &quot;Review every Sunday with three numbers: problems solved, mocks done, outreach messages sent.&quot;
            </p>
          </div>
        </div>

        {/* Week Selector Bar */}
        <div 
          className="flex items-center gap-2 pt-2 border-t border-zinc-800 overflow-x-auto pb-1 no-scrollbar scrollbar-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <span className="text-xs text-zinc-500 font-medium whitespace-nowrap">Jump to:</span>
          {Array.from({ length: 44 }, (_, i) => i + 1).map((w) => {
            const hasReview = reviews.some((r) => r.week_number === w);
            const isSelected = selectedWeek === w;
            return (
              <button
                key={w}
                onClick={() => handleSelectWeek(w)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition shrink-0 ${
                  isSelected
                    ? 'bg-indigo-600 text-white font-bold'
                    : hasReview
                      ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/50'
                      : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-850'
                }`}
              >
                W{w}
              </button>
            );
          })}
        </div>
      </div>

      {/* Input Form for Selected Week */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-6">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <h3 className="text-sm font-semibold text-white">
            Week {selectedWeek} Performance Check-in
          </h3>
          {existingReview && (
            <span className="text-xs text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Logged on {existingReview.week_start_date}
            </span>
          )}
        </div>

        <form onSubmit={handleSave} className="mt-5 space-y-5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {/* Number 1: Problems Solved */}
            <div className="p-4 bg-zinc-950/80 border border-zinc-800 rounded-xl space-y-2">
              <label className="text-amber-400 font-semibold flex items-center gap-1.5">
                <BrainCircuit className="w-4 h-4" /> 1. Problems Solved
              </label>
              <input
                type="number"
                min="0"
                max="200"
                value={problemsSolved}
                onChange={(e) => setProblemsSolved(Number(e.target.value))}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-white font-mono text-base font-bold focus:outline-none focus:border-amber-500"
              />
              <span className="text-[10px] text-zinc-500 block">Weekly accumulation</span>
            </div>

            {/* Number 2: Mocks Done */}
            <div className="p-4 bg-zinc-950/80 border border-zinc-800 rounded-xl space-y-2">
              <label className="text-purple-400 font-semibold flex items-center gap-1.5">
                <Award className="w-4 h-4" /> 2. Mocks Conducted
              </label>
              <input
                type="number"
                min="0"
                max="20"
                value={mocksDone}
                onChange={(e) => setMocksDone(Number(e.target.value))}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-white font-mono text-base font-bold focus:outline-none focus:border-purple-500"
              />
              <span className="text-[10px] text-zinc-500 block">From Month 6 onwards</span>
            </div>

            {/* Number 3: Outreach Sent */}
            <div className="p-4 bg-zinc-950/80 border border-zinc-800 rounded-xl space-y-2">
              <label className="text-emerald-400 font-semibold flex items-center gap-1.5">
                <Send className="w-4 h-4" /> 3. Outreach Sent
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={outreachSent}
                onChange={(e) => setOutreachSent(Number(e.target.value))}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-white font-mono text-base font-bold focus:outline-none focus:border-emerald-500"
              />
              <span className="text-[10px] text-zinc-500 block">Target: ~5/day from Month 6</span>
            </div>

            {/* Total Hours Completed */}
            <div className="p-4 bg-zinc-950/80 border border-zinc-800 rounded-xl space-y-2">
              <label className="text-blue-400 font-semibold flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> Total Hours Logged
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="100"
                value={hoursCompleted}
                onChange={(e) => setHoursCompleted(Number(e.target.value))}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-white font-mono text-base font-bold focus:outline-none focus:border-blue-500"
              />
              <span className="text-[10px] text-zinc-500 block">Target: 40 hrs / week</span>
            </div>
          </div>

          <div>
            <label className="block text-zinc-300 font-medium mb-1">
              Sunday Reflection &amp; Next-Week Focus
            </label>
            <textarea
              rows={3}
              placeholder="What went well this week? What topics or mistakes need extra attention? Plan for next week..."
              value={reflectionNotes}
              onChange={(e) => setReflectionNotes(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-zinc-200 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-zinc-500 text-[11px]">
              &quot;Sunday (2-3 hours) is your light day. Protect it. Burnout is the main risk.&quot;
            </span>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-600/30 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {savedSuccess ? 'Saved Successfully!' : isSubmitting ? 'Saving...' : 'Save Weekly Review'}
            </button>
          </div>
        </form>
      </div>

      {/* Past Reviews Log */}
      {reviews.length > 0 && (
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-6">
          <h3 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider mb-4">
            Past Sunday Check-ins
          </h3>
          <div className="space-y-3">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-3.5 bg-zinc-950/70 border border-zinc-850 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-semibold text-zinc-200">Week {rev.week_number} Review</div>
                  {rev.reflection_notes && (
                    <div className="text-zinc-400 mt-1 line-clamp-1">{rev.reflection_notes}</div>
                  )}
                </div>

                <div className="flex items-center gap-3 font-mono text-zinc-300">
                  <span className="text-amber-400">{rev.problems_solved_count} problems</span>
                  <span className="text-purple-400">{rev.mocks_done_count} mocks</span>
                  <span className="text-emerald-400">{rev.outreach_sent_count} outreach</span>
                  <span className="text-blue-400 font-bold">{rev.hours_completed}h / 40h</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
