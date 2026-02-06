export enum BridgeStep {
    IDLE = 'IDLE',
    SWAP_SEND = 'SWAP_SEND',      // Native -> vUSD
    MESSAGING = 'MESSAGING',      // Guardians relay vUSD balance
    SWAP_RECEIVE = 'SWAP_RECEIVE', // vUSD -> Native
    COMPLETED = 'COMPLETED'
}

export interface ChainConfig {
    id: string;
    name: string;
    color: string;
    icon: string;
}

export interface SimulationState {
    step: BridgeStep;
    progress: number;
}

export interface GeminiResponse {
    analysis: string;
    riskLevel: 'Low' | 'Medium' | 'High';
}
