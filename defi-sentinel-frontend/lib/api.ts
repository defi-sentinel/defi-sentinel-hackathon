// API Client for backend communication

import { API_BASE_URL } from './constants';
import { Strategy, Ad } from './types';

export interface Protocol {
  id: string;
  name: string;
  slug: string;
  rating: string;
  score: number;
  tvl: string;
  tvlValue: number;
  tvlChange7d?: number;
  tvlHistory?: number[];
  tvlChange30d?: number;
  description: string;
  logo: string;
  chains: string[];
  category: string;
  auditStatus?: string;
  launchDate?: string;
  protocolAge?: string;
  bestApy?: number;
  lowestApy?: number;
  yieldType?: string;
  isNew?: boolean;
  isTrending?: boolean;
  hasRiskAlert?: boolean;
  lastIncident?: string;
  lastUpgrade?: string;
  ratedDate?: string;
  isFeatured?: boolean;
  // Optional URL fields (can be extracted from resources.official)
  websiteUrl?: string;
  docsUrl?: string;
  twitterUrl?: string;
}

export interface ProtocolsResponse {
  data: Protocol[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  widgets: {
    featured: {
      name: string;
      description: string;
      score: number;
      rating: string;
      logo: string;
      slug: string;
      tvl: string;
      category: string;
      chains: string[];
      auditStatus: string;
    } | null;
    latestRated: Array<{
      logo: string;
      name: string;
      rating: string;
      score: number;
      category: string;
      slug: string;
      ratedDate: string | null;
    }>;
    topRated: Array<{
      logo: string;
      name: string;
      category: string;
      score: number;
      rating: string;
      slug: string;
      rank: number;
    }>;
  };
}

export interface ProtocolsQueryParams {
  search?: string;
  category?: string;
  chain?: string;
  rating?: string;
  minScore?: number;
  maxScore?: number;
  minTvl?: number;
  maxTvl?: number;
  sort?: string;
  page?: number;
  limit?: number;
}

// Fetch protocols with filters
export async function fetchProtocols(params?: ProtocolsQueryParams): Promise<ProtocolsResponse> {
  const queryParams = new URLSearchParams();

  if (params?.search) queryParams.append('search', params.search);
  if (params?.category) queryParams.append('category', params.category);
  if (params?.chain) queryParams.append('chain', params.chain);
  if (params?.rating) queryParams.append('rating', params.rating);
  if (params?.minScore !== undefined) queryParams.append('minScore', params.minScore.toString());
  if (params?.maxScore !== undefined) queryParams.append('maxScore', params.maxScore.toString());
  if (params?.minTvl !== undefined) queryParams.append('minTvl', params.minTvl.toString());
  if (params?.maxTvl !== undefined) queryParams.append('maxTvl', params.maxTvl.toString());
  if (params?.sort) queryParams.append('sort', params.sort);
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  const url = `${API_BASE_URL}/api/protocols${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch protocols: ${response.statusText}`);
  }

  return response.json();
}

// Fetch single protocol by slug
export async function fetchProtocolBySlug(slug: string): Promise<Protocol> {
  const url = `${API_BASE_URL}/api/protocols/${slug}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Protocol not found');
    }
    throw new Error(`Failed to fetch protocol: ${response.statusText}`);
  }

  return response.json();
}

// --- Membership API ---

export interface Badge {
  badgeId: number;
  earned: boolean;
  nftMinted: boolean;
}

export interface BillingEntry {
  id: string;
  plan: string;
  months: number;
  price: string;
  date: string;
  wallet: string;
  txHash: string;
}

export interface MembershipResponse {
  walletAddress: string;
  email: string | null;
  memberSince: string | null;
  daysRemaining: number;
  quizCompleted: number;
  riskAssessmentDone: boolean;
  tier: string;
  expiryDate: number | null;
  badges: Badge[];
  billingHistory: BillingEntry[];
}

export async function fetchMembership(walletAddress: string): Promise<MembershipResponse> {
  const url = `${API_BASE_URL}/api/membership/${walletAddress}`;
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) {
    if (response.status === 404) {
      // Return default if user doesn't exist yet
      return {
        walletAddress,
        email: null,
        memberSince: null,
        daysRemaining: 0,
        quizCompleted: 0,
        riskAssessmentDone: false,
        tier: 'free',
        expiryDate: null,
        badges: [1001, 2001, 2002, 2003, 2004, 3001, 3002, 4001, 4002].map(id => ({ badgeId: id, earned: false, nftMinted: false })),
        billingHistory: []
      };
    }
    throw new Error(`Failed to fetch membership: ${response.statusText}`);
  }
  return response.json();
}

export interface UpdateMembershipParams {
  walletAddress: string;
  email?: string;
  tier?: string;
  expiryDate?: number;
  months?: number;
  txHash?: string;
}

export async function updateMembership(params: UpdateMembershipParams): Promise<{ success: boolean }> {
  const url = `${API_BASE_URL}/api/membership`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!response.ok) {
    throw new Error(`Failed to update membership: ${response.statusText}`);
  }
  return response.json();
}

// --- Game API ---

export interface QuizProgress {
  completed: boolean;
  score: number;
  bestScore?: number;
  minted: boolean;
  profile?: string;
}

export interface GameProgressResponse {
  easy: QuizProgress;
  medium: QuizProgress;
  hard: QuizProgress;
  risk: QuizProgress;
}

export async function fetchGameProgress(walletAddress: string): Promise<GameProgressResponse> {
  const url = `${API_BASE_URL}/api/game/${walletAddress}/progress`;
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) {
    if (response.status === 404) {
      // Default progress
      return {
        easy: { completed: false, score: 0, bestScore: 0, minted: false },
        medium: { completed: false, score: 0, bestScore: 0, minted: false },
        hard: { completed: false, score: 0, bestScore: 0, minted: false },
        risk: { completed: false, score: 0, minted: false },
      };
    }
    throw new Error(`Failed to fetch game progress: ${response.statusText}`);
  }
  return response.json();
}

export async function updateGameProgress(walletAddress: string, progress: GameProgressResponse): Promise<{ success: boolean }> {
  const url = `${API_BASE_URL}/api/game/${walletAddress}/progress`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ progress }),
  });
  if (!response.ok) {
    throw new Error(`Failed to update game progress: ${response.statusText}`);
  }
  return response.json();
}

// --- Homepage API ---

export interface SecurityAlert {
  type: string;
  title: string;
  message: string | null;
  severity: string | null;
}

export interface TopStrategy {
  name: string;
  apy: string;
  rating: string;
  risk: string;
  type: string;
}

export interface NewlyRatedProtocol {
  name: string;
  slug: string;
  rating: string | null;
  ratedDate: string | null;
}

export interface TopRatedProtocol {
  id: string;
  name: string;
  slug: string;
  category: string;
  score: number | null;
  rating: string | null;
  logo: string | null;
}

export interface FeaturedResearch {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  coverImage: string | null;
  publishedAt: string | null;
}

export interface HomepageResponse {
  cms: {
    featured: {
      titleLine1: string | null;
      titleLine2: string | null;
      description: string | null;
      link: string | null;
      readTime: string | null;
    };
    insight1: {
      title: string | null;
      description: string | null;
      link: string | null;
    };
    insight2: {
      title: string | null;
      description: string | null;
      link: string | null;
    };
  } | null;
  featuredResearch: FeaturedResearch | null;
  securityAlerts: SecurityAlert[];
  topStrategies: TopStrategy[];
  newlyRated: NewlyRatedProtocol[];
  topRated: TopRatedProtocol[];
}

export async function fetchHomepage(): Promise<HomepageResponse> {
  const url = `${API_BASE_URL}/api/homepage`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch homepage data: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchAds(): Promise<Ad | null> {
  const url = `${API_BASE_URL}/api/ads`;
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Error fetching ads:", error);
    return null;
  }
}

// --- Strategy API ---

export type { Strategy, Ad };

export async function fetchStrategies(): Promise<Strategy[]> {
  const url = `${API_BASE_URL}/api/strategies`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch strategies: ${response.statusText}`);
  }

  const data = await response.json();

  return data.map((strategy: any) => ({
    ...strategy,
    // Map backend safetyFinalScore to frontend score
    score: strategy.safetyFinalScore || 0,
    // Parse JSON fields

    tags: typeof strategy.tags === 'string' ? JSON.parse(strategy.tags) : strategy.tags,
    steps: typeof strategy.steps === 'string' ? JSON.parse(strategy.steps) : strategy.steps,
    yieldBreakdown: typeof strategy.yieldBreakdown === 'string' ? JSON.parse(strategy.yieldBreakdown) : strategy.yieldBreakdown,
    apyHistory: typeof strategy.apyHistory === 'string' ? JSON.parse(strategy.apyHistory) : strategy.apyHistory,
    tvlHistory: typeof strategy.tvlHistory === 'string' ? JSON.parse(strategy.tvlHistory) : strategy.tvlHistory,
    riskChain: typeof strategy.riskChain === 'string' ? JSON.parse(strategy.riskChain) : strategy.riskChain,
    proTips: typeof strategy.proTips === 'string' ? JSON.parse(strategy.proTips) : strategy.proTips,
    protocols: typeof strategy.protocols === 'string' ? JSON.parse(strategy.protocols) : strategy.protocols,
    chains: typeof strategy.chains === 'string' ? JSON.parse(strategy.chains) : strategy.chains,
    // Parse risk visualization fields
    riskProtocols: typeof strategy.riskProtocols === 'string' ? JSON.parse(strategy.riskProtocols) : strategy.riskProtocols,
    riskAssets: typeof strategy.riskAssets === 'string' ? JSON.parse(strategy.riskAssets) : strategy.riskAssets,
    riskStrategies: typeof strategy.riskStrategies === 'string' ? JSON.parse(strategy.riskStrategies) : strategy.riskStrategies,
  })) as Strategy[];
}

export async function fetchStrategy(id: string): Promise<Strategy> {
  const url = `${API_BASE_URL}/api/strategies/${id}`;
  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Strategy not found');
    }
    throw new Error(`Failed to fetch strategy: ${response.statusText}`);
  }

  const strategy = await response.json();

  return {
    ...strategy,
    // Map backend safetyFinalScore to frontend score
    score: strategy.safetyFinalScore || 0,

    tags: typeof strategy.tags === 'string' ? JSON.parse(strategy.tags) : strategy.tags,
    steps: typeof strategy.steps === 'string' ? JSON.parse(strategy.steps) : strategy.steps,
    yieldBreakdown: typeof strategy.yieldBreakdown === 'string' ? JSON.parse(strategy.yieldBreakdown) : strategy.yieldBreakdown,
    apyHistory: typeof strategy.apyHistory === 'string' ? JSON.parse(strategy.apyHistory) : strategy.apyHistory,
    tvlHistory: typeof strategy.tvlHistory === 'string' ? JSON.parse(strategy.tvlHistory) : strategy.tvlHistory,
    riskChain: typeof strategy.riskChain === 'string' ? JSON.parse(strategy.riskChain) : strategy.riskChain,
    proTips: typeof strategy.proTips === 'string' ? JSON.parse(strategy.proTips) : strategy.proTips,
    protocols: typeof strategy.protocols === 'string' ? JSON.parse(strategy.protocols) : strategy.protocols,
    chains: typeof strategy.chains === 'string' ? JSON.parse(strategy.chains) : strategy.chains,
  } as Strategy;
}
