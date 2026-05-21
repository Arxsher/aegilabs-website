"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export async function deleteAccountAction(): Promise<{ success: boolean; error?: string }> {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Not authenticated" };
  }

  const supabase = getSupabaseAdmin();

  if (supabase) {
    const { error: profileError } = await supabase
      .from("profiles")
      .delete()
      .eq("clerk_user_id", userId);

    if (profileError) {
      return { success: false, error: profileError.message };
    }
  }

  try {
    const client = await clerkClient();
    await client.users.deleteUser(userId);
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete user from Clerk",
    };
  }

  return { success: true };
}
