export interface SparkState {
    collateralAmount: number; // In ETH
    borrowAmount: number;     // In DAI
    supplyDaiAmount: number;  // In DAI (for DSR)
    ethPrice: number;         // In USD
    healthFactor: number;
    collateralValue: number;
}

export const DEFAULT_STATE: SparkState = {
    collateralAmount: 10,
    borrowAmount: 10000,
    supplyDaiAmount: 5000,
    ethPrice: 2500,
    healthFactor: 2.05,
    collateralValue: 25000
};

export interface ChartDataPoint {
    name: string;
    Pool: number;
    Spark: number;
}
