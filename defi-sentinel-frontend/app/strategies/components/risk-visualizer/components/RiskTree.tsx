import React from 'react';
import { Protocol, Asset, StrategyType } from '../types';
import { getRiskColor } from '../utils';

interface RiskTreeProps {
  minProtocol: Protocol;
  minAsset: Asset;
  strategies: StrategyType[];
  baseScore: number;
  finalScore: number;
}

export const RiskTree: React.FC<RiskTreeProps> = ({
  minProtocol,
  minAsset,
  strategies,
  baseScore,
  finalScore,
}) => {
  const pColor = getRiskColor(minProtocol.score);
  const aColor = getRiskColor(minAsset.score);
  const bColor = getRiskColor(baseScore);
  const fColor = getRiskColor(finalScore);

  // Layout Constants for a 1000x400 canvas
  const CANVAS_WIDTH = 1000;
  const CANVAS_HEIGHT = 400;
  const CENTER_Y = CANVAS_HEIGHT / 2;

  // Calculate total multiplier
  const totalMult = strategies.reduce((acc, s) => acc * s.multiplier, 1);
  const isPenalty = totalMult < 1;
  const impactColor = isPenalty ? '#fb923c' : '#4ade80';

  // Dynamic Strategy Box Height Calculation
  const ITEM_HEIGHT = 36;
  const HEADER_HEIGHT = 40;
  const FOOTER_HEIGHT = 40;
  const MIN_BOX_HEIGHT = 100;

  // Calculate raw content height
  const contentHeight = Math.max(strategies.length * ITEM_HEIGHT, ITEM_HEIGHT); // at least 1 item space
  const totalBoxHeight = Math.max(MIN_BOX_HEIGHT, HEADER_HEIGHT + contentHeight + FOOTER_HEIGHT);

  // Dimensions
  const STRAT_BOX_W = 260;
  const STRAT_BOX_X = 520;
  const STRAT_BOX_Y = CENTER_Y - (totalBoxHeight / 2); // Perfectly centered vertically

  // Calculate start Y for the list items inside the box
  const listStartY = HEADER_HEIGHT;

  return (
    <svg
      viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
      className="w-full h-full select-none"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <marker id="arrowhead" markerWidth="14" markerHeight="10" refX="12" refY="5" orient="auto">
          <polygon points="0 0, 14 5, 0 10" fill="#475569" />
        </marker>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* --- Connection Paths --- */}

      {/* Protocol to Base */}
      <path d={`M180 80 C 250 80, 250 ${CENTER_Y}, 320 ${CENTER_Y}`} fill="none" stroke="#334155" strokeWidth="3" />

      {/* Asset to Base */}
      <path d={`M180 320 C 250 320, 250 ${CENTER_Y}, 320 ${CENTER_Y}`} fill="none" stroke="#334155" strokeWidth="3" />

      {/* Base to Strategy Block */}
      <path d={`M440 ${CENTER_Y} L 515 ${CENTER_Y}`} fill="none" stroke="#334155" strokeWidth="3" markerEnd="url(#arrowhead)" />

      {/* Strategy Block to Final */}
      <path d={`M${STRAT_BOX_X + STRAT_BOX_W} ${CENTER_Y} L ${CANVAS_WIDTH - 140} ${CENTER_Y}`} fill="none" stroke="#334155" strokeWidth="3" markerEnd="url(#arrowhead)" />


      {/* --- Nodes --- */}

      {/* 1. Protocol Node (Top Left) */}
      {/* 1. Protocol Node (Top Left) */}
      <g transform="translate(20, 40)">
        <rect x="0" y="0" width="160" height="80" rx="12" fill="#1e293b" stroke={pColor} strokeWidth="3" />
        <text x="80" y="35" textAnchor="middle" fill="#e2e8f0" fontSize="18" fontWeight="bold">{minProtocol.name}</text>
        <text x="80" y="60" textAnchor="middle" fill={pColor} fontSize="16" fontWeight="bold">Score: {minProtocol.score}</text>
      </g>

      {/* 2. Asset Node (Bottom Left) */}
      <g transform="translate(20, 280)">
        <rect x="0" y="0" width="160" height="80" rx="12" fill="#1e293b" stroke={aColor} strokeWidth="3" />
        <text x="80" y="35" textAnchor="middle" fill="#e2e8f0" fontSize="18" fontWeight="bold">{minAsset.name}</text>
        <text x="80" y="60" textAnchor="middle" fill={aColor} fontSize="16" fontWeight="bold">Score: {minAsset.score}</text>
      </g>

      {/* 3. Base Score Node (Center Left) */}
      <g transform={`translate(320, ${CENTER_Y - 40})`}>
        <rect x="0" y="0" width="120" height="80" rx="12" fill="#0f172a" stroke="#475569" strokeWidth="2" />
        <text x="60" y="25" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="bold">Base Score</text>
        <text x="60" y="65" textAnchor="middle" fill={bColor} fontSize="28" fontWeight="bold">{baseScore}</text>
      </g>

      {/* 4. Strategy Modification Layer (Center Right - Dynamic Box) */}
      <g transform={`translate(${STRAT_BOX_X}, ${STRAT_BOX_Y})`}>
        {/* Container */}
        <rect
          x="0"
          y="0"
          width={STRAT_BOX_W}
          height={totalBoxHeight}
          rx="8"
          fill="#1e293b"
          stroke="#334155"
          strokeWidth="2"
          strokeDasharray="6 4"
        />

        {/* Header inside box */}
        <rect x="0" y="0" width={STRAT_BOX_W} height="40" rx="8" fill="#1e293b" opacity="0.5" />
        <text x={STRAT_BOX_W / 2} y="26" textAnchor="middle" fill="#e2e8f0" fontSize="16" fontWeight="bold" letterSpacing="0.05em">Strategy Modifiers</text>

        {/* Strategy List */}
        <g transform={`translate(20, ${listStartY + 20})`}>
          {strategies.length === 0 ? (
            <text x={STRAT_BOX_W / 2 - 20} y="0" textAnchor="middle" fill="#64748b" fontSize="16" fontStyle="italic">No active strategies</text>
          ) : (
            strategies.map((strat, index) => {
              const yPos = index * ITEM_HEIGHT;
              const sColor = strat.multiplier < 1 ? '#fb923c' : '#4ade80';

              return (
                <g key={strat.id} transform={`translate(0, ${yPos})`}>
                  {index > 0 && <line x1="0" y1="-18" x2={STRAT_BOX_W - 40} y2="-18" stroke="#334155" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />}
                  <text x="0" y="0" fill="#cbd5e1" fontSize="16" fontWeight="500">{strat.name}</text>
                  <text x={STRAT_BOX_W - 40} y="0" textAnchor="end" fill={sColor} fontSize="16" fontWeight="bold" fontFamily="monospace">
                    {strat.multiplier}x
                  </text>
                </g>
              );
            })
          )}
        </g>

        {/* Footer (Total Multiplier) - Always at the bottom of the calculated height */}
        <line x1="0" y1={totalBoxHeight - 40} x2={STRAT_BOX_W} y2={totalBoxHeight - 40} stroke="#334155" strokeWidth="2" />
        <g transform={`translate(0, ${totalBoxHeight - 15})`}>
          <text x="20" y="2" fill="#94a3b8" fontSize="12" fontWeight="bold">Cumulative</text>
          <text x={STRAT_BOX_W - 20} y="4" textAnchor="end" fill={impactColor} fontSize="20" fontWeight="bold">
            {totalMult.toFixed(2)}x
          </text>
        </g>
      </g>

      {/* 5. Final Score Node (Right) */}
      <g transform={`translate(${CANVAS_WIDTH - 120}, ${CENTER_Y})`}>
        <circle cx="0" cy="0" r="70" fill="#0f172a" stroke={fColor} strokeWidth="4" />
        <circle cx="0" cy="0" r="60" fill="none" stroke={fColor} strokeWidth="1" opacity="0.3" />
        <text x="0" y="-35" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="bold" letterSpacing="0.1em">Score</text>
        <text x="0" y="20" textAnchor="middle" fill={fColor} fontSize="48" fontWeight="bold">{finalScore}</text>
      </g>

    </svg>
  );
};
