import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { ArrowDown, ArrowUpRight, Pause, Play } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { hero, whatsappUrl } from '@/data/site'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'

gsap.registerPlugin(ScrollTrigger)

const EASE = [0.22, 1, 0.36, 1] as const

type NetworkInfo = { saveData?: boolean }

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const shadeRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
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

  // Cinematic scroll: zoom 1 → 1.04, deslocamento pequeno, sombra cresce. Scrub suave, sem pin.
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: 0.6 },
      })
      tl.to(mediaRef.current, { scale: 1.04, yPercent: 3 }, 0)
        .to(shadeRef.current, { opacity: 0.55 }, 0)
        .to(contentRef.current, { y: -28 }, 0)
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

  const lineMotion = (i: number) =>
    reduced
      ? {}
      : {
          initial: { y: '108%' },
          animate: { y: '0%' },
          transition: { duration: 0.6, ease: EASE, delay: 0.12 + i * 0.09 },
        }

  const fadeUp = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.55, ease: EASE, delay },
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
        <h1 id="hero-title" className="hero-title">
          {hero.lines.map((line, i) => (
            <span className="line-mask" key={line}>
              <motion.span className="line-inner" {...lineMotion(i)}>
                {line}
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.p className="hero-support" {...fadeUp(0.34)}>
          {hero.support}
        </motion.p>
        <motion.div className="hero-ctas" {...fadeUp(0.42)}>
          <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            {hero.primaryCta}
            <ArrowUpRight size={18} className="btn-arrow" aria-hidden="true" />
            <span className="sr-only"> pelo WhatsApp (abre em nova aba)</span>
          </a>
          <a href="#servicos" className="btn btn-ghost">
            {hero.secondaryCta}
            <ArrowDown size={18} aria-hidden="true" />
          </a>
        </motion.div>
      </div>

      <button
        type="button"
        className="hero-video-toggle"
        onClick={onToggleVideo}
        aria-label={playing ? 'Pausar vídeo de fundo' : 'Reproduzir vídeo de fundo'}
        title={playing ? 'Pausar vídeo' : 'Reproduzir vídeo'}
      >
        {playing ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
      </button>
    </section>
  )
}
