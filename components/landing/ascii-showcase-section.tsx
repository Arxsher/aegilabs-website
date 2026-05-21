"use client";

import { AsciiScene } from "./ascii-scene";

export function AsciiShowcaseSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      <AsciiScene />
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/20 mb-6">
          &lt;visualization /&gt;
        </span>
        <h2 className="text-4xl lg:text-6xl font-display text-white/80 text-center max-w-2xl leading-tight">
          Intelligence
          <span className="text-white/30"> rendered in real time.</span>
        </h2>
      </div>
    </section>
  );
}
