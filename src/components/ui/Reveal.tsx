import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'

/**
 * Entrada discreta (opacidade + 14px), uma única vez. Com reduced-motion o conteúdo
 * já nasce visível — sem saltos nem dependência de animação.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as = 'div',
}: {
  children: ReactNode
  delay?: number
  className?: string
  as?: 'div' | 'li'
}) {
  const reduced = usePrefersReducedMotion()
  const Comp = as === 'li' ? motion.li : motion.div
  if (reduced) {
    const Static = as
    return <Static className={className}>{children}</Static>
  }
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </Comp>
  )
}
