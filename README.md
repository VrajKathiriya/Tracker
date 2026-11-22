# SDE-First, Applied AI Engineer Roadmap Tracker (10-Month / 44-Week)

A high-performance personal tracker built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Supabase (PostgreSQL)**, designed specifically around the **10-Month Roadmap: SDE-First, Applied AI Engineer (Target: 30+ LPA)**.

---

## 🌟 Key Features

1. **⏱ Daily Block Study Timer & Stopwatch**
   * Configured for the **4 daily blocks** from your roadmap:
     * **Block 1 (Morning, ~3h):** DSA in Python.
     * **Block 2 (Midday, ~1.5h):** System Design & LLD (40-min timed sessions).
     * **Block 3 (Afternoon, ~1.5h):** Applied AI & Projects (later Core CS / Mocks).
     * **Block 4 (Evening, ~30m):** Mistakes Log & Flashcards.
   * Auto-logs completed sessions directly into your daily, weekly, and monthly tracking metrics.

2. **📊 Preparation Hours Dashboard**
   * **Daily Hours:** Today's completed hours vs the 6.5h weekday / 2.5h Sunday target.
   * **Weekly Split:** Track hours against the 40h/week goal, with category breakdowns for DSA, System Design, Applied AI, Core CS, and Revision.
   * **Monthly & Cumulative:** Track your progress toward the total 1,760 hours across 44 weeks.

3. **🔁 Spaced Repetition DSA Mistakes Queue (Roadmap Rule #2)**
   * Every logged problem automatically computes **Day +7** and **Day +30** review due dates.
   * Dedicated **"Due Today for Review"** banner alerts you when a problem is due for revisit.
   * Stores problem difficulty, clean solve status, time taken, and mistake/pattern intuitions.

4. **📐 System Design & LLD Practice Log**
   * Pre-populated with roadmap systems (URL shortener, rate limiter, chat, Splitwise, LRU cache, enterprise RAG platform).
   * Tracks whether the session was timed (under 40-45m) and recorded/spoken out loud.

5. **🚀 Applied AI Projects Hub**
   * Tracks deliverables for **Project 1 (Document Q&A RAG)**, **Project 2 (Tool-Using CRM Assistant)**, and **Project 3 (Production AI Service)**.
   * Checklists for eval sets, hit rate, P95 latency, cost/query, 2-minute demo video, and GitHub repo links.

6. **🛡 The 3 Decision Gates (Months 3, 6, 8)**
   * Interactive checklists for each critical gate (Month 3 Day 90, Month 6 Day 180, Month 8 Day 240).
   * Displays immediate contingency plans if any gate is missed.

7. **📅 The Sunday 3-Number Review Ritual (Roadmap Rule #1)**
   * Form to log the three essential metrics every Sunday:
     1. Problems solved this week
     2. Mocks conducted
     3. Outreach messages sent
   * Plus weekly reflection and target 40 hours check.

8. **💼 Job Applications & Referral CRM**
   * Tiered sequencing: Practice companies (Months 7-8), Strong Startups (Months 8-9), FAANG-tier (Months 9-10).
   * Rejection root-cause mapper (maps rejections to DSA, design, or resume weaknesses).

---

## 🚀 Getting Started

### 1. Run Locally

```bash
# Clone the repository
git clone https://github.com/VrajKathiriya/Tracker.git
cd Tracker

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Note:** The app features a resilient local storage fallback. You can test and use all features immediately even before connecting Supabase!

---

### 2. Connect Supabase Database

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard) and open your project.
2. Open the **SQL Editor** (`Dashboard > SQL Editor > New query`).
3. Copy the contents of [`supabase-schema.sql`](./supabase-schema.sql) and paste it into the editor, then click **Run**.
4. Retrieve your **Project URL** and **Anon API Key** from `Project Settings > API`.
5. Create a `.env.local` file in your project root:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://[YOUR_PROJECT_ID].supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR_ANON_KEY]
   ```
   *(Alternatively, click the **Supabase / Local Storage** pill in the app navbar to paste keys directly into the app settings modal).*

---

### 3. Deploy to Vercel

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Initial commit: 10-Month SDE & Applied AI Roadmap Tracker"
   git push -u origin main
   ```
2. Go to [Vercel](https://vercel.com) and click **Add New Project**.
3. Import your `Tracker` repository (`VrajKathiriya/Tracker`).
4. In the **Environment Variables** section, add:
   * `NEXT_PUBLIC_SUPABASE_URL` = your Supabase Project URL
   * `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your Supabase Anon API Key
5. Click **Deploy**. Your roadmap tracker is now live!
