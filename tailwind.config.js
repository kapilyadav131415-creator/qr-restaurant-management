export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
   theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        card: "var(--card)",
        border: "var(--border)",

        primary: "var(--primary)",
        "primary-hover": "var(--primary-hover)",

        accent: "var(--accent)",
        "accent-hover": "var(--accent-hover)",

        success: "var(--success)",
        warning: "var(--warning)",
        danger: "var(--danger)",
        info: "var(--info)",

        textPrimary: "var(--text-primary)",
        textSecondary: "var(--text-secondary)",
      },
    },
  },
  plugins: [],
}