/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: "#F5B301",
        goldDark: "#D99A00",
        ink: "#141414",
        cloud: "#F6F6F4",
        graytext: "#6B6B66",
        // warm dark-mode surfaces (page → section → card, lightest last)
        darkbg: "#1A1712",
        darksurface: "#221E17",
        darkcard: "#2A251C",
        // aliases so earlier component references still resolve
        honey: "#F5B301",
        rust: "#D99A00",
        hive: "#141414",
        wax: "#FFFFFF",
        clover: "#3E7C4A",
        navy: "#141414",
        sand: "#F6F6F4",
        amber: "#F5B301",
        teal: "#141414",
        charcoal: "#141414",
        cream: "#FFFFFF",
      },
      fontFamily: {
        display: ["var(--font-jakarta)", "sans-serif"],
        body: ["var(--font-jakarta)", "sans-serif"],
        mono: ["var(--font-jakarta)", "sans-serif"],
      },
      boxShadow: {
        card: "0 8px 30px rgba(20, 20, 20, 0.08)",
        cardHover: "0 16px 40px rgba(20, 20, 20, 0.14)",
      },
      borderRadius: {
        stub: "14px",
      },
    },
  },
  plugins: [],
};
