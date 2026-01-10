/**
 * Game economy constants
 * These values should match the backend constants
 */

// Asset calculation multipliers
export const BUILDING_ASSET_MULTIPLIER = 10000
export const GPS_ASSET_MULTIPLIER = 1000

// Raid mechanics
export const LOOT_RATIO = 0.3
export const MAX_UNCOLLECTED_HOURS = 24

// Employee/Viral bonuses
export const EMPLOYEE_GPS_BONUS = 0.1
export const MAX_EMPLOYEE_GPS_MULTIPLIER = 2.0

// Upgrade costs
export const UPGRADE_COST_PER_LEVEL = 1000

/**
 * Calculate total assets from user snapshot
 */
export function calculateAssets(gold: number, buildingLevel: number, gps: number): number {
  return gold + buildingLevel * BUILDING_ASSET_MULTIPLIER + gps * GPS_ASSET_MULTIPLIER
}

/**
 * Calculate upgrade cost for current level
 */
export function calculateUpgradeCost(currentLevel: number): number {
  return currentLevel * UPGRADE_COST_PER_LEVEL
}
