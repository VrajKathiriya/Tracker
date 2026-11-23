'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar, ActiveTab } from '@/components/Navbar';
import { ActiveTimer } from '@/components/ActiveTimer';
import { HoursAnalytics } from '@/components/HoursAnalytics';
import { ActivityCalendar } from '@/components/ActivityCalendar';
import { MistakesLogView } from '@/components/MistakesLogView';
import { SystemDesignView } from '@/components/SystemDesignView';
import { ProjectsView } from '@/components/ProjectsView';
import { RoadmapGatesView } from '@/components/RoadmapGatesView';
import { SundayReviewView } from '@/components/SundayReviewView';
import { JobHuntView } from '@/components/JobHuntView';

import { 
  fetchStudySessions, 
  fetchProblemsLog, 
  fetchSystemDesignLogs, 
  fetchWeeklyReviews, 
  fetchRoadmapGates, 
  fetchProjectMilestones, 
  fetchJobApplications 
} from '@/lib/storage';
import { ensureSupabaseConfig } from '@/lib/supabase';

import { 
  StudySession, 
  ProblemLog, 
  SystemDesignLog, 
  WeeklyReview, 
  RoadmapGate, 
  ProjectMilestone, 
  JobApplication 
} from '@/lib/types';

export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('timer');
  const [currentWeek, setCurrentWeek] = useState<number>(1);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Application Data States
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [problems, setProblems] = useState<ProblemLog[]>([]);
  const [systemDesigns, setSystemDesigns] = useState<SystemDesignLog[]>([]);
  const [weeklyReviews, setWeeklyReviews] = useState<WeeklyReview[]>([]);
  const [gates, setGates] = useState<RoadmapGate[]>([]);
  const [projects, setProjects] = useState<ProjectMilestone[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);

  const loadData = useCallback(async () => {
    try {
      await ensureSupabaseConfig();
      const [
        loadedSessions,
        loadedProblems,
        loadedDesigns,
        loadedReviews,
        loadedGates,
        loadedProjects,
        loadedApps,
      ] = await Promise.all([
        fetchStudySessions(),
        fetchProblemsLog(),
        fetchSystemDesignLogs(),
        fetchWeeklyReviews(),
        fetchRoadmapGates(),
        fetchProjectMilestones(),
        fetchJobApplications(),
      ]);

      setSessions(loadedSessions);
      setProblems(loadedProblems);
      setSystemDesigns(loadedDesigns);
      setWeeklyReviews(loadedReviews);
      setGates(loadedGates);
      setProjects(loadedProjects);
      setApplications(loadedApps);
    } catch (err) {
      console.error('Failed to load roadmap data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
    loadData();
    // Load persisted week preference
    const savedWeek = localStorage.getItem('tracker_current_week');
    if (savedWeek) {
      setCurrentWeek(Number(savedWeek));
    }
  }, [loadData]);

  const handleWeekChange = (w: number) => {
    setCurrentWeek(w);
    localStorage.setItem('tracker_current_week', String(w));
  };

  const totalMinutes = sessions.reduce((acc, s) => acc + s.duration_minutes, 0);
  const totalHours = totalMinutes / 60;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        currentWeek={currentWeek}
        onWeekChange={handleWeekChange}
        totalHoursCompleted={totalHours}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-zinc-400 font-medium">Loading your roadmap workspace...</span>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-fadeIn">
            {activeTab === 'timer' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-8 space-y-6">
                  <ActiveTimer 
                    sessions={sessions} 
                    onSessionLogged={loadData} 
                    onNavigateTab={setActiveTab} 
                  />
                  <HoursAnalytics
                    sessions={sessions}
                    onSessionDeleted={loadData}
                    currentWeek={currentWeek}
                  />
                </div>
                <div className="lg:col-span-4 space-y-6">
                  <ActivityCalendar
                    sessions={sessions}
                    selectedDate={selectedDate}
                    onSelectDate={setSelectedDate}
                    onSessionDeleted={loadData}
                  />
                </div>
              </div>
            )}

            {activeTab === 'mistakes' && (
              <MistakesLogView problems={problems} onRefresh={loadData} />
            )}

            {activeTab === 'system_design' && (
              <SystemDesignView logs={systemDesigns} onRefresh={loadData} />
            )}

            {activeTab === 'projects' && (
              <ProjectsView projects={projects} onRefresh={loadData} />
            )}

            {activeTab === 'gates' && (
              <RoadmapGatesView
                gates={gates}
                onRefresh={loadData}
                currentWeek={currentWeek}
              />
            )}

            {activeTab === 'sunday' && (
              <SundayReviewView
                reviews={weeklyReviews}
                onRefresh={loadData}
                currentWeek={currentWeek}
              />
            )}

            {activeTab === 'jobs' && (
              <JobHuntView
                applications={applications}
                onRefresh={loadData}
              />
            )}
          </div>
        )}
      </main>

      <footer className="border-t border-zinc-900 bg-zinc-950 py-6 text-center text-xs text-zinc-600">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>
            SDE-First, Applied AI Engineer 10-Month Roadmap • Target: 30+ LPA
          </span>
          <span className="text-zinc-500">
            44 Weeks • 1,760 Hours • 4 Daily Blocks • 3 Decision Gates
          </span>
        </div>
      </footer>
    </div>
  );
}
