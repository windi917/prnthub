import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        primaryRegular: ["Regular"],
        primaryLight: ["Light"],
        primaryBold: ["Bold"],
      },
      keyframes: {
        "logo-cloud": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(calc(-100% - 4rem))" },
        },
        buttonheartbeat: {
          "0%": {
            "box-shadow": '0 0 0 0 theme("colors.lime.300")',
            transform: "scale(1)",
          },
          "50%": {
            "box-shadow": '0 0 0 7px theme("colors.lime.300/0")',
            transform: "scale(1.05)",
          },
          "100%": {
            "box-shadow": '0 0 0 0 theme("colors.lime.300/0")',
            transform: "scale(1)",
          },
        },
      },
      animation: {
        "logo-cloud": "logo-cloud 30s linear infinite",
        buttonheartbeat: "buttonheartbeat 2s infinite ease-in-out",
      },
      colors: {
        textclr: "#F2F2F2",
        textclr2: "#CCF869",
        btnhover: "#BBE759",
        btnbg: "#CCF869",
        bg: "#0D0D0D",
        primary: "#CCF869",
        secondary: "#CCF869",
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["dark"],
  },
};
