export interface RatingInput {
  projectId: string;
  auditCount: number;
  auditScore: number; // 0-100
  contractAgeDays: number;
  tvl: number; // USD
  mcap: number; // USD
  fdv: number; // USD
  multisigThreshold: number; // e.g., 3/5 = 0.6
  teamPublic: boolean;
  recentIncidents: number; // Count of exploits/hacks
  centralizationScore: number; // 0-100 (100 = fully decentralized)
}

export interface RiskCategoryResult {
  score: number; // 0-100
  weight: number; // 0-1
  weightedScore: number;
  details: string[];
}

export interface RatingResult {
  totalScore: number; // 0-100
  rating: string; // AAA, AA, etc.
  breakdown: {
    contractRisk: RiskCategoryResult;
    tokenomicsRisk: RiskCategoryResult;
    liquidityRisk: RiskCategoryResult;
    governanceRisk: RiskCategoryResult;
    operationRisk: RiskCategoryResult;
  };
  generatedAt: string;
}

