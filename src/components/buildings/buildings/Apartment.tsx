import { useMemo } from 'react';
import type { BaseBuildingProps } from '../types';

export function Apartment({ width, height, animated, accentColor, level }: BaseBuildingProps) {
  const scale = width / 96;
  const cx = width / 2;
  const baseY = height * 0.95;

  const floors = Math.min(4 + Math.floor(level / 3), 8);
  const floorH = 14 * scale;
  const buildingH = floorH * floors;
  const baseW = 60 * scale;

  const windowCols = 4;
  const windowRows = floors;
  const totalWindows = windowCols * windowRows;
  const litWindows = Math.floor((level / 10) * totalWindows);

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
        <linearGradient id="apt-left" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#08080e" />
          <stop offset="100%" stopColor="#101018" />
        </linearGradient>
        <linearGradient id="apt-right" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#141420" />
          <stop offset="100%" stopColor="#1c1c28" />
        </linearGradient>
        <linearGradient id="apt-top" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#1e1e2e" />
          <stop offset="100%" stopColor="#2e2e3e" />
        </linearGradient>
        <filter id="apt-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Left face */}
      <polygon
        points={`
          ${cx - baseW * 0.45},${baseY}
          ${cx - baseW * 0.45},${baseY - buildingH}
          ${cx},${baseY - buildingH - 6 * scale}
          ${cx},${baseY - 6 * scale}
        `}
        fill="url(#apt-left)"
        stroke="var(--line)"
        strokeWidth="1"
      />

      {/* Right face */}
      <polygon
        points={`
          ${cx},${baseY - 6 * scale}
          ${cx},${baseY - buildingH - 6 * scale}
          ${cx + baseW * 0.45},${baseY - buildingH}
          ${cx + baseW * 0.45},${baseY}
        `}
        fill="url(#apt-right)"
        stroke="var(--line)"
        strokeWidth="1"
      />

      {/* Roof */}
      <polygon
        points={`
          ${cx - baseW * 0.45},${baseY - buildingH}
          ${cx},${baseY - buildingH - 6 * scale}
          ${cx + baseW * 0.45},${baseY - buildingH}
          ${cx},${baseY - buildingH + 4 * scale}
        `}
        fill="url(#apt-top)"
        stroke="var(--line)"
        strokeWidth="1"
      />

      {/* Window grid on right face */}
      {windowStates.map((rowStates, row) =>
        rowStates.map((isRandomLit, col) => {
          const windowIdx = row * windowCols + col;
          const isLit = windowIdx < litWindows || isRandomLit;
          const wx = cx + 4 * scale + col * 10 * scale;
          const wy = baseY - buildingH + 4 * scale + row * floorH;

          return (
            <rect
              key={`w-${row}-${col}`}
              x={wx}
              y={wy}
              width={6 * scale}
              height={8 * scale}
              fill={isLit ? accentColor : '#0a1520'}
              filter={animated && isLit ? 'url(#apt-glow)' : undefined}
              className={animated && isLit ? 'window-animated-random' : ''}
              style={{
                opacity: isLit ? 0.9 : 0.2,
                animationDelay: `${(row * windowCols + col) * 0.1}s`,
              }}
            />
          );
        })
      )}

      {/* Rooftop water tank */}
      <rect
        x={cx - 8 * scale}
        y={baseY - buildingH - 14 * scale}
        width={16 * scale}
        height={10 * scale}
        fill="#1a1a2a"
        stroke="var(--line)"
        strokeWidth="1"
      />

      {/* Tank stand */}
      <rect
        x={cx - 2 * scale}
        y={baseY - buildingH - 6 * scale}
        width={4 * scale}
        height={6 * scale}
        fill="#121218"
      />
    </svg>
  );
}
