export enum FlowStep {
    INTRO = 'INTRO',
    DEPOSIT = 'DEPOSIT',
    MINT = 'MINT',
    REWARDS = 'REWARDS',
    COMPLETE = 'COMPLETE'
}

export interface MetricData {
    name: string;
    value: number;
    label: string;
}

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}
