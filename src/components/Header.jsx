import React from "react";
import { motion } from "framer-motion";
import { CloudSun, ToggleLeft, ToggleRight } from "lucide-react";

export const Header = ({ unit, onToggleUnit }) => {
  const textVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: "easeOut",
      },
    },
  };

  const iconVariants = {
    hidden: { rotate: -180, scale: 0 },
    visible: {
      rotate: 0,
      scale: 1,
      transition: {
        duration: 1,
        ease: "easeOut",
        delay: 0.3,
      },
    },
  };

  return (
    <motion.header
      className="text-center mb-12"
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center justify-center gap-4 mb-6">
        <motion.div
          variants={iconVariants}
          animate={{
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          <CloudSun className="w-16 h-16 text-blue-300" />
        </motion.div>

        <motion.h1 variants={textVariants} className="text-6xl font-bold">
          <motion.span
            className="text-gradient text-shimmer"
            style={{
              backgroundImage:
                "linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899, #f59e0b, #3b82f6)",
              backgroundSize: "200% 100%",
            }}
            animate={{
              backgroundPosition: ["0% 50%", "200% 50%", "0% 50%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            WeatherLux
          </motion.span>
        </motion.h1>
      </div>

      <motion.p
        variants={textVariants}
        transition={{ delay: 0.5 }}
        className="text-xl text-white/80 mb-8 font-light"
      >
        Experience weather like never before with stunning visuals and real-time
        data
      </motion.p>

      {/* Unit Toggle */}
      <motion.div
        className="flex items-center justify-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <span
          className={`text-sm font-medium transition-colors ${unit === "metric" ? "text-white" : "text-white/50"}`}
        >
          Celsius
        </span>

        <motion.button
          onClick={onToggleUnit}
          className="p-1"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {unit === "metric" ? (
            <ToggleLeft className="w-8 h-8 text-blue-400" />
          ) : (
            <ToggleRight className="w-8 h-8 text-blue-400" />
          )}
        </motion.button>

        <span
          className={`text-sm font-medium transition-colors ${unit === "imperial" ? "text-white" : "text-white/50"}`}
        >
          Fahrenheit
        </span>
      </motion.div>
    </motion.header>
  );
};
