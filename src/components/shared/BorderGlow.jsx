import { useCallback, useEffect, useRef } from 'react'
import './BorderGlow.css'

function parseHsl(value) {
  const match = value.match(/([\d.]+)\s+([\d.]+)\s+([\d.]+)/)
  return match ? match.slice(1).map(Number) : [40, 80, 80]
}

function glowVariables(glowColor, intensity) {
  const [hue, saturation, lightness] = parseHsl(glowColor)
  return Object.fromEntries([100, 60, 40, 20, 10].map((opacity) => [
    `--glow-color-${opacity}`,
    `hsl(${hue} ${saturation}% ${lightness}% / ${Math.min(opacity * intensity, 100)}%)`,
  ]))
}

export default function BorderGlow({
  children,
  className = '',
  edgeSensitivity = 30,
  glowColor = '190 85 70',
  backgroundColor = '#120F17',
  borderRadius = 20,
  glowRadius = 34,
  glowIntensity = 1,
  coneSpread = 25,
  animated = false,
  colors = ['#a78bfa', '#22d3ee', '#f472b6'],
  fillOpacity = 0.28,
}) {
  const cardRef = useRef(null)
  const getCenter = useCallback((element) => {
    const { width, height } = element.getBoundingClientRect()
    return [width / 2, height / 2]
  }, [])

  const updateGlow = useCallback((event) => {
    const card = cardRef.current
    if (!card) return
    const bounds = card.getBoundingClientRect()
    const x = event.clientX - bounds.left
    const y = event.clientY - bounds.top
    const [centerX, centerY] = getCenter(card)
    const edge = Math.min(1, Math.max(0, Math.min(
      Math.abs(x - centerX) / centerX,
      Math.abs(y - centerY) / centerY,
    )))
    const angle = (Math.atan2(y - centerY, x - centerX) * 180 / Math.PI + 90 + 360) % 360
    card.style.setProperty('--edge-proximity', `${edge * 100}`)
    card.style.setProperty('--cursor-angle', `${angle}deg`)
  }, [getCenter])

  useEffect(() => {
    if (!animated || !cardRef.current) return undefined
    const card = cardRef.current
    let frameId = 0
    const start = performance.now()
    const sweep = (now) => {
      const progress = Math.min((now - start) / 3600, 1)
      card.style.setProperty('--edge-proximity', `${Math.sin(progress * Math.PI) * 100}`)
      card.style.setProperty('--cursor-angle', `${110 + progress * 355}deg`)
      if (progress < 1) frameId = requestAnimationFrame(sweep)
    }
    frameId = requestAnimationFrame(sweep)
    return () => cancelAnimationFrame(frameId)
  }, [animated])

  return (
    <div
      ref={cardRef}
      className={`border-glow-card ${className}`}
      onPointerMove={updateGlow}
      style={{
        '--card-bg': backgroundColor,
        '--edge-sensitivity': edgeSensitivity,
        '--border-radius': `${borderRadius}px`,
        '--glow-padding': `${glowRadius}px`,
        '--cone-spread': coneSpread,
        '--fill-opacity': fillOpacity,
        '--gradient-one': colors[0],
        '--gradient-two': colors[1] || colors[0],
        '--gradient-three': colors[2] || colors[0],
        ...glowVariables(glowColor, glowIntensity),
      }}
    >
      <span className="edge-light" />
      <div className="border-glow-inner">{children}</div>
    </div>
  )
}
