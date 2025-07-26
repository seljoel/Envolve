import { ethers } from "hardhat";

async function main() {
  const [owner1, owner2, owner3, owner4] = await ethers.getSigners();
  
  const EnvolveNFT = await ethers.getContractFactory("EnvolveNFT");
  const nft = await EnvolveNFT.deploy([
    owner1.address, 
    owner2.address,
    owner3.address,
    owner4.address
  ]);

  console.log(`Deployed to: ${nft.address}`);
}