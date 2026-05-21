import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AuthShell, MissingClerkKeys } from "@/components/auth/auth-shell";
import { CustomSignInForm } from "@/components/auth/custom-sign-in-form";
import { isClerkConfigured } from "@/lib/env";

export default async function SignInPage() {
  if (!isClerkConfigured()) {
    return <MissingClerkKeys />;
  }

  const { userId } = await auth();
  if (userId) {
    redirect("/auth-redirect");
  }

  return (
    <AuthShell mode="sign-in">
      <CustomSignInForm />
    </AuthShell>
  );
}
