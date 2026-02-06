export enum UserType {
    LENDER = 'LENDER',
    BORROWER = 'BORROWER'
}

export interface SimulationState {
    p2pMatchingRatio: number; // 0 to 1
    poolSupplyApy: number;
    poolBorrowApy: number;
    p2pApy: number; // usually mid-rate
}

export interface ApyResult {
    supplyApy: number;
    borrowApy: number;
    improvement: number;
}

export interface ChartDataPoint {
    name: string;
    Pool: number;
    Morpho: number;
}
