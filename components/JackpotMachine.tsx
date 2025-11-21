"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface JackpotMachineProps {
  isSpinning: boolean;
  finalValue?: number;
  onSpinComplete?: () => void;
}

// Symboles crypto avec valeurs basées sur Market Cap (Nov 2025)
// Logos depuis CoinGecko API
const CRYPTO_SYMBOLS = [
  {
    id: "bitcoin",
    name: "BTC",
    value: 1000,
    color: "#F7931A",
    logo: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png",
    rank: 1
  },
  {
    id: "ethereum",
    name: "ETH",
    value: 500,
    color: "#627EEA",
    logo: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
    rank: 2
  },
  {
    id: "ripple",
    name: "XRP",
    value: 250,
    color: "#23292F",
    logo: "https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png",
    rank: 3
  },
  {
    id: "binancecoin",
    name: "BNB",
    value: 100,
    color: "#F3BA2F",
    logo: "https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png",
    rank: 4
  },
  {
    id: "solana",
    name: "SOL",
    value: 50,
    color: "#14F195",
    logo: "https://assets.coingecko.com/coins/images/4128/small/solana.png",
    rank: 5
  },
  {
    id: "celo",
    name: "CELO",
    value: 25,
    color: "#FBCC5C",
    logo: "https://assets.coingecko.com/coins/images/11090/small/InjXBNx9_400x400.jpg",
    rank: 6
  },
  {
    id: "dogecoin",
    name: "DOGE",
    value: 10,
    color: "#C2A633",
    logo: "https://assets.coingecko.com/coins/images/5/small/dogecoin.png",
    rank: 7
  },
  {
    id: "miss",
    name: "MISS",
    value: 0,
    color: "#EF4444",
    logo: "",
    rank: 8
  },
];

export function JackpotMachine({ isSpinning, finalValue, onSpinComplete }: JackpotMachineProps) {
  const [reel1, setReel1] = useState(0);
  const [reel2, setReel2] = useState(1);
  const [reel3, setReel3] = useState(2);
  const [isSettling, setIsSettling] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isSpinning) {
      setIsSettling(false);
      // Spin rapide pendant le spinning
      interval = setInterval(() => {
        setReel1(Math.floor(Math.random() * CRYPTO_SYMBOLS.length));
        setReel2(Math.floor(Math.random() * CRYPTO_SYMBOLS.length));
        setReel3(Math.floor(Math.random() * CRYPTO_SYMBOLS.length));
      }, 100);
    } else if (finalValue !== undefined && !isSettling) {
      // Arrêt progressif
      setIsSettling(true);
      const symbolIndex = CRYPTO_SYMBOLS.findIndex(s => s.value === finalValue);
      const targetIndex = symbolIndex >= 0 ? symbolIndex : 7; // Default to MISS

      // Reel 1 stops first
      setTimeout(() => setReel1(targetIndex), 300);
      // Reel 2 stops second
      setTimeout(() => setReel2(targetIndex), 600);
      // Reel 3 stops last
      setTimeout(() => {
        setReel3(targetIndex);
        // Notify parent that spin is complete
        setTimeout(() => {
          if (onSpinComplete) onSpinComplete();
        }, 500);
      }, 900);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSpinning, finalValue, isSettling, onSpinComplete]);

  return (
    <div className="relative">
      {/* Machine Frame avec couleurs Celo */}
      <div className="bg-gradient-to-b from-[#FBCC5C] via-[#35D07F] to-[#FBCC5C] rounded-3xl p-6 shadow-2xl border-8 border-[#35D07F]">
        {/* Top Header avec branding Celo */}
        <div className="text-center mb-4">
          <div className="bg-gradient-to-r from-black via-gray-900 to-black rounded-t-3xl px-8 py-4 -mx-6 -mt-6 mb-6 border-4 border-[#FBCC5C]">
            <motion.h2
              className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FBCC5C] via-[#35D07F] to-[#FBCC5C] tracking-wider"
              animate={{
                backgroundPosition: isSpinning ? ["0% 50%", "100% 50%", "0% 50%"] : "0% 50%",
              }}
              transition={{
                duration: 2,
                repeat: isSpinning ? Infinity : 0,
              }}
              style={{
                backgroundSize: "200% 200%",
              }}
            >
              CRYPTO JACKPOT
            </motion.h2>
            <p className="text-[#35D07F] text-sm mt-2 font-semibold">Powered by Celo</p>
          </div>
        </div>

        {/* Lumières LED animées */}
        <div className="absolute top-0 left-0 right-0 h-3 flex justify-around px-4">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="w-4 h-4 rounded-full"
              style={{
                backgroundColor: i % 2 === 0 ? "#FBCC5C" : "#35D07F",
                boxShadow: `0 0 15px ${i % 2 === 0 ? "#FBCC5C" : "#35D07F"}`,
              }}
              animate={{
                opacity: isSpinning ? [1, 0.3, 1] : 1,
                scale: isSpinning ? [1, 1.2, 1] : 1,
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
        <div className="bg-gradient-to-b from-gray-900 to-black rounded-2xl p-8 shadow-inner border-4 border-[#FBCC5C]">
          <div className="grid grid-cols-3 gap-6">
            {/* Reel 1 */}
            <CryptoReel
              symbol={CRYPTO_SYMBOLS[reel1]}
              isSpinning={isSpinning}
              delay={0}
            />

            {/* Reel 2 */}
            <CryptoReel
              symbol={CRYPTO_SYMBOLS[reel2]}
              isSpinning={isSpinning}
              delay={0.15}
            />

            {/* Reel 3 */}
            <CryptoReel
              symbol={CRYPTO_SYMBOLS[reel3]}
              isSpinning={isSpinning}
              delay={0.3}
            />
          </div>
        </div>

        {/* Payout Line avec couleur Celo */}
        <div className="absolute left-8 right-8 top-1/2 h-1 bg-gradient-to-r from-transparent via-[#35D07F] to-transparent shadow-[0_0_20px_#35D07F] pointer-events-none" />

        {/* Bottom Lights */}
        <div className="absolute bottom-0 left-0 right-0 h-3 flex justify-around px-4">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="w-4 h-4 rounded-full"
              style={{
                backgroundColor: i % 2 === 0 ? "#35D07F" : "#FBCC5C",
                boxShadow: `0 0 15px ${i % 2 === 0 ? "#35D07F" : "#FBCC5C"}`,
              }}
              animate={{
                opacity: isSpinning ? [0.3, 1, 0.3] : 1,
                scale: isSpinning ? [1, 1.2, 1] : 1,
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

      {/* Side Decorations Celo colors */}
      <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-10 h-40 bg-gradient-to-r from-[#35D07F] to-[#FBCC5C] rounded-r-full shadow-xl" />
      <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-10 h-40 bg-gradient-to-l from-[#35D07F] to-[#FBCC5C] rounded-l-full shadow-xl" />
    </div>
  );
}

interface CryptoReelProps {
  symbol: typeof CRYPTO_SYMBOLS[0];
  isSpinning: boolean;
  delay: number;
}

function CryptoReel({ symbol, isSpinning, delay }: CryptoReelProps) {
  return (
    <div className="relative bg-white rounded-2xl p-6 shadow-2xl overflow-hidden border-4 border-[#35D07F]">
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
        {/* Logo Crypto */}
        <motion.div
          className="mb-4 relative w-24 h-24 flex items-center justify-center"
          style={{
            filter: isSpinning ? 'blur(3px)' : 'blur(0px)',
          }}
          animate={{
            scale: isSpinning ? [1, 0.95, 1] : [1, 1.1, 1],
          }}
          transition={{
            duration: isSpinning ? 0.2 : 2,
            repeat: isSpinning ? Infinity : Infinity,
          }}
        >
          {symbol.logo ? (
            <Image
              src={symbol.logo}
              alt={symbol.name}
              width={96}
              height={96}
              className="rounded-full"
              style={{
                boxShadow: `0 0 30px ${symbol.color}80`,
              }}
              unoptimized
            />
          ) : (
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-black text-white"
              style={{
                backgroundColor: symbol.color,
                boxShadow: `0 0 30px ${symbol.color}80`,
              }}
            >
              ✕
            </div>
          )}
        </motion.div>

        {/* Nom de la crypto */}
        <div
          className="text-sm font-bold px-3 py-1 rounded-full"
          style={{
            backgroundColor: `${symbol.color}20`,
            color: symbol.color,
            border: `2px solid ${symbol.color}`,
          }}
        >
          {symbol.name}
        </div>
      </motion.div>

      {/* Shine Effect */}
      {!isSpinning && (
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 100, opacity: [0, 0.5, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 pointer-events-none"
        />
      )}

      {/* Glow effect when not spinning */}
      {!isSpinning && (
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            boxShadow: `inset 0 0 30px ${symbol.color}30`,
          }}
          animate={{
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />
      )}
    </div>
  );
}
