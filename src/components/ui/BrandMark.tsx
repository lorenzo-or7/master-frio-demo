import { brand } from '@/data/site'
import { cn } from '@/lib/utils'

/**
 * Símbolo MF aprovado. O PNG fornecido traz margem clara e corte à direita;
 * a moldura recorta só o quadrado azul, sem distorcer nem pixelar.
 */
export function BrandMark({ size = 36, className }: { size?: number; className?: string }) {
  // Área útil do PNG (313×306): quadrado azul ≈ x 38→313, y 4→280.
  const scale = size / 275
  return (
    <span
      aria-hidden="true"
      className={cn('relative block shrink-0 overflow-hidden', className)}
      style={{ width: size, height: size, borderRadius: size * 0.26 }}
    >
      <img
        src={brand.icon}
        alt=""
        width={313}
        height={306}
        decoding="async"
        className="absolute max-w-none"
        style={{ width: 313 * scale, height: 306 * scale, left: -38 * scale, top: -4 * scale }}
      />
    </span>
  )
}
