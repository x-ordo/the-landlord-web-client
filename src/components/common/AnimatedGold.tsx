import { useEffect } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'
import { fmtGold } from '../../util'

export function AnimatedGold({ value }: { value: number }) {
  const spring = useSpring(0, { stiffness: 60, damping: 20 })
  const display = useTransform(spring, (current) => fmtGold(Math.floor(current)))

  useEffect(() => {
    spring.set(value)
  }, [value, spring])

  return <motion.span>{display}</motion.span>
}
