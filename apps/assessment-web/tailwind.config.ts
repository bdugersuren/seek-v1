import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        background: "var(--seek-color-background)",
        foreground: "var(--seek-color-foreground)",
        surface: {
          DEFAULT: "var(--seek-color-surface)",
          hover: "var(--seek-color-surface-hover)",
        },
        border: {
          DEFAULT: "var(--seek-color-border)",
          hover: "var(--seek-color-border-hover)",
        },
        primary: {
          DEFAULT: "var(--seek-color-primary)",
          hover: "var(--seek-color-primary-hover)",
          foreground: "var(--seek-color-primary-foreground)",
        },
        muted: {
          DEFAULT: "var(--seek-color-muted)",
          background: "var(--seek-color-muted-background)",
        },
        success: {
          DEFAULT: "var(--seek-color-success)",
          background: "var(--seek-color-success-background)",
          foreground: "var(--seek-color-success-foreground)",
        },
        danger: {
          DEFAULT: "var(--seek-color-danger)",
          background: "var(--seek-color-danger-background)",
          foreground: "var(--seek-color-danger-foreground)",
        },
        warning: {
          DEFAULT: "var(--seek-color-warning)",
          background: "var(--seek-color-warning-background)",
          foreground: "var(--seek-color-warning-foreground)",
        },
      },
      spacing: {
        "seek-1": "var(--seek-space-1)",
        "seek-2": "var(--seek-space-2)",
        "seek-3": "var(--seek-space-3)",
        "seek-4": "var(--seek-space-4)",
        "seek-5": "var(--seek-space-5)",
        "seek-6": "var(--seek-space-6)",
        "seek-8": "var(--seek-space-8)",
        "seek-10": "var(--seek-space-10)",
        "seek-12": "var(--seek-space-12)",
        "seek-16": "var(--seek-space-16)",
      },
      borderRadius: {
        "seek-sm": "var(--seek-radius-sm)",
        "seek-md": "var(--seek-radius-md)",
        "seek-lg": "var(--seek-radius-lg)",
        "seek-xl": "var(--seek-radius-xl)",
        "seek-2xl": "var(--seek-radius-2xl)",
      },
      fontFamily: {
        sans: "var(--seek-font-sans)",
        mono: "var(--seek-font-mono)",
      },
      zIndex: {
        header: "var(--seek-z-header)",
        sidebar: "var(--seek-z-sidebar)",
        dropdown: "var(--seek-z-dropdown)",
        modal: "var(--seek-z-modal)",
        toast: "var(--seek-z-toast)",
      },
    },
  },
  plugins: [],
};
export default config;
