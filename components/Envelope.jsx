"use client";
import { useState } from "react";
import { Sparkles } from "lucide-react";

export default function Envelope({ opened, onOpen, theme }) {
  const [burstKey, setBurstKey] = useState(0);

  const handleOpen = () => {
    if (opened) return;
    setBurstKey((k) => k + 1);
    onOpen();
  };

  return (
    <div style={{ perspective: 1000 }} className="relative">
      {/* ambient glow behind the envelope, invites tapping before it's opened */}
      <div
        className={!opened ? "envGlow" : ""}
        style={{
          position: "absolute", inset: "-30%", borderRadius: "50%",
          background: `radial-gradient(circle, ${theme.gold}30, transparent 70%)`,
          filter: "blur(16px)", zIndex: 0,
        }}
      />

      <div
        onClick={handleOpen}
        className={!opened ? "envFloat" : ""}
        style={{
          width: 190, height: 126, position: "relative", cursor: opened ? "default" : "pointer", zIndex: 1,
        }}
      >
        {/* body */}
        <div
          className="absolute inset-0 rounded-[12px] overflow-hidden"
          style={{
            background: `linear-gradient(160deg, ${theme.swatch[0]}, #0000 60%), linear-gradient(200deg, rgba(255,255,255,0.09), transparent)`,
            border: `1px solid ${theme.gold}55`,
            boxShadow: `0 20px 46px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03) inset`,
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, transparent 49%, ${theme.gold}22 50%, transparent 51%), linear-gradient(-135deg, transparent 49%, ${theme.gold}22 50%, transparent 51%)`,
            }}
          />
        </div>

        {/* letter, rises and settles with a slight overshoot */}
        <div
          className="absolute left-3.5 right-3.5 flex items-center justify-center z-[1]"
          style={{
            bottom: opened ? 52 : 8,
            height: 82,
            background: `linear-gradient(180deg, ${theme.ink}f5, ${theme.ink}e0)`,
            borderRadius: 7,
            transform: opened ? "scale(1) rotate(0deg)" : "scale(0.9) rotate(-3deg)",
            transition: "bottom 0.85s cubic-bezier(.22,1.5,.36,1) 0.2s, transform 0.85s cubic-bezier(.22,1.5,.36,1) 0.2s",
            boxShadow: "0 8px 22px rgba(0,0,0,0.4)",
          }}
        >
          <Sparkles size={20} color={theme.swatch[0]} />
        </div>

        {/* flap, bouncy open instead of a flat flip */}
        <div
          className="absolute top-0 left-0 right-0 z-[3]"
          style={{
            height: 64,
            background: `linear-gradient(200deg, ${theme.swatch[0]}, #1a0d24)`,
            clipPath: "polygon(0 0, 50% 62%, 100% 0)",
            transformOrigin: "top center",
            transform: opened ? "rotateX(172deg)" : "rotateX(0deg)",
            transition: "transform 0.8s cubic-bezier(.36,1.4,.4,1)",
            transformStyle: "preserve-3d",
            border: `1px solid ${theme.gold}55`,
            borderBottom: "none",
          }}
        />

        {/* seal, pops and fades away on open */}
        <div
          className="absolute left-1/2 z-[4]"
          style={{
            top: opened ? -8 : 34,
            transform: `translateX(-50%) scale(${opened ? 0.001 : 1}) rotate(${opened ? 35 : 0}deg)`,
            transition: "transform 0.5s cubic-bezier(.4,0,.6,1), top 0.5s ease",
            width: 36, height: 36, borderRadius: "50%",
            background: `radial-gradient(circle at 32% 28%, #ffd98a, ${theme.gold} 42%, #a8722a 100%)`,
            boxShadow: "0 4px 12px rgba(0,0,0,0.45)",
          }}
        />

        {/* burst of little particles the instant the seal breaks */}
        {opened && (
          <div key={burstKey} className="absolute left-1/2 z-[4]" style={{ top: 34 }}>
            {Array.from({ length: 6 }).map((_, i) => {
              const angle = (i / 6) * Math.PI * 2;
              return (
                <span
                  key={i}
                  className="sealBurst"
                  style={{
                    position: "absolute", width: 5, height: 5, borderRadius: "50%",
                    background: i % 2 === 0 ? theme.gold : theme.rose,
                    "--bx": `${Math.cos(angle) * 40}px`,
                    "--by": `${Math.sin(angle) * 40}px`,
                  }}
                />
              );
            })}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes envFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-7px); }
        }
        .envFloat { animation: envFloat 3s ease-in-out infinite; }
        @keyframes envGlowPulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.12); }
        }
        .envGlow { animation: envGlowPulse 2.6s ease-in-out infinite; }
        @keyframes sealBurst {
          from { transform: translate(-50%, -50%) translate(0, 0); opacity: 1; }
          to { transform: translate(-50%, -50%) translate(var(--bx), var(--by)); opacity: 0; }
        }
        .sealBurst { animation: sealBurst 0.6s ease-out forwards; }
        @media (prefers-reduced-motion: reduce) {
          .envFloat, .envGlow, .sealBurst { animation: none; }
        }
      `}</style>
    </div>
  );
}
