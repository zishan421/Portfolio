import { useEffect, useRef } from 'react'
import { Mesh, Program, Renderer, Triangle } from 'ogl'
import './GlowCursor.css'

const MAX_POINTS = 64
const vertex = `attribute vec2 position; attribute vec2 uv; varying vec2 vUv; void main(){vUv=uv;gl_Position=vec4(position,0.,1.);}`
const fragment = `precision highp float;
#define MAX_POINTS 64
uniform vec2 uResolution; uniform vec2 uPoints[MAX_POINTS]; uniform float uPointCount; uniform vec3 uColor; uniform vec3 uSecondaryColor; uniform float uTrailWidth; uniform float uGlow; uniform float uTime; uniform float uFade; varying vec2 vUv;
void main(){vec2 pixel=vUv*uResolution;float total=0.;float coreTotal=0.;vec3 color=vec3(0.);float denominator=max(uPointCount-1.,1.);
for(int i=0;i<MAX_POINTS-1;i++){float index=float(i);float active=1.-step(uPointCount-1.,index);vec2 start=uPoints[i];vec2 end=uPoints[i+1];vec2 segment=end-start;vec2 fromPixel=pixel-start;float along=clamp(dot(fromPixel,segment)/max(dot(segment,segment),.0001),0.,1.);float progress=clamp((index+along)/denominator,0.,1.);float life=pow(max(1.-progress,0.),.8);float width=uTrailWidth*mix(1.,.22,pow(progress,.7));float distanceToTrail=length(fromPixel-segment*along);float beam=(width*width*(1.+uGlow))/(distanceToTrail*distanceToTrail+width*width*(1.+uGlow));float core=exp(-pow(distanceToTrail/max(width,.5),2.)*2.5);float pulse=1.+sin(uTime*2.-progress*12.)*.12;float intensity=(core+beam*.45)*life*pulse*active;vec3 segmentColor=mix(uColor,uSecondaryColor,progress);total=max(total,intensity);coreTotal=max(coreTotal,core*life*active);color+=segmentColor*intensity;}
color/=max(total,.0001);color=mix(color,vec3(1.),smoothstep(.2,.9,coreTotal)*.55);float alpha=clamp(total*1.4*uFade,0.,1.);if(alpha<.001)discard;gl_FragColor=vec4(color,alpha);}`

function hexToRgb(hex) {
  const value = (hex || '#000000').replace('#', '').padEnd(6, '0')
  const parsed = Number.parseInt(value, 16)
  return [((parsed >> 16) & 255) / 255, ((parsed >> 8) & 255) / 255, (parsed & 255) / 255]
}

export default function GlowCursor({
  color = '#67E8F9', secondaryColor = '#A78BFA', trailLength = 40, trailWidth = 8,
  followSpeed = 0.16, glowIntensity = 1.9, opacity = 0.9, idleFade = true,
  idleTimeout = 700, fadeDuration = 900, blendMode = 'screen', enabled = true,
}) {
  const canvasRef = useRef(null)
  const overlayRef = useRef(null)
  const propsRef = useRef({})

  useEffect(() => {
    propsRef.current = { color, secondaryColor, trailLength, trailWidth, followSpeed, glowIntensity, opacity, idleFade, idleTimeout, fadeDuration, blendMode, enabled }
  }, [blendMode, color, enabled, fadeDuration, followSpeed, glowIntensity, idleFade, idleTimeout, opacity, secondaryColor, trailLength, trailWidth])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const overlay = overlayRef.current
    const initialConfig = propsRef.current
    const renderer = new Renderer({ canvas, alpha: true, dpr: 1.5 })
    const gl = renderer.gl
    gl.clearColor(0, 0, 0, 0)
    const pointData = Array(MAX_POINTS * 2).fill(0)
    const points = Array.from({ length: MAX_POINTS }, () => ({ x: 0, y: 0 }))
    const target = { x: 0, y: 0 }
    const head = { x: 0, y: 0 }
    let initialized = false
    let inside = false
    let fade = 0
    let lastInput = performance.now()
    let lastFrame = performance.now()
    let raf = 0

    const program = new Program(gl, { vertex, fragment, transparent: true, depthTest: false, depthWrite: false, uniforms: {
      uResolution: { value: [1, 1] }, uPoints: { value: pointData }, uPointCount: { value: initialConfig.trailLength },
      uColor: { value: hexToRgb(initialConfig.color) }, uSecondaryColor: { value: hexToRgb(initialConfig.secondaryColor) }, uTrailWidth: { value: initialConfig.trailWidth },
      uGlow: { value: initialConfig.glowIntensity }, uTime: { value: 0 }, uFade: { value: 0 },
    } })
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program })
    const resize = () => { const width = window.innerWidth; const height = window.innerHeight; renderer.setSize(width, height); program.uniforms.uResolution.value = [width, height] }
    const updatePointer = (event) => { target.x = event.clientX; target.y = window.innerHeight - event.clientY; if (overlay) { overlay.style.setProperty('--cursor-x', `${event.clientX}px`); overlay.style.setProperty('--cursor-y', `${event.clientY}px`); overlay.style.setProperty('--cursor-opacity', '1') } if (!initialized) { head.x = target.x; head.y = target.y; for (let index = 0; index < points.length; index += 1) { points[index].x = head.x; points[index].y = head.y } initialized = true } inside = true; lastInput = performance.now() }
    const leave = () => { inside = false; if (overlay) overlay.style.setProperty('--cursor-opacity', '0'); lastInput = performance.now() }
    const render = (now) => {
      const config = propsRef.current
      const delta = Math.min((now - lastFrame) / 16.667, 3); lastFrame = now
      if (initialized) { const headEase = 1 - Math.pow(1 - config.followSpeed, delta); const chainEase = 1 - Math.pow(1 - 0.34, delta); head.x += (target.x - head.x) * headEase; head.y += (target.y - head.y) * headEase; points[0].x = head.x; points[0].y = head.y; for (let i = 1; i < MAX_POINTS; i += 1) { points[i].x += (points[i - 1].x - points[i].x) * chainEase; points[i].y += (points[i - 1].y - points[i].y) * chainEase } for (let index = 0; index < points.length; index += 1) { pointData[index * 2] = points[index].x; pointData[index * 2 + 1] = points[index].y } }
      const idle = config.idleFade && (!inside || now - lastInput > config.idleTimeout); const fadeTarget = initialized && config.enabled && !idle ? 1 : 0; fade += (fadeTarget - fade) * Math.min(1, delta * 16.667 / Math.max(config.fadeDuration, 16) * 7)
      program.uniforms.uPointCount.value = Math.min(Math.max(Math.round(config.trailLength), 2), MAX_POINTS); program.uniforms.uColor.value = hexToRgb(config.color); program.uniforms.uSecondaryColor.value = hexToRgb(config.secondaryColor); program.uniforms.uTrailWidth.value = Math.max(config.trailWidth, .1); program.uniforms.uGlow.value = Math.max(config.glowIntensity, 0); program.uniforms.uTime.value = now * .001; program.uniforms.uFade.value = fade * config.opacity
      renderer.render({ scene: mesh }); raf = requestAnimationFrame(render)
    }
    const observer = new ResizeObserver(resize); observer.observe(document.documentElement); window.addEventListener('pointermove', updatePointer, { passive: true }); window.addEventListener('pointerleave', leave); resize(); raf = requestAnimationFrame(render)
    return () => { cancelAnimationFrame(raf); observer.disconnect(); window.removeEventListener('pointermove', updatePointer); window.removeEventListener('pointerleave', leave); mesh.geometry.remove(); program.remove() }
  }, [])

  return (
    <>
      <canvas ref={canvasRef} className="glow-cursor" style={{ mixBlendMode: blendMode }} aria-hidden="true" />
      <span ref={overlayRef} className="glow-cursor-hotspot" aria-hidden="true" />
    </>
  )
}
