"use client";
import { useEffect, useRef, useState } from "react";
import { Heart, Sparkles, PartyPopper, Volume2, VolumeX } from "lucide-react";
import Particles from "./Particles";
import Envelope from "./Envelope";
import { themeOf, pacingOf, intensityOf, relationOf, DEFAULT_SETTINGS, DEFAULT_MUSIC_URL } from "@/lib/theme";

const STAGE_ORDER = ["intro", "reveal", "photo", "message", "final"];

function StaggerText({ text, className, style, wordDelay = 0.07, startDelay = 0 }) {
  const words = text.split(" ");
  return (
    <span className={className} style={style}>
      {words.map((w, i) => (
        <span
          key={i}
          className="inline-block opacity-0"
          style={{
            animation: "wordIn 0.6s ease forwards",
            animationDelay: `${startDelay + i * wordDelay}s`,
            marginRight: "0.28em",
          }}
        >
          {w}
        </span>
      ))}
    </span>
  );
}

export default function BirthdayExperience({ record, isPreview = false }) {
  const settings = record.settings || DEFAULT_SETTINGS;
  const theme = themeOf(settings);
  const pacing = pacingOf(settings);
  const intensity = intensityOf(settings);
  const relation = relationOf(settings);
  const interactive = settings.interactive !== false;
  const t = (ms) => Math.round(ms * pacing.mult);
  const audioSrc = record.musicUrl || DEFAULT_MUSIC_URL;

  const [stage, setStage] = useState("intro");
  const [opened, setOpened] = useState(false);
  const [particleStage, setParticleStage] = useState("idle");
  const [audioOn, setAudioOn] = useState(true);
  const [clipId] = useState(() => "hc" + Math.random().toString(36).slice(2, 9));
  const audioRef = useRef(null);
  const timeoutsRef = useRef([]);

  const schedule = (fn, ms) => {
    const id = setTimeout(fn, ms);
    timeoutsRef.current.push(id);
    return id;
  };
  const clearScheduled = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  const begin = () => {
    setOpened(true);
    // Play directly inside the click handler — the most reliable way to
    // satisfy mobile/desktop autoplay policies for audio.
    audioRef.current?.play().catch(() => {});
    schedule(() => { setStage("reveal"); setParticleStage("burst"); }, t(950));
    schedule(() => setParticleStage("ambient"), t(2200));
    schedule(() => setStage("photo"), t(2600));
    schedule(() => setStage("message"), t(record.photoUrl ? 5200 : 3800));
    schedule(() => { setStage("final"); setParticleStage("burst"); }, t(record.photoUrl ? 8400 : 7000));
  };

  const skipToNext = () => {
    if (!interactive || stage === "intro" || stage === "final") return;
    clearScheduled();
    const idx = STAGE_ORDER.indexOf(stage);
    const next = STAGE_ORDER[idx + 1] || "final";
    setStage(next);
    if (next === "final") setParticleStage("burst");
  };

  const toggleAudio = (e) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    if (audioRef.current.paused) audioRef.current.play().catch(() => {});
    else audioRef.current.pause();
  };

  useEffect(() => () => clearScheduled(), []);

  const replay = (e) => {
    e.stopPropagation();
    clearScheduled();
    setStage("intro");
    setOpened(false);
    setParticleStage("idle");
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const burstCount = particleStage === "burst" ? intensity.confetti : Math.round(intensity.confetti * 0.4);
  const tappable = interactive && stage !== "intro" && stage !== "final";
  const frame = settings.frame || "circle";

  return (
    <div
      onClick={skipToNext}
      className="relative w-full rounded-[26px] flex items-center justify-center select-none"
      style={{
        minHeight: isPreview ? 500 : "100dvh",
        background: theme.expBg,
        cursor: tappable ? "pointer" : "default",
        WebkitTapHighlightColor: "transparent",
        touchAction: "manipulation",
        paddingTop: isPreview ? undefined : "env(safe-area-inset-top)",
        paddingBottom: isPreview ? undefined : "env(safe-area-inset-bottom)",
        overflowX: "hidden",
        // No overflow-y restriction here on purpose: this container only has a
        // *minimum* height, so when a long message makes it taller than the
        // screen it should simply grow and let the page scroll — clipping it
        // (the old "overflow-hidden" here) made the overflow permanently
        // invisible with no way to scroll to it at all.
      }}
    >
      <Particles kind="sparkle" count={intensity.sparkle} active theme={theme} />
      <div
        className="absolute rounded-full pointer-events-none aura"
        style={{
          width: "70%", height: "70%", left: "15%", top: "10%",
          background: `radial-gradient(circle, ${theme.gold}16, transparent 65%)`,
          filter: "blur(20px)",
        }}
      />
      {(particleStage === "burst" || particleStage === "ambient") && (
        <Particles kind="confetti" count={burstCount} active theme={theme} />
      )}

      <audio ref={audioRef} src={audioSrc} loop preload="none" onPlay={() => setAudioOn(true)} onPause={() => setAudioOn(false)} />

      {stage !== "intro" && (
        <button
          onClick={toggleAudio}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center"
          style={{ touchAction: "manipulation" }}
          aria-label={audioOn ? "Mute music" : "Play music"}
        >
          {audioOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>
      )}

      <div className="relative z-[6] text-center px-6 py-8 max-w-md w-full">
        {stage === "intro" && (
          <div className="flex flex-col items-center gap-4" onClick={(e) => e.stopPropagation()}>
            <Envelope opened={opened} onOpen={begin} theme={theme} />
            <span className="text-2xl -mb-1">{relation.icon}</span>
            <p
              className="font-display italic max-w-[300px] transition-opacity duration-500"
              style={{ color: theme.ink, opacity: opened ? 0.35 : 0.85, fontSize: "clamp(1rem,4.5vw,1.15rem)" }}
            >
              {relation.intro}<span className="tracking-widest">…</span>
            </p>
            {!opened && (
              <button
                onClick={begin}
                className="flex items-center gap-2 rounded-2xl px-6 py-3.5 font-bold text-sm text-[#241203]"
                style={{ background: `linear-gradient(135deg, ${theme.gold}, ${theme.rose})`, touchAction: "manipulation" }}
              >
                <Sparkles size={16} /> Open it
              </button>
            )}
          </div>
        )}

        {stage === "reveal" && (
          <div className="flex flex-col items-center gap-4">
            <h1
              className="font-display font-semibold leading-tight"
              style={{ color: theme.ink, fontSize: "clamp(1.9rem,7vw,3rem)" }}
            >
              <StaggerText text="Happy Birthday," />
              <br />
              <StaggerText text={`${record.name}! 🎂🎉`} startDelay={0.5} style={{ color: theme.gold }} />
            </h1>
            {interactive && <TapHint theme={theme} />}
          </div>
        )}

        {stage === "photo" && (
          <div className="flex flex-col items-center gap-4 animate-fadeUp">
            {record.photoUrl && frame === "heart" && (
              <svg width="0" height="0" style={{ position: "absolute" }}>
                <defs>
                  <clipPath id={clipId} clipPathUnits="objectBoundingBox">
                    <path d="M0.5,1 C0.5,1 0,0.62 0,0.32 C0,0.12 0.16,0 0.32,0 C0.42,0 0.5,0.06 0.5,0.2 C0.5,0.06 0.58,0 0.68,0 C0.84,0 1,0.12 1,0.32 C1,0.62 0.5,1 0.5,1 Z" />
                  </clipPath>
                </defs>
              </svg>
            )}
            {record.photoUrl ? (
              <div
                className="relative flex items-center justify-center"
                style={{ width: "clamp(190px,55vw,280px)", height: frame === "heart" ? "clamp(175px,50vw,258px)" : "clamp(190px,55vw,280px)" }}
              >
                <img
                  src={record.photoUrl}
                  alt={record.name}
                  className="photoIn w-full h-full"
                  style={{
                    objectFit: "cover",
                    borderRadius: frame === "circle" ? "50%" : frame === "rounded" ? 28 : 0,
                    clipPath: frame === "heart" ? `url(#${clipId})` : "none",
                    border: frame === "heart" ? "none" : `4px solid ${theme.gold}8c`,
                    boxShadow: `0 0 40px ${theme.gold}59`,
                  }}
                />
                {frame !== "heart" && <span className="shine" style={{ borderRadius: frame === "circle" ? "50%" : 28 }} />}
              </div>
            ) : (
              <div className="w-[min(52vw,200px)] h-[min(52vw,200px)] rounded-full bg-white/5 border-2 border-dashed border-white/20 flex items-center justify-center">
                <PartyPopper size={64} color={theme.gold} />
              </div>
            )}
            <h2 className="font-display font-semibold" style={{ color: theme.ink, fontSize: "clamp(1.3rem,5.5vw,1.8rem)" }}>
              {record.name} 🎂
            </h2>
            {interactive && <TapHint theme={theme} />}
          </div>
        )}

        {stage === "message" && (
          <div className="flex flex-col items-center gap-3">
            <Heart size={26} color={theme.rose} />
            <StaggerText
              text={record.message}
              wordDelay={0.045}
              className="font-display italic leading-relaxed max-w-[420px] inline-block"
              style={{ color: theme.ink, fontSize: "clamp(1rem,4.2vw,1.3rem)" }}
            />
            {interactive && <TapHint theme={theme} />}
          </div>
        )}

        {stage === "final" && (
          <div className="flex flex-col items-center gap-4 animate-fadeUp" onClick={(e) => e.stopPropagation()}>
            <h1
              className="font-display font-semibold leading-tight glowPulse"
              style={{ color: theme.ink, fontSize: "clamp(1.9rem,7vw,3rem)" }}
            >
              Happy Birthday,
              <br />
              <span style={{ color: theme.gold }}>{record.name}</span>! 🎂
            </h1>
            <button
              onClick={replay}
              className="mt-2 flex items-center gap-2 rounded-2xl px-5 py-3 font-semibold text-sm bg-white/8 border border-white/16"
              style={{ touchAction: "manipulation" }}
            >
              <Sparkles size={15} /> Replay
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes wordIn {
          from { opacity: 0; transform: translateY(10px) scale(0.96); filter: blur(3px); }
          to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        @keyframes glowPulse {
          0%, 100% { filter: drop-shadow(0 0 0px rgba(231,182,92,0)); }
          50% { filter: drop-shadow(0 0 18px rgba(231,182,92,0.55)); }
        }
        .glowPulse { animation: glowPulse 2.4s ease-in-out infinite; }
        @keyframes photoPop {
          from { opacity: 0; transform: scale(0.7) rotate(-6deg); filter: blur(6px); }
          to { opacity: 1; transform: scale(1) rotate(0deg); filter: blur(0); }
        }
        .photoIn { animation: photoPop 0.8s cubic-bezier(.2,1.3,.3,1) both; }
        .shine { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
        .shine::after {
          content: ""; position: absolute; top: -20%; left: -60%; width: 40%; height: 140%;
          background: linear-gradient(120deg, transparent, rgba(255,255,255,0.55), transparent);
          transform: rotate(20deg); animation: shineSweep 1.6s ease-out 0.5s 1;
        }
        @keyframes shineSweep { from { left: -60%; } to { left: 130%; } }
        @keyframes hintPulse { 0%, 100% { opacity: 0.35; } 50% { opacity: 0.8; } }
        .tapHint { animation: hintPulse 1.8s ease-in-out infinite; }
        @keyframes auraDrift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(6%, -4%) scale(1.08); }
        }
        .aura { animation: auraDrift 12s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .photoIn, .glowPulse, .tapHint, .aura { animation: none; }
        }
      `}</style>
    </div>
  );
}

function TapHint({ theme }) {
  return (
    <p className="tapHint text-[11px] mt-1" style={{ color: theme.ink }}>
      tap anywhere to continue
    </p>
  );
}
