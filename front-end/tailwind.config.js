/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],

  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },

    extend: {
      colors: {
        primary: {
          DEFAULT: "#bf3a2b",        // Couleur principale Caterly
          foreground: "#ffffff",
          50: "#fdf2f0",
          100: "#fae6e2",
          200: "#f5c9c1",
          300: "#ef9f8f",
          400: "#e76d5a",
          500: "#bf3a2b",
          600: "#a32f23",
          700: "#87261d",
          800: "#6b1e18",
          900: "#4f1612",
          950: "#2c0b09",
        },

        secondary: {
          DEFAULT: "#f39c12",        // Orange doré Caterly
          foreground: "#ffffff",
        },

        accent: {
          DEFAULT: "#f39c12",
          foreground: "#1f2937",
        },

        background: {
          DEFAULT: "#fff8f2",        // Fond clair Caterly
          dark: "#1f1413",           // Fond sombre Caterly
        },

        foreground: {
          DEFAULT: "#333333",        // Texte principal neutre
          dark: "#f5f5f5",
        },

        card: {
          DEFAULT: "#ffffff",
          dark: "#2a1e1d",
        },
        "card-foreground": {
          DEFAULT: "#333333",
          dark: "#f5f5f5",
        },

        popover: {
          DEFAULT: "#ffffff",
          dark: "#2a1e1d",
        },
        "popover-foreground": {
          DEFAULT: "#333333",
          dark: "#f5f5f5",
        },

        muted: {
          DEFAULT: "#f8f1eb",
          foreground: "#6b5e5a",
        },
        "muted-foreground": "#8c7f7a",

        border: "#e8d9d0",
        input: "#e8d9d0",
        ring: "#bf3a2b",             // Primary color

        destructive: {
          DEFAULT: "#ef4444",
          foreground: "#ffffff",
        },

        surface: "#fff8f2",
        "surface-dark": "#1f1413",
      },

      borderRadius: {
        DEFAULT: "8px",
        sm: "6px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "20px",
        full: "9999px",
      },

      fontFamily: {
        display: ["Rubik", "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },

      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },

      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.4s ease-out forwards",
      },
    },
  },

  plugins: [require("tailwindcss-animate")],
}