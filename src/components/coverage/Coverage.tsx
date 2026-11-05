import { MessageCircle } from 'lucide-react'
import { coverage, messages, whatsappUrl } from '@/data/site'
import { Reveal } from '@/components/ui/Reveal'

/** Detalhe gráfico autoral: anéis de fluxo de ar concêntricos. Não é mapa nem marca localização. */
function AirRings() {
  const rings = [34, 58, 84, 112, 142, 174]
  return (
    <svg className="coverage-art" viewBox="0 0 400 400" aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" strokeLinecap="round">
        {rings.map((r, i) => (
          <circle
            key={r}
            cx="200"
            cy="200"
            r={r}
            strokeWidth={i === 0 ? 1.4 : 1}
            strokeDasharray={i % 2 ? '2 7' : undefined}
            opacity={1 - i * 0.13}
          />
        ))}
        {[0, 1, 2].map((k) => (
          <path
            key={k}
            d={`M ${40 + k * 8} ${250 - k * 46} C 130 ${210 - k * 46}, 260 ${300 - k * 46}, ${360 - k * 6} ${226 - k * 46}`}
            strokeWidth="1.2"
            opacity={0.55 - k * 0.12}
          />
        ))}
      </g>
      <circle cx="200" cy="200" r="5" fill="currentColor" />
    </svg>
  )
}

export function Coverage() {
  return (
    <section id="atendimento" className="coverage" aria-labelledby="atendimento-title">
      <div className="shell coverage-inner">
        <div className="coverage-copy">
          <Reveal>
            <p className="eyebrow">{coverage.eyebrow}</p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 id="atendimento-title" className="h2 coverage-title">
              {coverage.title}
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="lead">{coverage.text}</p>
          </Reveal>
          <Reveal delay={0.18}>
            <a
              href={whatsappUrl(messages.coverage)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary coverage-cta"
            >
              <MessageCircle size={18} aria-hidden="true" />
              {coverage.cta}
              <span className="sr-only"> pelo WhatsApp (abre em nova aba)</span>
            </a>
          </Reveal>
        </div>
        <AirRings />
      </div>
    </section>
  )
}
