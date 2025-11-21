"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface JackpotMachineProps {
  isSpinning: boolean;
  finalValue?: number;
}

const SYMBOLS = [
  { emoji: "🍒", value: 10, color: "#FF6B6B" },
  { emoji: "🍋", value: 25, color: "#FFE66D" },
  { emoji: "🍊", value: 50, color: "#FFA500" },
  { emoji: "🍇", value: 100, color: "#AA96DA" },
  { emoji: "💎", value: 250, color: "#4ECDC4" },
  { emoji: "⭐", value: 500, color: "#FFD700" },
  { emoji: "7️⃣", value: 1000, color: "#FF0000" },
  { emoji: "💀", value: 0, color: "#666" },
];

export function JackpotMachine({ isSpinning, finalValue }: JackpotMachineProps) {
  const [reel1, setReel1] = useState(0);
  const [reel2, setReel2] = useState(1);
  const [reel3, setReel3] = useState(2);

  useEffect(() => {
    if (isSpinning) {
      const interval = setInterval(() => {
        setReel1(Math.floor(Math.random() * SYMBOLS.length));
        setReel2(Math.floor(Math.random() * SYMBOLS.length));
        setReel3(Math.floor(Math.random() * SYMBOLS.length));
      }, 100);

      return () => clearInterval(interval);
    } else if (finalValue !== undefined) {
      // Set final symbols based on the value
      const symbolIndex = SYMBOLS.findIndex(s => s.value === finalValue) || 0;
      setTimeout(() => {
        setReel1(symbolIndex);
        setReel2(symbolIndex);
        setReel3(symbolIndex);
      }, 500);
    }
  }, [isSpinning, finalValue]);

  return (
    <div className="relative">
      {/* Machine Frame */}
      <div className="bg-gradient-to-b from-yellow-600 via-yellow-500 to-yellow-700 rounded-3xl p-6 shadow-2xl border-8 border-yellow-400">
        {/* Top Header */}
        <div className="text-center mb-4">
          <div className="bg-gradient-to-r from-blue-900 via-blue-700 to-blue-900 rounded-t-3xl px-8 py-4 -mx-6 -mt-6 mb-6 border-4 border-yellow-400">
            <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-100 to-yellow-300 tracking-wider drop-shadow-[0_0_20px_rgba(255,215,0,0.8)]">
              JACKPOT
            </h2>
          </div>
        </div>

        {/* Lights Around Machine */}
        <div className="absolute top-0 left-0 right-0 h-2 flex justify-around px-4">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_#ff0000]"
              animate={{
                opacity: isSpinning ? [1, 0.3, 1] : 1,
              }}
              transition={{
                duration: 0.5,
                repeat: isSpinning ? Infinity : 0,
                delay: i * 0.1,
              }}
            />
          ))}
        </div>

        {/* Reels Container */}
        <div className="bg-gradient-to-b from-gray-900 to-black rounded-2xl p-6 shadow-inner border-4 border-yellow-600">
          <div className="grid grid-cols-3 gap-4">
            {/* Reel 1 */}
            <Reel symbol={SYMBOLS[reel1]} isSpinning={isSpinning} delay={0} />

            {/* Reel 2 */}
            <Reel symbol={SYMBOLS[reel2]} isSpinning={isSpinning} delay={0.2} />

            {/* Reel 3 */}
            <Reel symbol={SYMBOLS[reel3]} isSpinning={isSpinning} delay={0.4} />
          </div>
        </div>

        {/* Payout Line */}
        <div className="absolute left-8 right-8 top-1/2 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_10px_#ff0000] pointer-events-none" />

        {/* Bottom Lights */}
        <div className="absolute bottom-0 left-0 right-0 h-2 flex justify-around px-4">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="w-3 h-3 rounded-full bg-yellow-400 shadow-[0_0_10px_#ffd700]"
              animate={{
                opacity: isSpinning ? [0.3, 1, 0.3] : 1,
              }}
              transition={{
                duration: 0.5,
                repeat: isSpinning ? Infinity : 0,
                delay: i * 0.1,
              }}
            />
          ))}
        </div>
      </div>

      {/* Side Decorations */}
      <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-8 h-32 bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-r-full shadow-lg" />
      <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-8 h-32 bg-gradient-to-l from-yellow-600 to-yellow-400 rounded-l-full shadow-lg" />
    </div>
  );
}

interface ReelProps {
  symbol: typeof SYMBOLS[0];
  isSpinning: boolean;
  delay: number;
}

function Reel({ symbol, isSpinning, delay }: ReelProps) {
  return (
    <div className="relative bg-white rounded-xl p-4 shadow-inner overflow-hidden border-4 border-yellow-700">
      <motion.div
        animate={{
          y: isSpinning ? [-100, 0] : 0,
        }}
        transition={{
          duration: 0.1,
          repeat: isSpinning ? Infinity : 0,
          delay: delay,
        }}
        className="flex flex-col items-center justify-center"
      >
        <div
          className="text-7xl drop-shadow-lg"
          style={{
            filter: isSpinning ? 'blur(2px)' : 'blur(0px)',
            transition: 'filter 0.3s',
          }}
        >
          {symbol.emoji}
        </div>
      </motion.div>

      {/* Shine Effect */}
      {!isSpinning && (
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 100, opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 pointer-events-none"
        />
      )}
    </div>
  );
}
