import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { streamAI, ChatMsg } from "@/lib/aiStream";
import { toast } from "sonner";

export const ChatBot = () => {
  const [messages, setMessages] = useState<ChatMsg[]>([
    { role: "assistant", content: "Hi! I'm your workplace assistant. Ask me anything — draft an email, summarize a meeting, plan your day, or get quick answers." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const next: ChatMsg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput(""); setLoading(true);

    let acc = "";
    setMessages(prev => [...prev, { role: "assistant", content: "" }]);
    await streamAI({
      feature: "chat", messages: next,
      onDelta: (c) => {
        acc += c;
        setMessages(prev => prev.map((m, i) => i === prev.length - 1 ? { ...m, content: acc } : m));
      },
      onDone: () => setLoading(false),
      onError: (m) => { setLoading(false); toast.error(m); setMessages(prev => prev.slice(0, -1)); },
    });
  };

  return (
    <div className="rounded-2xl border bg-card shadow-card flex flex-col h-[600px]">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${m.role === "user" ? "bg-secondary" : "bg-gradient-primary text-primary-foreground"}`}>
              {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
              {m.content ? (
                <div className="prose prose-sm max-w-none dark:prose-invert prose-p:my-1 prose-pre:my-2">
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
              ) : (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t p-3 flex gap-2">
        <Input
          placeholder="Ask anything…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          disabled={loading}
        />
        <Button onClick={send} disabled={loading || !input.trim()} className="bg-gradient-primary text-primary-foreground shadow-glow">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};