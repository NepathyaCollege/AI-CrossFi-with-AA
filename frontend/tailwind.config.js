/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#E4742A", //  primary color
        secondary: "#0E55A4", //  secondary color
        background: {
          primary: "#000000", // Primary background color
          secondary: "#1C1C1E", // Secondary background color
          tertiary: "#2C2C2E", // Tertiary background color
        },
        text: {
          textfield1: "#3D4444", // Text color 1
          textfield2: "#a7a7a8", // Text color 2
        },
      },
    },
  },
};
