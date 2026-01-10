import type { ReactNode, CSSProperties } from 'react'
import { motion } from 'framer-motion'

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'danger' | 'gold'
  style?: CSSProperties
}

export function Button({ children, onClick, disabled, variant, style }: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      disabled={disabled}
      className={`btn ${variant || ''}`}
      style={style}
    >
      {children}
    </motion.button>
  )
}
