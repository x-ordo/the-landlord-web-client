// Main component
export { BuildingRenderer } from './BuildingRenderer';

// Types
export type {
  BuildingRendererProps,
  BuildingType,
  BuildingSize,
  GameBuildingType,
} from './types';

// Individual buildings (for advanced usage)
export { SmallHouse, Villa, Apartment, Skyscraper } from './buildings';

// Effects
export { UpgradeParticles } from './effects';

// Hooks
export { useBuildingType } from './hooks';
