import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, Brush, Code2 } from 'lucide-react'
import ScrollReveal from './shared/ScrollReveal'

const services = [
  {
    num: '01',
    title: 'Web Design & Development',
    icon: Code2,
    description:
      'Modern, responsive websites and web applications built with clean code, thoughtful interactions and a strong focus on performance.',
    tags: ['React', 'JavaScript', 'Tailwind CSS', 'Vite', 'HTML', 'CSS'],
    cta: 'VIEW WEB PROJECTS',
    href: 'https://ecommerce-t-9q71.vercel.app/',
    filter: 'Web',
    preview: 'web',
  },
  {
    num: '02',
    title: 'Graphic Design & Branding',
    icon: Brush,
    description:
      'Visual identities, logos, social media graphics, posters and creative designs built to communicate ideas with clarity and impact.',
    tags: ['Illustrator', 'Photoshop', 'Canva', 'Branding', 'Logo Design', 'Social Media'],
    cta: 'VIEW MY WORK',
    href: 'https://www.behance.net/zishanmahmud3',
    filter: 'Graphics Design',
    preview: 'graphic',
  },
]

function ServicePreview({ type }) {
  if (type === 'web') {
    return (
      <div className="service-preview web-preview" aria-label="Selected web project preview">
        <div className="browser-bar"><span /><span /><span /><small>ecommerce-project / live</small></div>
        <div className="browser-content">
          <div className="browser-nav"><b>SHOP / 24</b><i /><i /><i /></div>
          <div className="browser-hero"><div><span>SELECTED PROJECT</span><strong>Ecommerce<br /><em>Website.</em></strong><small>React / Vite / 2025</small></div><div className="browser-product" /></div>
        </div>
      </div>
    )
  }

  return (
    <div className="service-preview graphic-preview" aria-label="Graphic design portfolio preview">
      <div className="design-sheet design-sheet-back"><span>FORM<br />FOLLOWS<br />FEELING</span></div>
      <div className="design-sheet design-sheet-main"><small>ZYVEN / BRAND STUDY</small><strong>MAKE<br /><em>VISIBLE.</em></strong><i /></div>
      <div className="design-sheet design-sheet-front"><span>03</span><b>CREATE<br />WITH<br />PURPOSE</b></div>
    </div>
  )
}

export default function Services() {
  const [activeIndex, setActiveIndex] = useState(null)

  const openPortfolio = (event, service) => {
    event.preventDefault()
    event.stopPropagation()
    window.location.href = service.href
  }

  return (
    <section className="services-section" id="services">
      <div className="services-inner">
        {/* Header */}
        <div className="services-header">
          <ScrollReveal>
            <div className="services-label-row">
              <span className="section-num">05</span>
              <span className="section-tag">WHAT I DO</span>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <h2 className="services-title">
              Useful<br />
              <em>by nature.</em>
            </h2>
          </ScrollReveal>
        </div>

        {/* Service list */}
        <div className="services-list">
          {services.map((service, i) => {
            const Icon = service.icon
            const isActive = activeIndex === i
            const isDimmed = activeIndex !== null && !isActive

            return (
              <ScrollReveal key={service.num} delay={0.12 * i} className="service-reveal">
                <motion.div
                  className={`service-row ${isActive ? 'active' : ''} ${isDimmed ? 'dimmed' : ''}`}
                  onMouseEnter={() => setActiveIndex(i)}
                  onMouseMove={(event) => {
                    const bounds = event.currentTarget.getBoundingClientRect()
                    event.currentTarget.style.setProperty('--service-x', `${event.clientX - bounds.left}px`)
                  }}
                  onClick={() => setActiveIndex(isActive ? null : i)}
                  animate={{ opacity: isDimmed ? 0.35 : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="service-row-head">
                    <div className="service-meta">
                      <span className="service-num">{service.num}</span>
                      <motion.div className="service-icon-wrap" animate={isActive ? { rotate: -8, scale: 1.16 } : { rotate: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 18 }}>
                        <Icon size={21} strokeWidth={1.5} />
                      </motion.div>
                    </div>
                    <motion.h3 className="service-title" animate={isActive ? { x: 8 } : { x: 0 }} transition={{ type: 'spring', stiffness: 280, damping: 24 }}>
                      {service.title}
                    </motion.h3>
                    <motion.div className="service-arrow" animate={isActive ? { x: 5, y: -5, rotate: 45 } : { x: 0, y: 0, rotate: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }}>
                      <ArrowUpRight size={24} />
                    </motion.div>
                  </div>

                  <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.div
                          className="service-expand service-expand-new"
                          initial={{ height: 0, opacity: 0, y: 18 }}
                          animate={{ height: 'auto', opacity: 1, y: 0 }}
                          exit={{ height: 0, opacity: 0, y: 12 }}
                          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        >
                          <div className="service-expand-copy">
                            <p className="service-desc">{service.description}</p>
                            <div className="service-tags">
                              {service.tags.map((tag, tagIndex) => (
                                <motion.span key={tag} className="service-tag" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 + tagIndex * 0.035, duration: 0.3 }}>{tag}</motion.span>
                              ))}
                            </div>
                            <button type="button" className="service-cta" onClick={(event) => openPortfolio(event, service)}>
                              {service.cta} <ArrowUpRight size={15} />
                            </button>
                          </div>
                            <motion.div className="service-preview-wrap" initial={{ clipPath: 'inset(0% 0% 100% 0%)', scale: 1.04, opacity: 0 }} animate={{ clipPath: 'inset(0% 0% 0% 0%)', scale: 1, opacity: 1 }} exit={{ clipPath: 'inset(100% 0% 0% 0%)', opacity: 0 }} transition={{ duration: 0.7, delay: 0.08, ease: [0.76, 0, 0.24, 1] }}>
                            <ServicePreview type={service.preview} />
                          </motion.div>
                        </motion.div>
                      )}
                  </AnimatePresence>
                </motion.div>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
