/**
 * Carousel — adaptado de Aceternity UI (https://ui.aceternity.com/components/carousel).
 * API preservada: `<Carousel slides={slideData} />` com { title, button, src }.
 *
 * Adaptações (registro):
 * - Estrutura de lista válida (li direto no ul; o original tinha div entre ul e li).
 * - Ícone @tabler/icons-react trocado por lucide-react (ícones consistentes, sem nova dependência).
 * - Loop de requestAnimationFrame contínuo por slide removido: o parallax do cursor só atualiza
 *   no mousemove (ponteiro fino) — menos trabalho de CPU.
 * - Botão "Ver foto" agora abre lightbox acessível (`onOpen`), nunca fica inerte.
 * - Navegação por setas, teclado (←/→, Home/End) e swipe horizontal (touch-action: pan-y
 *   preserva o scroll vertical). Sem autoplay.
 * - Slides não atuais: `aria-hidden` e legenda `inert` (clique no vizinho ainda navega); região com aria-roledescription="carrossel"
 *   e contador anunciado educadamente.
 * - V2: sem inclinação 3D (só escala/opacidade discretas), legenda editorial abaixo da foto,
 *   indicador segmentado clicável.
 * - object-position por foto, legenda com contraste AA, lazy-load após a 1ª,
 *   transição 550ms com easing de reveal.
 */
import { useCallback, useId, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { ArrowLeft, ArrowRight, Expand } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SlideData {
  title: string
  button: string
  src: string
  alt?: string
  position?: string
  width?: number
  height?: number
}

interface SlideProps {
  slide: SlideData
  index: number
  current: number
  total: number
  handleSlideClick: (index: number) => void
  onOpen?: (index: number) => void
}

const Slide = ({ slide, index, current, total, handleSlideClick, onOpen }: SlideProps) => {
  const slideRef = useRef<HTMLDivElement>(null)
  const frame = useRef(0)
  const isCurrent = current === index

  const handleMouseMove = (event: React.MouseEvent) => {
    const el = slideRef.current
    if (!el || !isCurrent) return
    const r = el.getBoundingClientRect()
    const x = event.clientX - (r.left + r.width / 2)
    const y = event.clientY - (r.top + r.height / 2)
    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      el.style.setProperty('--x', `${x}px`)
      el.style.setProperty('--y', `${y}px`)
    })
  }

  const handleMouseLeave = () => {
    cancelAnimationFrame(frame.current)
    slideRef.current?.style.setProperty('--x', '0px')
    slideRef.current?.style.setProperty('--y', '0px')
  }

  const { src, button, title, alt, position, width, height } = slide

  return (
    <li
      className="car-persp"
      aria-roledescription="slide"
      aria-label={`${index + 1} de ${total}: ${title}`}
      aria-hidden={!isCurrent || undefined}
    >
      <div
        ref={slideRef}
        className={cn('car-slide', isCurrent && 'is-current')}
        onClick={() => handleSlideClick(index)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="car-frame">
          <img
            className="car-img"
            style={{ objectPosition: position ?? '50% 50%' }}
            alt={alt ?? title}
            src={src}
            width={width}
            height={height}
            loading={index === 0 ? 'eager' : 'lazy'}
            decoding="async"
            draggable={false}
          />
        </div>

        {/* V2: legenda editorial abaixo da foto — a fotografia real fica limpa, sem gradiente por cima. */}
        <article className="car-caption" inert={!isCurrent}>
          <h3 className="car-title">
            <span className="car-title-index" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            {title}
          </h3>
          <button type="button" className="car-open" onClick={() => onOpen?.(index)}>
            <Expand size={15} aria-hidden="true" />
            {button}
            <span className="sr-only">: {title}, em tela ampliada</span>
          </button>
        </article>
      </div>
    </li>
  )
}

interface CarouselControlProps {
  type: 'previous' | 'next'
  title: string
  handleClick: () => void
}

const CarouselControl = ({ type, title, handleClick }: CarouselControlProps) => (
  <button type="button" className="car-control" aria-label={title} title={title} onClick={handleClick}>
    {type === 'previous' ? (
      <ArrowLeft size={20} aria-hidden="true" />
    ) : (
      <ArrowRight size={20} aria-hidden="true" />
    )}
  </button>
)

interface CarouselProps {
  slides: SlideData[]
  onOpen?: (index: number) => void
  label?: string
}

export default function Carousel({ slides, onOpen, label = 'Galeria de fotos' }: CarouselProps) {
  const [current, setCurrent] = useState(0)
  const id = useId()
  const swipe = useRef<{ x: number; y: number; id: number } | null>(null)
  const suppressClick = useRef(false)

  const go = useCallback(
    (next: number) => setCurrent(((next % slides.length) + slides.length) % slides.length),
    [slides.length],
  )
  const handlePreviousClick = () => go(current - 1)
  const handleNextClick = () => go(current + 1)

  const handleSlideClick = (index: number) => {
    if (suppressClick.current) return
    if (current !== index) setCurrent(index)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      go(current - 1)
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      go(current + 1)
    } else if (e.key === 'Home') {
      e.preventDefault()
      go(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      go(slides.length - 1)
    }
  }

  // Swipe horizontal; gesto vertical segue para o scroll nativo (touch-action: pan-y).
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse') return
    swipe.current = { x: e.clientX, y: e.clientY, id: e.pointerId }
  }
  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    const start = swipe.current
    swipe.current = null
    if (!start || start.id !== e.pointerId) return
    const dx = e.clientX - start.x
    const dy = e.clientY - start.y
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      suppressClick.current = true
      window.setTimeout(() => (suppressClick.current = false), 50)
      go(current + (dx < 0 ? 1 : -1))
    }
  }

  return (
    <div
      className="car-root"
      role="region"
      aria-roledescription="carrossel"
      aria-label={label}
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      <div
        className="car-viewport"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (swipe.current = null)}
      >
        <ul
          className="car-track"
          style={{ transform: `translate3d(-${current * (100 / slides.length)}%, 0, 0)` }}
        >
          {slides.map((slide, index) => (
            <Slide
              key={slide.src}
              slide={slide}
              index={index}
              current={current}
              total={slides.length}
              handleSlideClick={handleSlideClick}
              onOpen={onOpen}
            />
          ))}
        </ul>
      </div>

      <div className="car-controls">
        <CarouselControl type="previous" title="Foto anterior" handleClick={handlePreviousClick} />
        <div className="car-progress">
          <p className="car-count" aria-live="polite" id={`car-count-${id}`}>
            <span className="car-count-current">{String(current + 1).padStart(2, '0')}</span>
            <span aria-hidden="true"> / </span>
            <span className="sr-only"> de </span>
            {String(slides.length).padStart(2, '0')}
          </p>
          <ol className="car-dots" role="list" aria-label="Escolher foto">
            {slides.map((s, i) => (
              <li key={s.src}>
                <button
                  type="button"
                  className="car-dot"
                  aria-label={`Foto ${i + 1}: ${s.title}`}
                  aria-current={i === current || undefined}
                  onClick={() => go(i)}
                />
              </li>
            ))}
          </ol>
        </div>
        <CarouselControl type="next" title="Próxima foto" handleClick={handleNextClick} />
      </div>
    </div>
  )
}
