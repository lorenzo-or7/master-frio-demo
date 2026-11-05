import { useCallback, useState } from 'react'
import Carousel from '@/components/ui/carousel'
import { gallery, slideData } from '@/data/site'
import { Reveal } from '@/components/ui/Reveal'
import { Lightbox } from './Lightbox'

export function Projects() {
  const [open, setOpen] = useState<number | null>(null)
  const close = useCallback(() => setOpen(null), [])

  return (
    <section id="trabalhos" className="section projects" aria-labelledby="trabalhos-title">
      <div className="shell projects-head">
        <Reveal>
          <p className="eyebrow">{gallery.eyebrow}</p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 id="trabalhos-title" className="h2">
            {gallery.title}
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="lead projects-lead">{gallery.description}</p>
        </Reveal>
      </div>

      <Reveal delay={0.1} className="projects-stage">
        <Carousel slides={slideData} onOpen={setOpen} label="Fotos de trabalhos reais" />
      </Reveal>

      <Lightbox slides={slideData} index={open} onClose={close} onNavigate={setOpen} />
    </section>
  )
}
