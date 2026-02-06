import { createPublicClient, webSocket, http, Log, PublicClient } from 'viem';
import { sepolia } from 'viem/chains';
import { db } from './db';
import { users, userBadges, billingHistory } from './db/schema';
import { eq, and } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import PaymentContractABI from './abis/PaymentContract.json';
import BadgeNFTABI from './abis/BadgeNFT.json';

dotenv.config();

// Contract Addresses
// Notice these are in sepolia testnet, the USDC is also a mock coin
const PAYMENT_CONTRACT_ADDRESS = "0x7FDeF9316dBF206f57Aab2eAaE12fC7ee63953A9";
const BADGE_NFT_ADDRESS = "0xA1F0019EE670Aa204f56B7D142AC43C64E998cD9";

// Configuration
const WSS_URL = (process.env.RPC_URL || 'wss://eth-sepolia.g.alchemy.com/v2/fDDwxWatjwZiVcoLzoiwN').replace('https://', 'wss://');
const HTTP_URL = WSS_URL.replace('wss://', 'https://'); // Naive fallback, assumes same key supports both
const ERROR_THRESHOLD = 3;

class ListenerManager {
    private client: PublicClient | null = null;
    private mode: 'websocket' | 'polling' = 'websocket';
    private errorCount = 0;
    private unwatchPayment: (() => void) | null = null;
    private unwatchBadge: (() => void) | null = null;

    async start() {
        console.log(`[Listeners] Starting in ${this.mode.toUpperCase()} mode...`);

        try {
            if (this.mode === 'websocket') {
                this.client = createPublicClient({ chain: sepolia, transport: webSocket(WSS_URL) });
            } else {
                this.client = createPublicClient({ chain: sepolia, transport: http(HTTP_URL) });
            }

            this.setupWatchers();
        } catch (e) {
            console.error(`[Listeners] Failed to start client:`, e);
            this.handleError();
        }
    }

    private setupWatchers() {
        if (!this.client) return;

        // 1. Payment Watcher
        this.unwatchPayment = this.client.watchContractEvent({
            address: PAYMENT_CONTRACT_ADDRESS as `0x${string}`,
            abi: PaymentContractABI,
            eventName: 'MembershipPaid',
            poll: this.mode === 'polling',
            pollingInterval: this.mode === 'polling' ? 5000 : undefined,
            onLogs: async (logs) => {
                this.errorCount = 0; // Reset on success
                for (const log of logs) await handleMembershipPaid(log);
            },
            onError: (error) => {
                console.error('[Listeners] Payment Watch Error:', error);
                this.handleError();
            }
        });

        // 2. Badge Watcher
        this.unwatchBadge = this.client.watchContractEvent({
            address: BADGE_NFT_ADDRESS as `0x${string}`,
            abi: BadgeNFTABI,
            eventName: 'BadgeMinted',
            poll: this.mode === 'polling',
            pollingInterval: this.mode === 'polling' ? 10000 : undefined,
            onLogs: async (logs) => {
                this.errorCount = 0;
                for (const log of logs) await handleBadgeMinted(log);
            },
            onError: (error) => {
                console.error('[Listeners] Badge Watch Error:', error);
                this.handleError();
            }
        });
    }

    private handleError() {
        this.errorCount++;
        if (this.errorCount >= ERROR_THRESHOLD && this.mode === 'websocket') {
            console.warn(`[Listeners] ⚠️ Too many WebSocket errors (${this.errorCount}). Switching to HTTP Polling fallback...`);
            this.switchMode('polling');
        }
    }

    private switchMode(newMode: 'websocket' | 'polling') {
        this.stop();
        this.mode = newMode;
        this.errorCount = 0;
        setTimeout(() => this.start(), 1000);
    }

    stop() {
        if (this.unwatchPayment) this.unwatchPayment();
        if (this.unwatchBadge) this.unwatchBadge();
        this.unwatchPayment = null;
        this.unwatchBadge = null;
    }
}

const manager = new ListenerManager();

export async function startEventListeners() {
    await manager.start();
}

// Handlers remain the same...
async function handleMembershipPaid(log: any) {
    const { user: userAddress, months, amount, yearCount, monthCount } = log.args;
    const wallet = (userAddress as string).toLowerCase();

    console.log(`[Event] MembershipPaid detected for ${wallet}. Months: ${months}`);

    try {
        // Find or Create User
        let userResult = await db.select().from(users).where(eq(users.walletAddress, wallet)).limit(1);
        let user;

        if (userResult.length === 0) {
            console.log(`[Event] Auto-creating user for ${wallet}`);
            const userId = uuidv4();
            await db.insert(users).values({
                id: userId,
                walletAddress: wallet,
                tier: 'free',
                memberSince: new Date(),
                daysRemaining: 0,
                quizCompleted: 0,
                riskAssessmentDone: false
            });
            // Init badges 
            const ALL_BADGES = [1001, 2001, 2002, 2003, 2004, 3001, 3002, 4001, 4002];
            for (const bId of ALL_BADGES) {
                await db.insert(userBadges).values({
                    id: uuidv4(),
                    userId: userId,
                    badgeId: bId,
                    earned: false,
                    nftMinted: false
                });
            }
            user = { id: userId, tier: 'free', expiryDate: null };
        } else {
            user = userResult[0];
        }

        // Calculate New Expiry
        const now = Date.now();
        const currentExpiry = user.expiryDate ? new Date(user.expiryDate).getTime() : now;
        const purchaseMillis = Number(months) * 30 * 24 * 60 * 60 * 1000;
        const effectiveStart = currentExpiry > now ? currentExpiry : now;
        const newExpiry = new Date(effectiveStart + purchaseMillis);

        let newTier = 'monthly';
        if (Number(yearCount) > 0 || user.tier === 'yearly') {
            newTier = 'yearly';
        }

        await db.update(users).set({
            tier: newTier,
            expiryDate: newExpiry,
            updatedAt: new Date()
        }).where(eq(users.id, user.id));

        await db.insert(billingHistory).values({
            id: uuidv4(),
            userId: user.id,
            plan: Number(yearCount) > 0 ? 'year' : 'month',
            months: Number(months),
            price: `${(Number(amount) / 1e6).toFixed(2)} USDC`,
            date: new Date(),
            wallet: wallet,
            txHash: log.transactionHash
        });

        const badgeIdToAward = newTier === 'yearly' ? 3002 : 3001;
        await db.update(userBadges)
            .set({ earned: true, earnedAt: new Date() })
            .where(and(eq(userBadges.userId, user.id), eq(userBadges.badgeId, badgeIdToAward)));

        console.log(`[Event] Processed OK. New Expiry: ${newExpiry.toISOString()}`);

    } catch (e) {
        console.error(`[Event] Failed to process payment for ${wallet}`, e);
    }
}

async function handleBadgeMinted(log: any) {
    const { user: userAddress, badgeId } = log.args;
    const wallet = (userAddress as string).toLowerCase();
    const bId = Number(badgeId);

    console.log(`[Event] BadgeMinted detected for ${wallet}. Badge: ${bId}`);

    try {
        const userResult = await db.select().from(users).where(eq(users.walletAddress, wallet)).limit(1);
        if (userResult.length === 0) return;

        const user = userResult[0];

        // 1. Update Badge Table
        await db.update(userBadges)
            .set({
                nftMinted: true,
                mintedAt: new Date(),
                earned: true,
                earnedAt: new Date()
            })
            .where(and(eq(userBadges.userId, user.id), eq(userBadges.badgeId, bId)));

        // 2. Sync Game Progress JSON (so Game Dashboard updates)
        const currentProgress = user.gameProgress || {
            easy: { completed: false, score: 0, bestScore: 0, minted: false },
            medium: { completed: false, score: 0, bestScore: 0, minted: false },
            hard: { completed: false, score: 0, bestScore: 0, minted: false },
            risk: { completed: false, score: 0, minted: false }
        };

        let updated = false;
        // Map Badge ID to Game Key
        // IDs: 2001 (Novice/Easy), 2002 (Inter/Medium), 2003 (Expert/Hard), 4001 (Risk)
        // Note: Check constants.ts values to be precise.
        // Assuming:
        // DEFI_NOVICE = 2001
        // DEFI_INTERMEDIATE = 2002
        // DEFI_LEGEND (Hard?) = 2004? Or 2003. Constants says 2004 is Legend.
        // RISK_GUARDIAN = 4001

        if (bId === 2001) { currentProgress.easy.minted = true; updated = true; }
        if (bId === 2002) { currentProgress.medium.minted = true; updated = true; }
        if (bId === 2003) { currentProgress.hard.minted = true; updated = true; } // 2003 is DeFi Master (Hard)
        if (bId === 2004) { currentProgress.risk.minted = true; updated = true; } // 2004 is Risk Guardian

        if (updated) {
            await db.update(users)
                .set({ gameProgress: currentProgress, updatedAt: new Date() })
                .where(eq(users.id, user.id));
            console.log(`[Event] Synced gameProgress for badge ${bId}`);
        }

        console.log(`[Event] Badge ${bId} marked as minted for ${wallet}`);
    } catch (e) {
        console.error(`[Event] Failed to process badge mint for ${wallet}`, e);
    }
}
