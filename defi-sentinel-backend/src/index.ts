
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import { db } from './db';
import { protocols, users, userBadges, billingHistory, articles, alerts, strategies, homepageConfig, ads } from './db/schema';
import { desc, asc, like, and, gte, lte, or, inArray, eq, isNotNull } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import { startEventListeners } from './listeners';
import { initializeDataSync } from './services/dataSync';
import { createPublicClient, http, webSocket } from 'viem';
import { sepolia } from 'viem/chains';
import PaymentContractABI from './abis/PaymentContract.json';

dotenv.config();

// Start Blockchain Listeners
startEventListeners().catch(err => console.error("Failed to start listeners:", err));

// Start Data Sync Service (fetches from DefiLlama/CoinGecko)
initializeDataSync().catch(err => console.error("Failed to start data sync:", err));

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
// Add compression middleware for 60-80% JSON size reduction
app.use(compression({ level: 6 }));




// API Usage Logging Middleware
app.use((req, res, next) => {
    const startTime = Date.now();
    const timestamp = new Date().toISOString();

    // Log request details
    const queryString = Object.keys(req.query).length > 0
        ? '?' + new URLSearchParams(req.query as Record<string, string>).toString()
        : '';

    console.log(`[${timestamp}] ${req.method} ${req.path}${queryString}`);

    // Log response details when response finishes
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        const statusColor = res.statusCode >= 500 ? '🔴' :
            res.statusCode >= 400 ? '🟡' :
                res.statusCode >= 300 ? '🔵' : '🟢';
        if (res.statusCode !== 304) {
            console.log(
                `${statusColor} [${timestamp}] ${req.method} ${req.path}${queryString} - ` +
                `${res.statusCode} ${res.statusMessage || ''} (${duration}ms)`
            );
        }


        // Log additional info for API endpoints
        if (req.path.startsWith('/api/')) {
            const logInfo: any = {
                endpoint: `${req.method} ${req.path}`,
                status: res.statusCode,
                duration: `${duration}ms`,
                timestamp
            };

            if (Object.keys(req.query).length > 0) {
                logInfo.query = req.query;
            }

            if (req.params && Object.keys(req.params).length > 0) {
                logInfo.params = req.params;
            }

            // Log response size if available
            const contentLength = res.get('content-length');
            if (contentLength) {
                logInfo.responseSize = `${(parseInt(contentLength) / 1024).toFixed(2)}KB`;
            }

            //console.log('📊 API Usage:', JSON.stringify(logInfo, null, 2));
        }
    });

    next();
});

// Helper to format currency
const formatMoney = (value: number) => {
    if (value >= 1e9) {
        return `$${(value / 1e9).toFixed(1)}B`;
    }
    if (value >= 1e6) {
        return `$${(value / 1e6).toFixed(1)}M`;
    }
    return `$${value.toLocaleString()}`;
    // Auth Imports
};

import { generateNonce, verifySignatureAndLogin, verifyToken } from './auth';

// --- Auth Routes ---

// GET /auth/nonce/:address
app.get('/auth/nonce/:address', async (req, res) => {
    try {
        const { address } = req.params;
        const nonce = await generateNonce(address);
        res.json({ nonce });
    } catch (error) {
        console.error("Error generating nonce:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// POST /auth/verify
app.post('/auth/verify', async (req, res) => {
    try {
        const { address, signature } = req.body;
        if (!address || !signature) return res.status(400).json({ error: "Missing fields" });

        const { token, user } = await verifySignatureAndLogin(address, signature);
        res.json({ token, user });
    } catch (error: any) {
        console.error("Auth error:", error.message);
        res.status(401).json({ error: error.message || "Authentication failed" });
    }
});

// GET /user/me (Protected Session Check)
app.get('/user/me', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(' ')[1];
    const decoded: any = verifyToken(token);

    if (!decoded) {
        return res.status(403).json({ error: "Invalid token" });
    }

    // Refresh user data from DB to get latest status
    const user = await db.select().from(users).where(eq(users.id, decoded.id)).limit(1);

    if (user.length === 0) return res.status(404).json({ error: "User not found" });

    res.json({ user: user[0] });
});

// --- End Auth Routes ---

import adminRouter from './routes/admin';
import luckyWheelRouter from './routes/luckyWheel';
import { adminAuth } from './middleware/adminAuth';

app.use('/api/admin', adminAuth, adminRouter);
app.use('/api/membership', luckyWheelRouter);


// GET /api/protocols
app.get('/api/protocols', async (req, res) => {
    try {
        const {
            search,
            category,
            chain,
            rating,
            minScore,
            maxScore,
            minTvl,
            maxTvl,
            sort,
            page = 1,
            limit = 20
        } = req.query;

        // Build filters
        const filters = [];

        if (search) {
            filters.push(like(protocols.name, `%${search}%`));
        }

        if (category) {
            const categories = (category as string).split(',');
            filters.push(inArray(protocols.category, categories));
        }

        if (chain) {
            // Note: chains is stored as JSON string ["Ethereum", "Arbitrum"]
            // Simple like check for now, ideally full text search or normalized table
            const chainList = (chain as string).split(',');
            // OR logic for chains: if protocol has ANY of the selected chains
            const chainFilters = chainList.map(c => like(protocols.chains, `%${c}%`));
            if (chainFilters.length > 0) {
                filters.push(or(...chainFilters));
            }
        }

        if (rating) {
            const ratings = (rating as string).split(',');
            filters.push(inArray(protocols.rating, ratings));
        }

        if (minScore !== undefined) {
            filters.push(gte(protocols.score, Number(minScore)));
        }
        if (maxScore !== undefined) {
            filters.push(lte(protocols.score, Number(maxScore)));
        }

        if (minTvl !== undefined) {
            filters.push(gte(protocols.tvl, Number(minTvl)));
        }
        if (maxTvl !== undefined) {
            filters.push(lte(protocols.tvl, Number(maxTvl)));
        }

        // Sorting
        let orderBy = desc(protocols.score); // default
        if (sort === 'rating') {
            // This is tricky as 'rating' is text (AAA > AA > A). 
            // Ideally we map text to integer rank. For now using score as proxy or simple text sort.
            orderBy = desc(protocols.score);
        } else if (sort === 'rating-low') {
            orderBy = asc(protocols.score);
        } else if (sort === 'score-low') {
            // @ts-ignore - asc is available in drizzle-orm but might need import
            orderBy = asc(protocols.score);
        } else if (sort === 'score') {
            orderBy = desc(protocols.score);
        } else if (sort === 'tvl') {
            orderBy = desc(protocols.tvl);
        } else if (sort === 'tvl-low') {
            orderBy = asc(protocols.tvl);
        } else if (sort === 'tvl-change') {
            orderBy = desc(protocols.tvlChange7d);
        } else if (sort === 'tvl-change-low') {
            orderBy = asc(protocols.tvlChange7d);
        } else if (sort === 'newest') {
            orderBy = desc(protocols.launchDate);
        }

        // Execute query
        const allProtocols = await db.select().from(protocols)
            .where(filters.length > 0 ? and(...filters) : undefined)
            .orderBy(orderBy);

        // Fetch Top 3 Newest and Top 3 Trending for dynamic flags
        const start = Date.now();
        // New = Top 3 by Rated Date
        const topNewIds = (await db.select({ id: protocols.id }).from(protocols)
            .orderBy(desc(protocols.ratedDate))
            .limit(3)).map(p => p.id);

        // Trending = Top 3 by 30d TVL Increase
        const topTrendingIds = (await db.select({ id: protocols.id }).from(protocols)
            .orderBy(desc(protocols.tvlChange30d))
            .limit(3)).map(p => p.id);

        // Fetch data for widgets (independent of filters)
        const widgetProtocols = await db.select().from(protocols);

        // Helper to format date from timestamp to dd/mm/yyyy
        const formatDate = (timestamp: Date | null) => {
            if (!timestamp) return null;
            const d = new Date(timestamp);
            const day = String(d.getDate()).padStart(2, '0');
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const year = d.getFullYear();
            return `${month}/${day}/${year}`;
        };

        // 1. Featured Protocol (using isFeatured flag)
        const featuredRaw = widgetProtocols.find(p => p.isFeatured) || widgetProtocols[0];
        const featured = featuredRaw ? {
            name: featuredRaw.name,
            description: featuredRaw.description,
            score: featuredRaw.score,
            rating: featuredRaw.rating,
            logo: featuredRaw.logo,
            slug: featuredRaw.slug,
            tvl: formatMoney(featuredRaw.tvl || 0),
            category: featuredRaw.category,
            chains: featuredRaw.chains || [],
            auditStatus: featuredRaw.auditStatus
        } : null;

        // 2. Latest Rated (sort by ratedDate, most recent first)
        const latestRaw = widgetProtocols
            .filter(p => p.ratedDate)
            .sort((a, b) => new Date(b.ratedDate || 0).getTime() - new Date(a.ratedDate || 0).getTime())
            .slice(0, 3);
        const latestRated = latestRaw.map(p => ({
            logo: p.logo,
            name: p.name,
            rating: p.rating,
            score: p.score,
            category: p.category,
            slug: p.slug,
            ratedDate: formatDate(p.ratedDate)
        }));

        // 3. Top Rated
        const topRaw = widgetProtocols
            .sort((a, b) => (b.score || 0) - (a.score || 0))
            .slice(0, 3);
        const topRated = topRaw.map((p, idx) => ({
            logo: p.logo,
            name: p.name,
            category: p.category,
            score: p.score,
            rating: p.rating,
            slug: p.slug,
            rank: idx + 1
        }));

        // Client-side pagination due to post-processing needs (or keep simple)
        const pageNum = Number(page);
        const limitNum = Number(limit);
        const startIndex = (pageNum - 1) * limitNum;
        const endIndex = startIndex + limitNum;
        const paginated = allProtocols.slice(startIndex, endIndex);

        // Parse helper
        const parseJson = (val: any) => {
            if (typeof val === 'string') {
                try { return JSON.parse(val); } catch (e) { return val; }
            }
            return val;
        };

        // Post-processing for frontend format
        const formatted = paginated.map(p => {
            const riskBreakdown = parseJson(p.riskBreakdown) || {};
            // Attempt to get yield info from metrics if available
            const metrics = parseJson(p.metrics) || {};

            return {
                id: p.id,
                slug: p.slug,
                name: p.name,
                category: p.category,
                description: p.description,
                logo: p.logo,
                rating: p.rating,
                score: p.score,
                tvl: formatMoney(p.tvl || 0),
                tvlValue: p.tvl, // Raw number for frontend calculations
                tvlChange7d: p.tvlChange7d,
                tvlHistory: parseJson(p.tvlHistory) || [],

                // Dynamic flags based on Top 3
                isNew: topNewIds.includes(p.id),
                isTrending: topTrendingIds.includes(p.id),

                hasRiskAlert: p.hasRiskAlert,
                chains: parseJson(p.chains) || [],
                auditStatus: p.auditStatus,

                // Missing fields populated
                bestApy: metrics.bestApy || 0,
                lowestApy: metrics.lowestApy || 0,
                yieldType: metrics.yieldType || 'N/A'
            };
        });

        res.json({
            data: formatted,
            pagination: {
                total: allProtocols.length,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(allProtocols.length / limitNum)
            },
            widgets: {
                featured,
                latestRated,
                topRated
            }
        });

    } catch (error) {
        console.error("Error fetching protocols:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET /api/protocols/:slug
app.get('/api/protocols/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        const result = await db.select().from(protocols).where(eq(protocols.slug, slug)).limit(1);

        if (result.length === 0) {
            return res.status(404).json({ error: "Protocol not found" });
        }

        const p = result[0];

        // Helper to safe parse JSON if it's a string
        const parseJson = (val: any) => {
            if (typeof val === 'string') {
                try {
                    return JSON.parse(val);
                } catch (e) {
                    return val;
                }
            }
            return val;
        };

        const formatted = {
            ...p,
            tvl: formatMoney(p.tvl || 0),
            tvlValue: p.tvl,
            chains: p.chains || [],

            // Explicitly parse JSON fields
            metrics: parseJson(p.metrics) || {},
            valueProposition: parseJson(p.valueProposition) || {},
            mechanics: parseJson(p.mechanics) || {},
            products: parseJson(p.products) || [],
            governance: parseJson(p.governance) || {},
            resources: parseJson(p.resources) || {},
            risks: parseJson(p.risks) || {},
            statusBadges: parseJson(p.statusBadges) || []
        };

        res.json(formatted);
    } catch (error) {
        console.error("Error fetching protocol details:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Helper to format date from timestamp to mm/dd/yyyy
const formatDate = (timestamp: Date | null) => {
    if (!timestamp) return null;
    const d = new Date(timestamp);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const year = d.getFullYear();
    return `${month}/${day}/${year}`;
};

// GET /api/membership/:walletAddress
app.get('/api/membership/:walletAddress', async (req, res) => {
    try {
        const { walletAddress } = req.params;
        const wallet = walletAddress.toLowerCase();

        // Get user
        const userResult = await db.select().from(users).where(eq(users.walletAddress, wallet)).limit(1);

        let user;

        if (userResult.length === 0) {
            // User not found -> Auto-create new user
            console.log(`Auto-creating new user for wallet: ${wallet}`);
            const userId = uuidv4();
            const memberSince = new Date();

            // 1. Insert User
            await db.insert(users).values({
                id: userId,
                walletAddress: wallet,
                email: null,
                memberSince: memberSince,
                daysRemaining: 0,
                quizCompleted: 0,
                riskAssessmentDone: false,
                tier: 'free',
                expiryDate: null
            });

            // 2. Initialize Badges
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

            // 3. Set 'user' object for response
            user = {
                id: userId,
                walletAddress: wallet,
                email: null,
                memberSince: memberSince,
                daysRemaining: 0,
                quizCompleted: 0,
                riskAssessmentDone: false,
                tier: 'free',
                expiryDate: null
            };
        } else {
            user = userResult[0];
        }

        // Get badges (now guaranteed to exist)
        const badgesResult = await db.select().from(userBadges)
            .where(eq(userBadges.userId, user.id))
            .orderBy(userBadges.badgeId);

        // Get billing history
        const billingResult = await db.select().from(billingHistory)
            .where(eq(billingHistory.userId, user.id))
            .orderBy(desc(billingHistory.date));

        // Format response
        const badges = badgesResult.map(b => ({
            badgeId: b.badgeId,
            earned: b.earned,
            nftMinted: b.nftMinted
        }));

        const billing = billingResult.map(b => ({
            id: b.id,
            plan: b.plan,
            months: b.months,
            price: b.price,
            date: formatDate(b.date),
            wallet: b.wallet,
            txHash: b.txHash
        }));

        // Calculate days remaining from expiry date
        let daysRemaining = 0;
        if (user.expiryDate) {
            const now = Date.now();
            const diff = new Date(user.expiryDate).getTime() - now;
            daysRemaining = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
        }

        res.json({
            walletAddress: user.walletAddress,
            email: user.email,
            memberSince: formatDate(user.memberSince),
            daysRemaining: daysRemaining,
            quizCompleted: user.quizCompleted,
            riskAssessmentDone: user.riskAssessmentDone,
            tier: user.tier,
            expiryDate: user.expiryDate ? new Date(user.expiryDate).getTime() : null,
            badges: badges,
            billingHistory: billing
        });

    } catch (error) {
        console.error("Error fetching membership:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// POST /api/membership
app.post('/api/membership', async (req, res) => {
    try {
        const { walletAddress, email, tier, expiryDate, months } = req.body;

        if (!walletAddress) {
            return res.status(400).json({ error: "Wallet address is required" });
        }

        const wallet = walletAddress.toLowerCase();

        // Check if user exists
        const existingUser = await db.select().from(users).where(eq(users.walletAddress, wallet)).limit(1);

        let userId: string;
        let effectiveTier: string;
        let finalExpiryDate: Date | null;

        if (existingUser.length > 0) {
            // Update existing user
            const user = existingUser[0];
            userId = user.id;
            effectiveTier = tier || user.tier;

            if (months && user.expiryDate && user.expiryDate.getTime() > Date.now()) {
                // Active membership: Extend
                const extensionMillis = months * 30 * 24 * 60 * 60 * 1000;
                finalExpiryDate = new Date(user.expiryDate.getTime() + extensionMillis);
            } else {
                // New or Expired: Use provided date or calculate fresh
                finalExpiryDate = expiryDate ? new Date(expiryDate) : (user.expiryDate || new Date());
            }

            await db.update(users)
                .set({
                    email: email || user.email,
                    tier: effectiveTier,
                    expiryDate: finalExpiryDate,
                    updatedAt: new Date()
                })
                .where(eq(users.id, userId));
        } else {
            // Create new user
            userId = uuidv4();
            const memberSince = new Date();
            effectiveTier = tier || 'free';
            finalExpiryDate = expiryDate ? new Date(expiryDate) : null;

            await db.insert(users).values({
                id: userId,
                walletAddress: wallet,
                email: email || null,
                memberSince: memberSince,
                daysRemaining: 0,
                quizCompleted: 0,
                riskAssessmentDone: false,
                tier: effectiveTier,
                expiryDate: finalExpiryDate
            });

            // Initialize 9 badges with correct contract IDs
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

        // Badge ID constants (matching BadgeNFT.sol)
        const EARLY_ADOPTER_ID = 1001;
        const PRO_MEMBER_ID = 3001;
        const SENTINEL_ELITE_ID = 3002;
        const QUIZ_BADGES = [2001, 2002, 2003, 2004, 4001, 4002];
        const ALL_BADGES = [EARLY_ADOPTER_ID, ...QUIZ_BADGES, PRO_MEMBER_ID, SENTINEL_ELITE_ID];

        // --- Common Purchase Logic (Billing & Badges) ---
        if (tier && (months || tier === 'yearly')) {
            const purchaseMonths = months || (tier === 'yearly' ? 12 : 1);
            const yearCount = Math.floor(purchaseMonths / 12);
            const monthCount = purchaseMonths % 12;
            const totalPrice = (yearCount * 99.9) + (monthCount * 9.9);

            await db.insert(billingHistory).values({
                id: uuidv4(),
                userId: userId,
                plan: tier === 'yearly' ? 'year' : tier === 'monthly' ? 'month' : 'custom',
                months: purchaseMonths,
                price: `${totalPrice.toFixed(1)} USDC`,
                date: new Date(),
                wallet: wallet,
                txHash: req.body.txHash || null
            });

            // Badge 3001: Pro Member
            if (effectiveTier !== 'free') {
                await db.update(userBadges)
                    .set({
                        earned: true,
                        nftMinted: true,
                        earnedAt: new Date(),
                        mintedAt: new Date()
                    })
                    .where(and(eq(userBadges.userId, userId), eq(userBadges.badgeId, PRO_MEMBER_ID)));

                // Early Adopter Badge (Badge 1001)
                const members = await db.select().from(users).where(isNotNull(users.memberSince));
                if (members.length <= 1000) {
                    await db.update(userBadges)
                        .set({
                            earned: true,
                            nftMinted: true,
                            earnedAt: new Date(),
                            mintedAt: new Date()
                        })
                        .where(and(eq(userBadges.userId, userId), eq(userBadges.badgeId, EARLY_ADOPTER_ID)));
                }
            }

            // Badge 3002: Sentinel Elite (annual or >12 months)
            if (purchaseMonths >= 12) {
                await db.update(userBadges)
                    .set({
                        earned: true,
                        nftMinted: true, // Auto-minted by contract for membership
                        earnedAt: new Date(),
                        mintedAt: new Date()
                    })
                    .where(and(eq(userBadges.userId, userId), eq(userBadges.badgeId, SENTINEL_ELITE_ID)));
            }
        }

        res.json({ success: true, message: existingUser.length > 0 ? "Membership updated" : "User created" });

    } catch (error) {
        console.error("Error creating/updating membership:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// PUT /api/membership/:walletAddress/badges/:badgeId
app.put('/api/membership/:walletAddress/badges/:badgeId', async (req, res) => {
    try {
        const { walletAddress, badgeId } = req.params;
        const { earned, nftMinted } = req.body;
        const wallet = walletAddress.toLowerCase();

        const userResult = await db.select().from(users).where(eq(users.walletAddress, wallet)).limit(1);
        if (userResult.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const userId = userResult[0].id;
        const badgeIdNum = parseInt(badgeId);

        await db.update(userBadges)
            .set({
                earned: earned !== undefined ? earned : undefined,
                nftMinted: nftMinted !== undefined ? nftMinted : undefined,
                earnedAt: earned ? new Date() : undefined,
                mintedAt: nftMinted ? new Date() : undefined
            })
            .where(and(
                eq(userBadges.userId, userId),
                eq(userBadges.badgeId, badgeIdNum)
            ));

        res.json({ success: true, message: "Badge updated" });
    } catch (error) {
        console.error("Error updating badge:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// PUT /api/membership/:walletAddress/quiz
app.put('/api/membership/:walletAddress/quiz', async (req, res) => {
    try {
        const { walletAddress } = req.params;
        const { quizCompleted, riskAssessmentDone } = req.body;
        const wallet = walletAddress.toLowerCase();

        await db.update(users)
            .set({
                quizCompleted: quizCompleted !== undefined ? quizCompleted : undefined,
                riskAssessmentDone: riskAssessmentDone !== undefined ? riskAssessmentDone : undefined,
                updatedAt: new Date()
            })
            .where(eq(users.walletAddress, wallet));

        res.json({ success: true, message: "Quiz data updated" });
    } catch (error) {
        console.error("Error updating quiz data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// POST /api/membership/:walletAddress/sync
app.post('/api/membership/:walletAddress/sync', async (req, res) => {
    try {
        const { walletAddress } = req.params;
        const wallet = walletAddress.toLowerCase();

        console.log(`[Sync] Verifying on-chain membership for ${wallet}...`);

        let rpcUrl = process.env.RPC_URL || 'wss://eth-sepolia.g.alchemy.com/v2/fDDwxWatjwZiVcoLzoiwN';
        if (rpcUrl.startsWith('https://')) {
            rpcUrl = rpcUrl.replace('https://', 'wss://');
        }

        const client = createPublicClient({
            chain: sepolia,
            transport: webSocket(rpcUrl)
        });

        const PAYMENT_CONTRACT_ADDRESS = "0x134002a11bB945640Fbc3427EFeBe0bf05AB6AEb"; // Sync with listeners.ts

        // Logic: Scan for 'MembershipPaid' events for this user to verify payment if listeners missed it.
        const logs = await client.getContractEvents({
            address: PAYMENT_CONTRACT_ADDRESS as `0x${string}`,
            abi: PaymentContractABI,
            eventName: 'MembershipPaid',
            args: {
                user: wallet as `0x${string}`
            },
            fromBlock: 7000000n, // Sepolia recent block (adjust if needed)
            toBlock: 'latest'
        });

        if (logs.length > 0) {
            // Find latest log
            const latestLog = logs[logs.length - 1];
            const { months, yearCount } = (latestLog as any).args;

            // Get block time
            const block = await client.getBlock({ blockHash: latestLog.blockHash });
            const timestamp = Number(block.timestamp) * 1000;

            const purchaseMillis = Number(months) * 30 * 24 * 60 * 60 * 1000;
            const expectedExpiry = timestamp + purchaseMillis;

            if (expectedExpiry > Date.now()) {
                // Valid!
                const newExpiry = new Date(expectedExpiry);
                let newTier = 'monthly';
                if (Number(yearCount) > 0) newTier = 'yearly';

                const userResult = await db.select().from(users).where(eq(users.walletAddress, wallet)).limit(1);

                if (userResult.length > 0) {
                    const user = userResult[0];
                    await db.update(users).set({
                        tier: newTier,
                        expiryDate: newExpiry,
                        updatedAt: new Date()
                    }).where(eq(users.id, user.id));

                    // Award Badge
                    const badgeId = newTier === 'yearly' ? 3002 : 3001;
                    await db.update(userBadges)
                        .set({ earned: true, nftMinted: true, earnedAt: new Date(), mintedAt: new Date() })
                        .where(and(eq(userBadges.userId, user.id), eq(userBadges.badgeId, badgeId)));

                    return res.json({ success: true, message: "Membership restored from chain history." });
                }
            } else {
                return res.json({ success: false, message: "Membership expired." });
            }
        } else {
            return res.json({ success: false, message: "No payment history found on-chain." });
        }
    } catch (error) {
        console.error("Error syncing membership:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// GET /api/game/:walletAddress/progress
app.get('/api/game/:walletAddress/progress', async (req, res) => {
    try {
        const { walletAddress } = req.params;
        const wallet = walletAddress.toLowerCase();

        const userResult = await db.select().from(users).where(eq(users.walletAddress, wallet)).limit(1);

        if (userResult.length === 0) {
            console.log(`Auto-creating new user (game) for wallet: ${wallet}`);
            const userId = uuidv4();

            // Create user with default progress
            await db.insert(users).values({
                id: userId,
                walletAddress: wallet,
                email: null,
                memberSince: new Date(),
                daysRemaining: 0,
                quizCompleted: 0,
                riskAssessmentDone: false,
                tier: 'free',
                expiryDate: null,
                gameProgress: {
                    easy: { completed: false, score: 0, bestScore: 0, minted: false },
                    medium: { completed: false, score: 0, bestScore: 0, minted: false },
                    hard: { completed: false, score: 0, bestScore: 0, minted: false },
                    risk: { completed: false, score: 0, minted: false }
                }
            });

            // Initialize Badges
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

            // Return default progress
            return res.json({
                easy: { completed: false, score: 0, bestScore: 0, minted: false },
                medium: { completed: false, score: 0, bestScore: 0, minted: false },
                hard: { completed: false, score: 0, bestScore: 0, minted: false },
                risk: { completed: false, score: 0, minted: false }
            });
        }

        const user = userResult[0];
        const gameProgress = user.gameProgress || {
            easy: { completed: false, score: 0, bestScore: 0, minted: false },
            medium: { completed: false, score: 0, bestScore: 0, minted: false },
            hard: { completed: false, score: 0, bestScore: 0, minted: false },
            risk: { completed: false, score: 0, minted: false }
        };

        res.json(gameProgress);
    } catch (error) {
        console.error("Error fetching game progress:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// PUT /api/game/:walletAddress/progress
app.put('/api/game/:walletAddress/progress', async (req, res) => {
    try {
        const { walletAddress } = req.params;
        const { progress } = req.body; // Full progress object
        const wallet = walletAddress.toLowerCase();

        const userResult = await db.select().from(users).where(eq(users.walletAddress, wallet)).limit(1);

        let userId: string;

        if (userResult.length === 0) {
            // If user doesn't exist yet (brand new wallet), create a minimal profile + badges
            userId = uuidv4();

            await db.insert(users).values({
                id: userId,
                walletAddress: wallet,
                email: null,
                memberSince: new Date(),
                daysRemaining: 0,
                quizCompleted: 0,
                riskAssessmentDone: false,
                tier: 'free',
                expiryDate: null,
                gameProgress: progress,
            });

            // Initialize 9 badges (all locked initially)
            const ALL_BADGES = [1001, 2001, 2002, 2003, 2004, 3001, 3002, 4001, 4002];
            for (const bId of ALL_BADGES) {
                await db.insert(userBadges).values({
                    id: uuidv4(),
                    userId,
                    badgeId: bId,
                    earned: false,
                    nftMinted: false,
                    earnedAt: null,
                    mintedAt: null,
                });
            }
        } else {
            userId = userResult[0].id;
        }

        // Update game progress
        await db.update(users)
            .set({
                gameProgress: progress,
                updatedAt: new Date()
            })
            .where(eq(users.id, userId));

        // Update badges based on quiz completions
        // Badge 2: DeFi Novice (easy quiz)
        if (progress.easy?.completed) {
            await db.update(userBadges)
                .set({ earned: true, earnedAt: new Date() })
                .where(and(eq(userBadges.userId, userId), eq(userBadges.badgeId, 2001)));
        }

        // Badge 3: DeFi Intermediate (medium quiz)
        if (progress.medium?.completed) {
            await db.update(userBadges)
                .set({ earned: true, earnedAt: new Date() })
                .where(and(eq(userBadges.userId, userId), eq(userBadges.badgeId, 2002)));
        }

        // Badge 4: DeFi Master (hard quiz)
        if (progress.hard?.completed) {
            await db.update(userBadges)
                .set({ earned: true, earnedAt: new Date() })
                .where(and(eq(userBadges.userId, userId), eq(userBadges.badgeId, 2003)));
        }

        // Badge 5: Risk Guardian (risk assessment)
        if (progress.risk?.completed) {
            await db.update(userBadges)
                .set({ earned: true, earnedAt: new Date() })
                .where(and(eq(userBadges.userId, userId), eq(userBadges.badgeId, 2004)));
        }

        // Update NFT minted status
        if (progress.easy?.minted) {
            await db.update(userBadges)
                .set({ nftMinted: true, mintedAt: new Date() })
                .where(and(eq(userBadges.userId, userId), eq(userBadges.badgeId, 2001)));
        }
        if (progress.medium?.minted) {
            await db.update(userBadges)
                .set({ nftMinted: true, mintedAt: new Date() })
                .where(and(eq(userBadges.userId, userId), eq(userBadges.badgeId, 2002)));
        }
        if (progress.hard?.minted) {
            await db.update(userBadges)
                .set({ nftMinted: true, mintedAt: new Date() })
                .where(and(eq(userBadges.userId, userId), eq(userBadges.badgeId, 2003)));
        }
        if (progress.risk?.minted) {
            await db.update(userBadges)
                .set({ nftMinted: true, mintedAt: new Date() })
                .where(and(eq(userBadges.userId, userId), eq(userBadges.badgeId, 2004)));
        }

        // Update quizCompleted count
        const completedCount = [
            progress.easy?.completed,
            progress.medium?.completed,
            progress.hard?.completed
        ].filter(Boolean).length;

        await db.update(users)
            .set({
                quizCompleted: completedCount,
                riskAssessmentDone: progress.risk?.completed || false,
                updatedAt: new Date()
            })
            .where(eq(users.id, userId));

        res.json({ success: true, message: "Game progress updated" });
    } catch (error) {
        console.error("Error updating game progress:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET /api/homepage
app.get('/api/homepage', async (req, res) => {
    try {
        // 0. Get CMS Configuration
        const cmsConfigResult = await db.select().from(homepageConfig).limit(1);
        const cmsConfig = cmsConfigResult.length > 0 ? cmsConfigResult[0] : null;

        // 1. Featured Research Article (highest popularityScore or most recent)
        const featuredArticle = await db.select().from(articles)
            .orderBy(desc(articles.popularityScore), desc(articles.publishedAt))
            .limit(1);

        // 2. Security Alerts (active alerts, sorted by severity and date)
        const securityAlerts = await db.select().from(alerts)
            .where(and(eq(alerts.active, true), eq(alerts.type, 'security')))
            .orderBy(desc(alerts.createdAt))
            .limit(3);

        // 3. Top Strategies (highest APY for each risk level: Low, Medium, High)
        const lowRiskStrategy = await db.select().from(strategies)
            .where(eq(strategies.riskLevel, 'Low'))
            .orderBy(desc(strategies.apy))
            .limit(1);

        const mediumRiskStrategy = await db.select().from(strategies)
            .where(eq(strategies.riskLevel, 'Middle'))
            .orderBy(desc(strategies.apy))
            .limit(1);

        const highRiskStrategy = await db.select().from(strategies)
            .where(eq(strategies.riskLevel, 'High'))
            .orderBy(desc(strategies.apy))
            .limit(1);

        // Helper to map risk level to default rating
        const getRatingFromRisk = (riskLevel: string | null) => {
            if (riskLevel === 'Low') return 'A';
            if (riskLevel === 'Medium') return 'BBB';
            if (riskLevel === 'High') return 'BB';
            return 'BBB';
        };

        const topStrategies = [
            ...lowRiskStrategy,
            ...mediumRiskStrategy,
            ...highRiskStrategy
        ].slice(0, 3).map(s => ({
            ...s,
            rating: getRatingFromRisk(s.riskLevel),
            apyFormatted: `${s.apy?.toFixed(1) || '0'}%`,
        }));

        // 4. Newly Rated Protocols (3 most recently rated - same as protocols list)
        const newlyRated = await db.select().from(protocols)
            .where(isNotNull(protocols.ratedDate))
            .orderBy(desc(protocols.ratedDate))
            .limit(3);

        // 5. Top Rated Protocols (top 7 by score)
        const topRated = await db.select().from(protocols)
            .orderBy(desc(protocols.score))
            .limit(7);

        // Format responses
        const formatDate = (timestamp: Date | null) => {
            if (!timestamp) return null;
            const d = new Date(timestamp);
            const day = String(d.getDate()).padStart(2, '0');
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const year = d.getFullYear();
            return `${month}/${day}/${year}`;
        };

        res.json({
            cms: cmsConfig ? {
                featured: {
                    titleLine1: cmsConfig.featuredTitleLine1,
                    titleLine2: cmsConfig.featuredTitleLine2,
                    description: cmsConfig.featuredDescription,
                    link: cmsConfig.featuredLink,
                    readTime: cmsConfig.featuredReadTime
                },
                insight1: {
                    title: cmsConfig.insight1Title,
                    description: cmsConfig.insight1Description,
                    link: cmsConfig.insight1Link
                },
                insight2: {
                    title: cmsConfig.insight2Title,
                    description: cmsConfig.insight2Description,
                    link: cmsConfig.insight2Link
                }
            } : null,
            featuredResearch: featuredArticle.length > 0 ? {
                id: featuredArticle[0].id,
                slug: featuredArticle[0].slug,
                title: featuredArticle[0].title,
                summary: featuredArticle[0].summary,
                coverImage: featuredArticle[0].coverImage,
                publishedAt: featuredArticle[0].publishedAt ? formatDate(featuredArticle[0].publishedAt) : null,
            } : null,
            securityAlerts: securityAlerts.map(a => ({
                type: a.type,
                title: a.title,
                message: a.message,
                severity: a.severity,
            })),
            topStrategies: topStrategies.map(s => ({
                name: s.name,
                apy: s.apyFormatted,
                rating: s.rating,
                risk: s.riskLevel === 'Low' ? 'Low' : s.riskLevel === 'Medium' ? 'Medium' : 'High',
                type: s.type || 'Yield',
            })),
            newlyRated: newlyRated.map(p => ({
                name: p.name,
                slug: p.slug,
                rating: p.rating,
                logo: p.logo,
                ratedDate: p.ratedDate ? formatDate(p.ratedDate) : null,
            })),
            topRated: topRated.map(p => ({
                id: p.id,
                name: p.name,
                slug: p.slug,
                category: p.category,
                score: p.score,
                rating: p.rating,
                logo: p.logo,
            })),
        });

    } catch (error) {
        console.error("Error fetching homepage data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET /api/strategies
app.get('/api/strategies', async (req, res) => {
    try {
        const allStrategies = await db.select().from(strategies).orderBy(desc(strategies.apy));
        res.json(allStrategies);
    } catch (error) {
        console.error("Error fetching strategies:", error);
        res.status(500).json({ error: "Failed to fetch strategies" });
    }
});

// GET /api/strategies/:id
app.get('/api/strategies/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.select().from(strategies).where(eq(strategies.id, id)).limit(1);

        if (result.length === 0) {
            return res.status(404).json({ error: "Strategy not found" });
        }

        res.json(result[0]);
    } catch (error) {
        console.error("Error fetching strategy:", error);
        res.status(500).json({ error: "Failed to fetch strategy" });
    }
});

// GET /api/ads
app.get('/api/ads', async (req, res) => {
    try {
        const result = await db.select().from(ads).where(eq(ads.isActive, true)).limit(1);
        if (result.length === 0) {
            return res.status(404).json({ error: "No active ads found" });
        }
        res.json(result[0]);
    } catch (error) {
        console.error("Error fetching ads:", error);
        res.status(500).json({ error: "Failed to fetch ads" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
