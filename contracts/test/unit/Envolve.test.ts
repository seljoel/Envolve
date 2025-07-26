import { expect } from "chai";
import { ethers } from "hardhat";

describe("EnvolveNFT", () => {
  it("Should initialize with 4 owners", async () => {
    const [owner1, owner2, owner3, owner4] = await ethers.getSigners();
    const EnvolveNFT = await ethers.getContractFactory("EnvolveNFT");
    const nft = await EnvolveNFT.deploy(
      [owner1.address, owner2.address, owner3.address, owner4.address]
    );
    
    expect(await nft.ownerOf(0)).to.equal(owner1.address);
  });
});