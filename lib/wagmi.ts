import { http, createConfig } from "wagmi";
import { celo, celoAlfajores } from "wagmi/chains";
import { injected } from "wagmi/connectors";
import { farcasterMiniApp } from "@farcaster/miniapp-wagmi-connector";

export const config = createConfig({
  chains: [celo, celoAlfajores],
  connectors: [
    farcasterMiniApp(), // Farcaster Mini App connector (priority)
    injected({ shimDisconnect: true }), // Fallback for non-Farcaster browsers
  ],
  transports: {
    [celo.id]: http(),
    [celoAlfajores.id]: http(),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
