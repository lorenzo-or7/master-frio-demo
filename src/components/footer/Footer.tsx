import { motion } from 'motion/react'
import { brand, contact, footer, navLinks, services, whatsappUrl } from '@/data/site'
import { BrandMark } from '@/components/ui/BrandMark'
import { InstagramIcon } from '@/components/ui/icons'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'

/** Frozen Editorial Footer — sempre escuro, nos dois temas. */
export function Footer() {
  const reduced = usePrefersReducedMotion()

  return (
    <footer className="footer surface-dark" data-nav-tone="dark">
      <div className="shell">
        <div className="footer-top">
          <div className="footer-brand">
            <a href="#inicio" className="footer-logo">
              <BrandMark size={44} />
              <span>
                <span className="footer-logo-name">{brand.short}</span>
                <span className="footer-logo-sub">{brand.descriptor}</span>
              </span>
              <span className="sr-only">: voltar ao início</span>
            </a>
            <p className="footer-tagline">
              Instalação, manutenção e infraestrutura em ar-condicionado para residências e comércios.
            </p>
          </div>

          <nav className="footer-col" aria-labelledby="footer-nav">
            <h2 id="footer-nav" className="footer-col-title">
              Navegação
            </h2>
            <ul role="list">
              {navLinks.map((l) => (
                <li key={l.id}>
                  <a href={`#${l.id}`}>{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="footer-col" aria-labelledby="footer-services">
            <h2 id="footer-services" className="footer-col-title">
              Serviços
            </h2>
            <ul role="list">
              {services.map((s) => (
                <li key={s.id}>
                  <a href={`#servico-${s.id}`}>{s.title}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="footer-col">
            <h2 className="footer-col-title">Atendimento</h2>
            <ul role="list">
              <li className="footer-plain">{brand.coverage}</li>
              <li>
                <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
                  WhatsApp {contact.whatsappDisplay}
                  <span className="sr-only"> (abre em nova aba)</span>
                </a>
              </li>
              <li>
                <a
                  href={contact.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-ig"
                >
                  <InstagramIcon size={16} />
                  {contact.instagramHandle}
                  <span className="sr-only"> no Instagram (abre em nova aba)</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Letreiro monumental (SVG decorativo). O viewBox usa a largura óptica medida da
            Spline Sans 700 com tracking -0.045em: escala com a tela sem esticar espaçamentos. */}
        <div className="footer-wordmark-mask">
          <motion.svg
            className="footer-wordmark"
            viewBox="0 150 1184 158"
            aria-hidden="true"
            focusable="false"
            initial={reduced ? false : { y: '72%' }}
            whileInView={{ y: '0%' }}
            viewport={{ once: true, margin: '0px 0px -4% 0px' }}
            transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
          >
            <text x="0" y="300">
              MASTER FRIO
            </text>
          </motion.svg>
        </div>

        <div className="footer-legal">
          <div className="footer-legal-text">
            <p>{footer.legal}</p>
            <p>
              <span className="footer-proto">{footer.prototypeTag}</span>
              {footer.credit}
            </p>
          </div>
          <span className="footer-or7">
            <img
              src={footer.watermark}
              alt="Or7"
              width={1536}
              height={512}
              loading="lazy"
              decoding="async"
            />
          </span>
        </div>
      </div>
    </footer>
  )
}
