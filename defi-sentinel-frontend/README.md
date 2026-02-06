# DeFi Sentinel Frontend

A professional DeFi risk management and analysis platform with premium UI, wallet integration, and on-chain badge NFT system.

## Features

- **Protocol Hub**: Comprehensive risk ratings and analytics for DeFi protocols
- **Rating System**: AAA to D rating system based on multi-factor risk analysis
- **Strategy Center**: Cross-protocol yield strategies with step-by-step guides
- **Research Hub**: Premium analysis and educational content
- **Game Center**: Interactive DeFi quizzes with on-chain badge NFT rewards
- **Membership System**: USDC-based subscriptions with on-chain verification
- **Badge NFT System**: Soulbound ERC-1155 badges for achievements

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Wallet Integration**: RainbowKit, Wagmi v2, Viem
- **State Management**: React Context, TanStack Query
- **Charts**: Recharts

## Project Structure

```
frontend/
├── app/                          # Next.js App Router
│   ├── protocols/                # Protocol directory and detail pages
│   ├── strategies/               # Yield strategies dashboard
│   ├── research/                 # Research Hub (Academy)
│   ├── game/                     # DeFi Journey (Quizzes + NFT minting)
│   │   ├── page.tsx              # Game dashboard
│   │   └── [id]/page.tsx         # Quiz page with minting
│   ├── membership/               # User account and badges
│   │   ├── page.tsx              # Membership status page
│   │   └── components/           # Badge system, popup, status card
│   ├── components/               # Shared components
│   │   ├── GlobalHeader.tsx      # Navigation with wallet connect
│   │   └── SubscriptionModal.tsx # Membership upgrade flow
│   └── providers.tsx             # RainbowKit, Wagmi, Query providers
├── lib/                          # Utilities and API clients
│   ├── api.ts                    # Backend API integration
│   ├── constants.ts              # Contract addresses and badge IDs
│   ├── wagmi.ts                  # Wallet configuration
│   └── abis/                     # Smart contract ABIs
├── context/                      # React Context providers
│   └── MembershipContext.tsx     # Membership state management
└── public/
    ├── images/badges/            # Badge images
    └── metadata/                 # Badge NFT metadata
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- MetaMask or other Web3 wallet

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Configuration

### Contract Addresses

Update contract addresses in `lib/constants.ts`:

```typescript
export const CONTRACTS = {
  BadgeNFT: '0x...',
  PaymentContract: '0x...',
  USDC: '0x...'
};
```

### Badge IDs

```typescript
export const BADGE_IDS = {
  EARLY_ADOPTER: 1001,
  DEFI_NOVICE: 2001,
  DEFI_INTERMEDIATE: 2002,
  DEFI_HARD: 2003,
  RISK_GUARDIAN: 2004,
  PRO_MEMBER: 3001,
  SENTINEL_ELITE: 3002,
  SCHOLAR: 4001,
  EXPLORER: 4002
};
```

### Wallet Configuration

RainbowKit and Wagmi are configured in `lib/wagmi.ts`. Supported networks:
- Ethereum Mainnet
- Sepolia Testnet
- Hardhat Local

## Key Features

### Membership System

1. User connects wallet
2. Clicks "Upgrade to Pro" to open subscription modal
3. Selects plan (Monthly $9.90 or Yearly $99.90 USDC)
4. Approves USDC and confirms transaction
5. Backend listener syncs membership status
6. Pro Member badge (3001) auto-minted

### Game Center

1. Complete DeFi quizzes (Easy → Medium → Hard)
2. Take Risk Assessment personality test
3. Click "Mint NFT" to mint achievement badge
4. Badge popup celebration on successful mint

### Wallet Disconnect

The app properly disconnects all connected wallets and clears storage on logout.

## API Integration

The frontend connects to the backend API at `api.defisentinel.org`, modify the constants.ts if you deployed your own backend:

```typescript
export const API_BASE_URL = 'https://api.defisentinel.org'; // this use a real backend deployed on a vps
//export const API_BASE_URL = 'http://localhost:4000'; // this use your local backend
```

## License

MIT

---

**Last Updated:** Feb 6, 2026
