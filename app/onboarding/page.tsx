import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { isClerkConfigured } from "@/lib/env";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";
import Link from "next/link";

export default async function OnboardingPage() {
  if (!isClerkConfigured()) {
    return (
      <main className="min-h-screen bg-background px-6 py-24 text-foreground">
        <div className="mx-auto max-w-xl border border-foreground/10 bg-foreground/[0.02] p-8">
          <p className="mb-4 font-mono text-sm uppercase tracking-widest text-muted-foreground">Auth setup needed</p>
          <h1 className="mb-4 font-display text-5xl tracking-tight">Add Clerk keys first.</h1>
          <p className="mb-8 text-muted-foreground">Onboarding is protected and needs Clerk environment variables.</p>
          <Link href="/" className="text-sm underline underline-offset-4">Back to site</Link>
        </div>
      </main>
    );
  }

  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();

  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data: existingAgent } = await supabase
      .from("agent_configs")
      .select("id")
      .eq("clerk_user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existingAgent) {
      redirect("/dashboard");
    }
  }

  return <OnboardingWizard />;
}
