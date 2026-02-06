"use client";

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import Image from "next/image";
import { X, ExternalLink } from "lucide-react";
import { BADGE_DETAILS } from "@/lib/constants";

interface BadgePopupProps {
    badgeIds: number[];
    onClose: () => void;
    title?: string;
    message?: string;
    buttonText?: string;
    onButtonClick?: () => void;
}

export default function BadgePopup({
    badgeIds,
    onClose,
    title,
    message,
    buttonText = "Awesome!",
    onButtonClick
}: BadgePopupProps) {
    useEffect(() => {
        if (badgeIds?.length > 0) {
            // Trigger confetti
            const duration = 3000;
            const end = Date.now() + duration;

            const frame = () => {
                confetti({
                    particleCount: 5,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: ['#FFD700', '#FFA500', '#FF4500']
                });
                confetti({
                    particleCount: 5,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: ['#00BFFF', '#1E90FF', '#4169E1']
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            };
            frame();
        }
    }, [badgeIds]);

    if (!badgeIds || badgeIds.length === 0) return null;

    // Filter valid badges
    const badges = badgeIds.map(id => BADGE_DETAILS[id]).filter(Boolean);
    if (badges.length === 0) return null;

    const isMultiple = badges.length > 1;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className={`bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 w-full text-center relative border border-gray-200 dark:border-gray-800 animate-in zoom-in-95 duration-300 transform ${isMultiple ? 'max-w-2xl' : 'max-w-sm'}`}>
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                    <X size={24} />
                </button>

                <div className="space-y-2 mb-8">
                    <div className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs font-bold uppercase tracking-wider shadow-sm">
                        {title || (isMultiple ? "New Badges Unlocked!" : "New Badge Unlocked!")}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {isMultiple ? "Congratulations!" : badges[0].name}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                        {message || (isMultiple ? `You've earned ${badges.length} new badges.` : badges[0].description)}
                    </p>
                </div>

                <div className={`flex flex-wrap justify-center gap-8 mb-8`}>
                    {badges.map((badge, idx) => (
                        <div key={idx} className="flex flex-col items-center max-w-[140px]">
                            <div className="relative w-32 h-32 mb-4 group">
                                <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-xl animate-pulse group-hover:bg-yellow-500/30 transition-all" />
                                <Image
                                    src={badge.image}
                                    alt={badge.name}
                                    fill
                                    className="object-contain drop-shadow-lg transform group-hover:scale-110 transition-transform duration-300"
                                    priority={idx === 0}
                                />
                            </div>
                            {isMultiple && (
                                <div className="mt-2 text-center w-full">
                                    <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-tight mb-1">{badge.name}</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{badge.description}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex flex-col gap-3 max-w-xs mx-auto">
                    <button
                        onClick={() => {
                            if (onButtonClick) onButtonClick();
                            onClose();
                        }}
                        className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {buttonText}
                    </button>
                </div>
            </div>
        </div>
    );
}
