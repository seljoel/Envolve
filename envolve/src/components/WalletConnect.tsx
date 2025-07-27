'use client';
import { useWeb3 } from '../../contexts/Web3Provider';

export default function WalletConnect() {
  const { address, connectWallet, disconnectWallet } = useWeb3();

  return (
    <div className="flex items-center gap-2">
      {address ? (
        <>
          <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium">
            {`${address.slice(0, 6)}...${address.slice(-4)}`}
          </span>
          <button
            onClick={disconnectWallet}
            className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Disconnect
          </button>
        </>
      ) : (
        <button
          onClick={connectWallet}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}