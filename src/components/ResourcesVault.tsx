'use client';

import React, { useState } from 'react';
import { 
  ExternalLink, 
  BookOpen, 
  Search, 
  Clock, 
  Compass, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight,
  ListOrdered,
  Sparkles,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { 
  StudyResource, 
  ResourceCategory, 
  SYSTEM_DESIGN_RESOURCES, 
  APPLIED_AI_RESOURCES,
  ROADMAP_LEARNING_TRACKS
} from '@/lib/resources-data';

interface ResourcesVaultProps {
  category: ResourceCategory;
}

export function ResourcesVault({ category }: ResourcesVaultProps) {
  const [selectedPhase, setSelectedPhase] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showRoadmapMilestones, setShowRoadmapMilestones] = useState<boolean>(true);

  const allResources = category === 'system_design' 
    ? SYSTEM_DESIGN_RESOURCES 
    : APPLIED_AI_RESOURCES;

  const trackData = category === 'system_design' 
    ? ROADMAP_LEARNING_TRACKS.system_design 
    : ROADMAP_LEARNING_TRACKS.applied_ai;

  const phaseFilters = category === 'applied_ai' ? [
    { id: 'all', label: 'All Steps in Order (1–10)' },
    { id: 1, label: 'Phase 1: Foundations & RAG (Start Here • Steps 1–5)' },
    { id: 2, label: 'Phase 2: Agents & MCP (Steps 6–9)' },
    { id: 3, label: 'Phase 3: Evals & Scale (Step 10)' },
  ] : [
    { id: 'all', label: 'All Steps in Order (1–9)' },
    { id: 1, label: 'Phase 1: HLD Foundations (Steps 1–3)' },
    { id: 2, label: 'Phase 2: Distributed Data & DDIA (Steps 4–5)' },
    { id: 3, label: 'Phase 3: Machine Coding & Internals (Steps 6–9)' },
  ];

  // Filter resources by selected phase and search query while strictly preserving step order
  const filteredResources = allResources
    .filter((res) => {
      const matchesPhase = selectedPhase === 'all' || res.phaseNumber === selectedPhase;
      const query = searchQuery.toLowerCase().trim();
      const matchesQuery = !query || 
        res.title.toLowerCase().includes(query) ||
        res.description.toLowerCase().includes(query) ||
        res.authorOrProvider.toLowerCase().includes(query) ||
        res.orderAdvice.toLowerCase().includes(query) ||
        res.tags.some(t => t.toLowerCase().includes(query));
      return matchesPhase && matchesQuery;
    })
    .sort((a, b) => a.stepNumber - b.stepNumber);

  // Group by phase for clear phase-wise rendering
  const phaseGroups: { phaseNumber: number; phaseLabel: string; items: StudyResource[] }[] = [];
  const uniquePhases = Array.from(new Set(filteredResources.map(r => r.phaseNumber))).sort();
  
  uniquePhases.forEach(pNum => {
    const items = filteredResources.filter(r => r.phaseNumber === pNum);
    if (items.length > 0) {
      phaseGroups.push({
        phaseNumber: pNum,
        phaseLabel: items[0].phaseLabel,
        items
      });
    }
  });

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'Must Watch Day 1':
      case 'Essential #1':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Core Practice':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Deep Dive':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default:
        return 'bg-zinc-800 text-zinc-300 border-zinc-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Milestone Header */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">{trackData.title}</h3>
              <p className="text-xs text-zinc-400">{trackData.headline} • {trackData.targetHours} Total Track Hours</p>
            </div>
          </div>
          <button
            onClick={() => setShowRoadmapMilestones(!showRoadmapMilestones)}
            className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white px-2.5 py-1 rounded-lg bg-zinc-800/80 hover:bg-zinc-800 transition self-start sm:self-auto cursor-pointer"
          >
            <span>{showRoadmapMilestones ? 'Hide Phase Milestones' : 'Show Phase Milestones'}</span>
            {showRoadmapMilestones ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {showRoadmapMilestones && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-zinc-800/80">
            {trackData.milestones.map((m, idx) => (
              <div 
                key={idx} 
                className="p-3 bg-zinc-950/70 border border-zinc-800/70 rounded-xl space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-semibold text-indigo-400">{m.monthRange}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono">
                      {m.hoursPerWeek}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-zinc-200">{m.target}</div>
                  <ul className="mt-2 space-y-1.5 text-[11px] text-zinc-400 list-disc list-inside leading-relaxed">
                    {m.goals.map((g, gIdx) => (
                      <li key={gIdx} className="text-zinc-400">{g}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Visual Sequence Breadcrumb (Zero-to-Hero Roadmap) */}
      <div className="bg-zinc-900/70 border border-zinc-800 rounded-xl p-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-white">
            <ListOrdered className="w-4 h-4 text-emerald-400" />
            <span>Strict Step-by-Step Learning Sequence (Follow in Order)</span>
          </div>
          <span className="text-[11px] text-zinc-400">
            {category === 'applied_ai' ? '10 Step AI Curriculum' : '9 Step System Design Curriculum'}
          </span>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed">
          {category === 'applied_ai' ? (
            <>
              New to AI? Follow this exact order: start with <strong className="text-emerald-300">Step 01 (Karpathy)</strong> on Day 1 for pure intuition, then learn <strong className="text-zinc-200">Step 02 (Embeddings)</strong>, set up <strong className="text-zinc-200">Step 03 (FastAPI)</strong>, and build <strong className="text-indigo-300">Project 1</strong> with Step 04. Do not jump to agents until Phase 1 is done!
            </>
          ) : (
            <>
              Start with <strong className="text-blue-300">Step 01 (Hello Interview)</strong> to learn how 45-minute interviews are structured. Next, master core components with <strong className="text-zinc-200">Step 02 (System Design Primer)</strong> before tackling <strong className="text-zinc-200">DDIA</strong> in Phase 2.
            </>
          )}
        </p>

        {/* Horizontal Visual Progression Scroll (Scrollable without visible scrollbar) */}
        <div 
          className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 text-xs font-mono no-scrollbar scrollbar-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {allResources.map((res, i) => (
            <React.Fragment key={res.id}>
              <button
                onClick={() => setSelectedPhase(res.phaseNumber)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition whitespace-nowrap cursor-pointer shrink-0 ${
                  res.stepNumber === 1
                    ? 'bg-emerald-950/60 border-emerald-600/60 text-emerald-300 font-bold'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-white'
                }`}
                title={`${res.orderAdvice} - ${res.title}`}
              >
                <span className={`text-[10px] px-1 rounded ${
                  res.stepNumber === 1 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-zinc-800 text-zinc-400'
                }`}>
                  #{String(res.stepNumber).padStart(2, '0')}
                </span>
                <span className="truncate max-w-[140px] text-[11px]">{res.title}</span>
              </button>
              {i < allResources.length - 1 && (
                <ArrowRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Phase Selection Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {phaseFilters.map((tab) => {
            const isActive = selectedPhase === tab.id;
            return (
              <button
                key={String(tab.id)}
                onClick={() => setSelectedPhase(tab.id as number | 'all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by topic, step, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Phase-Wise Structured Resources List */}
      <div className="space-y-8">
        {phaseGroups.map((group) => (
          <div key={group.phaseNumber} className="space-y-4">
            {/* Phase Section Divider Header */}
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  PHASE {group.phaseNumber}
                </span>
                <h3 className="text-sm font-semibold text-white">{group.phaseLabel}</h3>
              </div>
              <span className="text-xs text-zinc-500 font-mono">
                {group.items.length} {group.items.length === 1 ? 'Resource' : 'Resources'}
              </span>
            </div>

            {/* Resources Grid for this Phase */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {group.items.map((res) => {
                const isStep1 = res.stepNumber === 1;

                return (
                  <div
                    key={res.id}
                    className={`bg-zinc-900/90 border rounded-xl p-5 flex flex-col justify-between transition space-y-4 ${
                      isStep1 
                        ? 'border-emerald-500/50 bg-gradient-to-br from-emerald-950/20 to-zinc-900/90 hover:border-emerald-500/70' 
                        : 'border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Top Step & Timing Row */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                            isStep1
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40 animate-pulse'
                              : 'bg-zinc-800 text-zinc-200 border-zinc-700'
                          }`}>
                            STEP {String(res.stepNumber).padStart(2, '0')} {isStep1 ? '• START HERE' : ''}
                          </span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getPriorityBadgeClass(res.priority)}`}>
                            {res.priority}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400">
                          <Clock className="w-3.5 h-3.5 text-zinc-500" />
                          <span>{res.timing}</span>
                        </div>
                      </div>

                      {/* Explicit Plain-English Order Guidance Banner */}
                      <div className={`p-2.5 rounded-lg text-xs leading-relaxed border ${
                        isStep1
                          ? 'bg-emerald-950/40 border-emerald-800/40 text-emerald-200 font-medium'
                          : 'bg-indigo-950/30 border-indigo-800/40 text-indigo-200'
                      }`}>
                        {res.orderAdvice}
                      </div>

                      {/* Title & Author */}
                      <div>
                        <h4 className="text-base font-semibold text-white leading-snug">
                          {res.title}
                        </h4>
                        <div className="text-xs text-indigo-400 mt-0.5">
                          by {res.authorOrProvider} • <span className="text-zinc-400">{res.type}</span> • <span className="text-zinc-500">{res.cost}</span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-zinc-300 leading-relaxed">
                        {res.description}
                      </p>

                      {/* Prerequisite & What Comes Next Progression Box */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] bg-zinc-950/80 border border-zinc-800/80 rounded-lg p-2.5">
                        <div>
                          <span className="text-zinc-500 font-medium block text-[10px] uppercase tracking-wider">
                            Before this:
                          </span>
                          <span className="text-zinc-300 font-medium">
                            {res.prerequisite}
                          </span>
                        </div>
                        <div>
                          <span className="text-zinc-500 font-medium block text-[10px] uppercase tracking-wider">
                            What to study next:
                          </span>
                          <span className="text-emerald-400 font-medium">
                            {res.nextStep}
                          </span>
                        </div>
                      </div>

                      {/* Why it matters callout */}
                      <div className="p-2.5 bg-zinc-950/90 border border-zinc-800/80 rounded-lg text-[11px] text-zinc-400 leading-relaxed">
                        <span className="font-semibold text-zinc-300 block mb-0.5">
                          💡 Why it matters for your 30+ LPA goal:
                        </span>
                        {res.whyItMatters}
                      </div>
                    </div>

                    {/* Bottom Row: Tags & Direct External Link Button */}
                    <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1">
                        {res.tags.map((t) => (
                          <span key={t} className="text-[10px] text-zinc-500 bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-850">
                            #{t}
                          </span>
                        ))}
                      </div>

                      <a
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white transition shrink-0 cursor-pointer ${
                          isStep1
                            ? 'bg-emerald-600 hover:bg-emerald-500'
                            : 'bg-indigo-600 hover:bg-indigo-500'
                        }`}
                      >
                        <span>Open Resource</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-12 text-zinc-500 text-xs bg-zinc-900/40 rounded-xl border border-zinc-800">
          No resources found matching &quot;{searchQuery}&quot;. Try selecting &quot;All Steps in Order&quot; or clearing your search.
        </div>
      )}
    </div>
  );
}
