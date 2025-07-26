import { ethers, network } from "hardhat";

async function main() {
  // Log network info
  console.log("Using network:", network.name);
  
  // Get signers
  const [owner1, owner2, owner3, owner4] = await ethers.getSigners();
  console.log("Deployer address:", owner1.address);

  // Deploy contract
  const EnvolveNFT = await ethers.getContractFactory("EnvolveNFT");
  console.log("Deploying EnvolveNFT...");
  
  const nft = await EnvolveNFT.deploy(
    "ipfs://QmYvxEW9ucfwdfMoegq2xeBZRgLgFEBUFmKGoDM5goAEzk/stage0.json", // Replace with actual IPFS URIs
    "ipfs://QmanKKUpaA7ouDW4UvdpV56s1zQhdBPJYWY5deg7rfF9mU/stage1.json",
    "ipfs://QmfF5WpuHjkEPqXSRijCv5A84UMLVX4Uz9thPTyoZt3oU8/stage2.json"
  );

  // Wait for deployment confirmation
  await nft.waitForDeployment();
  
  // Get the contract address
  console.log(`Deployed to: ${await nft.getAddress()}`);
  console.log(`Explorer: https://sepolia.etherscan.io/address/${await nft.getAddress()}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});