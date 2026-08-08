"use client";
import { Cake } from "lucide-react";

export default function WaxSeal({ cracked = false, size = 96 }) {
  return (
    <div
      className="relative mx-auto shadow-seal"
      style={{ width: size, height: size }}
    >
      <div
        className="w-full h-full rounded-full flex items-center justify-center relative overflow-hidden transition-transform duration-700"
        style={{
          background:
            "radial-gradient(circle at 32% 28%, #ffd98a, #E7B65C 42%, #a8722a 100%)",
          transform: cracked ? "scale(1.12) rotate(-4deg)" : "scale(1) rotate(0deg)",
          transitionTimingFunction: "cubic-bezier(.2,1.4,.4,1)",
        }}
      >
        <Cake
          size={size * 0.42}
          color="#3a2408"
          strokeWidth={1.6}
          className="transition-opacity duration-500"
          style={{ opacity: cracked ? 0 : 1 }}
        />
        {cracked && (
          <>
            <span
              className="absolute w-[2px] h-[70%] bg-[#3a2408]/50"
              style={{ transform: "rotate(14deg)" }}
            />
            <span
              className="absolute w-[2px] h-[55%] bg-[#3a2408]/40"
              style={{ transform: "rotate(-22deg) translateX(8px)" }}
            />
          </>
        )}
      </div>
    </div>
  );
}
