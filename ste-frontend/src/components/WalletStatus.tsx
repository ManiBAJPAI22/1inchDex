'use client';

import { useWalletConnection } from '@/hooks/useWalletConnection';
import { formatNumber, shortenAddress } from '@/lib/utils';
import { Wallet, Check, AlertCircle, RefreshCw } from 'lucide-react';
import ConstantProvider from '@/utils/constantProvider';
import toast from 'react-hot-toast';
import { useAccount } from 'wagmi';

/**
 * Example component demonstrating wagmi integration
 * Shows wallet connection status, address, balance, and network
 */
export function WalletStatus() {
  const { isConnected, address, balance, chainId, switchChain } = useWalletConnection();
  const { chain } = useAccount();

  if (!isConnected) {
    return (
      <div className="bg-dark-800 rounded-lg p-4 border border-dark-700">
        <div className="flex items-center space-x-3 text-dark-400">
          <Wallet size={20} />
          <span>Wallet not connected</span>
        </div>
      </div>
    );
  }

  const isCorrectNetwork = chainId === ConstantProvider.NETWORK_CHAIN_ID;

  const handleNetworkSwitch = async () => {
    try {
      toast.loading('Switching network...');
      await switchChain({ chainId: ConstantProvider.NETWORK_CHAIN_ID });
      toast.success('Network switched successfully!');
    } catch (error) {
      console.error('Failed to switch network:', error);
      toast.error('Failed to switch network. Please try again.');
    }
  };

  return (
    <div className="bg-dark-800 rounded-lg p-4 border border-dark-700">
      <div className="space-y-3">
        {/* Connection Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-dark-300">Status</span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-green-500">Connected</span>
          </div>
        </div>

        {/* Address */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-dark-300">Address</span>
          <span className="text-sm text-white font-mono">{shortenAddress(address || '')}</span>
        </div>

        {/* Balance */}
        {balance && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-dark-300">Balance</span>
            <span className="text-sm text-white font-medium">
              {formatNumber(parseFloat(balance.formatted), 4)} {balance.symbol}
            </span>
          </div>
        )}

        {/* Network */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-dark-300">Network</span>
          <div className="flex items-center space-x-2">
            {isCorrectNetwork ? (
              <>
                <Check size={14} className="text-green-500" />
                <span className="text-sm text-white">{chain?.name || `Chain ${chainId}`}</span>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <AlertCircle size={14} className="text-yellow-500" />
                <span className="text-sm text-yellow-500">
                  Wrong Network ({chain?.name || `Chain ${chainId}`})
                </span>
                <button
                  onClick={handleNetworkSwitch}
                  className="flex items-center space-x-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
                >
                  <RefreshCw size={12} />
                  <span>Switch</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
