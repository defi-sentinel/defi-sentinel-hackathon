export interface Ad {
  id: string;
  title: string;
  description: string;
  link?: string;
  isActive: boolean;
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  rating: string;
  score: number;
  tvl: string;
  tvlValue: number; // Numeric value for sorting/calculations
  description: string;
  logo: string;
  chains: string[];
  category: string;
  auditStatus: 'Audited' | 'Unverified' | 'In Progress';
  launchDate?: string;
  // URL fields used in protocols page
  websiteUrl?: string;
  docsUrl?: string;
  twitterUrl?: string;
}

export interface Strategy {
  id: string;
  projectId: string;
  name: string;
  strategyClass?: string; // e.g. "USDe", "ENA", "USDAI" for grouping
  description: string;
  apy: number;
  apyBase?: number; // Base APY component
  apyReward?: number; // Reward APY component
  apy7d?: number;
  apy30d?: number;
  rating?: string; // Strategy rating (AAA, AA, etc.)

  riskLevel: 'Low' | 'Middle' | 'High';
  score: number; // 0-100 score
  type: 'Lending' | 'LP' | 'Staking' | 'Farming' | 'Yield';
  tvl?: number;
  strategyLink?: string;
  chains?: string[];
  protocols?: string[];

  tags: string[];
  complexity: 'Beginner' | 'Intermediate' | 'Advanced';
  lastUpdated?: string;
  isNew?: boolean;

  // Yield Breakdown
  yieldBreakdown?: {
    source: string;
    value: number; // percentage
  }[];

  // Strategy Flow / Steps
  steps?: {
    step: number;
    title: string;
    description: string;
    warning?: string;
    image?: string; // URL to screenshot/image
  }[];

  // Status
  status?: 'Active' | 'Deprecated' | 'Experimental';
  isPro?: boolean;

  // Advanced fields
  proTips?: string[];
  safetyFinalScore?: number;


  // Risk Decay Chain
  riskChain?: {
    title: string;
    percent: number; // Remaining capital % (e.g. 92)
    scoreImpact?: number;
    multiplier?: number; // e.g. 86 for *86%
    description?: string;
    breakdownLink?: string;
  }[];

  // Risk Visualization Data
  riskProtocols?: {
    id: string;
    name: string;
    score: number;
    role: string;
  }[];
  riskAssets?: {
    id: string;
    name: string;
    score: number;
    type: string;
  }[];
  riskStrategies?: {
    id: string;
    name: string;
    multiplier: number;
    reason: string;
  }[];

  // History for charts
  apyHistory?: { date: string; value: number; tvl: number }[];
  tvlHistory?: { date: string; value: number; tvl: number }[];

  // Additional fields from data files
  tokens?: string[];
}

// Backward compatibility - index helper uses this
export type StrategyWithRating = Strategy & { rating: string };

// --- Risk Analysis Types (New 3-Level Data) ---

export interface SubField {
  name: string;
  score: number;
  max: number;
  notes: string;
}

export interface MainCategory {
  category: string;
  score: number;
  description?: string;
  weight?: number;
  subfields?: SubField[]; // Made optional for backward compatibility
}

export interface RiskAnalysis {
  projectId?: string; // Optional reference to protocol
  overallScore: number;
  tier?: string;
  rating?: string; // Risk rating (AAA, AA, etc.)
  categories?: MainCategory[];
  // Additional fields from data files
  scores?: { category: string; score: number; weight: number; description: string }[];
  incidents?: any[];
  history?: { date: string; score: number }[];
  auditReports?: { auditor: string; date: string; url: string }[];
}

// Legacy alias for backward compatibility
export type RiskScore = RiskAnalysis;

// --- Content Types ---

export interface Author {
  name: string;
  avatar?: string;
  role?: string;
  bio?: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  summary?: string;
  content?: string;
  coverImage?: string;
  tags?: string[];
  difficulty?: 'easy' | 'intermediate' | 'advanced';
  isPaid?: boolean;
  publishedAt?: string; // ISO date
  popularityScore?: number;
  // Additional fields used in research pages
  author?: Author;
  readTime?: string | number;
  category?: string;
  // Additional fields used in data files
  isFirstEdition?: boolean;
  popularity?: number;
}

export interface ProtocolProduct {
  id?: string;
  projectId?: string;
  name: string;
  description: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  apyRange?: string;
  targetAudience?: string;
  icon?: string;
  strategyType?: string;
  // Additional fields used in ProtocolStrategies
  type?: string;
  rating?: string;
  apy?: number;
  apyBase?: number;
  apyReward?: number;
  readTime?: string;
  tokens?: string[];
  tags?: string[];
  complexity?: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface HistoryData {
  day7?: number[];
  day30?: number[];
  all?: number[];
}

export interface ProtocolDetail extends Project {
  overview?: string; // Markdown
  launchYear?: number;
  launchMonth?: string;

  // Dynamic
  tvlHistory?: any[] | HistoryData;
  revenueHistory?: any[] | HistoryData;
  tvlChange7d?: number; // Added to match schema
  isNew?: boolean;
  isTrending?: boolean;
  hasRiskAlert?: boolean;
  isFeatured?: boolean;

  // Rich Data
  metrics?: any;
  valueProposition?: any;
  mechanics?: any;
  fundingHistory?: {
    date: string;
    round: string;
    amount: number;
    investors: string[];
  }[];
  products?: ProtocolProduct[];
  strategies?: ProtocolProduct[];

  risks: RiskAnalysis;

  governance?: {
    model: string;
    proposalCount?: number;
    voterCount?: number;
    treasuryValue?: number | string;
    token?: {
      projectId?: string;
      symbol: string;
      price: number;
      marketCap: number;
      fdv?: number;
      circulatingSupply?: number;
      totalSupply?: number;
      holders?: number;
      distribution?: { label: string; percentage: number }[];
      unlockSchedule?: { date: string; amount: string }[];
      history?: {
        day7: number[];
        day30: number[];
        all: number[];
      };
      [key: string]: any; // Allow additional properties
    };
    [key: string]: any; // Allow additional properties
  };

  resources: {
    official: { label: string; url: string; type: 'website' | 'docs' | 'github' | 'twitter' | 'discord' }[];
    audits: { auditor: string; date: string; url: string }[];
    bugBounties?: { name: string; link: string }[];
    investors?: { name: string; icon?: string }[];
    articles: Article[];
  };

  statusBadges?: any;
}

// Protocol type alias for list pages (uses subset of Project fields)
export type Protocol = Project;
