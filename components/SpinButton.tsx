"use client";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface SpinButtonProps {
  onClick: () => void;
  disabled: boolean;
  mode: "free" | "onchain";
}

export function SpinButton({ onClick, disabled, mode }: SpinButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className={cn(
        "relative px-16 py-6 text-3xl font-black rounded-full transition-all duration-300",
        "bg-gradient-to-b from-red-500 via-red-600 to-red-700",
        "hover:from-red-600 hover:via-red-700 hover:to-red-800",
        "shadow-[0_10px_30px_rgba(239,68,68,0.5)]",
        "border-4 border-yellow-400",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "transform-gpu",
      )}
      style={{
        boxShadow: disabled
          ? "0 10px 30px rgba(239,68,68,0.3)"
          : "0 10px 30px rgba(239,68,68,0.6), inset 0 -4px 8px rgba(0,0,0,0.3), inset 0 4px 8px rgba(255,255,255,0.2)",
      }}
    >
      {/* Shine Effect */}
      {!disabled && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 rounded-full"
          animate={{
            x: ["-100%", "200%"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 1,
          }}
        />
      )}

      {/* Button Content */}
      <div className="relative z-10 flex items-center gap-3">
        {disabled ? (
          <>
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-wider">
              SPINNING
            </span>
          </>
        ) : (
          <>
            <span className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-wider">
              SPIN
            </span>
            <span className="text-4xl">
              {mode === "onchain" ? "⛓️" : "🎮"}
            </span>
          </>
        )}
      </div>

      {/* Pulsing Ring */}
      {!disabled && (
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-yellow-300"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.2, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />
      )}
    </motion.button>
  );
}
