export enum FlowStep {
    Idle = 'IDLE',
    Deposit = 'DEPOSIT',
    Mint = 'MINT',
    Allocation = 'ALLOCATION',
    Yield = 'YIELD',
    Distribute = 'DISTRIBUTE'
}

export interface SimulationMetrics {
    totalTVL: number;
    gpuAllocation: number; // 0 to 1
    gpuAPR: number;
    treasuryAPR: number;
}
