import { useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useBalance, useSwitchChain } from 'wagmi';
import { useAppDispatch } from '@/store/hooks';
import { connectWallet, disconnectWallet, updateBalance } from '@/store/slices/walletSlice';
import { formatEther } from 'viem';
import ConstantProvider from '@/utils/constantProvider';
import toast from 'react-hot-toast';

export function useWalletConnection() {
  const dispatch = useAppDispatch();
  const { address, isConnected, chainId, chain } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();

  const { data: balanceData } = useBalance({
    address: address,
  });

  // Sync wagmi state with Redux
  useEffect(() => {
    if (isConnected && address && chainId) {
      dispatch(
        connectWallet({
          address,
          chainId,
        })
      );
    } else {
      dispatch(disconnectWallet());
    }
  }, [isConnected, address, chainId, dispatch]);

  // Update balance in Redux when it changes
  useEffect(() => {
    if (balanceData) {
      dispatch(updateBalance(formatEther(balanceData.value)));
    }
  }, [balanceData, dispatch]);

  // Auto-switch to correct network when user connects
  useEffect(() => {
    const handleNetworkSwitch = async () => {
      if (isConnected && chainId && chainId !== ConstantProvider.NETWORK_CHAIN_ID) {
        try {
          console.log(`Switching from chain ${chainId} to ${ConstantProvider.NETWORK_CHAIN_ID}`);
          toast.loading('Switching to correct network...');

          await switchChain({ chainId: ConstantProvider.NETWORK_CHAIN_ID });

          toast.success('Network switched successfully!');
        } catch (error) {
          console.error('Failed to switch network:', error);
          toast.error('Failed to switch network. Please switch manually.');
        }
      }
    };

    handleNetworkSwitch();
  }, [isConnected, chainId, switchChain]);

  return {
    address,
    isConnected,
    chainId,
    balance: balanceData,
    connect,
    disconnect,
    switchChain,
    connectors,
  };
}
