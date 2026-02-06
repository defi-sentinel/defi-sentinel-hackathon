import React, { useEffect, useRef } from 'react';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    size: number;
    life: number;
    decay: number;
}

const COLORS = ['#ef4444', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];

export const Confetti: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationId: number;
        let particles: Particle[] = [];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resize);
        resize();

        const createParticles = (amount: number, x: number, y: number) => {
            for (let i = 0; i < amount; i++) {
                particles.push({
                    x,
                    y,
                    vx: (Math.random() - 0.5) * 10,
                    vy: (Math.random() - 0.5) * 10 - 5, // Upward bias
                    color: COLORS[Math.floor(Math.random() * COLORS.length)],
                    size: Math.random() * 8 + 4,
                    life: 1.0,
                    decay: Math.random() * 0.01 + 0.005,
                });
            }
        };

        // Burst from center
        createParticles(100, canvas.width / 2, canvas.height / 2);

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((p, index) => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.2; // Gravity
                p.life -= p.decay;
                p.size *= 0.99; // Shrink slightly

                ctx.globalAlpha = Math.max(0, p.life);
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();

                if (p.life <= 0) {
                    particles.splice(index, 1);
                }
            });

            // Continuous trickle
            if (Math.random() > 0.9) {
                createParticles(2, Math.random() * canvas.width, -10);
            }

            if (particles.length > 0) {
                animationId = requestAnimationFrame(animate);
            }
        };

        animate();

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-50"
        />
    );
};
