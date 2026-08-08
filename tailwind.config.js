/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        night: "#0b0510",
        plum: "#170a20",
        plumLight: "#241033",
        ink: "#F3E9EF",
        muted: "#B79DBE",
        mutedDim: "#8b7691",
        gold: "#E7B65C",
        goldDeep: "#d99a3c",
        rose: "#FF7A9C",
        danger: "#c14b63",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      boxShadow: {
        glow: "0 20px 60px rgba(0,0,0,0.45)",
        seal: "0 10px 24px rgba(231,182,92,0.28)",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(14px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        fallDown: {
          "0%": { transform: "translateY(0) translateX(0) rotate(0deg)", opacity: 0 },
          "10%": { opacity: 1 },
          "100%": { transform: "translateY(460px) translateX(var(--drift)) rotate(var(--rot))", opacity: 0 },
        },
        floatUp: {
          "0%": { transform: "translateY(0) translateX(0)", opacity: 0 },
          "10%": { opacity: 0.9 },
          "100%": { transform: "translateY(-480px) translateX(var(--drift))", opacity: 0 },
        },
        drift: {
          "0%, 100%": { transform: "translate(0,0)" },
          "50%": { transform: "translate(14px,-18px)" },
        },
      },
      animation: {
        fadeUp: "fadeUp .7s ease both",
        fallDown: "fallDown linear infinite",
        floatUp: "floatUp ease-in infinite",
        drift: "drift 9s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
