/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sonae: {
          primary: "#0f766e",
          accent: "#f59e0b",
          danger: "#dc2626",
          ground: "#fef9f2",
          ink: "#1f2937",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Hiragino Sans",
          "Hiragino Kaku Gothic ProN",
          "Noto Sans JP",
          "Yu Gothic",
          "Meiryo",
          "sans-serif",
        ],
      },
      fontSize: {
        "xs-jp": ["0.85rem", { lineHeight: "1.5" }],
        "base-jp": ["1.05rem", { lineHeight: "1.7" }],
        "lg-jp": ["1.2rem", { lineHeight: "1.7" }],
        "xl-jp": ["1.45rem", { lineHeight: "1.5" }],
        "2xl-jp": ["1.75rem", { lineHeight: "1.4" }],
        "3xl-jp": ["2.1rem", { lineHeight: "1.3" }],
      },
      borderRadius: {
        card: "1.25rem",
      },
      boxShadow: {
        soft: "0 6px 20px -8px rgba(15, 118, 110, 0.25)",
      },
    },
  },
  plugins: [],
};
