import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useSpring } from 'motion/react'
import { process } from '@/data/site'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'
import { Eyebrow, MaskLines, Reveal } from '@/components/ui/Reveal'
import { cn } from '@/lib/utils'

/**
 * Storytelling técnico: a linha de progresso acompanha a rolagem e cada etapa ganha
 * protagonismo (número e marcador) ao cruzar o centro da tela. O texto nunca perde contraste.
 */
export function Process() {
  const reduced = usePrefersReducedMotion()
  const listRef = useRef<HTMLOListElement>(null)
  const [active, setActive] = useState(0)
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 70%', 'end 55%'] })
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 })

  useEffect(() => {
    const items = Array.from(listRef.current?.querySelectorAll<HTMLElement>('[data-step]') ?? [])
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number(e.target.getAttribute('data-step')))
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    items.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section id="como-trabalhamos" className="section process surface-1" aria-labelledby="processo-title">
      <div className="shell process-grid">
        <div className="process-head">
          <Eyebrow>{process.eyebrow}</Eyebrow>
          <MaskLines id="processo-title" className="h2" lines={process.titleLines} delay={0.08} />
          <Reveal variant="fade" delay={0.3}>
            <p className="process-intro muted">
              Três momentos que se repetem em todo atendimento, do primeiro contato à manutenção.
            </p>
          </Reveal>
        </div>

        <div className="process-steps">
          <span className="process-track" aria-hidden="true">
            <motion.span className="process-fill" style={reduced ? { scaleY: 1 } : { scaleY: progress }} />
          </span>
          <ol className="process-list" role="list" ref={listRef}>
          {process.steps.map((step, i) => (
            <li key={step.title} className={cn('process-item', active >= i && 'is-active')} data-step={i}>
              <span className="process-node" aria-hidden="true" />
              <Reveal delay={0.05} className="process-row">
                <div className="process-meta">
                  <span className="process-num" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="process-label">{step.label}</span>
                </div>
                <div>
                  <h3 className="process-title">{step.title}</h3>
                  <p className="muted process-text">{step.text}</p>
                </div>
              </Reveal>
            </li>
          ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
