"use client";
import { createConfig, WagmiProvider, http } from "wagmi";
import { sepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const config = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(process.env.NEXT_PUBLIC_ALCHEMY_SEPOLIA_URL!),
  },
});

export function Web3Provider({ children }: { children: React.ReactNode }) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={new QueryClient()}>
                {children}
            </QueryClientProvider>
        </WagmiProvider>
    );
}

// Removed custom http functions as we use wagmi's http transport now.
