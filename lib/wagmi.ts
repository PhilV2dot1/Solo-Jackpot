import { http, createConfig } from "wagmi";
import { celo, celoAlfajores } from "wagmi/chains";
import { injected } from "wagmi/connectors";

export const config = createConfig({
  chains: [celo, celoAlfajores],
  connectors: [
    injected({ shimDisconnect: true }),
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
