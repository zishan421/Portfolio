import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, Globe, Layers, Cpu } from 'lucide-react'
import ScrollReveal from './shared/ScrollReveal'

const services = [
  {
    num: '01',
    title: 'Web Design & Build',
    icon: Globe,
    description:
      'Flexible, fast websites and web apps built from scratch — from first wireframe to final deploy. I care as much about the code quality as the visual output.',
    tags: ['React', 'Next.js', 'Tailwind CSS', 'Animation'],
  },
  {
    num: '02',
    title: 'Product Experience',
    icon: Layers,
    description:
      'Digital products designed around real people. I bridge design and engineering to ship interfaces that are intuitive, accessible, and beautifully considered.',
    tags: ['UX Strategy', 'Design Systems', 'Prototyping', 'Research'],
  },
  {
    num: '03',
    title: 'Creative Direction',
    icon: Cpu,
    description:
      'Finding the voice, look, and feeling that makes a brand unmistakably itself. From visual identity through interactive motion, across every touchpoint.',
    tags: ['Identity', 'Motion', 'Art Direction', 'Brand'],
  },
]

export default function Services() {
  const [activeIndex, setActiveIndex] = useState(null)

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
              <ScrollReveal key={service.num} delay={0.1 * i}>
                <motion.div
                  className={`service-row ${isActive ? 'active' : ''} ${isDimmed ? 'dimmed' : ''}`}
                  onMouseEnter={() => setActiveIndex(i)}
                  onMouseLeave={() => setActiveIndex(null)}
                  animate={{ opacity: isDimmed ? 0.35 : 1 }}
                  transition={{ duration: 0.25 }}
                >
                  {/* Number + icon row */}
                  <div className="service-meta">
                    <span className="service-num">{service.num}</span>
                    <motion.div
                      className="service-icon-wrap"
                      animate={isActive ? { rotate: 0, scale: 1.15 } : { rotate: 0, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Icon size={20} />
                    </motion.div>
                  </div>

                  {/* Title */}
                  <h3 className="service-title">{service.title}</h3>

                  {/* Expandable description */}
                  <div className="service-expand-wrap">
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          className="service-expand"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        >
                          <p className="service-desc">{service.description}</p>
                          <div className="service-tags">
                            {service.tags.map((tag) => (
                              <span key={tag} className="service-tag">{tag}</span>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Arrow */}
                  <motion.div
                    className="service-arrow"
                    animate={isActive ? { rotate: 0 } : { rotate: 0 }}
                  >
                    <motion.div
                      animate={isActive ? { rotate: 45, color: 'var(--accent)' } : { rotate: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <ArrowUpRight size={22} />
                    </motion.div>
                  </motion.div>
                </motion.div>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
