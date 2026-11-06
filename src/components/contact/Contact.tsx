import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { MapPin, MessageCircle, RotateCcw } from 'lucide-react'
import { brand, contact, contactSection, lanyard, whatsappUrl } from '@/data/site'
import { InstagramIcon } from '@/components/ui/icons'
import { Eyebrow, MaskLines, Reveal } from '@/components/ui/Reveal'
import { useMediaQuery, usePrefersReducedMotion } from '@/hooks/useMediaQuery'

// three.js só é baixado quando a seção Contato se aproxima da viewport.
const Lanyard = lazy(() => import('./Lanyard'))

type Nav = Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } }

function canUse3D() {
  try {
    const nav = navigator as Nav
    if (nav.connection?.saveData) return false
    if (typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency <= 2) return false
    if (typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 2) return false
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
    const ok = !!gl
    ;(gl as WebGLRenderingContext | null)?.getExtension('WEBGL_lose_context')?.loseContext()
    return ok
  } catch {
    return false
  }
}

function StaticBadge() {
  return (
    <figure className="badge-static">
      <span className="badge-static-strap" aria-hidden="true" />
      <img
        src={lanyard.front}
        alt={lanyard.frontAlt}
        width={1086}
        height={1448}
        loading="lazy"
        decoding="async"
      />
    </figure>
  )
}

export function Contact() {
  const reduced = usePrefersReducedMotion()
  const coarse = useMediaQuery('(pointer: coarse)')
  const regionRef = useRef<HTMLDivElement>(null)
  const [near, setNear] = useState(false)
  const [supported, setSupported] = useState<boolean>(canUse3D)
  const [ready, setReady] = useState(false)
  const [flip, setFlip] = useState(0)

  useEffect(() => {
    const el = regionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true)
          observer.disconnect()
        }
      },
      { rootMargin: '600px 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const use3D = near && supported && !reduced

  return (
    <section id="contato" className="section contact surface-2" aria-labelledby="contato-title">
      <div className="shell contact-grid">
        <div className="contact-copy">
          <Eyebrow>{contactSection.eyebrow}</Eyebrow>
          <MaskLines
            id="contato-title"
            className="h2 contact-title"
            lines={['Seu conforto', 'começa aqui.']}
            delay={0.08}
          />
          <Reveal variant="fade" delay={0.28}>
            <p className="lead">{contactSection.text}</p>
          </Reveal>
          <Reveal delay={0.36} className="contact-actions">
            <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg">
              <MessageCircle size={18} aria-hidden="true" />
              {contactSection.cta}
              <span className="sr-only"> (abre em nova aba)</span>
            </a>
          </Reveal>
          <Reveal variant="fade" delay={0.46}>
            <ul className="contact-channels" role="list">
              <li>
                <span className="contact-channel-label">WhatsApp</span>
                <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
                  {contact.whatsappDisplay}
                  <span className="sr-only"> (abre em nova aba)</span>
                </a>
              </li>
              <li>
                <span className="contact-channel-label">Instagram</span>
                <a href={contact.instagramUrl} target="_blank" rel="noopener noreferrer">
                  <InstagramIcon size={16} />
                  {contact.instagramHandle}
                  <span className="sr-only"> no Instagram (abre em nova aba)</span>
                </a>
              </li>
              <li>
                <span className="contact-channel-label">Atendimento</span>
                <span className="contact-channel-value">
                  <MapPin size={16} aria-hidden="true" />
                  {brand.coverage}
                </span>
              </li>
            </ul>
          </Reveal>
        </div>

        <div className="lanyard-col">
          <div className="lanyard-region" ref={regionRef} data-mode={use3D ? '3d' : 'static'}>
            {use3D ? (
              <>
                {!ready && <StaticBadge />}
                <Suspense fallback={null}>
                  <Lanyard
                    frontImage={lanyard.front}
                    backImage={lanyard.back}
                    strapImage={lanyard.strap}
                    orientation="portrait"
                    finish="glossy"
                    metal="silver"
                    strapColor="#075AA3"
                    breeze={0.15}
                    damping={0.72}
                    elasticity={0.38}
                    interactive
                    touchScroll
                    maxPixelRatio={coarse ? 1.5 : 2}
                    flipSignal={flip}
                    onReady={() => setReady(true)}
                    onUnsupported={() => setSupported(false)}
                    className={ready ? 'lanyard-canvas is-ready' : 'lanyard-canvas'}
                  />
                </Suspense>
                <p className="sr-only">
                  Crachá ilustrado da Master Frio. {lanyard.frontAlt} No verso, a arte com o perfil do
                  Instagram {contact.instagramHandle}.
                </p>
              </>
            ) : (
              <StaticBadge />
            )}
          </div>
          {/* Linha sempre presente (altura fixa) para não deslocar o layout quando o 3D carrega. */}
          <div className="lanyard-tools">
            {use3D ? (
              <>
                <button
                  type="button"
                  className="lanyard-flip"
                  onClick={() => setFlip((n) => n + 1)}
                >
                  <RotateCcw size={15} aria-hidden="true" />
                  Virar crachá
                </button>
                <span className="lanyard-hint" aria-hidden="true">
                  {coarse ? 'Toque no crachá para virar' : 'Arraste ou clique no crachá'}
                </span>
              </>
            ) : (
              <a
                href={contact.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-link"
              >
                <InstagramIcon size={18} />
                Ver perfil no Instagram
                <span className="sr-only"> {contact.instagramHandle} (abre em nova aba)</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
