'use client';

import React, { useState } from 'react';
import { 
  Rocket, 
  CheckCircle2, 
  ExternalLink, 
  GitBranch, 
  Video, 
  BarChart2, 
  ShieldCheck, 
  Save,
  Check
} from 'lucide-react';
import { ProjectMilestone } from '@/lib/types';
import { updateProjectMilestone } from '@/lib/storage';

interface ProjectsViewProps {
  projects: ProjectMilestone[];
  onRefresh: () => void;
}

export function ProjectsView({ projects, onRefresh }: ProjectsViewProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [githubUrl, setGithubUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [evalMetrics, setEvalMetrics] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleToggleChecklist = async (project: ProjectMilestone, itemId: string) => {
    const updatedChecklist = project.checklist.map((item) =>
      item.id === itemId ? { ...item, done: !item.done } : item
    );
    const allDone = updatedChecklist.every((i) => i.done);
    await updateProjectMilestone({
      ...project,
      checklist: updatedChecklist,
      is_completed: allDone,
    });
    onRefresh();
  };

  const handleOpenEdit = (project: ProjectMilestone) => {
    setEditingId(project.id);
    setGithubUrl(project.github_url || '');
    setDemoUrl(project.demo_url || '');
    setEvalMetrics(project.eval_metrics || '');
  };

  const handleSaveUrls = async (project: ProjectMilestone) => {
    await updateProjectMilestone({
      ...project,
      github_url: githubUrl.trim() || undefined,
      demo_url: demoUrl.trim() || undefined,
      eval_metrics: evalMetrics.trim() || undefined,
    });
    setEditingId(null);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
    onRefresh();
  };

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Rocket className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Applied AI Production Projects</h2>
            <p className="text-xs text-zinc-400">
              &quot;Two solid projects with numbers beat four thin ones.&quot; Interviewers dig into these for 15-30 minutes.
            </p>
          </div>
        </div>

        {/* 4 Golden Rules for Every Project */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-zinc-800 text-xs">
          <div className="p-3 bg-zinc-950/60 border border-zinc-800/80 rounded-xl">
            <div className="font-semibold text-purple-300 flex items-center gap-1.5 mb-1">
              <BarChart2 className="w-3.5 h-3.5" /> 1. Measured Numbers
            </div>
            <p className="text-[11px] text-zinc-400">
              Retrieval hit rate, answer quality score, P95 latency, and token cost per query.
            </p>
          </div>
          <div className="p-3 bg-zinc-950/60 border border-zinc-800/80 rounded-xl">
            <div className="font-semibold text-indigo-300 flex items-center gap-1.5 mb-1">
              <Video className="w-3.5 h-3.5" /> 2. Two-Minute Demo
            </div>
            <p className="text-[11px] text-zinc-400">
              Video walkthrough and LinkedIn post that gives recruiters a reason to message you.
            </p>
          </div>
          <div className="p-3 bg-zinc-950/60 border border-zinc-800/80 rounded-xl">
            <div className="font-semibold text-emerald-300 flex items-center gap-1.5 mb-1">
              <ShieldCheck className="w-3.5 h-3.5" /> 3. Production Rigor
            </div>
            <p className="text-[11px] text-zinc-400">
              README with architecture diagram, failure cases, guardrails, clean git commits, and tests.
            </p>
          </div>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-5">
        {projects.map((proj) => {
          const completedCount = proj.checklist.filter((i) => i.done).length;
          const totalCount = proj.checklist.length;
          const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
          const isEditing = editingId === proj.id;

          return (
            <div
              key={proj.id}
              className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-xl relative overflow-hidden space-y-4"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                      Phase {proj.phase}
                    </span>
                    <h3 className="text-base font-semibold text-white">{proj.title}</h3>
                    {proj.is_completed && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Ready
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-zinc-400 mt-1">
                    {completedCount} of {totalCount} deliverables checked ({percent}%)
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {proj.github_url && (
                    <a
                      href={proj.github_url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition"
                      title="GitHub Repository"
                    >
                      <GitBranch className="w-4 h-4" />
                    </a>
                  )}
                  {proj.demo_url && (
                    <a
                      href={proj.demo_url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-lg bg-indigo-950/40 border border-indigo-700/50 text-indigo-300 hover:text-white transition"
                      title="Live Demo"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  <button
                    onClick={() => (isEditing ? setEditingId(null) : handleOpenEdit(proj))}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition"
                  >
                    {isEditing ? 'Close Links' : 'Edit Links & Numbers'}
                  </button>
                </div>
              </div>

              {/* Edit Links Section */}
              {isEditing && (
                <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-zinc-400 mb-1">GitHub Repo URL</label>
                      <input
                        type="url"
                        placeholder="https://github.com/..."
                        value={githubUrl}
                        onChange={(e) => setGithubUrl(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-zinc-200 focus:outline-none focus:border-indigo-500 font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-400 mb-1">Live Demo / Video URL</label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={demoUrl}
                        onChange={(e) => setDemoUrl(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-zinc-200 focus:outline-none focus:border-indigo-500 font-mono text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1">
                      Measured Evaluation Numbers (Resume Ready)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Retrieval Hit Rate: 91%, Answer Quality: 4.4/5, P95: 380ms, Cost: $0.0028/req"
                      value={evalMetrics}
                      onChange={(e) => setEvalMetrics(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-zinc-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => handleSaveUrls(proj)}
                      className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 transition"
                    >
                      <Save className="w-3.5 h-3.5" /> Save Project Details
                    </button>
                  </div>
                </div>
              )}

              {/* Eval Metrics Banner if populated */}
              {proj.eval_metrics && (
                <div className="bg-purple-950/20 border border-purple-800/40 rounded-xl p-3 flex items-center gap-2.5 text-xs text-purple-200">
                  <BarChart2 className="w-4 h-4 text-purple-400 shrink-0" />
                  <span className="font-mono">{proj.eval_metrics}</span>
                </div>
              )}

              {/* Deliverables Checklist */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                  Deliverables &amp; Requirements Checklist
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {proj.checklist.map((item) => (
                    <label
                      key={item.id}
                      onClick={(e) => {
                        e.preventDefault();
                        handleToggleChecklist(proj, item.id);
                      }}
                      className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition ${
                        item.done
                          ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200'
                          : 'bg-zinc-950/60 border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={item.done}
                        readOnly
                        className="mt-0.5 rounded border-zinc-700 text-emerald-600 focus:ring-0 bg-zinc-900"
                      />
                      <span className={item.done ? 'line-through text-zinc-400' : ''}>
                        {item.text}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
