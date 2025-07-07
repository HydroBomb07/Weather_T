/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        gradient: "gradient 15s ease infinite",
        float: "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "slide-up": "slide-up 0.6s ease-out",
        "fade-in": "fade-in 0.8s ease-out",
        "bounce-soft": "bounce-soft 2s ease-in-out infinite",
        "spin-slow": "spin 3s linear infinite",
        "text-shimmer": "text-shimmer 2.5s ease-in-out infinite",
        "cursor-trail": "cursor-trail 0.5s ease-out forwards",
      },
      keyframes: {
        gradient: {
          "0%, 100%": {
            "background-position": "0% 50%",
          },
          "50%": {
            "background-position": "100% 50%",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "pulse-glow": {
          "0%, 100%": {
            boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
            transform: "scale(1)",
          },
          "50%": {
            boxShadow: "0 0 40px rgba(59, 130, 246, 0.8)",
            transform: "scale(1.05)",
          },
        },
        "slide-up": {
          from: {
            opacity: "0",
            transform: "translateY(30px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "bounce-soft": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "text-shimmer": {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        "cursor-trail": {
          "0%": {
            transform: "scale(1) rotate(0deg)",
            opacity: "1",
          },
          "100%": {
            transform: "scale(0) rotate(180deg)",
            opacity: "0",
          },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "text-shimmer":
          "linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)",
      },
      backdropBlur: {
        xs: "2px",
      },
      colors: {
        glass: "rgba(255, 255, 255, 0.1)",
        "glass-hover": "rgba(255, 255, 255, 0.2)",
      },
    },
  },
  plugins: [],
};
