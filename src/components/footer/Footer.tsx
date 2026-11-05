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

        {/* Marca gráfica decorativa (SVG): ocupa a largura exata em qualquer tela. */}
        <motion.svg
          className="footer-wordmark"
          viewBox="0 0 1000 132"
          aria-hidden="true"
          focusable="false"
          initial={reduced ? false : { opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -5% 0px' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <text x="0" y="128" textLength="1000" lengthAdjust="spacing">
            MASTER FRIO
          </text>
        </motion.svg>

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
