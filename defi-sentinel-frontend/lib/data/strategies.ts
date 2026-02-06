import { Strategy } from '@/lib/types';

// Comprehensive strategy data with proper grouping
export const strategies: Strategy[] = [
    // ============ LOW RISK STRATEGIES ============

    // 1. USDe Strategy Class
    {
        id: "usde-pt",
        projectId: "pendle",
        name: "USDe PT",
        strategyClass: "USDe",
        description: "Fixed yield strategy using Pendle Principal Tokens on USDe stablecoin. Earn predictable returns by holding PT tokens until maturity.",
        apy: 13.8,
        apyBase: 12.6,
        apyReward: 1.2,
        riskLevel: "Low",
        rating: "AA",
        score: 92,
        type: "Yield",
        tvl: 80000000,
        tokens: ["USDe", "PT-USDe"],
        tags: ["Stablecoin", "Fixed Yield", "Pendle"],
        complexity: "Beginner",
        status: "Active",
        lastUpdated: "2024-03-15T10:00:00Z",
        yieldBreakdown: [
            { source: "Basic APY", value: 9.6 },
            { source: "Pendle Reward", value: 2.2 },
            { source: "Points", value: 2.0 }
        ],
        steps: [
            { step: 1, title: "Acquire USDe", description: "Get USDe from Ethena or swap on a DEX." },
            { step: 2, title: "Buy PT-USDe", description: "Purchase Pendle Principal Tokens on Pendle AMM." },
            { step: 3, title: "Hold to Maturity", description: "Hold PT tokens until maturity to earn fixed yield." },
            { step: 4, title: "Redeem", description: "Redeem PT for underlying USDe at maturity." }
        ]
    },
    {
        id: "usde-lp",
        projectId: "pendle",
        name: "USDe LP",
        strategyClass: "USDe",
        description: "Provide liquidity to Pendle's USDe PT/YT pools to earn trading fees and protocol rewards.",
        apy: 15.2,
        apyBase: 8.0,
        apyReward: 7.2,
        riskLevel: "Low",
        rating: "AA",
        score: 92,
        type: "LP",
        tvl: 60000000,
        tokens: ["USDe", "PT-USDe", "YT-USDe"],
        tags: ["Stablecoin", "LP", "Pendle"],
        complexity: "Intermediate",
        status: "Active",
        lastUpdated: "2024-03-15T10:00:00Z",
        yieldBreakdown: [
            { source: "Trading Fees", value: 5.0 },
            { source: "Yield Token Value", value: 3.0 },
            { source: "Pendle Incentives", value: 7.2 }
        ],
        steps: [
            { step: 1, title: "Acquire USDe", description: "Get USDe from Ethena or DEX." },
            { step: 2, title: "Mint PT/YT", description: "Deposit USDe in Pendle to mint PT and YT tokens." },
            { step: 3, title: "Add Liquidity", description: "Provide liquidity to PT/YT pools.", warning: "Exposed to impermanent loss if yield changes." },
            { step: 4, title: "Claim Rewards", description: "Regularly claim trading fees and Pendle rewards." }
        ]
    },
    {
        id: "susde-pt",
        projectId: "pendle",
        name: "sUSDe PT",
        strategyClass: "USDe",
        description: "Fixed yield on staked USDe (sUSDe) using Pendle Principal Tokens for enhanced returns.",
        apy: 18.5,
        apyBase: 15.0,
        apyReward: 3.5,
        riskLevel: "Low",
        rating: "AA",
        score: 92,
        type: "Yield",
        tvl: 45000000,
        tokens: ["sUSDe", "PT-sUSDe"],
        tags: ["Stablecoin", "Staking", "Pendle"],
        complexity: "Intermediate",
        status: "Active",
        lastUpdated: "2024-03-15T10:00:00Z",
        yieldBreakdown: [
            { source: "sUSDe Staking", value: 12.0 },
            { source: "Fixed Yield (PT)", value: 3.0 },
            { source: "Pendle Rewards", value: 3.5 }
        ],
        steps: [
            { step: 1, title: "Stake USDe", description: "Stake USDe to receive sUSDe tokens." },
            { step: 2, title: "Buy PT-sUSDe", description: "Purchase Pendle Principal Tokens for sUSDe." },
            { step: 3, title: "Hold to Maturity", description: "Hold PT tokens to earn fixed yield on staked position." },
            { step: 4, title: "Redeem", description: "Redeem PT for sUSDe and unstake if desired." }
        ]
    },
    {
        id: "susde-lp",
        projectId: "pendle",
        name: "sUSDe LP",
        strategyClass: "USDe",
        description: "Provide liquidity for sUSDe PT/YT pools to maximize yield through trading fees and staking rewards.",
        apy: 21.3,
        apyBase: 12.0,
        apyReward: 9.3,
        riskLevel: "Low",
        rating: "AA",
        score: 92,
        type: "LP",
        tvl: 35000000,
        tokens: ["sUSDe", "PT-sUSDe", "YT-sUSDe"],
        tags: ["Stablecoin", "LP", "Staking"],
        complexity: "Advanced",
        status: "Active",
        lastUpdated: "2024-03-15T10:00:00Z",
        yieldBreakdown: [
            { source: "LP Trading Fees", value: 6.0 },
            { source: "sUSDe Staking", value: 6.0 },
            { source: "Pendle Incentives", value: 9.3 }
        ],
        steps: [
            { step: 1, title: "Stake USDe", description: "Convert USDe to sUSDe through staking." },
            { step: 2, title: "Mint PT/YT", description: "Deposit sUSDe to mint PT and YT tokens." },
            { step: 3, title: "Add Liquidity", description: "Provide liquidity to sUSDe PT/YT pools.", warning: "Higher IL risk due to yield volatility." },
            { step: 4, title: "Manage Position", description: "Monitor and rebalance as needed." }
        ]
    },

    // 2. DAI Strategy Class
    {
        id: "dai-aave",
        projectId: "aave",
        name: "DAI Aave",
        strategyClass: "DAI",
        description: "Supply DAI to Aave V3 to earn lending interest with minimal risk.",
        apy: 5.2,
        apyBase: 5.2,
        apyReward: 0,
        riskLevel: "Low",
        rating: "AAA",
        score: 98,
        type: "Lending",
        tvl: 500000000,
        tokens: ["DAI", "aDAI"],
        tags: ["Stablecoin", "Lending", "Blue Chip"],
        complexity: "Beginner",
        status: "Active",
        lastUpdated: "2024-03-16T10:00:00Z",
        yieldBreakdown: [
            { source: "Lending APY", value: 5.2 }
        ],
        steps: [
            { step: 1, title: "Acquire DAI", description: "Get DAI from exchange or swap." },
            { step: 2, title: "Supply to Aave", description: "Deposit DAI into Aave V3 market." },
            { step: 3, title: "Earn Interest", description: "Receive aDAI and accrue interest automatically." },
            { step: 4, title: "Withdraw", description: "Withdraw anytime with accrued interest." }
        ]
    },

    // 3. USDC Strategy Class  
    {
        id: "usdc-compound",
        projectId: "compound",
        name: "USDC Compound",
        strategyClass: "USDC",
        description: "Supply USDC to Compound V3 for stable, predictable yields with battle-tested smart contracts.",
        apy: 4.8,
        apyBase: 4.8,
        apyReward: 0,
        riskLevel: "Low",
        rating: "AAA",
        score: 98,
        type: "Lending",
        tvl: 800000000,
        tokens: ["USDC", "cUSDC"],
        tags: ["Stablecoin", "Lending", "Blue Chip"],
        complexity: "Beginner",
        status: "Active",
        lastUpdated: "2024-03-16T10:00:00Z",
        yieldBreakdown: [
            { source: "Supply APY", value: 4.8 }
        ],
        steps: [
            { step: 1, title: "Get USDC", description: "Acquire USDC from CEX or DEX." },
            { step: 2, title: "Supply", description: "Deposit USDC into Compound V3." },
            { step: 3, title: "Earn", description: "Interest accrues automatically to your position." },
            { step: 4, title: "Redeem", description: "Withdraw principal plus interest anytime." }
        ]
    },

    // 4. stETH Strategy Class
    {
        id: "steth-curve",
        projectId: "curve",
        name: "stETH Curve",
        strategyClass: "stETH",
        description: "Provide liquidity to Curve's ETH/stETH pool for trading fees and CRV rewards.",
        apy: 3.8,
        apyBase: 2.5,
        apyReward: 1.3,
        riskLevel: "Low",
        rating: "AA",
        score: 92,
        type: "LP",
        tvl: 1200000000,
        tokens: ["ETH", "stETH"],
        tags: ["LSD", "LP", "Curve"],
        complexity: "Intermediate",
        status: "Active",
        lastUpdated: "2024-03-16T10:00:00Z",
        yieldBreakdown: [
            { source: "Trading Fees", value: 2.5 },
            { source: "CRV Rewards", value: 1.3 }
        ],
        steps: [
            { step: 1, title: "Prepare Assets", description: "Have equal value of ETH and stETH." },
            { step: 2, title: "Add Liquidity", description: "Deposit to Curve stETH pool." },
            { step: 3, title: "Stake LP Tokens", description: "Stake Curve LP tokens to earn CRV." },
            { step: 4, title: "Claim Rewards", description: "Harvest CRV rewards regularly." }
        ]
    },

    // 5. FRAX Strategy Class
    {
        id: "frax-convex",
        projectId: "convex",
        name: "FRAX Convex",
        strategyClass: "FRAX",
        description: "Boost Curve FRAX yields through Convex for enhanced CRV and CVX rewards.",
        apy: 6.5,
        apyBase: 3.0,
        apyReward: 3.5,
        riskLevel: "Low",
        rating: "A",
        score: 85,
        type: "Farming",
        tvl: 180000000,
        tokens: ["FRAX", "USDC"],
        tags: ["Stablecoin", "Yield Farming", "Convex"],
        complexity: "Intermediate",
        status: "Active",
        lastUpdated: "2024-03-16T10:00:00Z",
        yieldBreakdown: [
            { source: "Curve Fees", value: 3.0 },
            { source: "CRV Rewards", value: 2.0 },
            { source: "CVX Rewards", value: 1.5 }
        ],
        steps: [
            { step: 1, title: "Get FRAX/USDC", description: "Acquire FRAX and USDC tokens." },
            { step: 2, title: "Add to Curve", description: "Provide liquidity to FRAX/USDC Curve pool." },
            { step: 3, title: "Stake on Convex", description: "Deposit Curve LP tokens to Convex." },
            { step: 4, title: "Harvest", description: "Claim CRV and CVX rewards regularly." }
        ]
    },

    // ============ MIDDLE RISK STRATEGIES ============

    // 6. ETH Strategy Class
    {
        id: "eth-uniswap-v3",
        projectId: "uniswap",
        name: "ETH UniV3",
        strategyClass: "ETH",
        description: "Provide concentrated liquidity to ETH/USDC pool on Uniswap V3 for high fee generation.",
        apy: 65.0,
        apyBase: 65.0,
        apyReward: 0,
        riskLevel: "Middle",
        rating: "BB",
        score: 75,
        type: "LP",
        tvl: 250000000,
        tokens: ["ETH", "USDC"],
        tags: ["Blue Chip", "AMM", "Concentrated Liquidity"],
        complexity: "Advanced",
        status: "Active",
        lastUpdated: "2024-03-12T14:30:00Z",
        yieldBreakdown: [
            { source: "Trading Fees", value: 65.0 }
        ],
        steps: [
            { step: 1, title: "Prepare Assets", description: "Have ETH and USDC ready." },
            { step: 2, title: "Select Range", description: "Choose price range for liquidity.", warning: "Narrow ranges = higher yield but higher IL risk." },
            { step: 3, title: "Deposit", description: "Add liquidity to Uniswap V3." },
            { step: 4, title: "Manage", description: "Monitor and rebalance position regularly." }
        ]
    },

    // 7. wBTC Strategy Class
    {
        id: "wbtc-aave",
        projectId: "aave",
        name: "wBTC Aave",
        strategyClass: "wBTC",
        description: "Supply wBTC to Aave V3 to earn lending interest on Bitcoin exposure.",
        apy: 1.2,
        apyBase: 1.2,
        apyReward: 0,
        riskLevel: "Middle",
        rating: "A",
        score: 85,
        type: "Lending",
        tvl: 450000000,
        tokens: ["wBTC"],
        tags: ["BTC", "Lending"],
        complexity: "Beginner",
        status: "Active",
        lastUpdated: "2024-03-16T10:00:00Z",
        yieldBreakdown: [
            { source: "Lending APY", value: 1.2 }
        ],
        steps: [
            { step: 1, title: "Get wBTC", description: "Wrap BTC or acquire wBTC." },
            { step: 2, title: "Supply", description: "Deposit wBTC to Aave V3." },
            { step: 3, title: "Earn", description: "Accrue interest on BTC position." },
            { step: 4, title: "Withdraw", description: "Redeem anytime." }
        ]
    },

    // 8. ARB Strategy Class
    {
        id: "arb-camelot",
        projectId: "camelot",
        name: "ARB Camelot",
        strategyClass: "ARB",
        description: "Provide liquidity to ARB pairs on Camelot DEX for high rewards on Arbitrum.",
        apy: 38.5,
        apyBase: 15.0,
        apyReward: 23.5,
        riskLevel: "Middle",
        rating: "B-",
        score: 55,
        type: "LP",
        tvl: 85000000,
        tokens: ["ARB", "ETH"],
        tags: ["Governance", "AMM", "Arbitrum"],
        complexity: "Advanced",
        status: "Active",
        lastUpdated: "2024-03-16T10:00:00Z",
        yieldBreakdown: [
            { source: "Trading Fees", value: 15.0 },
            { source: "ARB Incentives", value: 18.5 },
            { source: "GRAIL Rewards", value: 5.0 }
        ],
        steps: [
            { step: 1, title: "Bridge to Arbitrum", description: "Get ARB and ETH on Arbitrum." },
            { step: 2, title: "Add Liquidity", description: "Provide ARB/ETH liquidity on Camelot." },
            { step: 3, title: "Stake LP", description: "Stake LP tokens in Camelot farms." },
            { step: 4, title: "Harvest", description: "Claim ARB and GRAIL rewards." }
        ]
    },

    // 9. OP Strategy Class
    {
        id: "op-velodrome",
        projectId: "velodrome",
        name: "OP Velodrome",
        strategyClass: "OP",
        description: "Stake OP and vote for gauges on Velodrome to earn trading fees and bribes.",
        apy: 28.3,
        apyBase: 12.0,
        apyReward: 16.3,
        riskLevel: "Middle",
        rating: "BB",
        score: 75,
        type: "Staking",
        tvl: 120000000,
        tokens: ["OP", "VELO"],
        tags: ["Governance", "Vote Escrow", "Optimism"],
        complexity: "Advanced",
        status: "Active",
        lastUpdated: "2024-03-16T10:00:00Z",
        yieldBreakdown: [
            { source: "Trading Fees", value: 12.0 },
            { source: "Voting Bribes", value: 10.3 },
            { source: "VELO Emissions", value: 6.0 }
        ],
        steps: [
            { step: 1, title: "Bridge to Optimism", description: "Get OP on Optimism network." },
            { step: 2, title: "Lock OP", description: "Lock OP as veOP on Velodrome." },
            { step: 3, title: "Vote", description: "Vote for gauges to earn bribes and fees." },
            { step: 4, title: "Claim", description: "Harvest fees and bribes weekly." }
        ]
    },

    // 10. GLP Strategy Class
    {
        id: "glp-gmx",
        projectId: "gmx",
        name: "GLP GMX",
        strategyClass: "GLP",
        description: "Provide liquidity as GLP to GMX protocol to earn trading fees and esGMX rewards.",
        apy: 22.8,
        apyBase: 18.0,
        apyReward: 4.8,
        riskLevel: "Middle",
        rating: "A-",
        score: 78,
        type: "LP",
        tvl: 380000000,
        tokens: ["GLP"],
        tags: ["Perps", "LP", "Arbitrum"],
        complexity: "Intermediate",
        status: "Active",
        lastUpdated: "2024-03-16T10:00:00Z",
        yieldBreakdown: [
            { source: "Trading Fees", value: 18.0 },
            { source: "esGMX Rewards", value: 4.8 }
        ],
        steps: [
            { step: 1, title: "Prepare Assets", description: "Have stablecoins or ETH/BTC ready." },
            { step: 2, title: "Mint GLP", description: "Mint GLP with accepted assets on GMX." },
            { step: 3, title: "Stake GLP", description: "Stake GLP to earn fees and esGMX.", warning: "Exposed to trader PnL." },
            { step: 4, title: "Compound", description: "Compound esGMX rewards over time." }
        ]
    },

    // ============ HIGH RISK STRATEGIES ============

    // 11. PENDLE Strategy Class
    {
        id: "pendle-vote",
        projectId: "pendle",
        name: "PENDLE Vote",
        strategyClass: "PENDLE",
        description: "Lock PENDLE as vePENDLE to earn protocol revenue and voting power.",
        apy: 45.2,
        apyBase: 25.0,
        apyReward: 20.2,
        riskLevel: "High",
        rating: "CCC",
        score: 50,
        type: "Staking",
        tvl: 95000000,
        tokens: ["PENDLE"],
        tags: ["Governance", "Vote Escrow", "Protocol Revenue"],
        complexity: "Advanced",
        status: "Active",
        lastUpdated: "2024-03-16T10:00:00Z",
        yieldBreakdown: [
            { source: "Protocol Revenue", value: 25.0 },
            { source: "Voting Incentives", value: 15.2 },
            { source: "PENDLE Emissions", value: 5.0 }
        ],
        steps: [
            { step: 1, title: "Acquire PENDLE", description: "Buy PENDLE tokens from DEX or CEX." },
            { step: 2, title: "Lock PENDLE", description: "Lock PENDLE for vePENDLE (up to 2 years).", warning: "Tokens locked until expiry." },
            { step: 3, title: "Vote", description: "Vote for pools to earn incentives." },
            { step: 4, title: "Claim", description: "Harvest protocol fees and bribes." }
        ]
    },

    // 12. LDO Strategy Class
    {
        id: "ldo-curve",
        projectId: "curve",
        name: "LDO Curve",
        strategyClass: "LDO",
        description: "Provide LDO/ETH liquidity on Curve and stake for boosted rewards.",
        apy: 52.3,
        apyBase: 22.0,
        apyReward: 30.3,
        riskLevel: "High",
        rating: "B-",
        score: 58,
        type: "LP",
        tvl: 45000000,
        tokens: ["LDO", "ETH"],
        tags: ["Governance", "LP", "High APY"],
        complexity: "Advanced",
        status: "Active",
        lastUpdated: "2024-03-16T10:00:00Z",
        yieldBreakdown: [
            { source: "Trading Fees", value: 22.0 },
            { source: "CRV Rewards", value: 18.3 },
            { source: "LDO Incentives", value: 12.0 }
        ],
        steps: [
            { step: 1, title: "Get LDO/ETH", description: "Acquire LDO and ETH tokens." },
            { step: 2, title: "Add Liquidity", description: "Provide liquidity to LDO/ETH Curve pool.", warning: "High IL risk due to LDO volatility." },
            { step: 3, title: "Stake", description: "Stake Curve LP for boosted rewards." },
            { step: 4, title: "Harvest", description: "Claim CRV and LDO regularly." }
        ]
    },

    // 13. rETH Strategy Class
    {
        id: "reth-balancer",
        projectId: "balancer",
        name: "rETH Balancer",
        strategyClass: "rETH",
        description: "Provide rETH/WETH liquidity on Balancer for trading fees and BAL rewards.",
        apy: 8.5,
        apyBase: 5.0,
        apyReward: 3.5,
        riskLevel: "High",
        rating: "A-",
        score: 79,
        type: "LP",
        tvl: 125000000,
        tokens: ["rETH", "WETH"],
        tags: ["LSD", "LP", "Balancer"],
        complexity: "Intermediate",
        status: "Active",
        lastUpdated: "2024-03-16T10:00:00Z",
        yieldBreakdown: [
            { source: "Trading Fees", value: 5.0 },
            { source: "BAL Rewards", value: 3.5 }
        ],
        steps: [
            { step: 1, title: "Prepare Assets", description: "Get rETH and WETH." },
            { step: 2, title: "Add Liquidity", description: "Join rETH/WETH Balancer pool." },
            { step: 3, title: "Earn", description: "Accrue fees and BAL rewards." },
            { step: 4, title: "Claim", description: "Harvest BAL rewards periodically." }
        ]
    },

    // 14. CRV Strategy Class
    {
        id: "crv-convex",
        projectId: "convex",
        name: "CRV Convex",
        strategyClass: "CRV",
        description: "Lock CRV as cvxCRV on Convex for boosted rewards without locking period.",
        apy: 35.8,
        apyBase: 15.0,
        apyReward: 20.8,
        riskLevel: "High",
        rating: "B-",
        score: 59,
        type: "Staking",
        tvl: 280000000,
        tokens: ["CRV", "cvxCRV"],
        tags: ["Governance", "Yield Boost", "Convex"],
        complexity: "Advanced",
        status: "Active",
        lastUpdated: "2024-03-16T10:00:00Z",
        yieldBreakdown: [
            { source: "CRV Admin Fees", value: 15.0 },
            { source: "CVX Rewards", value: 12.8 },
            { source: "Bribes", value: 8.0 }
        ],
        steps: [
            { step: 1, title: "Get CRV", description: "Acquire CRV tokens." },
            { step: 2, title: "Convert", description: "Convert CRV to cvxCRV on Convex.", warning: "Conversion is one-way." },
            { step: 3, title: "Stake", description: "Stake cvxCRV for rewards." },
            { step: 4, title: "Harvest", description: "Claim CRV and CVX rewards." }
        ]
    },

    // 15. GMX Strategy Class
    {
        id: "gmx-stake",
        projectId: "gmx",
        name: "GMX Stake",
        strategyClass: "GMX",
        description: "Stake GMX for esGMX and multiplier points to boost protocol fee earnings.",
        apy: 18.5,
        apyBase: 12.0,
        apyReward: 6.5,
        riskLevel: "High",
        rating: "BBB+",
        score: 77,
        type: "Staking",
        tvl: 165000000,
        tokens: ["GMX"],
        tags: ["Governance", "Protocol Revenue", "Perpetuals"],
        complexity: "Intermediate",
        status: "Active",
        lastUpdated: "2024-03-16T10:00:00Z",
        yieldBreakdown: [
            { source: "ETH Fees", value: 12.0 },
            { source: "esGMX Rewards", value: 6.5 }
        ],
        steps: [
            { step: 1, title: "Acquire GMX", description: "Buy GMX tokens." },
            { step: 2, title: "Stake GMX", description: "Stake GMX on GMX platform." },
            { step: 3, title: "Earn Multipliers", description: "Accumulate multiplier points over time." },
            { step: 4, title: "Compound", description: "Vest and compound esGMX rewards." }
        ]
    },
];
