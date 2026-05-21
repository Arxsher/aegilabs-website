"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { Menu, X, Search, Sparkles } from "lucide-react";

const UserMenu = dynamic(() => import("@/components/dashboard/user-menu").then((m) => m.UserMenu), { ssr: false });

const heroVideoUrl = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bg-hero-0BnFGdr81Ifnj3WbBZoNt1KE4D5DMT.mp4";

const navLinks = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Agent Chat", href: "/dashboard/agent" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="relative flex min-h-screen bg-black text-white overflow-hidden">
      <video
        className="absolute inset-0 h-full w-full scale-105 object-cover object-[72%_50%] blur-[8px] saturate-125"
        muted
        playsInline
        autoPlay
        loop
        preload="none"
        aria-hidden="true"
      >
        <source src={heroVideoUrl} type="video/mp4" />
      </video>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <div className="relative z-10 flex flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-white/[0.06] bg-black/40 backdrop-blur-2xl px-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center">
              <img src="/aegilabs-logo-no-border.png" alt="AegiLabs" className="h-5 w-auto" />
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`rounded-lg px-3 py-1.5 text-sm transition ${
                      isActive ? "text-white bg-white/[0.06]" : "text-white/50 hover:text-white/80"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <Link
                href="/dashboard/pricing"
                className="ml-2 inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-white/[0.12] via-white/[0.06] to-white/[0.12] border border-white/20 px-3.5 py-1.5 text-sm font-medium text-white/90 shadow-[0_0_20px_rgba(255,255,255,0.06)] transition hover:from-white/[0.16] hover:via-white/[0.1] hover:to-white/[0.16] hover:border-white/30 group"
              >
                <Sparkles className="h-3.5 w-3.5 text-white/60 group-hover:text-white" />
                Upgrade plan
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="h-8 w-48 rounded-lg bg-transparent px-4 pl-9 text-sm text-white outline-none placeholder:text-white/30 transition focus:bg-white/[0.04]"
                />
              </div>
            </div>
            <UserMenu />
            <button onClick={() => setMobileOpen(true)} className="md:hidden text-white/50 hover:text-white">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </header>

        {mobileOpen && (
          <div className="fixed inset-x-0 top-14 z-40 bg-black/90 backdrop-blur-xl border-b border-white/[0.06] md:hidden">
            <nav className="flex flex-col p-4 gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`rounded-lg px-3 py-2.5 text-sm transition ${
                      isActive ? "text-white bg-white/[0.06]" : "text-white/50 hover:text-white/80"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <Link
                href="/dashboard/pricing"
                onClick={() => setMobileOpen(false)}
                className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-white/[0.12] via-white/[0.06] to-white/[0.12] border border-white/20 px-3.5 py-2.5 text-sm font-medium text-white/90"
              >
                <Sparkles className="h-4 w-4 text-white/60" />
                Upgrade plan
              </Link>
            </nav>
          </div>
        )}

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
