import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import ScrollReveal from './shared/ScrollReveal'

const stats = [
  { value: '01+', label: 'Year of experience' },
  { value: '15+', label: 'Projects shipped' },
  { value: '4', label: 'Happy clients' },
  { value: '∞', label: 'Curiosity' },
]

const words = [
  'I', 'design', 'and', 'build', 'digital', 'experiences', 'that',
  'combine', 'clean', 'engineering', 'with', 'strong', 'visual', 'storytelling.'
]

const accentWords = new Set(['digital', 'experiences', 'visual', 'storytelling.'])

export default function About() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-15% 0px' })
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section className="about-section" id="about">
      <div className="about-inner">
        {/* Top label row */}
        <ScrollReveal className="about-label-row">
          <span className="section-num">01</span>
          <span className="section-tag">CREATIVE DEVELOPER</span>
        </ScrollReveal>

        {/* Large statement */}
        <div className="about-statement" ref={ref} aria-label="I design and build digital experiences that combine clean engineering with strong visual storytelling.">
          <p className="statement-text">
            {words.map((word, i) => (
              <span key={i} style={{ overflow: 'hidden', display: 'inline-block', marginRight: '0.3em' }}>
                <motion.span
                  style={{ display: 'inline-block' }}
                  className={accentWords.has(word) ? 'text-accent' : ''}
                  initial={{ y: '110%', opacity: 0 }}
                  animate={inView ? { y: '0%', opacity: 1 } : {}}
                  transition={{
                    duration: 0.7,
                    delay: 0.05 * i,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </p>
        </div>

        {/* Body + stats grid */}
        <div className="about-grid">
          {/* Left: Profile card */}
          <ScrollReveal direction="left" delay={0.2} className="about-card">
            <div className="about-card-inner">
              <div className="about-card-accent" />
              <div className="about-card-content">
                <span className="about-location-label">Currently based in</span>
                <h3 className="about-location">
                  Dhaka,<br />
                  <em>Bangladesh.</em>
                </h3>
              </div>
              <div className="about-card-mark">✳</div>
            </div>
          </ScrollReveal>

          {/* Right: Text + stats */}
          <div className="about-copy-block">
            <ScrollReveal delay={0.3}>
              <p className="about-body">
                I&apos;m Zyven, a multidisciplinary designer and front-end developer. I&apos;ve spent the last 1 year turning big ideas into digital things that are easy to love and even easier to use.
              </p>
              <p className="about-body">
                When I&apos;m away from the screen, you&apos;ll find me collecting old magazines, taking long walks, or trying to make the perfect cup of tea.
              </p>
            </ScrollReveal>

            {/* Stats */}
            <div className="about-stats">
              {stats.map((stat, i) => (
                <ScrollReveal key={stat.label} delay={0.1 * i} direction="up">
                  <div className="stat-item">
                    <span className="stat-value">{stat.value}</span>
                    <span className="stat-desc">{stat.label}</span>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal delay={0.5}>
              <button className="about-cta" onClick={() => scrollTo('contact')}>
                More about my approach
                <ArrowUpRight size={16} />
              </button>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  )
}
