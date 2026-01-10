import type { BaseBuildingProps } from '../types';

export function Villa({ width, height, animated, accentColor, level }: BaseBuildingProps) {
  const scale = width / 96;
  const cx = width / 2;
  const baseY = height * 0.9;

  const baseW = 70 * scale;
  const floorH = 28 * scale;
  const floors = 2;
  const buildingH = floorH * floors;

  const windowCols = Math.min(2 + Math.floor(level / 2), 4);
  const windowsLit = level;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="building-svg"
    >
      <defs>
        <linearGradient id="villa-left" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0c0c14" />
          <stop offset="100%" stopColor="#14141c" />
        </linearGradient>
        <linearGradient id="villa-right" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#18181f" />
          <stop offset="100%" stopColor="#202028" />
        </linearGradient>
        <linearGradient id="villa-top" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#242434" />
          <stop offset="100%" stopColor="#343444" />
        </linearGradient>
        <filter id="villa-window-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
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
          ${cx},${baseY - buildingH - 8 * scale}
          ${cx},${baseY - 8 * scale}
        `}
        fill="url(#villa-left)"
        stroke="var(--line)"
        strokeWidth="1"
      />

      {/* Right face */}
      <polygon
        points={`
          ${cx},${baseY - 8 * scale}
          ${cx},${baseY - buildingH - 8 * scale}
          ${cx + baseW * 0.4},${baseY - buildingH}
          ${cx + baseW * 0.4},${baseY}
        `}
        fill="url(#villa-right)"
        stroke="var(--line)"
        strokeWidth="1"
      />

      {/* Flat roof (isometric top) */}
      <polygon
        points={`
          ${cx - baseW * 0.4},${baseY - buildingH}
          ${cx},${baseY - buildingH - 8 * scale}
          ${cx + baseW * 0.4},${baseY - buildingH}
          ${cx},${baseY - buildingH + 6 * scale}
        `}
        fill="url(#villa-top)"
        stroke="var(--line)"
        strokeWidth="1"
      />

      {/* Windows - Floor 1 (right face) */}
      {Array.from({ length: windowCols }).map((_, i) => {
        const isLit = i < windowsLit;
        const wx = cx + 6 * scale + i * 12 * scale;
        const wy = baseY - floorH + 6 * scale;
        return (
          <rect
            key={`f1-${i}`}
            x={wx}
            y={wy}
            width={8 * scale}
            height={12 * scale}
            fill={isLit ? accentColor : '#1a2a3a'}
            filter={animated && isLit ? 'url(#villa-window-glow)' : undefined}
            className={animated && isLit ? 'window-animated' : ''}
            style={{
              opacity: isLit ? 1 : 0.3,
              animationDelay: `${i * 0.2}s`
            }}
          />
        );
      })}

      {/* Windows - Floor 2 (right face) */}
      {Array.from({ length: windowCols }).map((_, i) => {
        const isLit = i + windowCols < windowsLit * 2;
        const wx = cx + 6 * scale + i * 12 * scale;
        const wy = baseY - floorH * 2 + 6 * scale;
        return (
          <rect
            key={`f2-${i}`}
            x={wx}
            y={wy}
            width={8 * scale}
            height={12 * scale}
            fill={isLit ? accentColor : '#1a2a3a'}
            filter={animated && isLit ? 'url(#villa-window-glow)' : undefined}
            className={animated && isLit ? 'window-animated' : ''}
            style={{
              opacity: isLit ? 1 : 0.3,
              animationDelay: `${(i + windowCols) * 0.15}s`
            }}
          />
        );
      })}

      {/* Balcony railing */}
      <line
        x1={cx + 4 * scale}
        y1={baseY - buildingH + 2 * scale}
        x2={cx + baseW * 0.35}
        y2={baseY - buildingH + 2 * scale}
        stroke={accentColor}
        strokeWidth={2 * scale}
        opacity={0.8}
      />
    </svg>
  );
}
