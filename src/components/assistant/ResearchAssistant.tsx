import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles } from "lucide-react";
import { OutputPanel } from "./OutputPanel";
import { streamAI } from "@/lib/aiStream";
import { toast } from "sonner";

export const ResearchAssistant = () => {
  const [topic, setTopic] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!topic.trim()) { toast.error("Enter a topic or paste content"); return; }
    setOutput(""); setLoading(true);
    await streamAI({
      feature: "research", input: topic,
      onDelta: (c) => setOutput(p => p + c),
      onDone: () => setLoading(false),
      onError: (m) => { setLoading(false); toast.error(m); },
    });
  };

  return (
    <div className="grid lg:grid-cols-2 gap-5">
      <div className="rounded-2xl border bg-card shadow-card p-5 space-y-4">
        <div>
          <Label>Topic, article, or report</Label>
          <Textarea
            className="mt-2 min-h-[280px]"
            placeholder="e.g. 'The impact of AI on remote work productivity in 2025' — or paste an article to summarize."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>
        <Button onClick={generate} disabled={loading} className="w-full bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95 transition-smooth">
          <Sparkles className="h-4 w-4 mr-2" /> {loading ? "Researching…" : "Research & Summarize"}
        </Button>
      </div>
      <OutputPanel content={output} loading={loading} onRegenerate={generate} emptyHint="Key insights and recommendations will appear here." />
    </div>
  );
};