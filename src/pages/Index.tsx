import { useState } from "react";
import { Mail, FileText, ListChecks, Search, MessageSquare, Sparkles, Clock, TrendingUp, ShieldCheck } from "lucide-react";
import { EmailGenerator } from "@/components/assistant/EmailGenerator";
import { MeetingSummarizer } from "@/components/assistant/MeetingSummarizer";
import { TaskPlanner } from "@/components/assistant/TaskPlanner";
import { ResearchAssistant } from "@/components/assistant/ResearchAssistant";
import { ChatBot } from "@/components/assistant/ChatBot";

const TABS = [
  { id: "email", label: "Email", icon: Mail, desc: "Smart email generator" },
  { id: "summary", label: "Summarize", icon: FileText, desc: "Meeting notes → action items" },
  { id: "planner", label: "Planner", icon: ListChecks, desc: "AI-prioritized schedule" },
  { id: "research", label: "Research", icon: Search, desc: "Topic insights & TL;DR" },
  { id: "chat", label: "Assistant", icon: MessageSquare, desc: "Ask anything" },
] as const;

type TabId = typeof TABS[number]["id"];

const Index = () => {
  const [tab, setTab] = useState<TabId>("email");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/60 backdrop-blur-xl sticky top-0 z-40">
        <div className="container max-w-7xl flex items-center justify-between h-16">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-primary shadow-glow flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="leading-tight">
              <div className="font-semibold tracking-tight">Flowmate</div>
              <div className="text-[11px] text-muted-foreground">AI Productivity Assistant</div>
            </div>
          </div>
          <a href="#workspace" className="hidden sm:inline-flex text-sm px-4 py-2 rounded-full bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95 transition-smooth">
            Open Workspace
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-80 pointer-events-none" />
        <div className="container max-w-7xl relative py-16 md:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full bg-accent text-accent-foreground mb-5">
              <Sparkles className="h-3.5 w-3.5" /> Powered by Lovable AI
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]">
              Your workday,{" "}
              <span className="text-gradient">on autopilot.</span>
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-2xl">
              Draft emails, summarize meetings, plan your day, and research topics — all from one
              clean dashboard. Save hours every week and focus on the work that matters.
            </p>
            <div className="mt-8 grid sm:grid-cols-3 gap-3 max-w-2xl">
              <ValueChip icon={Clock} label="Save 5+ hrs / week" />
              <ValueChip icon={TrendingUp} label="Better communication" />
              <ValueChip icon={ShieldCheck} label="You stay in control" />
            </div>
          </div>
        </div>
      </section>

      {/* Workspace */}
      <section id="workspace" className="container max-w-7xl pb-24">
        {/* Tab cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`text-left rounded-2xl border p-4 transition-smooth ${
                  active
                    ? "bg-gradient-primary text-primary-foreground border-transparent shadow-glow"
                    : "bg-card hover:border-primary/40 hover:-translate-y-0.5 shadow-card"
                }`}
              >
                <Icon className={`h-5 w-5 mb-3 ${active ? "" : "text-primary"}`} />
                <div className="font-semibold text-sm">{t.label}</div>
                <div className={`text-[11px] mt-0.5 ${active ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                  {t.desc}
                </div>
              </button>
            );
          })}
        </div>

        <div className="animate-in fade-in-50 duration-300">
          {tab === "email" && <EmailGenerator />}
          {tab === "summary" && <MeetingSummarizer />}
          {tab === "planner" && <TaskPlanner />}
          {tab === "research" && <ResearchAssistant />}
          {tab === "chat" && <ChatBot />}
        </div>
      </section>

      <footer className="border-t py-8">
        <div className="container max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} Flowmate — AI Workplace Assistant</div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5" />
            Always review AI outputs before sending or sharing.
          </div>
        </div>
      </footer>
    </div>
  );
};

const ValueChip = ({ icon: Icon, label }: { icon: any; label: string }) => (
  <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-card/70 backdrop-blur border shadow-card">
    <Icon className="h-4 w-4 text-primary" />
    <span className="text-sm font-medium">{label}</span>
  </div>
);

export default Index;
