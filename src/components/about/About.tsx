import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { about } from '@/data/site'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'
import { Eyebrow, MaskLines, Reveal } from '@/components/ui/Reveal'
import { EASE } from '@/lib/motion'

export function About() {
  const reduced = usePrefersReducedMotion()
  const figureRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: figureRef, offset: ['start end', 'end start'] })
  // Parallax de baixa intensidade (transform GPU) na foto dentro da moldura.
  const y = useTransform(scrollYProgress, [0, 1], ['-4%', '4%'])

  return (
    <section id="sobre" className="section about surface-1" aria-labelledby="sobre-title">
      <div className="shell about-grid">
        <div className="about-copy">
          <Eyebrow>{about.eyebrow}</Eyebrow>
          <MaskLines id="sobre-title" className="h2 about-title" lines={about.titleLines} delay={0.08} />
          <Reveal delay={0.28}>
            <p className="about-lead">{about.lead}</p>
          </Reveal>
          <div className="about-body">
            {about.paragraphs.map((p, i) => (
              <Reveal key={i} variant="fade" delay={0.4 + i * 0.12}>
                <p className="muted">{p}</p>
              </Reveal>
            ))}
          </div>
          <Reveal variant="fade" delay={0.6}>
            <ul className="about-marker" role="list">
              {about.marker.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className="about-figure-wrap" ref={figureRef}>
          {/* Image Reveal: máscara que abre de baixo para cima, uma única vez. */}
          <motion.figure
            className="about-figure"
            initial={reduced ? false : { clipPath: 'inset(100% 0% 0% 0%)' }}
            whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            viewport={{ once: true, margin: '0px 0px -15% 0px' }}
            transition={{ duration: 0.95, ease: EASE }}
          >
            <motion.img
              src={about.image.src}
              alt={about.image.alt}
              width={about.image.width}
              height={about.image.height}
              loading="lazy"
              decoding="async"
              className="about-img"
              initial={reduced ? false : { scale: 1.12 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true, margin: '0px 0px -15% 0px' }}
              transition={{ duration: 1.1, ease: EASE }}
              style={reduced ? undefined : { y }}
            />
          </motion.figure>
          <Reveal variant="fade" delay={0.5}>
            <p className="about-caption">{about.image.caption}</p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
