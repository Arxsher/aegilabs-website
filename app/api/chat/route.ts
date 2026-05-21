import { groq } from "@ai-sdk/groq";
import { streamText } from "ai";

type AgentConfig = {
  agent_name: string;
  use_case: string;
  tools: string[];
  model_preference: string;
  autonomy_level: string;
  notes: string | null;
};

function buildSystemPrompt(config: AgentConfig | null): string {
  if (!config) {
    return "You are a helpful AI workflow assistant. Help the user with their tasks, answer questions, and suggest automations.";
  }

  const autonomyDescriptions: Record<string, string> = {
    draft_only: "Draft only — prepare actions for the user to review before execution.",
    approval_required: "Approval required — execute only after the user confirms.",
    automatic: "Automatic — run approved routine workflows without waiting.",
  };

  return [
    `You are ${config.agent_name}, an AI agent built on the AegiLabs platform.`,
    ``,
    `## Your Role`,
    `Your primary use case is: ${config.use_case}.`,
    `Your autonomy level is: ${autonomyDescriptions[config.autonomy_level] || config.autonomy_level}.`,
    ``,
    `## Connected Tools`,
    `You have access to the following platforms: ${config.tools.join(", ")}.`,
    `When you reference using a tool, describe the action you would take on that platform.`,
    ``,
    config.notes ? `## Extra Context\n${config.notes}\n` : "",
    `## Behavior`,
    `- Stay in character as ${config.agent_name} at all times.`,
    `- When the user sends a request, explain how you would handle it given your use case and tools.`,
    `- If the request is outside your configured scope, politely redirect or suggest the right agent.`,
    `- Be concise, precise, and action-oriented.`,
  ]
    .filter(Boolean)
    .join("\n");
}

function normalizeMessages(messages: unknown[]) {
  return (messages as any[]).map((msg) => {
    if (msg.parts && !msg.content) {
      const text = (msg.parts as any[])
        .filter((p: any) => p.type === "text")
        .map((p: any) => p.text)
        .join("");
      return { ...msg, content: text };
    }
    return msg;
  });
}

export async function POST(req: Request) {
  const { messages, agentConfig } = await req.json();

  const result = streamText({
    model: groq("llama-3.3-70b-versatile"),
    system: buildSystemPrompt(agentConfig as AgentConfig | null),
    messages: normalizeMessages(messages),
  });

  return result.toTextStreamResponse();
}
