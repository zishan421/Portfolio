import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Send, X } from 'lucide-react'
import MagneticButton from './shared/MagneticButton'
import ScrollReveal from './shared/ScrollReveal'

const wordVariants = {
  hidden: { y: '110%', opacity: 0 },
  visible: (i) => ({
    y: '0%',
    opacity: 1,
    transition: { delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  }),
}

const lines = ["LET'S CREATE", 'SOMETHING', 'GREAT.']

function FloatingInput({ label, type = 'text', name, required, rows }) {
  const [focused, setFocused] = useState(false)
  const [value, setValue] = useState('')

  const Tag = rows ? 'textarea' : 'input'

  return (
    <div className={`float-field ${focused || value ? 'active' : ''}`}>
      <Tag
        type={type}
        name={name}
        required={required}
        rows={rows}
        placeholder=""
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="float-input"
        aria-label={label}
      />
      <motion.label
        className="float-label"
        animate={focused || value ? { y: -22, scale: 0.75, color: 'var(--accent-light)' } : { y: 0, scale: 1, color: 'var(--muted)' }}
        transition={{ duration: 0.22 }}
      >
        {label}
      </motion.label>
      <motion.div
        className="float-border"
        animate={{ scaleX: focused ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ originX: 0 }}
      />
    </div>
  )
}

export default function Contact() {
  const [sent, setSent] = useState(false)

  const submit = (event) => {
    setSent(true)
    event.currentTarget.reset()
  }

  return (
    <section className="contact-section" id="contact">
      {/* Ambient background */}
      <div className="contact-bg" aria-hidden="true">
        <div className="contact-orb contact-orb-1" />
        <div className="contact-orb contact-orb-2" />
        <div className="contact-grid" />
      </div>

      <div className="contact-inner">
        {/* Label */}
        <ScrollReveal>
          <div className="contact-label-row">
            <span className="section-num">06</span>
            <span className="section-tag">SAY HELLO</span>
          </div>
        </ScrollReveal>

        {/* Big headline */}
        <h2 className="contact-headline" aria-label="Let's create something great.">
          {lines.map((line, lineIndex) => (
            <span key={lineIndex} className="headline-wrap">
              {line.split(' ').map((word, wordIndex) => (
                <span key={wordIndex} style={{ overflow: 'hidden', display: 'inline-block', marginRight: '0.3em' }}>
                  <motion.span
                    style={{ display: 'inline-block' }}
                    className={word === 'SOMETHING' ? 'contact-accent-word' : ''}
                    custom={lineIndex * 3 + wordIndex}
                    variants={wordVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    {word}
                  </motion.span>
                </span>
              ))}
              <br />
            </span>
          ))}
        </h2>

        <div className="contact-layout">
          {/* Left: info */}
          <ScrollReveal direction="left" delay={0.3} className="contact-info">
            <p className="contact-tagline">
              Have a project in mind? Let&apos;s make something great together.
            </p>
            <a href="mailto:zisanmahmud.rumc2001@gmail.com" className="contact-email">
              Send an email
              <ArrowUpRight size={16} />
            </a>
            <div className="contact-socials">
              <a href="https://github.com/zishan421" target="_blank" rel="noreferrer" aria-label="GitHub" className="social-link">GH</a>
              <a href="#" aria-label="LinkedIn" className="social-link">LI</a>
              <a href="#" aria-label="Twitter" className="social-link">TW</a>
              <a href="#" aria-label="Dribbble" className="social-link">DR</a>
            </div>
          </ScrollReveal>

          {/* Right: form */}
          <ScrollReveal direction="right" delay={0.4} className="contact-form-wrap">
            <form action="https://formsubmit.co/zisanmahmud.rumc2001@gmail.com" method="POST" target="contact-submit-frame" onSubmit={submit} className="contact-form">
                <input type="hidden" name="_subject" value="New portfolio contact message" />
                <input type="hidden" name="_captcha" value="false" />
                <input type="hidden" name="_template" value="table" />
                <div className="form-row-2col">
                  <FloatingInput label="Your name" name="name" required />
                  <FloatingInput label="Email address" name="email" type="email" required />
                </div>
                <FloatingInput label="Tell me about your project" name="message" rows={4} required />
                <MagneticButton type="submit" className="submit-btn">
                  Send Message
                  <Send size={15} />
                </MagneticButton>
            </form>
            <iframe name="contact-submit-frame" title="Contact form submission" className="contact-submit-frame" />
          </ScrollReveal>
        </div>
      </div>

      {sent && (
        <div className="success-modal-backdrop" role="presentation">
          <motion.div
            className="success-state success-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="success-title"
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
          >
            <button className="success-close" onClick={() => setSent(false)} aria-label="Close confirmation">
              <X size={18} />
            </button>
            <div className="success-icon">✳</div>
            <h3 id="success-title">Request submitted</h3>
            <p>Thanks for reaching out. I&apos;ll be in touch very soon.</p>
          </motion.div>
        </div>
      )}
    </section>
  )
}
