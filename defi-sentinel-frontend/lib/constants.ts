import { sepolia } from 'wagmi/chains';

export const API_BASE_URL = 'https://api.defisentinel.org';
//export const API_BASE_URL = 'http://localhost:4000';
// Replace with your actual deployed contract addresses
export const CONTRACTS = {
    BadgeNFT: "0xA1F0019EE670Aa204f56B7D142AC43C64E998cD9",
    PaymentContract: "0x7FDeF9316dBF206f57Aab2eAaE12fC7ee63953A9",
    // Mock USDC address on Sepolia (or whichever testnet you are using)
    // If local, use the address from deploy log. If Sepolia, use a faucet USDC or your deployed mock.
    USDC: "0xd14e84292Cf96E96000263Ab049A51d4dA48e5b1", // Verify this!
} as const;

export const TARGET_CHAIN = sepolia;

export const BADGE_IDS = {
    EARLY_ADOPTER: 1001,
    DEFI_NOVICE: 2001,
    DEFI_INTERMEDIATE: 2002,
    DEFI_HARD: 2003,
    RISK_GUARDIAN: 2004,
    PRO_MEMBER: 3001,
    SENTINEL_ELITE: 3002,
    SCHOLAR: 4001,
    EXPLORER: 4002,
} as const;

// Image paths are relative to /public
export const BADGE_DETAILS: Record<number, { name: string; description: string; image: string; grey: string }> = {
    [BADGE_IDS.EARLY_ADOPTER]: {
        name: "Early Adopter",
        description: "Joined within first 1000 members",
        image: "/images/badges/1001_early_adopter.jpg",
        grey: "/images/badges/1001_early_adopter_grey.jpg"
    },
    [BADGE_IDS.DEFI_NOVICE]: {
        name: "DeFi Novice",
        description: "Pass DeFi intro quiz",
        image: "/images/badges/2001_defi_novice.jpg",
        grey: "/images/badges/2001_defi_novice_grey.jpg"
    },
    [BADGE_IDS.DEFI_INTERMEDIATE]: {
        name: "DeFi Intermediate",
        description: "Pass DeFi medium quiz",
        image: "/images/badges/2002_defi_intermediate.jpg",
        grey: "/images/badges/2002_defi_intermediate_grey.jpg"
    },
    [BADGE_IDS.DEFI_HARD]: { // ID 2003
        name: "DeFi Master",
        description: "Pass DeFi advance quiz",
        image: "/images/badges/2003_defi_master.jpg",
        grey: "/images/badges/2003_defi_master_grey.jpg"
    },
    [BADGE_IDS.RISK_GUARDIAN]: {
        name: "Risk Guardian",
        description: "Pass DeFi risk assessment",
        image: "/images/badges/2004_risk_guardian.jpg",
        grey: "/images/badges/2004_risk_guardian_grey.jpg"
    },
    [BADGE_IDS.PRO_MEMBER]: {
        name: "Pro Member",
        description: "Acquire membership",
        image: "/images/badges/3001_pro_member.jpg",
        grey: "/images/badges/3001_pro_member_grey.jpg"
    },
    [BADGE_IDS.SENTINEL_ELITE]: {
        name: "Sentinel Elite",
        description: "Acquire annual membership",
        image: "/images/badges/3002_sentinel_elite.jpg",
        grey: "/images/badges/3002_sentinel_elite_grey.jpg"
    },
    [BADGE_IDS.SCHOLAR]: {
        name: "Scholar",
        description: "Read 10 research articles",
        image: "/images/badges/4001_scholar.jpg",
        grey: "/images/badges/4001_scholar_grey.jpg"
    },
    [BADGE_IDS.EXPLORER]: {
        name: "Explorer",
        description: "Explore 10 strategies",
        image: "/images/badges/4002_explorer.jpg",
        grey: "/images/badges/4002_explorer_grey.jpg"
    },
};

export const FEES = {
    MONTHLY: 9900000n, // 9.9 USDC
    YEARLY: 99900000n, // 99.9 USDC
} as const;
