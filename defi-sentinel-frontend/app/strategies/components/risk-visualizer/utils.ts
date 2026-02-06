import { Asset, Protocol, RiskAnalysisResult, StrategyType } from './types';

export const getRiskGrade = (score: number): RiskAnalysisResult['grade'] => {
  if (score >= 90) return 'AAA';
  if (score >= 80) return 'AA';
  if (score >= 70) return 'A';
  if (score >= 50) return 'B';
  return 'High Risk';
};

export const getRiskColor = (score: number): string => {
  if (score >= 95) return '#16a34a'; // green-600
  if (score >= 85) return '#059669'; // emerald-600
  if (score >= 75) return '#ca8a04'; // yellow-600
  if (score >= 65) return '#ea580c'; // orange-600
  return '#dc2626'; // red-600
};

export const getRiskColorClass = (score: number): string => {
  if (score >= 95) return 'text-green-600 dark:text-green-400 border-green-600 bg-green-500/10';
  if (score >= 85) return 'text-emerald-600 dark:text-emerald-400 border-emerald-600 bg-emerald-500/10';
  if (score >= 75) return 'text-yellow-600 dark:text-yellow-400 border-yellow-600 bg-yellow-500/10';
  if (score >= 65) return 'text-orange-600 dark:text-orange-400 border-orange-600 bg-orange-500/10';
  return 'text-red-600 dark:text-red-400 border-red-600 bg-red-500/10';
}

export const analyzeRisk = (
  protocols: Protocol[],
  assets: Asset[],
  strategies: StrategyType[]
): RiskAnalysisResult => {
  // Find min protocol
  const minProtocol = protocols.reduce((prev, curr) =>
    prev.score < curr.score ? prev : curr
  );

  // Find min asset
  const minAsset = assets.reduce((prev, curr) =>
    prev.score < curr.score ? prev : curr
  );

  // Calculate Base Score (Average of the two bottlenecks)
  const baseScore = Math.round((minProtocol.score + minAsset.score) / 2);

  // Calculate Compound Multiplier
  const totalMultiplier = strategies.reduce((acc, strat) => acc * strat.multiplier, 1.0);

  // Calculate Final Score
  const finalScore = Math.round(baseScore * totalMultiplier);

  return {
    minProtocol,
    minAsset,
    baseScore,
    totalMultiplier,
    finalScore,
    grade: getRiskGrade(finalScore),
    color: getRiskColor(finalScore),
  };
};

export const formatPercent = (val: number) => `${(val * 100).toFixed(0)}%`;
