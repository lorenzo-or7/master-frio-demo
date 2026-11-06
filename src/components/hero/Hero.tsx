import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { ArrowDown, ArrowUpRight, Pause, Play } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { hero, whatsappUrl } from '@/data/site'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'
import { MaskLines } from '@/components/ui/Reveal'
import { EASE } from '@/lib/motion'

gsap.registerPlugin(ScrollTrigger)

type NetworkInfo = { saveData?: boolean }

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const shadeRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const ringRef = useRef<SVGCircleElement>(null)
  const reduced = usePrefersReducedMotion()

  /** O vídeo só recebe src depois da primeira pintura (poster e texto primeiro). */
  const [videoSrc, setVideoSrc] = useState<string | null>(null)
  const [videoReady, setVideoReady] = useState(false)
  const [playing, setPlaying] = useState(false)
  /** Pausa explícita do visitante (WCAG 2.2.2) — respeitada mesmo ao voltar à viewport. */
  const userPausedRef = useRef(false)
  const inViewRef = useRef(true)

  // Carregamento progressivo: após o load da página e fora de reduced-motion / economia de dados.
  useEffect(() => {
    if (reduced) return
    const saveData = (navigator as Navigator & { connection?: NetworkInfo }).connection?.saveData
    if (saveData) return
    let idle = 0
    const begin = () => {
      idle = window.setTimeout(() => setVideoSrc(hero.video), 120)
    }
    if (document.readyState === 'complete') begin()
    else window.addEventListener('load', begin, { once: true })
    return () => {
      window.clearTimeout(idle)
      window.removeEventListener('load', begin)
    }
  }, [reduced])

  const tryPlay = () => {
    const video = videoRef.current
    if (!video || !video.src) return
    const p = video.play()
    if (p && typeof p.catch === 'function') {
      p.catch(() => {
        // Autoplay bloqueado: o poster permanece como visual principal.
        setPlaying(false)
      })
    }
  }

  // Pausa fora da viewport e retoma ao voltar, sem reiniciar.
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.isIntersecting
        const video = videoRef.current
        if (!video) return
        if (!entry.isIntersecting) video.pause()
        else if (!userPausedRef.current && !reduced && video.src) tryPlay()
      },
      { threshold: 0.05 },
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [reduced])

  // Reduced motion ativado durante a visita: para o vídeo.
  useEffect(() => {
    if (reduced) videoRef.current?.pause()
  }, [reduced])

  // Anel de progresso do ciclo do vídeo (só enquanto toca; nenhum loop quando pausado).
  useEffect(() => {
    if (!playing) return
    const loop = { id: 0 }
    const tick = () => {
      const v = videoRef.current
      const ring = ringRef.current
      if (v && ring && v.duration) ring.style.strokeDashoffset = String(1 - v.currentTime / v.duration)
      loop.id = requestAnimationFrame(tick)
    }
    loop.id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(loop.id)
  }, [playing])

  // Cinematic scroll: zoom 1 → 1.04, deslocamento mínimo, sombra progressiva. Scrub suave, sem pin.
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: 0.8 },
      })
      tl.to(mediaRef.current, { scale: 1.04, yPercent: 2.5 }, 0)
        .to(shadeRef.current, { opacity: 0.62 }, 0)
        // Só deslocamento: reduzir a opacidade do texto ainda visível baixaria o contraste do CTA.
        .to(contentRef.current, { y: -36 }, 0)
    })
    return () => mm.revert()
  }, [])

  const onToggleVideo = () => {
    const video = videoRef.current
    if (!videoSrc) {
      // Reduced motion / economia de dados: o visitante escolhe reproduzir.
      userPausedRef.current = false
      setVideoSrc(hero.video)
      return
    }
    if (!video) return
    if (video.paused) {
      userPausedRef.current = false
      tryPlay()
    } else {
      userPausedRef.current = true
      video.pause()
    }
  }

  // Coreografia de entrada: eyebrow → linhas do título → apoio → ações.
  const enter = (delay: number, y = 10) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, ease: EASE, delay },
        }

  return (
    <section
      id="inicio"
      ref={sectionRef}
      className="hero surface-dark"
      data-nav-tone="dark"
      aria-labelledby="hero-title"
    >
      <div className="hero-media" ref={mediaRef}>
        <img
          className="hero-poster"
          src={hero.poster}
          srcSet={`${hero.posterSmall} 1280w, ${hero.poster} 1672w`}
          sizes="100vw"
          alt=""
          width={1672}
          height={941}
          fetchPriority="high"
          decoding="async"
        />
        {videoSrc && (
          <video
            ref={videoRef}
            className="hero-video"
            data-ready={videoReady || undefined}
            src={videoSrc}
            poster={hero.poster}
            muted
            loop
            playsInline
            autoPlay
            preload="auto"
            disablePictureInPicture
            disableRemotePlayback
            aria-hidden="true"
            tabIndex={-1}
            onLoadedData={() => setVideoReady(true)}
            onCanPlay={() => {
              if (inViewRef.current && !userPausedRef.current) tryPlay()
            }}
            onPlaying={() => {
              setVideoReady(true)
              setPlaying(true)
            }}
            onPause={() => setPlaying(false)}
            onError={() => {
              setVideoReady(false)
              setPlaying(false)
            }}
          />
        )}
        <div className="hero-shade-base" aria-hidden="true" />
        <div className="hero-shade" ref={shadeRef} aria-hidden="true" />
      </div>

      <div className="hero-content shell" ref={contentRef}>
        <motion.p className="hero-eyebrow" {...enter(0.05, 6)}>
          <span className="hero-eyebrow-dot" aria-hidden="true" />
          {hero.eyebrow}
        </motion.p>
        <MaskLines
          as="h1"
          id="hero-title"
          className="hero-title"
          lines={hero.lines}
          onMount
          delay={0.14}
        />
        <motion.p className="hero-support" {...enter(0.42)}>
          {hero.support}
        </motion.p>
        <motion.div className="hero-ctas" {...enter(0.52)}>
          <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg">
            {hero.primaryCta}
            <ArrowUpRight size={18} className="btn-arrow" aria-hidden="true" />
            <span className="sr-only"> pelo WhatsApp (abre em nova aba)</span>
          </a>
          <a href="#servicos" className="btn btn-ghost hero-secondary">
            {hero.secondaryCta}
            <ArrowDown size={17} aria-hidden="true" />
          </a>
          <button
            type="button"
            className="hero-video-toggle"
            onClick={onToggleVideo}
            aria-label={playing ? 'Pausar vídeo de fundo' : 'Reproduzir vídeo de fundo'}
            title={playing ? 'Pausar vídeo' : 'Reproduzir vídeo'}
          >
            <svg className="hero-video-ring" viewBox="0 0 44 44" aria-hidden="true">
              <circle cx="22" cy="22" r="20" pathLength={1} className="ring-track" />
              <circle ref={ringRef} cx="22" cy="22" r="20" pathLength={1} className="ring-progress" />
            </svg>
            {playing ? <Pause size={15} aria-hidden="true" /> : <Play size={15} aria-hidden="true" />}
          </button>
        </motion.div>
      </div>

    </section>
  )
}
