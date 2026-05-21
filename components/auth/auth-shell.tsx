import Link from "next/link";
import type { ReactNode } from "react";

type AuthMode = "sign-in" | "sign-up";

type AuthShellProps = {
  children: ReactNode;
  mode: AuthMode;
};

const heroVideoUrl = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bg-hero-0BnFGdr81Ifnj3WbBZoNt1KE4D5DMT.mp4";

export const clerkAuthAppearance = {
  layout: {
    socialButtonsPlacement: "top" as const,
    socialButtonsVariant: "blockButton" as const,
  },
  variables: {
    colorBackground: "transparent",
    colorText: "#f7f7f7",
    colorTextSecondary: "rgba(255,255,255,0.62)",
    colorInputBackground: "rgba(255,255,255,0.10)",
    colorInputText: "#ffffff",
    colorPrimary: "#ffffff",
    borderRadius: "1rem",
    fontFamily: "var(--font-instrument), Instrument Sans, system-ui, sans-serif",
  },
  elements: {
    rootBox: "w-full",
    cardBox: "w-full shadow-none bg-transparent",
    card: "w-full bg-transparent p-0 shadow-none border-0",
    header: "hidden",
    main: "gap-4",
    socialButtons: "grid grid-cols-1 gap-3 sm:grid-cols-2",
    socialButtonsBlockButton:
      "h-11 rounded-xl border border-white/12 bg-white/[0.04] text-white shadow-none transition hover:border-white/25 hover:bg-white/[0.09] hover:text-white",
    socialButtonsBlockButtonText: "text-sm font-semibold text-white",
    dividerRow: "my-4",
    dividerLine: "bg-white/12",
    dividerText: "px-4 text-xs text-white/50",
    form: "gap-4",
    formFieldRow: "gap-3",
    formFieldLabel: "mb-2 text-xs font-semibold text-white",
    formFieldInput:
      "h-12 rounded-xl border border-white/0 bg-white/[0.11] px-4 text-sm text-white shadow-none outline-none transition placeholder:text-white/34 focus:border-white/25 focus:bg-white/[0.13] focus:ring-2 focus:ring-white/10",
    formFieldInputShowPasswordButton: "text-white/50 hover:text-white",
    formFieldErrorText: "mt-2 text-xs text-red-300",
    formButtonPrimary:
      "mt-2 h-12 rounded-xl bg-white text-sm font-bold text-black shadow-none transition hover:bg-white/90 focus:ring-2 focus:ring-white/30",
    footer: "mt-6 bg-transparent p-0",
    footerAction: "justify-center text-sm text-white/48",
    footerActionText: "text-white/48",
    footerActionLink: "font-bold text-white hover:text-white/80",
    identityPreview: "rounded-xl border border-white/10 bg-white/[0.08] text-white",
    identityPreviewText: "text-white",
    identityPreviewEditButton: "text-white/70 hover:text-white",
    alert: "rounded-xl border border-red-400/20 bg-red-400/10 text-red-100",
    alertText: "text-red-100",
    formResendCodeLink: "text-white hover:text-white/80",
    otpCodeFieldInput: "border-white/15 bg-white/[0.11] text-white",
    alternativeMethodsBlockButton:
      "rounded-xl border border-white/10 bg-white/[0.07] text-white hover:bg-white/[0.11]",
  },
};

export function AuthShell({ children, mode }: AuthShellProps) {
  const authTitle = mode === "sign-up" ? "Sign Up Account" : "Sign In Account";
  const authDescription =
    mode === "sign-up"
      ? "Enter your details to create your workspace."
      : "Enter your details to access your workspace.";
  const panelTitle = mode === "sign-up" ? "Launch Your Agent" : "Access Your Agent Workspace";
  const panelDescription =
    mode === "sign-up"
      ? "Complete these easy steps to deploy your first AI agent."
      : "Sign in to manage agents, test workflows, and review your setup.";
  const steps =
    mode === "sign-up"
      ? ["Sign up your account", "Set up your workspace", "Configure your agent"]
      : ["Verify your account", "Load your workspace", "Open your dashboard"];

  return (
    <main className="auth-shell relative grid h-screen overflow-hidden bg-black px-5 py-7 text-white sm:px-8 lg:px-12">
      <video
        className="absolute inset-0 h-full w-full scale-105 object-cover object-[72%_50%] blur-[8px] saturate-125"
        muted
        playsInline
        preload="none"
        aria-hidden="true"
      >
        <source src={heroVideoUrl} type="video/mp4" />
      </video>

      <div className="relative z-10 flex min-h-0 items-center justify-center">
        <section className="grid h-full max-h-[760px] w-full max-w-[1180px] overflow-hidden rounded-[1.25rem] border border-white/[0.08] bg-black/92 shadow-[0_34px_110px_rgba(0,0,0,0.62)] ring-1 ring-white/[0.04] lg:grid-cols-[1.12fr_0.88fr]">
          <aside className="relative hidden min-h-0 overflow-hidden lg:block">
            <video
              className="absolute inset-0 h-full w-full scale-[1.04] object-cover object-[72%_50%] opacity-95 blur-[1.5px] saturate-125"
              muted
              playsInline
              preload="none"
              aria-hidden="true"
            >
              <source src={heroVideoUrl} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_20%,rgba(255,255,255,0.62),transparent_17%),linear-gradient(180deg,rgba(160,70,255,0.08),rgba(0,0,0,0.84)_78%)]" />
            <div className="absolute inset-0 bg-black/18" />
            <div className="noise-overlay absolute inset-0 opacity-70" />

            <div className="relative z-10 flex h-full flex-col items-center justify-end px-12 pb-20 text-center">
              <Link href="/" className="mb-5 flex items-center transition-opacity hover:opacity-80" aria-label="AegiLabs home">
                <img src="/aegilabs-logo-no-border.png" alt="AegiLabs" className="h-7 w-auto max-w-[140px] object-contain" />
              </Link>
              <h1 className="font-display text-5xl leading-none tracking-tight text-white">{panelTitle}</h1>
              <p className="mt-4 max-w-sm text-balance text-base leading-6 text-white/68">{panelDescription}</p>

              <div className="mt-10 grid w-full max-w-[470px] grid-cols-3 gap-3 text-left">
                {steps.map((step, index) => (
                  <div
                    key={step}
                    className={`flex min-h-[116px] flex-col justify-between rounded-2xl p-5 shadow-[0_18px_52px_rgba(0,0,0,0.24)] backdrop-blur-xl transition ${
                      index === 0
                        ? "bg-white text-black"
                        : "border border-white/[0.06] bg-white/[0.10] text-white/58 hover:bg-white/[0.14]"
                    }`}
                  >
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${
                        index === 0
                          ? "bg-black text-white"
                          : "bg-white/[0.12] text-white/58 ring-1 ring-white/[0.08]"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <p className={`max-w-[100px] text-sm font-semibold leading-5 ${index === 0 ? "text-black" : "text-white/62"}`}>{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <section className="flex min-h-0 items-center justify-center bg-black px-6 py-8 sm:px-10 lg:px-16">
            <div className="w-full max-w-[390px]">
              <div className="mb-7 text-center">
                <Link href="/" className="mx-auto mb-5 flex w-fit items-center transition-opacity hover:opacity-80 lg:hidden" aria-label="AegiLabs home">
                  <img src="/aegilabs-logo-no-border.png" alt="AegiLabs" className="h-7 w-auto max-w-[140px] object-contain" />
                </Link>
                <h2 className="text-2xl font-bold tracking-tight text-white">{authTitle}</h2>
                <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-white/58">{authDescription}</p>
              </div>
              {children}
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}

export function MissingClerkKeys() {
  return (
    <main className="min-h-screen bg-background px-6 py-24 text-foreground">
      <div className="mx-auto max-w-xl border border-foreground/10 bg-foreground/[0.02] p-8">
        <p className="mb-4 font-mono text-sm uppercase tracking-widest text-muted-foreground">Auth setup needed</p>
        <h1 className="mb-4 font-display text-5xl tracking-tight">Add Clerk keys first.</h1>
        <p className="mb-8 text-muted-foreground">
          Create a Clerk project, then add the environment variables from `.env.example` to `.env.local`.
        </p>
        <Link href="/" className="text-sm underline underline-offset-4">
          Back to site
        </Link>
      </div>
    </main>
  );
}
