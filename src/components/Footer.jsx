import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

const footerLinks = ['Work', 'About', 'Skills', 'Services', 'Contact']

export default function Footer() {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <footer className="footer">
      <div className="footer-inner">
        {/* Top row */}
        <div className="footer-top">
          <button className="footer-wordmark" onClick={() => scrollTo('hero')}>
            <span className="footer-logo-mark">Z</span>
            ZYVEN.
          </button>
          <p className="footer-tagline">
            Designing &amp; building digital<br />experiences since 2019.
          </p>
        </div>

        {/* Divider */}
        <div className="footer-divider" />

        {/* Middle row */}
        <div className="footer-mid">
          <nav className="footer-nav">
            {footerLinks.map((link) => (
              <button
                key={link}
                className="footer-link"
                onClick={() => scrollTo(link.toLowerCase())}
              >
                {link}
              </button>
            ))}
          </nav>

          <a href="mailto:hello@zyven.design" className="footer-email">
            hello@zyven.design
            <ArrowUpRight size={13} />
          </a>
        </div>

        {/* Bottom row */}
        <div className="footer-bottom">
          <span className="footer-copy">© 2025 Zyven. All rights reserved.</span>
          <span className="footer-built">Designed &amp; built with care.</span>
          <motion.button
            className="back-to-top"
            onClick={() => scrollTo('hero')}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
          >
            ↑ Back to top
          </motion.button>
        </div>
      </div>
    </footer>
  )
}
