import { http, createStorage } from 'wagmi';
import { mainnet, sepolia, hardhat } from 'wagmi/chains';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  walletConnectWallet,
  metaMaskWallet,
  baseAccount,
  phantomWallet,
  injectedWallet,
  coinbaseWallet,
} from '@rainbow-me/rainbowkit/wallets';

// Replace with your actual WalletConnect project ID
const projectId = '19b9affa00d25ce0e7496d3600fa4630';

// TOGGLE THIS FOR TESTING:
// true = remember wallet connection (default)
// false = disconnect on refresh/rebuild
const ENABLE_PERSISTENCE = true;

const noopStorage = {
  getItem: (_key: string) => null,
  setItem: (_key: string, _value: string) => { },
  removeItem: (_key: string) => { },
};

// Singleton pattern to prevent re-initialization during HMR
declare global {
  var wagmiConfig: ReturnType<typeof getDefaultConfig> | undefined;
}

if (!global.wagmiConfig) {
  global.wagmiConfig = getDefaultConfig({
    appName: 'DeFi Sentinel',
    appDescription: 'Your security shield in the world of DeFi',
    appUrl: 'http://localhost:3000',
    appIcon: 'https://avatars.githubusercontent.com/u/105455110?s=200&v=4',
    projectId: projectId,
    chains: [mainnet, sepolia, hardhat],
    transports: {
      [mainnet.id]: http(),
      [sepolia.id]: http(),
      [hardhat.id]: http(),
    },
    wallets: [{
      groupName: 'Recommended',
      wallets: [
        injectedWallet,
        metaMaskWallet,
        phantomWallet,
        coinbaseWallet,
        walletConnectWallet,
      ],
    }],
    storage: createStorage({
      storage: ENABLE_PERSISTENCE && typeof window !== 'undefined'
        ? window.localStorage
        : noopStorage,
    }),
    ssr: true,
  });
}

export const config = global.wagmiConfig;

