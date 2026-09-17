import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F8F7FF',
          100: '#EFEBFF',
          200: '#E4DFFE',
          300: '#C9BFFC',
          500: '#8B7AF7',
          600: '#7360E8',
          700: '#5B48C7',
          800: '#4635A6',
          900: '#322485',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#FBFBFE',
          subtle: '#F3F3F8',
          border: '#EEEEF4',
        },
        ink: {
          DEFAULT: '#232338',
          muted: '#8B8DA8',
          subtle: '#B5B7CC',
          dark: '#141424',
        },
        tag: {
          violet: '#F1EDFF',
          pink: '#FDEEF6',
          teal: '#E6FBEF',
          blue: '#E9F2FF',
          amber: '#FEF6E4',
          cyan: '#E0F7FA',
        }
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'Inter', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.02), 0 1px 2px rgba(0,0,0,0.04)',
        'float': '0 10px 30px -10px rgba(115, 96, 232, 0.15)',
        'glow': '0 0 20px rgba(115, 96, 232, 0.25)',
      }
    },
  },
  plugins: [],
};
export default config;
