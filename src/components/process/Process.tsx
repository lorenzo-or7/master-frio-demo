import { motion } from 'motion/react'
import { process } from '@/data/site'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'
import { Reveal } from '@/components/ui/Reveal'

export function Process() {
  const reduced = usePrefersReducedMotion()

  return (
    <section id="como-trabalhamos" className="section process" aria-labelledby="processo-title">
      <div className="shell process-grid">
        <div className="process-head">
          <Reveal>
            <p className="eyebrow">{process.eyebrow}</p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 id="processo-title" className="h2">
              {process.title}
            </h2>
          </Reveal>
        </div>

        <ol className="process-list" role="list">
          {process.steps.map((step, i) => (
            <li key={step.title} className="process-item">
              <motion.span
                className="process-rule"
                aria-hidden="true"
                initial={reduced ? false : { scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 }}
              />
              <Reveal delay={0.1 + i * 0.08} className="process-row">
                <span className="process-num" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="process-title">{step.title}</h3>
                  <p className="muted process-text">{step.text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
