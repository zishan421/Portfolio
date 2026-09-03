import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.04 },
  },
}

const wordVariants = {
  hidden: { y: '110%', opacity: 0 },
  visible: {
    y: '0%',
    opacity: 1,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
}

const charVariants = {
  hidden: { y: '120%', opacity: 0, filter: 'blur(8px)' },
  visible: {
    y: '0%',
    opacity: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
}

/**
 * TextReveal — animates text as it enters viewport.
 * mode: 'words' | 'chars'
 * as: html tag to render ('h1'|'h2'|'p' etc.)
 */
export default function TextReveal({
  text,
  mode = 'words',
  as: Tag = 'p',
  className = '',
  stagger = 0.04,
  once = true,
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once, margin: '-10% 0px -10% 0px' })

  const motionTag = motion[Tag] || motion.p

  if (mode === 'chars') {
    const chars = text.split('')
    const variants = { ...containerVariants, visible: { ...containerVariants.visible, transition: { staggerChildren: stagger } } }
    return (
      <motionTag
        ref={ref}
        className={className}
        variants={variants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        aria-label={text}
      >
        {chars.map((char, i) => (
          <span key={i} style={{ overflow: 'hidden', display: 'inline-block' }}>
            <motion.span style={{ display: 'inline-block' }} variants={charVariants}>
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          </span>
        ))}
      </motionTag>
    )
  }

  const words = text.split(' ')
  const variants = { ...containerVariants, visible: { ...containerVariants.visible, transition: { staggerChildren: stagger } } }
  return (
    <motionTag
      ref={ref}
      className={className}
      variants={variants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      aria-label={text}
    >
      {words.map((word, i) => (
        <span key={i} style={{ overflow: 'hidden', display: 'inline-block', marginRight: '0.25em' }}>
          <motion.span style={{ display: 'inline-block' }} variants={wordVariants}>
            {word}
          </motion.span>
        </span>
      ))}
    </motionTag>
  )
}
