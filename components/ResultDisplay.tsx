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
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.3,
        }}
        className={cn(
          "relative rounded-2xl p-4 text-center shadow-xl border-2 overflow-hidden",
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
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
              className="mb-2 flex justify-center"
            >
              <Sparkles className="w-12 h-12 text-yellow-200" />
            </motion.div>
          )}

          <div className="text-2xl font-black mb-2 drop-shadow-lg">
            {result.isJackpot
              ? "🎰 JACKPOT!"
              : result.score > 0
              ? "🎉 WIN!"
              : "Try Again"}
          </div>

          <div className="flex items-center justify-center gap-2 my-3">
            {result.score > 0 ? (
              <Trophy className="w-8 h-8 text-yellow-200" />
            ) : (
              <Zap className="w-8 h-8 text-gray-400" />
            )}
            <span
              className={cn(
                "text-5xl font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]",
                result.score > 0 ? "text-yellow-100" : "text-gray-300"
              )}
            >
              {result.score}
            </span>
            {result.score > 0 && (
              <Star className="w-8 h-8 text-yellow-200 fill-yellow-200" />
            )}
          </div>

          {result.badge && (
            <div className="mt-3 flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg p-2 border border-white/30">
              <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
              <span className="font-bold text-sm">Badge: {result.badge}</span>
            </div>
          )}

          {result.collectible && (
            <div className="mt-2 text-sm font-semibold bg-white/10 rounded-lg p-2">
              🎁 {result.collectible}
            </div>
          )}
        </div>

        {/* Sparkles for wins - Réduit pour mobile */}
        {result.score > 0 && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl"
                initial={{
                  x: "50%",
                  y: "50%",
                  scale: 0,
                  opacity: 0,
                }}
                animate={{
                  x: `${50 + (Math.cos((i * Math.PI * 2) / 3) * 30)}%`,
                  y: `${50 + (Math.sin((i * Math.PI * 2) / 3) * 30)}%`,
                  scale: [0, 1, 0],
                  opacity: [0, 0.8, 0],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.2,
                  repeat: Infinity,
                  repeatDelay: 3,
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
