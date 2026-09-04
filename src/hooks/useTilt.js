import { useMotionValue, useSpring } from 'framer-motion'

export function useTilt(intensity = 7) {
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const springX = useSpring(rotateX, { stiffness: 180, damping: 22 })
  const springY = useSpring(rotateY, { stiffness: 180, damping: 22 })

  const onPointerMove = (event) => {
    if (event.pointerType === 'touch') return
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width - 0.5
    const y = (event.clientY - bounds.top) / bounds.height - 0.5
    rotateY.set(x * intensity)
    rotateX.set(y * -intensity)
  }

  const onPointerLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
  }

  return {
    tiltStyle: { rotateX: springX, rotateY: springY, transformPerspective: 900 },
    tiltHandlers: { onPointerMove, onPointerLeave },
  }
}
