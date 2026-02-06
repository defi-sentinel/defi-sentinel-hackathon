/**
 * CoinGecko API Client
 * Fetches token price, market cap, and historical price data
 */

export const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3';

// Helper to add auth header if API key exists (read at request time, not module load)
function getHeaders(): HeadersInit {
    const apiKey = process.env.COINGECKO_API_KEY;
    if (apiKey) {
        return { 'x-cg-demo-api-key': apiKey };
    }
    return {};
}

export interface TokenPriceData {
    price: number;
    marketCap: number;
    priceChange24h: number;
}

export interface PriceHistoryPoint {
    date: string; // ISO date string
    price: number;
}

/**
 * Fetch current token price and market cap (with retry on rate limit)
 */
export async function fetchTokenPrice(coingeckoId: string, retries = 3): Promise<TokenPriceData | null> {
    if (!coingeckoId) return null;

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const url = `${COINGECKO_API_BASE}/simple/price?ids=${coingeckoId}&vs_currencies=usd&include_market_cap=true&include_24hr_change=true`;
            const response = await fetch(url, { headers: getHeaders() });

            if (response.status === 429) {
                // Rate limited - wait with exponential backoff
                const waitTime = attempt * 5000; // 5s, 10s, 15s
                console.warn(`[CoinGecko] Rate limited for ${coingeckoId}, waiting ${waitTime / 1000}s (attempt ${attempt}/${retries})`);
                await delay(waitTime);
                continue;
            }

            if (response.status === 401) {
                // 401 = Unauthorized - API key required, don't retry
                console.warn(`[CoinGecko] 401 Unauthorized for ${coingeckoId} - may need API key`);
                return null;
            }

            if (!response.ok) {
                // Other errors - return null, don't throw
                console.warn(`[CoinGecko] Failed to fetch price for ${coingeckoId}: ${response.status}`);
                return null;
            }

            const data: any = await response.json();
            const tokenData = data[coingeckoId];

            if (!tokenData) return null;

            return {
                price: tokenData.usd || 0,
                marketCap: tokenData.usd_market_cap || 0,
                priceChange24h: tokenData.usd_24h_change || 0,
            };
        } catch (error) {
            if (attempt === retries) {
                console.error(`[CoinGecko] Failed to fetch price for ${coingeckoId} after ${retries} attempts:`, error);
                return null;
            }
        }
    }
    return null;
}

/**
 * Fetch historical price data for charting (with retry on rate limit)
 * @param days - Number of days (7, 30, 365, 'max')
 */
export async function fetchTokenPriceHistory(
    coingeckoId: string,
    days: number | 'max',
    retries = 3
): Promise<PriceHistoryPoint[]> {
    if (!coingeckoId) return [];

    // Demo API may not support 'max' - limit to 365 days
    const actualDays = days === 'max' ? 365 : days;

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            // Use query parameter for API key as recommended by CoinGecko docs
            const apiKey = process.env.COINGECKO_API_KEY;
            const apiKeyParam = apiKey ? `&x_cg_demo_api_key=${apiKey}` : '';
            const url = `${COINGECKO_API_BASE}/coins/${coingeckoId}/market_chart?vs_currency=usd&days=${actualDays}${apiKeyParam}`;
            const response = await fetch(url);

            if (response.status === 429) {
                const waitTime = attempt * 5000;
                console.warn(`[CoinGecko] Rate limited for ${coingeckoId} history, waiting ${waitTime / 1000}s (attempt ${attempt}/${retries})`);
                await delay(waitTime);
                continue;
            }

            if (response.status === 401) {
                // 401 = Unauthorized - API key required for this endpoint, don't retry
                console.warn(`[CoinGecko] 401 Unauthorized for ${coingeckoId} history - may need API key`);
                return [];
            }

            if (!response.ok) {
                // Other errors - return empty, don't throw
                console.warn(`[CoinGecko] Failed to fetch price history for ${coingeckoId}: ${response.status}`);
                return [];
            }

            const data: any = await response.json();
            const prices: [number, number][] = data.prices || [];

            // Convert to our format with ISO date strings
            return prices.map(([timestamp, price]) => ({
                date: new Date(timestamp).toISOString().split('T')[0], // YYYY-MM-DD
                price: price,
            }));
        } catch (error) {
            if (attempt === retries) {
                console.error(`[CoinGecko] Failed to fetch price history for ${coingeckoId} after ${retries} attempts:`, error);
                return [];
            }
        }
    }
    return [];
}

/**
 * Fetch all price history ranges needed for frontend (7d, 30d, all)
 */
export async function fetchTokenPriceHistoryRanges(coingeckoId: string): Promise<{
    day7: number[];
    day30: number[];
    all: number[];
} | null> {
    if (!coingeckoId) return null;

    try {
        // Fetch max history (includes all data)
        const allHistory = await fetchTokenPriceHistory(coingeckoId, 'max');

        if (allHistory.length === 0) return null;

        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        // Filter by date ranges
        const day7 = allHistory
            .filter(p => new Date(p.date) >= sevenDaysAgo)
            .map(p => p.price);

        const day30 = allHistory
            .filter(p => new Date(p.date) >= thirtyDaysAgo)
            .map(p => p.price);

        // For 'all', sample to reasonable number of points (e.g., ~100)
        const all = sampleArray(allHistory.map(p => p.price), 100);

        return { day7, day30, all };
    } catch (error) {
        console.error(`Error fetching token price history ranges for ${coingeckoId}:`, error);
        return null;
    }
}

/**
 * Sample an array to a target size (evenly spaced)
 */
function sampleArray(arr: number[], targetSize: number): number[] {
    if (arr.length <= targetSize) return arr;

    const step = arr.length / targetSize;
    const result: number[] = [];

    for (let i = 0; i < targetSize; i++) {
        const index = Math.floor(i * step);
        result.push(arr[index]);
    }

    // Always include the last element
    if (result[result.length - 1] !== arr[arr.length - 1]) {
        result[result.length - 1] = arr[arr.length - 1];
    }

    return result;
}

/**
 * Add rate limiting delay to avoid CoinGecko rate limits
 */
export function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}
