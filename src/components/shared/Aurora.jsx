import { motion } from 'framer-motion'

export default function Aurora() {
  return (
    <div className="aurora" aria-hidden="true">
      <motion.div
        className="aurora-band aurora-band-one"
        animate={{ x: [0, 36, -12, 0], y: [0, -18, 14, 0], rotate: [0, 3, -2, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="aurora-band aurora-band-two"
        animate={{ x: [0, -28, 18, 0], y: [0, 20, -10, 0], rotate: [0, -4, 2, 0] }}
        transition={{ duration: 27, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="aurora-band aurora-band-three"
        animate={{ x: [0, 18, -24, 0], y: [0, -12, 18, 0] }}
        transition={{ duration: 31, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}
