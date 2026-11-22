import { RoadmapGate, ProjectMilestone } from './types';

export interface DailyBlockConfig {
  blockNumber: 1 | 2 | 3 | 4;
  title: string;
  category: 'dsa' | 'system_design' | 'applied_ai' | 'revision';
  timeDescription: string;
  targetMinutes: number;
  description: string;
  phaseNotes?: string;
}

export const DAILY_BLOCKS: DailyBlockConfig[] = [
  {
    blockNumber: 1,
    title: 'Block 1: DSA in Python',
    category: 'dsa',
    timeDescription: 'Morning (~3 hours)',
    targetMinutes: 180,
    description: 'Learn one pattern, then solve problems on it. Do the hardest thinking when fresh.',
  },
  {
    blockNumber: 2,
    title: 'Block 2: System Design / LLD',
    category: 'system_design',
    timeDescription: 'Midday (~1.5 hours)',
    targetMinutes: 90,
    description: 'Read or watch one concept, then design on paper and explain it out loud.',
  },
  {
    blockNumber: 3,
    title: 'Block 3: Applied AI / Projects',
    category: 'applied_ai',
    timeDescription: 'Afternoon (~1.5 hours)',
    targetMinutes: 90,
    description: 'Build or study. In months 7-10 this block shifts to core CS, mocks and applications.',
  },
  {
    blockNumber: 4,
    title: 'Block 4: Mistakes Log & Flashcards',
    category: 'revision',
    timeDescription: 'Evening (~30 minutes)',
    targetMinutes: 30,
    description: 'Revisit your mistakes log (7-day and 30-day spaced reviews) and flashcards.',
  },
];

export const ROADMAP_PHASES = [
  {
    phase: 1,
    name: 'Foundations',
    months: 'Months 1-3 (Weeks 1-13)',
    hoursPerWeek: {
      total: 40,
      dsa: 18,
      systemDesign: 9,
      appliedAi: 9,
      coreCs: 0,
      mocks: 0,
      revision: 4,
    },
    goal: 'Solve most trees, graphs & heap mediums in Python in ~35m. Production-style FastAPI backend. System design building blocks. Deploy Project 1 v1 on GitHub.',
    deliverable: 'Project 1 v1 (Document RAG Q&A) deployed with eval set & architecture diagram.',
  },
  {
    phase: 2,
    name: 'Depth & First Projects',
    months: 'Months 4-6 (Weeks 14-26)',
    hoursPerWeek: {
      total: 40,
      dsa: 15,
      systemDesign: 11,
      appliedAi: 9,
      coreCs: 0,
      mocks: 0,
      revision: 5,
    },
    goal: 'Master DP and advanced graphs in 30 mins. System design in 40 mins with DDIA depth + LLD code. Two live AI projects with evaluation numbers. Rebuild resume.',
    deliverable: 'Projects 1 & 2 live with metrics. Rebuilt 1-page resume. First 3 mocks completed.',
  },
  {
    phase: 3,
    name: 'Design, LLD & First Interviews',
    months: 'Months 7-8 (Weeks 27-35)',
    hoursPerWeek: {
      total: 40,
      dsa: 10,
      systemDesign: 12,
      appliedAi: 4,
      coreCs: 4,
      mocks: 8,
      revision: 2,
    },
    goal: '15+ HLD designs & 10+ LLD in Python. Core CS (OS, DB, Networking). Behavioral stories. Start interview loops at startups and mid-tier companies.',
    deliverable: '8 mocks done. 10+ startup/mid-tier loops started with all rejections mapped to causes.',
  },
  {
    phase: 4,
    name: 'Interview Mode',
    months: 'Months 9-10 (Weeks 36-44)',
    hoursPerWeek: {
      total: 40,
      dsa: 10,
      systemDesign: 8,
      appliedAi: 6,
      coreCs: 0,
      mocks: 14,
      revision: 2,
    },
    goal: 'Full FAANG and top-tier startup loops (Amazon, Microsoft, Razorpay, CRED). Full Saturday back-to-back mock days. Offer negotiation.',
    deliverable: 'Offer in hand at 30+ LPA. Negotiated offer.',
  },
];

export const INITIAL_GATES: RoadmapGate[] = [
  {
    id: 'gate-m3',
    gate_name: 'Month 3 Gate (Day 90)',
    target_month: 3,
    is_passed: false,
    checklist: [
      { id: 'g1_1', text: '110+ new DSA problems logged with patterns in mistakes log', done: false },
      { id: 'g1_2', text: 'Solve Tree/Graph Medium in <= 35 mins without hints (~60% rate)', done: false },
      { id: 'g1_3', text: 'Project 1 v1 deployed with README, architecture diagram, small eval set', done: false },
      { id: 'g1_4', text: 'Design URL Shortener and Rate Limiter in 40 mins using fixed framework', done: false },
      { id: 'g1_5', text: 'Explain indexes, caching, and LLM prompt processing in 2 mins out loud', done: false },
    ],
    contingency_plan: 'Move 4 hours/week from AI to DSA for 3 weeks. Keep system design at 9 hours/week.',
  },
  {
    id: 'gate-m6',
    gate_name: 'Month 6 Gate (Day 180) - CRITICAL',
    target_month: 6,
    is_passed: false,
    checklist: [
      { id: 'g2_1', text: '~450 total problems solved (clear most mediums in 30 mins, DP mediums ~50%)', done: false },
      { id: 'g2_2', text: 'Projects 1 & 2 deployed live with evaluation numbers (retrieval hit rate, latency, cost)', done: false },
      { id: 'g2_3', text: 'Can design URL shortener, rate limiter, chat system, news feed in 40 mins', done: false },
      { id: 'g2_4', text: 'Solve 2 LLD problems with running code & tests', done: false },
      { id: 'g2_5', text: 'Completed at least 3 mock interviews and rebuilt resume with measured results', done: false },
    ],
    contingency_plan: 'Extend to 12 months: repeat Phase 2 depth for 2 more months and shift every later phase by 2 months.',
  },
  {
    id: 'gate-m8',
    gate_name: 'Month 8 Gate (Day 240)',
    target_month: 8,
    is_passed: false,
    checklist: [
      { id: 'g3_1', text: '15+ HLD designs and 10+ LLD problems completed, each timed', done: false },
      { id: 'g3_2', text: '8 mock interviews completed with written log of weaknesses exposed', done: false },
      { id: 'g3_3', text: 'Started interview loops at 10+ startups/mid-tier companies with rejections mapped', done: false },
      { id: 'g3_4', text: 'Able to talk about both AI projects for 20 mins each without notes', done: false },
    ],
    contingency_plan: 'Few replies: fix resume and referrals, not DSA. Coding rejections: add DSA hours. Design rejections: add design hours.',
  },
];

export const INITIAL_PROJECTS: ProjectMilestone[] = [
  {
    id: 'proj-1',
    project_slug: 'rag-document-qa',
    title: 'Project 1: Document Q&A (RAG)',
    phase: 1,
    is_completed: false,
    checklist: [
      { id: 'p1_1', text: 'Hybrid search (BM25 keyword + Dense vector embeddings)', done: false },
      { id: 'p1_2', text: 'Reranking step (Cross-encoder or Cohere/bge-reranker)', done: false },
      { id: 'p1_3', text: 'Eval set of 50-100 questions with measured retrieval hit rate & answer quality', done: false },
      { id: 'p1_4', text: 'Clean React frontend with citations and streaming answers', done: false },
      { id: 'p1_5', text: 'Live deployment URL + GitHub repo with README and architecture diagram', done: false },
      { id: 'p1_6', text: '2-minute walkthrough demo video on LinkedIn', done: false },
    ],
  },
  {
    id: 'proj-2',
    project_slug: 'crm-assistant-agent',
    title: 'Project 2: Tool-Using CRM Assistant',
    phase: 2,
    is_completed: false,
    checklist: [
      { id: 'p2_1', text: 'Agent over synthetic CRM data (leads, appointments, follow-ups)', done: false },
      { id: 'p2_2', text: 'Text-to-SQL engine with read-only SQL guardrails & AST validation', done: false },
      { id: 'p2_3', text: 'Human-in-the-loop confirmation before any database write', done: false },
      { id: 'p2_4', text: 'Trace logs and failure-case evaluation benchmark', done: false },
      { id: 'p2_5', text: 'Live deployment, test suite, and README with cost & latency metrics', done: false },
      { id: 'p2_6', text: '2-minute walkthrough demo video on LinkedIn', done: false },
    ],
  },
  {
    id: 'proj-3',
    project_slug: 'production-ai-service',
    title: 'Project 3: Production AI Service (Optional)',
    phase: 3,
    is_completed: false,
    checklist: [
      { id: 'p3_1', text: 'Multi-tenant API with Auth, rate limiting & model fallback', done: false },
      { id: 'p3_2', text: 'Async jobs on a queue with streaming WebSocket/SSE responses', done: false },
      { id: 'p3_3', text: 'OpenTelemetry tracing and cost/latency dashboard', done: false },
      { id: 'p3_4', text: 'Load test report with Locust/k6 in README', done: false },
    ],
  },
];

export const DSA_TOPICS = [
  'Arrays & Hashing',
  'Two Pointers',
  'Sliding Window',
  'Stack',
  'Binary Search',
  'Linked List',
  'Trees (DFS, BFS, BST)',
  'Tries',
  'Heap / Priority Queue',
  'Backtracking',
  'Graphs (BFS, DFS, Topo Sort, Union-Find)',
  'Advanced Graphs (Dijkstra, Shortest Path)',
  '1-D Dynamic Programming',
  '2-D Dynamic Programming / Knapsack',
  'Greedy',
  'Intervals',
  'Math & Bit Manipulation',
];
