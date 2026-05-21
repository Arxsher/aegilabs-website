import Link from "next/link";
import { auth, currentUser } from "@clerk/nextjs/server";
import { isClerkConfigured } from "@/lib/env";
import { Check, Sparkles, Zap, Building2 } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    icon: Sparkles,
    description: "Try our default agent with no setup required.",
    features: [
      "Default AI agent access",
      "Basic chat interface",
      "10 messages per day",
      "Community support",
    ],
    limitations: [
      "No channel connections",
      "No customization",
      "No agent personalization",
    ],
    cta: "Current plan",
    ctaHref: "/dashboard",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$49",
    period: "/month",
    icon: Zap,
    description: "Build and customize your own AI agent for your workflow.",
    features: [
      "Custom agent configuration",
      "Connect to 5 channels (WhatsApp, Gmail, Slack, etc.)",
      "Unlimited messages",
      "Agent personalization via dashboard",
      "Priority email support",
      "Analytics & usage reports",
    ],
    limitations: [],
    cta: "Upgrade to Pro",
    ctaHref: "#",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    icon: Building2,
    description: "Full-service AI agent deployment tailored to your business.",
    features: [
      "Everything in Pro",
      "Dedicated account manager",
      "Unlimited channel connections",
      "Custom model training & fine-tuning",
      "SLA & uptime guarantee",
      "On-premise deployment option",
      "API access & webhooks",
      "White-label solution",
    ],
    limitations: [],
    cta: "Contact sales",
    ctaHref: "mailto:hello@aegilabs.com?subject=Enterprise inquiry",
    highlighted: false,
  },
];

function PlanCard({ plan }: { plan: (typeof plans)[0] }) {
  const Icon = plan.icon;

  return (
    <div
      className={`relative flex flex-col rounded-[1.25rem] border p-6 lg:p-8 backdrop-blur-xl ${
        plan.highlighted
          ? "border-white/20 bg-black/80 shadow-[0_0_60px_rgba(255,255,255,0.05)]"
          : "border-white/[0.06] bg-black/60"
      }`}
    >
      {plan.highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-white/20 bg-white/[0.08] px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur-xl">
          Most popular
        </div>
      )}

      <div className="mb-6">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06]">
          <Icon className="h-5 w-5 text-white/70" />
        </div>
        <h3 className="font-display text-xl tracking-tight text-white">{plan.name}</h3>
        <p className="mt-1 text-sm text-white/40">{plan.description}</p>
      </div>

      <div className="mb-6">
        <span className="font-display text-4xl tracking-tight text-white">{plan.price}</span>
        <span className="text-sm text-white/40">{plan.period}</span>
      </div>

      <div className="mb-6 space-y-3">
        {plan.features.map((feature) => (
          <div key={feature} className="flex items-start gap-3">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
            <span className="text-sm text-white/70">{feature}</span>
          </div>
        ))}
      </div>

      {plan.limitations.length > 0 && (
        <div className="mb-6 space-y-2 border-t border-white/[0.06] pt-4">
          {plan.limitations.map((limit) => (
            <div key={limit} className="flex items-start gap-3">
              <span className="mt-0.5 h-4 w-4 shrink-0 text-white/20">—</span>
              <span className="text-sm text-white/30">{limit}</span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-auto">
        {plan.highlighted ? (
          <Link
            href={plan.ctaHref}
            className="flex h-11 w-full items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-black transition hover:bg-white/90"
          >
            {plan.cta}
          </Link>
        ) : (
          <Link
            href={plan.ctaHref}
            className="flex h-11 w-full items-center justify-center rounded-full border border-white/15 px-6 text-sm font-semibold text-white/70 transition hover:border-white/30 hover:text-white"
          >
            {plan.cta}
          </Link>
        )}
      </div>
    </div>
  );
}

export default async function PricingPage() {
  if (!isClerkConfigured()) {
    return (
      <main className="min-h-screen bg-black px-6 py-24 text-white">
        <div className="mx-auto max-w-xl border border-white/10 bg-white/[0.02] p-8">
          <p className="mb-4 font-mono text-sm uppercase tracking-widest text-white/40">Auth setup needed</p>
          <h1 className="mb-4 font-display text-5xl tracking-tight">Add Clerk keys first.</h1>
          <Link href="/" className="text-sm underline underline-offset-4">Back to site</Link>
        </div>
      </main>
    );
  }

  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();

  const user = await currentUser();

  return (
    <div className="mx-auto max-w-5xl px-6 pb-20 pt-10">
      <div className="mb-12 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-white/40">Pricing</p>
        <h1 className="mt-2 font-display text-4xl tracking-tight text-white md:text-5xl">
          Choose your plan
        </h1>
        <p className="mt-3 text-sm text-white/40">
          Start free, upgrade when you&apos;re ready to scale.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <PlanCard key={plan.name} plan={plan} />
        ))}
      </div>

      <div className="mt-16 rounded-[1.25rem] border border-white/[0.06] bg-black/60 p-8 backdrop-blur-xl">
        <div className="flex flex-col items-center text-center md:flex-row md:items-start md:text-left md:gap-8">
          <div className="flex-1">
            <h3 className="font-display text-2xl tracking-tight text-white">Not sure which plan?</h3>
            <p className="mt-2 text-sm text-white/40">
              Book a free consultation with our team. We&apos;ll help you find the right setup for your business.
            </p>
          </div>
          <div className="mt-6 flex-shrink-0 md:mt-0">
            <a
              href="mailto:hello@aegilabs.com?subject=Plan consultation request"
              className="inline-flex h-11 items-center rounded-full border border-white/15 px-6 text-sm font-semibold text-white/70 transition hover:border-white/30 hover:text-white"
            >
              Talk to us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
