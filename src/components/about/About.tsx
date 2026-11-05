import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { about } from '@/data/site'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'
import { Reveal } from '@/components/ui/Reveal'

export function About() {
  const reduced = usePrefersReducedMotion()
  const figureRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: figureRef, offset: ['start end', 'end start'] })
  // Parallax de intensidade mínima (transform GPU).
  const y = useTransform(scrollYProgress, [0, 1], ['-3%', '3%'])

  return (
    <section id="sobre" className="section about" aria-labelledby="sobre-title">
      <div className="shell about-grid">
        <div className="about-copy">
          <Reveal>
            <p className="eyebrow">{about.eyebrow}</p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 id="sobre-title" className="h2 about-title">
              {about.title}
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="about-lead">{about.lead}</p>
          </Reveal>
          <div className="about-body">
            {about.paragraphs.map((p, i) => (
              <Reveal key={i} delay={0.16 + i * 0.05}>
                <p className="muted">{p}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.24}>
            <p className="about-marker">
              {about.marker.map((m, i) => (
                <span key={m}>
                  {i > 0 && (
                    <span className="about-marker-dot" aria-hidden="true">
                      ·
                    </span>
                  )}
                  {m}
                </span>
              ))}
            </p>
          </Reveal>
        </div>

        <div className="about-figure-wrap" ref={figureRef}>
          <motion.figure
            className="about-figure"
            initial={reduced ? false : { clipPath: 'inset(100% 0% 0% 0%)' }}
            whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            viewport={{ once: true, margin: '0px 0px -15% 0px' }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.img
              src={about.image.src}
              alt={about.image.alt}
              width={about.image.width}
              height={about.image.height}
              loading="lazy"
              decoding="async"
              className="about-img"
              style={reduced ? undefined : { y }}
            />
          </motion.figure>
          <p className="about-caption">Registro real de serviço em campo.</p>
        </div>
      </div>
    </section>
  )
}
