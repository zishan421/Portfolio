import { useEffect, useRef } from 'react'

function hexToRgb(color) {
  const value = color.replace('#', '')
  const normalized = value.length === 3 ? value.split('').map((part) => part + part).join('') : value
  const number = Number.parseInt(normalized, 16)
  return `${number >> 16}, ${number >> 8 & 255}, ${number & 255}`
}

export default function GhostFibers({
  lineColor = '#140E35',
  glowColor = '#3437A0',
  speed = 0.2,
  scale = 2,
  rotation = 0,
  rotationSpeed = 0.25,
  layers = 4,
  waveAmplitude = 0.015,
  waveFrequency = 3,
  waveSpeed = 0.15,
  layerSpeed = 0.08,
  twist = 0.1,
  twistFrequency = 5,
  twistSpeed = 1.2,
  lineFrequency = 5,
  lineSpacing = 2,
  lineSharpness = 16,
  glowFalloff = 10,
  glowIntensity = 1.6,
  brightness = 2,
  blueBoost = 1.25,
  vignette = 0.8,
  grain = 0.05,
  lightMode = false,
  dpr = 1,
  fps = 60,
  paused = false,
}) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const context = canvas.getContext('2d', { alpha: true })
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const lineRgb = hexToRgb(lineColor)
    const glowRgb = hexToRgb(glowColor)
    let frameId = 0
    let lastFrame = 0
    let width = 0
    let height = 0
    let time = 0
    const isMobile = window.matchMedia('(max-width: 768px)').matches
    const frameInterval = 1000 / Math.min(fps, isMobile ? 24 : 40)
    let isVisible = false
    let isPageVisible = !document.hidden

    const resize = () => {
      const bounds = canvas.getBoundingClientRect()
      const pixelRatio = Math.min(window.devicePixelRatio || 1, dpr)
      width = Math.max(1, Math.floor(bounds.width))
      height = Math.max(1, Math.floor(bounds.height))
      canvas.width = Math.floor(width * pixelRatio)
      canvas.height = Math.floor(height * pixelRatio)
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
    }

    const draw = (now) => {
      frameId = 0
      if (paused || !isVisible || !isPageVisible) return
      if (!reducedMotion) frameId = requestAnimationFrame(draw)
      if (!reducedMotion && now - lastFrame < frameInterval) return
      lastFrame = now
      time = reducedMotion ? 0 : now * 0.001
      context.clearRect(0, 0, width, height)
      context.save()
      context.translate(width / 2, height / 2)
      context.rotate((rotation + time * rotationSpeed * speed * 2) * Math.PI / 180)
      context.scale(scale, scale)
      context.translate(-width / 2, -height / 2)
      context.lineCap = 'round'

      const lineCount = Math.max(14, Math.floor(width / (lineSpacing * 16)))
      const step = height / lineCount
      const center = height / 2
      for (let layer = 0; layer < layers; layer += 1) {
        const layerOffset = (layer - (layers - 1) / 2) * step * 0.7
        for (let line = -2; line < lineCount + 2; line += 1) {
          const baseY = line * step + layerOffset
          const distance = Math.abs(baseY - center) / Math.max(center, 1)
          const fade = Math.max(0.06, 1 - distance * 0.72)
          context.beginPath()
          for (let x = -20; x <= width + 20; x += Math.max(5, lineSharpness / 2)) {
            const normalizedX = x / Math.max(width, 1)
            const wave = Math.sin(normalizedX * Math.PI * waveFrequency + time * waveSpeed + layer * layerSpeed)
            const curl = Math.sin(normalizedX * Math.PI * twistFrequency - time * twistSpeed + layer) * twist
            const y = baseY + (wave * waveAmplitude + curl * waveAmplitude) * height * 4 + Math.sin(normalizedX * 20 + layer) * 2
            if (x === -20) context.moveTo(x, y)
            else context.lineTo(x, y)
          }
          const opacity = fade * (0.13 + layer / Math.max(layers, 1) * 0.05) * brightness
          context.strokeStyle = `rgba(${lineRgb}, ${opacity})`
          context.lineWidth = 0.55 + lineFrequency * 0.04
          context.stroke()
          context.beginPath()
          context.moveTo(0, baseY)
          context.lineTo(width, baseY)
          context.strokeStyle = `rgba(${glowRgb}, ${opacity * glowIntensity * 0.22})`
          context.lineWidth = 2.5
          context.stroke()
        }
      }
      context.restore()

      if (grain > 0 && !reducedMotion) {
        context.fillStyle = `rgba(255, 255, 255, ${grain * 0.035})`
        for (let index = 0; index < 90; index += 1) {
          context.fillRect((index * 97) % width, (index * 53) % height, 1, 1)
        }
      }
      const vignetteGradient = context.createRadialGradient(width / 2, height / 2, width * 0.18, width / 2, height / 2, width * 0.7)
      vignetteGradient.addColorStop(0, 'rgba(0, 0, 0, 0)')
      vignetteGradient.addColorStop(1, `rgba(0, 0, 0, ${vignette * 0.42})`)
      context.fillStyle = vignetteGradient
      context.fillRect(0, 0, width, height)
    }

    const scheduleDraw = () => {
      if (!paused && isVisible && isPageVisible && !frameId) {
        frameId = requestAnimationFrame(draw)
      }
    }
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting
      if (!isVisible) {
        cancelAnimationFrame(frameId)
        frameId = 0
      } else {
        scheduleDraw()
      }
    })
    const resizeObserver = new ResizeObserver(() => {
      resize()
      if (reducedMotion) scheduleDraw()
    })
    const handleVisibilityChange = () => {
      isPageVisible = !document.hidden
      if (!isPageVisible) {
        cancelAnimationFrame(frameId)
        frameId = 0
      } else {
        scheduleDraw()
      }
    }
    resizeObserver.observe(canvas)
    intersectionObserver.observe(canvas)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    resize()

    return () => {
      cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [brightness, blueBoost, dpr, fps, glowColor, glowFalloff, glowIntensity, grain, layers, layerSpeed, lineColor, lineFrequency, lineSharpness, lineSpacing, lightMode, paused, rotation, rotationSpeed, scale, speed, twist, twistFrequency, twistSpeed, vignette, waveAmplitude, waveFrequency, waveSpeed])

  return <canvas ref={canvasRef} className="ghost-fibers" aria-hidden="true" />
}
