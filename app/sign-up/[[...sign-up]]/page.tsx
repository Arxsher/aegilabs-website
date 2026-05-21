import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AuthShell, MissingClerkKeys } from "@/components/auth/auth-shell";
import { CustomSignUpForm } from "@/components/auth/custom-sign-up-form";
import { isClerkConfigured } from "@/lib/env";

export default async function SignUpPage() {
  if (!isClerkConfigured()) {
    return <MissingClerkKeys />;
  }

  const { userId } = await auth();
  if (userId) {
    redirect("/auth-redirect");
  }

  return (
    <AuthShell mode="sign-up">
      <CustomSignUpForm />
    </AuthShell>
  );
}
