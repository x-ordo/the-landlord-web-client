import type { ReactNode, CSSProperties } from 'react'
import { motion } from 'framer-motion'

interface CardProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
}

export function Card({ children, className = '', style }: CardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`card ${className}`}
      style={style}
    >
      {children}
    </motion.div>
  )
}
