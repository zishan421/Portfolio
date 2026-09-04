import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { experiences } from '../data/experience'
import ScrollReveal from './shared/ScrollReveal'

function ExperienceCard({ exp, index }) {
  const isEven = index % 2 === 0

  return (
    <div className={`exp-item ${isEven ? 'exp-left' : 'exp-right'}`}>
      {/* Timeline node */}
      <motion.div
        className="exp-node"
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="exp-node-inner" />
      </motion.div>

      {/* Card */}
      <motion.div
        className="exp-card"
        initial={{ opacity: 0, x: isEven ? -40 : 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="exp-card-top">
          <span className="exp-period">{exp.period}</span>
          <span className="exp-type-badge">{exp.type}</span>
        </div>
        <h3 className="exp-role">
          {exp.role.split('\n').map((roleLine, lineIndex) => (
            <span key={roleLine}>
              {lineIndex > 0 && <br />}
              {roleLine}
            </span>
          ))}
        </h3>
        <p className="exp-company">{exp.company}</p>
        <p className="exp-desc">{exp.description}</p>
        <div className="exp-tags">
          {exp.tags.map((tag) => (
            <span key={tag} className="exp-tag">{tag}</span>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default function Experience() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.8', 'end 0.2'],
  })

  const lineScaleY = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section className="experience-section" id="experience" ref={sectionRef}>
      <div className="experience-inner">
        {/* Header */}
        <ScrollReveal className="exp-header-row">
          <span className="section-num">04</span>
          <span className="section-tag">EXPERIENCE</span>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <h2 className="exp-title">
            Where I&apos;ve<br />
            <em>been.</em>
          </h2>
        </ScrollReveal>

        {/* Timeline */}
        <div className="timeline-wrap">
          {/* Animated line */}
          <div className="timeline-track">
            <motion.div
              className="timeline-line"
              style={{ scaleY: lineScaleY, originY: 0 }}
            />
          </div>

          {/* Cards */}
          <div className="exp-cards">
            {experiences.map((exp, i) => (
              <ExperienceCard key={exp.id} exp={exp} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
