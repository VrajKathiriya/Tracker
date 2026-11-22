export type StudyCategory = 
  | 'dsa' 
  | 'system_design' 
  | 'applied_ai' 
  | 'core_cs' 
  | 'revision' 
  | 'mocks' 
  | 'other';

export interface StudySession {
  id: string;
  created_at: string;
  session_date: string;
  category: StudyCategory;
  duration_minutes: number;
  block_number?: 1 | 2 | 3 | 4;
  title?: string;
  notes?: string;
}

export type ProblemDifficulty = 'Easy' | 'Medium' | 'Hard';

export type ProblemSolveStatus = 
  | 'clean_solve' 
  | 'with_hints' 
  | 'solution_referenced' 
  | 'failed';

export interface ProblemLog {
  id: string;
  created_at: string;
  solved_date: string;
  title: string;
  url?: string;
  difficulty: ProblemDifficulty;
  topic: string; // Trees, Graphs, DP, Heaps, Sliding Window, etc.
  solve_status: ProblemSolveStatus;
  time_taken_minutes?: number;
  mistake_notes?: string;
  review_due_7d: string;
  review_due_30d: string;
  reviewed_7d: boolean;
  reviewed_30d: boolean;
}

export type DesignType = 'HLD' | 'LLD' | 'AI_SYSTEM';

export interface SystemDesignLog {
  id: string;
  created_at: string;
  practiced_date: string;
  title: string;
  design_type: DesignType;
  duration_minutes: number;
  is_timed: boolean;
  recorded_out_loud: boolean;
  framework_followed: boolean;
  notes?: string;
}

export interface WeeklyReview {
  id: string;
  created_at: string;
  week_number: number;
  week_start_date: string;
  problems_solved_count: number;
  mocks_done_count: number;
  outreach_sent_count: number;
  hours_completed: number;
  target_hours: number;
  reflection_notes?: string;
}

export interface GateChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface RoadmapGate {
  id: string;
  gate_name: string;
  target_month: number;
  is_passed: boolean;
  checklist: GateChecklistItem[];
  contingency_plan: string;
  notes?: string;
}

export interface ProjectMilestone {
  id: string;
  project_slug: string;
  title: string;
  phase: number;
  checklist: GateChecklistItem[];
  github_url?: string;
  demo_url?: string;
  eval_metrics?: string;
  is_completed: boolean;
}

export type ApplicationTier = 'Practice' | 'Strong Startup' | 'FAANG-tier';
export type ApplicationStatus = 
  | 'Identified' 
  | 'Referral Requested' 
  | 'Applied' 
  | 'OA' 
  | 'Interview' 
  | 'Offer' 
  | 'Rejected';

export interface JobApplication {
  id: string;
  created_at: string;
  company: string;
  role: string;
  tier: ApplicationTier;
  contact_person?: string;
  contact_platform?: string;
  status: ApplicationStatus;
  applied_date?: string;
  rejection_cause?: string;
  notes?: string;
}
