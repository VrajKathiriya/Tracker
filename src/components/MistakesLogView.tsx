'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  ExternalLink, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Calendar, 
  Tag, 
  BrainCircuit, 
  RotateCw,
  Trash2,
  Filter
} from 'lucide-react';
import { ProblemLog, ProblemDifficulty, ProblemSolveStatus } from '@/lib/types';
import { DSA_TOPICS } from '@/lib/roadmap-data';
import { saveProblemLog, markProblemReviewed, deleteProblemLog } from '@/lib/storage';

interface MistakesLogViewProps {
  problems: ProblemLog[];
  onRefresh: () => void;
}

export function MistakesLogView({ problems, onRefresh }: MistakesLogViewProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTopic, setFilterTopic] = useState('ALL');
  const [filterDifficulty, setFilterDifficulty] = useState('ALL');

  // Form State
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [topic, setTopic] = useState(DSA_TOPICS[0]);
  const [difficulty, setDifficulty] = useState<ProblemDifficulty>('Medium');
  const [solveStatus, setSolveStatus] = useState<ProblemSolveStatus>('with_hints');
  const [timeTaken, setTimeTaken] = useState<number>(30);
  const [mistakeNotes, setMistakeNotes] = useState('');
  const [solvedDate, setSolvedDate] = useState('');
  const [todayStr, setTodayStr] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setSolvedDate(today);
    setTodayStr(today);
  }, []);

  // Calculate Due For Review items (7-Day and 30-Day Spaced Repetition)
  const due7dProblems = problems.filter(
    (p) => !p.reviewed_7d && p.review_due_7d <= todayStr
  );
  const due30dProblems = problems.filter(
    (p) => !p.reviewed_30d && p.review_due_30d <= todayStr
  );

  const handleCreateProblem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setIsSubmitting(true);
    try {
      await saveProblemLog({
        title: title.trim(),
        url: url.trim() || undefined,
        topic,
        difficulty,
        solve_status: solveStatus,
        time_taken_minutes: Number(timeTaken) || undefined,
        mistake_notes: mistakeNotes.trim() || undefined,
        solved_date: solvedDate,
      });
      setIsAddModalOpen(false);
      setTitle('');
      setUrl('');
      setMistakeNotes('');
      onRefresh();
    } catch (err) {
      console.error('Failed to save problem:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleReviewed = async (id: string, interval: '7d' | '30d', currentVal: boolean) => {
    await markProblemReviewed(id, interval, !currentVal);
    onRefresh();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this problem entry?')) {
      await deleteProblemLog(id);
      onRefresh();
    }
  };

  const filteredProblems = problems.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.mistake_notes && p.mistake_notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.topic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTopic = filterTopic === 'ALL' || p.topic === filterTopic;
    const matchesDifficulty = filterDifficulty === 'ALL' || p.difficulty === filterDifficulty;
    return matchesSearch && matchesTopic && matchesDifficulty;
  });

  const getDifficultyBadge = (diff: ProblemDifficulty) => {
    switch (diff) {
      case 'Easy':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Easy</span>;
      case 'Medium':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">Medium</span>;
      case 'Hard':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">Hard</span>;
    }
  };

  const getStatusBadge = (st: ProblemSolveStatus) => {
    switch (st) {
      case 'clean_solve':
        return <span className="text-emerald-400 font-medium">Clean Solve (No Hints)</span>;
      case 'with_hints':
        return <span className="text-amber-400 font-medium">Needed 1-2 Hints</span>;
      case 'solution_referenced':
        return <span className="text-orange-400 font-medium">Looked at Editorial</span>;
      case 'failed':
        return <span className="text-rose-400 font-medium">Failed / Got Stuck</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Roadmap Rule #2 Spaced Repetition Notification Banner */}
      {(due7dProblems.length > 0 || due30dProblems.length > 0) && (
        <div className="bg-gradient-to-r from-amber-950/40 via-orange-950/40 to-zinc-900 border border-amber-700/50 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1 rounded-lg bg-amber-500/20 text-amber-400">
              <RotateCw className="w-4 h-4 animate-spin-slow" />
            </span>
            <h3 className="text-sm font-semibold text-amber-200">
              Roadmap Rule #2: Spaced Repetition Due Today
            </h3>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-mono">
              {due7dProblems.length + due30dProblems.length} pending
            </span>
          </div>
          <p className="text-xs text-zinc-400 mb-4">
            &quot;Learn a pattern, solve 5-8 problems on it, then revisit those problems after 7 and 30 days.&quot;
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {/* 7-Day Due */}
            {due7dProblems.length > 0 && (
              <div className="bg-zinc-950/60 border border-amber-800/40 rounded-xl p-3 space-y-2">
                <div className="font-semibold text-amber-300 text-[11px] uppercase tracking-wide flex items-center justify-between">
                  <span>Day +7 Revisit Queue</span>
                  <span>{due7dProblems.length}</span>
                </div>
                {due7dProblems.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-2 bg-zinc-900/90 rounded-lg border border-zinc-800">
                    <div className="truncate mr-2">
                      <div className="font-medium text-zinc-200 truncate">{p.title}</div>
                      <div className="text-[10px] text-zinc-500">{p.topic} • Solved {p.solved_date}</div>
                    </div>
                    <button
                      onClick={() => handleToggleReviewed(p.id, '7d', p.reviewed_7d)}
                      className="px-2.5 py-1 rounded bg-amber-600/20 text-amber-300 hover:bg-amber-600/30 border border-amber-500/30 text-[11px] font-semibold whitespace-nowrap"
                    >
                      Done 7d
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* 30-Day Due */}
            {due30dProblems.length > 0 && (
              <div className="bg-zinc-950/60 border border-orange-800/40 rounded-xl p-3 space-y-2">
                <div className="font-semibold text-orange-300 text-[11px] uppercase tracking-wide flex items-center justify-between">
                  <span>Day +30 Mastery Queue</span>
                  <span>{due30dProblems.length}</span>
                </div>
                {due30dProblems.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-2 bg-zinc-900/90 rounded-lg border border-zinc-800">
                    <div className="truncate mr-2">
                      <div className="font-medium text-zinc-200 truncate">{p.title}</div>
                      <div className="text-[10px] text-zinc-500">{p.topic} • Solved {p.solved_date}</div>
                    </div>
                    <button
                      onClick={() => handleToggleReviewed(p.id, '30d', p.reviewed_30d)}
                      className="px-2.5 py-1 rounded bg-orange-600/20 text-orange-300 hover:bg-orange-600/30 border border-orange-500/30 text-[11px] font-semibold whitespace-nowrap"
                    >
                      Done 30d
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Overview Stats & Action Bar */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
          <div>
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-indigo-400" />
              <span>DSA Problem & Mistakes Log</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Target: 450 total problems by Month 6. Log pattern intuitions and mistake notes to lock them in.
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 transition self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> Log Solved Problem
          </button>
        </div>

        {/* Counter Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
          <div className="p-3 bg-zinc-950/60 border border-zinc-800/80 rounded-xl text-center">
            <span className="text-[10px] uppercase font-semibold text-zinc-500">Logged Problems</span>
            <div className="text-xl font-bold font-mono text-white mt-0.5">{problems.length}</div>
            <span className="text-[10px] text-indigo-400 font-medium">Goal: 450 Total</span>
          </div>
          <div className="p-3 bg-zinc-950/60 border border-zinc-800/80 rounded-xl text-center">
            <span className="text-[10px] uppercase font-semibold text-zinc-500">Clean Solves</span>
            <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">
              {problems.filter(p => p.solve_status === 'clean_solve').length}
            </div>
            <span className="text-[10px] text-zinc-500">Without hints</span>
          </div>
          <div className="p-3 bg-zinc-950/60 border border-zinc-800/80 rounded-xl text-center">
            <span className="text-[10px] uppercase font-semibold text-zinc-500">With Mistakes Logged</span>
            <div className="text-xl font-bold font-mono text-amber-400 mt-0.5">
              {problems.filter(p => Boolean(p.mistake_notes)).length}
            </div>
            <span className="text-[10px] text-zinc-500">Pattern notes saved</span>
          </div>
          <div className="p-3 bg-zinc-950/60 border border-zinc-800/80 rounded-xl text-center">
            <span className="text-[10px] uppercase font-semibold text-zinc-500">Medium / Hard</span>
            <div className="text-xl font-bold font-mono text-purple-400 mt-0.5">
              {problems.filter(p => p.difficulty !== 'Easy').length}
            </div>
            <span className="text-[10px] text-zinc-500">Target depth</span>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search problems, patterns, or mistake notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <select
            value={filterTopic}
            onChange={(e) => setFilterTopic(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Topics</option>
            {DSA_TOPICS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Problems List */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 shadow-xl">
        {filteredProblems.length === 0 ? (
          <div className="text-center py-12 text-zinc-500 text-xs">
            {problems.length === 0 
              ? 'No problems logged yet. Click "Log Solved Problem" to record your first LeetCode problem!'
              : 'No problems match your current search and filter filters.'}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredProblems.map((prob) => (
              <div 
                key={prob.id}
                className="p-4 bg-zinc-950/70 border border-zinc-850 rounded-xl hover:border-zinc-700 transition space-y-2"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {getDifficultyBadge(prob.difficulty)}
                    <span className="font-semibold text-sm text-zinc-100">{prob.title}</span>
                    {prob.url && (
                      <a 
                        href={prob.url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-zinc-500 hover:text-indigo-400 transition"
                        title="Open problem link"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 text-[11px]">
                      {prob.topic}
                    </span>
                    {prob.time_taken_minutes && (
                      <span className="flex items-center gap-1 font-mono text-[11px] text-zinc-400">
                        <Clock className="w-3 h-3" /> {prob.time_taken_minutes}m
                      </span>
                    )}
                    <span className="text-[11px] font-mono text-zinc-500">{prob.solved_date}</span>
                    <button
                      onClick={() => handleDelete(prob.id)}
                      className="p-1 text-zinc-600 hover:text-rose-400 transition"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-xs flex items-center gap-2">
                  <span className="text-zinc-500">Status:</span>
                  {getStatusBadge(prob.solve_status)}
                </div>

                {/* Mistake Notes / Pattern Intuition */}
                {prob.mistake_notes && (
                  <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-lg p-2.5 text-xs text-zinc-300">
                    <div className="text-[10px] uppercase font-semibold text-amber-400 mb-1 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Pattern Intuition &amp; Mistakes Log
                    </div>
                    <p className="whitespace-pre-line leading-relaxed text-zinc-300">{prob.mistake_notes}</p>
                  </div>
                )}

                {/* Spaced repetition review indicators */}
                <div className="flex items-center gap-3 pt-1 text-[11px] text-zinc-500">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={prob.reviewed_7d}
                      onChange={() => handleToggleReviewed(prob.id, '7d', prob.reviewed_7d)}
                      className="rounded border-zinc-700 text-indigo-600 focus:ring-0 bg-zinc-900 cursor-pointer"
                    />
                    <span className={prob.reviewed_7d ? 'text-emerald-400 line-through' : 'text-zinc-400'}>
                      7-Day Revisit (Due: {prob.review_due_7d})
                    </span>
                  </label>

                  <span>•</span>

                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={prob.reviewed_30d}
                      onChange={() => handleToggleReviewed(prob.id, '30d', prob.reviewed_30d)}
                      className="rounded border-zinc-700 text-indigo-600 focus:ring-0 bg-zinc-900 cursor-pointer"
                    />
                    <span className={prob.reviewed_30d ? 'text-emerald-400 line-through' : 'text-zinc-400'}>
                      30-Day Revisit (Due: {prob.review_due_30d})
                    </span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Problem Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 shadow-2xl text-zinc-100">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-indigo-400" /> Log Solved Problem &amp; Mistake
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProblem} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block text-zinc-300 font-medium mb-1">Problem Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., 236. Lowest Common Ancestor of a Binary Tree"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Problem URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://leetcode.com/problems/..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-indigo-500 font-mono text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Topic / Pattern</label>
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-indigo-500"
                  >
                    {DSA_TOPICS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as ProblemDifficulty)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Solve Status</label>
                  <select
                    value={solveStatus}
                    onChange={(e) => setSolveStatus(e.target.value as ProblemSolveStatus)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="clean_solve">Clean Solve (No Hints)</option>
                    <option value="with_hints">Needed 1-2 Hints</option>
                    <option value="solution_referenced">Looked at Editorial / Code</option>
                    <option value="failed">Failed / Could Not Solve</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Time Taken (Minutes)</label>
                  <input
                    type="number"
                    min="1"
                    max="180"
                    value={timeTaken}
                    onChange={(e) => setTimeTaken(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1 flex items-center justify-between">
                  <span>Mistakes Log &amp; Pattern Intuition</span>
                  <span className="text-[10px] text-amber-400 font-normal">Why did it fail or take time?</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Missed post-order traversal intuition; base cases when left or right returns null. Remember: LCA in binary tree returns current root when root is p or q."
                  value={mistakeNotes}
                  onChange={(e) => setMistakeNotes(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Solved Date</label>
                <input
                  type="date"
                  value={solvedDate}
                  onChange={(e) => setSolvedDate(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition shadow-md shadow-indigo-600/30"
                >
                  {isSubmitting ? 'Saving...' : 'Add Problem to Queue'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
