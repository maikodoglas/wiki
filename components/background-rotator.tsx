"use client";

import { useEffect, useRef, useState } from "react";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** `scrim` darkens each scene so text stays readable; the day sky needs the most. */
const themes = [
  { id: "noturno", scrim: 0.55 },
  { id: "dia", scrim: 0.8 },
  { id: "maligno", scrim: 0.45 },
] as const;

const SWAP_EVERY = 15_000;
const GLITCH_MS = 900;
/** Swap the image halfway through the glitch, while it's most chaotic. */
const SWAP_AT = 420;

const url = (id: string) => `url("${basePath}/live/${id}.png")`;

/** The stream's background scenes, glitching into a new one every 15 seconds. */
export function BackgroundRotator() {
  const [current, setCurrent] = useState(0);
  const currentRef = useRef(0);
  const [glitch, setGlitch] = useState<{ key: number; to: number } | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const interval = setInterval(() => {
      // Pick one of the other scenes at random.
      const from = currentRef.current;
      const to = (from + 1 + Math.floor(Math.random() * (themes.length - 1))) % themes.length;
      currentRef.current = to;
      if (reduced) {
        setCurrent(to);
        return;
      }
      setGlitch({ key: Date.now(), to });
      timers.push(setTimeout(() => setCurrent(to), SWAP_AT));
      timers.push(setTimeout(() => setGlitch(null), GLITCH_MS));
    }, SWAP_EVERY);

    return () => {
      clearInterval(interval);
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[-2] overflow-hidden bg-bg" aria-hidden>
      {themes.map((theme, i) => (
        <div
          key={theme.id}
          className="bg-scene"
          data-active={i === current}
          style={{ backgroundImage: url(theme.id) }}
        />
      ))}

      {glitch && (
        <div key={glitch.key} className="bg-glitch">
          <div className="bg-glitch-rgb bg-glitch-red" style={{ backgroundImage: url(themes[glitch.to].id) }} />
          <div className="bg-glitch-rgb bg-glitch-cyan" style={{ backgroundImage: url(themes[glitch.to].id) }} />
          {[0, 1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className={`bg-glitch-slice bg-glitch-slice-${n}`}
              style={{ backgroundImage: url(themes[n % 2 ? glitch.to : current].id) }}
            />
          ))}
          <div className="bg-glitch-noise" />
        </div>
      )}

      <div className="bg-scrim" style={{ "--scrim": themes[current].scrim } as React.CSSProperties} />
    </div>
  );
}
