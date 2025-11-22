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
      <div className="bg-gradient-to-r from-[#FCFF52]/30 to-gray-100 border-2 border-[#FCFF52] rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-gray-800" />
          <span className="font-mono text-sm font-semibold text-gray-800">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
        </div>
        <button
          onClick={() => disconnect()}
          className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-700 to-gray-800 border-2 border-[#FCFF52] rounded-lg p-4">
      <p className="text-sm mb-3 text-center text-white font-semibold">
        Connect your wallet to play on-chain
      </p>
      <div className="flex flex-col gap-2">
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            disabled={isPending}
            className={cn(
              "flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all text-gray-900",
              "bg-gradient-to-r from-[#FCFF52] to-yellow-300 hover:from-yellow-300 hover:to-[#FCFF52]",
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
