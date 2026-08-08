"use client";
import { useEffect, useRef, useState } from "react";
import { Heart, Sparkles, PartyPopper, Volume2, VolumeX } from "lucide-react";
import Particles from "./Particles";
import Envelope from "./Envelope";
import { themeOf, pacingOf, intensityOf, DEFAULT_SETTINGS } from "@/lib/theme";

const HB_NOTES = [
  ["C4", "8n"], ["C4", "8n"], ["D4", "4n"], ["C4", "4n"], ["F4", "4n"], ["E4", "2n"],
  ["C4", "8n"], ["C4", "8n"], ["D4", "4n"], ["C4", "4n"], ["G4", "4n"], ["F4", "2n"],
  ["C4", "8n"], ["C4", "8n"], ["C5", "4n"], ["A4", "4n"], ["F4", "4n"], ["E4", "4n"], ["D4", "2n"],
  ["Bb4", "8n"], ["Bb4", "8n"], ["A4", "4n"], ["F4", "4n"], ["G4", "4n"], ["F4", "2n"],
];

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
  const t = (ms) => Math.round(ms * pacing.mult);

  const [stage, setStage] = useState("intro");
  const [opened, setOpened] = useState(false);
  const [particleStage, setParticleStage] = useState("idle");
  const [audioOn, setAudioOn] = useState(true);
  const audioRef = useRef(null);
  const loopRef = useRef(null);

  const begin = async () => {
    setOpened(true);
    setTimeout(() => { setStage("reveal"); setParticleStage("burst"); }, t(950));
    setTimeout(() => setParticleStage("ambient"), t(2200));
    setTimeout(() => setStage("photo"), t(2600));
    setTimeout(() => setStage("message"), t(record.photoUrl ? 5200 : 3800));
    setTimeout(() => { setStage("final"); setParticleStage("burst"); }, t(record.photoUrl ? 8400 : 7000));
    startMusic();
  };

  const startMusic = async () => {
    if (record.musicUrl) {
      try { await audioRef.current?.play(); } catch {}
      return;
    }
    try {
      const Tone = await import("tone");
      await Tone.start();
      const synth = new Tone.Synth({
        oscillator: { type: "triangle" },
        envelope: { attack: 0.02, decay: 0.15, sustain: 0.3, release: 0.4 },
      }).toDestination();
      synth.volume.value = -8;
      let i = 0;
      const loop = new Tone.Loop((time) => {
        const [note, dur] = HB_NOTES[i % HB_NOTES.length];
        synth.triggerAttackRelease(note, dur, time);
        i++;
      }, "8n");
      Tone.Transport.bpm.value = 108;
      loop.start(0);
      Tone.Transport.start();
      loopRef.current = { loop, synth, Tone };
    } catch {}
  };

  const toggleAudio = () => {
    if (record.musicUrl && audioRef.current) {
      if (audioRef.current.paused) audioRef.current.play().catch(() => {});
      else audioRef.current.pause();
      setAudioOn(!audioRef.current.paused);
    } else if (loopRef.current) {
      const { Tone } = loopRef.current;
      if (Tone.Transport.state === "started") { Tone.Transport.pause(); setAudioOn(false); }
      else { Tone.Transport.start(); setAudioOn(true); }
    }
  };

  useEffect(() => {
    return () => {
      if (loopRef.current) {
        loopRef.current.loop.dispose();
        loopRef.current.synth.dispose();
        loopRef.current.Tone.Transport.stop();
        loopRef.current.Tone.Transport.cancel();
      }
    };
  }, []);

  const replay = () => {
    setStage("intro");
    setOpened(false);
    setParticleStage("idle");
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const burstCount = particleStage === "burst" ? intensity.confetti : Math.round(intensity.confetti * 0.4);

  return (
    <div
      className="relative w-full overflow-hidden rounded-[26px] flex items-center justify-center"
      style={{ minHeight: isPreview ? 500 : "100vh", background: theme.expBg }}
    >
      <Particles kind="sparkle" count={intensity.sparkle} active theme={theme} />
      {(particleStage === "burst" || particleStage === "ambient") && (
        <Particles kind="confetti" count={burstCount} active theme={theme} />
      )}

      {record.musicUrl && (
        <audio
          ref={audioRef}
          src={record.musicUrl}
          loop
          onPlay={() => setAudioOn(true)}
          onPause={() => setAudioOn(false)}
        />
      )}

      {stage !== "intro" && (
        <button
          onClick={toggleAudio}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center"
          aria-label={audioOn ? "Mute music" : "Play music"}
        >
          {audioOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>
      )}

      <div className="relative z-[6] text-center px-6 py-8 max-w-md">
        {stage === "intro" && (
          <div className="flex flex-col items-center gap-4">
            <Envelope opened={opened} onOpen={begin} theme={theme} />
            <p
              className="font-display italic text-lg max-w-[280px] transition-opacity duration-500"
              style={{ color: theme.ink, opacity: opened ? 0.35 : 0.85 }}
            >
              Someone has a special surprise for you<span className="tracking-widest">…</span>
            </p>
            {!opened && (
              <button
                onClick={begin}
                className="flex items-center gap-2 rounded-2xl px-6 py-3 font-bold text-sm text-[#241203]"
                style={{ background: `linear-gradient(135deg, ${theme.gold}, ${theme.rose})` }}
              >
                <Sparkles size={16} /> Open it
              </button>
            )}
          </div>
        )}

        {stage === "reveal" && (
          <div className="flex flex-col items-center gap-4">
            <h1 className="font-display font-semibold text-4xl leading-tight" style={{ color: theme.ink }}>
              <StaggerText text="Happy Birthday," />
              <br />
              <StaggerText text={`${record.name}! 🎂🎉`} startDelay={0.5} style={{ color: theme.gold }} />
            </h1>
          </div>
        )}

        {stage === "photo" && (
          <div className="flex flex-col items-center gap-4 animate-fadeUp">
            {record.photoUrl ? (
              <div className="relative w-60 h-60">
                <img
                  src={record.photoUrl}
                  alt={record.name}
                  className="w-60 h-60 object-cover rounded-full border-4 photoIn"
                  style={{ borderColor: `${theme.gold}8c`, boxShadow: `0 0 40px ${theme.gold}59` }}
                />
                <span className="shine" />
              </div>
            ) : (
              <div className="w-52 h-52 rounded-full bg-white/5 border-2 border-dashed border-white/20 flex items-center justify-center">
                <PartyPopper size={64} color={theme.gold} />
              </div>
            )}
            <h2 className="font-display font-semibold text-2xl" style={{ color: theme.ink }}>{record.name} 🎂</h2>
          </div>
        )}

        {stage === "message" && (
          <div className="flex flex-col items-center gap-3">
            <Heart size={26} color={theme.rose} />
            <StaggerText
              text={record.message}
              wordDelay={0.045}
              className="font-display italic text-lg leading-relaxed max-w-[380px] inline-block"
              style={{ color: theme.ink }}
            />
          </div>
        )}

        {stage === "final" && (
          <div className="flex flex-col items-center gap-4 animate-fadeUp">
            <h1 className="font-display font-semibold text-4xl leading-tight glowPulse" style={{ color: theme.ink }}>
              Happy Birthday,
              <br />
              <span style={{ color: theme.gold }}>{record.name}</span>! ❤️🎂
            </h1>
            <button
              onClick={replay}
              className="mt-2 flex items-center gap-2 rounded-2xl px-5 py-3 font-semibold text-sm bg-white/8 border border-white/16"
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
        .shine {
          position: absolute; inset: 0; border-radius: 50%; overflow: hidden; pointer-events: none;
        }
        .shine::after {
          content: ""; position: absolute; top: -20%; left: -60%; width: 40%; height: 140%;
          background: linear-gradient(120deg, transparent, rgba(255,255,255,0.55), transparent);
          transform: rotate(20deg); animation: shineSweep 1.6s ease-out 0.5s 1;
        }
        @keyframes shineSweep { from { left: -60%; } to { left: 130%; } }
        @media (prefers-reduced-motion: reduce) {
          .photoIn, .glowPulse { animation: none; }
        }
      `}</style>
    </div>
  );
}
