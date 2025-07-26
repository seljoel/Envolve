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
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY! // Add your Etherscan API key
    }
  },
  sourcify: {
    enabled: true // Enable Sourcify verification
  },
  typechain: {
    outDir: 'types',
    target: 'ethers-v6'
  }
};

export default config;