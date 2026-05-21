import Link from "next/link";
import { auth, currentUser } from "@clerk/nextjs/server";
import { isClerkConfigured } from "@/lib/env";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { Plus, ChevronDown, ArrowUp, ArrowRight } from "lucide-react";

type AgentConfig = {
  agent_name: string;
  use_case: string;
  tools: string[] | null;
  model_preference: string;
  autonomy_level: string;
  status: string;
  notes: string | null;
};

function formatValue(value?: string | null) {
  if (!value) return "Not set";
  return value.replaceAll("_", " ");
}

const categoryPills = [
  { label: "Support", icon: "💬" },
  { label: "Sales", icon: "🎯" },
  { label: "Reports", icon: "📊" },
  { label: "Automation", icon: "⚡" },
  { label: "Agent's choice", icon: "🤖" },
];

export default async function DashboardPage() {
  if (!isClerkConfigured()) {
    return (
      <main className="min-h-screen bg-black px-6 py-24 text-white">
        <div className="mx-auto max-w-xl border border-white/10 bg-white/[0.02] p-8">
          <p className="mb-4 font-mono text-sm uppercase tracking-widest text-white/40">Auth setup needed</p>
          <h1 className="mb-4 font-display text-5xl tracking-tight">Add Clerk keys first.</h1>
          <p className="mb-8 text-white/60">The dashboard is protected and needs Clerk environment variables.</p>
          <Link href="/" className="text-sm underline underline-offset-4">Back to site</Link>
        </div>
      </main>
    );
  }

  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();

  const user = await currentUser();
  const supabase = getSupabaseAdmin();
  let agentConfig: AgentConfig | null = null;
  let databaseError: string | null = null;

  if (supabase) {
    const { data, error } = await supabase
      .from("agent_configs")
      .select("agent_name,use_case,tools,model_preference,autonomy_level,status,notes")
      .eq("clerk_user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) databaseError = error.message;
    else agentConfig = data as AgentConfig | null;
  }

  const firstName = user?.firstName ?? "there";

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-3xl">
        <div className="mb-10 text-center">
          <h1 className="font-display text-4xl tracking-tight text-white/90">
            What should we automate today, {firstName}?
          </h1>
        </div>

        {databaseError && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-black/80 px-5 py-4 text-sm text-red-200/80">
            Database error: {databaseError}
          </div>
        )}

        {!supabase && (
          <div className="mb-6 rounded-2xl border border-yellow-500/20 bg-black/80 px-5 py-4 text-sm text-yellow-200/80">
            Supabase is not configured. Add your Supabase environment variables.
          </div>
        )}

        {!agentConfig ? (
          <div className="rounded-[1.25rem] border border-white/[0.08] bg-black/80 p-12 text-center backdrop-blur-xl">
            <h2 className="font-display text-xl text-white">No agent configured yet</h2>
            <p className="mt-2 text-sm text-white/40">Start the onboarding to create your first personalized AI agent.</p>
            <Link href="/onboarding" className="mt-6 inline-flex h-11 items-center rounded-full bg-white px-6 text-sm font-semibold text-black transition hover:bg-white/90">
              Start onboarding
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <Link
              href="/dashboard/agent"
              className="block rounded-[1.25rem] border border-white/[0.08] bg-black/80 p-5 backdrop-blur-xl transition hover:border-white/[0.15] hover:bg-black/90 group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">Agent chat</span>
                <ArrowRight className="h-4 w-4 text-white/30 transition group-hover:text-white/70 group-hover:translate-x-0.5" />
              </div>
              <p className="text-lg text-white/70 group-hover:text-white/90 transition">
                How can I help you today?
              </p>
              <div className="mt-4 flex items-center gap-2">
                <span className="inline-flex items-center rounded-full border border-white/[0.06] bg-white/[0.04] px-3 py-1 text-xs text-white/50">
                  {formatValue(agentConfig.model_preference)}
                </span>
                <span className="text-xs text-white/30">{agentConfig.tools?.length ?? 0} tools connected</span>
              </div>
            </Link>

            <div className="flex flex-wrap items-center justify-center gap-2">
              {categoryPills.map((pill) => (
                <button
                  key={pill.label}
                  className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-black/60 px-4 py-2 text-sm text-white/60 backdrop-blur-xl transition hover:border-white/15 hover:bg-black/80 hover:text-white/80"
                >
                  <span className="text-base">{pill.icon}</span>
                  {pill.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
