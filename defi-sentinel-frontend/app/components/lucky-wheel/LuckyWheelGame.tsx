'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Wheel } from './Wheel';
import { GameState, WheelOption, WHEEL_OPTIONS, SPIN_DURATION_MS } from './constants';
import { Dices } from 'lucide-react';

interface LuckyWheelGameProps {
    onSpinEnd: (result: string) => void;
    existingLuckyNumber?: string | null;
}

export const LuckyWheelGame: React.FC<LuckyWheelGameProps> = ({ onSpinEnd, existingLuckyNumber }) => {
    const [gameState, setGameState] = useState<GameState>(GameState.IDLE);
    const [rotation, setRotation] = useState(0);

    // If already spun, set initial rotation to show that number
    useEffect(() => {
        if (existingLuckyNumber) {
            const index = WHEEL_OPTIONS.findIndex(opt => opt.label === existingLuckyNumber);
            if (index !== -1) {
                // Angle logic: angle = index * (360 / 16)
                const anglePerItem = 360 / 16;
                const targetBaseRotation = index * anglePerItem;
                setRotation(targetBaseRotation);
                setGameState(GameState.RESULT); // Already done
            }
        }
    }, [existingLuckyNumber]);

    const handleSpin = useCallback(() => {
        if (gameState === GameState.SPINNING || existingLuckyNumber) return;

        setGameState(GameState.SPINNING);

        // 1. Determine winner
        const winningIndex = Math.floor(Math.random() * WHEEL_OPTIONS.length);
        const winningOption = WHEEL_OPTIONS[winningIndex];

        // 2. Calculate target rotation for 3D Cylinder
        const anglePerItem = 360 / 16;
        const targetBaseRotation = winningIndex * anglePerItem;

        // Minimum spins
        const minSpins = 5;
        const spinDegrees = minSpins * 360;

        // Ensure we move forward
        let targetRotation = rotation + spinDegrees;

        // Adjust to land on specific index
        // Current targetRotation is just adding raw spins. We need to align it.
        const currentMod = targetRotation % 360;
        const diff = targetBaseRotation - currentMod;

        targetRotation += diff;

        if (targetRotation - rotation < spinDegrees) {
            targetRotation += 360;
        }

        setRotation(targetRotation);

        // 3. Wait for animation
        setTimeout(() => {
            //   setGameState(GameState.RESULT);
            onSpinEnd(winningOption.label);
        }, SPIN_DURATION_MS);

    }, [gameState, rotation, existingLuckyNumber, onSpinEnd]);

    if (existingLuckyNumber) {
        // If user already has a lucky number, we might not even show the wheel, 
        // or we show a static version.
        // For ProGate integration, we likely hide this component afterwards, 
        // so this return might be redundant but good for safety.
        return null;
    }

    return (
        <div className="flex flex-col items-center justify-center pt-8 pb-12 w-full max-w-2xl mx-auto">
            <div className="text-center mb-20 space-y-4">
                <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500 uppercase tracking-tight drop-shadow-sm">
                    Hex Lucky Wheel
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-base max-w-md mx-auto leading-relaxed">
                    Spin for your lucky digit. If your connected wallet ends with this digit, you win <span className="text-emerald-500 font-bold">6 Months Free Pro Access</span>. Yeah, you heard it right! Free membership!
                </p>
            </div>

            <div className="relative w-full scale-90 md:scale-110 my-4 transform-gpu">
                <Wheel
                    rotation={rotation}
                    transitionDuration={SPIN_DURATION_MS}
                    isSpinning={gameState === GameState.SPINNING}
                />
            </div>

            <div className="mt-24">
                <button
                    onClick={handleSpin}
                    disabled={gameState !== GameState.IDLE}
                    className={`
            group relative px-10 py-5 rounded-2xl text-xl font-black tracking-widest transition-all duration-300 transform shadow-2xl hover:-translate-y-1
            ${gameState === GameState.IDLE
                            ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:scale-105 active:scale-95 shadow-emerald-500/50 ring-4 ring-emerald-500/20'
                            : 'bg-gray-800 text-gray-500 cursor-not-allowed opacity-50'}
          `}
                >
                    {gameState === GameState.SPINNING ? (
                        <span className="flex items-center gap-3">
                            SPINNING...
                        </span>
                    ) : (
                        <span className="flex items-center gap-3">
                            <Dices className="w-6 h-6" />
                            SPIN TO WIN
                        </span>
                    )}
                </button>
            </div>
        </div>
    );
};
