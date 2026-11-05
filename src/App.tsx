import { FloatingNav } from '@/components/navigation/FloatingNav'
import { Hero } from '@/components/hero/Hero'
import { About } from '@/components/about/About'
import { Services } from '@/components/services/Services'
import { Projects } from '@/components/projects/Projects'
import { Process } from '@/components/process/Process'
import { Coverage } from '@/components/coverage/Coverage'
import { Contact } from '@/components/contact/Contact'
import { Footer } from '@/components/footer/Footer'

export default function App() {
  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <FloatingNav />
      <main id="conteudo" tabIndex={-1} className="outline-none">
        <Hero />
        <About />
        <Services />
        <Projects />
        <Process />
        <Coverage />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
