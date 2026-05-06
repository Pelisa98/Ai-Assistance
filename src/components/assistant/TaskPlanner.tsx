import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles } from "lucide-react";
import { OutputPanel } from "./OutputPanel";
import { streamAI } from "@/lib/aiStream";
import { toast } from "sonner";

export const TaskPlanner = () => {
  const [tasks, setTasks] = useState("");
  const [horizon, setHorizon] = useState("day");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!tasks.trim()) { toast.error("List your tasks first"); return; }
    setOutput(""); setLoading(true);
    await streamAI({
      feature: "planner",
      input: `Horizon: ${horizon === "day" ? "Today" : "This week"}\n\nTasks:\n${tasks}`,
      onDelta: (c) => setOutput(p => p + c),
      onDone: () => setLoading(false),
      onError: (m) => { setLoading(false); toast.error(m); },
    });
  };

  return (
    <div className="grid lg:grid-cols-2 gap-5">
      <div className="rounded-2xl border bg-card shadow-card p-5 space-y-4">
        <div>
          <Label>List your tasks (one per line)</Label>
          <Textarea
            className="mt-2 min-h-[220px]"
            placeholder={"Prepare Q3 report\nReview design mockups (due Friday)\nCall vendor about contract\n1:1 with Sarah at 3pm\nReply to investor email"}
            value={tasks}
            onChange={(e) => setTasks(e.target.value)}
          />
        </div>
        <div>
          <Label>Plan for</Label>
          <Select value={horizon} onValueChange={setHorizon}>
            <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Today</SelectItem>
              <SelectItem value="week">This week</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={generate} disabled={loading} className="w-full bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95 transition-smooth">
          <Sparkles className="h-4 w-4 mr-2" /> {loading ? "Planning…" : "Build My Plan"}
        </Button>
      </div>
      <OutputPanel content={output} loading={loading} onRegenerate={generate} emptyHint="A prioritized schedule with focus blocks will appear here." />
    </div>
  );
};