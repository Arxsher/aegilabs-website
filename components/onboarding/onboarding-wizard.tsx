"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { submitOnboardingData, getUserInfo } from "@/app/onboarding/actions";
import { WelcomeTransition } from "./welcome-transition";
import {
  Bot,
  Headphones,
  Users,
  Repeat,
  BarChart3,
  Settings,
  MessageCircle,
  Mail,
  MessageSquare,
  Headset,
  Send,
  Table,
  FileText,
  CreditCard,
  Zap,
  UserCheck,
  FileEdit,
  CheckCircle,
  Sparkles,
  Brain,
  Gem,
  Wind,
  ChevronRight,
  ChevronLeft,
  type LucideIcon,
} from "lucide-react";

type Step = {
  id: string;
  title: string;
  icon: LucideIcon;
};

const steps: Step[] = [
  { id: "agentName", title: "Agent name", icon: Bot },
  { id: "useCase", title: "Workflow", icon: Headphones },
  { id: "tools", title: "Tools", icon: Zap },
  { id: "autonomy", title: "Autonomy", icon: UserCheck },
  { id: "model", title: "Model", icon: Sparkles },
  { id: "notes", title: "Notes", icon: FileText },
];

const useCases = [
  { value: "Customer support", label: "Customer Support", desc: "Handle tickets, FAQs, and escalations", icon: Headset },
  { value: "Lead qualification", label: "Lead Qualification", desc: "Score, qualify, and route new leads", icon: Users },
  { value: "Follow-ups", label: "Follow-ups", desc: "Automate email and message follow-ups", icon: Repeat },
  { value: "Internal reporting", label: "Internal Reporting", desc: "Generate summaries, metrics, and dashboards", icon: BarChart3 },
  { value: "Admin operations", label: "Admin Operations", desc: "Manage schedules, approvals, and tasks", icon: Settings },
];

const toolItems = [
  { value: "WhatsApp", icon: MessageCircle },
  { value: "Gmail", icon: Mail },
  { value: "Slack", icon: MessageSquare },
  { value: "Discord", icon: Headset },
  { value: "Telegram", icon: Send },
  { value: "Google Sheets", icon: Table },
  { value: "Notion", icon: FileText },
  { value: "CRM", icon: Users },
  { value: "Stripe", icon: CreditCard },
  { value: "Zapier", icon: Zap },
];

const autonomyLevels = [
  { value: "draft_only", label: "Draft only", desc: "Agent prepares actions for your review", icon: FileEdit },
  { value: "approval_required", label: "Approval required", desc: "Agent executes after you confirm", icon: CheckCircle },
  { value: "automatic", label: "Automatic", desc: "Agent runs approved routine workflows", icon: Zap },
];

const modelItems = [
  { value: "auto", label: "Auto recommended", desc: "Best model for your use case", icon: Sparkles },
  { value: "gpt", label: "OpenAI GPT", desc: "Powerful general-purpose AI", icon: Brain },
  { value: "claude", label: "Claude", desc: "Safe & thoughtful reasoning", icon: Gem },
  { value: "gemini", label: "Gemini", desc: "Google multimodal AI", icon: Brain },
  { value: "mistral", label: "Mistral", desc: "Fast open-source model", icon: Wind },
];

const heroVideoUrl = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bg-hero-0BnFGdr81Ifnj3WbBZoNt1KE4D5DMT.mp4";

export function OnboardingWizard() {
  const router = useRouter();
  const [started, setStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    getUserInfo().then((info) => {
      if (info) setUserName(info.firstName);
    });
    const timer = setTimeout(() => setStarted(true), 600);
    return () => clearTimeout(timer);
  }, []);

  const [agentName, setAgentName] = useState("Aegi Support Agent");
  const [useCase, setUseCase] = useState("");
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [autonomyLevel, setAutonomyLevel] = useState("approval_required");
  const [modelPreference, setModelPreference] = useState("auto");
  const [notes, setNotes] = useState("");

  const toggleTool = (tool: string) => {
    setSelectedTools((prev) =>
      prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool]
    );
  };

  const canProceed = () => {
    switch (steps[currentStep].id) {
      case "agentName": return agentName.trim().length > 0;
      case "useCase": return useCase.length > 0;
      case "tools": return selectedTools.length > 0;
      case "autonomy": return true;
      case "model": return true;
      case "notes": return true;
      default: return true;
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setError(null);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    const data = {
      agentName: agentName.trim(),
      useCase,
      tools: selectedTools,
      autonomyLevel,
      modelPreference,
      notes,
    };

    const result = await submitOnboardingData(data);
    if (result.error) {
      setError(result.error);
      setSubmitting(false);
      return;
    }

    setShowWelcome(true);

    setTimeout(() => {
      router.push("/dashboard");
    }, 2500);
  };

  const renderStepContent = () => {
    switch (steps[currentStep].id) {
      case "agentName":
        return (
          <div className="flex flex-col items-center">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.08] ring-1 ring-white/10">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">Name your agent</h2>
            <p className="mt-1 text-sm leading-5 text-white/58">Give your AI agent a recognizable name.</p>
            <div className="mt-5 w-full max-w-md">
              <input
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                className="h-12 w-full rounded-xl border border-white/12 bg-white/[0.08] px-4 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-white/28 focus:bg-white/[0.12] focus:ring-2 focus:ring-white/10"
                placeholder="e.g. Aegi Support Agent"
              />
            </div>
          </div>
        );

      case "useCase":
        return (
          <div className="flex flex-col items-center">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.08] ring-1 ring-white/10">
              <Headphones className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">Main workflow</h2>
            <p className="mt-1 text-sm leading-5 text-white/58">What should your agent focus on?</p>
            <div className="mt-5 flex w-full max-w-lg flex-wrap justify-center gap-2">
              {useCases.map((item) => {
                const Icon = item.icon;
                const selected = useCase === item.value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setUseCase(item.value)}
                    className={`flex min-w-[200px] flex-1 items-center justify-center gap-3 rounded-xl p-3 text-center transition ${
                      selected
                        ? "bg-white text-black shadow-[0_0_0_2px_rgba(255,255,255,0.5)]"
                        : "border border-white/[0.06] bg-white/[0.04] text-white hover:bg-white/[0.08]"
                    }`}
                  >
                    <Icon className={`h-5 w-5 shrink-0 ${selected ? "text-black" : "text-white/60"}`} />
                    <div>
                      <p className={`text-sm font-semibold ${selected ? "text-black" : "text-white"}`}>{item.label}</p>
                      <p className={`mt-0.5 text-xs ${selected ? "text-black/60" : "text-white/45"}`}>{item.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case "tools":
        return (
          <div className="flex flex-col items-center">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.08] ring-1 ring-white/10">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">Connect your tools</h2>
            <p className="mt-1 text-sm leading-5 text-white/58">Select the platforms your agent will use.</p>
            <div className="mt-5 flex w-full max-w-lg flex-wrap justify-center gap-2">
              {toolItems.map((item) => {
                const Icon = item.icon;
                const selected = selectedTools.includes(item.value);
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => toggleTool(item.value)}
                    className={`flex min-w-[130px] flex-1 items-center justify-center gap-2 rounded-xl p-3 text-center text-sm font-semibold transition ${
                      selected
                        ? "bg-white text-black shadow-[0_0_0_2px_rgba(255,255,255,0.5)]"
                        : "border border-white/[0.06] bg-white/[0.04] text-white/70 hover:bg-white/[0.08]"
                    }`}
                  >
                    <Icon className={`h-4 w-4 shrink-0 ${selected ? "text-black" : "text-white/50"}`} />
                    {item.value}
                  </button>
                );
              })}
            </div>
          </div>
        );

      case "autonomy":
        return (
          <div className="flex flex-col items-center">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.08] ring-1 ring-white/10">
              <UserCheck className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">Autonomy level</h2>
            <p className="mt-1 text-sm leading-5 text-white/58">How much freedom should your agent have?</p>
            <div className="mt-5 flex w-full max-w-lg flex-wrap justify-center gap-2">
              {autonomyLevels.map((item) => {
                const Icon = item.icon;
                const selected = autonomyLevel === item.value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setAutonomyLevel(item.value)}
                    className={`flex min-w-[140px] flex-1 flex-col items-center justify-center gap-2 rounded-xl p-4 text-center transition ${
                      selected
                        ? "bg-white text-black shadow-[0_0_0_2px_rgba(255,255,255,0.5)]"
                        : "border border-white/[0.06] bg-white/[0.04] text-white hover:bg-white/[0.08]"
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${selected ? "text-black" : "text-white/60"}`} />
                    <div>
                      <p className={`text-sm font-semibold ${selected ? "text-black" : "text-white"}`}>{item.label}</p>
                      <p className={`mt-0.5 text-xs ${selected ? "text-black/60" : "text-white/45"}`}>{item.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case "model":
        return (
          <div className="flex flex-col items-center">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.08] ring-1 ring-white/10">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">Model preference</h2>
            <p className="mt-1 text-sm leading-5 text-white/58">Which AI model powers your agent?</p>
            <div className="mt-5 flex w-full max-w-lg flex-wrap justify-center gap-2">
              {modelItems.map((item) => {
                const Icon = item.icon;
                const selected = modelPreference === item.value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setModelPreference(item.value)}
                    className={`flex min-w-[200px] flex-1 items-center justify-center gap-3 rounded-xl p-3 text-center transition ${
                      selected
                        ? "bg-white text-black shadow-[0_0_0_2px_rgba(255,255,255,0.5)]"
                        : "border border-white/[0.06] bg-white/[0.04] text-white hover:bg-white/[0.08]"
                    }`}
                  >
                    <Icon className={`h-5 w-5 shrink-0 ${selected ? "text-black" : "text-white/60"}`} />
                    <div>
                      <p className={`text-sm font-semibold ${selected ? "text-black" : "text-white"}`}>{item.label}</p>
                      <p className={`mt-0.5 text-xs ${selected ? "text-black/60" : "text-white/45"}`}>{item.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case "notes":
        return (
          <div className="flex flex-col items-center">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.08] ring-1 ring-white/10">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">Extra context</h2>
            <p className="mt-1 text-sm leading-5 text-white/58">Add instructions or constraints for your agent.</p>
            <div className="mt-5 w-full max-w-md">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="h-24 w-full resize-none rounded-xl border border-white/12 bg-white/[0.08] p-4 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-white/28 focus:bg-white/[0.12] focus:ring-2 focus:ring-white/10"
                placeholder="What should this agent do first? What should it avoid?"
              />
            </div>
          </div>
        );
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black text-white">
      <video
        className="absolute inset-0 h-full w-full scale-105 object-cover object-[72%_50%] blur-[8px] saturate-125"
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      >
        <source src={heroVideoUrl} type="video/mp4" />
      </video>

      {!started && !showWelcome ? (
        <div className="relative z-10 flex items-center justify-center px-5 py-7 sm:px-8 lg:px-12">
          <div className="flex flex-col items-center gap-4">
            <img src="/aegilabs-logo-no-border.png" alt="AegiLabs" className="h-8 w-auto max-w-[140px] object-contain opacity-60 animate-pulse" />
          </div>
        </div>
      ) : showWelcome ? (
        <div className="relative z-10 flex items-center justify-center px-5 py-7 sm:px-8 lg:px-12">
          <WelcomeTransition firstName={userName} />
        </div>
      ) : (
      <div className="relative z-10 flex min-h-0 items-center justify-center px-5 py-7 sm:px-8 lg:px-12">
        <section className="flex h-full max-h-[760px] w-full max-w-[1400px] flex-col overflow-hidden rounded-[1.25rem] border border-white/[0.08] bg-black/80 shadow-[0_34px_110px_rgba(0,0,0,0.62)] ring-1 ring-white/[0.04] backdrop-blur-xl">

          <div className="flex flex-1 items-center justify-center px-20 py-14 sm:px-24 lg:px-28">
            <div className="flex w-full max-w-lg flex-col items-center text-center">
            <div className="mb-5 flex justify-center">
              <a href="/" className="flex items-center transition-opacity hover:opacity-80" aria-label="AegiLabs home">
                <img src="/aegilabs-logo-no-border.png" alt="AegiLabs" className="h-6 w-auto max-w-[120px] object-contain" />
              </a>
            </div>
            {renderStepContent()}

            {error && (
              <div className="mt-4 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-100">
                {error}
              </div>
            )}

            <div className="mt-6 flex w-full items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleBack}
                disabled={currentStep === 0}
                className="flex h-11 items-center gap-2 rounded-xl border border-white/14 bg-white/[0.04] px-5 text-sm font-semibold text-white/60 transition hover:bg-white/[0.08] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" /> Back
              </button>

              {currentStep < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="flex h-11 items-center gap-2 rounded-xl bg-white px-6 text-sm font-bold text-black transition hover:bg-white/90 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex h-11 items-center gap-2 rounded-xl bg-white px-6 text-sm font-bold text-black transition hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Creating..." : "Create agent"}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
      )}
    </main>
  );
}
