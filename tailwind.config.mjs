// tailwind.config.mjs ou tailwind.config.js
/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "system-ui", "sans-serif"],
      },
      colors: {
        "ella-navy": "var(--color-ella-navy)",
        "ella-gold": "var(--color-ella-gold)",
        "ella-background": "var(--color-ella-background)",
        "ella-card": "var(--color-ella-card)",
        "ella-muted": "var(--color-ella-muted)",
        "ella-text": "var(--color-ella-text)",
        "ella-subtile": "var(--color-ella-subtile)",
      },
    },
  },
  plugins: [],
};

export default config;
