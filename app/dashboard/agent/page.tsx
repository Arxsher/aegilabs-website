import { auth } from "@clerk/nextjs/server";
import { isClerkConfigured } from "@/lib/env";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { ChatSandbox } from "./chat-sandbox";
import Link from "next/link";

type AgentConfig = {
  agent_name: string;
  use_case: string;
  tools: string[];
  model_preference: string;
  autonomy_level: string;
  notes: string | null;
};

export default async function AgentSandboxPage() {
  if (!isClerkConfigured()) {
    return (
      <main className="min-h-screen bg-background px-6 py-24 text-foreground">
        <div className="mx-auto max-w-xl border border-foreground/10 bg-foreground/[0.02] p-8">
          <p className="mb-4 font-mono text-sm uppercase tracking-widest text-muted-foreground">Auth setup needed</p>
          <h1 className="mb-4 font-display text-5xl tracking-tight">Add Clerk keys first.</h1>
          <p className="mb-8 text-muted-foreground">The sandbox is protected and needs Clerk environment variables.</p>
          <Link href="/" className="text-sm underline underline-offset-4">Back to site</Link>
        </div>
      </main>
    );
  }

  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();

  const supabase = getSupabaseAdmin();
  let agentConfig: AgentConfig | null = null;

  if (supabase) {
    const { data } = await supabase
      .from("agent_configs")
      .select("agent_name,use_case,tools,model_preference,autonomy_level,notes")
      .eq("clerk_user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    agentConfig = data as AgentConfig | null;
  }

  return (
    <div className="mx-auto max-w-[1100px] px-6 pb-20 pt-10 lg:px-10">
      <div className="mb-10">
        <p className="font-mono text-xs uppercase tracking-widest text-white/40">Agent sandbox</p>
        <h1 className="mt-2 font-display text-5xl tracking-tight md:text-6xl">
          Chat with{agentConfig ? ` ${agentConfig.agent_name}` : " your agent"}.
        </h1>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/40">
          Your agent knows its use case, tools, and autonomy level. Try sending a real-world request.
        </p>
      </div>
      <ChatSandbox agentConfig={agentConfig} />
    </div>
  );
}
