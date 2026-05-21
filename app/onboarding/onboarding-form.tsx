"use client";

import { useActionState } from "react";
import { saveOnboarding, type OnboardingState } from "./actions";

const useCases = [
  "Customer support",
  "Lead qualification",
  "Follow-ups",
  "Internal reporting",
  "Admin operations",
];

const tools = [
  "WhatsApp",
  "Gmail",
  "Slack",
  "Discord",
  "Telegram",
  "Google Sheets",
  "Notion",
  "CRM",
  "Stripe",
  "Zapier",
];

const autonomyLevels = [
  { value: "draft_only", label: "Draft only", description: "Agent prepares responses or actions for review." },
  { value: "approval_required", label: "Approval required", description: "Agent executes only after human confirmation." },
  { value: "automatic", label: "Automatic", description: "Agent executes approved routine workflows." },
];

const models = [
  { value: "auto", label: "Auto recommended" },
  { value: "gpt", label: "OpenAI GPT" },
  { value: "claude", label: "Claude" },
  { value: "gemini", label: "Gemini" },
  { value: "mistral", label: "Mistral" },
];

const initialState: OnboardingState = { error: null };

export function OnboardingForm() {
  const [state, formAction, isPending] = useActionState(saveOnboarding, initialState);

  return (
    <form action={formAction} className="grid gap-10">
      <section className="grid gap-4">
        <label className="text-sm font-mono uppercase tracking-widest text-muted-foreground" htmlFor="agentName">
          Agent name
        </label>
        <input
          id="agentName"
          name="agentName"
          defaultValue="Aegi Support Agent"
          className="h-14 border border-foreground/10 bg-foreground/[0.03] px-4 text-lg outline-none transition-colors focus:border-foreground/40"
          placeholder="Example: Aegi Support Agent"
          required
        />
      </section>

      <section className="grid gap-4">
        <p className="text-sm font-mono uppercase tracking-widest text-muted-foreground">Main workflow</p>
        <div className="grid gap-3 md:grid-cols-2">
          {useCases.map((useCase) => (
            <label key={useCase} className="flex cursor-pointer items-center gap-3 border border-foreground/10 bg-foreground/[0.02] p-4 transition-colors hover:border-foreground/30">
              <input type="radio" name="useCase" value={useCase} required className="accent-foreground" />
              <span>{useCase}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="grid gap-4">
        <p className="text-sm font-mono uppercase tracking-widest text-muted-foreground">Tools to connect</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <label key={tool} className="flex cursor-pointer items-center gap-3 border border-foreground/10 bg-foreground/[0.02] p-4 transition-colors hover:border-foreground/30">
              <input type="checkbox" name="tools" value={tool} className="accent-foreground" />
              <span>{tool}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="grid gap-4">
        <p className="text-sm font-mono uppercase tracking-widest text-muted-foreground">Autonomy level</p>
        <div className="grid gap-3 md:grid-cols-3">
          {autonomyLevels.map((level) => (
            <label key={level.value} className="cursor-pointer border border-foreground/10 bg-foreground/[0.02] p-5 transition-colors hover:border-foreground/30">
              <input type="radio" name="autonomyLevel" value={level.value} defaultChecked={level.value === "approval_required"} className="mb-4 accent-foreground" />
              <span className="block font-medium">{level.label}</span>
              <span className="mt-2 block text-sm text-muted-foreground">{level.description}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="grid gap-4">
        <p className="text-sm font-mono uppercase tracking-widest text-muted-foreground">Model preference</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {models.map((model) => (
            <label key={model.value} className="flex cursor-pointer items-center gap-3 border border-foreground/10 bg-foreground/[0.02] p-4 transition-colors hover:border-foreground/30">
              <input type="radio" name="modelPreference" value={model.value} defaultChecked={model.value === "auto"} className="accent-foreground" />
              <span>{model.label}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="grid gap-4">
        <label className="text-sm font-mono uppercase tracking-widest text-muted-foreground" htmlFor="notes">
          Extra context
        </label>
        <textarea
          id="notes"
          name="notes"
          className="min-h-32 resize-y border border-foreground/10 bg-foreground/[0.03] p-4 outline-none transition-colors focus:border-foreground/40"
          placeholder="What should this agent do first? What should it avoid?"
        />
      </section>

      {state.error && (
        <div className="border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
          {state.error}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="h-14 rounded-full bg-foreground px-8 text-background transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {isPending ? "Saving..." : "Create agent draft"}
      </button>
    </form>
  );
}
