export enum AssetType {
    ETH = 'ETH',
    USDC = 'USDC'
}

export interface SimulationState {
    collateralAmount: number; // In ETH
    borrowAmount: number; // In USDC
    ethPrice: number;
    usdcPrice: number;
    userWalletEth: number;
    userWalletUsdc: number;
    isDragging: boolean;
    activeDirection: 'supply' | 'borrow' | null;
}

export interface ProtocolStats {
    tvl: string;
    supplyApy: number;
    borrowApy: number;
    utilizationRate: number;
}
