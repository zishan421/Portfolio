import { motion } from 'framer-motion'
import { useMagnet } from '../../hooks/useMagnet'

export default function MagneticButton({ children, className = '', onClick, strength = 0.35 }) {
  const { ref, springX, springY, handleMouseMove, handleMouseLeave } = useMagnet(strength)

  return (
    <motion.button
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={className}
      whileTap={{ scale: 0.97 }}
    >
      {children}
    </motion.button>
  )
}
