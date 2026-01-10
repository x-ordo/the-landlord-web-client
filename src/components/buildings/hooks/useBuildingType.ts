import { useMemo } from 'react';
import type { BuildingTypeInfo } from '../types';
import { BUILDING_THRESHOLDS } from '../constants';

export function useBuildingType(level: number): BuildingTypeInfo {
  return useMemo(() => {
    if (level >= BUILDING_THRESHOLDS.skyscraper.min) {
      const subLevel = level - BUILDING_THRESHOLDS.skyscraper.min + 1;
      return { type: 'skyscraper', subLevel, progress: 1 };
    }
    if (level >= BUILDING_THRESHOLDS.apartment.min) {
      const subLevel = level - BUILDING_THRESHOLDS.apartment.min + 1;
      const range = BUILDING_THRESHOLDS.apartment.max - BUILDING_THRESHOLDS.apartment.min + 1;
      const progress = subLevel / range;
      return { type: 'apartment', subLevel, progress };
    }
    if (level >= BUILDING_THRESHOLDS.villa.min) {
      const subLevel = level - BUILDING_THRESHOLDS.villa.min + 1;
      const range = BUILDING_THRESHOLDS.villa.max - BUILDING_THRESHOLDS.villa.min + 1;
      const progress = subLevel / range;
      return { type: 'villa', subLevel, progress };
    }
    const subLevel = Math.max(1, level);
    const range = BUILDING_THRESHOLDS.house.max;
    const progress = subLevel / range;
    return { type: 'house', subLevel, progress };
  }, [level]);
}
