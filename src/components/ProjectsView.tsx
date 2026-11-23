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
  Check,
  BookOpen,
  Sparkles,
  Layers
} from 'lucide-react';
import { ProjectMilestone } from '@/lib/types';
import { updateProjectMilestone } from '@/lib/storage';
import { ResourcesVault } from './ResourcesVault';

interface ProjectsViewProps {
  projects: ProjectMilestone[];
  onRefresh: () => void;
}

const PROJECT_CURATED_RESOURCES: Record<string, { title: string; provider: string; url: string; note: string }[]> = {
  'proj-1': [
    {
      title: 'Advanced Retrieval for AI with Chroma',
      provider: 'DeepLearning.AI',
      url: 'https://learn.deeplearning.ai/courses/advanced-retrieval-for-ai/',
      note: 'Master BM25 keyword + dense embeddings hybrid search and cross-encoder reranking.'
    },
    {
      title: 'Attention in Transformers & Embedding Spaces',
      provider: '3Blue1Brown',
      url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi',
      note: 'Deep geometric intuition for high-dimensional cosine similarity and vector representations.'
    },
    {
      title: 'LLM Observability, Latency & Cost Tracing',
      provider: 'Langfuse',
      url: 'https://langfuse.com/',
      note: 'Track retrieval hit rate, answer quality scores, P95 latency, and token costs per query.'
    }
  ],
  'proj-2': [
    {
      title: 'Building Effective Agents (Workflows vs Agents)',
      provider: 'Anthropic Research',
      url: 'https://www.anthropic.com/research/building-effective-agents',
      note: 'The industry-standard architecture blueprint: router, orchestrator-workers, and human-in-the-loop.'
    },
    {
      title: 'Hugging Face Agents Course',
      provider: 'Hugging Face',
      url: 'https://huggingface.co/learn/agents-course/unit0/introduction',
      note: 'Hands-on guide to ReAct loops, tool calling, execution guardrails, and error recovery.'
    },
    {
      title: 'Model Context Protocol (MCP) Specification',
      provider: 'Anthropic / MCP Spec',
      url: 'https://modelcontextprotocol.io/',
      note: 'The modern standard for safely connecting LLMs to databases, internal APIs, and file systems.'
    },
    {
      title: 'A Practical Guide to LLM Evaluation',
      provider: 'Hamel Husain',
      url: 'https://hamel.dev/blog/posts/evals/',
      note: 'How to build golden evaluation benchmarks for text-to-SQL accuracy and tool decision rates.'
    }
  ],
  'proj-3': [
    {
      title: 'AI Engineering: Building Applications with Foundation Models',
      provider: 'Chip Huyen (O’Reilly)',
      url: 'https://www.oreilly.com/library/view/ai-engineering/9781098166298/',
      note: 'Production microservice patterns: batching, prompt caching, structured outputs, and caching layers.'
    },
    {
      title: 'FastAPI Streaming Responses & SSE Guide',
      provider: 'FastAPI Docs',
      url: 'https://fastapi.tiangolo.com/advanced/custom-response/#streamingresponse',
      note: 'How to stream LLM tokens directly to web clients using Server-Sent Events with keep-alive.'
    },
    {
      title: 'OpenTelemetry Distributed Tracing in Python',
      provider: 'OpenTelemetry',
      url: 'https://opentelemetry.io/docs/languages/python/',
      note: 'Instrument async background workers, queues, and LLM APIs for end-to-end trace visualization.'
    }
  ]
};

export function ProjectsView({ projects, onRefresh }: ProjectsViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'projects' | 'resources'>('projects');
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
      {/* View Switcher: 3 Production Projects vs Roadmap & Resources Vault */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('projects')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeSubTab === 'projects'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850'
            }`}
          >
            <Rocket className="w-4 h-4" />
            <span>The 3 Production AI Projects</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 font-mono">
              3
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('resources')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeSubTab === 'resources'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Curated Roadmap &amp; Resource Vault</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-zinc-800 text-zinc-300 font-mono">
              10
            </span>
          </button>
        </div>
      </div>

      {activeSubTab === 'resources' ? (
        <ResourcesVault category="applied_ai" />
      ) : (
        <>
          {/* Intro Banner */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-5">
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
              const projectResources = PROJECT_CURATED_RESOURCES[proj.id] || [];

              return (
                <div
                  key={proj.id}
                  className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-6 relative overflow-hidden space-y-4"
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

                  {/* Curated Project Study Resources */}
                  {projectResources.length > 0 && (
                    <div className="pt-3 border-t border-zinc-800/80 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-300">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Curated Learning Resources for {proj.title}</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                        {projectResources.map((res, i) => (
                          <a
                            key={i}
                            href={res.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800/80 hover:border-indigo-500/50 hover:bg-zinc-900/60 transition group flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-center justify-between gap-1 mb-1">
                                <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                  {res.provider}
                                </span>
                                <ExternalLink className="w-3 h-3 text-zinc-500 group-hover:text-indigo-400 transition" />
                              </div>
                              <h4 className="text-xs font-medium text-zinc-200 group-hover:text-white line-clamp-1">
                                {res.title}
                              </h4>
                              <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">
                                {res.note}
                              </p>
                            </div>
                            <span className="text-[10px] font-medium text-indigo-400 group-hover:underline mt-2 inline-flex items-center gap-1">
                              Open Resource &rarr;
                            </span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
