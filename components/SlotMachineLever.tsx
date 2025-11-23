"use client";

import { motion } from "framer-motion";

interface SlotMachineLeverProps {
  isSpinning: boolean;
  onPull: () => void;
  disabled: boolean;
}

export function SlotMachineLever({ isSpinning, onPull, disabled }: SlotMachineLeverProps) {
  return (
    <div className="absolute -right-8 top-1/2 -translate-y-1/2 z-20">
      <button
        onClick={onPull}
        disabled={disabled}
        className="group relative cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Pull lever to spin"
      >
        {/* Lever Handle (Ball) and Arm */}
        <motion.div
          animate={{
            y: isSpinning ? 60 : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
          }}
          className="relative"
        >
          {/* Ball/Knob */}
          <div
            className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 via-red-600 to-red-700 shadow-lg border-2 border-gray-800 group-hover:scale-110 group-disabled:group-hover:scale-100 transition-transform relative"
            style={{
              boxShadow: '0 0 0 3px #FCFF52, 0 4px 12px rgba(239,68,68,0.5), inset 0 -2px 4px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.2)'
            }}
          >
            {/* Shine effect on ball */}
            <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full opacity-40" />
          </div>

          {/* Lever Arm */}
          <div className="absolute top-12 left-1/2 -translate-x-1/2 w-2 h-16 bg-gradient-to-b from-gray-600 to-gray-800 rounded-full border border-gray-900 shadow-md" />

          {/* Base connector */}
          <div className="absolute top-28 left-1/2 -translate-x-1/2 w-6 h-4 bg-gray-800 rounded-sm border border-gray-900 shadow-sm" />
        </motion.div>

        {/* Pull instruction (subtle) */}
        {!isSpinning && !disabled && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-700 whitespace-nowrap"
          >
            PULL
          </motion.div>
        )}
      </button>
    </div>
  );
}
