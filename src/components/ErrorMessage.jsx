import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw } from "lucide-react";

export const ErrorMessage = ({ message, onRetry }) => {
  return (
    <motion.div
      className="glassmorphism rounded-3xl p-8 text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        animate={{
          rotate: [-5, 5, -5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="inline-block mb-4"
      >
        <div className="p-4 bg-red-500/20 rounded-full">
          <AlertTriangle className="w-12 h-12 text-red-400" />
        </div>
      </motion.div>

      <h3 className="text-2xl font-bold text-white mb-4">
        Oops! Something went wrong
      </h3>

      <p className="text-white/70 mb-6 text-lg">{message}</p>

      {onRetry && (
        <motion.button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-2xl text-white font-semibold transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RefreshCw className="w-5 h-5" />
          Try Again
        </motion.button>
      )}
    </motion.div>
  );
};
