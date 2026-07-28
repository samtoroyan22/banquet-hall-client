import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}", // Next.js 13/15 app router
    "./pages/**/*.{ts,tsx}", // если есть pages
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        "primary-dark": "var(--primary-dark)",
        foreground: "var(--foreground)",
        background: "var(--background)",
        card: "var(--card)",
        "card-foreground": "var(--card-foreground)",
        // добавь остальные цвета при необходимости
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },
    },
  },
  darkMode: "class", // включаем dark mode через класс .dark
  plugins: [],
};

export default config;
