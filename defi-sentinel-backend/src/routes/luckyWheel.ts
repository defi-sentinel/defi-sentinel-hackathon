import { Router } from "express";
import { db } from "../db";
import { users, userBadges } from "../db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from 'uuid';

const router = Router();

router.post("/claim-lucky-wheel", async (req, res) => {
    try {
        const { walletAddress, luckyNumber } = req.body;

        if (!walletAddress || !luckyNumber) {
            return res.status(400).json({ error: "Missing walletAddress or luckyNumber" });
        }

        const wallet = walletAddress.toLowerCase();

        // 1. Validate Lucky Number Match
        // luckyNumber should be a single hex character (0-9, A-F)
        const lastChar = wallet.slice(-1).toUpperCase();
        const luckyChar = luckyNumber.toUpperCase();

        if (lastChar !== luckyChar) {
            return res.status(400).json({ error: "Wallet address does not match lucky number." });
        }

        // 2. Find User
        const existingUser = await db.query.users.findFirst({
            where: eq(users.walletAddress, wallet)
        });

        let userId = existingUser?.id;

        // If user doesn't exist, create them
        if (!existingUser) {
            userId = uuidv4();
            const memberSince = new Date();

            // 1. Create User
            await db.insert(users).values({
                id: userId,
                walletAddress: wallet,
                email: null,
                memberSince: memberSince,
                daysRemaining: 0,
                quizCompleted: 0,
                riskAssessmentDone: false,
                tier: 'free', // Will be updated to custom immediately after
                expiryDate: null
            });

            // 2. Initialize Badges (Standard set)
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
        }

        // 3. Grant Membership (6 Months)
        // We update tier to 'monthly' (functioning as pro) or 'custom'
        // Let's us 'custom' to denote special duration, or just 'monthly' with valid date.
        const sixMonthsMs = 6 * 30 * 24 * 60 * 60 * 1000;
        const newExpiry = Date.now() + sixMonthsMs;

        await db.update(users)
            .set({
                tier: "custom", // Or "monthly"
                expiryDate: new Date(newExpiry),
                updatedAt: new Date()
            })
            .where(eq(users.walletAddress, wallet));

        return res.json({ success: true, message: "Membership granted!", tier: "custom", expiryDate: newExpiry });

    } catch (error) {
        console.error("Error claiming lucky wheel:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
