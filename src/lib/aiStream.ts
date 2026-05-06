const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-assistant`;

export type ChatMsg = { role: "user" | "assistant"; content: string };

export interface StreamArgs {
  feature: "email" | "summary" | "planner" | "research" | "chat";
  input?: string;
  messages?: ChatMsg[];
  onDelta: (chunk: string) => void;
  onDone?: () => void;
  onError?: (msg: string) => void;
  signal?: AbortSignal;
}

export async function streamAI({ feature, input, messages, onDelta, onDone, onError, signal }: StreamArgs) {
  try {
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ feature, input, messages }),
      signal,
    });

    if (!resp.ok || !resp.body) {
      let msg = "Something went wrong. Please try again.";
      if (resp.status === 429) msg = "Rate limit reached. Please wait a moment and try again.";
      else if (resp.status === 402) msg = "AI credits exhausted. Add funds in workspace settings.";
      try { const j = await resp.json(); if (j?.error) msg = j.error; } catch {}
      onError?.(msg);
      return;
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let done = false;

    while (!done) {
      const { done: d, value } = await reader.read();
      if (d) break;
      buffer += decoder.decode(value, { stream: true });
      let nl: number;
      while ((nl = buffer.indexOf("\n")) !== -1) {
        let line = buffer.slice(0, nl);
        buffer = buffer.slice(nl + 1);
        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (!line || line.startsWith(":")) continue;
        if (!line.startsWith("data: ")) continue;
        const data = line.slice(6).trim();
        if (data === "[DONE]") { done = true; break; }
        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) onDelta(content);
        } catch {
          buffer = line + "\n" + buffer;
          break;
        }
      }
    }
    onDone?.();
  } catch (e: any) {
    if (e?.name !== "AbortError") onError?.(e?.message ?? "Network error");
  }
}