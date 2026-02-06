import { Project, RiskAnalysis } from '@/lib/types';

export const projects: Project[] = [
    {
        id: "pendle",
        name: "Pendle",
        slug: "pendle",
        rating: "AA",
        score: 87,
        tvl: "$1.2B",
        tvlValue: 1200000000,
        description: "Pendle is a protocol that enables the tokenization and trading of future yield. It allows users to separate ownership of the underlying asset from the yield it generates.",
        logo: "🔷",
        chains: ["Ethereum", "Arbitrum", "Optimism", "BSC"],
        category: "Yield",
        auditStatus: "Audited"
    },
    {
        id: "uniswap",
        name: "Uniswap",
        slug: "uniswap",
        rating: "AAA",
        score: 95,
        tvl: "$4.5B",
        tvlValue: 4500000000,
        description: "Uniswap is the largest decentralized exchange (DEX) operating on the Ethereum blockchain. It facilitates automated trading of decentralized finance (DeFi) tokens.",
        logo: "🦄",
        chains: ["Ethereum", "Polygon", "Arbitrum", "Optimism", "Base"],
        category: "DEX",
        websiteUrl: "https://uniswap.org",
        docsUrl: "https://docs.uniswap.org",
        twitterUrl: "https://twitter.com/Uniswap",
        auditStatus: "Audited"
    },
    {
        id: "ena",
        name: "Ethena",
        slug: "ena",
        rating: "A",
        score: 82,
        tvl: "$2.1B",
        tvlValue: 2100000000,
        description: "Ethena is a synthetic dollar protocol built on Ethereum that provides a crypto-native solution for money that is not reliant on traditional banking system infrastructure.",
        logo: "⚡",
        chains: ["Ethereum"],
        category: "Stablecoin",
        websiteUrl: "https://ethena.fi",
        docsUrl: "https://docs.ethena.fi",
        twitterUrl: "https://twitter.com/ethena_labs",
        auditStatus: "Audited"
    },
    {
        id: "aave",
        name: "Aave",
        slug: "aave",
        rating: "AAA",
        score: 93,
        tvl: "$12.3B",
        tvlValue: 12300000000,
        description: "Aave is a decentralized non-custodial liquidity protocol where users can participate as depositors or borrowers. Depositors provide liquidity to the market to earn a passive income, while borrowers are able to borrow in an overcollateralized (perpetually) or undercollateralized (one-block liquidity) fashion.",
        logo: "👻",
        chains: ["Ethereum", "Polygon", "Avalanche", "Arbitrum", "Optimism", "Base", "Gnosis", "Scroll"],
        category: "Lending",
        websiteUrl: "https://aave.com",
        docsUrl: "https://docs.aave.com",
        twitterUrl: "https://twitter.com/aave",
        auditStatus: "Audited"
    },
    {
        id: "lido",
        name: "Lido",
        slug: "lido",
        rating: "AA",
        score: 89,
        tvl: "$35.2B",
        tvlValue: 35200000000,
        description: "Lido is a liquid staking solution for ETH and other POS blockchains. It lets users stake their tokens while keeping them liquid and usable across DeFi applications.",
        logo: "🏊",
        chains: ["Ethereum"],
        category: "Liquid Staking",
        websiteUrl: "https://lido.fi",
        docsUrl: "https://docs.lido.fi",
        twitterUrl: "https://twitter.com/LidoFinance",
        auditStatus: "Audited"
    }
];

export const risks: Record<string, RiskAnalysis> = {
    "pendle": {
        projectId: "pendle",
        overallScore: 87,
        rating: "AA",
        scores: [
            { category: "Contract Risk", score: 85, weight: 0.4, description: "Audited by multiple firms, complex logic." },
            { category: "Liquidity Risk", score: 90, weight: 0.15, description: "High liquidity across major pools." },
            { category: "Tokenomics", score: 88, weight: 0.25, description: "vePENDLE model aligns incentives well." }
        ],
        history: [
            { date: "2023-10", score: 82 },
            { date: "2023-11", score: 85 },
            { date: "2023-12", score: 87 }
        ],
        auditReports: [
            { auditor: "Ackee Blockchain", date: "2023-05-15", url: "#" },
            { auditor: "Dedaub", date: "2023-06-20", url: "#" }
        ]
    }
};
