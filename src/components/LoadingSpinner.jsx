import React from "react";
import { motion } from "framer-motion";
import { Cloud, Sun, CloudRain } from "lucide-react";

const WeatherIcon = ({ Icon, delay }) => (
  <motion.div
    className="text-white/80"
    animate={{
      y: [-10, -25, -10],
      rotate: [0, 10, -10, 0],
      scale: [1, 1.2, 1],
    }}
    transition={{
      duration: 2,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  >
    <Icon size={32} />
  </motion.div>
);

const LoadingDot = ({ delay }) => (
  <motion.div
    className="w-3 h-3 bg-blue-400 rounded-full"
    animate={{
      scale: [1, 1.5, 1],
      opacity: [0.5, 1, 0.5],
    }}
    transition={{
      duration: 1.5,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

export const LoadingSpinner = () => {
  return (
    <motion.div
      className="glassmorphism rounded-3xl p-12 text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-center items-center gap-4 mb-8">
        <WeatherIcon Icon={Sun} delay={0} />
        <WeatherIcon Icon={Cloud} delay={0.3} />
        <WeatherIcon Icon={CloudRain} delay={0.6} />
      </div>

      <motion.h3
        className="text-2xl font-bold text-white mb-4"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Fetching Weather Data
      </motion.h3>

      <div className="flex justify-center items-center gap-2 mb-6">
        <LoadingDot delay={0} />
        <LoadingDot delay={0.2} />
        <LoadingDot delay={0.4} />
      </div>

      <motion.div
        className="w-24 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full mx-auto"
        animate={{
          x: [-50, 50, -50],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
};
