import { ethers } from "hardhat";
import dotenv from "dotenv";
dotenv.config();

async function main() {
  // 1. Set up provider and wallet
  const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_SEPOLIA_URL!);
  const deployerWallet = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY!, provider);
  
  const recipientAddress = deployerWallet.address; // For testing - replace with actual user address in production
  console.log(`Minting to recipient: ${recipientAddress}`);

  // 2. Contract setup
  const contractAddress = "0x5850684F930E917222b40324414f0f9DaF847BFe";
  const abi = [
    "function safeMint(address to, string memory uri) public",
    "function balanceOf(address owner) public view returns (uint256)"
  ];

  // 3. IPFS URIs from Pinata
  const tokenURIs = [
    "ipfs://QmYvxEW9ucfwdfMoegq2xeBZRgLgFEBUFmKGoDM5goAEzk/stage0.json", // Replace with actual IPFS URIs
    "ipfs://QmanKKUpaA7ouDW4UvdpV56s1zQhdBPJYWY5deg7rfF9mU/stage1.json",
    "ipfs://QmfF5WpuHjkEPqXSRijCv5A84UMLVX4Uz9thPTyoZt3oU8/stage2.json"
  ];

  // 4. Create contract instance
  const contract = new ethers.Contract(contractAddress, abi, deployerWallet);

  // 5. Mint NFTs
  for (const [index, uri] of tokenURIs.entries()) {
    console.log(`\nMinting NFT #${index + 1} with URI: ${uri}`);
    
    // Get fee data (replaces getGasPrice)
    const feeData = await provider.getFeeData();
    console.log(`Current gas price: ${ethers.formatUnits(feeData.gasPrice!, "gwei")} gwei`);
    
    // Estimate gas
    const gasEstimate = await contract.safeMint.estimateGas(
      recipientAddress, 
      uri
    );
    const cost = ethers.formatUnits(gasEstimate * feeData.gasPrice!, "ether");
    console.log(`Estimated gas: ${gasEstimate.toString()} (${cost} ETH)`);
    
    // Execute mint with gas price from feeData
    const tx = await contract.safeMint(recipientAddress, uri, {
      gasPrice: feeData.gasPrice
    });
    console.log(`Transaction sent: ${tx.hash}`);
    
    // Wait for confirmation
    const receipt = await tx.wait();
    console.log(`Confirmed in block: ${receipt?.blockNumber}`);
    
    // Verify ownership
    const balance = await contract.balanceOf(recipientAddress);
    console.log(`✅ New balance: ${balance.toString()} NFTs`);
  }
}

main().catch((error) => {
  console.error("Minting failed:", error);
  process.exitCode = 1;
});