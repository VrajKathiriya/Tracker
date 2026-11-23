-- ==============================================================================
-- 10-Month SDE-First, Applied AI Engineer Roadmap Tracker
-- Supabase PostgreSQL Database Schema
-- Run this script in your Supabase SQL Editor (Dashboard > SQL Editor > New query)
-- ==============================================================================

-- 1. Study Sessions (Logs every block of study: DSA, System Design, AI, Core CS, Revision)
CREATE TABLE IF NOT EXISTS study_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    session_date DATE NOT NULL DEFAULT CURRENT_DATE,
    category TEXT NOT NULL CHECK (category IN ('dsa', 'system_design', 'applied_ai', 'core_cs', 'revision', 'mocks', 'other')),
    duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
    duration_seconds INTEGER DEFAULT 0,
    block_number INTEGER CHECK (block_number IN (1, 2, 3, 4)),
    title TEXT,
    notes TEXT
);

-- Upgrade existing table if needed
ALTER TABLE study_sessions ADD COLUMN IF NOT EXISTS duration_seconds INTEGER DEFAULT 0;

-- Index for date queries
CREATE INDEX IF NOT EXISTS idx_study_sessions_date ON study_sessions(session_date);
CREATE INDEX IF NOT EXISTS idx_study_sessions_category ON study_sessions(category);

-- 2. DSA Problems & Mistakes Log (With 7-day and 30-day Spaced Repetition)
CREATE TABLE IF NOT EXISTS problems_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    solved_date DATE NOT NULL DEFAULT CURRENT_DATE,
    title TEXT NOT NULL,
    url TEXT,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    topic TEXT NOT NULL, -- e.g., Trees, Graphs, DP, Heaps, Sliding Window
    solve_status TEXT NOT NULL CHECK (solve_status IN ('clean_solve', 'with_hints', 'solution_referenced', 'failed')),
    time_taken_minutes INTEGER,
    mistake_notes TEXT,
    review_due_7d DATE NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '7 days')::date,
    review_due_30d DATE NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '30 days')::date,
    reviewed_7d BOOLEAN NOT NULL DEFAULT FALSE,
    reviewed_30d BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_problems_log_solved_date ON problems_log(solved_date);
CREATE INDEX IF NOT EXISTS idx_problems_review_7d ON problems_log(review_due_7d, reviewed_7d);
CREATE INDEX IF NOT EXISTS idx_problems_review_30d ON problems_log(review_due_30d, reviewed_30d);

-- 3. System Design & LLD Practice Log
CREATE TABLE IF NOT EXISTS system_design_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    practiced_date DATE NOT NULL DEFAULT CURRENT_DATE,
    title TEXT NOT NULL, -- e.g. URL shortener, Rate limiter, Splitwise, LRU Cache
    design_type TEXT NOT NULL CHECK (design_type IN ('HLD', 'LLD', 'AI_SYSTEM')),
    duration_minutes INTEGER NOT NULL DEFAULT 45,
    is_timed BOOLEAN NOT NULL DEFAULT TRUE,
    recorded_out_loud BOOLEAN NOT NULL DEFAULT FALSE,
    framework_followed BOOLEAN NOT NULL DEFAULT TRUE,
    notes TEXT
);

-- 4. Sunday Weekly Reviews (Rule #1: 3 numbers - problems solved, mocks done, outreach sent)
CREATE TABLE IF NOT EXISTS weekly_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    week_number INTEGER NOT NULL UNIQUE,
    week_start_date DATE NOT NULL,
    problems_solved_count INTEGER NOT NULL DEFAULT 0,
    mocks_done_count INTEGER NOT NULL DEFAULT 0,
    outreach_sent_count INTEGER NOT NULL DEFAULT 0,
    hours_completed NUMERIC(5, 2) NOT NULL DEFAULT 0,
    target_hours NUMERIC(5, 2) NOT NULL DEFAULT 40,
    reflection_notes TEXT
);

-- 5. Roadmap Gates (Month 3, Month 6, Month 8)
CREATE TABLE IF NOT EXISTS roadmap_gates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    gate_name TEXT NOT NULL UNIQUE,
    target_month INTEGER NOT NULL,
    is_passed BOOLEAN NOT NULL DEFAULT FALSE,
    checklist JSONB NOT NULL DEFAULT '[]'::jsonb,
    contingency_plan TEXT NOT NULL,
    notes TEXT
);

-- 6. Project Deliverables Tracker
CREATE TABLE IF NOT EXISTS project_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    project_slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    phase INTEGER NOT NULL,
    checklist JSONB NOT NULL DEFAULT '[]'::jsonb,
    github_url TEXT,
    demo_url TEXT,
    eval_metrics TEXT,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE
);

-- 7. Job Search & Outreach Tracker (Months 6-10)
CREATE TABLE IF NOT EXISTS job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    company TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'SDE-1 / SDE-2',
    tier TEXT NOT NULL CHECK (tier IN ('Practice', 'Strong Startup', 'FAANG-tier')),
    contact_person TEXT,
    contact_platform TEXT, -- e.g., GTU Alumni, Cybercom/Biziverse connection, LinkedIn
    status TEXT NOT NULL CHECK (status IN ('Identified', 'Referral Requested', 'Applied', 'OA', 'Interview', 'Offer', 'Rejected')),
    applied_date DATE,
    rejection_cause TEXT,
    notes TEXT
);

-- Seed initial Gates data
INSERT INTO roadmap_gates (gate_name, target_month, checklist, contingency_plan)
VALUES 
(
    'Month 3 Gate (Day 90)',
    3,
    '[
        {"id": "g1_1", "text": "110+ new DSA problems logged with patterns in mistakes log", "done": false},
        {"id": "g1_2", "text": "Solve Tree/Graph Medium in <= 35 mins without hints (~60% rate)", "done": false},
        {"id": "g1_3", "text": "Project 1 v1 deployed with README, architecture diagram, small eval set", "done": false},
        {"id": "g1_4", "text": "Design URL Shortener and Rate Limiter in 40 mins using fixed framework", "done": false},
        {"id": "g1_5", "text": "Explain indexes, caching, and LLM prompt processing in 2 mins out loud", "done": false}
    ]'::jsonb,
    'Move 4 hours/week from AI to DSA for 3 weeks. Keep system design at 9 hours/week.'
),
(
    'Month 6 Gate (Day 180)',
    6,
    '[
        {"id": "g2_1", "text": "~450 total problems solved (clear most mediums in 30 mins, DP mediums ~50%)", "done": false},
        {"id": "g2_2", "text": "Projects 1 & 2 deployed live with evaluation numbers (retrieval hit rate, latency, cost)", "done": false},
        {"id": "g2_3", "text": "Can design URL shortener, rate limiter, chat system, news feed in 40 mins", "done": false},
        {"id": "g2_4", "text": "Solve 2 LLD problems with running code & tests", "done": false},
        {"id": "g2_5", "text": "Completed at least 3 mock interviews and rebuilt resume with measured results", "done": false}
    ]'::jsonb,
    'Extend to 12 months: repeat Phase 2 depth for 2 more months and shift every later phase by 2 months.'
),
(
    'Month 8 Gate (Day 240)',
    8,
    '[
        {"id": "g3_1", "text": "15+ HLD designs and 10+ LLD problems completed, each timed", "done": false},
        {"id": "g3_2", "text": "8 mock interviews completed with written log of weaknesses exposed", "done": false},
        {"id": "g3_3", "text": "Started interview loops at 10+ startups/mid-tier companies with rejections mapped", "done": false},
        {"id": "g3_4", "text": "Able to talk about both AI projects for 20 mins each without notes", "done": false}
    ]'::jsonb,
    'Few replies: fix resume and referrals, not DSA. Coding rejections: add DSA hours. Design rejections: add design hours.'
)
ON CONFLICT (gate_name) DO NOTHING;

-- Seed initial Projects data
INSERT INTO project_milestones (project_slug, title, phase, checklist)
VALUES 
(
    'rag-document-qa',
    'Project 1: Document Q&A (RAG)',
    1,
    '[
        {"id": "p1_1", "text": "Hybrid search (BM25 + Dense vector embeddings)", "done": false},
        {"id": "p1_2", "text": "Reranking step (Cross-encoder or Cohere/bge-reranker)", "done": false},
        {"id": "p1_3", "text": "Eval set of 50-100 questions with measured retrieval hit rate & answer quality", "done": false},
        {"id": "p1_4", "text": "Clean React frontend with citations and streaming answers", "done": false},
        {"id": "p1_5", "text": "Live deployment URL + GitHub repo with README and architecture diagram", "done": false},
        {"id": "p1_6", "text": "2-minute walkthrough demo video", "done": false}
    ]'::jsonb
),
(
    'crm-assistant-agent',
    'Project 2: Tool-Using CRM Assistant',
    2,
    '[
        {"id": "p2_1", "text": "Agent over synthetic CRM data (leads, appointments, follow-ups)", "done": false},
        {"id": "p2_2", "text": "Text-to-SQL engine with read-only SQL guardrails & AST validation", "done": false},
        {"id": "p2_3", "text": "Human-in-the-loop confirmation before any database write", "done": false},
        {"id": "p2_4", "text": "Trace logs and failure-case evaluation benchmark", "done": false},
        {"id": "p2_5", "text": "Live deployment, test suite, and README with cost & latency metrics", "done": false},
        {"id": "p2_6", "text": "2-minute walkthrough demo video", "done": false}
    ]'::jsonb
),
(
    'production-ai-service',
    'Project 3: Production AI Service (Optional)',
    3,
    '[
        {"id": "p3_1", "text": "Multi-tenant API with Auth, rate limiting & model fallback", "done": false},
        {"id": "p3_2", "text": "Async jobs on a queue with streaming WebSocket/SSE responses", "done": false},
        {"id": "p3_3", "text": "OpenTelemetry tracing and cost/latency dashboard", "done": false},
        {"id": "p3_4", "text": "Load test report with Locust/k6 in README", "done": false}
    ]'::jsonb
)
ON CONFLICT (project_slug) DO NOTHING;

-- Disable Row Level Security for simple single-user personal access (or enable policies if multi-tenant)
ALTER TABLE study_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE problems_log DISABLE ROW LEVEL SECURITY;
ALTER TABLE system_design_log DISABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_gates DISABLE ROW LEVEL SECURITY;
ALTER TABLE project_milestones DISABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications DISABLE ROW LEVEL SECURITY;

-- Grant full schema and table permissions to Supabase API roles (anon, authenticated, service_role)
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, service_role;

