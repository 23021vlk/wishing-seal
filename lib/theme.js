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
  roseGold: {
    label: "Rose Gold",
    bg: "radial-gradient(120% 100% at 50% -10%, #3d1a24 0%, #2a0f17 45%, #16080c 100%)",
    expBg: "radial-gradient(120% 100% at 50% 0%, #4a2129 0%, #2a0f17 55%, #16080c 100%)",
    gold: "#F0C4A8", rose: "#FF8FA3", accent2: "#FFD6BA", ink: "#FFF1EA",
    swatch: ["#3d1a24", "#F0C4A8", "#FF8FA3"],
  },
  ocean: {
    label: "Ocean Breeze",
    bg: "radial-gradient(120% 100% at 50% -10%, #0a2f3d 0%, #071e28 45%, #030f15 100%)",
    expBg: "radial-gradient(120% 100% at 50% 0%, #0d3a4a 0%, #071e28 55%, #030f15 100%)",
    gold: "#7EE8D8", rose: "#5EC8FF", accent2: "#B4F0E0", ink: "#EAFBFF",
    swatch: ["#0a2f3d", "#7EE8D8", "#5EC8FF"],
  },
  neon: {
    label: "Neon Pop",
    bg: "radial-gradient(120% 100% at 50% -10%, #1a0a2e 0%, #12081f 45%, #06030c 100%)",
    expBg: "radial-gradient(120% 100% at 50% 0%, #22103d 0%, #12081f 55%, #06030c 100%)",
    gold: "#FFE156", rose: "#FF2E92", accent2: "#00F0FF", ink: "#FDFBFF",
    swatch: ["#1a0a2e", "#FFE156", "#FF2E92"],
  },
  ivory: {
    label: "Classic Ivory",
    bg: "radial-gradient(120% 100% at 50% -10%, #2c2620 0%, #1c1712 45%, #0e0b08 100%)",
    expBg: "radial-gradient(120% 100% at 50% 0%, #362f26 0%, #1c1712 55%, #0e0b08 100%)",
    gold: "#D8C79A", rose: "#E3A98F", accent2: "#B9C9A9", ink: "#F7F2E7",
    swatch: ["#2c2620", "#D8C79A", "#E3A98F"],
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

export const FRAMES = {
  circle: { label: "Circle" },
  rounded: { label: "Rounded" },
  heart: { label: "Heart" },
};

export const RELATIONS = {
  sister: {
    label: "Sister", icon: "👧", theme: "roseGold", particles: "mixed", frame: "rounded",
    intro: "Your sister has a surprise for you",
    defaultMessage: "You've been my partner in mischief since forever, and watching you grow into who you are is one of my favorite things. Here's to more inside jokes and late-night talks. Happy birthday, sis! 🎂💕",
  },
  brother: {
    label: "Brother", icon: "🧑", theme: "ocean", particles: "mixed", frame: "rounded",
    intro: "Your brother has a surprise for you",
    defaultMessage: "Through everything, you've had my back — and I've got yours. Here's to another year of giving each other grief and having the best time doing it. Happy birthday, bro! 🎉",
  },
  girlfriend: {
    label: "Girlfriend", icon: "💖", theme: "midnight", particles: "hearts", frame: "heart",
    intro: "Someone who adores you has a surprise",
    defaultMessage: "Every day with you feels like a little bit of magic I didn't know I needed. Today's about celebrating the person who makes my ordinary days extraordinary. I love you more than words can hold. Happy birthday, my love. 💖✨",
  },
  boyfriend: {
    label: "Boyfriend", icon: "💙", theme: "galaxy", particles: "hearts", frame: "heart",
    intro: "Someone who adores you has a surprise",
    defaultMessage: "You make even the quiet, ordinary moments feel like something worth remembering. Today I just want you to know how much you mean to me — happy birthday to the person who has my whole heart. 💙",
  },
  mom: {
    label: "Mom", icon: "🌸", theme: "pastel", particles: "stars", frame: "rounded",
    intro: "The person who raised you has a surprise",
    defaultMessage: "Everything good in me, I owe to you. Thank you for every sacrifice, every late night, every ounce of love you never had to explain — just gave. Happy birthday, Mom. I love you endlessly. 🌸",
  },
  dad: {
    label: "Dad", icon: "🎩", theme: "ivory", particles: "stars", frame: "rounded",
    intro: "The person who raised you has a surprise",
    defaultMessage: "You taught me more by example than you ever did by words, and I notice it more every year. Thank you for everything you've given up so I could have more. Happy birthday, Dad. 🎩",
  },
  friend: {
    label: "Friend", icon: "🎉", theme: "neon", particles: "confetti", frame: "circle",
    intro: "A friend has a surprise for you",
    defaultMessage: "Not everyone gets a friend like you — someone who shows up, tells the truth, and makes even bad days better. So glad I get to call you mine. Happy birthday! 🎉",
  },
  relative: {
    label: "Relative", icon: "🎁", theme: "golden", particles: "confetti", frame: "circle",
    intro: "Family has a surprise for you",
    defaultMessage: "Family like you doesn't come around often — thank you for every memory, every gathering made better just by you being there. Wishing you the happiest of birthdays. 🎁",
  },
  junior: {
    label: "Junior", icon: "⭐", theme: "ocean", particles: "stars", frame: "circle",
    intro: "Someone special has a surprise for you",
    defaultMessage: "Watching you grow and take on the world has been one of the best things to witness. Keep going — you're doing better than you know. Happy birthday! ⭐",
  },
  senior: {
    label: "Senior", icon: "🏵️", theme: "ivory", particles: "stars", frame: "circle",
    intro: "Someone special has a surprise for you",
    defaultMessage: "Your experience, your wisdom, and the way you've shaped things for the rest of us doesn't go unnoticed. Thank you for everything. Happy birthday. 🏵️",
  },
  general: {
    label: "Just because", icon: "🎂", theme: "midnight", particles: "confetti", frame: "circle",
    intro: "Someone has a special surprise for you",
    defaultMessage: "Another year of you — and the world is lighter for it. I hope today hands you every small joy you didn't even know to wish for, and that this next year surprises you in all the best ways. Happy birthday! 🎂✨",
  },
};

export function relationOf(settings) {
  return RELATIONS[settings?.relation] || RELATIONS.general;
}

export const DEFAULT_SETTINGS = {
  theme: "midnight", intensity: "balanced", pacing: "cinematic", particles: "confetti",
  interactive: true, relation: "general", frame: "circle",
};

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
