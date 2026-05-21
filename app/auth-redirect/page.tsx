import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

export default async function AuthRedirectPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  let hasAgent = false;
  if (url && key) {
    const supabase = createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { data } = await supabase
      .from("agent_configs")
      .select("id")
      .eq("clerk_user_id", userId)
      .maybeSingle();
    hasAgent = !!data;
  }

  redirect(hasAgent ? "/dashboard" : "/onboarding");
}
