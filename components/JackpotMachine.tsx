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
      {/* Machine Frame simplifiée - Mobile optimized */}
      <div className="bg-gradient-to-b from-[#FBCC5C] via-[#35D07F] to-[#FBCC5C] rounded-2xl p-3 shadow-xl border-2 border-[#35D07F]">
        {/* Reels Container */}
        <div className="bg-gradient-to-b from-gray-900 to-black rounded-xl p-4 shadow-inner border-2 border-[#FBCC5C]">
          <div className="grid grid-cols-3 gap-3">
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

        {/* Payout Line - Simplifié */}
        <div className="absolute left-4 right-4 top-1/2 h-0.5 bg-gradient-to-r from-transparent via-[#35D07F] to-transparent opacity-60 pointer-events-none" />
      </div>
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
    <div className="relative bg-white rounded-xl p-3 shadow-lg overflow-hidden border-2 border-[#35D07F]">
      <motion.div
        animate={{
          y: isSpinning ? [0, -300, -600, -900, -1200] : 0,
        }}
        transition={{
          duration: isSpinning ? 0.8 : 0.3,
          repeat: isSpinning ? Infinity : 0,
          delay: delay,
          ease: isSpinning ? "linear" : "easeOut",
        }}
        className="flex flex-col items-center justify-center"
      >
        {/* Logo Crypto - Taille réduite pour mobile */}
        <motion.div
          className="mb-2 relative w-16 h-16 flex items-center justify-center"
          style={{
            filter: isSpinning ? 'blur(4px)' : 'blur(0px)',
            opacity: isSpinning ? 0.8 : 1,
          }}
          animate={{
            scale: isSpinning ? [1, 0.9, 1] : [1, 1.1, 1],
            rotate: isSpinning ? [0, -5, 5, 0] : 0,
          }}
          transition={{
            duration: isSpinning ? 0.15 : 0.8,
            repeat: isSpinning ? Infinity : 1,
            ease: "easeInOut",
          }}
        >
          {symbol.logo ? (
            <Image
              src={symbol.logo}
              alt={symbol.name}
              width={64}
              height={64}
              className="rounded-full"
              style={{
                boxShadow: `0 0 20px ${symbol.color}60`,
              }}
              unoptimized
            />
          ) : (
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black text-white"
              style={{
                backgroundColor: symbol.color,
                boxShadow: `0 0 20px ${symbol.color}60`,
              }}
            >
              ✕
            </div>
          )}
        </motion.div>

        {/* Nom de la crypto */}
        <div
          className="text-xs font-bold px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: `${symbol.color}20`,
            color: symbol.color,
            border: `1px solid ${symbol.color}`,
          }}
        >
          {symbol.name}
        </div>
      </motion.div>

      {/* Shine Effect simplifié - seulement si pas en train de spinner */}
      {!isSpinning && (
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 100, opacity: [0, 0.3, 0] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }}
          className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 pointer-events-none"
        />
      )}
    </div>
  );
}
