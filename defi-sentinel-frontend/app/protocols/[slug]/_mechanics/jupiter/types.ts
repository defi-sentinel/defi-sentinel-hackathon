export interface DexNode {
    id: string;
    name: string;
    type: 'amm' | 'clmm' | 'stable';
    color: string;
    yOffset: number; // Percentage 0-100
}

export interface RoutePath {
    id: string;
    nodes: string[]; // IDs of DexNodes
    percentage: number; // How much of the trade goes this way
}

export interface SimulationState {
    tradeSize: number; // 0 to 100
    activeRoutes: RoutePath[];
    isSwapping: boolean;
}
