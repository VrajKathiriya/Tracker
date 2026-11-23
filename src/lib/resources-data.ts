export type ResourceCategory = 'system_design' | 'applied_ai';

export type SystemDesignSubcategory = 'hld' | 'lld' | 'databases' | 'core_cs';
export type AppliedAISubcategory = 'llm_foundations' | 'rag' | 'agents' | 'evals';

export interface StudyResource {
  id: string;
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

export const SYSTEM_DESIGN_RESOURCES: StudyResource[] = [
  {
    id: 'sd-hello-interview',
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
    id: 'sd-ddia',
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
    id: 'sd-alex-xu',
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
    id: 'sd-primer',
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
    id: 'sd-gaurav-sen',
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
    id: 'lld-refactoring-guru',
    title: 'Design Patterns & SOLID Principles',
    authorOrProvider: 'Refactoring.Guru',
    url: 'https://refactoring.guru/design-patterns',
    category: 'system_design',
    subcategory: 'lld',
    type: 'Interactive Guide',
    cost: 'Free',
    priority: 'Essential #1',
    targetPhase: 'Months 6-7 (Phase 2 & 3)',
    description: 'Interactive visual guide to Factory, Strategy, Observer, Decorator, Adapter, and Singleton patterns with clean Python code and class diagrams.',
    whyItMatters: 'Machine coding rounds at Razorpay, Swiggy, and CRED require writing running OOP code following SOLID principles in 90 minutes.',
    tags: ['Design Patterns', 'SOLID', 'OOP', 'Python']
  },
  {
    id: 'lld-hello-interview',
    title: 'Hello Interview: Low-Level Design (LLD)',
    authorOrProvider: 'Hello Interview',
    url: 'https://www.hellointerview.com/learn/low-level-design',
    category: 'system_design',
    subcategory: 'lld',
    type: 'Interactive Guide',
    cost: 'Free',
    priority: 'Core Practice',
    targetPhase: 'Months 6-7 (Phase 2 & 3)',
    description: 'Real-world machine coding problems: Parking Lot, LRU Cache with pluggable eviction, Splitwise, and Elevator Control System.',
    whyItMatters: 'Teaches you how to translate vague requirements into entities, interfaces, state management, and running unit tests.',
    tags: ['Machine Coding', 'Parking Lot', 'LRU Cache', 'Splitwise']
  },
  {
    id: 'db-index-luke',
    title: 'Use The Index, Luke!',
    authorOrProvider: 'Markus Winand',
    url: 'https://use-the-index-luke.com/',
    category: 'system_design',
    subcategory: 'databases',
    type: 'Interactive Guide',
    cost: 'Free',
    priority: 'Core Practice',
    targetPhase: 'Months 7-8 (Phase 3)',
    description: 'A developer-first guide to database performance and B-Tree indexing. Covers index clustering, execution plans, and multi-column index ordering.',
    whyItMatters: 'Top interviewers always ask: "Why is this query slow?", "What index would you create?", and "How does the database scan it?".',
    tags: ['PostgreSQL', 'B-Tree', 'Indexes', 'Query Tuning']
  },
  {
    id: 'db-cmu-15445',
    title: 'CMU 15-445/645: Database Systems',
    authorOrProvider: 'Andy Pavlo (Carnegie Mellon)',
    url: 'https://15445.courses.cs.cmu.edu/',
    category: 'system_design',
    subcategory: 'databases',
    type: 'Interactive Guide',
    cost: 'Free',
    priority: 'Deep Dive',
    targetPhase: 'Months 7-8 (Phase 3)',
    description: 'World-renowned university lectures on database internals: storage managers, buffer pools, hash tables, B+ trees, and Write-Ahead Logging (WAL).',
    whyItMatters: 'Gives you unbeatable depth when discussing database trade-offs at Microsoft and Amazon interview loops.',
    tags: ['Database Internals', 'Storage Engines', 'WAL', 'Lectures']
  },
  {
    id: 'net-hpbn',
    title: 'High Performance Browser Networking',
    authorOrProvider: 'Ilya Grigorik (Google)',
    url: 'https://hpbn.co/',
    category: 'system_design',
    subcategory: 'core_cs',
    type: 'Interactive Guide',
    cost: 'Free',
    priority: 'Core Practice',
    targetPhase: 'Months 7-8 (Phase 3)',
    description: 'What every software engineer must know about TCP 3-way handshakes, TLS overhead, HTTP/2 multiplexing, HTTP/3 QUIC, and WebSockets.',
    whyItMatters: 'Essential for designing real-time systems (Chat, Notification, Live Location Tracking).',
    tags: ['TCP/UDP', 'HTTP/2', 'WebSockets', 'Latency']
  }
];

export const APPLIED_AI_RESOURCES: StudyResource[] = [
  {
    id: 'ai-karpathy-intro',
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
    tags: ['Foundations', 'Pretraining', 'RLHF', 'Karpathy']
  },
  {
    id: 'ai-3blue1brown-transformers',
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
    whyItMatters: 'Allows you to answer "How does self-attention work?" and "What is an embedding vector?" with crystal-clear intuition.',
    tags: ['Attention', 'Embeddings', 'Transformers', 'Math Intuition']
  },
  {
    id: 'ai-chip-huyen-book',
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
    tags: ['AI Engineering', 'Production RAG', 'Chunking', 'Hybrid Search']
  },
  {
    id: 'ai-deeplearning-rag',
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
    whyItMatters: 'Direct blueprint for your Project 1 (Document Q&A RAG), allowing you to prove retrieval hit rate and latency numbers.',
    tags: ['Advanced RAG', 'Rerankers', 'Project 1', 'LlamaIndex']
  },
  {
    id: 'ai-anthropic-agents',
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
    tags: ['Agents', 'Anthropic', 'Workflow Patterns', 'Project 2']
  },
  {
    id: 'ai-hf-agents-course',
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
    tags: ['ReAct Loop', 'Tool Calling', 'Hugging Face', 'State']
  },
  {
    id: 'ai-mcp-protocol',
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
    tags: ['MCP', 'JSON-RPC', 'Tool Standard', 'Anthropic']
  },
  {
    id: 'ai-hamel-evals',
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
    tags: ['Evaluations', 'LLM-as-a-Judge', 'Benchmarks', 'Quality']
  },
  {
    id: 'ai-langfuse-tracing',
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
    tags: ['Observability', 'Tracing', 'Token Cost', 'OpenTelemetry']
  },
  {
    id: 'ai-fastapi-backend',
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
    whyItMatters: 'Python is the lingua franca of AI backends. Fluency in FastAPI, Pydantic, and async execution is required for all AI engineering roles.',
    tags: ['FastAPI', 'Pydantic', 'Async', 'Streaming SSE']
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
