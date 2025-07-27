'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { BrowserProvider, JsonRpcSigner, ethers } from 'ethers';

type Web3ContextType = {
  provider: BrowserProvider | null;
  signer: JsonRpcSigner | null;
  address: string;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  chainId: string | null;
};

const Web3Context = createContext<Web3ContextType>({} as Web3ContextType);

declare global {
  interface Window {
    ethereum?: any;
  }
}

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [address, setAddress] = useState('');
  const [chainId, setChainId] = useState<string | null>(null);

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        const web3Provider = new BrowserProvider(window.ethereum);
        const web3Signer = await web3Provider.getSigner();
        const network = await web3Provider.getNetwork();
        
        setProvider(web3Provider);
        setSigner(web3Signer);
        setAddress(accounts[0]);
        setChainId(network.chainId.toString());
        
        sessionStorage.setItem('walletConnected', 'true');
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setAddress('');
    setChainId(null);
    sessionStorage.removeItem('walletConnected');
  };

  useEffect(() => {
    if (sessionStorage.getItem('walletConnected') && window.ethereum) {
      connectWallet();
    }

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        setAddress(accounts[0]);
      }
    };

    const handleChainChanged = (newChainId: string) => {
      window.location.reload();
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  return (
    <Web3Context.Provider value={{ provider, signer, address, connectWallet, disconnectWallet, chainId }}>
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  return useContext(Web3Context);
}