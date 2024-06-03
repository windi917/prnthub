import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "true",
  theme: {
    backdropFilter: {
      none: "none",
      blur: "blur(20px)",
    },
    extend: {
      fontFamily: {
        primaryRegular: ["Regular"],
        primaryLight: ["Light"],
        primaryBold: ["Bold"],
      },
      colors: {
        textclr: "#F2F2F2",
        textclr2: "#CCF869",
        btnhover: "#BBE759",
        btnbg: "#CCF869",
        bg: "#0D0D0D",
        primary: "#CCF869",
        secondary: "#CCF869",
        // accent: "#32e9d4",
        // text: "#071307",
        // background: "#effaf0",
        // primary: "#4fc951",
        // secondary: "#d3f2ea",
        // accent: "#64abcf",
      },
    },
  },
  plugins: [daisyui],
  animation: [],
};
