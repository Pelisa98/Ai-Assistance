import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPTS: Record<string, string> = {
  email: `You are an expert business communication assistant. Generate a polished, ready-to-send email based on the user's brief. Always return ONLY the email itself with a clear "Subject:" line on top, then a blank line, then the body. Use the requested tone and audience. Be concise, structured, and professional.`,
  summary: `You are an expert meeting notes summarizer. From the raw notes, produce a clean Markdown summary with these sections in order:\n## Summary\n(2-3 sentence overview)\n## Key Points\n- bullets\n## Decisions\n- bullets\n## Action Items\n- [ ] Owner — Task — Deadline (if mentioned)\n## Deadlines\n- bullets\nIf a section has no content, write "_None mentioned_".`,
  planner: `You are an elite productivity coach. Build a realistic, prioritized schedule from the user's tasks. Return Markdown with:\n## Prioritized Plan\nA table | Time | Task | Priority (Urgent/Important/Low) | Notes |\n## Focus Blocks\nSuggested deep-work blocks.\n## Productivity Tips\n3 concise, actionable tips tailored to the workload.`,
  research: `You are a research analyst. From the topic or text provided, deliver Markdown with:\n## TL;DR\n(3 sentences max)\n## Key Insights\n- bullets with concrete facts\n## Simplified Explanation\nPlain-language paragraph anyone can understand.\n## Recommendations / Next Steps\n- bullets`,
  chat: `You are a friendly, highly capable workplace productivity assistant. Help with emails, planning, summaries, research, and general work questions. Be concise, structured, and use Markdown when helpful.`,
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { feature, messages, input } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const system = SYSTEM_PROMPTS[feature] ?? SYSTEM_PROMPTS.chat;
    const chatMessages = messages && Array.isArray(messages)
      ? [{ role: "system", content: system }, ...messages]
      : [
          { role: "system", content: system },
          { role: "user", content: input ?? "" },
        ];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: chatMessages,
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit reached. Please try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Add funds in Lovable workspace settings." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});