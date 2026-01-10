// Building type enumeration
export type BuildingType = 'house' | 'villa' | 'apartment' | 'skyscraper';

// Building size variants
export type BuildingSize = 'sm' | 'md' | 'lg';

// Game building type (from backend)
export type GameBuildingType = 'residential' | 'commercial' | 'industrial';

// Main component props
export interface BuildingRendererProps {
  level: number;
  size?: BuildingSize;
  showLevel?: boolean;
  animated?: boolean;
  celebrating?: boolean;
  buildingType?: GameBuildingType;
}

// Internal building component props
export interface BaseBuildingProps {
  width: number;
  height: number;
  animated: boolean;
  accentColor: string;
  level: number;
}

// Particle effect props
export interface UpgradeParticlesProps {
  active: boolean;
  onComplete?: () => void;
}

// Building type info from hook
export interface BuildingTypeInfo {
  type: BuildingType;
  subLevel: number;
  progress: number;
}
