import { useEffect, useRef } from 'react'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import type { Slide } from '@/data/site'

interface LightboxProps {
  slides: Slide[]
  index: number | null
  onClose: () => void
  onNavigate: (index: number) => void
}

/**
 * Visualização ampliada com <dialog> nativo: foco preso no modal, Escape fecha,
 * botão "voltar" do navegador também fecha (entrada própria no histórico).
 */
export function Lightbox({ slides, index, onClose, onNavigate }: LightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const pushed = useRef(false)
  const open = index !== null

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.showModal()
      if (!pushed.current) {
        history.pushState({ mfLightbox: true }, '')
        pushed.current = true
      }
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  // Voltar do navegador fecha o lightbox.
  useEffect(() => {
    const onPop = () => {
      if (pushed.current) {
        pushed.current = false
        onClose()
      }
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [onClose])

  const requestClose = () => {
    if (pushed.current) {
      // Remove a entrada do histórico; o popstate chama onClose.
      history.back()
    } else {
      onClose()
    }
  }

  const slide = index !== null ? slides[index] : null
  const go = (delta: number) => {
    if (index === null) return
    onNavigate((index + delta + slides.length) % slides.length)
  }

  return (
    <dialog
      ref={dialogRef}
      className="lightbox surface-dark"
      aria-labelledby="lightbox-title"
      onCancel={(e) => {
        e.preventDefault()
        requestClose()
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) requestClose()
      }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') go(-1)
        if (e.key === 'ArrowRight') go(1)
      }}
    >
      {slide && (
        <div className="lightbox-inner">
          <div className="lightbox-bar">
            <p id="lightbox-title" className="lightbox-title">
              {slide.title}
              <span className="lightbox-count">
                {String((index ?? 0) + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
              </span>
            </p>
            <button type="button" className="lightbox-close" onClick={requestClose} autoFocus>
              <X size={20} aria-hidden="true" />
              <span>Fechar</span>
            </button>
          </div>
          <figure className="lightbox-figure">
            <img
              key={slide.src}
              src={slide.src}
              alt={slide.alt}
              width={slide.width}
              height={slide.height}
              decoding="async"
            />
          </figure>
          <div className="lightbox-nav">
            <button type="button" className="car-control" onClick={() => go(-1)} aria-label="Foto anterior">
              <ArrowLeft size={20} aria-hidden="true" />
            </button>
            <button type="button" className="car-control" onClick={() => go(1)} aria-label="Próxima foto">
              <ArrowRight size={20} aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </dialog>
  )
}
