import { getSupabaseClient, isSupabaseConfigured } from './supabase';
import { 
  StudySession, 
  ProblemLog, 
  SystemDesignLog, 
  WeeklyReview, 
  RoadmapGate, 
  ProjectMilestone, 
  JobApplication 
} from './types';
import { INITIAL_GATES, INITIAL_PROJECTS } from './roadmap-data';

const LOCAL_STORAGE_KEYS = {
  SESSIONS: 'roadmap_sessions',
  PROBLEMS: 'roadmap_problems',
  SYSTEM_DESIGN: 'roadmap_system_design',
  WEEKLY_REVIEWS: 'roadmap_weekly_reviews',
  GATES: 'roadmap_gates',
  PROJECTS: 'roadmap_projects',
  APPLICATIONS: 'roadmap_applications',
};

// --- Helper: Local Storage Fallback Initializer ---
function getLocal<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setLocal<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('Local storage write error:', err);
  }
}

// -------------------------------------------------------------
// 1. STUDY SESSIONS
// -------------------------------------------------------------
export async function fetchStudySessions(): Promise<StudySession[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from('study_sessions')
      .select('*')
      .order('session_date', { ascending: false });
    if (!error && data) return data as StudySession[];
  }
  return getLocal<StudySession[]>(LOCAL_STORAGE_KEYS.SESSIONS, []);
}

export async function saveStudySession(session: Omit<StudySession, 'id' | 'created_at'>): Promise<StudySession> {
  const newSession: StudySession = {
    ...session,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
  };

  const supabase = getSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from('study_sessions')
      .insert([newSession])
      .select()
      .single();
    if (!error && data) return data as StudySession;
  }

  const existing = getLocal<StudySession[]>(LOCAL_STORAGE_KEYS.SESSIONS, []);
  const updated = [newSession, ...existing];
  setLocal(LOCAL_STORAGE_KEYS.SESSIONS, updated);
  return newSession;
}

export async function updateStudySession(session: StudySession): Promise<void> {
  const supabase = getSupabaseClient();
  if (supabase) {
    await supabase.from('study_sessions').update(session).eq('id', session.id);
  }
  const existing = getLocal<StudySession[]>(LOCAL_STORAGE_KEYS.SESSIONS, []);
  const updated = existing.map(s => s.id === session.id ? session : s);
  setLocal(LOCAL_STORAGE_KEYS.SESSIONS, updated);
}

export async function deleteStudySession(id: string): Promise<void> {
  const supabase = getSupabaseClient();
  if (supabase) {
    await supabase.from('study_sessions').delete().eq('id', id);
  }
  const existing = getLocal<StudySession[]>(LOCAL_STORAGE_KEYS.SESSIONS, []);
  setLocal(LOCAL_STORAGE_KEYS.SESSIONS, existing.filter(s => s.id !== id));
}

// -------------------------------------------------------------
// 2. PROBLEMS & MISTAKES LOG (Spaced Repetition)
// -------------------------------------------------------------
export async function fetchProblemsLog(): Promise<ProblemLog[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from('problems_log')
      .select('*')
      .order('solved_date', { ascending: false });
    if (!error && data) return data as ProblemLog[];
  }
  return getLocal<ProblemLog[]>(LOCAL_STORAGE_KEYS.PROBLEMS, []);
}

export async function saveProblemLog(problem: Omit<ProblemLog, 'id' | 'created_at' | 'review_due_7d' | 'review_due_30d' | 'reviewed_7d' | 'reviewed_30d'>): Promise<ProblemLog> {
  const today = new Date(problem.solved_date || new Date().toISOString().split('T')[0]);
  
  const due7 = new Date(today);
  due7.setDate(due7.getDate() + 7);
  
  const due30 = new Date(today);
  due30.setDate(due30.getDate() + 30);

  const newProblem: ProblemLog = {
    ...problem,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    review_due_7d: due7.toISOString().split('T')[0],
    review_due_30d: due30.toISOString().split('T')[0],
    reviewed_7d: false,
    reviewed_30d: false,
  };

  const supabase = getSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from('problems_log')
      .insert([newProblem])
      .select()
      .single();
    if (!error && data) return data as ProblemLog;
  }

  const existing = getLocal<ProblemLog[]>(LOCAL_STORAGE_KEYS.PROBLEMS, []);
  const updated = [newProblem, ...existing];
  setLocal(LOCAL_STORAGE_KEYS.PROBLEMS, updated);
  return newProblem;
}

export async function markProblemReviewed(id: string, interval: '7d' | '30d', status: boolean): Promise<void> {
  const field = interval === '7d' ? 'reviewed_7d' : 'reviewed_30d';

  const supabase = getSupabaseClient();
  if (supabase) {
    await supabase.from('problems_log').update({ [field]: status }).eq('id', id);
  }

  const existing = getLocal<ProblemLog[]>(LOCAL_STORAGE_KEYS.PROBLEMS, []);
  const updated = existing.map(p => p.id === id ? { ...p, [field]: status } : p);
  setLocal(LOCAL_STORAGE_KEYS.PROBLEMS, updated);
}

export async function deleteProblemLog(id: string): Promise<void> {
  const supabase = getSupabaseClient();
  if (supabase) {
    await supabase.from('problems_log').delete().eq('id', id);
  }
  const existing = getLocal<ProblemLog[]>(LOCAL_STORAGE_KEYS.PROBLEMS, []);
  setLocal(LOCAL_STORAGE_KEYS.PROBLEMS, existing.filter(p => p.id !== id));
}

// -------------------------------------------------------------
// 3. SYSTEM DESIGN LOG
// -------------------------------------------------------------
export async function fetchSystemDesignLogs(): Promise<SystemDesignLog[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from('system_design_log')
      .select('*')
      .order('practiced_date', { ascending: false });
    if (!error && data) return data as SystemDesignLog[];
  }
  return getLocal<SystemDesignLog[]>(LOCAL_STORAGE_KEYS.SYSTEM_DESIGN, []);
}

export async function saveSystemDesignLog(entry: Omit<SystemDesignLog, 'id' | 'created_at'>): Promise<SystemDesignLog> {
  const newEntry: SystemDesignLog = {
    ...entry,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
  };

  const supabase = getSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from('system_design_log')
      .insert([newEntry])
      .select()
      .single();
    if (!error && data) return data as SystemDesignLog;
  }

  const existing = getLocal<SystemDesignLog[]>(LOCAL_STORAGE_KEYS.SYSTEM_DESIGN, []);
  const updated = [newEntry, ...existing];
  setLocal(LOCAL_STORAGE_KEYS.SYSTEM_DESIGN, updated);
  return newEntry;
}

// -------------------------------------------------------------
// 4. WEEKLY REVIEWS (Sunday Ritual)
// -------------------------------------------------------------
export async function fetchWeeklyReviews(): Promise<WeeklyReview[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from('weekly_reviews')
      .select('*')
      .order('week_number', { ascending: false });
    if (!error && data) return data as WeeklyReview[];
  }
  return getLocal<WeeklyReview[]>(LOCAL_STORAGE_KEYS.WEEKLY_REVIEWS, []);
}

export async function saveWeeklyReview(review: Omit<WeeklyReview, 'id' | 'created_at'>): Promise<WeeklyReview> {
  const newReview: WeeklyReview = {
    ...review,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
  };

  const supabase = getSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from('weekly_reviews')
      .upsert([newReview], { onConflict: 'week_number' })
      .select()
      .single();
    if (!error && data) return data as WeeklyReview;
  }

  const existing = getLocal<WeeklyReview[]>(LOCAL_STORAGE_KEYS.WEEKLY_REVIEWS, []);
  const filtered = existing.filter(r => r.week_number !== review.week_number);
  const updated = [newReview, ...filtered].sort((a, b) => b.week_number - a.week_number);
  setLocal(LOCAL_STORAGE_KEYS.WEEKLY_REVIEWS, updated);
  return newReview;
}

// -------------------------------------------------------------
// 5. ROADMAP GATES (Month 3, 6, 8)
// -------------------------------------------------------------
export async function fetchRoadmapGates(): Promise<RoadmapGate[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from('roadmap_gates')
      .select('*')
      .order('target_month', { ascending: true });
    if (!error && data && data.length > 0) return data as RoadmapGate[];
  }
  return getLocal<RoadmapGate[]>(LOCAL_STORAGE_KEYS.GATES, INITIAL_GATES);
}

export async function updateRoadmapGate(gate: RoadmapGate): Promise<void> {
  const supabase = getSupabaseClient();
  if (supabase) {
    await supabase.from('roadmap_gates').upsert(gate);
  }
  const existing = getLocal<RoadmapGate[]>(LOCAL_STORAGE_KEYS.GATES, INITIAL_GATES);
  const updated = existing.map(g => g.id === gate.id ? gate : g);
  setLocal(LOCAL_STORAGE_KEYS.GATES, updated);
}

// -------------------------------------------------------------
// 6. PROJECTS (RAG, CRM Agent, AI Service)
// -------------------------------------------------------------
export async function fetchProjectMilestones(): Promise<ProjectMilestone[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from('project_milestones')
      .select('*')
      .order('phase', { ascending: true });
    if (!error && data && data.length > 0) return data as ProjectMilestone[];
  }
  return getLocal<ProjectMilestone[]>(LOCAL_STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
}

export async function updateProjectMilestone(project: ProjectMilestone): Promise<void> {
  const supabase = getSupabaseClient();
  if (supabase) {
    await supabase.from('project_milestones').upsert(project);
  }
  const existing = getLocal<ProjectMilestone[]>(LOCAL_STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
  const updated = existing.map(p => p.id === project.id ? project : p);
  setLocal(LOCAL_STORAGE_KEYS.PROJECTS, updated);
}

// -------------------------------------------------------------
// 7. JOB APPLICATIONS & REFERRALS
// -------------------------------------------------------------
export async function fetchJobApplications(): Promise<JobApplication[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from('job_applications')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) return data as JobApplication[];
  }
  return getLocal<JobApplication[]>(LOCAL_STORAGE_KEYS.APPLICATIONS, []);
}

export async function saveJobApplication(app: Omit<JobApplication, 'id' | 'created_at'>): Promise<JobApplication> {
  const newApp: JobApplication = {
    ...app,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
  };

  const supabase = getSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from('job_applications')
      .insert([newApp])
      .select()
      .single();
    if (!error && data) return data as JobApplication;
  }

  const existing = getLocal<JobApplication[]>(LOCAL_STORAGE_KEYS.APPLICATIONS, []);
  const updated = [newApp, ...existing];
  setLocal(LOCAL_STORAGE_KEYS.APPLICATIONS, updated);
  return newApp;
}

export async function updateJobApplication(app: JobApplication): Promise<void> {
  const supabase = getSupabaseClient();
  if (supabase) {
    await supabase.from('job_applications').upsert(app);
  }
  const existing = getLocal<JobApplication[]>(LOCAL_STORAGE_KEYS.APPLICATIONS, []);
  const updated = existing.map(a => a.id === app.id ? app : a);
  setLocal(LOCAL_STORAGE_KEYS.APPLICATIONS, updated);
}

export async function deleteJobApplication(id: string): Promise<void> {
  const supabase = getSupabaseClient();
  if (supabase) {
    await supabase.from('job_applications').delete().eq('id', id);
  }
  const existing = getLocal<JobApplication[]>(LOCAL_STORAGE_KEYS.APPLICATIONS, []);
  setLocal(LOCAL_STORAGE_KEYS.APPLICATIONS, existing.filter(a => a.id !== id));
}
