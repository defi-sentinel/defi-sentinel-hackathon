# DeFi Sentinel Backend

Backend services for DeFi Sentinel platform, providing REST APIs, rating engine, blockchain event listeners, and database management.

## Structure

```
backend/
├── src/
│   ├── api/           # External API integrations (DefiLlama, etc.)
│   ├── db/            # Drizzle ORM schema and database connection
│   ├── rating/        # Rating engine logic
│   ├── abis/          # Smart contract ABIs for event listening
│   ├── listeners.ts   # Blockchain event listeners (WebSocket/Polling)
│   └── index.ts       # Express REST API entry point
├── scripts/           # Utility scripts (seeding, cleanup)
├── sqlite.db          # Sample SQLite database file
├── package.json
├── tsconfig.json
└── README.md
```

## Features

- **REST API**: Full CRUD for protocols, strategies, articles, membership, and game progress.
- **Rating Engine**: Calculates risk scores for DeFi protocols based on multiple factors:
  - Contract Risk (40%)
  - Tokenomics Risk (25%)
  - Liquidity Risk (15%)
  - Governance Risk (10%)
  - Operation Risk (10%)
- **Blockchain Event Listeners**: Real-time sync of on-chain events:
  - `MembershipPurchased`: Updates user tier and expiry
  - `BadgeMinted`: Marks badges as minted and syncs game progress
- **API Integrations**:
  - DefiLlama: Protocol data, TVL, analytics
  - Yields API: Pool yields and APY data

## Setup

### Prerequisites

- Node.js v18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## API Endpoints

### Protocols
- `GET /api/protocols` - List all protocols with filtering/sorting
- `GET /api/protocols/:slug` - Get protocol details

### Strategies
- `GET /api/strategies` - List all yield strategies
- `GET /api/strategies/:id` - Get strategy details

### Membership
- `GET /api/membership/:wallet` - Get user membership status and badges
- `POST /api/membership` - Process membership subscription

### Game Progress
- `GET /api/game/:wallet/progress` - Get user's game progress
- `PUT /api/game/:wallet/progress` - Update game progress

### Articles
- `GET /api/articles` - List research articles
- `GET /api/articles/:slug` - Get article content

### Homepage
- `GET /api/homepage` - Get homepage configuration (featured content)

## Blockchain Event Listeners

The backend includes a listener system (`src/listeners.ts`) that syncs on-chain events with the database.

### Supported Events

1. **MembershipPurchased** (PaymentContract)
   - Creates/updates user record
   - Sets membership tier and expiry date
   - Auto-creates membership badge entries (3001, 3002)

2. **BadgeMinted** (BadgeNFT)
   - Marks badge as minted in `user_badges` table
   - Syncs `gameProgress` JSON field for game badges (2001-2004)

### Listener Modes

The listener supports two modes:
- **WebSocket** (default): Real-time event streaming
- **Polling**: HTTP-based polling (fallback for networks without WebSocket support)

### Configuration

Update contract addresses in `src/listeners.ts`:
```typescript
const PAYMENT_CONTRACT_ADDRESS = '0x...';
const BADGE_NFT_ADDRESS = '0x...';
```

## Database

Uses SQLite with Drizzle ORM. See `DATABASE_STRUCTURE.md` for complete schema documentation.

### Key Tables
- `users`: User profiles, membership status, game progress
- `user_badges`: Badge ownership and minting status
- `protocols`: DeFi protocol data and ratings
- `strategies`: Yield strategy configurations
- `billing_history`: Subscription payment records

### Migrations

```bash
# Generate migrations
npx drizzle-kit generate:sqlite

# Push migrations to database
npx drizzle-kit push:sqlite
```

## Development

```bash
# Run development server with hot reload
npm run install
npm run dev

# Server runs on http://localhost:4000
```

### Testing API Endpoints

```bash
# Get all protocols
curl http://localhost:4000/api/protocols

# Get membership status
curl http://localhost:4000/api/membership/0xYourWalletAddress

# Get game progress
curl http://localhost:4000/api/game/0xYourWalletAddress/progress
```

### Process Management

```bash
# Find process using port 4000
netstat -ano | findstr :4000

# Kill process by PID
taskkill /PID <PID> /F
```

## License

MIT License - see [LICENSE](./LICENSE) file for details

---

**Last Updated:** Feb 6, 2026
