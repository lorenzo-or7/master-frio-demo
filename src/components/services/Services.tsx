import type { ReactNode } from 'react'
import { AirVent, Cable, Gauge, PlugZap, ShieldCheck, ShoppingBag, Wrench } from 'lucide-react'
import { messages, services, whatsappUrl, type ServiceIcon } from '@/data/site'
import { FocusCards, type FocusCardData } from '@/components/ui/focus-cards'
import { Reveal } from '@/components/ui/Reveal'

const ICONS: Record<ServiceIcon, ReactNode> = {
  install: <AirVent size={18} strokeWidth={1.8} />,
  preventive: <ShieldCheck size={18} strokeWidth={1.8} />,
  corrective: <Wrench size={18} strokeWidth={1.8} />,
  gas: <Gauge size={18} strokeWidth={1.8} />,
  electric: <PlugZap size={18} strokeWidth={1.8} />,
  sale: <ShoppingBag size={18} strokeWidth={1.8} />,
  infra: <Cable size={18} strokeWidth={1.8} />,
}

const cards: FocusCardData[] = services.map((s, i) => ({
  id: s.id,
  title: s.title,
  description: s.description,
  src: s.src,
  alt: s.alt,
  position: s.position,
  width: s.width,
  height: s.height,
  trimCorners: s.trimCorners,
  icon: ICONS[s.icon],
  href: whatsappUrl(messages.service(s.messageName)),
  cta: 'Solicitar orçamento',
  wide: i === services.length - 1,
}))

export function Services() {
  return (
    <section id="servicos" className="section services" aria-labelledby="servicos-title">
      <div className="shell">
        <header className="section-head">
          <div>
            <Reveal>
              <p className="eyebrow">Serviços</p>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 id="servicos-title" className="h2">
                Nossos serviços
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.12} className="section-head-aside">
            <p className="lead">
              Da escolha do aparelho à manutenção: sete frentes de trabalho para residências e comércios.
            </p>
          </Reveal>
        </header>

        <FocusCards cards={cards} />

        <p className="services-note">Imagens ilustrativas dos tipos de serviço.</p>
      </div>
    </section>
  )
}
