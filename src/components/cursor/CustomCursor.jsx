import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const springX = useSpring(cursorX, { stiffness: 400, damping: 35 })
  const springY = useSpring(cursorY, { stiffness: 400, damping: 35 })

  const dotX = useMotionValue(-100)
  const dotY = useMotionValue(-100)
  const dotSpringX = useSpring(dotX, { stiffness: 700, damping: 40 })
  const dotSpringY = useSpring(dotY, { stiffness: 700, damping: 40 })

  const scaleRef = useRef({ scale: 1 })

  useEffect(() => {
    // Only show on non-touch devices
    if (window.matchMedia('(hover: none)').matches) return

    let frameId = 0
    let latestX = -100
    let latestY = -100

    const onMove = (e) => {
      latestX = e.clientX
      latestY = e.clientY
      if (frameId) return

      frameId = requestAnimationFrame(() => {
        cursorX.set(latestX)
        cursorY.set(latestY)
        dotX.set(latestX)
        dotY.set(latestY)
        frameId = 0
      })
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      if (frameId) cancelAnimationFrame(frameId)
    }
  }, [cursorX, cursorY, dotX, dotY])

  // Hide on touch
  if (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches) {
    return null
  }

  return (
    <>
      {/* Outer ring — slow follower */}
      <motion.div
        className="cursor-ring"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
          width: 32,
          height: 32,
          borderRadius: '50%',
          border: '1px solid rgba(124,58,237,0.6)',
          pointerEvents: 'none',
          zIndex: 9999,
          mixBlendMode: 'difference',
        }}
      />
      {/* Inner dot — fast follower */}
      <motion.div
        className="cursor-dot"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          x: dotSpringX,
          y: dotSpringY,
          translateX: '-50%',
          translateY: '-50%',
          width: 5,
          height: 5,
          borderRadius: '50%',
          backgroundColor: '#A78BFA',
          pointerEvents: 'none',
          zIndex: 9999,
        }}
      />
    </>
  )
}
