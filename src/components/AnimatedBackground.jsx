import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const FloatingParticle = ({ delay, duration, size, color }) => (
  <motion.div
    className={`floating-particle ${color} opacity-60`}
    style={{
      width: `${size}px`,
      height: `${size}px`,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
    }}
    animate={{
      y: [-20, -60, -20],
      x: [-10, 10, -10],
      opacity: [0.3, 0.8, 0.3],
      scale: [1, 1.2, 1],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

const InteractiveOrb = ({ index }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <motion.div
      className={`absolute w-32 h-32 rounded-full blur-xl opacity-40`}
      style={{
        background: `conic-gradient(from ${index * 60}deg, #3b82f6, #8b5cf6, #ec4899, #f59e0b, #3b82f6)`,
        left: `${20 + index * 25}%`,
        top: `${30 + index * 20}%`,
      }}
      animate={{
        x: mousePos.x * (0.5 + index * 0.2),
        y: mousePos.y * (0.5 + index * 0.2),
        rotate: 360,
      }}
      transition={{
        x: { type: "spring", stiffness: 50, damping: 30 },
        y: { type: "spring", stiffness: 50, damping: 30 },
        rotate: { duration: 20, repeat: Infinity, ease: "linear" },
      }}
    />
  );
};

export const AnimatedBackground = () => {
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    delay: i * 0.5,
    duration: 6 + Math.random() * 4,
    size: 4 + Math.random() * 8,
    color: ["bg-blue-400", "bg-purple-400", "bg-pink-400", "bg-indigo-400"][
      Math.floor(Math.random() * 4)
    ],
  }));

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
        style={{
          backgroundSize: "400% 400%",
        }}
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Interactive orbs */}
      {[0, 1, 2].map((index) => (
        <InteractiveOrb key={index} index={index} />
      ))}

      {/* Floating particles */}
      {particles.map((particle) => (
        <FloatingParticle
          key={particle.id}
          delay={particle.delay}
          duration={particle.duration}
          size={particle.size}
          color={particle.color}
        />
      ))}

      {/* Animated mesh gradient overlay */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(236, 72, 153, 0.3) 0%, transparent 50%)",
        }}
        animate={{
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};
