"use client";

import { useSignIn } from "@clerk/nextjs/legacy";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { GithubIcon, GoogleIcon, getClerkErrorMessage } from "./auth-icons";

export function CustomSignInForm() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startOAuth = async (strategy: "oauth_google" | "oauth_github") => {
    if (!isLoaded) return;
    setError(null);
    try {
      await signIn.authenticateWithRedirect({
        strategy,
        redirectUrl: `${window.location.origin}/sso-callback`,
        redirectUrlComplete: `${window.location.origin}/dashboard`,
      });
    } catch (error) {
      setError(getClerkErrorMessage(error));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isLoaded) return;

    setSubmitting(true);
    setError(null);

    try {
      const result = await signIn.create({ identifier, password });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        window.location.assign("/dashboard");
        return;
      }
      setError("Sign in needs another verification step. Try using Google/GitHub or Clerk account settings.");
    } catch (error) {
      setError(getClerkErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        <button type="button" onClick={() => startOAuth("oauth_google")} className="flex h-11 items-center justify-center gap-2 rounded-xl border border-white/16 bg-white/[0.045] text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/[0.10]"><GoogleIcon /> Google</button>
        <button type="button" onClick={() => startOAuth("oauth_github")} className="flex h-11 items-center justify-center gap-2 rounded-xl border border-white/16 bg-white/[0.045] text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/[0.10]"><GithubIcon /> Github</button>
      </div>

      <div className="my-5 flex items-center gap-4"><span className="h-px flex-1 bg-white/12" /><span className="text-xs text-white/50">Or</span><span className="h-px flex-1 bg-white/12" /></div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div><label className="mb-2 block text-xs font-semibold text-white">Email</label><input type="email" value={identifier} onChange={(event) => setIdentifier(event.target.value)} className="h-12 w-full rounded-xl border border-white/12 bg-white/[0.10] px-4 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-white/28 focus:bg-white/[0.13] focus:ring-2 focus:ring-white/10" placeholder="eg. johnfrans@gmail.com" required /></div>
        <div><label className="mb-2 block text-xs font-semibold text-white">Password</label><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="h-12 w-full rounded-xl border border-white/12 bg-white/[0.10] px-4 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-white/28 focus:bg-white/[0.13] focus:ring-2 focus:ring-white/10" placeholder="Enter your password" required /></div>
        {error && <p className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-100">{error}</p>}
        <button className="h-12 w-full rounded-xl bg-white text-sm font-bold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60" disabled={submitting || !isLoaded}>{submitting ? "Signing in..." : "Sign In"}</button>
      </form>

      <p className="mt-6 text-center text-sm text-white/48">Don&apos;t have an account? <Link href="/sign-up" className="font-bold text-white hover:text-white/80">Sign up</Link></p>
    </div>
  );
}
