module.exports = {
  theme: {
    extend: {
      colors: {
        // Create theme variables that can be easily swapped
        primary: {
          DEFAULT: "var(--color-primary)",
          light: "var(--color-primary-light)",
          dark: "var(--color-primary-dark)",
        },
        secondary: {
          DEFAULT: "var(--color-secondary)",
          dark: "var(--color-secondary-dark)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          light: "var(--color-accent-light)",
        },
      },
      fontFamily: {
        sans: ["Poppins", "Helvetica", "Arial", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 6px -1px rgba(220, 38, 38, 0.1)",
      },
    },
  },
  plugins: [],
};
