export type ResourceCategory = 'system_design' | 'applied_ai';

export type SystemDesignSubcategory = 'hld' | 'lld' | 'databases' | 'core_cs';
export type AppliedAISubcategory = 'llm_foundations' | 'rag' | 'agents' | 'evals';

export interface StudyResource {
  id: string;
  stepNumber: number; // 1, 2, 3... chronological learning order
  phaseNumber: 1 | 2 | 3 | 4;
  phaseLabel: string;
  timing: string; // e.g. "Day 1 • First 60 Mins", "Week 1", "Month 2"
  orderAdvice: string; // Plain-English learning sequence instructions
  prerequisite: string; // What to finish before this
  nextStep: string; // What to study immediately after this
  title: string;
  authorOrProvider: string;
  url: string;
  category: ResourceCategory;
  subcategory: SystemDesignSubcategory | AppliedAISubcategory;
  type: 'Interactive Guide' | 'Book' | 'Video Playlist' | 'GitHub Repo' | 'Short Course' | 'Documentation' | 'Article';
  cost: 'Free' | 'Paid' | 'Book / Free Excerpts' | 'Free / Open Source';
  priority: 'Essential #1' | 'Core Practice' | 'Deep Dive' | 'Must Watch Day 1';
  targetPhase: string;
  description: string;
  whyItMatters: string;
  tags: string[];
}

export const APPLIED_AI_RESOURCES: StudyResource[] = [
  {
    id: 'ai-karpathy-intro',
    stepNumber: 1,
    phaseNumber: 1,
    phaseLabel: 'Phase 1: Foundations & RAG (Months 1–3)',
    timing: 'Day 1 • First 60 Minutes',
    orderAdvice: '1️⃣ START HERE FIRST. Watch this on Day 1 before writing any code.',
    prerequisite: 'None — Start here. Zero AI knowledge required.',
    nextStep: 'Step 02: 3Blue1Brown visual attention intuition.',
    title: 'Intro to Large Language Models (1 Hour Deep Dive)',
    authorOrProvider: 'Andrej Karpathy (ex-OpenAI, Tesla AI)',
    url: 'https://www.youtube.com/watch?v=zjkBMFhNj_g',
    category: 'applied_ai',
    subcategory: 'llm_foundations',
    type: 'Video Playlist',
    cost: 'Free',
    priority: 'Must Watch Day 1',
    targetPhase: 'Month 1 (Phase 1)',
    description: 'The definitive 1-hour mental model of how modern LLMs work: pretraining on internet text, tokenization, fine-tuning, RLHF, and hallucination causes.',
    whyItMatters: 'Provides the conceptual foundation so you can speak accurately about model behavior without buzzwords in technical interviews.',
    tags: ['Foundations', 'Pretraining', 'RLHF', 'Karpathy', 'Day 1']
  },
  {
    id: 'ai-3blue1brown-transformers',
    stepNumber: 2,
    phaseNumber: 1,
    phaseLabel: 'Phase 1: Foundations & RAG (Months 1–3)',
    timing: 'Week 1 • Days 2–4',
    orderAdvice: '2️⃣ LEARN VISUAL INTUITION. Understand what vectors and attention actually do.',
    prerequisite: 'Step 01 (Karpathy 1-hour intro).',
    nextStep: 'Step 03: FastAPI async streaming backend.',
    title: 'Transformers & Attention Visually Explained',
    authorOrProvider: '3Blue1Brown',
    url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi',
    category: 'applied_ai',
    subcategory: 'llm_foundations',
    type: 'Video Playlist',
    cost: 'Free',
    priority: 'Must Watch Day 1',
    targetPhase: 'Month 1 (Phase 1)',
    description: 'Incredible animated visualization of word embeddings, attention mechanisms, Query-Key-Value vector math, and feedforward networks.',
    whyItMatters: 'Allows you to answer "How does self-attention work?" and "What is an embedding vector?" with crystal-clear geometric intuition.',
    tags: ['Attention', 'Embeddings', 'Transformers', 'Math Intuition']
  },
  {
    id: 'ai-fastapi-backend',
    stepNumber: 3,
    phaseNumber: 1,
    phaseLabel: 'Phase 1: Foundations & RAG (Months 1–3)',
    timing: 'Weeks 1–2 • Backend Setup',
    orderAdvice: '3️⃣ BUILD THE PYTHON BACKEND. Learn async execution and token streaming.',
    prerequisite: 'Basic Python knowledge & Step 01.',
    nextStep: 'Step 04: Build Project 1 with Advanced RAG.',
    title: 'FastAPI Production Backend & Streaming (SSE)',
    authorOrProvider: 'Tiangolo (FastAPI Official)',
    url: 'https://fastapi.tiangolo.com/tutorial/',
    category: 'applied_ai',
    subcategory: 'llm_foundations',
    type: 'Documentation',
    cost: 'Free',
    priority: 'Core Practice',
    targetPhase: 'Months 1-3 (Phase 1)',
    description: 'Building async Python APIs with Pydantic type validation, streaming token responses using Server-Sent Events (SSE), and connection pooling.',
    whyItMatters: 'In production, models take seconds to generate text. You must know how to stream tokens asynchronously over HTTP using FastAPI.',
    tags: ['FastAPI', 'Pydantic', 'Async', 'Streaming SSE', 'Python']
  },
  {
    id: 'ai-deeplearning-rag',
    stepNumber: 4,
    phaseNumber: 1,
    phaseLabel: 'Phase 1: Foundations & RAG (Months 1–3)',
    timing: 'Month 2 • Build Project 1',
    orderAdvice: '4️⃣ BUILD PROJECT 1 (RAG). Hands-on course for chunking, vector DBs & rerankers.',
    prerequisite: 'Steps 01, 02, and 03.',
    nextStep: 'Step 05: Chip Huyen AI Engineering handbook.',
    title: 'Building & Evaluating Advanced RAG Applications',
    authorOrProvider: 'DeepLearning.AI & LlamaIndex',
    url: 'https://www.deeplearning.ai/short-courses/building-evaluating-advanced-rag/',
    category: 'applied_ai',
    subcategory: 'rag',
    type: 'Short Course',
    cost: 'Free',
    priority: 'Essential #1',
    targetPhase: 'Months 2-4 (Project 1)',
    description: 'Hands-on course implementing sentence-window retrieval, auto-merging chunk trees, cross-encoder rerankers, and retrieval hit-rate metrics (TruLens).',
    whyItMatters: 'Direct blueprint for your Project 1 (Document Q&A RAG), allowing you to prove retrieval hit rate and latency numbers on your resume.',
    tags: ['Advanced RAG', 'Rerankers', 'Project 1', 'LlamaIndex', 'Hybrid Search']
  },
  {
    id: 'ai-chip-huyen-book',
    stepNumber: 5,
    phaseNumber: 1,
    phaseLabel: 'Phase 1: Foundations & RAG (Months 1–3)',
    timing: 'Months 2–3 • Production Rigor',
    orderAdvice: '5️⃣ READ THE AI PRODUCTION HANDBOOK. Master structured outputs and prompt engineering.',
    prerequisite: 'Step 04 (Building RAG).',
    nextStep: 'Phase 2: Step 06 (Anthropic Agents Guide).',
    title: 'AI Engineering: Building Applications with Foundation Models',
    authorOrProvider: 'Chip Huyen (O’Reilly)',
    url: 'https://huyenchip.com/',
    category: 'applied_ai',
    subcategory: 'rag',
    type: 'Book',
    cost: 'Book / Free Excerpts',
    priority: 'Essential #1',
    targetPhase: 'Months 2-6 (Phase 1 & 2)',
    description: 'The premier production handbook covering prompt engineering, structured outputs, chunking strategies, hybrid search, rerankers, and evaluation.',
    whyItMatters: 'Focuses entirely on software engineering with LLMs—how to build reliable software around non-deterministic models.',
    tags: ['AI Engineering', 'Production RAG', 'Chunking', 'Hybrid Search', 'Handbook']
  },
  {
    id: 'ai-anthropic-agents',
    stepNumber: 6,
    phaseNumber: 2,
    phaseLabel: 'Phase 2: Autonomous Agents & MCP (Months 4–6)',
    timing: 'Month 4 • Agent Architecture',
    orderAdvice: '6️⃣ READ BEFORE WRITING AGENT CODE. Understand deterministic workflows vs autonomous loops.',
    prerequisite: 'Completed Phase 1 (Project 1 deployed).',
    nextStep: 'Step 07: Hugging Face Agents course hands-on.',
    title: 'Building Effective Agents: Architectural Patterns',
    authorOrProvider: 'Anthropic Research',
    url: 'https://www.anthropic.com/research/building-effective-agents',
    category: 'applied_ai',
    subcategory: 'agents',
    type: 'Documentation',
    cost: 'Free',
    priority: 'Essential #1',
    targetPhase: 'Months 4-6 (Project 2)',
    description: 'Anthropic’s definitive guide on when to use workflows vs autonomous agents: Prompt Chaining, Routing, Parallelization, Orchestrator-Workers, and Evaluator-Optimizer loops.',
    whyItMatters: 'Interviewers will ask: "Why didn’t you just use an autonomous loop?" This guide teaches you how to design predictable, reliable agent workflows.',
    tags: ['Agents', 'Anthropic', 'Workflow Patterns', 'Project 2', 'ReAct']
  },
  {
    id: 'ai-hf-agents-course',
    stepNumber: 7,
    phaseNumber: 2,
    phaseLabel: 'Phase 2: Autonomous Agents & MCP (Months 4–6)',
    timing: 'Months 4–5 • Build Project 2',
    orderAdvice: '7️⃣ BUILD PROJECT 2 (CRM AGENT). Implement ReAct loops, tool calling & state machines.',
    prerequisite: 'Step 06 (Anthropic guide).',
    nextStep: 'Step 08: Model Context Protocol (MCP).',
    title: 'The Hugging Face AI Agents Course',
    authorOrProvider: 'Hugging Face',
    url: 'https://huggingface.co/learn/agents-course/unit0/introduction',
    category: 'applied_ai',
    subcategory: 'agents',
    type: 'Interactive Guide',
    cost: 'Free',
    priority: 'Core Practice',
    targetPhase: 'Months 4-6 (Phase 2)',
    description: 'Step-by-step hands-on implementation of the ReAct (Reason + Act) loop, function calling, state management, error recovery, and tool integration.',
    whyItMatters: 'Teaches you how to build your own agent loop from first principles without relying blindly on bloated frameworks.',
    tags: ['ReAct Loop', 'Tool Calling', 'Hugging Face', 'State', 'Project 2']
  },
  {
    id: 'ai-mcp-protocol',
    stepNumber: 8,
    phaseNumber: 2,
    phaseLabel: 'Phase 2: Autonomous Agents & MCP (Months 4–6)',
    timing: 'Month 5 • External Integrations',
    orderAdvice: '8️⃣ CONNECT EXTERNAL TOOLS SAFELY. Master the 2026 open standard for LLM tool calling.',
    prerequisite: 'Step 07 (ReAct tool loops).',
    nextStep: 'Step 09: Langfuse observability & tracing.',
    title: 'Model Context Protocol (MCP) Official Specification',
    authorOrProvider: 'Anthropic & Open Source Community',
    url: 'https://modelcontextprotocol.io/',
    category: 'applied_ai',
    subcategory: 'agents',
    type: 'Documentation',
    cost: 'Free',
    priority: 'Core Practice',
    targetPhase: 'Months 5-6 (Phase 2)',
    description: 'The open standard for connecting AI models to data sources and development tools safely. Learn how MCP clients and servers communicate via JSON-RPC.',
    whyItMatters: 'MCP is rapidly becoming the industry standard in 2026. Knowing how to write an MCP server sets your resume apart from generic wrappers.',
    tags: ['MCP', 'JSON-RPC', 'Tool Standard', 'Anthropic', 'Postgres']
  },
  {
    id: 'ai-langfuse-tracing',
    stepNumber: 9,
    phaseNumber: 2,
    phaseLabel: 'Phase 2: Autonomous Agents & MCP (Months 4–6)',
    timing: 'Months 5–6 • Observability',
    orderAdvice: '9️⃣ INSTRUMENT OBSERVABILITY. Measure latency, token cost, and tool call traces.',
    prerequisite: 'Steps 07 & 08 (Working Agent).',
    nextStep: 'Phase 3: Step 10 (Hamel Husain Evals Guide).',
    title: 'Langfuse: Open Source LLM Observability & Tracing',
    authorOrProvider: 'Langfuse',
    url: 'https://langfuse.com/docs',
    category: 'applied_ai',
    subcategory: 'evals',
    type: 'Documentation',
    cost: 'Free / Open Source',
    priority: 'Core Practice',
    targetPhase: 'Months 5-7 (Project 2 & 3)',
    description: 'Full observability stack for LLM apps: tracing nested tool-calls, token costs per query, P95 latency breakdown, and user feedback capture.',
    whyItMatters: 'Shows interviewers that you treat AI like a production software system with monitoring, telemetry, and debugging tools.',
    tags: ['Observability', 'Tracing', 'Token Cost', 'OpenTelemetry', 'Metrics']
  },
  {
    id: 'ai-hamel-evals',
    stepNumber: 10,
    phaseNumber: 3,
    phaseLabel: 'Phase 3: Evaluation, Hardening & Scale (Months 7–8)',
    timing: 'Months 7–8 • Benchmark Rigor',
    orderAdvice: '🔟 BUILD GOLDEN TEST BENCHMARKS. Prove accuracy with numbers on your resume.',
    prerequisite: 'Completed Projects 1 & 2.',
    nextStep: 'Phase 4: 20-minute spoken project walkthroughs for interview loops.',
    title: 'A Practical Guide to Evaluating LLM Applications',
    authorOrProvider: 'Hamel Husain (ex-GitHub, Airbnb)',
    url: 'https://hamel.dev/blog/posts/evals/',
    category: 'applied_ai',
    subcategory: 'evals',
    type: 'Article',
    cost: 'Free',
    priority: 'Essential #1',
    targetPhase: 'Months 4-7 (Phase 2 & 3)',
    description: 'How to build realistic benchmark test suites, measure retrieval accuracy, calibrate LLM-as-a-Judge evaluators, and avoid metric overfitting.',
    whyItMatters: 'The difference between an amateur AI developer and a Senior Applied AI Engineer is evaluation. Measured numbers get you hired.',
    tags: ['Evaluations', 'LLM-as-a-Judge', 'Benchmarks', 'Quality', 'Metrics']
  }
];

export const SYSTEM_DESIGN_RESOURCES: StudyResource[] = [
  {
    id: 'sd-hello-interview',
    stepNumber: 1,
    phaseNumber: 1,
    phaseLabel: 'Phase 1: Foundations & Delivery Framework (Months 1–3)',
    timing: 'Month 1 • Master the Framework First',
    orderAdvice: '1️⃣ START HERE FIRST. Learn the 45-minute interview delivery framework.',
    prerequisite: 'None — Start here. Understand how interviews are evaluated.',
    nextStep: 'Step 02: System Design Primer core building blocks.',
    title: 'Hello Interview: System Design in a Hurry',
    authorOrProvider: 'Hello Interview',
    url: 'https://www.hellointerview.com/learn/system-design/in-a-hurry/introduction',
    category: 'system_design',
    subcategory: 'hld',
    type: 'Interactive Guide',
    cost: 'Free',
    priority: 'Essential #1',
    targetPhase: 'Months 1-3 (Phase 1)',
    description: 'The definitive modern 45-minute interview delivery framework: requirements, capacity estimates, core APIs, high-level architecture, and deep dives.',
    whyItMatters: 'Interviews are graded on structure and trade-offs, not just drawing boxes. This framework teaches you how to steer the conversation.',
    tags: ['Framework', 'Delivery', 'Trade-offs', 'Capacity Estimation']
  },
  {
    id: 'sd-primer',
    stepNumber: 2,
    phaseNumber: 1,
    phaseLabel: 'Phase 1: Foundations & Delivery Framework (Months 1–3)',
    timing: 'Month 1–2 • Building Blocks',
    orderAdvice: '2️⃣ LEARN THE CORE COMPONENTS. Understand DNS, CDNs, Load Balancers, and Caches.',
    prerequisite: 'Step 01 (Delivery framework).',
    nextStep: 'Step 03: Alex Xu Volume 1 architectural blueprints.',
    title: 'The System Design Primer',
    authorOrProvider: 'Donne Martin (280k+ Stars)',
    url: 'https://github.com/donnemartin/system-design-primer',
    category: 'system_design',
    subcategory: 'hld',
    type: 'GitHub Repo',
    cost: 'Free',
    priority: 'Core Practice',
    targetPhase: 'Months 1-8 (All Phases)',
    description: 'Immense open-source collection covering DNS, CDN, Load Balancers, Caching, Asynchronism, NoSQL vs SQL, and database sharding with visual diagrams.',
    whyItMatters: 'Great reference cheatsheet when reviewing specific components (e.g. Reverse Proxy vs Load Balancer, CAP Theorem).',
    tags: ['Cheatsheet', 'Open Source', 'Components', 'CAP Theorem']
  },
  {
    id: 'sd-alex-xu',
    stepNumber: 3,
    phaseNumber: 1,
    phaseLabel: 'Phase 1: Foundations & Delivery Framework (Months 1–3)',
    timing: 'Months 2–3 • First 5 Systems',
    orderAdvice: '3️⃣ STUDY 5 CLASSIC SYSTEMS. Practice URL Shortener, Rate Limiter, and Notification System.',
    prerequisite: 'Steps 01 and 02.',
    nextStep: 'Phase 2: Step 04 (Gaurav Sen Distributed Systems).',
    title: 'System Design Interview – An Insider’s Guide (Vol 1 & 2)',
    authorOrProvider: 'Alex Xu (ByteByteGo)',
    url: 'https://bytebytego.com/',
    category: 'system_design',
    subcategory: 'hld',
    type: 'Book',
    cost: 'Paid',
    priority: 'Core Practice',
    targetPhase: 'Months 1-5 (Phases 1 & 2)',
    description: 'Visual step-by-step blueprints for 30+ classic systems: Rate Limiter, TinyURL, Notification System, Web Crawler, Chat App, YouTube, and Payment System.',
    whyItMatters: 'Provides standardized architecture diagrams and component trade-offs for almost every question asked at Amazon, Microsoft, and Razorpay.',
    tags: ['Architectures', 'Case Studies', 'ByteByteGo', 'HLD']
  },
  {
    id: 'sd-gaurav-sen',
    stepNumber: 4,
    phaseNumber: 2,
    phaseLabel: 'Phase 2: Distributed Storage & Scale (Months 4–6)',
    timing: 'Month 4 • Distributed Intuition',
    orderAdvice: '4️⃣ VISUALIZE DISTRIBUTED CONCEPTS. Consistent hashing, bloom filters & message queues.',
    prerequisite: 'Completed Phase 1 systems.',
    nextStep: 'Step 05: DDIA (Designing Data-Intensive Applications).',
    title: 'System Design Distributed Systems Series',
    authorOrProvider: 'Gaurav Sen (YouTube)',
    url: 'https://www.youtube.com/playlist?list=PLMCXHnjXnTnvo6alSjVkgxV-VH6EPyvoX',
    category: 'system_design',
    subcategory: 'hld',
    type: 'Video Playlist',
    cost: 'Free',
    priority: 'Deep Dive',
    targetPhase: 'Months 2-5',
    description: 'Intuitive video explanations of Consistent Hashing, Bloom Filters, Distributed Caching, Message Queues, and Sharding.',
    whyItMatters: 'Helps build vivid mental models of how distributed components behave when nodes fail or scale up.',
    tags: ['Consistent Hashing', 'Bloom Filters', 'Caching', 'Videos']
  },
  {
    id: 'sd-ddia',
    stepNumber: 5,
    phaseNumber: 2,
    phaseLabel: 'Phase 2: Distributed Storage & Scale (Months 4–6)',
    timing: 'Months 4–6 • Distributed Systems Bible',
    orderAdvice: '5️⃣ READ DDIA CHAPTERS 5, 6, 7 & 9. Master replication, partitioning, and consensus.',
    prerequisite: 'Steps 01-04.',
    nextStep: 'Phase 3: Step 06 (Machine Coding & Refactoring Guru).',
    title: 'Designing Data-Intensive Applications (DDIA)',
    authorOrProvider: 'Martin Kleppmann (O’Reilly)',
    url: 'https://dataintensive.net/',
    category: 'system_design',
    subcategory: 'hld',
    type: 'Book',
    cost: 'Book / Free Excerpts',
    priority: 'Essential #1',
    targetPhase: 'Months 4-6 (Phase 2)',
    description: 'The Bible of distributed systems. Focus on key chapters: Chapter 5 (Replication), Chapter 6 (Partitioning), Chapter 7 (Transactions), and Chapter 9 (Consensus).',
    whyItMatters: 'Every Senior / SDE-2 interviewer asks about replication lag, split-brain, read-after-write consistency, and 2-phase commits.',
    tags: ['Replication', 'Partitioning', 'Transactions', 'Consensus']
  },
  {
    id: 'lld-refactoring-guru',
    stepNumber: 6,
    phaseNumber: 3,
    phaseLabel: 'Phase 3: Machine Coding (LLD) & Internals (Months 7–8)',
    timing: 'Month 7 • Object-Oriented Patterns',
    orderAdvice: '6️⃣ MASTER DESIGN PATTERNS IN PYTHON. SOLID principles, Strategy, Factory, Observer.',
    prerequisite: 'Python object-oriented fundamentals.',
    nextStep: 'Step 07: Use The Index Luke for database query tuning.',
    title: 'Design Patterns & SOLID Principles',
    authorOrProvider: 'Refactoring.Guru',
    url: 'https://refactoring.guru/design-patterns',
    category: 'system_design',
    subcategory: 'lld',
    type: 'Interactive Guide',
    cost: 'Free',
    priority: 'Essential #1',
    targetPhase: 'Months 6-8 (Phase 3)',
    description: 'Visual, intuitive explanations of Creational, Structural, and Behavioral design patterns with Python code examples and UML diagrams.',
    whyItMatters: 'Mandatory for Machine Coding rounds (Parking Lot, Elevator, Splitwise) at Flipkart, Swiggy, Uber, and CRED.',
    tags: ['Design Patterns', 'SOLID', 'Python', 'LLD']
  },
  {
    id: 'db-use-the-index-luke',
    stepNumber: 7,
    phaseNumber: 3,
    phaseLabel: 'Phase 3: Machine Coding (LLD) & Internals (Months 7–8)',
    timing: 'Months 7–8 • Database Performance',
    orderAdvice: '7️⃣ DEEP DIVE INTO INDEXES. Learn B-Trees, compound indexes, and query plans.',
    prerequisite: 'Basic SQL queries.',
    nextStep: 'Step 08: High Performance Browser Networking.',
    title: 'Use The Index, Luke! – SQL Indexing Explained',
    authorOrProvider: 'Markus Winand',
    url: 'https://use-the-index-luke.com/',
    category: 'system_design',
    subcategory: 'databases',
    type: 'Interactive Guide',
    cost: 'Free',
    priority: 'Essential #1',
    targetPhase: 'Months 5-7 (Phases 2 & 3)',
    description: 'A developer-focused guide to database indexing: B-Tree physical layout, compound index ordering, index-only scans, and execution plans.',
    whyItMatters: 'Interviewers will challenge you on database bottlenecks: "Why is this WHERE clause slow?", "How would you index this table?"',
    tags: ['SQL', 'Indexes', 'B-Tree', 'Performance', 'Postgres']
  },
  {
    id: 'net-hpbn',
    stepNumber: 8,
    phaseNumber: 3,
    phaseLabel: 'Phase 3: Machine Coding (LLD) & Internals (Months 7–8)',
    timing: 'Month 8 • Networking & Latency',
    orderAdvice: '8️⃣ NETWORK PROTOCOLS & LATENCY. Master TCP handshakes, TLS 1.3, and WebSockets.',
    prerequisite: 'Step 02 (System Primer).',
    nextStep: 'Step 09: CMU 15-445 storage engine internals.',
    title: 'High Performance Browser Networking (HPBN)',
    authorOrProvider: 'Ilya Grigorik (Google)',
    url: 'https://hpbn.co/',
    category: 'system_design',
    subcategory: 'core_cs',
    type: 'Book',
    cost: 'Free',
    priority: 'Core Practice',
    targetPhase: 'Months 6-8 (Phase 3)',
    description: 'Deep dive into networking performance: TCP handshakes, head-of-line blocking, TLS 1.3, HTTP/2 multiplexing, HTTP/3 QUIC, and WebSockets.',
    whyItMatters: 'Essential for designing real-time systems (Chat, Notification, Live Location Tracking).',
    tags: ['TCP/UDP', 'HTTP/2', 'WebSockets', 'Latency']
  },
  {
    id: 'db-cmu-15445',
    stepNumber: 9,
    phaseNumber: 3,
    phaseLabel: 'Phase 3: Machine Coding (LLD) & Internals (Months 7–8)',
    timing: 'Month 8 • Storage Internals',
    orderAdvice: '9️⃣ ADVANCED STORAGE ENGINES. Write-ahead logs (WAL), buffer pools, and MVCC.',
    prerequisite: 'Step 07 (Use The Index Luke).',
    nextStep: 'Phase 4: 45-minute timed mock interview loops.',
    title: 'CMU 15-445: Intro to Database Systems',
    authorOrProvider: 'Prof. Andy Pavlo (Carnegie Mellon)',
    url: 'https://15445.courses.cs.cmu.edu/',
    category: 'system_design',
    subcategory: 'databases',
    type: 'Video Playlist',
    cost: 'Free',
    priority: 'Deep Dive',
    targetPhase: 'Months 6-8 (Phase 3)',
    description: 'Legendary course on storage engines: buffer pool managers, B+ Trees, hash indexes, write-ahead logging (WAL), and concurrency control (MVCC, 2PL).',
    whyItMatters: 'Gives you deep architectural knowledge of how PostgreSQL and MySQL operate under heavy write loads.',
    tags: ['CMU', 'Storage Engines', 'WAL', 'Concurreny', 'MVCC']
  }
];

export const ROADMAP_LEARNING_TRACKS = {
  system_design: {
    title: 'System Design & Distributed Systems Roadmap',
    targetHours: 440,
    headline: 'From URL Shorteners to Multi-Region Distributed Consensus',
    milestones: [
      {
        monthRange: 'Months 1-3 (Phase 1)',
        target: 'HLD Foundations & Delivery Framework',
        hoursPerWeek: '9 hrs/week',
        goals: [
          'Master the 45-minute delivery framework from Hello Interview (requirements, capacity, API, schema, high-level, deep-dive)',
          'Learn basic components: DNS, Load Balancers (Layer 4 vs Layer 7), Reverse Proxy, Caching (Redis), Relational vs Document DBs',
          'Practice 1 system per week out loud (URL Shortener, Rate Limiter, Unique ID Snowflake, KV Store, Notification System)'
        ]
      },
      {
        monthRange: 'Months 4-6 (Phase 2)',
        target: 'Distributed Storage & Complex HLDs',
        hoursPerWeek: '11 hrs/week',
        goals: [
          'Read DDIA Chapters 5, 6, 7 (Replication, Partitioning, Transactions, Isolation Levels, Consensus)',
          'Design harder systems: Distributed Web Crawler, News Feed (Push vs Pull model), Chat System (WebSockets), Search Autocomplete (Tries)',
          'High-stakes architectures: Payment Systems (Idempotency keys, retries, reconciliation), File Sync (Dropbox chunking), Video Streaming'
        ]
      },
      {
        monthRange: 'Months 7-8 (Phase 3)',
        target: 'Machine Coding (LLD) & Database Internals',
        hoursPerWeek: '12 hrs/week',
        goals: [
          'Master SOLID principles and GoF Design Patterns (Strategy, Observer, Factory, Decorator) on Refactoring.Guru',
          'Implement 10+ timed 90-minute machine coding problems in Python with unit tests (Parking Lot, LRU Cache, Splitwise, Elevator, BookMyShow)',
          'Deep-dive into database internals (Use The Index Luke, B-Trees, execution plans, index scans)'
        ]
      },
      {
        monthRange: 'Months 9-10 (Phase 4)',
        target: 'Interview Loops & Spoken Mock Practice',
        hoursPerWeek: '8 hrs/week',
        goals: [
          'Conduct 8-10 peer or paid mock interviews under strict 45-minute timers',
          'Defend trade-offs out loud: Latency vs Throughput, Consistency vs Availability (CAP), SQL vs NoSQL, Polling vs WebSockets',
          'Map your weaknesses after every mock interview and log them in your revision queue'
        ]
      }
    ]
  },
  applied_ai: {
    title: 'Applied AI & Production Engineering Roadmap',
    targetHours: 297,
    headline: 'Build Retrieval That Actually Works and Agents You Can Trust',
    milestones: [
      {
        monthRange: 'Months 1-3 (Phase 1)',
        target: 'LLM Foundations & Project 1 v1 (RAG)',
        hoursPerWeek: '9 hrs/week',
        goals: [
          'Watch Karpathy’s 1-Hour Intro to LLMs and 3Blue1Brown’s Transformer series for intuitive vector & attention models',
          'Master Python async backend with FastAPI, Pydantic, and streaming Server-Sent Events (SSE)',
          'Build Project 1 v1: Document Q&A RAG using vector embeddings, chunking, and a React frontend with citations'
        ]
      },
      {
        monthRange: 'Months 4-6 (Phase 2)',
        target: 'Production RAG, Tool-Using Agents & Project 2',
        hoursPerWeek: '9 hrs/week',
        goals: [
          'Upgrade Project 1 to Production RAG: Hybrid search (BM25 lexical + dense vectors), Cross-Encoder reranking, and fixed eval sets',
          'Study Anthropic’s "Building Effective Agents" and Hugging Face Agents Course (ReAct loops, function calling, state machines)',
          'Build Project 2: Tool-Using CRM Assistant with synthetic CRM data, text-to-SQL AST guardrails, and human-in-the-loop approvals',
          'Implement LLM observability & tracing with Langfuse: latency, token cost, and failure case benchmarks'
        ]
      },
      {
        monthRange: 'Months 7-8 (Phase 3)',
        target: 'Evaluation Benchmarks & Architecture Polish',
        hoursPerWeek: '4 hrs/week',
        goals: [
          'Follow Hamel Husain’s evaluation guide: build 50-100 question test suites and calibrated LLM-as-a-Judge evaluators',
          'Record 2-minute video walkthrough demos and write architecture READMEs for LinkedIn and your resume',
          'Prepare for deep-dive interview questions: "How would you scale RAG to 10M documents?", "How do you detect prompt injection?"'
        ]
      },
      {
        monthRange: 'Months 9-10 (Phase 4)',
        target: 'Walkthrough Practice for Interview Loops',
        hoursPerWeek: '3 hrs/week',
        goals: [
          'Deliver 20-minute spoken project walkthroughs without notes: architecture, trade-offs, and what failed in production',
          'Demonstrate clear metrics on your resume: retrieval hit rate, answer quality score, P95 latency, and token cost per query',
          'Target AI-adjacent teams at Microsoft, Amazon, Razorpay, and top product startups'
        ]
      }
    ]
  }
};
