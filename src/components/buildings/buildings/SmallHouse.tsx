import type { BaseBuildingProps } from '../types';

export function SmallHouse({ width, height, animated, accentColor, level }: BaseBuildingProps) {
  const scale = width / 48;
  const cx = width / 2;
  const baseY = height * 0.85;

  const baseW = 36 * scale;
  const baseH = 40 * scale;
  const roofH = 20 * scale;

  const windowsLit = Math.min(level, 4);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="building-svg"
    >
      <defs>
        <linearGradient id="house-left" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0a0a12" />
          <stop offset="100%" stopColor="#12121a" />
        </linearGradient>
        <linearGradient id="house-right" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#16161e" />
          <stop offset="100%" stopColor="#1e1e28" />
        </linearGradient>
        <linearGradient id="house-roof" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#2a2a3a" />
          <stop offset="100%" stopColor="#3a3a4a" />
        </linearGradient>
        <filter id="house-window-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Left face (dark) */}
      <polygon
        points={`
          ${cx - baseW/2},${baseY}
          ${cx - baseW/2},${baseY - baseH}
          ${cx},${baseY - baseH - roofH}
          ${cx},${baseY - roofH}
        `}
        fill="url(#house-left)"
        stroke="var(--line)"
        strokeWidth="1"
      />

      {/* Right face (lit) */}
      <polygon
        points={`
          ${cx},${baseY - roofH}
          ${cx},${baseY - baseH - roofH}
          ${cx + baseW/2},${baseY - baseH}
          ${cx + baseW/2},${baseY}
        `}
        fill="url(#house-right)"
        stroke="var(--line)"
        strokeWidth="1"
      />

      {/* Roof peak */}
      <polygon
        points={`
          ${cx - baseW/2},${baseY - baseH}
          ${cx},${baseY - baseH - roofH}
          ${cx + baseW/2},${baseY - baseH}
          ${cx},${baseY - baseH + roofH/2}
        `}
        fill="url(#house-roof)"
        stroke="var(--line)"
        strokeWidth="1"
      />

      {/* Window on right face */}
      <rect
        x={cx + 4 * scale}
        y={baseY - baseH + 8 * scale}
        width={8 * scale}
        height={10 * scale}
        fill={windowsLit >= 1 ? accentColor : '#1a2a3a'}
        filter={animated && windowsLit >= 1 ? 'url(#house-window-glow)' : undefined}
        className={animated && windowsLit >= 1 ? 'window-animated' : ''}
        style={{ opacity: windowsLit >= 1 ? 1 : 0.3 }}
      />

      {/* Chimney */}
      <rect
        x={cx - 4 * scale}
        y={baseY - baseH - roofH + 5 * scale}
        width={6 * scale}
        height={12 * scale}
        fill="#1a1a2a"
        stroke="var(--line)"
        strokeWidth="1"
      />

      {/* Chimney smoke (animated) */}
      {animated && (
        <circle
          cx={cx - 1 * scale}
          cy={baseY - baseH - roofH - 2 * scale}
          r={3 * scale}
          fill="rgba(255,255,255,0.2)"
          className="smoke-particle"
        />
      )}
    </svg>
  );
}
