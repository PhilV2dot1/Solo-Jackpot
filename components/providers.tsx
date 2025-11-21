"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { config } from "@/lib/wagmi";
import { useEffect, useState } from "react";
import sdk from "@farcaster/miniapp-sdk";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        await sdk.actions.ready();
        setIsSDKLoaded(true);
      } catch (error) {
        console.error("Failed to load Farcaster SDK:", error);
        setIsSDKLoaded(true); // Continue anyway for testing outside Farcaster
      }
    };
    load();
  }, []);

  if (!isSDKLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
