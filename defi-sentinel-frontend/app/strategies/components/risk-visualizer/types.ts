export interface Protocol {
  id: string;
  name: string;
  score: number; // 0-100
  role: string;
}

export interface Asset {
  id: string;
  name: string;
  score: number; // 0-100
  type: string;
}

export interface StrategyType {
  id: string;
  name: string;
  multiplier: number; // e.g., 0.9, 1.0, 0.75
  reason: string;
}

export interface RiskAnalysisResult {
  minProtocol: Protocol;
  minAsset: Asset;
  baseScore: number;
  totalMultiplier: number;
  finalScore: number;
  grade: 'AAA' | 'AA' | 'A' | 'B' | 'High Risk';
  color: string;
}
