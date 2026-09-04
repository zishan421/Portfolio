import { useLenis } from './hooks/useLenis'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Experience from './components/Experience'
import Services from './components/Services'
import Contact from './components/Contact'
import Footer from './components/Footer'
import GlowCursor from './components/cursor/GlowCursor'

function App() {
  useLenis()

  return (
    <>
      <GlowCursor
        color="#67E8F9"
        secondaryColor="#A78BFA"
        trailLength={48}
        trailWidth={11}
        followSpeed={0.16}
        glowIntensity={2.3}
        opacity={1}
        idleFade
        idleTimeout={1600}
        fadeDuration={1400}
        blendMode="screen"
      />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Services />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default App
