# Flowmate — AI Workplace Productivity Assistant

Flowmate is a modern, AI-powered workspace that helps professionals automate repetitive daily tasks and reclaim hours of productive time. It provides a clean, unified dashboard to draft emails, summarize meetings, plan your schedule, research topics, and chat with an intelligent assistant — all powered by real-time streaming AI.

---

## Features

| Tool | What it does |
|------|-------------|
| **Email Generator** | Turn a brief description into a polished, ready-to-send email. Choose tone (formal, persuasive, friendly, apologetic) and audience (manager, client, team, executive, vendor). |
| **Meeting Summarizer** | Paste raw meeting notes or transcripts and get a structured summary with key points, decisions, action items, and deadlines. |
| **Task Planner** | Drop in your task list and receive a prioritized schedule with focus blocks and productivity tips. Plan by day or week. |
| **Research Assistant** | Enter any topic or paste an article to get a TL;DR, key insights, a simplified explanation, and actionable recommendations. |
| **Interactive Chat** | Ask the assistant anything in natural language — drafting, planning, summarizing, or general workplace questions. |

### UX Highlights
- **Real-time streaming** — AI responses appear word-by-word via Server-Sent Events (SSE)
- **Copy & Regenerate** — One-click copy to clipboard and instant regeneration
- **Responsive design** — Fully functional on desktop, tablet, and mobile
- **Responsible AI** — Every output carries a disclaimer and encourages human review

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui |
| AI Backend | Lovable AI Gateway (Gemini 3 Flash) via Supabase Edge Functions |
| Database / Auth | Lovable Cloud (managed backend) |
| Streaming | Custom SSE parser (`src/lib/aiStream.ts`) |
| Testing | Vitest, @testing-library/react |

---

## Usage Guide


---

### 1. Email Generator
1. Describe what the email is about
2. Select tone and audience
3. Click **Generate Email**
4. Review, copy, or regenerate

### 2. Meeting Summarizer
1. Paste raw notes or a transcript
2. Click **Summarize Meeting**
3. Get a structured Markdown summary with action items and deadlines

### 3. Task Planner
1. List your tasks (one per line)
2. Choose "Today" or "This week"
3. Click **Build My Plan**
4. Receive a prioritized table with focus blocks and tips

### 4. Research Assistant
1. Enter a topic or paste content
2. Click **Research & Summarize**
3. Get TL;DR, key insights, simplified explanation, and next steps

### 5. Chat Assistant
1. Type any question or request
2. Press Enter or click the send button
3. Get a conversational, Markdown-aware response

---



