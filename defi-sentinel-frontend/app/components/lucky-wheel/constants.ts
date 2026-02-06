export interface WheelOption {
    label: string;
    value: string;
    color: string;
    textColor: string;
}

export enum GameState {
    IDLE = 'IDLE',
    SPINNING = 'SPINNING',
    RESULT = 'RESULT',
}

export const WHEEL_SIZE = 400;
export const SPIN_DURATION_MS = 4000; // 4 seconds

// 16 Hex options: 0-9, A-F
const LABELS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];

// Cyberpunk/Neon Palette
const COLORS = [
    '#ef4444', // Red 500
    '#f97316', // Orange 500
    '#f59e0b', // Amber 500
    '#eab308', // Yellow 500
    '#84cc16', // Lime 500
    '#22c55e', // Green 500
    '#10b981', // Emerald 500
    '#14b8a6', // Teal 500
    '#06b6d4', // Cyan 500
    '#0ea5e9', // Sky 500
    '#3b82f6', // Blue 500
    '#6366f1', // Indigo 500
    '#8b5cf6', // Violet 500
    '#a855f7', // Purple 500
    '#d946ef', // Fuchsia 500
    '#ec4899', // Pink 500
];

export const WHEEL_OPTIONS: WheelOption[] = LABELS.map((label, index) => ({
    label,
    value: label,
    color: COLORS[index],
    textColor: '#ffffff',
}));
