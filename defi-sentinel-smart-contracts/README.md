# DeFi Sentinel Smart Contracts

Smart contract infrastructure for the DeFi Sentinel platform - Badge NFT (ERC-1155 Soulbound) and USDC Membership Payment system.

## Structure

```
smart-contracts/
├── contracts/                    # Solidity smart contracts
│   ├── BadgeNFT.sol              # ERC-1155 Soulbound Badge NFT
│   ├── PaymentContract.sol       # USDC Membership Payment Contract
│   └── MockERC20.sol             # Mock USDC for testing
├── scripts/                      # Deployment and utility scripts
│   ├── deploy.js                 # Main deployment script
│   ├── mint_mock_usdc.js         # Mint test tokens
│   └── withdraw.js               # Withdraw collected fees
├── test/                         # Contract tests
│   ├── BadgeNFT.test.js          # BadgeNFT test suite
│   └── PaymentContract.test.js   # PaymentContract test suite
├── address.txt                   # Deployed contract addresses
├── hardhat.config.js             # Hardhat configuration
└── README.md
```

## Setup

### Prerequisites

- Node.js v18+
- npm or yarn

### Installation

```bash
npm install
```

## Development

### Compile Contracts

```bash
npx hardhat compile
```

### Run Tests

```bash
npx hardhat test
```

### Deploy

```bash
# Deploy to local network
npx hardhat run scripts/deploy.js

# Deploy to Sepolia testnet
npx hardhat run scripts/deploy.js --network sepolia

# Deploy to mainnet
npx hardhat run scripts/deploy.js --network mainnet
```

### Environment Variables (.env)

```
PRIVATE_KEY=your_private_key
USDC_ADDRESS=0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48  # Mainnet USDC
MONTHLY_FEE=9900000   # 9.9 USDC (6 decimals)
YEARLY_FEE=99900000   # 99.9 USDC (6 decimals)
MAINNET_RPC_URL=https://mainnet.infura.io/v3/YOUR_KEY
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
ETHERSCAN_API_KEY=your_etherscan_api_key
```

## Smart Contracts

### 1. BadgeNFT (ERC-1155 Soulbound)

Soulbound (non-transferable) achievement badges for the DeFi Sentinel platform.

**Badge IDs:**

| ID | Name | Type | Price |
|----|------|------|-------|
| 1001 | Early Adopter | Auto-mint | Free (first 1000 members) |
| 2001 | DeFi Novice | Game | 0.001 ETH |
| 2002 | DeFi Intermediate | Game | 0.001 ETH |
| 2003 | DeFi Master | Game | 0.001 ETH |
| 2004 | Risk Guardian | Game | 0.001 ETH |
| 3001 | Pro Member | Membership | Free (auto-minted) |
| 3002 | Sentinel Elite | Membership | Free (auto-minted) |
| 4001 | Scholar | Activity | 0.001 ETH |
| 4002 | Explorer | Activity | 0.001 ETH |

**Key Functions:**
- `mintBadge(uint256 badgeId)`: Mint a badge (paid badges require ETH)
- `mintMembershipBadge(address user, uint256 badgeId)`: Auto-mint membership badges (PaymentContract only)
- `hasBadge(address user, uint256 badgeId)`: Check if user has a badge
- `setBadgePrice(uint256 badgeId, uint256 priceWei)`: Set badge price (owner only)
- `setBaseURI(string memory baseURI_)`: Set metadata base URI (owner only)
- `uri(uint256 badgeId)`: Get metadata URI for a badge

**Features:**
- Soulbound (non-transferable after mint)
- Early Adopter cap (1000 max)
- Price-based minting for paid badges
- PaymentContract integration for auto-mint
- Configurable metadata URIs

**Events:**
- `BadgeMinted(address indexed user, uint256 indexed badgeId)`

### 2. PaymentContract

Handles USDC membership payments and auto-mints membership badges.

**Key Functions:**
- `payMembership(uint256 months)`: Pay for membership subscription
- `withdrawUSDC(address to)`: Withdraw collected USDC (owner only)
- `setMonthlyFee(uint256 fee)`: Update monthly fee (owner only)
- `setYearlyFee(uint256 fee)`: Update yearly fee (owner only)
- `getTotalMembers()`: Get total unique members
- `getTotalFeesCollected()`: Get total USDC collected

**Payment Logic:**
```
cost = (months / 12) * yearlyFee + (months % 12) * monthlyFee
```

**Auto-minting:**
- First payment: Pro Member badge (3001)
- 12+ months payment: Sentinel Elite badge (3002)
- First 1000 members: Early Adopter badge (1001)

**Events:**
- `MembershipPurchased(address indexed user, uint256 months, uint256 amount)`

## Post-Deployment

After deploying contracts, update these files with new addresses:

1. **Frontend**: `defi-sentinel-frontend/lib/constants.ts`
2. **Backend**: `defi-sentinel-backend/src/listeners.ts`
3. **Record**: `address.txt` (auto-updated by deploy script)

### Set Badge Metadata

```javascript
// Set base URI for all badges
await badgeNFT.setBaseURI("https://your-domain.com/metadata/");
// Results in: https://your-domain.com/metadata/1001.json

// Or set individual URIs
await badgeNFT.setTokenURI(1001, "ipfs://QmHash/1001.json");
```

## Networks

| Network | Chain ID | USDC Address |
|---------|----------|--------------|
| Localhost | 31337 | MockERC20 |
| Sepolia | 11155111 | 0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238 |
| Mainnet | 1 | 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48 |

## Utility Scripts

### Mint Mock USDC
```bash
npx hardhat run scripts/mint_mock_usdc.js --network sepolia
```

### Withdraw Collected Fees
```bash
npx hardhat run scripts/withdraw.js --network sepolia
```

## Security Considerations

- All contracts follow OpenZeppelin standards
- Soulbound badges cannot be transferred
- Owner-only functions protected by `onlyOwner` modifier
- PaymentContract is the only authorized minter for membership badges
- USDC approval required before payment

## Testing

```bash
# Run all tests
npx hardhat test

# Run with gas reporting
REPORT_GAS=true npx hardhat test

# Run specific test file
npx hardhat test test/BadgeNFT.test.js
```

## License

MIT

---

**Last Updated:** December 29, 2024
