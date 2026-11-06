import { useEffect, useRef } from 'react'
import './GlowCursor.css'

export default function GlowCursor({
  color = '#67E8F9',
  secondaryColor = '#A78BFA',
}) {
  const cursorRef = useRef(null)
  const glowRef = useRef(null)
  const ringRef = useRef(null)
  const dotRef = useRef(null)

  useEffect(() => {
    const cursor = cursorRef.current
    const glow = glowRef.current
    const ring = ringRef.current
    const dot = dotRef.current
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    if (!cursor || !glow || !ring || !dot || !finePointer.matches || reducedMotion.matches) return undefined

    let frameId = 0
    let pointerX = 0
    let pointerY = 0

    const moveCursor = (event) => {
      pointerX = event.clientX
      pointerY = event.clientY
      if (frameId) return

      frameId = requestAnimationFrame(() => {
        const position = `translate3d(${pointerX}px, ${pointerY}px, 0) translate(-50%, -50%)`
        dot.style.transform = position
        ring.style.transform = position
        glow.style.transform = position
        cursor.dataset.visible = 'true'
        frameId = 0
      })
    }

    const hideCursor = () => {
      cursor.dataset.visible = 'false'
    }

    const handleVisibilityChange = () => {
      if (document.hidden) hideCursor()
    }

    window.addEventListener('pointermove', moveCursor, { passive: true })
    window.addEventListener('blur', hideCursor)
    window.addEventListener('pointerleave', hideCursor)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('pointermove', moveCursor)
      window.removeEventListener('blur', hideCursor)
      window.removeEventListener('pointerleave', hideCursor)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  return (
    <div
      ref={cursorRef}
      className="glow-cursor"
      data-visible="false"
      aria-hidden="true"
      style={{ '--cursor-color': color, '--cursor-secondary-color': secondaryColor }}
    >
      <span ref={glowRef} className="glow-cursor-glow" />
      <span ref={ringRef} className="glow-cursor-ring" />
      <span ref={dotRef} className="glow-cursor-dot" />
    </div>
  )
}
