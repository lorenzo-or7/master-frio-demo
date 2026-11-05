/**
 * Fonte única de conteúdo do protótipo Master Frio.
 *
 * DADOS PROVISÓRIOS (ver relatório):
 * - WhatsApp: (41) 99648-2334 é o número provisório da demo. Outras peças exibem
 *   (41) 99680-7443. Não confirmado pela empresa. Troque SOMENTE aqui.
 * - Nome comercial alternativo ("Soluções em Climatização") aguarda confirmação.
 * - CNPJ, endereço, tempo de experiência e preços NÃO são exibidos de propósito.
 */

/** Respeita o caminho-base do site (inclusive no GitHub Pages). */
const asset = (path: string): string => `${import.meta.env.BASE_URL}${path}`

export const brand = {
  /** Nome exibido na interface. */
  name: 'Master Frio Climatização',
  /** Variante vista em alguns materiais; só usar após confirmação. */
  altName: 'Master Frio Soluções em Climatização',
  short: 'Master Frio',
  descriptor: 'Climatização',
  coverage: 'Curitiba e região',
  icon: asset('assets/brand/master-frio-icone-aprovado.png'),
} as const

export const contact = {
  /** Número provisório — pendente de confirmação (conflito com 41 99680-7443). */
  whatsappDigits: '5541996482334',
  whatsappDisplay: '(41) 99648-2334',
  instagramHandle: '@masterfrio2026',
  instagramUrl: 'https://www.instagram.com/masterfrio2026/',
} as const

export const messages = {
  general: 'Olá! Conheci a Master Frio pelo protótipo do site e gostaria de solicitar um orçamento.',
  coverage: 'Olá! Gostaria de consultar a disponibilidade de atendimento para a minha região.',
  service: (service: string) =>
    `Olá! Gostaria de saber mais sobre o serviço de ${service} e solicitar um orçamento.`,
} as const

/** Monta o link do WhatsApp com a mensagem codificada. */
export const whatsappUrl = (message: string = messages.general) =>
  `https://wa.me/${contact.whatsappDigits}?text=${encodeURIComponent(message)}`

export const navLinks = [
  { id: 'inicio', label: 'Início' },
  { id: 'sobre', label: 'Sobre' },
  { id: 'servicos', label: 'Serviços' },
  { id: 'trabalhos', label: 'Trabalhos' },
  { id: 'contato', label: 'Contato' },
] as const

export const hero = {
  lines: ['Climatização de qualidade.', 'Conforto em todos os ambientes.'],
  support:
    'Instalação, manutenção e soluções em ar-condicionado para residências e comércios em Curitiba e região.',
  primaryCta: 'Solicitar orçamento',
  secondaryCta: 'Conhecer serviços',
  video: asset('assets/hero/master-frio-hero-loop.mp4'),
  poster: asset('assets/hero/master-frio-hero-poster.webp'),
} as const

export const about = {
  eyebrow: 'Sobre a Master Frio',
  title: 'Do dimensionamento à manutenção, tudo em um só lugar.',
  lead: 'Cada serviço é executado conforme as especificações técnicas do equipamento e as condições reais do ambiente.',
  paragraphs: [
    'Antes de indicar um aparelho ou começar uma instalação, a equipe avalia o espaço, a rede elétrica disponível e o uso que o ambiente vai ter. É isso que orienta a escolha do equipamento e o caminho da infraestrutura.',
    'Depois da instalação, o acompanhamento continua com manutenção preventiva e corretiva, para que o sistema siga funcionando bem em casas, lojas e escritórios.',
  ],
  marker: ['Residências', 'Comércios', 'Curitiba e região'],
  image: {
    src: asset('assets/gallery/02-execucao-em-campo.webp'),
    alt: 'Técnico trabalhando junto à parede, abaixo de várias unidades condensadoras alinhadas em suportes.',
    width: 1441,
    height: 1800,
  },
} as const

export type ServiceIcon =
  | 'install'
  | 'preventive'
  | 'corrective'
  | 'gas'
  | 'electric'
  | 'sale'
  | 'infra'

export interface Service {
  id: string
  title: string
  /** Nome usado na mensagem do WhatsApp ("o serviço de ..."). */
  messageName: string
  description: string
  src: string
  alt: string
  icon: ServiceIcon
  /** object-position da foto dentro da moldura. */
  position: string
  width: number
  height: number
  /** Algumas bases têm cantos arredondados embutidos; leve escala para escondê-los. */
  trimCorners?: boolean
}

/** Ordem aprovada da grade: 6 verticais (3×2) + 1 horizontal de largura total. */
export const services: Service[] = [
  {
    id: 'instalacao',
    title: 'Instalação de ar-condicionado',
    messageName: 'instalação de ar-condicionado',
    description: 'Instalação conforme o equipamento, o ambiente e as exigências técnicas de cada modelo.',
    src: asset('assets/services/01-instalacao.webp'),
    alt: '',
    icon: 'install',
    position: '50% 40%',
    width: 1086,
    height: 1448,
  },
  {
    id: 'preventiva',
    title: 'Manutenção preventiva',
    messageName: 'manutenção preventiva',
    description: 'Inspeção, limpeza e cuidados periódicos para preservar o funcionamento e reduzir falhas.',
    src: asset('assets/services/02-manutencao-preventiva.webp'),
    alt: '',
    icon: 'preventive',
    position: '50% 40%',
    width: 1086,
    height: 1448,
  },
  {
    id: 'corretiva',
    title: 'Manutenção corretiva',
    messageName: 'manutenção corretiva',
    description: 'Diagnóstico da falha e correção do que impede o aparelho de funcionar como deveria.',
    src: asset('assets/services/03-manutencao-corretiva.webp'),
    alt: '',
    icon: 'corrective',
    position: '50% 40%',
    width: 1086,
    height: 1448,
  },
  {
    id: 'recarga-gas',
    title: 'Recarga de gás refrigerante',
    messageName: 'recarga de gás refrigerante',
    description:
      'Avaliação técnica antes de qualquer recarga, verificando possíveis vazamentos e as características do equipamento.',
    src: asset('assets/services/04-recarga-gas.webp'),
    alt: '',
    icon: 'gas',
    position: '50% 40%',
    width: 1086,
    height: 1448,
  },
  {
    id: 'eletrica',
    title: 'Pequenos serviços de elétrica',
    messageName: 'pequenos serviços de elétrica',
    description: 'Pequenos ajustes e reparos elétricos ligados à instalação e ao funcionamento da climatização.',
    src: asset('assets/services/05-pequenos-servicos-eletrica.webp'),
    alt: '',
    icon: 'electric',
    position: '66% 50%',
    width: 1672,
    height: 941,
    trimCorners: true,
  },
  {
    id: 'venda',
    title: 'Venda de ar-condicionado',
    messageName: 'venda de ar-condicionado',
    description: 'Orientação na escolha do equipamento mais adequado ao tamanho e ao uso de cada ambiente.',
    src: asset('assets/services/06-venda-ar-condicionado.webp'),
    alt: '',
    icon: 'sale',
    position: '50% 40%',
    width: 1152,
    height: 1536,
  },
  {
    id: 'infraestrutura',
    title: 'Infraestrutura para climatização',
    messageName: 'infraestrutura para climatização',
    description:
      'Preparação e execução da infraestrutura necessária para receber o sistema: caminhos, suportes e passagens.',
    src: asset('assets/services/07-infraestrutura-horizontal.webp'),
    alt: '',
    icon: 'infra',
    position: '50% 45%',
    width: 1536,
    height: 1024,
    trimCorners: true,
  },
]

export interface Slide {
  title: string
  button: string
  src: string
  alt: string
  /** object-position para não cortar equipamento ou técnico. */
  position: string
  width: number
  height: number
}

/** Fotos reais da galeria (formato da API do Carousel Aceternity preservado). */
export const slideData: Slide[] = [
  {
    title: 'Fachada com unidades externas',
    button: 'Ver foto',
    src: asset('assets/gallery/01-fachada-comercial.webp'),
    alt: 'Duas unidades condensadoras instaladas em suportes na fachada de um prédio comercial.',
    position: '62% 60%',
    width: 1778,
    height: 1800,
  },
  {
    title: 'Instalação em campo',
    button: 'Ver foto',
    src: asset('assets/gallery/02-execucao-em-campo.webp'),
    alt: 'Técnico trabalhando abaixo de uma fileira de unidades condensadoras alinhadas na parede.',
    position: '50% 45%',
    width: 1441,
    height: 1800,
  },
  {
    title: 'Infraestrutura e tubulações',
    button: 'Ver foto',
    src: asset('assets/gallery/03-tubulacoes.webp'),
    alt: 'Duas tubulações com isolamento térmico fixadas na parede.',
    position: '50% 50%',
    width: 1800,
    height: 1239,
  },
  {
    title: 'Condensadoras em cobertura',
    button: 'Ver foto',
    src: asset('assets/gallery/04-condensadoras-cobertura.webp'),
    alt: 'Fileira de unidades condensadoras instaladas ao longo de uma cobertura externa.',
    position: '50% 50%',
    width: 1800,
    height: 1239,
  },
  {
    title: 'Equipamentos e preparação',
    button: 'Ver foto',
    src: asset('assets/gallery/05-equipamentos-ferramentas.webp'),
    alt: 'Unidades de ar-condicionado split, caixa de ferramentas e rolo de tubulação preparados para o serviço.',
    position: '45% 60%',
    width: 1800,
    height: 1239,
  },
]

export const gallery = {
  eyebrow: 'Trabalhos reais',
  title: 'Nosso trabalho, de perto.',
  description: 'Registros de instalações e infraestrutura executadas em campo.',
} as const

export const process = {
  eyebrow: 'Como trabalhamos',
  title: 'Critério técnico em cada etapa.',
  steps: [
    {
      title: 'Orientação sobre equipamento e ambiente',
      text: 'A indicação do aparelho considera o espaço, a forma de uso e as condições do local, para evitar escolhas que não atendem o ambiente.',
    },
    {
      title: 'Instalação e infraestrutura adequadas',
      text: 'Tubulação, suportes, drenagem e ligações seguem as exigências do equipamento, com acabamento organizado no local.',
    },
    {
      title: 'Manutenção e suporte conforme a necessidade',
      text: 'Preventiva para manter o sistema em dia e corretiva quando surge uma falha, sempre começando pelo diagnóstico.',
    },
  ],
} as const

export const coverage = {
  eyebrow: 'Área de atendimento',
  title: 'Curitiba e região.',
  text: 'Atendimento residencial e comercial. Para outros municípios, consulte a disponibilidade para a sua região.',
  cta: 'Consultar disponibilidade',
} as const

export const contactSection = {
  eyebrow: 'Contato',
  title: 'Seu conforto começa aqui.',
  text: 'Fale com a Master Frio e solicite um orçamento para o seu ambiente.',
  cta: 'Conversar no WhatsApp',
} as const

export const lanyard = {
  front: asset('assets/lanyard/card-front.png'),
  back: asset('assets/lanyard/card-back.png'),
  strap: asset('assets/lanyard/band.png'),
  frontAlt:
    'Crachá da Master Frio com o mascote boneco de neve de boné e uniforme azuis, segurando uma chave e um controle remoto.',
} as const

export const footer = {
  legal: '© 2026 Master Frio Climatização. Todos os direitos reservados.',
  credit: 'Protótipo demonstrativo desenvolvido por Or7.Dev',
  prototypeTag: 'Protótipo / demonstração',
  watermark: asset('assets/brand/or7-watermark.png'),
} as const
