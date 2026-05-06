import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles } from "lucide-react";
import { OutputPanel } from "./OutputPanel";
import { streamAI } from "@/lib/aiStream";
import { toast } from "sonner";

export const MeetingSummarizer = () => {
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (notes.trim().length < 30) { toast.error("Paste a longer set of notes"); return; }
    setOutput(""); setLoading(true);
    await streamAI({
      feature: "summary", input: notes,
      onDelta: (c) => setOutput(p => p + c),
      onDone: () => setLoading(false),
      onError: (m) => { setLoading(false); toast.error(m); },
    });
  };

  return (
    <div className="grid lg:grid-cols-2 gap-5">
      <div className="rounded-2xl border bg-card shadow-card p-5 space-y-4">
        <div>
          <Label>Paste your meeting notes or transcript</Label>
          <Textarea
            className="mt-2 min-h-[300px]"
            placeholder="Paste raw notes, bullet points, or a transcript here…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <Button onClick={generate} disabled={loading} className="w-full bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95 transition-smooth">
          <Sparkles className="h-4 w-4 mr-2" /> {loading ? "Summarizing…" : "Summarize Meeting"}
        </Button>
      </div>
      <OutputPanel content={output} loading={loading} onRegenerate={generate} emptyHint="A clean summary with action items will appear here." />
    </div>
  );
};