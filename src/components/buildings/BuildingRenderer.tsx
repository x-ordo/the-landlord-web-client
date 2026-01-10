import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBuildingType } from './hooks/useBuildingType';
import { SmallHouse, Villa, Apartment, Skyscraper } from './buildings';
import { UpgradeParticles } from './effects/UpgradeParticles';
import { SIZE_MAP, BUILDING_COLORS } from './constants';
import type { BuildingRendererProps, BaseBuildingProps, BuildingType } from './types';
import './styles/buildings.css';

const BUILDING_COMPONENTS: Record<BuildingType, React.ComponentType<BaseBuildingProps>> = {
  house: SmallHouse,
  villa: Villa,
  apartment: Apartment,
  skyscraper: Skyscraper,
};

export function BuildingRenderer({
  level,
  size = 'md',
  showLevel = false,
  animated = true,
  celebrating = false,
  buildingType = 'residential',
}: BuildingRendererProps) {
  const { type, subLevel } = useBuildingType(level);
  const BuildingComponent = BUILDING_COMPONENTS[type];
  const colors = BUILDING_COLORS[buildingType];
  const dimension = SIZE_MAP[size];

  const buildingProps: BaseBuildingProps = {
    width: dimension,
    height: dimension * 1.5,
    animated,
    accentColor: colors.primary,
    level: subLevel,
  };

  return (
    <div
      className="building-container"
      style={{
        position: 'relative',
        width: dimension,
        height: dimension * 1.5,
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={type}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1.1, y: -10 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 25,
            duration: 0.5
          }}
        >
          <BuildingComponent {...buildingProps} />
        </motion.div>
      </AnimatePresence>

      {celebrating && <UpgradeParticles active={celebrating} />}

      {showLevel && (
        <div
          className="building-level-badge"
          style={{
            position: 'absolute',
            bottom: -8,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--card)',
            border: '1px solid var(--line)',
            borderRadius: 999,
            padding: '2px 8px',
            fontSize: size === 'sm' ? 10 : 12,
            fontWeight: 700,
            color: 'var(--fg)',
          }}
        >
          Lv.{level}
        </div>
      )}
    </div>
  );
}
