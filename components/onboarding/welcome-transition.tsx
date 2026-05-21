"use client";

import { useEffect, useState, useRef } from "react";

function BlurLetter({ char, delay }: { char: string; delay: number }) {
  const [opacity, setOpacity] = useState(0);
  const [blur, setBlur] = useState(20);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const DURATION = 500;
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - start) / DURATION, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setOpacity(eased);
        setBlur(20 * (1 - eased));
        if (progress < 1) {
          frameRef.current = requestAnimationFrame(tick);
        }
      };
      frameRef.current = requestAnimationFrame(tick);
    }, delay);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(frameRef.current);
    };
  }, [delay]);

  return (
    <span
      style={{
        display: "inline-block",
        opacity,
        filter: `blur(${blur}px)`,
        whiteSpace: char === " " ? "pre" : undefined,
        width: char === " " ? "0.3em" : undefined,
      }}
    >
      {char === " " ? "\u00A0" : char}
    </span>
  );
}

export function WelcomeTransition({ firstName }: { firstName: string | null }) {
  const sentence = `Welcome, ${firstName ?? "there"}.`;
  const STAGGER = 30;

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <h1 className="text-[clamp(1.5rem,4vw,3rem)] font-display leading-[1.1] tracking-tight text-white text-center">
        {sentence.split("").map((char, i) => (
          <BlurLetter key={i} char={char} delay={i * STAGGER} />
        ))}
      </h1>
      <p className="text-sm text-white/40 animate-pulse">
        Setting up your agent...
      </p>
    </div>
  );
}
