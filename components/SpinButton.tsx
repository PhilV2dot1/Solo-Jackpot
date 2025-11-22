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
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      className={cn(
        "relative px-12 py-4 text-2xl font-black rounded-full transition-all duration-200",
        "bg-gradient-to-b from-red-500 via-red-600 to-red-700",
        "hover:from-red-600 hover:via-red-700 hover:to-red-800",
        "shadow-[0_6px_20px_rgba(239,68,68,0.5)]",
        "border-2 border-yellow-400",
        "disabled:opacity-50 disabled:cursor-not-allowed",
      )}
      style={{
        boxShadow: disabled
          ? "0 6px 20px rgba(239,68,68,0.3)"
          : "0 6px 20px rgba(239,68,68,0.5), inset 0 -2px 4px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.2)",
      }}
    >
      {/* Shine Effect simplifié */}
      {!disabled && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-10 rounded-full"
          animate={{
            x: ["-100%", "200%"],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 2,
          }}
        />
      )}

      {/* Button Content */}
      <div className="relative z-10 flex items-center gap-2">
        {disabled ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              SPINNING
            </span>
          </>
        ) : (
          <>
            <span className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              SPIN
            </span>
            <span className="text-2xl">
              {mode === "onchain" ? "⛓️" : "🎮"}
            </span>
          </>
        )}
      </div>
    </motion.button>
  );
}
