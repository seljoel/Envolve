import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import 'dotenv/config';

const config: HardhatUserConfig = {
  solidity: '0.8.20',
  networks: {
    sepolia: {
      url: process.env.ALCHEMY_SEPOLIA_URL!,
      accounts: [process.env.DEPLOYER_PRIVATE_KEY!]
    }
  },
  typechain: {
    outDir: 'types',
    target: 'ethers-v6'
  }
};

export default config;