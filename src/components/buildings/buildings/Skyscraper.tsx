import { useMemo } from 'react';
import type { BaseBuildingProps } from '../types';

export function Skyscraper({ width, height, animated, accentColor, level }: BaseBuildingProps) {
  const scale = width / 144;
  const cx = width / 2;
  const baseY = height * 0.98;

  const floors = Math.min(10 + level, 20);
  const floorH = 8 * scale;
  const buildingH = floorH * floors;
  const baseW = 50 * scale;

  const windowCols = 5;
  const windowRows = Math.min(floors, 15);

  // Generate random window states (memoized for stable rendering)
  const windowStates = useMemo(() => {
    return Array.from({ length: windowRows }, () =>
      Array.from({ length: windowCols }, () => Math.random() > 0.4)
    );
  }, [windowRows, windowCols]);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="building-svg"
    >
      <defs>
        <linearGradient id="sky-left" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#050510" />
          <stop offset="100%" stopColor="#0a0a18" />
        </linearGradient>
        <linearGradient id="sky-right" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0e0e1a" />
          <stop offset="50%" stopColor="#14142a" />
          <stop offset="100%" stopColor="#0e0e1a" />
        </linearGradient>
        <linearGradient id="sky-glass" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(0,217,255,0.1)" />
          <stop offset="50%" stopColor="rgba(0,217,255,0.05)" />
          <stop offset="100%" stopColor="rgba(0,217,255,0.15)" />
        </linearGradient>
        <linearGradient id="sky-top" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#1a1a2a" />
          <stop offset="100%" stopColor="#2a2a3a" />
        </linearGradient>

        <filter id="neon-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="sky-window-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="0.8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Left face */}
      <polygon
        points={`
          ${cx - baseW * 0.4},${baseY}
          ${cx - baseW * 0.4},${baseY - buildingH}
          ${cx - baseW * 0.1},${baseY - buildingH - 4 * scale}
          ${cx - baseW * 0.1},${baseY - 4 * scale}
        `}
        fill="url(#sky-left)"
        stroke="var(--line)"
        strokeWidth="0.5"
      />

      {/* Right face (main glass facade) */}
      <polygon
        points={`
          ${cx - baseW * 0.1},${baseY - 4 * scale}
          ${cx - baseW * 0.1},${baseY - buildingH - 4 * scale}
          ${cx + baseW * 0.4},${baseY - buildingH}
          ${cx + baseW * 0.4},${baseY}
        `}
        fill="url(#sky-right)"
        stroke="var(--line)"
        strokeWidth="0.5"
      />

      {/* Glass reflection overlay */}
      <polygon
        points={`
          ${cx - baseW * 0.1},${baseY - 4 * scale}
          ${cx - baseW * 0.1},${baseY - buildingH - 4 * scale}
          ${cx + baseW * 0.4},${baseY - buildingH}
          ${cx + baseW * 0.4},${baseY}
        `}
        fill="url(#sky-glass)"
      />

      {/* Roof */}
      <polygon
        points={`
          ${cx - baseW * 0.4},${baseY - buildingH}
          ${cx - baseW * 0.1},${baseY - buildingH - 4 * scale}
          ${cx + baseW * 0.4},${baseY - buildingH}
          ${cx + baseW * 0.1},${baseY - buildingH + 3 * scale}
        `}
        fill="url(#sky-top)"
        stroke="var(--line)"
        strokeWidth="0.5"
      />

      {/* Window grid on right face */}
      {windowStates.map((rowStates, row) =>
        rowStates.map((isLit, col) => {
          const wx = cx - baseW * 0.05 + col * 8 * scale;
          const wy = baseY - buildingH + 2 * scale + row * floorH;

          return (
            <rect
              key={`w-${row}-${col}`}
              x={wx}
              y={wy}
              width={5 * scale}
              height={5 * scale}
              fill={isLit ? accentColor : '#0a0a14'}
              filter={animated && isLit ? 'url(#sky-window-glow)' : undefined}
              className={animated ? 'window-flicker' : ''}
              style={{
                opacity: isLit ? 0.85 : 0.15,
                animationDelay: `${(row * windowCols + col) * 0.05}s`,
                animationDuration: `${2 + (row * col % 3)}s`,
              }}
            />
          );
        })
      )}

      {/* Corporate accent band */}
      <rect
        x={cx - baseW * 0.08}
        y={baseY - buildingH * 0.3}
        width={baseW * 0.46}
        height={3 * scale}
        fill={accentColor}
        filter="url(#neon-glow)"
        opacity={0.9}
        className={animated ? 'accent-pulse' : ''}
      />

      {/* Antenna */}
      <line
        x1={cx}
        y1={baseY - buildingH - 4 * scale}
        x2={cx}
        y2={baseY - buildingH - 20 * scale}
        stroke="#3a3a4a"
        strokeWidth={2 * scale}
      />

      {/* Antenna tip with blinking light */}
      <circle
        cx={cx}
        cy={baseY - buildingH - 20 * scale}
        r={2 * scale}
        fill="var(--red)"
        filter="url(#neon-glow)"
        className={animated ? 'blink-slow' : ''}
      />

      {/* Antenna support wires */}
      <line
        x1={cx}
        y1={baseY - buildingH - 12 * scale}
        x2={cx - 10 * scale}
        y2={baseY - buildingH - 4 * scale}
        stroke="#2a2a3a"
        strokeWidth={0.5 * scale}
      />
      <line
        x1={cx}
        y1={baseY - buildingH - 12 * scale}
        x2={cx + 10 * scale}
        y2={baseY - buildingH - 4 * scale}
        stroke="#2a2a3a"
        strokeWidth={0.5 * scale}
      />
    </svg>
  );
}
