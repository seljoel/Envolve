import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";

// Export reusable client
export const alchemyClient = createPublicClient({
  chain: sepolia,
  transport: http(process.env.NEXT_PUBLIC_ALCHEMY_SEPOLIA_URL) // Use env variable
});

// Example usage (remove in production)
// const block = await alchemyClient.getBlock({ blockNumber: 123456n });