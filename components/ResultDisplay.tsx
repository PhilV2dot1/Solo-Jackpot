"use client";

import { motion } from "framer-motion";
import { Trophy, Star, Sparkles, Zap } from "lucide-react";
import { CoinAnimation } from "./CoinAnimation";
import { useState, useEffect } from "react";

export interface GameResult {
  score: number;
  isJackpot: boolean;
  badge?: string;
  collectible?: string;
}

interface ResultDisplayProps {
  result: GameResult;
}

export function ResultDisplay({ result }: ResultDisplayProps) {
  const [showCoins, setShowCoins] = useState(false);

  useEffect(() => {
    if (result.score > 0) {
      setShowCoins(true);
      const timer = setTimeout(() => setShowCoins(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [result]);

  return (
    <>
      <CoinAnimation show={showCoins} />

      <motion.div
        initial={{ scale: 0, rotate: -180, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
        className={cn(
          "relative rounded-3xl p-8 text-center shadow-2xl border-4 overflow-hidden",
          result.isJackpot
            ? "bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 border-yellow-300"
            : result.score > 0
            ? "bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 border-green-300"
            : "bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 border-gray-500"
        )}
      >
        {/* Animated Background */}
        {result.isJackpot && (
          <motion.div
            className="absolute inset-0 opacity-30"
            animate={{
              background: [
                "radial-gradient(circle, rgba(255,215,0,0.3) 0%, transparent 70%)",
                "radial-gradient(circle, transparent 0%, rgba(255,215,0,0.3) 70%)",
              ],
            }}
            transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
          />
        )}

        {/* Content */}
        <div className="relative z-10">
          {result.isJackpot && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
              className="mb-4 flex justify-center"
            >
              <Sparkles className="w-20 h-20 text-yellow-200" />
            </motion.div>
          )}

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-black mb-4 drop-shadow-lg"
          >
            {result.isJackpot
              ? "🎰 JACKPOT! 🎰"
              : result.score > 0
              ? "🎉 WINNER! 🎉"
              : "😔 Better Luck Next Time"}
          </motion.div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="flex items-center justify-center gap-3 my-6"
          >
            {result.score > 0 ? (
              <Trophy className="w-12 h-12 text-yellow-200" />
            ) : (
              <Zap className="w-12 h-12 text-gray-400" />
            )}
            <span
              className={cn(
                "text-7xl font-black drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]",
                result.score > 0 ? "text-yellow-100" : "text-gray-300"
              )}
            >
              {result.score}
            </span>
            {result.score > 0 && (
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
              >
                <Star className="w-12 h-12 text-yellow-200 fill-yellow-200" />
              </motion.div>
            )}
          </motion.div>

          {result.badge && (
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl p-4 border-2 border-white/30"
            >
              <Star className="w-6 h-6 text-yellow-300 fill-yellow-300" />
              <span className="font-bold text-xl">Badge: {result.badge}</span>
            </motion.div>
          )}

          {result.collectible && (
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-3 text-lg font-semibold bg-white/10 rounded-lg p-3"
            >
              🎁 Collected: {result.collectible}
            </motion.div>
          )}
        </div>

        {/* Sparkles for wins */}
        {result.score > 0 && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-3xl"
                initial={{
                  x: "50%",
                  y: "50%",
                  scale: 0,
                  opacity: 0,
                }}
                animate={{
                  x: `${50 + (Math.cos((i * Math.PI * 2) / 8) * 40)}%`,
                  y: `${50 + (Math.sin((i * Math.PI * 2) / 8) * 40)}%`,
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.1,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
              >
                ✨
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
