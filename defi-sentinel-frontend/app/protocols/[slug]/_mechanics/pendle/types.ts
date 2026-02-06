export enum TokenState {
    Underlying = 'Underlying',
    SY = 'SY',
    Split = 'Split'
}

export interface SimulationData {
    timeElapsed: number; // 0 to 1 (0% to 100% maturity)
    apy: number;
    principal: number;
}

export interface AIExplanationState {
    loading: boolean;
    text: string | null;
    error: boolean;
}
