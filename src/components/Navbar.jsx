import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, X, Menu } from 'lucide-react'
import MagneticButton from './shared/MagneticButton'

const navItems = ['Work', 'About', 'Skills', 'Experience', 'Services', 'Contact']

const menuVariants = {
  hidden: { opacity: 0, clipPath: 'inset(0 0 100% 0)' },
  visible: {
    opacity: 1,
    clipPath: 'inset(0 0 0% 0)',
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    clipPath: 'inset(0 0 100% 0)',
    transition: { duration: 0.4, ease: [0.7, 0, 0.84, 0] },
  },
}

const linkVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: (i) => ({
    y: 0,
    opacity: 1,
    transition: { delay: 0.1 + i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  }),
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const sectionIds = navItems.map((n) => n.toLowerCase())
    const observers = []

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id) },
        { threshold: 0.3 }
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <>
      <motion.header
        className="navbar"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        data-scrolled={scrolled}
      >
        <div className="nav-inner">
          <button className="nav-wordmark" onClick={() => scrollTo('hero')} aria-label="Back to top">
            <span className="nav-logo-mark">Z</span>
            <span className="nav-logo-text">ZYVEN.</span>
          </button>

          <nav className="nav-links" aria-label="Main navigation">
            {navItems.map((item) => (
              <button
                key={item}
                className={`nav-link ${activeSection === item.toLowerCase() ? 'active' : ''}`}
                onClick={() => scrollTo(item.toLowerCase())}
              >
                {item}
                <span className="nav-link-dot" />
              </button>
            ))}
          </nav>

          <div className="nav-right">
            <MagneticButton
              className="nav-cta"
              onClick={() => scrollTo('contact')}
            >
              Let&apos;s Talk
              <ArrowUpRight size={14} />
            </MagneticButton>

            <button
              className="nav-hamburger"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <motion.span animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }} transition={{ duration: 0.3 }} />
              <motion.span animate={menuOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }} transition={{ duration: 0.2 }} />
              <motion.span animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }} transition={{ duration: 0.3 }} />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-menu"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="mobile-menu-inner">
              <nav>
                {navItems.map((item, i) => (
                  <motion.button
                    key={item}
                    className="mobile-nav-link"
                    custom={i}
                    variants={linkVariants}
                    initial="hidden"
                    animate="visible"
                    onClick={() => scrollTo(item.toLowerCase())}
                  >
                    <span className="mobile-nav-number">0{i + 1}</span>
                    <span className="mobile-nav-text">{item}</span>
                    <ArrowUpRight size={20} className="mobile-nav-arrow" />
                  </motion.button>
                ))}
              </nav>
              <motion.div
                className="mobile-menu-footer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.5 } }}
              >
                <p>hello@zyven.design</p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
