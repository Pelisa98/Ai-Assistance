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

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                     Frontend                         │
│  ┌─────────┐ ┌──────────┐ ┌────────┐ ┌──────────┐  │
│  │  Email  │ │ Meeting  │ │ Planner│ │ Research │  │
│  │Generator│ │Summarizer│ │        │ │Assistant │  │
│  └────┬────┘ └────┬─────┘ └───┬────┘ └────┬─────┘  │
│       └─────────────┴─────────┴───────────┘         │
│                    aiStream.ts                       │
│                       │                              │
│              POST /functions/v1/ai-assistant         │
└───────────────────────┬─────────────────────────────┘
                        │ SSE stream
┌───────────────────────┴─────────────────────────────┐
│              Supabase Edge Function                  │
│           (supabase/functions/ai-assistant)          │
│              Routes to Lovable AI Gateway            │
└─────────────────────────────────────────────────────┘
```

### Key Design Decisions

- **Edge Function Router** — A single Supabase Edge Function (`ai-assistant`) handles all AI requests. It injects feature-specific system prompts and proxies to the AI gateway with streaming enabled.
- **Streaming Layer** — `src/lib/aiStream.ts` handles the raw SSE stream, parses delta chunks, and calls per-chunk callbacks so the UI updates in real time.
- **Feature Prompts** — Each tool uses a tailored system prompt (email, summary, planner, research, chat) to guide the model toward consistent, high-quality output formats.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ and [Bun](https://bun.sh/) or npm
- A Lovable Cloud project (or a connected Supabase project with Edge Functions enabled)

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/flowmate.git
cd flowmate

# Install dependencies
bun install

# Configure environment variables
cp .env .env.local
# Edit .env.local with your Lovable Cloud credentials
```

### Environment Variables

Create a `.env.local` file with:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

### Running Locally

```bash
# Start the Vite dev server
bun run dev

# Run tests
bun run test

# Preview production build
bun run build && bun run preview
```

### Deploying the Edge Function

If using Lovable Cloud, edge functions deploy automatically. For manual deployment:

```bash
supabase functions deploy ai-assistant
```

Make sure `LOVABLE_API_KEY` is set in your function secrets:

```bash
supabase secrets set LOVABLE_API_KEY=your_key
```

---

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── assistant/
│   │   │   ├── ChatBot.tsx            # Interactive chat interface
│   │   │   ├── EmailGenerator.tsx     # Email drafting tool
│   │   │   ├── MeetingSummarizer.tsx  # Meeting notes summarizer
│   │   │   ├── OutputPanel.tsx        # Shared output renderer (Markdown, copy, regenerate)
│   │   │   ├── ResearchAssistant.tsx  # Research & TL;DR tool
│   │   │   └── TaskPlanner.tsx        # Task prioritization & scheduling
│   │   └── ui/                        # shadcn/ui components (Button, Input, Select, etc.)
│   ├── lib/
│   │   ├── aiStream.ts                # SSE streaming client for AI responses
│   │   └── utils.ts                   # Tailwind / utility helpers
│   ├── pages/
│   │   ├── Index.tsx                  # Main dashboard (hero + tabbed workspace)
│   │   └── NotFound.tsx               # 404 page
│   ├── App.tsx                        # Root router
│   ├── main.tsx                       # Entry point
│   └── index.css                      # Global styles + custom design tokens
├── supabase/
│   └── functions/
│       └── ai-assistant/
│           └── index.ts               # Edge function: prompt routing + AI gateway proxy
├── public/                            # Static assets
├── package.json
├── tailwind.config.ts                 # Tailwind + custom theme tokens
├── tsconfig.json
└── vite.config.ts
```

---

## Usage Guide

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

## Customization

### Adding a New Tool

1. **Create a system prompt** in `supabase/functions/ai-assistant/index.ts` under `SYSTEM_PROMPTS`
2. **Build the UI component** in `src/components/assistant/` using `streamAI()` and `<OutputPanel />`
3. **Register the tab** in `src/pages/Index.tsx` by adding to the `TABS` array and the conditional render block

### Styling

Design tokens are defined in `src/index.css` and `tailwind.config.ts`. The app uses:
- `--primary` — Indigo/violet gradient system
- `--background` — Dark slate background
- Custom utilities like `bg-gradient-primary`, `shadow-glow`, and `shadow-card`

---

## Responsible AI

- All AI outputs include a visible disclaimer: outputs may contain inaccuracies
- Users are encouraged to review and edit before sending or acting on generated content
- The system does not retain conversation history server-side beyond the current request
- No personal data is used to train models

---

## Contributing

Contributions are welcome. Please open an issue or pull request for bugs, features, or improvements.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is open source under the [MIT License](LICENSE).

---

## Acknowledgements

- Built with [Lovable](https://lovable.dev) — the AI app builder
- UI components by [shadcn/ui](https://ui.shadcn.com)
- AI powered by Google's Gemini models via Lovable AI Gateway
