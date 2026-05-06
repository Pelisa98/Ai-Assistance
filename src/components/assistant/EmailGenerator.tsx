import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles } from "lucide-react";
import { OutputPanel } from "./OutputPanel";
import { streamAI } from "@/lib/aiStream";
import { toast } from "sonner";

export const EmailGenerator = () => {
  const [brief, setBrief] = useState("");
  const [tone, setTone] = useState("formal");
  const [audience, setAudience] = useState("client");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!brief.trim()) { toast.error("Please describe what the email is about"); return; }
    setOutput(""); setLoading(true);
    const prompt = `Audience: ${audience}\nTone: ${tone}\n\nBrief: ${brief}`;
    await streamAI({
      feature: "email", input: prompt,
      onDelta: (c) => setOutput(p => p + c),
      onDone: () => setLoading(false),
      onError: (m) => { setLoading(false); toast.error(m); },
    });
  };

  return (
    <div className="grid lg:grid-cols-2 gap-5">
      <div className="rounded-2xl border bg-card shadow-card p-5 space-y-4">
        <div>
          <Label>What's this email about?</Label>
          <Textarea
            className="mt-2 min-h-[180px]"
            placeholder="e.g. Follow up with a client about the Q3 proposal we sent last week, ask for feedback and offer a 30-min call."
            value={brief}
            onChange={(e) => setBrief(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Tone</Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="formal">Formal</SelectItem>
                <SelectItem value="informal">Informal</SelectItem>
                <SelectItem value="persuasive">Persuasive</SelectItem>
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="apologetic">Apologetic</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Audience</Label>
            <Select value={audience} onValueChange={setAudience}>
              <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="client">Client</SelectItem>
                <SelectItem value="team">Team</SelectItem>
                <SelectItem value="executive">Executive</SelectItem>
                <SelectItem value="vendor">Vendor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={generate} disabled={loading} className="w-full bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95 transition-smooth">
          <Sparkles className="h-4 w-4 mr-2" /> {loading ? "Generating…" : "Generate Email"}
        </Button>
      </div>
      <OutputPanel content={output} loading={loading} onRegenerate={generate} emptyHint="Your polished email will appear here." />
    </div>
  );
};