import { motion } from 'motion/react'
import { MessageCircle } from 'lucide-react'
import { coverage, messages, whatsappUrl } from '@/data/site'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'
import { Eyebrow, Reveal } from '@/components/ui/Reveal'
import { EASE } from '@/lib/motion'

/**
 * Linhas de fluxo de ar: o mesmo gesto do vídeo da hero (ar saindo em curvas), em traço fino.
 * Puramente decorativo — não é mapa e não marca localização.
 */
function Airflow() {
  const reduced = usePrefersReducedMotion()
  const paths = [
    'M -20 210 C 180 150, 360 270, 560 196 S 900 120, 1240 188',
    'M -20 252 C 200 196, 380 312, 590 238 S 930 168, 1240 236',
    'M -20 296 C 220 244, 400 350, 620 282 S 960 214, 1240 284',
    'M -20 340 C 240 292, 420 392, 650 326 S 990 262, 1240 332',
  ]
  return (
    <svg className="coverage-air" viewBox="0 0 1200 420" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      {paths.map((d, i) => (
        <motion.path
          key={d}
          d={d}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.25}
          strokeLinecap="round"
          opacity={0.5 - i * 0.09}
          initial={reduced ? false : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.1 + i * 0.12 }}
        />
      ))}
    </svg>
  )
}

export function Coverage() {
  const reduced = usePrefersReducedMotion()
  return (
    <section id="atendimento" className="coverage" aria-labelledby="atendimento-title">
      <Airflow />
      <div className="shell coverage-inner">
        <Eyebrow light>{coverage.eyebrow}</Eyebrow>
        <h2 id="atendimento-title" className="coverage-title">
          <span className="line-mask">
            <motion.span
              className="line-inner"
              initial={reduced ? false : { x: '-6%', opacity: 0 }}
              whileInView={{ x: '0%', opacity: 1 }}
              viewport={{ once: true, margin: '0px 0px -10% 0px' }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
            >
              {coverage.title}
            </motion.span>
          </span>
        </h2>
        <div className="coverage-foot">
          <Reveal variant="fade" delay={0.3}>
            <p className="coverage-text">{coverage.text}</p>
            <ul className="coverage-tags" role="list">
              {coverage.tags.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.4}>
            <a
              href={whatsappUrl(messages.coverage)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-inverse btn-lg"
            >
              <MessageCircle size={18} aria-hidden="true" />
              {coverage.cta}
              <span className="sr-only"> pelo WhatsApp (abre em nova aba)</span>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
