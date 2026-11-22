'use client';

import React from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar, 
  HelpCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { RoadmapGate } from '@/lib/types';
import { ROADMAP_PHASES } from '@/lib/roadmap-data';
import { updateRoadmapGate } from '@/lib/storage';

interface RoadmapGatesViewProps {
  gates: RoadmapGate[];
  onRefresh: () => void;
  currentWeek: number;
}

export function RoadmapGatesView({ gates, onRefresh, currentWeek }: RoadmapGatesViewProps) {
  const handleToggleCheck = async (gate: RoadmapGate, itemId: string) => {
    const updatedChecklist = gate.checklist.map((item) =>
      item.id === itemId ? { ...item, done: !item.done } : item
    );
    const allDone = updatedChecklist.every((i) => i.done);
    await updateRoadmapGate({
      ...gate,
      checklist: updatedChecklist,
      is_passed: allDone,
    });
    onRefresh();
  };

  return (
    <div className="space-y-6">
      {/* 3 Gates Checkpoint Section */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div>
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>The 3 Decision Gates (Month 3, 6, 8)</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            &quot;Each gate passes only if every item holds. A miss means adjust the plan, not just work harder.&quot;
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {gates.map((gate) => {
            const completedCount = gate.checklist.filter((i) => i.done).length;
            const totalCount = gate.checklist.length;
            const allPassed = gate.is_passed || completedCount === totalCount;

            return (
              <div
                key={gate.id}
                className={`rounded-2xl border p-5 flex flex-col justify-between transition-all ${
                  allPassed
                    ? 'bg-emerald-950/20 border-emerald-600/50 shadow-lg shadow-emerald-500/10'
                    : 'bg-zinc-950/80 border-zinc-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
                    <span className="text-xs font-semibold text-white">{gate.gate_name}</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        allPassed
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {allPassed ? 'GATE PASSED' : `${completedCount}/${totalCount} Done`}
                    </span>
                  </div>

                  {/* Checklist */}
                  <div className="mt-3 space-y-2 text-xs">
                    {gate.checklist.map((item) => (
                      <label
                        key={item.id}
                        onClick={(e) => {
                          e.preventDefault();
                          handleToggleCheck(gate, item.id);
                        }}
                        className="flex items-start gap-2 cursor-pointer text-zinc-300 hover:text-white transition"
                      >
                        <input
                          type="checkbox"
                          checked={item.done}
                          readOnly
                          className="mt-0.5 rounded border-zinc-700 text-emerald-600 focus:ring-0 bg-zinc-900 cursor-pointer"
                        />
                        <span className={`text-[11px] leading-relaxed ${item.done ? 'line-through text-zinc-500' : ''}`}>
                          {item.text}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Contingency Plan Note */}
                <div className="mt-4 pt-3 border-t border-zinc-850 text-[11px]">
                  <div className="text-amber-400 font-semibold flex items-center gap-1 mb-1">
                    <AlertTriangle className="w-3 h-3" /> If You Miss It:
                  </div>
                  <p className="text-zinc-400 leading-normal">{gate.contingency_plan}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4 Phases & 44-Week Breakdown Table */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-400" />
            <span>Weekly Split Across 4 Phases (44 Weeks, 1,760 Total Hours)</span>
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            40 hours per week (6.5h weekdays, 6.5h Saturday, 2.5h Sunday).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {ROADMAP_PHASES.map((phase) => {
            const isCurrent = (
              (phase.phase === 1 && currentWeek <= 13) ||
              (phase.phase === 2 && currentWeek > 13 && currentWeek <= 26) ||
              (phase.phase === 3 && currentWeek > 26 && currentWeek <= 35) ||
              (phase.phase === 4 && currentWeek > 35)
            );

            return (
              <div
                key={phase.phase}
                className={`p-4 rounded-xl border text-xs space-y-3 ${
                  isCurrent
                    ? 'bg-indigo-950/20 border-indigo-500/60 shadow-md shadow-indigo-500/10'
                    : 'bg-zinc-950/60 border-zinc-850'
                }`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                  <span className="font-semibold text-zinc-100">
                    Phase {phase.phase}: {phase.name}
                  </span>
                  {isCurrent && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500 text-white font-bold">
                      CURRENT
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-zinc-400 font-mono">{phase.months}</div>

                {/* Hour Split */}
                <div className="space-y-1.5 pt-1 text-[11px]">
                  <div className="flex justify-between text-zinc-300">
                    <span className="text-amber-400">DSA (Python):</span>
                    <span className="font-mono font-semibold">{phase.hoursPerWeek.dsa} h/wk</span>
                  </div>
                  <div className="flex justify-between text-zinc-300">
                    <span className="text-blue-400">System Design + LLD:</span>
                    <span className="font-mono font-semibold">{phase.hoursPerWeek.systemDesign} h/wk</span>
                  </div>
                  <div className="flex justify-between text-zinc-300">
                    <span className="text-emerald-400">Applied AI Projects:</span>
                    <span className="font-mono font-semibold">{phase.hoursPerWeek.appliedAi} h/wk</span>
                  </div>
                  {phase.hoursPerWeek.coreCs > 0 && (
                    <div className="flex justify-between text-zinc-300">
                      <span className="text-cyan-400">Core CS (OS/DB/Net):</span>
                      <span className="font-mono font-semibold">{phase.hoursPerWeek.coreCs} h/wk</span>
                    </div>
                  )}
                  {phase.hoursPerWeek.mocks > 0 && (
                    <div className="flex justify-between text-zinc-300">
                      <span className="text-pink-400">Mocks &amp; Applications:</span>
                      <span className="font-mono font-semibold">{phase.hoursPerWeek.mocks} h/wk</span>
                    </div>
                  )}
                  <div className="flex justify-between text-zinc-300">
                    <span className="text-purple-400">Revision / Buffer:</span>
                    <span className="font-mono font-semibold">{phase.hoursPerWeek.revision} h/wk</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-800 text-[11px] text-zinc-400">
                  <div className="font-medium text-zinc-300 mb-0.5">Phase Deliverable:</div>
                  <p>{phase.deliverable}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5 Core Roadmap Rules */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider mb-3">
          The 5 Inviolable Rules of the Roadmap
        </h3>
        <ol className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-zinc-300">
          <li className="p-3 bg-zinc-950/60 border border-zinc-850 rounded-xl">
            <span className="font-semibold text-indigo-300">Rule 1: Python for DSA from Day 1</span>
            <p className="text-zinc-400 mt-1">Keep JS/TS for frontends; Python for DSA and AI backends.</p>
          </li>
          <li className="p-3 bg-zinc-950/60 border border-zinc-850 rounded-xl">
            <span className="font-semibold text-amber-300">Rule 2: Spaced Repetition (7 &amp; 30 Days)</span>
            <p className="text-zinc-400 mt-1">Learn a pattern, solve 5-8 problems, revisit after 7 and 30 days. Log mistakes.</p>
          </li>
          <li className="p-3 bg-zinc-950/60 border border-zinc-850 rounded-xl">
            <span className="font-semibold text-rose-300">Rule 3: Never Use FAANG for Practice</span>
            <p className="text-zinc-400 mt-1">Rejections trigger a 6-month cooldown. Practice on mid-tier and startups first.</p>
          </li>
          <li className="p-3 bg-zinc-950/60 border border-zinc-850 rounded-xl">
            <span className="font-semibold text-emerald-300">Rule 4: Monthly Deliverable</span>
            <p className="text-zinc-400 mt-1">Every month ends with a project milestone or mock score. Otherwise the month was wasted.</p>
          </li>
          <li className="p-3 bg-zinc-950/60 border border-zinc-850 rounded-xl md:col-span-2">
            <span className="font-semibold text-purple-300">Rule 5: Protect Sunday (2-3 hours)</span>
            <p className="text-zinc-400 mt-1">Light day: review mistakes, plan next week. Burnout, not lack of hours, is the main failure risk.</p>
          </li>
        </ol>
      </div>
    </div>
  );
}
