"use client";

import { useState, useRef, useEffect } from "react";

type AgentConfig = {
  agent_name: string;
  use_case: string;
  tools: string[];
  model_preference: string;
  autonomy_level: string;
  notes: string | null;
};

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

let msgId = 0;
const nextId = () => `msg-${++msgId}`;

export function ChatSandbox({ agentConfig }: { agentConfig: AgentConfig | null }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: agentConfig
        ? `I am configured as **${agentConfig.agent_name}** (${agentConfig.use_case}). Connected to ${agentConfig.tools.join(", ")}. How can I help?`
        : "Send me a sample customer message, lead, or internal request. I will respond like your configured AegiLabs agent.",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;

    setInput("");
    setError(null);

    const userMsg: Message = { id: nextId(), role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          agentConfig,
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || `HTTP ${res.status}`);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      const assistantId = nextId();
      let content = "";

      setMessages((prev) => [...prev, { id: assistantId, role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        content += decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content } : m))
        );
      }
    } catch (err: any) {
      if (err.name === "AbortError") return;
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
      abortRef.current = null;
    }
  };

  return (
    <div className="grid min-h-[620px] grid-rows-[1fr_auto] border border-foreground/10 bg-foreground/[0.02]">
      <div className="space-y-5 overflow-y-auto p-6">
        {error && (
          <div className="rounded border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
            Error: {error}
          </div>
        )}
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[78%] border p-4 ${message.role === "user" ? "border-foreground bg-foreground text-background" : "border-foreground/10 bg-background text-foreground"}`}>
              <p className="mb-2 font-mono text-[10px] uppercase tracking-widest opacity-60">
                {message.role === "user" ? "You" : "AegiLabs agent"}
              </p>
              <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex justify-start">
            <div className="max-w-[78%] border border-foreground/10 bg-background p-4 text-foreground">
              <p className="mb-2 font-mono text-[10px] uppercase tracking-widest opacity-60">AegiLabs agent</p>
              <p className="leading-relaxed text-muted-foreground">Thinking...</p>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-3 border-t border-foreground/10 p-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="h-12 flex-1 border border-foreground/10 bg-background px-4 outline-none transition-colors focus:border-foreground/40"
          placeholder="Test a customer message or workflow request..."
        />
        <button
          className="rounded-full bg-foreground px-6 text-sm text-background hover:opacity-90 disabled:opacity-50"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}
