import type { BuildingSize, GameBuildingType } from './types';

// Size dimension mapping
export const SIZE_MAP: Record<BuildingSize, number> = {
  sm: 48,
  md: 96,
  lg: 144,
};

// Building level thresholds
export const BUILDING_THRESHOLDS = {
  house: { min: 1, max: 4 },
  villa: { min: 5, max: 9 },
  apartment: { min: 10, max: 19 },
  skyscraper: { min: 20, max: Infinity },
} as const;

// Building accent colors based on game building_type
export const BUILDING_COLORS: Record<GameBuildingType, {
  primary: string;
  secondary: string;
  window: string;
  windowOff: string;
}> = {
  residential: {
    primary: 'var(--neon-blue)',
    secondary: '#0a5c6e',
    window: '#00d9ff',
    windowOff: '#1a3a4a',
  },
  commercial: {
    primary: 'var(--gold)',
    secondary: '#6e5c0a',
    window: '#ffcc00',
    windowOff: '#4a3a1a',
  },
  industrial: {
    primary: 'var(--red)',
    secondary: '#6e0a2a',
    window: '#ff0055',
    windowOff: '#4a1a2a',
  },
};
