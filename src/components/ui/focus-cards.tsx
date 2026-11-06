/**
 * Focus Cards — adaptado de Aceternity UI (https://ui.aceternity.com/components/focus-cards).
 *
 * Mudanças em relação ao original (registro de adaptação):
 * - O desfoque/atenuação atinge SOMENTE a foto dos cards não ativos; título, descrição e CTA
 *   permanecem sempre legíveis (o original ocultava o título até o hover).
 * - Ativação por mouse (pointerType "mouse") e por foco de teclado (focus-within); Escape
 *   remove o destaque. Toque não altera estado (sem hover em mobile).
 * - Entrada escalonada por coluna (Motion), uma única vez; nada com reduced-motion.
 * - Desfoque máx. 2.5px, zoom da foto ativa 1.02, 320ms com easing natural — sem salto/escala do card.
 * - Conteúdo real em DOM (Spline Sans), CTA de WhatsApp por card e layout 3×2 + 1 horizontal.
 */
import { memo, useCallback, useState, type KeyboardEvent, type ReactNode } from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'

export interface FocusCardData {
  id: string
  title: string
  description: string
  src: string
  alt: string
  position: string
  width: number
  height: number
  trimCorners?: boolean
  icon: ReactNode
  href: string
  cta: string
  wide?: boolean
}

interface CardProps {
  card: FocusCardData
  index: number
  state: 'idle' | 'active' | 'dimmed'
  setActive: (index: number | null) => void
}

export const Card = memo(function Card({ card, index, state, setActive }: CardProps) {
  const reduced = usePrefersReducedMotion()
  // Entrada única, escalonada por coluna (a linha inteira não "pisca" junta).
  const enter = reduced
    ? {}
    : {
        initial: { opacity: 0, y: 28 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '0px 0px -8% 0px' },
        transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] as const, delay: card.wide ? 0.05 : (index % 3) * 0.09 },
      }
  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Escape') setActive(null)
  }

  return (
    <motion.article
      {...enter}
      id={`servico-${card.id}`}
      className={cn('fc-card', card.wide && 'fc-card--wide')}
      data-state={state}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setActive(index)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && setActive(null)}
      onFocus={() => setActive(index)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setActive(null)
      }}
      onKeyDown={onKeyDown}
      aria-labelledby={`servico-${card.id}-title`}
    >
      <div className="fc-media" aria-hidden="true">
        <img
          src={card.src}
          alt={card.alt}
          width={card.width}
          height={card.height}
          loading="lazy"
          decoding="async"
          className={cn('fc-img', card.trimCorners && 'fc-img--trim')}
          style={{ objectPosition: card.position }}
        />
      </div>
      <div className="fc-shade" aria-hidden="true" />

      <div className="fc-top" aria-hidden="true">
        <span className="fc-index">{String(index + 1).padStart(2, '0')}</span>
        <span className="fc-icon">{card.icon}</span>
      </div>

      <div className="fc-body">
        <h3 id={`servico-${card.id}-title`} className="fc-title">
          {card.title}
        </h3>
        <p className="fc-desc">{card.description}</p>
        <a className="fc-cta" href={card.href} target="_blank" rel="noopener noreferrer">
          <span>{card.cta}</span>
          <span className="sr-only">
            {' '}
            de {card.title.toLowerCase()} pelo WhatsApp (abre em nova aba)
          </span>
          <svg
            className="fc-cta-arrow"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M7 17 17 7" />
            <path d="M7 7h10v10" />
          </svg>
        </a>
      </div>
    </motion.article>
  )
})

export function FocusCards({ cards }: { cards: FocusCardData[] }) {
  const [active, setActiveState] = useState<number | null>(null)
  const setActive = useCallback((i: number | null) => setActiveState(i), [])

  return (
    <div className="fc-grid">
      {cards.map((card, index) => (
        <Card
          key={card.id}
          card={card}
          index={index}
          state={active === null ? 'idle' : active === index ? 'active' : 'dimmed'}
          setActive={setActive}
        />
      ))}
    </div>
  )
}
