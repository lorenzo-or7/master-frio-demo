import { useCallback, useState } from 'react'
import Carousel from '@/components/ui/carousel'
import { gallery, slideData } from '@/data/site'
import { Eyebrow, MaskLines, Reveal } from '@/components/ui/Reveal'
import { Lightbox } from './Lightbox'

export function Projects() {
  const [open, setOpen] = useState<number | null>(null)
  const close = useCallback(() => setOpen(null), [])

  return (
    <section id="trabalhos" className="section projects surface-3" aria-labelledby="trabalhos-title">
      <div className="shell projects-head">
        <div>
          <Eyebrow>{gallery.eyebrow}</Eyebrow>
          <MaskLines id="trabalhos-title" className="h2" lines={[gallery.title]} delay={0.08} />
        </div>
        <Reveal variant="fade" delay={0.25}>
          <p className="lead projects-lead">{gallery.description}</p>
        </Reveal>
      </div>

      <Reveal delay={0.15} className="projects-stage">
        <Carousel slides={slideData} onOpen={setOpen} label="Fotos de trabalhos reais" />
      </Reveal>

      <Lightbox slides={slideData} index={open} onClose={close} onNavigate={setOpen} />
    </section>
  )
}
