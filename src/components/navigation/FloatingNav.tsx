import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { InstagramIcon } from '@/components/ui/icons'
import { brand, contact, navLinks, whatsappUrl } from '@/data/site'
import { BrandMark } from '@/components/ui/BrandMark'
import { FrostSwitch } from '@/components/ui/FrostSwitch'
import { cn } from '@/lib/utils'

type SectionId = (typeof navLinks)[number]['id']

/**
 * Floating Nav — opção 03 (referência estética 21st.dev "floating navigation bar"),
 * adaptada: cápsula suspensa, tom determinístico sobre hero/rodapé (sempre escuros),
 * oculta ao descer e reaparece ao subir, menu mobile em painel.
 */
export function FloatingNav() {
  const [active, setActive] = useState<SectionId>('inicio')
  const [darkTone, setDarkTone] = useState(true)
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const panelId = useId()

  // Seção ativa: faixa central da viewport.
  useEffect(() => {
    const sections = navLinks
      .map((l) => document.getElementById(l.id))
      .filter((el): el is HTMLElement => !!el)
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id as SectionId)
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  // Tom da cápsula: escuro quando a faixa do topo está sobre a hero ou o rodapé.
  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-nav-tone="dark"]'))
    const state = new Map<Element, boolean>()
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => state.set(e.target, e.isIntersecting))
        setDarkTone(Array.from(state.values()).some(Boolean))
      },
      { rootMargin: '0px 0px -92% 0px' },
    )
    targets.forEach((t) => observer.observe(t))
    return () => observer.disconnect()
  }, [])

  // Oculta ao descer, reaparece ao subir (com histerese para não piscar).
  useEffect(() => {
    const tracker = { lastY: window.scrollY, ticking: false, holdUntil: 0 }
    const onScroll = () => {
      if (tracker.ticking) return
      tracker.ticking = true
      requestAnimationFrame(() => {
        const y = window.scrollY
        const delta = y - tracker.lastY
        setScrolled(y > 24)
        if (Math.abs(delta) > 6) {
          const focusInside = navRef.current?.contains(document.activeElement) ?? false
          // Durante um salto para âncora a nav permanece visível (o visitante acabou de escolher o destino).
          const jumping = performance.now() < tracker.holdUntil
          setHidden(delta > 0 && y > 480 && !focusInside && !jumping)
          tracker.lastY = y
        }
        if (y < 120) setHidden(false)
        tracker.ticking = false
      })
    }
    const onAnchorClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.('a[href^="#"]')
      if (link) {
        tracker.holdUntil = performance.now() + 1600
        setHidden(false)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('click', onAnchorClick, true)
    return () => {
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('click', onAnchorClick, true)
    }
  }, [])

  const close = useCallback((returnFocus = false) => {
    setOpen(false)
    if (returnFocus) toggleRef.current?.focus()
  }, [])

  // Menu: Escape e clique fora fecham.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close(true)
    }
    const onPointer = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) close()
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
    }
  }, [open, close])

  // Fecha o menu se a tela crescer para o layout desktop.
  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1024px)')
    const onChange = () => mql.matches && setOpen(false)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  const isHidden = hidden && !open

  return (
    <header className="nav-wrap" data-hidden={isHidden || undefined}>
      <nav
        ref={navRef}
        aria-label="Navegação principal"
        className={cn('nav-capsule', darkTone && 'surface-dark is-dark', scrolled && 'is-scrolled')}
        onFocus={() => setHidden(false)}
      >
        <div className="nav-row">
          <a href="#inicio" className="nav-brand" onClick={() => close()}>
            <BrandMark size={34} />
            <span className="nav-brand-text">
              <span className="nav-brand-name">{brand.short}</span>
              <span className="nav-brand-sub">{brand.descriptor}</span>
            </span>
            <span className="sr-only">: ir para o início</span>
          </a>

          <ul className="nav-links" role="list">
            {navLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  className="nav-link"
                  aria-current={active === link.id ? 'location' : undefined}
                >
                  {link.label}
                  {active === link.id && (
                    <motion.span
                      layoutId="nav-active"
                      className="nav-link-mark"
                      transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
                    />
                  )}
                </a>
              </li>
            ))}
          </ul>

          <div className="nav-actions">
            <FrostSwitch />
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-sm nav-cta"
            >
              Orçamento
              <span className="sr-only"> pelo WhatsApp (abre em nova aba)</span>
            </a>
            <button
              ref={toggleRef}
              type="button"
              className="nav-menu-btn"
              aria-expanded={open}
              aria-controls={panelId}
              aria-label={open ? 'Fechar menu' : 'Abrir menu'}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
            </button>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id={panelId}
              className="nav-panel"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <ul role="list" className="nav-panel-links">
                {navLinks.map((link, i) => (
                  <li key={link.id}>
                    <a
                      href={`#${link.id}`}
                      className="nav-panel-link"
                      aria-current={active === link.id ? 'location' : undefined}
                      onClick={() => close()}
                      // Foco no primeiro link ao abrir.
                      autoFocus={i === 0}
                    >
                      <span className="nav-panel-index" aria-hidden="true">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="nav-panel-foot">
                <a
                  href={whatsappUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  onClick={() => close()}
                >
                  Solicitar orçamento
                  <ArrowUpRight size={18} aria-hidden="true" />
                  <span className="sr-only"> pelo WhatsApp (abre em nova aba)</span>
                </a>
                <a
                  href={contact.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-link"
                  onClick={() => close()}
                >
                  <InstagramIcon size={18} />
                  {contact.instagramHandle}
                  <span className="sr-only"> no Instagram (abre em nova aba)</span>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}
