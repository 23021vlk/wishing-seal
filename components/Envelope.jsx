"use client";
import { Sparkles } from "lucide-react";

export default function Envelope({ opened, onOpen, theme }) {
  return (
    <div style={{ perspective: 900 }}>
      <div
        onClick={!opened ? onOpen : undefined}
        className="relative mx-auto"
        style={{ width: 168, height: 112, cursor: opened ? "default" : "pointer" }}
      >
        <div
          className="absolute inset-0 rounded-[10px] overflow-hidden"
          style={{
            background: `linear-gradient(160deg, ${theme.swatch[0]}, #0000 60%), linear-gradient(200deg, rgba(255,255,255,0.08), transparent)`,
            border: `1px solid ${theme.gold}55`,
            boxShadow: "0 18px 40px rgba(0,0,0,0.45)",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, transparent 49%, ${theme.gold}22 50%, transparent 51%), linear-gradient(-135deg, transparent 49%, ${theme.gold}22 50%, transparent 51%)`,
            }}
          />
        </div>

        <div
          className="absolute left-3.5 right-3.5 flex items-center justify-center z-[1]"
          style={{
            bottom: opened ? 46 : 6,
            height: 78,
            background: `linear-gradient(180deg, ${theme.ink}f2, ${theme.ink}dd)`,
            borderRadius: 6,
            transition: "bottom 0.9s cubic-bezier(.2,1.1,.3,1) 0.25s",
            boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
          }}
        >
          <Sparkles size={20} color={theme.swatch[0]} />
        </div>

        <div
          className="absolute top-0 left-0 right-0 z-[3]"
          style={{
            height: 60,
            background: `linear-gradient(200deg, ${theme.swatch[0]}, #1a0d24)`,
            clipPath: "polygon(0 0, 50% 62%, 100% 0)",
            transformOrigin: "top center",
            transform: opened ? "rotateX(178deg)" : "rotateX(0deg)",
            transition: "transform 0.85s cubic-bezier(.4,.1,.2,1)",
            transformStyle: "preserve-3d",
            border: `1px solid ${theme.gold}55`,
            borderBottom: "none",
          }}
        />

        <div
          className="absolute left-1/2 z-[4]"
          style={{
            top: opened ? -6 : 30,
            transform: `translateX(-50%) scale(${opened ? 0.001 : 1})`,
            transition: "transform 0.5s ease, top 0.5s ease",
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: `radial-gradient(circle at 32% 28%, #ffd98a, ${theme.gold} 42%, #a8722a 100%)`,
            boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
          }}
        />
      </div>
    </div>
  );
}
