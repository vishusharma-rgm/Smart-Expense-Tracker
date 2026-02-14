
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",

  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        background: "#F9FAFB",
        border: "#E5E7EB",
        textPrimary: "#0F172A",
        textMuted: "#64748B",
        accent: "#111827"
      }
    }
  },
  plugins: []
};
