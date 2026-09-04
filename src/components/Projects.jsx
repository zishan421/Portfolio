import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { projects } from '../data/projects'
import ScrollReveal from './shared/ScrollReveal'
import { useTilt } from '../hooks/useTilt'

const filters = ['All', 'Web', 'React', 'Graphics Design', 'Other']

function ProjectCard({ project, index, isFeatured }) {
  const [hovered, setHovered] = useState(false)
  const cardRef = useRef(null)
  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)
  const springX = useSpring(cursorX, { stiffness: 300, damping: 30 })
  const springY = useSpring(cursorY, { stiffness: 300, damping: 30 })
  const { tiltStyle, tiltHandlers } = useTilt(isFeatured ? 4 : 6)

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    cursorX.set(e.clientX - rect.left)
    cursorY.set(e.clientY - rect.top)
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className={`project-card ${isFeatured ? 'featured' : ''}`}
      ref={cardRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      {...tiltHandlers}
      style={{ '--project-accent': project.accent, '--project-bg': project.bg, ...tiltStyle }}
    >
      {/* Image area */}
      <div className="project-image-area" style={{ background: project.bg }}>
        {/* Animated reveal overlay */}
        <motion.div
          className="project-reveal-mask"
          initial={{ scaleX: 1 }}
          whileInView={{ scaleX: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: index * 0.1, ease: [0.76, 0, 0.24, 1] }}
          style={{ originX: 1, backgroundColor: project.accent }}
        />

        {/* Abstract project art */}
        <div className="project-art-bg">
          <div className="art-circle" style={{ background: project.accent }} />
          <div className="art-circle-2" style={{ borderColor: project.accent }} />
          <div className="art-line-1" style={{ background: project.accent }} />
        </div>

        {/* Project number */}
        <span className="project-num">{project.number}</span>

        {/* Hover overlay */}
        <motion.div
          className="project-hover-overlay"
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.25 }}
        >
          <span className="overlay-cta">
            VIEW PROJECT <ArrowUpRight size={16} />
          </span>
        </motion.div>

        {/* Following cursor label */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              className="project-cursor-label"
              style={{ x: springX, y: springY }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              VIEW ↗
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Info */}
      <div className="project-info">
        <div className="project-meta">
          <span className="project-type">{project.type}</span>
          <span className="project-cat">{project.category}</span>
        </div>
        <h3 className="project-title">{project.title}</h3>
        <p className="project-desc">{project.description}</p>
        <div className="project-tags">
          {project.tags.map((tag) => (
            <span key={tag} className="project-tag">{tag}</span>
          ))}
        </div>
        <div className="project-actions">
          <a href={project.url} className="project-link" target="_blank" rel="noreferrer" aria-label={`View ${project.title}`}>
            {project.category === 'Graphics Design' ? 'View Portfolio' : 'Live'} <ArrowUpRight size={15} />
          </a>
          {project.github && (
            <a href={project.github} className="project-github-link" target="_blank" rel="noreferrer" aria-label={`View ${project.title} on GitHub`}>
              GitHub <ArrowUpRight size={13} />
            </a>
          )}
        </div>
      </div>
    </motion.article>
  )
}

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState('All')

  useEffect(() => {
    const handleProjectFilter = (event) => {
      setActiveFilter(event.detail)
      document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })
    }

    window.addEventListener('portfolio-filter', handleProjectFilter)
    return () => window.removeEventListener('portfolio-filter', handleProjectFilter)
  }, [])

  const filtered = activeFilter === 'All'
    ? projects
    : projects.filter((p) => p.category === activeFilter)

  const featuredProject = filtered.find((p) => p.featured)
  const restProjects = filtered.filter((p) => !p.featured)

  return (
    <section className="projects-section" id="work">
      <div className="projects-inner">
        {/* Header */}
        <div className="projects-header">
          <ScrollReveal>
            <div className="projects-label-row">
              <span className="section-num">03</span>
              <span className="section-tag">SELECTED WORK</span>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <h2 className="projects-title">
              A few things<br />
              <em>I&apos;ve made.</em>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.25} className="projects-aside">
            <p>A small selection of collaborations,<br />experiments, and good problems.</p>
          </ScrollReveal>
        </div>

        {/* Filters */}
        <ScrollReveal delay={0.1}>
          <div className="filters-bar" role="tablist">
            {filters.map((f) => (
              <button
                key={f}
                role="tab"
                aria-selected={activeFilter === f}
                className={`filter-btn ${activeFilter === f ? 'active' : ''}`}
                onClick={() => setActiveFilter(f)}
              >
                {f}
                {activeFilter === f && (
                  <motion.span className="filter-active-bar" layoutId="filterBar" />
                )}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Project grid */}
        <motion.div className="projects-grid" layout>
          <AnimatePresence mode="popLayout">
            {/* Featured project */}
            {featuredProject && (
              <ProjectCard
                key={featuredProject.title}
                project={featuredProject}
                index={0}
                isFeatured
              />
            )}
            {/* Remaining projects */}
            {restProjects.map((project, i) => (
              <ProjectCard
                key={project.title}
                project={project}
                index={featuredProject ? i + 1 : i}
                isFeatured={false}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
