"use client";

import { useSignUp } from "@clerk/nextjs/legacy";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { GithubIcon, GoogleIcon, getClerkErrorMessage } from "./auth-icons";

export function CustomSignUpForm() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startOAuth = async (strategy: "oauth_google" | "oauth_github") => {
    if (!isLoaded) return;
    setError(null);
    try {
      await signUp.authenticateWithRedirect({
        strategy,
        redirectUrl: `${window.location.origin}/sso-callback`,
        redirectUrlComplete: `${window.location.origin}/onboarding`,
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
      const result = await signUp.create({ firstName, lastName, emailAddress, password });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        window.location.assign("/onboarding");
        return;
      }

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (error) {
      setError(getClerkErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerify = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isLoaded) return;

    setSubmitting(true);
    setError(null);

    try {
      const result = await signUp.attemptEmailAddressVerification({ code });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        window.location.assign("/onboarding");
        return;
      }
      setError("Verification is not complete yet. Try the code again.");
    } catch (error) {
      setError(getClerkErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  if (pendingVerification) {
    return (
      <form onSubmit={handleVerify} className="space-y-5">
        <div>
          <label className="mb-2 block text-xs font-semibold text-white">Verification code</label>
          <input value={code} onChange={(event) => setCode(event.target.value)} className="h-12 w-full rounded-xl border border-white/12 bg-white/[0.10] px-4 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-white/28 focus:bg-white/[0.13] focus:ring-2 focus:ring-white/10" placeholder="Enter the code sent to your email" required />
        </div>
        {error && <p className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-100">{error}</p>}
        <button className="h-12 w-full rounded-xl bg-white text-sm font-bold text-black transition hover:bg-white/90" disabled={submitting}>{submitting ? "Verifying..." : "Verify email"}</button>
      </form>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        <button type="button" onClick={() => startOAuth("oauth_google")} className="flex h-11 items-center justify-center gap-2 rounded-xl border border-white/16 bg-white/[0.045] text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/[0.10]"><GoogleIcon /> Google</button>
        <button type="button" onClick={() => startOAuth("oauth_github")} className="flex h-11 items-center justify-center gap-2 rounded-xl border border-white/16 bg-white/[0.045] text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/[0.10]"><GithubIcon /> Github</button>
      </div>

      <div className="my-5 flex items-center gap-4"><span className="h-px flex-1 bg-white/12" /><span className="text-xs text-white/50">Or</span><span className="h-px flex-1 bg-white/12" /></div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div><label className="mb-2 block text-xs font-semibold text-white">First Name</label><input value={firstName} onChange={(event) => setFirstName(event.target.value)} className="h-12 w-full rounded-xl border border-white/12 bg-white/[0.10] px-4 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-white/28 focus:bg-white/[0.13] focus:ring-2 focus:ring-white/10" placeholder="eg. John" required /></div>
          <div><label className="mb-2 block text-xs font-semibold text-white">Last Name</label><input value={lastName} onChange={(event) => setLastName(event.target.value)} className="h-12 w-full rounded-xl border border-white/12 bg-white/[0.10] px-4 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-white/28 focus:bg-white/[0.13] focus:ring-2 focus:ring-white/10" placeholder="eg. Francisco" required /></div>
        </div>
        <div><label className="mb-2 block text-xs font-semibold text-white">Email</label><input type="email" value={emailAddress} onChange={(event) => setEmailAddress(event.target.value)} className="h-12 w-full rounded-xl border border-white/12 bg-white/[0.10] px-4 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-white/28 focus:bg-white/[0.13] focus:ring-2 focus:ring-white/10" placeholder="eg. johnfrans@gmail.com" required /></div>
        <div><label className="mb-2 block text-xs font-semibold text-white">Password</label><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="h-12 w-full rounded-xl border border-white/12 bg-white/[0.10] px-4 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-white/28 focus:bg-white/[0.13] focus:ring-2 focus:ring-white/10" placeholder="Enter your password" minLength={8} required /><p className="mt-2 text-xs text-white/48">Must be at least 8 characters.</p></div>
        {error && <p className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-100">{error}</p>}
        <button className="h-12 w-full rounded-xl bg-white text-sm font-bold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60" disabled={submitting || !isLoaded}>{submitting ? "Creating account..." : "Sign Up"}</button>
      </form>

      <p className="mt-6 text-center text-sm text-white/48">Already have an account? <Link href="/sign-in" className="font-bold text-white hover:text-white/80">Log in</Link></p>
    </div>
  );
}
