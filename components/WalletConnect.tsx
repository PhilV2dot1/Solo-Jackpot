"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Wallet, LogOut, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <div className="bg-green-500/20 border border-green-500 rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-green-400" />
          <span className="font-mono text-sm">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
        </div>
        <button
          onClick={() => disconnect()}
          className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-4">
      <p className="text-sm mb-3 text-center">
        Connect your wallet to play on-chain
      </p>
      <div className="flex flex-col gap-2">
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            disabled={isPending}
            className={cn(
              "flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all",
              "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Wallet className="w-5 h-5" />
                Connect {connector.name}
              </>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
