import { motion } from 'motion/react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { cn } from '@/lib/utils'

/**
 * Frost Switch — opção 01 oficial: cápsula compacta com sol e lua e indicador deslizante.
 * Botão com rótulo dinâmico; o tema é aplicado antes da pintura em index.html.
 */
export function FrostSwitch({ className }: { className?: string }) {
  const { theme, toggle } = useTheme()
  const isDay = theme === 'day'
  const label = isDay ? 'Ativar tema escuro' : 'Ativar tema claro'

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={cn('frost-switch', className)}
      data-theme-state={theme}
    >
      <span className="frost-track" aria-hidden="true">
        <motion.span
          className="frost-thumb"
          initial={false}
          animate={{ x: isDay ? 0 : 26 }}
          transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
        />
        <span className={cn('frost-icon', isDay && 'is-active')}>
          <motion.span
            initial={false}
            animate={{ rotate: isDay ? 0 : -60, scale: isDay ? 1 : 0.86 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="grid place-items-center"
          >
            <Sun size={14} strokeWidth={2} />
          </motion.span>
        </span>
        <span className={cn('frost-icon', !isDay && 'is-active')}>
          <motion.span
            initial={false}
            animate={{ rotate: isDay ? 40 : 0, scale: isDay ? 0.86 : 1 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="grid place-items-center"
          >
            <Moon size={13} strokeWidth={2} />
          </motion.span>
        </span>
      </span>
    </button>
  )
}
