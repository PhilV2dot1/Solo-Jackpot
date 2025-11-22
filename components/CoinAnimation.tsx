"use client";

import { motion } from "framer-motion";

export function CoinAnimation({ show }: { show: boolean }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          initial={{
            x: "50vw",
            y: "50vh",
            scale: 0,
            opacity: 1,
          }}
          animate={{
            x: `${Math.random() * 100}vw`,
            y: `${Math.random() * 100}vh`,
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1.5,
            delay: i * 0.15,
            ease: "easeOut",
          }}
          className="absolute text-3xl"
        >
          💰
        </motion.div>
      ))}
    </div>
  );
}
