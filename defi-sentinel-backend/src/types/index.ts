export interface SubField {
    name: string;
    score: number;
    maxScore: number;
    explanation: string;
}

export interface MainCategory {
    id: string; // e.g., "security"
    name: string; // e.g., "Smart Contract & Technical Risk"
    score: number;
    description?: string;
    weight?: number;
    subFields: SubField[];
}

export interface RiskAnalysis {
    overallScore: number;
    tier: string;
    categories: MainCategory[];
}

export interface ProtocolDetail {
    id: string;
    slug: string;
    name: string;
    category: string;
    description: string;
    // ... other existing fields can be added as needed or partial
    risks: RiskAnalysis;
}
