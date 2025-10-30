import { http, createConfig } from 'wagmi';
import { monadTestnet, polygon } from 'wagmi/chains';
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors';

// Get WalletConnect project ID from environment variable
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '';

export const config = createConfig({
  chains: [monadTestnet, polygon],
  connectors: [
    injected({
      target: 'metaMask',
    }),
    walletConnect({
      projectId,
      metadata: {
        name: 'SkyTrade Exchange',
        description: 'Decentralized crypto trading on Monad Network',
        url: 'https://skytrade.exchange',
        icons: ['https://skytrade.exchange/icon.png'],
      },
      showQrModal: true,
    }),
    coinbaseWallet({
      appName: 'SkyTrade Exchange',
      appLogoUrl: 'https://skytrade.exchange/icon.png',
    }),
  ],
  transports: {
    [monadTestnet.id]: http(),
    [polygon.id]: http(),
  },
});

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}
