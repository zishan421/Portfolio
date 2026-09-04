import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import MagneticButton from './shared/MagneticButton'
import Aurora from './shared/Aurora'
import heroImg from '../assets/self.png'

const headline = ['BUILDING', 'DIGITAL', 'EXPERIENCES', 'THAT MATTER.']

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.4 } },
}

const lineVariants = {
  hidden: { y: '110%', opacity: 0 },
  visible: {
    y: '0%',
    opacity: 1,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
}

const badgeData = [
  { label: 'React', delay: 0, dx: -60, dy: -40 },
  { label: 'JS', delay: 0.15, dx: 60, dy: -50 },
  { label: 'Tailwind', delay: 0.3, dx: -55, dy: 50 },
  { label: 'Figma', delay: 0.45, dx: 65, dy: 45 },
]

function FloatingBadge({ label, delay, dx, dy }) {
  return (
    <motion.div
      className="hero-badge"
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.2 + delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{ transform: `translate(${dx}px, ${dy}px)` }}
    >
      {label}
    </motion.div>
  )
}

export default function Hero() {
  const heroRef = useRef(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 80, damping: 25 })
  const springY = useSpring(mouseY, { stiffness: 80, damping: 25 })

  const spotlightX = useTransform(springX, (value) => `${value}px`)
  const spotlightY = useTransform(springY, (value) => `${value}px`)

  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return
    const isTouchDevice = window.matchMedia('(hover: none)').matches
    if (isTouchDevice) return

    let frameId = 0
    let latestX = 0
    let latestY = 0

    const onMove = (e) => {
      latestX = e.clientX
      latestY = e.clientY
      if (frameId) return

      frameId = requestAnimationFrame(() => {
        mouseX.set(latestX)
        mouseY.set(latestY)
        frameId = 0
      })
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      if (frameId) cancelAnimationFrame(frameId)
    }
  }, [mouseX, mouseY])

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section className="hero" id="hero" ref={heroRef}>
      {/* Cursor spotlight */}
      <motion.div className="hero-spotlight" style={{ '--spotlight-x': spotlightX, '--spotlight-y': spotlightY }} />

      {/* Animated background orbs */}
      <div className="hero-bg" aria-hidden="true">
        <Aurora />
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="hero-grid" />
      </div>

      <div className="hero-rail" aria-hidden="true">
        <span>ZYVEN / 2025</span>
        <i />
        <span>SCROLL TO DISCOVER</span>
      </div>

      <div className="hero-inner">
        {/* Left: Text content */}
        <div className="hero-content">
          {/* Status badge */}
          <motion.div
            className="status-badge"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="status-dot" />
            AVAILABLE FOR FREELANCE
          </motion.div>

          {/* Main headline */}
          <motion.h1
            className="hero-headline"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            aria-label={headline.join(' ')}
          >
            {headline.map((line, i) => (
              <span key={i} className="headline-line-wrap">
                <motion.span
                  className={`headline-line ${i === 1 ? 'headline-accent' : ''}`}
                  variants={lineVariants}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </motion.h1>

          {/* Sub text */}
          <motion.p
            className="hero-sub"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            I design and build digital experiences that combine clean engineering with strong visual storytelling.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <MagneticButton className="btn-primary" onClick={() => window.open('https://ecommerce-t-9q71.vercel.app/', '_blank', 'noopener,noreferrer')}>
              View My Work
              <ArrowUpRight size={16} />
            </MagneticButton>
            <MagneticButton className="btn-ghost" onClick={() => scrollTo('contact')}>
              Let&apos;s Talk
            </MagneticButton>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="scroll-indicator"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
          >
            <div className="scroll-line">
              <motion.div
                className="scroll-line-inner"
                animate={{ scaleY: [0, 1, 0] }}
                transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 0.6, ease: 'easeInOut' }}
              />
            </div>
            <span>Scroll</span>
          </motion.div>
        </div>

        {/* Right: Profile Visual */}
        <div className="hero-visual">
          <motion.div
            className="profile-composition"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Animated glow ring */}
            <div className="profile-glow-ring" />
            <div className="profile-glow-ring ring-2" />

            <div className="profile-orbit-label orbit-label-top">CREATIVE<br />CODE / 001</div>
            <div className="profile-orbit-label orbit-label-bottom">BASED IN<br />DHAKA, BD</div>

            <div className="profile-gradient-glow" aria-hidden="true" />

            {/* Profile image */}
            <div className="profile-frame">
              <div className="profile-img-wrap">
                <img src={heroImg} alt="Zyven — Front End and Back End Developer" className="profile-img" />
                <div className="profile-overlay" />
                <div className="profile-scanline" aria-hidden="true" />
              </div>
            </div>

            {/* Glass info panel */}
            <motion.div
              className="profile-glass-panel"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0, duration: 0.7 }}
            >
              <p className="panel-name">Zyven</p>
              <p className="panel-role">
                Front End And Back End Developer<br />
                Professional Graphics Design
              </p>
              <div className="panel-dot-row">
                <span className="panel-dot active" />
                <span className="panel-dot" />
                <span className="panel-dot" />
              </div>
            </motion.div>

            {/* Floating tech badges */}
            <div className="badges-wrap">
              {badgeData.map((b) => (
                <FloatingBadge key={b.label} {...b} />
              ))}
            </div>

            {/* Stat card */}
            <motion.div
              className="hero-stat-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.6 }}
            >
              <span className="stat-number">15+</span>
              <span className="stat-label">Projects Shipped</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
