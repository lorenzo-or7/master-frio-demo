import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/utils'
import { EASE } from '@/lib/motion'

/**
 * Motion System V2 — primitivas com intenções diferentes (nada de um único fade-up para tudo).
 * Todas entram uma única vez; com reduced-motion o conteúdo nasce no estado final.
 *
 *  - Reveal "rise": blocos de leitura (opacidade + 12px, 700ms).
 *  - Reveal "fade": apoio/legendas (só opacidade, 800ms).
 *  - MaskLines: headlines por LINHA em máscara (550–650ms, escalonado).
 *  - Eyebrow: traço que se desenha + rótulo.
 */
const VIEW = { once: true, margin: '0px 0px -12% 0px' } as const

type RevealProps = {
  children: ReactNode
  delay?: number
  className?: string
  as?: 'div' | 'li' | 'p'
  variant?: 'rise' | 'fade'
}

export function Reveal({ children, delay = 0, className, as = 'div', variant = 'rise' }: RevealProps) {
  const reduced = usePrefersReducedMotion()
  if (reduced) {
    const Static = as
    return <Static className={className}>{children}</Static>
  }
  const Comp = as === 'li' ? motion.li : as === 'p' ? motion.p : motion.div
  const from = variant === 'fade' ? { opacity: 0 } : { opacity: 0, y: 12 }
  return (
    <Comp
      className={className}
      initial={from}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEW}
      transition={{ duration: variant === 'fade' ? 0.8 : 0.7, ease: EASE, delay }}
    >
      {children}
    </Comp>
  )
}

type MaskLinesProps = {
  lines: readonly string[]
  as?: 'h1' | 'h2' | 'h3' | 'p'
  id?: string
  className?: string
  delay?: number
  /** Anima na montagem (hero) em vez de ao entrar na viewport. */
  onMount?: boolean
  lineClassName?: (index: number) => string | undefined
}

/**
 * Headline com Text Mask Reveal por linha. O texto completo continua no DOM para leitores de tela.
 * A observação de viewport fica no TÍTULO (sempre visível); as linhas, deslocadas para fora da
 * máscara, só recebem a animação via variants — evita o IntersectionObserver ver um alvo recortado.
 */
export function MaskLines({ lines, as = 'h2', id, className, delay = 0, onMount, lineClassName }: MaskLinesProps) {
  const reduced = usePrefersReducedMotion()
  if (reduced) {
    const Tag = as
    return (
      <Tag id={id} className={className}>
        {lines.map((line, i) => (
          <span className="line-mask" key={line}>
            <span className={cn('line-inner', lineClassName?.(i))}>{line}</span>
            {i < lines.length - 1 ? ' ' : null}
          </span>
        ))}
      </Tag>
    )
  }
  const Tag = motion[as]
  const trigger = onMount ? { animate: 'show' } : { whileInView: 'show', viewport: VIEW }
  return (
    <Tag id={id} className={className} initial="hidden" {...trigger}>
      {lines.map((line, i) => (
        <span className="line-mask" key={line}>
          <motion.span
            className={cn('line-inner', lineClassName?.(i))}
            variants={{
              hidden: { y: '108%' },
              show: { y: '0%', transition: { duration: 0.62, ease: EASE, delay: delay + i * 0.085 } },
            }}
          >
            {line}
          </motion.span>
          {i < lines.length - 1 ? ' ' : null}
        </span>
      ))}
    </Tag>
  )
}

/** Rótulo de seção: o traço se desenha e o texto acompanha. */
export function Eyebrow({ children, className, light }: { children: ReactNode; className?: string; light?: boolean }) {
  const reduced = usePrefersReducedMotion()
  return (
    <p className={cn('eyebrow', light && 'eyebrow--light', className)}>
      <motion.span
        className="eyebrow-rule"
        aria-hidden="true"
        initial={reduced ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={VIEW}
        transition={{ duration: 0.6, ease: EASE }}
      />
      <motion.span
        initial={reduced ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={VIEW}
        transition={{ duration: 0.5, ease: EASE, delay: 0.18 }}
      >
        {children}
      </motion.span>
    </p>
  )
}
