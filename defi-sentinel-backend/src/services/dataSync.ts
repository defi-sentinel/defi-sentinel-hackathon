/**
 * Data Sync Service
 * Fetches and updates protocol data from DefiLlama and CoinGecko APIs
 */

import { db } from '../db';
import { protocols } from '../db/schema';
import { eq } from 'drizzle-orm';
import {
    fetchCurrentTvl,
    fetchTvlHistoryWithDates,
    processTvlHistoryRanges,
    fetchProtocolFees,
    calculateAnnualizedRevenue,
    fetchRevenueHistoryWithDates,
} from '../api/defillama';
import {
    fetchTokenPrice,
    fetchTokenPriceHistoryRanges,
    delay,
} from '../api/coingecko';

// Rate limit delays (ms)
const DEFILLAMA_DELAY = 200;  // DefiLlama is generous
const COINGECKO_DELAY = 1200; // CoinGecko free tier: ~50 requests/min

/**
 * Merge multiple TVL history arrays by date, summing values for same dates
 */
function mergeTvlHistories(histories: { date: string; tvl: number }[][]): { date: string; tvl: number }[] {
    if (histories.length === 0) return [];
    if (histories.length === 1) return histories[0];

    // 1. Find the latest date across all histories
    let latestDate = '';
    for (const h of histories) {
        if (h.length > 0) {
            const lastDate = h[h.length - 1].date;
            if (lastDate > latestDate) latestDate = lastDate;
        }
    }

    // 2. Forward-fill lagging histories to match the latest date
    // This handles cases where one protocol version's data is delayed (e.g. V4 lagging 1 day behind V3)
    // so we use its last known value to prevent a massive drop in the aggregated total.
    for (const h of histories) {
        if (h.length === 0) continue;
        const lastPoint = h[h.length - 1];
        if (lastPoint.date < latestDate) {
            h.push({ date: latestDate, tvl: lastPoint.tvl });
        }
    }

    // Create a map of date -> total TVL
    const dateMap = new Map<string, number>();

    for (const history of histories) {
        for (const point of history) {
            const existing = dateMap.get(point.date) || 0;
            dateMap.set(point.date, existing + point.tvl);
        }
    }

    // Convert map back to sorted array
    return Array.from(dateMap.entries())
        .map(([date, tvl]) => ({ date, tvl }))
        .sort((a, b) => a.date.localeCompare(b.date));
}

export interface SyncResult {
    slug: string;
    success: boolean;
    error?: string;
}

/**
 * Sync data for a single protocol
 */
export async function syncProtocolData(slug: string): Promise<SyncResult> {
    console.log(`[DataSync] Syncing protocol: ${slug}`);

    try {
        // 1. First get protocol from DB to check slug fields
        const existing = await db.select().from(protocols).where(eq(protocols.slug, slug)).limit(1);
        if (existing.length === 0) {
            return { slug, success: false, error: 'Protocol not found in database' };
        }

        const protocol = existing[0];
        const defillamaSlug = protocol.defillamaSlug;
        const coingeckoSlug = protocol.coingeckoSlug;

        const existingMetrics = typeof protocol.metrics === 'string'
            ? JSON.parse(protocol.metrics)
            : (protocol.metrics || {});
        const existingGovernance = typeof protocol.governance === 'string'
            ? JSON.parse(protocol.governance)
            : (protocol.governance || {});

        // 2. Fetch TVL data (skip if no defillamaSlug)
        let currentTvl = protocol.tvl || 0;
        let tvlRanges: { day7: number[], day30: number[], all: number[], tvlChange7d: number, tvlChange30d: number } = { day7: [], day30: [], all: [], tvlChange7d: 0, tvlChange30d: 0 };
        let annualizedRevenue = 0;

        // Parse defillamaSlug - can be array, string, or null
        let defillamaSlugs: string[] = [];
        if (Array.isArray(defillamaSlug)) {
            defillamaSlugs = defillamaSlug.filter(s => s && s !== '');
        } else if (typeof defillamaSlug === 'string' && defillamaSlug !== '') {
            defillamaSlugs = [defillamaSlug];
        }

        if (defillamaSlugs.length > 0) {
            console.log(`[DataSync] Fetching TVL from ${defillamaSlugs.length} DefiLlama slug(s): ${defillamaSlugs.join(', ')}`);

            // Aggregate TVL from all slugs
            let totalTvl = 0;
            let allTvlHistories: { date: string; tvl: number }[][] = [];
            let allRevenueHistories: { date: string; tvl: number }[][] = [];
            let totalRevenue = 0;

            for (const dfSlug of defillamaSlugs) {
                const tvl = await fetchCurrentTvl(dfSlug);
                if (tvl) totalTvl += tvl;
                await delay(DEFILLAMA_DELAY);

                const tvlHistory = await fetchTvlHistoryWithDates(dfSlug);
                if (tvlHistory.length > 0) allTvlHistories.push(tvlHistory);
                await delay(DEFILLAMA_DELAY);

                const fees = await fetchProtocolFees(dfSlug);
                totalRevenue += calculateAnnualizedRevenue(fees);
                await delay(DEFILLAMA_DELAY);

                // Fetch Revenue/Fees History
                const revHistory = await fetchRevenueHistoryWithDates(dfSlug);
                console.log(`[Debug] Slug ${dfSlug} revenue history points: ${revHistory.length}`);
                if (revHistory.length > 0) allRevenueHistories.push(revHistory);
                await delay(DEFILLAMA_DELAY);
            }

            currentTvl = totalTvl || protocol.tvl || 0;
            annualizedRevenue = totalRevenue;

            // Aggregate TVL histories by merging on date
            if (allTvlHistories.length > 0) {
                // Use first history as base, then add others
                const merged = mergeTvlHistories(allTvlHistories);
                tvlRanges = processTvlHistoryRanges(merged);
            }

            // Aggregate Revenue histories
            if (allRevenueHistories.length > 0) {
                console.log(`[Debug] Aggregating ${allRevenueHistories.length} revenue histories`);
                const mergedRev = mergeTvlHistories(allRevenueHistories);
                // We reuse processTvlHistoryRanges for revenue as it does same 7d/30d filter + sampling
                const revRanges = processTvlHistoryRanges(mergedRev);
                // We will store this in a separate variable to save to DB
                (tvlRanges as any).revenueHistory = {
                    day7: revRanges.day7,
                    day30: revRanges.day30,
                    all: revRanges.all
                };
            } else {
                console.log("[Debug] No revenue history found for any slug.");
            }
        } else {
            console.log(`[DataSync] Skipping TVL sync for ${slug} (no defillamaSlug)`);
        }

        // 3. Fetch token price data (skip if no coingeckoSlug)
        let tokenData = existingGovernance.token || null;

        if (coingeckoSlug && coingeckoSlug !== '') {
            await delay(COINGECKO_DELAY);
            const priceData = await fetchTokenPrice(coingeckoSlug);

            if (priceData) {
                await delay(COINGECKO_DELAY);
                const priceHistory = await fetchTokenPriceHistoryRanges(coingeckoSlug);

                tokenData = {
                    symbol: existingGovernance.token?.symbol || coingeckoSlug.toUpperCase(),
                    price: priceData.price,
                    marketCap: priceData.marketCap,
                    history: priceHistory || { day7: [], day30: [], all: [] },
                };
            } else {
                console.log(`[DataSync] No token price found for ${slug} (CoinGecko ID: ${coingeckoSlug})`);
            }
        } else {
            console.log(`[DataSync] Skipping token sync for ${slug} (no coingeckoSlug)`);
        }

        // 6. Build updated data
        const updatedMetrics = {
            ...existingMetrics,
            tvlChange7d: tvlRanges.tvlChange7d,
            tvlChange30d: tvlRanges.tvlChange30d,
            revenueAnnualized: annualizedRevenue,
        };

        const updatedGovernance = {
            ...existingGovernance,
            token: tokenData,
        };

        // Store TVL history as object with ranges for frontend
        const tvlHistoryData = {
            day7: tvlRanges.day7,
            day30: tvlRanges.day30,
            all: tvlRanges.all,
        };

        // 7. Update database
        await db.update(protocols)
            .set({
                tvl: currentTvl || protocol.tvl,
                tvlChange7d: tvlRanges.tvlChange7d,
                tvlChange30d: tvlRanges.tvlChange30d,
                tvlHistory: tvlHistoryData,
                revenueHistory: (tvlRanges as any).revenueHistory || null,
                metrics: updatedMetrics,
                governance: updatedGovernance,
            })
            .where(eq(protocols.slug, slug));

        console.log(`[DataSync] ✓ Synced ${slug}: TVL=$${currentTvl?.toLocaleString()}, 7d=${tvlRanges.tvlChange7d.toFixed(2)}%`);
        return { slug, success: true };

    } catch (error: any) {
        console.error(`[DataSync] ✗ Failed to sync ${slug}:`, error.message);
        return { slug, success: false, error: error.message };
    }
}

/**
 * Sync all protocols in the database
 */
export async function syncAllProtocols(): Promise<SyncResult[]> {
    console.log('[DataSync] Starting full sync of all protocols...');
    const startTime = Date.now();

    // Get all protocol slugs
    const allProtocols = await db.select({ slug: protocols.slug }).from(protocols);
    console.log(`[DataSync] Found ${allProtocols.length} protocols to sync`);

    const results: SyncResult[] = [];

    for (const { slug } of allProtocols) {
        const result = await syncProtocolData(slug);
        results.push(result);

        // Small delay between protocols to be nice to APIs
        await delay(500);
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    const successCount = results.filter(r => r.success).length;
    console.log(`[DataSync] Completed: ${successCount}/${results.length} protocols synced in ${elapsed}s`);

    return results;
}

/**
 * Schedule daily sync at UTC 00:00
 */
export function scheduleDailySync(syncFn: () => Promise<any>): void {
    const runAtMidnightUTC = () => {
        const now = new Date();
        const nextMidnight = new Date(Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate() + 1, // Next day
            0, 0, 0, 0 // Midnight UTC
        ));

        const msUntilMidnight = nextMidnight.getTime() - now.getTime();
        console.log(`[DataSync] Next sync scheduled in ${(msUntilMidnight / 3600000).toFixed(1)} hours (UTC 00:00)`);

        setTimeout(async () => {
            console.log('[DataSync] Running scheduled daily sync...');
            await syncFn();

            // Schedule next run (24 hours from now)
            setInterval(syncFn, 24 * 60 * 60 * 1000);
        }, msUntilMidnight);
    };

    runAtMidnightUTC();
}

/**
 * Initialize data sync on backend startup
 */
export async function initializeDataSync(): Promise<void> {
    console.log('[DataSync] Initializing data sync service...');

    // Run immediate sync on startup
    await syncAllProtocols();

    // Schedule daily sync at UTC 00:00
    scheduleDailySync(syncAllProtocols);

    console.log('[DataSync] Data sync service initialized');
}
