'use client';

import React, { useState } from 'react';
import { 
  ExternalLink, 
  BookOpen, 
  CheckCircle, 
  Sparkles, 
  Filter, 
  Search, 
  Clock, 
  Layers, 
  Tag,
  Compass,
  ChevronDown,
  ChevronUp,
  BookmarkCheck
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
  const [activeSubcategory, setActiveSubcategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showRoadmapMilestones, setShowRoadmapMilestones] = useState<boolean>(true);

  const allResources = category === 'system_design' 
    ? SYSTEM_DESIGN_RESOURCES 
    : APPLIED_AI_RESOURCES;

  const trackData = category === 'system_design' 
    ? ROADMAP_LEARNING_TRACKS.system_design 
    : ROADMAP_LEARNING_TRACKS.applied_ai;

  const subcategoryFilters = category === 'system_design' ? [
    { id: 'all', label: 'All Resources' },
    { id: 'hld', label: 'High-Level Design (HLD)' },
    { id: 'lld', label: 'Low-Level Design & Machine Coding' },
    { id: 'databases', label: 'Databases & Indexing' },
    { id: 'core_cs', label: 'Networking & Operating Systems' },
  ] : [
    { id: 'all', label: 'All Resources' },
    { id: 'llm_foundations', label: 'LLM Foundations & ML' },
    { id: 'rag', label: 'Production RAG (Project 1)' },
    { id: 'agents', label: 'Agents & MCP (Project 2)' },
    { id: 'evals', label: 'Evaluations & Observability' },
  ];

  const filteredResources = allResources.filter((res) => {
    const matchesSub = activeSubcategory === 'all' || res.subcategory === activeSubcategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery = !query || 
      res.title.toLowerCase().includes(query) ||
      res.description.toLowerCase().includes(query) ||
      res.authorOrProvider.toLowerCase().includes(query) ||
      res.tags.some(t => t.toLowerCase().includes(query));
    return matchesSub && matchesQuery;
  });

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'Essential #1':
      case 'Must Watch Day 1':
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
      {/* Roadmap Learning Milestones Overview */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">{trackData.title}</h3>
              <p className="text-xs text-zinc-400">{trackData.headline} • {trackData.targetHours} Total Hours</p>
            </div>
          </div>
          <button
            onClick={() => setShowRoadmapMilestones(!showRoadmapMilestones)}
            className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white px-2.5 py-1 rounded-lg bg-zinc-800/80 hover:bg-zinc-800 transition"
          >
            <span>{showRoadmapMilestones ? 'Hide Milestones' : 'Show Milestones'}</span>
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

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {subcategoryFilters.map((sub) => {
            const isActive = activeSubcategory === sub.id;
            return (
              <button
                key={sub.id}
                onClick={() => setActiveSubcategory(sub.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850'
                }`}
              >
                {sub.label}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search resources, topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Resources Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredResources.map((res) => (
          <div
            key={res.id}
            className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-5 flex flex-col justify-between hover:border-zinc-700 transition space-y-3.5"
          >
            <div className="space-y-2.5">
              {/* Badges row */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getPriorityBadgeClass(res.priority)}`}>
                    {res.priority}
                  </span>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300">
                    {res.type}
                  </span>
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-zinc-950 border border-zinc-850 text-zinc-400">
                    {res.cost}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-zinc-500">
                  {res.targetPhase}
                </span>
              </div>

              {/* Title & Author */}
              <div>
                <h4 className="text-sm font-semibold text-white leading-snug">
                  {res.title}
                </h4>
                <div className="text-xs text-indigo-400 mt-0.5">
                  by {res.authorOrProvider}
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-zinc-300 leading-relaxed">
                {res.description}
              </p>

              {/* Why it matters callout */}
              <div className="p-2.5 bg-zinc-950/80 border border-zinc-800/80 rounded-lg text-[11px] text-zinc-400 leading-relaxed">
                <span className="font-semibold text-zinc-300 block mb-0.5">💡 Why it matters for your 30+ LPA goal:</span>
                {res.whyItMatters}
              </div>
            </div>

            {/* Bottom Row: Tags & Direct External Link Button */}
            <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between gap-2">
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
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition shrink-0"
              >
                <span>Open Resource</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-12 text-zinc-500 text-xs bg-zinc-900/40 rounded-xl border border-zinc-800">
          No resources found matching &quot;{searchQuery}&quot;. Try a different keyword or filter.
        </div>
      )}
    </div>
  );
}
