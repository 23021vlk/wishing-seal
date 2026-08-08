"use client";
import { useState } from "react";

const HUES_KEY = "hue";

export default function Particles({ kind = "confetti", count = 26, active = true, theme }) {
  const hues = theme ? [theme.gold, theme.rose, theme.accent2, theme.ink] : ["#E7B65C", "#FF7A9C", "#C77DFF", "#8FE3CF"];
  const [items] = useState(() =>
    Array.from({ length: count }, () => ({
      left: Math.random() * 100,
      delay: Math.random() * 2.2,
      dur: 3.2 + Math.random() * 2.6,
      size: 6 + Math.random() * 10,
      hue: hues[Math.floor(Math.random() * hues.length)],
      drift: (Math.random() - 0.5) * 120,
      rot: Math.random() * 360,
    }))
  );

  if (!active) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[5]">
      {items.map((p, i) => (
        <span
          key={i}
          className={`absolute ${kind === "sparkle" ? "animate-drift" : kind === "balloon" ? "animate-floatUp" : "animate-fallDown"}`}
          style={{
            left: `${p.left}%`,
            top: kind === "balloon" ? "104%" : kind === "sparkle" ? `${Math.random() * 90}%` : "-8%",
            width: p.size,
            height: kind === "balloon" ? p.size * 1.3 : p.size,
            background: kind === "sparkle" ? "transparent" : p.hue,
            borderRadius: kind === "confetti" ? 2 : "50%",
            boxShadow: kind === "sparkle" ? `0 0 8px 2px ${p.hue}` : "none",
            animationDuration: kind === "sparkle" ? "6s" : `${p.dur}s`,
            animationDelay: `${p.delay}s`,
            "--drift": `${p.drift}px`,
            "--rot": `${p.rot}deg`,
            opacity: 0.9,
          }}
        />
      ))}
    </div>
  );
}
