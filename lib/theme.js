export const THEMES = {
  midnight: {
    label: "Midnight Romance",
    bg: "radial-gradient(120% 100% at 50% -10%, #241033 0%, #150a1e 45%, #0b0510 100%)",
    expBg: "radial-gradient(120% 100% at 50% 0%, #2b1240 0%, #170a20 55%, #0b0510 100%)",
    gold: "#E7B65C", rose: "#FF7A9C", accent2: "#C77DFF", ink: "#F3E9EF",
    swatch: ["#241033", "#E7B65C", "#FF7A9C"],
  },
  golden: {
    label: "Golden Hour",
    bg: "radial-gradient(120% 100% at 50% -10%, #3a230a 0%, #241505 45%, #120a02 100%)",
    expBg: "radial-gradient(120% 100% at 50% 0%, #4a2c0d 0%, #241505 55%, #120a02 100%)",
    gold: "#FFD27A", rose: "#FF9E5E", accent2: "#FFB84D", ink: "#FFF3E0",
    swatch: ["#3a230a", "#FFD27A", "#FF9E5E"],
  },
  pastel: {
    label: "Pastel Dream",
    bg: "radial-gradient(120% 100% at 50% -10%, #2a1f3d 0%, #1a1330 45%, #0e0a1c 100%)",
    expBg: "radial-gradient(120% 100% at 50% 0%, #33254a 0%, #1a1330 55%, #0e0a1c 100%)",
    gold: "#FFD6E8", rose: "#C9A7FF", accent2: "#A8E6CF", ink: "#FBF3FF",
    swatch: ["#2a1f3d", "#FFD6E8", "#A8E6CF"],
  },
  galaxy: {
    label: "Galaxy Night",
    bg: "radial-gradient(120% 100% at 50% -10%, #0a1a3d 0%, #050b24 45%, #020614 100%)",
    expBg: "radial-gradient(120% 100% at 50% 0%, #0e2452 0%, #050b24 55%, #020614 100%)",
    gold: "#7FDBFF", rose: "#FF6EC7", accent2: "#39FF88", ink: "#E8F4FF",
    swatch: ["#0a1a3d", "#7FDBFF", "#FF6EC7"],
  },
};

export const INTENSITY = {
  subtle: { label: "Subtle", confetti: 14, sparkle: 10, speed: 1.25 },
  balanced: { label: "Balanced", confetti: 26, sparkle: 18, speed: 1 },
  extra: { label: "Extra", confetti: 42, sparkle: 28, speed: 0.75 },
};

export const PACING = {
  quick: { label: "Quick", mult: 0.6 },
  cinematic: { label: "Cinematic", mult: 1 },
  slow: { label: "Slow burn", mult: 1.5 },
};

export const PARTICLE_MIX = {
  confetti: { label: "Confetti", shapes: ["confetti"] },
  stars: { label: "Stars & sparkles", shapes: ["star"] },
  hearts: { label: "Hearts", shapes: ["heart"] },
  mixed: { label: "Everything", shapes: ["confetti", "star", "heart"] },
};

export const DEFAULT_SETTINGS = { theme: "midnight", intensity: "balanced", pacing: "cinematic", particles: "confetti" };

export function themeOf(settings) {
  return THEMES[settings?.theme] || THEMES.midnight;
}
export function pacingOf(settings) {
  return PACING[settings?.pacing] || PACING.cinematic;
}
export function intensityOf(settings) {
  return INTENSITY[settings?.intensity] || INTENSITY.balanced;
}
export function mixOf(settings) {
  return PARTICLE_MIX[settings?.particles] || PARTICLE_MIX.confetti;
}
