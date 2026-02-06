export const DEFILLAMA_API_BASE = 'https://api.llama.fi';
export const YIELDS_API_BASE = 'https://yields.llama.fi';

const SLUG_MAPPING: Record<string, string> = {
  'ena': 'ethena',
  'rocketpool': 'rocket-pool',
  'maker': 'makerdao',
};

// Mapping for Yields API project names (different from protocol slugs sometimes)
const YIELD_PROJECT_MAPPING: Record<string, string[]> = {
  'pendle': ['pendle'],
  'aave': ['aave-v3', 'aave-v2'],
  'uniswap': ['uniswap-v3'],
  'lido': ['lido'],
  'curve': ['curve-dex'], // example, verify if needed
  'rocketpool': ['rocket-pool'],
  'ena': ['ethena'], // verify
};

export function getDefiLlamaSlug(projectSlug: string): string {
  return SLUG_MAPPING[projectSlug] || projectSlug;
}

export function getYieldProjectNames(projectSlug: string): string[] {
  return YIELD_PROJECT_MAPPING[projectSlug] || [projectSlug];
}

export interface DefiLlamaProtocolData {
  id: string;
  name: string;
  symbol: string;
  url: string;
  description: string;
  chain: string;
  logo: string;
  chains: string[];
  tvl: number;
  chainTvls: Record<string, number>;
  change_1h: number;
  change_1d: number;
  change_7d: number;
}

export interface YieldPool {
  chain: string;
  project: string;
  symbol: string;
  tvlUsd: number;
  apy: number;
  apyBase: number;
  apyReward: number;
  pool: string; // Unique ID
  stablecoin: boolean;
  ilRisk: string; // yes/no/...
  exposure: string; // multi/single
  predictions?: {
    predictedClass: string;
    predictedProbability: number;
    binnedConfidence: number;
  };
}

export async function fetchProtocolData(slug: string): Promise<DefiLlamaProtocolData | null> {
  const apiSlug = getDefiLlamaSlug(slug);
  try {
    const response = await fetch(`${DEFILLAMA_API_BASE}/protocol/${apiSlug}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch data for ${apiSlug}`);
    }
    const data: any = await response.json();

    return {
      id: data.id,
      name: data.name,
      symbol: data.symbol,
      url: data.url,
      description: data.description,
      chain: data.chain,
      logo: data.logo,
      chains: data.chains,
      tvl: data.tvl[data.tvl.length - 1]?.totalLiquidityUSD || 0,
      chainTvls: data.chainTvls,
      change_1h: data.change_1h,
      change_1d: data.change_1d,
      change_7d: data.change_7d,
    };
  } catch (error) {
    console.error(`Error fetching DefiLlama data for ${slug}:`, error);
    return null;
  }
}

export async function fetchCurrentTvl(slug: string): Promise<number | null> {
  const apiSlug = getDefiLlamaSlug(slug);
  try {
    const response = await fetch(`${DEFILLAMA_API_BASE}/tvl/${apiSlug}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch TVL for ${apiSlug}`);
    }
    const tvl = await response.json();
    return typeof tvl === 'number' ? tvl : null;
  } catch (error) {
    console.error(`Error fetching TVL for ${slug}:`, error);
    return null;
  }
}

export interface TvlDataPoint {
  date: number;
  totalLiquidityUSD: number;
}

export async function fetchTvlHistory(slug: string): Promise<TvlDataPoint[]> {
  const apiSlug = getDefiLlamaSlug(slug);
  try {
    const response = await fetch(`${DEFILLAMA_API_BASE}/protocol/${apiSlug}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch chart data for ${apiSlug}`);
    }
    const data: any = await response.json();
    return (data.tvl as TvlDataPoint[]) || [];
  } catch (error) {
    console.error(`Error fetching TVL history for ${slug}:`, error);
    return [];
  }
}

export async function fetchYields(slug: string): Promise<YieldPool[]> {
  const projectNames = getYieldProjectNames(slug);
  try {
    const response = await fetch(`${YIELDS_API_BASE}/pools`);
    if (!response.ok) {
      throw new Error(`Failed to fetch yields`);
    }
    const data: any = await response.json();

    // Filter pools for this project
    // API returns data.data as array of pools
    const pools = (data.data as YieldPool[]).filter(pool =>
      projectNames.some(name => pool.project.toLowerCase() === name.toLowerCase())
    );

    // Sort by TVL desc
    return pools.sort((a, b) => b.tvlUsd - a.tvlUsd);
  } catch (error) {
    console.error(`Error fetching yields for ${slug}:`, error);
    return [];
  }
}

// ===== Enhanced Functions for Data Sync =====

export interface TvlHistoryWithDate {
  date: string; // ISO date string (YYYY-MM-DD)
  tvl: number;
}

/**
 * Fetch TVL history with proper date formatting
 */
export async function fetchTvlHistoryWithDates(slug: string): Promise<TvlHistoryWithDate[]> {
  const apiSlug = getDefiLlamaSlug(slug);
  try {
    const response = await fetch(`${DEFILLAMA_API_BASE}/protocol/${apiSlug}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch TVL history for ${apiSlug}`);
    }
    const data: any = await response.json();
    const tvlData: TvlDataPoint[] = data.tvl || [];

    // Map to normalized objects
    const mapped = tvlData.map(point => ({
      date: new Date(point.date * 1000).toISOString().split('T')[0], // Unix timestamp to YYYY-MM-DD
      tvl: point.totalLiquidityUSD,
    }));

    // Deduplicate by date (keep the last one for each date) to avoid double-counting intraday points
    const dateMap = new Map<string, TvlHistoryWithDate>();
    for (const item of mapped) {
      dateMap.set(item.date, item); // Overwrite, so last one wins
    }

    return Array.from(dateMap.values());
  } catch (error) {
    console.error(`Error fetching TVL history with dates for ${slug}:`, error);
    return [];
  }
}

/**
 * Process TVL history into 7d, 30d, all ranges
 * Returns arrays of just TVL values for simpler frontend charting
 */
export function processTvlHistoryRanges(fullHistory: TvlHistoryWithDate[]): {
  day7: number[];
  day30: number[];
  all: number[];
  tvlChange7d: number;
  tvlChange30d: number;
} {
  if (fullHistory.length === 0) {
    return { day7: [], day30: [], all: [], tvlChange7d: 0, tvlChange30d: 0 };
  }

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Filter by date ranges
  const day7Data = fullHistory.filter(p => new Date(p.date) >= sevenDaysAgo);
  const day30Data = fullHistory.filter(p => new Date(p.date) >= thirtyDaysAgo);

  const day7 = day7Data.map(p => p.tvl);
  const day30 = day30Data.map(p => p.tvl);

  // Sample 'all' to reasonable size (max 100 points for charts)
  const all = sampleTvlArray(fullHistory.map(p => p.tvl), 100);

  // Calculate changes
  const currentTvl = fullHistory[fullHistory.length - 1]?.tvl || 0;
  const tvl7dAgo = day7Data[0]?.tvl || currentTvl;
  const tvl30dAgo = day30Data[0]?.tvl || currentTvl;

  const tvlChange7d = tvl7dAgo > 0 ? ((currentTvl - tvl7dAgo) / tvl7dAgo) * 100 : 0;
  const tvlChange30d = tvl30dAgo > 0 ? ((currentTvl - tvl30dAgo) / tvl30dAgo) * 100 : 0;

  return { day7, day30, all, tvlChange7d, tvlChange30d };
}

/**
 * Sample array to target size (evenly spaced)
 */
function sampleTvlArray(arr: number[], targetSize: number): number[] {
  if (arr.length <= targetSize) return arr;

  const step = arr.length / targetSize;
  const result: number[] = [];

  for (let i = 0; i < targetSize; i++) {
    const index = Math.floor(i * step);
    result.push(arr[index]);
  }

  // Always include last element
  if (result[result.length - 1] !== arr[arr.length - 1]) {
    result[result.length - 1] = arr[arr.length - 1];
  }

  return result;
}

// ===== Fees/Revenue API =====

export const FEES_API_BASE = 'https://api.llama.fi';

export interface ProtocolFees {
  total24h: number;
  total7d: number;
  total30d: number;
  totalAllTime: number;
  revenue24h: number;
  revenue7d: number;
  revenue30d: number;
  revenueAllTime: number;
}

/**
 * Fetch protocol fees and revenue data
 * Note: Not all protocols have fees data available
 */
export async function fetchProtocolFees(slug: string): Promise<ProtocolFees | null> {
  const apiSlug = getDefiLlamaSlug(slug);
  try {
    const response = await fetch(`${FEES_API_BASE}/summary/fees/${apiSlug}`);
    if (!response.ok) {
      // Silently return null for protocols without fees data (404, etc.)
      return null;
    }
    const data: any = await response.json();

    return {
      total24h: data.total24h || 0,
      total7d: data.total7d || 0,
      total30d: data.total30d || 0,
      totalAllTime: data.totalAllTime || 0,
      revenue24h: data.revenue24h || 0,
      revenue7d: data.revenue7d || 0,
      revenue30d: data.revenue30d || 0,
      revenueAllTime: data.revenueAllTime || 0,
    };
  } catch (error) {
    // Network errors - silently return null
    return null;
  }
}

/**
 * Calculate annualized revenue from 30d data
 * Falls back to total fees if revenue is not available
 */
export function calculateAnnualizedRevenue(fees: ProtocolFees | null): number {
  if (!fees) return 0;
  // Use revenue30d if available, else fall back to total30d (fees)
  const value = fees.revenue30d > 0 ? fees.revenue30d : fees.total30d;
  if (!value || value <= 0) return 0;
  return (value / 30) * 365;
}

export async function fetchRevenueHistoryWithDates(slug: string): Promise<TvlHistoryWithDate[]> {
  const apiSlug = getDefiLlamaSlug(slug);
  try {
    // Fetch daily fees chart
    const response = await fetch(`${FEES_API_BASE}/summary/fees/${apiSlug}?dataType=dailyFees`);
    if (!response.ok) {
      return [];
    }
    const data: any = await response.json();
    const chartData: [number, number][] = data.totalDataChart || [];

    // Map to normalized objects { date, tvl } 
    // We treat 'tvl' property as 'revenue' value here to reuse simple interfaces
    const mapped = chartData.map(([timestamp, value]) => ({
      date: new Date(timestamp * 1000).toISOString().split('T')[0],
      tvl: value,
    }));

    // Deduplicate by date (keep last)
    const dateMap = new Map<string, TvlHistoryWithDate>();
    for (const item of mapped) {
      dateMap.set(item.date, item);
    }

    return Array.from(dateMap.values());
  } catch (error) {
    console.error(`Error fetching revenue history for ${slug}:`, error);
    return [];
  }
}
