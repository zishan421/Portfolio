import { useState } from 'react'
import { motion } from 'framer-motion'
import { skillCategories, marqueeSkills } from '../data/skills'
import ScrollReveal from './shared/ScrollReveal'

function SkillCard({ skill, i }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      className={`skill-card ${hovered ? 'hovered' : ''}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.05 * i, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ y: -4, scale: 1.03 }}
    >
      <motion.span
        className="skill-icon"
        animate={hovered ? { scale: 1.2, rotate: 8 } : { scale: 1, rotate: 0 }}
        transition={{ duration: 0.3 }}
      >
        {skill.icon}
      </motion.span>
      <span className="skill-name">{skill.name}</span>
      {hovered && (
        <motion.div
          className="skill-glow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
    </motion.div>
  )
}

export default function Skills() {
  return (
    <section className="skills-section" id="skills">
      <div className="skills-inner">
        {/* Header */}
        <ScrollReveal className="skills-header">
          <span className="section-num">02</span>
          <span className="section-tag">SKILLS &amp; TOOLS</span>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <h2 className="skills-title">
            The craft <em>behind</em><br />the work.
          </h2>
        </ScrollReveal>

        {/* Marquee rows */}
        <div className="marquee-container" aria-hidden="true">
          <div className="marquee-row">
            <div className="marquee-track">
              {[...marqueeSkills, ...marqueeSkills].map((skill, i) => (
                <span key={i} className="marquee-item">
                  {skill}
                  <span className="marquee-sep">✦</span>
                </span>
              ))}
            </div>
          </div>
          <div className="marquee-row reverse">
            <div className="marquee-track">
              {[...marqueeSkills.slice().reverse(), ...marqueeSkills.slice().reverse()].map((skill, i) => (
                <span key={i} className="marquee-item">
                  {skill}
                  <span className="marquee-sep">✦</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Skill category grids */}
        <div className="skills-categories">
          {skillCategories.map((cat, catIndex) => (
            <div key={cat.label} className="skill-category">
              <ScrollReveal delay={catIndex * 0.1}>
                <h3 className="cat-label">{cat.label}</h3>
              </ScrollReveal>
              <div className="skill-grid">
                {cat.skills.map((skill, i) => (
                  <SkillCard key={skill.name} skill={skill} i={catIndex * 6 + i} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
