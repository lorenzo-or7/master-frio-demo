import type { ReactNode } from 'react'
import { AirVent, Cable, Gauge, PlugZap, ShieldCheck, ShoppingBag, Wrench } from 'lucide-react'
import { messages, services, whatsappUrl, type ServiceIcon } from '@/data/site'
import { FocusCards, type FocusCardData } from '@/components/ui/focus-cards'
import { Eyebrow, MaskLines, Reveal } from '@/components/ui/Reveal'

const ICONS: Record<ServiceIcon, ReactNode> = {
  install: <AirVent size={18} strokeWidth={1.75} />,
  preventive: <ShieldCheck size={18} strokeWidth={1.75} />,
  corrective: <Wrench size={18} strokeWidth={1.75} />,
  gas: <Gauge size={18} strokeWidth={1.75} />,
  electric: <PlugZap size={18} strokeWidth={1.75} />,
  sale: <ShoppingBag size={18} strokeWidth={1.75} />,
  infra: <Cable size={18} strokeWidth={1.75} />,
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
    <section id="servicos" className="section services surface-2" aria-labelledby="servicos-title">
      <div className="shell">
        <header className="section-head">
          <div>
            <Eyebrow>Serviços</Eyebrow>
            <MaskLines id="servicos-title" className="h2" lines={['Nossos serviços']} delay={0.08} />
          </div>
          <Reveal variant="fade" delay={0.25} className="section-head-aside">
            <p className="lead">
              Sete frentes de trabalho, da escolha do aparelho à manutenção, para residências e comércios.
            </p>
          </Reveal>
        </header>

        <FocusCards cards={cards} />

        <p className="services-note">
          <span aria-hidden="true">*</span> Imagens ilustrativas dos tipos de serviço. Os registros reais estão em
          Trabalhos.
        </p>
      </div>
    </section>
  )
}
