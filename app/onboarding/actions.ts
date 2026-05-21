"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { isClerkConfigured } from "@/lib/env";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export type UserInfo = {
  firstName: string | null;
};

export type OnboardingState = {
  error: string | null;
};

export type OnboardingData = {
  agentName: string;
  useCase: string;
  tools: string[];
  autonomyLevel: string;
  modelPreference: string;
  notes: string;
};

export async function saveOnboarding(
  _previousState: OnboardingState,
  formData: FormData
): Promise<OnboardingState> {
  if (!isClerkConfigured()) {
    return { error: "Clerk is not configured yet. Add your Clerk environment variables first." };
  }

  const { userId, redirectToSignIn } = await auth();
  if (!userId) {
    return redirectToSignIn();
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return { error: "Supabase is not configured yet. Add your Supabase environment variables first." };
  }

  const agentName = String(formData.get("agentName") || "").trim();
  const useCase = String(formData.get("useCase") || "").trim();
  const autonomyLevel = String(formData.get("autonomyLevel") || "approval_required").trim();
  const modelPreference = String(formData.get("modelPreference") || "auto").trim();
  const notes = String(formData.get("notes") || "").trim();
  const tools = formData.getAll("tools").map((tool) => String(tool));

  if (!agentName || !useCase || tools.length === 0) {
    return { error: "Choose an agent name, a use case, and at least one tool." };
  }

  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress ?? null;
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || null;
  const now = new Date().toISOString();

  const { data: existingProfile, error: profileLookupError } = await supabase
    .from("profiles")
    .select("id")
    .eq("clerk_user_id", userId)
    .maybeSingle();

  if (profileLookupError) {
    return { error: profileLookupError.message };
  }

  const profilePayload = {
    clerk_user_id: userId,
    email,
    full_name: fullName,
    updated_at: now,
  };

  const profileResult = existingProfile
    ? await supabase.from("profiles").update(profilePayload).eq("id", existingProfile.id)
    : await supabase.from("profiles").insert({ ...profilePayload, created_at: now });

  if (profileResult.error) {
    return { error: profileResult.error.message };
  }

  const agentPayload = {
    clerk_user_id: userId,
    agent_name: agentName,
    use_case: useCase,
    tools,
    model_preference: modelPreference,
    autonomy_level: autonomyLevel,
    status: "pending_review",
    notes: notes || null,
    updated_at: now,
  };

  const { data: existingAgent, error: agentLookupError } = await supabase
    .from("agent_configs")
    .select("id")
    .eq("clerk_user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (agentLookupError) {
    return { error: agentLookupError.message };
  }

  const agentResult = existingAgent
    ? await supabase.from("agent_configs").update(agentPayload).eq("id", existingAgent.id)
    : await supabase.from("agent_configs").insert({ ...agentPayload, created_at: now });

  if (agentResult.error) {
    return { error: agentResult.error.message };
  }

  redirect("/dashboard");
}

export async function submitOnboardingData(
  data: OnboardingData
): Promise<{ error?: string }> {
  if (!isClerkConfigured()) {
    return { error: "Clerk is not configured yet." };
  }

  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return { error: "Supabase is not configured yet." };
  }

  if (!data.agentName || !data.useCase || data.tools.length === 0) {
    return { error: "Choose an agent name, a use case, and at least one tool." };
  }

  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress ?? null;
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || null;
  const now = new Date().toISOString();

  const { data: existingProfile, error: profileLookupError } = await supabase
    .from("profiles")
    .select("id")
    .eq("clerk_user_id", userId)
    .maybeSingle();

  if (profileLookupError) {
    return { error: profileLookupError.message };
  }

  const profilePayload = {
    clerk_user_id: userId,
    email,
    full_name: fullName,
    updated_at: now,
  };

  const profileResult = existingProfile
    ? await supabase.from("profiles").update(profilePayload).eq("id", existingProfile.id)
    : await supabase.from("profiles").insert({ ...profilePayload, created_at: now });

  if (profileResult.error) {
    return { error: profileResult.error.message };
  }

  const agentPayload = {
    clerk_user_id: userId,
    agent_name: data.agentName,
    use_case: data.useCase,
    tools: data.tools,
    model_preference: data.modelPreference,
    autonomy_level: data.autonomyLevel,
    status: "pending_review",
    notes: data.notes || null,
    updated_at: now,
  };

  const { data: existingAgent, error: agentLookupError } = await supabase
    .from("agent_configs")
    .select("id")
    .eq("clerk_user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (agentLookupError) {
    return { error: agentLookupError.message };
  }

  const agentResult = existingAgent
    ? await supabase.from("agent_configs").update(agentPayload).eq("id", existingAgent.id)
    : await supabase.from("agent_configs").insert({ ...agentPayload, created_at: now });

  if (agentResult.error) {
    return { error: agentResult.error.message };
  }

  return {};
}

export async function getUserInfo(): Promise<UserInfo | null> {
  const { userId } = await auth();
  if (!userId) return null;
  const user = await currentUser();
  return { firstName: user?.firstName ?? null };
}
