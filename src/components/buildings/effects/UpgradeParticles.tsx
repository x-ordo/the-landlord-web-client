import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { UpgradeParticlesProps } from '../types';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
}

const PARTICLE_COLORS = ['var(--gold)', 'var(--neon-blue)', '#fff'];

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 40 + Math.random() * 20,
    y: 60 + Math.random() * 20,
    size: 4 + Math.random() * 8,
    color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
    delay: Math.random() * 0.3,
  }));
}

export function UpgradeParticles({ active, onComplete }: UpgradeParticlesProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (active) {
      setParticles(generateParticles(20));
      const timer = window.setTimeout(() => {
        onComplete?.();
      }, 1500);
      return () => window.clearTimeout(timer);
    } else {
      setParticles([]);
    }
  }, [active, onComplete]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{
              x: `${particle.x}%`,
              y: `${particle.y}%`,
              scale: 0,
              opacity: 1,
            }}
            animate={{
              y: `${particle.y - 40 - Math.random() * 30}%`,
              x: `${particle.x + (Math.random() - 0.5) * 40}%`,
              scale: [0, 1.5, 0],
              opacity: [1, 1, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 1.2,
              delay: particle.delay,
              ease: 'easeOut',
            }}
            style={{
              position: 'absolute',
              width: particle.size,
              height: particle.size,
              borderRadius: '50%',
              backgroundColor: particle.color,
              boxShadow: `0 0 ${particle.size}px ${particle.color}`,
            }}
          />
        ))}
      </AnimatePresence>

      {/* Central flash effect */}
      {active && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: [0, 0.8, 0], scale: [0.5, 1.5, 2] }}
          transition={{ duration: 0.6 }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle, var(--gold) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
}
