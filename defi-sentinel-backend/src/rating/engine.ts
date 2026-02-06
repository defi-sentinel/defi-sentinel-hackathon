import { RatingInput, RatingResult, RiskCategoryResult } from './types';

export class RatingEngine {
  private calculateContractRisk(input: RatingInput): RiskCategoryResult {
    // Logic: More audits is better, higher audit score is better, older contracts are safer
    let score = input.auditScore;
    
    // Bonus for multiple audits
    if (input.auditCount > 1) score += 5;
    if (input.auditCount > 3) score += 5;
    
    // Age bonus (up to 10 points for 2 years)
    const ageBonus = Math.min(10, (input.contractAgeDays / 365) * 5);
    score += ageBonus;

    // Penalty for incidents
    score -= input.recentIncidents * 20;

    // Clamp 0-100
    score = Math.max(0, Math.min(100, score));

    return {
      score,
      weight: 0.40,
      weightedScore: score * 0.40,
      details: [
        `${input.auditCount} Audits`,
        `${Math.floor(ageBonus)} pts age bonus`,
        `-${input.recentIncidents * 20} for incidents`
      ]
    };
  }

  private calculateTokenomicsRisk(input: RatingInput): RiskCategoryResult {
    // Logic: Higher FDV relative to Mcap is risky (low float). High Mcap is generally safer (Lindy).
    let score = 70; // Base

    const floatRatio = input.mcap / (input.fdv || input.mcap); // 0-1
    score += floatRatio * 20; // Up to +20 if fully circulating

    // Market Cap tiers
    if (input.mcap > 1_000_000_000) score += 10;
    else if (input.mcap < 10_000_000) score -= 10;

    score = Math.max(0, Math.min(100, score));

    return {
      score,
      weight: 0.25,
      weightedScore: score * 0.25,
      details: [
        `Float ratio: ${(floatRatio * 100).toFixed(1)}%`
      ]
    };
  }

  private calculateLiquidityRisk(input: RatingInput): RiskCategoryResult {
    // Logic: Higher TVL is better
    let score = 50;
    
    if (input.tvl > 1_000_000_000) score = 95;
    else if (input.tvl > 100_000_000) score = 85;
    else if (input.tvl > 10_000_000) score = 70;
    else score = 40;

    return {
      score,
      weight: 0.15,
      weightedScore: score * 0.15,
      details: [
        `TVL Tier: ${input.tvl > 1_000_000_000 ? 'Tier 1' : 'Tier 2/3'}`
      ]
    };
  }

  private calculateGovernanceRisk(input: RatingInput): RiskCategoryResult {
    let score = input.centralizationScore;
    
    return {
      score,
      weight: 0.10,
      weightedScore: score * 0.10,
      details: [
        `Centralization Score: ${score}`
      ]
    };
  }

  private calculateOperationRisk(input: RatingInput): RiskCategoryResult {
    let score = 60;
    
    if (input.teamPublic) score += 20;
    if (input.multisigThreshold > 0.5) score += 10;
    if (input.multisigThreshold > 0.7) score += 10;

    return {
      score,
      weight: 0.10,
      weightedScore: score * 0.10,
      details: [
        input.teamPublic ? 'Public Team' : 'Anon Team',
        `Multisig Threshold: ${input.multisigThreshold}`
      ]
    };
  }

  private mapScoreToRating(score: number): string {
    if (score >= 95) return 'AAA';
    if (score >= 90) return 'AA+';
    if (score >= 85) return 'AA';
    if (score >= 80) return 'A+';
    if (score >= 75) return 'A';
    if (score >= 70) return 'BBB';
    if (score >= 60) return 'BB';
    if (score >= 50) return 'B';
    if (score >= 40) return 'CCC';
    return 'D';
  }

  public calculateRating(input: RatingInput): RatingResult {
    const contract = this.calculateContractRisk(input);
    const tokenomics = this.calculateTokenomicsRisk(input);
    const liquidity = this.calculateLiquidityRisk(input);
    const governance = this.calculateGovernanceRisk(input);
    const operation = this.calculateOperationRisk(input);

    const totalScore = contract.weightedScore + 
                       tokenomics.weightedScore + 
                       liquidity.weightedScore + 
                       governance.weightedScore + 
                       operation.weightedScore;

    const roundedScore = Math.round(totalScore);

    return {
      totalScore: roundedScore,
      rating: this.mapScoreToRating(roundedScore),
      breakdown: {
        contractRisk: contract,
        tokenomicsRisk: tokenomics,
        liquidityRisk: liquidity,
        governanceRisk: governance,
        operationRisk: operation
      },
      generatedAt: new Date().toISOString()
    };
  }
}

