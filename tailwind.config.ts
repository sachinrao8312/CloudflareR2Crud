import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontSize: {
        'xs': ['0.64rem', { lineHeight: '0.96rem' }], // 0.8 * 0.8rem
        'sm': ['0.8rem', { lineHeight: '1.12rem' }], // 0.8 * 1rem
        'base': ['1rem', { lineHeight: '1.36rem' }], // 0.8 * 1.25rem
        'lg': ['1.125rem', { lineHeight: '1.6rem' }], // 0.8 * 1.25rem
        'xl': ['1.25rem', { lineHeight: '1.8rem' }], // 0.8 * 1.5rem
        '2xl': ['1.5rem', { lineHeight: '2rem' }], // 0.8 * 1.875rem
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 0.8 * 2.25rem
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }], // 0.8 * 2.5rem
        '5xl': ['3rem', { lineHeight: '1' }], // 0.8 * 3.75rem
        '6xl': ['3.75rem', { lineHeight: '1' }], // 0.8 * 4.5rem
        '7xl': ['4.5rem', { lineHeight: '1' }], // 0.8 * 5.625rem
        '8xl': ['6rem', { lineHeight: '1' }], // 0.8 * 7.5rem
        '9xl': ['8rem', { lineHeight: '1' }], // 0.8 * 9rem
      },
    },
  },
  plugins: [],
};
export default config;
