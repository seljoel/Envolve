import { ethers, network, run } from "hardhat";

async function main() {
  // ========== CONFIGURATION ==========
  const DEPLOYER_INDEX = 0; // First account from getSigners()
  const CONFIRMATIONS = 2; // Blocks to wait for confirmation

  // ========== DEPLOYMENT ==========
  console.log(`\nDeploying to ${network.name}...`);

  const [deployer] = await ethers.getSigners();
  console.log(`Using deployer: ${deployer.address}`);
  console.log(`Balance: ${ethers.formatEther(await deployer.provider.getBalance(deployer.address))} ETH`);

  console.log("\n1. Deploying EnvolveNFT contract...");
  const EnvolveNFT = await ethers.getContractFactory("EnvolveNFT");
  const nft = await EnvolveNFT.deploy();
  
  const deploymentTx = nft.deploymentTransaction();
  console.log(`\nTransaction hash: ${deploymentTx?.hash}`);
  console.log(`Waiting for ${CONFIRMATIONS} confirmations...`);
  
  // Correct way to wait for confirmations
  if (deploymentTx) {
    await deploymentTx.wait(CONFIRMATIONS);
  }
  
  const contractAddress = await nft.getAddress();
  console.log(`\n✅ EnvolveNFT deployed to: ${contractAddress}`);
  console.log(`🔗 Explorer: ${getExplorerLink(network.name, contractAddress)}`);

  // ========== VERIFICATION ==========
  console.log("\n2. Verifying contract...");
  try {
    // Wait 30 seconds for Etherscan to index
    await new Promise(resolve => setTimeout(resolve, 30000));
    
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: [],
    });
    console.log("✅ Contract verified");
  } catch (error) {
    console.error("Verification failed:", error instanceof Error ? error.message : error);
  }

  // ========== POST-DEPLOYMENT ==========
  console.log("\n3. Deployment completed!");
  console.log("\nNext steps:");
  console.log(`- Set up frontend to interact with: ${contractAddress}`);
  console.log(`- Initialize contract with initial settings`);
}

// Helper function to get explorer link
function getExplorerLink(networkName: string, address: string): string {
  const explorers: Record<string, string> = {
    mainnet: "https://etherscan.io",
    sepolia: "https://sepolia.etherscan.io",
    goerli: "https://goerli.etherscan.io",
    polygon: "https://polygonscan.com",
    mumbai: "https://mumbai.polygonscan.com",
    arbitrum: "https://arbiscan.io",
    optimism: "https://optimistic.etherscan.io"
  };
  return `${explorers[networkName] || "https://etherscan.io"}/address/${address}`;
}

main().catch((error) => {
  console.error("\n❌ Deployment failed:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
});