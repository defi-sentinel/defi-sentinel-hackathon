import React from 'react';
import { WHEEL_OPTIONS } from './constants';

interface WheelProps {
    rotation: number;
    transitionDuration: number;
    isSpinning: boolean;
}

export const Wheel: React.FC<WheelProps> = ({ rotation, transitionDuration, isSpinning }) => {
    const radius = 210; // Radius for the 3D cylinder
    const anglePerItem = 360 / 16;

    return (
        <div className="relative group w-full max-w-lg h-[320px] mx-auto flex items-center justify-center [perspective:1000px]">

            {/* 3D Cylinder Container */}
            <div
                className="relative w-64 h-full [transform-style:preserve-3d]"
                style={{
                    transform: `rotateX(${rotation}deg)`,
                    transition: isSpinning ? `transform ${transitionDuration}ms cubic-bezier(0.15, 0.85, 0.35, 1)` : 'none'
                }}
            >
                {WHEEL_OPTIONS.map((option, index) => {
                    // Angle for this specific panel
                    const angle = index * anglePerItem;

                    return (
                        <div
                            key={option.value}
                            className="absolute top-1/2 left-1/2 -ml-32 -mt-[40px] w-64 h-[80px] flex items-center justify-center [backface-visibility:hidden]"
                            style={{
                                // Rotate panels to form the cylinder shape
                                // We use negative angle for placement so positive container rotation brings them forward
                                transform: `rotateX(${-angle}deg) translateZ(${radius}px)`,
                            }}
                        >
                            <div
                                className="w-[98%] h-[96%] rounded-md flex items-center justify-center"
                                style={{
                                    backgroundColor: option.color,
                                    boxShadow: `0 0 30px ${option.color}`, // Pure colored glow
                                    border: 'none',
                                    outline: 'none'
                                }}
                            >
                                <span className="text-4xl font-black text-white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                                    {option.label}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Lighting/Depth Overlays - Gradient matches background to create fade effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-50/0 via-transparent to-gray-50/0 dark:from-gray-900/0 dark:via-transparent dark:to-gray-900/0 z-10 pointer-events-none"></div>

            {/* Arrows indicating selection line - Pointing INSIDE */}
            <div className="absolute top-1/2 left-4 -translate-y-1/2 z-20 text-yellow-500 animate-pulse hidden md:block">
                {/* Left Arrow: Rotated 90deg to point RIGHT (Inside) */}
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="transform rotate-[90deg]">
                    <path d="M12 2L2 22H22L12 2Z" />
                </svg>
            </div>
            <div className="absolute top-1/2 right-4 -translate-y-1/2 z-20 text-yellow-500 animate-pulse hidden md:block">
                {/* Right Arrow: Rotated -90deg to point LEFT (Inside) */}
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="transform rotate-[-90deg]">
                    <path d="M12 2L2 22H22L12 2Z" />
                </svg>
            </div>
        </div>
    );
};
