# OR7 CREATIVE SYSTEM — PROMPT MESTRE DE IMPLEMENTAÇÃO
## MASTER FRIO CLIMATIZAÇÃO | PROTÓTIPO DEMONSTRATIVO PREMIUM
**Versão:** 1.0 — 05/11/2026  
**Destinatário:** Claude Code, execução LOCAL  
**Natureza:** site de demonstração de uma empresa real. NÃO é site oficial contratado, NÃO é anúncio da empresa e NÃO deve ir ao ar sem autorização expressa.

---

## 0. ORDEM PRINCIPAL — LEIA TUDO ANTES DE CODIFICAR

Você é responsável pela implementação end-to-end do protótipo **Master Frio Climatização**, respeitando integralmente o presente briefing e o pacote de assets fornecido. O objetivo é mostrar à empresa um website de altíssimo acabamento, com personalidade própria, experiência cinematográfica, excelente responsividade e microinterações naturais. **Não produza um website com aparência de template genérico ou gerado por IA.**

**Não peça decisões já tomadas. Não substitua componentes aprovados. Não altere arte, títulos, fotos e efeitos sem motivo técnico comprovado. Não crie funcionalidades não solicitadas. Não faça commit, push, publicação, deploy, domínio nem compra de serviços.** Entregue aplicação funcionando localmente, com relatório de implementação, testes executados e pendências reais.

Todas as diretrizes de Or7 Creative System, Humanizer, Impeccable, UI UX Pro Max, Web Design Guidelines e Taste devem ser utilizadas como **critérios de criação e revisão**, sem alegar que ferramentas/skills foram executadas se não o foram. Na dúvida: legibilidade, autenticidade, funcionalidade e desempenho vencem efeitos desnecessários.

**NÃO IGNORE:** algumas informações fornecidas por artes promocionais divergem. Trate como provisórias segundo a seção 2; não presuma confirmação comercial.

**Fonte dos assets:** use os arquivos no pacote `MASTER_FRIO_PACOTE_CLAUDE_CODE.zip`, onde os nomes indicados neste documento já estão padronizados. Extraia-os preservando a árvore de diretórios. Todos os caminhos iniciados com `/assets/` se referem ao conteúdo de `public/assets/` no app Vite.

---

## 1. STACK, ORGANIZAÇÃO E REGRAS TÉCNICAS

- **Base:** React + TypeScript + Vite.
- **Estilos:** Tailwind CSS 4 + CSS customizado organizado (variáveis/tokens). Não abusar de classes monolíticas.
- **Animações:** Motion (`motion/react`) para microinterações, foco, entrada, máscara e estado; GSAP + ScrollTrigger **apenas** para sequências cinematográficas que realmente exigem sincronização com scroll. Limpar animações/listeners corretamente no unmount. Evitar GSAP e Motion concorrendo sobre a mesma propriedade.
- **Componentes aprovados:** Floating Nav (referência visual 21st.dev), Focus Cards (Aceternity UI), Carousel (Aceternity UI), Lanyard (React Bits, com API fornecida), Frost Switch customizado.
- **Ícones:** lucide-react, somente ícones funcionais e consistentes; evitar emojis no produto final.
- **3D:** `three` exclusivamente para o Lanyard. Evitar aplicar WebGL ao resto do site.
- **Estrutura sugerida:** `src/components/{navigation,hero,about,services,projects,contact,footer,ui}`, `src/data/site.ts`, `src/styles/{fonts,tokens,global}.css`, `src/hooks/`, `src/utils/`, `public/assets/`.
- **Single-page** institucional; navegação interna via âncoras reais, sem router desnecessário.
- **Sem backend, autenticação, formulários que armazenem dados, chatbot de IA, agenda real ou APIs pagas.** O orçamento é redirecionamento explícito ao WhatsApp.
- Conferir versões atuais das dependências e documentação oficial antes de instalar. Se uma API de componente mudou, adaptar mantendo a interação aprovada e registrar mudança.
- Testes `npm run lint`, `npm run build`, `tsc --noEmit`; se houver infraestrutura, Playwright E2E (preferível). Não relatar um teste como executado se foi só uma inspeção estática.

### 1.1 Fontes

**Tipografia OFICIAL e única:** `Spline Sans`. Foi fornecida em ZIP com WOFF2, versão variável e licença OFL. Usar `public/assets/fonts/SplineSans-Variable.woff2` e `@font-face` com `font-weight: 300 700; font-display: swap;`.

- 300: pequenas indicações não críticas, sem sacrificar contraste.
- 400: parágrafos.
- 500: navegação, botões, rótulos.
- 600: subtítulos e cards.
- 700: títulos editoriais e hero.

Proibido substituir por Inter, Poppins, Montserrat, Arial como fonte visual do produto. Fallback de sistema apenas em caso de erro de carregamento da Spline Sans. Usar tracking cuidadosamente (headlines negativas moderadas; rótulos curtos podem ter tracking positivo). Headlines com quebras intencionais; nunca permitir linhas órfãs grotescas.

### 1.2 Tokens cromáticos aprovados

A identidade gira em torno de **azul profundo, azul elétrico e azul gelo**, inspirados nos materiais reais. Dois temas aprovados:

| Papel | Frozen Night (padrão) | Arctic Day |
|---|---|---|
| Fundo principal | `#07182F` | `#F4F8FC` |
| Fundo elevado | `#102B52` | `#FFFFFF` |
| Texto principal | `#F4F8FC` | `#07264B` |
| Texto secundário | `#B9CDE2` | `#435F79` |
| CTA fundo | `#0877CE` | `#0877CE` |
| CTA texto | `#FFFFFF` | `#FFFFFF` |
| CTA hover | `#075AA3` | `#075AA3` |
| Azul gelo decorativo | `#7DD4FF` | `#075AA3` |
| Divisor | `#22466C` | `#CEDDEA` |

Esses tokens são base, não convite para introduzir dezenas de novas cores. Regra fixa: **WCAG AA** texto normal >=4,5:1, texto grande >=3:1 e ícones/limites de controles importantes >=3:1. Contraste deve ser medido nas combinações reais, inclusive overlay de vídeo, hover, focus, disabled, modais e ambos os temas. A combinação branco sobre `#0877CE` foi escolhida para CTA; se surgir efeito/overlay que reduza contraste, corrija a combinação. Nunca aplicar texto azul-claro sobre fundo claro sem testar.

### 1.3 Identidade visual e autenticidade

Sensação: **engenharia precisa + frescor + confiança + visual editorial premium**. Evitar:

- gradientes aleatórios, glow/neon por toda a página, glassmorphism excessivo, blobs e partículas genéricas;
- ícones ilustrativos gigantes, carrosséis automáticos invasivos, frases vazias e números inventados;
- cinco cards com a mesma animação chamativa, textos surgindo letra por letra, delay gratuito;
- bordas grossas repetidas, sombra artificial pesada, excesso de pills, excesso de simetria e espaçamento idêntico em tudo;
- imagens ilustrativas geradas apresentadas como foto real de serviço executado.

Dê ritmo: seções com densidades visuais intencionais; hero imersiva, sobre editorial, serviços em cards, fotos reais em carousel, contato protagonizado pelo Lanyard, rodapé tipográfico escuro. Tratamento premium desktop **e** mobile, ambos desenhados deliberadamente.

---

## 2. CONTEÚDO OFICIAL, DADOS E PROVISÓRIOS

### 2.1 Informações disponíveis

**Marca exibida:** `Master Frio Climatização` (preferida na UI). Em alguns materiais também aparece `Master Frio Soluções em Climatização`; permitir ajuste num único arquivo `src/data/site.ts`, sem espalhar literais pelo projeto.

**Atendimento:** Curitiba e região; serviços residenciais e comerciais. Materiais adicionais mencionam Colombo, Região Metropolitana e litorais do Paraná/Santa Catarina. Exibir **Curitiba e região** como cobertura principal do protótipo; não prometer atendimento nas demais áreas sem confirmação.

**Instagram:** `@masterfrio2026` → https://www.instagram.com/masterfrio2026/.

**WhatsApp provisório para a demo:** `(41) 99648-2334` → `https://wa.me/5541996482334` (no código, centralizar em `src/data/site.ts`). **DADO EM CONFLITO:** outras peças exibem `(41) 99680-7443`. Não alternar números entre CTAs; não dizer “verificado”; incluir pendência explícita no relatório. Se a apresentação exigir canal incontestável, deixar demonstração de CTA configurável sem afirmar validade do contato.

**CNPJ informado nas peças:** `65.121.715/0001-48`. **Não exibir no protótipo inicial sem confirmação** de que corresponde à empresa e de que o cliente autoriza.

**Endereço visto em screenshot:** `Rua Monge Guido de Azevedo, 227`. **Não publicar mapa, marcador ou endereço** até confirmar com a empresa. O foco é site-demo; retirar mapa em vez de inventar precisão.

**Tempo de experiência:** screenshot dizia `5 anos`; **não colocar no site como fato enquanto não confirmado**. Se necessário, substituir por argumento neutro comprovável: “atendimento técnico para diferentes ambientes”.

**Preços/promos vistos em artes:** manutenção R$ 200 (antes R$ 250), instalação a partir de R$ 600. **Excluir da versão inicial**, pois validade e abrangência não foram confirmadas. Não usar contadores, avaliações, “clientes atendidos”, números de projetos, badges de garantia ou marcas atendidas sem lastro comprovado.

### 2.2 Serviços — lista definitiva de 7

Exatamente estes sete serviços, conforme material comercial da empresa:

1. **Venda de ar-condicionado** — orientação na escolha de equipamentos adequados a cada ambiente.
2. **Instalação de ar-condicionado** — instalação conforme equipamento, ambiente e exigências técnicas.
3. **Manutenção preventiva** — inspeção, limpeza e cuidados para preservar funcionamento e reduzir falhas.
4. **Manutenção corretiva** — diagnóstico e correção de falhas de funcionamento.
5. **Recarga de gás refrigerante** — avaliação técnica e procedimento quando necessário, considerando possíveis vazamentos e características do equipamento. **Não vender recarga como solução automática sem diagnóstico.**
6. **Pequenos serviços de elétrica** — pequenos ajustes e reparos elétricos relacionados aos serviços informados; evitar prometer instalações elétricas complexas.
7. **Infraestrutura para climatização** — preparação e execução de infraestrutura necessária à instalação dos sistemas.

Soluções residenciais/comerciais são contextos de atendimento, não mais dois cards de serviços. Não usar PMOC e consultoria como serviços confirmados.

### 2.3 Linguagem e textos

Tom: claro, confiável, humano, específico e comercial, sem hipérboles técnicas não demonstráveis. Não usar “revolucionamos o clima”, “solução 360º”, “excelência incomparável”, “nossa missão é...” e jargões redundantes.

**Hero H1 aprovado para trabalho editorial:**

> Climatização de qualidade.  
> Conforto em todos os ambientes.

**Hero supporting copy:**

> Instalação, manutenção e soluções em ar-condicionado para residências e comércios em Curitiba e região.

**Hero CTAs:** `Solicitar orçamento` (abre WhatsApp) e `Conhecer serviços` (âncora `#servicos`).

**Sobre:** usar o gancho `Do dimensionamento à manutenção, tudo em um só lugar.` e o texto técnico fornecido: `Cada serviço é executado conforme as especificações técnicas do equipamento e as condições reais do ambiente.` Complementar com dois parágrafos curtos, naturais, sem métricas não verificadas.

**Galeria:** selo `TRABALHOS REAIS`, título `Nosso trabalho, de perto.`, descrição `Registros de instalações e infraestrutura executadas em campo.` Sem afirmar cidade, data, cliente, tamanho ou resultado específico de cada foto.

**Contato:** `Seu conforto começa aqui.` + `Fale com a Master Frio e solicite um orçamento para o seu ambiente.` CTA `Conversar no WhatsApp`.

**Footer:** marca, links funcionais, Instagram, WhatsApp provisório, Curitiba e região e crédito Or7. Texto legal: `© 2026 Master Frio Climatização. Todos os direitos reservados.` Usar subtítulo alternativo de marca somente depois de confirmado.

**Mensagens WhatsApp neutras e inclusivas:**

- Hero/contato: `Olá! Conheci a Master Frio pelo protótipo do site e gostaria de solicitar um orçamento.`
- Card individual: `Olá! Gostaria de saber mais sobre o serviço de {serviço} e solicitar um orçamento.`
- Nunca terminar com “Obrigado”/“Obrigada” de forma fixa. Nunca adicionar emojis em excesso. Construir por `encodeURIComponent` e usar links seguros com `target="_blank"`, `rel="noopener noreferrer"`.

---

## 3. ESTRUTURA OBRIGATÓRIA DA PÁGINA

### Ordem

`Floating Nav` → `Hero Cinematográfica` → `Sobre` → `Nossos Serviços` → `Trabalhos Reais / Carousel` → `Diferenciais e Como Trabalhamos` → `Área de Atendimento` → `Contato / Lanyard` → `Rodapé Or7`.

Isso incorpora decisões anteriores sem criar áreas comerciais inventadas. A seção `Diferenciais e Como Trabalhamos` deve ser breve, baseada em procedimento técnico e profissionalismo; **não** criar cronograma, números, certificações ou promessas inventadas.

### 3.1 Floating Nav — opção 03 aprovada (21st.dev)

Referência de componentes: https://21st.dev/community/components/explore/floating-navigation-bar

**Não trocar por Resizable Navbar da Aceternity nem Pill Nav React Bits.** Queremos uma cápsula de navegação suspensa, sofisticada e compacta, que se mantém acessível durante a navegação. Usar a referência estética 21st.dev e adaptar código ao projeto, sem descaracterizar.

**Desktop >=1024px:** símbolo MF e nome curto à esquerda; links `Início`, `Sobre`, `Serviços`, `Trabalhos`, `Contato` organizados; Frost Switch pequeno; CTA `Orçamento` no extremo direito se houver espaço. Nav no topo, com gap lateral confortável e fundo opaco suficiente para contraste; transparência/blur discreto, nunca ilegível sobre o vídeo.

**Mobile <=767px:** botão MF + marca curta, botão de tema e botão de menu com rótulo acessível; menu aberto em painel com links, fechado ao selecionar link, Escape ou clique fora. Preserve CTA sempre acessível, mas não crie barra fixa cobrindo a hero ou o conteúdo. Safe-area do iOS, targets de 44px. Impedir scroll para âncoras ficarem ocultas atrás da navbar (`scroll-margin-top`).

**Inteligência na rolagem:** reduzir discretamente ocupação/contraste quando aplicável, manter legibilidade e não sumir sem recuperação rápida; se ocultar ao descer, reaparecer ao subir sem flicker. Ao cruzar fundo claro/escuro, corrigir cores da nav para WCAG AA de maneira determinística, não a cada frame com scripts pesados. Smooth-scroll respeitando reduced-motion. Focus visível.

### 3.2 Hero cinematográfica

**Arquivos:** `/assets/hero/master-frio-hero-loop.mp4`, `/assets/hero/master-frio-hero-poster.webp`.

- Hero com altura aproximada `100svh` em telas comuns, podendo crescer quando necessário para que textos e CTA não cortem. Fundo de vídeo sem UI de player.
- **Vídeo APROVADO:** começa com ar-condicionado desligado, liga, solta fluxo de ar, mantém um período ativo e desliga novamente. Arquivo de cerca de 10s, 1280×720. Loop contínuo, sem cortes artificiais. **Não fazer scrubbing do playback pelo scroll.**
- Poster estático representa o estado desligado e aparece imediatamente, inclusive se autoplay falhar. `video` com `muted`, `autoPlay`, `loop`, `playsInline`, `poster`; ocultar controles de player. Ouvir erro e promessas rejeitadas do `video.play()`, manter poster como fallback.
- **Prioridade da composição:** ar-condicionado no quadrante SUPERIOR DIREITO. Headline em bloco INFERIOR ESQUERDO, sem obstruir aparelho, marca e saída de ar. Overlay à esquerda e embaixo para legibilidade, nunca um filtro que apague a fotografia toda.
- No desktop testar object-position/cover para preservar aparelho e sofá; **no celular, composição art-directed**: preferir enquadramento que mantenha o aparelho visível. Se a filmagem horizontal ficar excessivamente cortada em retratos, use poster estático com enquadramento mobile, sem esticar mídia; não inventar outro vídeo.
- Hero não reinicia vídeo em cada scroll ou troca de tema. Pausar o vídeo fora da viewport via IntersectionObserver e retomar, se necessário e sem saltos perceptíveis. Com `prefers-reduced-motion: reduce`, usar poster estático como visual principal e não rodar fluxo animado automaticamente.
- Preload: renderizar poster e texto imediatamente; carregar vídeo progressivamente; exibir vídeo somente após frame disponível, transição imperceptível. Nada de tela de loading artificial, barra de progresso fake ou bloquear scroll.
- Text Mask Reveal por LINHAS (não por letra), discreto, 450–650ms de duração. CTA aparece junto/um instante após o título.
- Cinematic Scroll: zoom da cena **muito discreto** (`1 → ~1.04`), deslocamento pequeno, overlay aumenta gradualmente; página revela a seção Sobre no scroll nativo, sem scrolljack ou seção que prenda o visitante.

### 3.3 Sobre Master Frio

Layout editorial assimétrico, fotografia real principal à direita no desktop, bloco de texto à esquerda. No mobile fotografia antes ou depois do texto conforme melhor ritmo e sem ocultação. Foto REAL `/assets/gallery/02-execucao-em-campo.webp` (técnico em instalação) ou `/assets/gallery/01-fachada-comercial.webp`. Não usar fotos geradas de técnicos para alegar funcionários reais. Se uma foto reaparecer na galeria, evitar repetição visual explícita: usar enquadramento diferente com a mesma foto somente se boa qualidade, ou usar foto real `05-equipamentos-e-ferramentas.webp`.

Texto aprovado acima. Um marcador discreto `Residências · Comércios · Curitiba e região`. **Não** incluir `5 anos` até confirmar. Revelação fotográfica por máscara vertical e parallax de intensidade mínima (preferir transform GPU), sem clipes dramáticos.

### 3.4 Serviços — Focus Cards, layout aprovado

**Componente:** https://ui.aceternity.com/components/focus-cards  
**Instalação possível:** `npx shadcn@latest add @aceternity/focus-cards`; ver requisitos atuais e integrar com TypeScript/Tailwind 4.

**Layout fixado pelo usuário:** exatamente `3 cards na primeira linha`, `3 cards na segunda linha`, `1 card horizontal de largura total abaixo`. Desktop >=1024: `3 × 2 + full-width`. Tablet: 2 colunas com ordem inteligível e card horizontal final. Celular: 1 coluna com imagens verticais; último horizontal se adapta sem imagem espremida ou texto cortado.

**Ordem dos 6 verticais:**

1. Instalação — `/assets/services/01-instalacao.webp`
2. Manutenção preventiva — `/assets/services/02-manutencao-preventiva.webp`
3. Manutenção corretiva — `/assets/services/03-manutencao-corretiva.webp`
4. Recarga de gás — `/assets/services/04-recarga-gas.webp`
5. Pequenos serviços de elétrica — `/assets/services/05-pequenos-servicos-eletrica.webp` (imagem horizontal recortada cuidadosamente na viewport)
6. Venda de ar-condicionado — `/assets/services/06-venda-ar-condicionado.webp`

**Card horizontal final:**

7. Infraestrutura para climatização — `/assets/services/07-infraestrutura-horizontal.webp`

**CRÍTICO:** as imagens dos serviços são **bases fotográficas sem textos renderizados**. Título, descrição, ícone e ação devem ser DOM/React reais, com Spline Sans. **Não desenhar card inteiro como imagem.** Overlay gradiente somente na região inferior do card para manter o texto legível. Não inventar funcionários nas imagens; o card de venda usa equipamento sem pessoa.

**Regras do Focus Cards:**
- Hover/foco no card: card ativo nítido, zoom de imagem 1–3%, ícone/seta responde sutilmente; os demais recebem desfoque de **até 2–3px e opacidade moderada**. O texto dos demais nunca pode desaparecer ou ficar ilegível; se necessário, desfocar somente as FOTOS, não botões nem rótulos. Mouse sai => tudo normal.
- Teclado: `:focus-visible` ativa a mesma ênfase, sem deixar foco escondido; `Enter` executa ação e Escape tira o destaque quando aplicável.
- Mobile: não depender de hover. Foto e texto sempre visíveis. Toque pode destacar ou abrir CTA, mas sem exigir segundo toque ambíguo. Evitar que um gesto de scroll altere estado de card acidentalmente.
- Duração hover 280–380ms, easing natural, sem molas excessivas. Cards não giram nem saltam muitos pixels.
- Cada card tem descrição curta, diferente e factual, e ação `Solicitar orçamento` via WhatsApp com mensagem específica; título e links acessíveis.

### 3.5 Trabalhos reais — Carousel Aceternity UI

**Componente explicitamente aprovado:** https://ui.aceternity.com/components/carousel  
**Instalação possível:** `npx shadcn@latest add @aceternity/carousel`.

**Preservar o formato da API do exemplo fornecido pelo usuário**, salvo mudança na versão instalada:

```tsx
import Carousel from '@/components/ui/carousel';

const slideData = [
  { title: 'Fachada com unidades externas', button: 'Ver foto', src: '/assets/gallery/01-fachada-comercial.webp' },
  { title: 'Instalação em campo', button: 'Ver foto', src: '/assets/gallery/02-execucao-em-campo.webp' },
  { title: 'Infraestrutura e tubulações', button: 'Ver foto', src: '/assets/gallery/03-tubulacoes.webp' },
  { title: 'Condensadoras em cobertura', button: 'Ver foto', src: '/assets/gallery/04-condensadoras-cobertura.webp' },
  { title: 'Equipamentos e preparação', button: 'Ver foto', src: '/assets/gallery/05-equipamentos-ferramentas.webp' },
];
```

**Uso:** imagens REAIS fornecidas, nenhuma foto Unsplash. Foco em cards com animação de entrada/troca refinada, não em um bloco de imagens paradas. Navegação manual por setas, teclado e swipe no mobile; legenda curta. **Sem autoplay obrigatório** — preferir manual. Caso renderize botão `Ver foto`, ele precisa ABRIR lightbox/modal acessível com imagem ampliada e Escape/voltar; se o componente não oferecer, adaptar ou remover botão. Nunca deixar botão decorativo inerte.

Princípios: respeitar a proporção e o enquadramento da foto, prevenir crop que elimina equipamento/técnico, oferecer `object-position` específico, `alt` concreto sem inventar cenário, lazy-load imagens posteriores, placeholders de proporção estável, transições 450–600ms sem saltos. A imagem da fachada e a do técnico são retratos: evitar forçá-las em caixa 16:9 inadequada sem espaço/letterbox bem resolvido.

**5 imagens mapeadas e renomeadas** (já estão no pacote):
- `01-fachada-comercial.webp`: duas condensadoras instaladas na fachada de prédio comercial.
- `02-execucao-em-campo.webp`: técnico trabalhando sob várias condensadoras alinhadas.
- `03-tubulacoes.webp`: duas tubulações isoladas e fixadas em parede.
- `04-condensadoras-cobertura.webp`: fileira de condensadoras ao longo de cobertura externa.
- `05-equipamentos-ferramentas.webp`: equipamentos split e ferramentas preparados para serviço.

As versões de maior resolução estão em `referencias/galeria-8k/`, com **os mesmos índices**. Usar WebP no site, não JPG 8K como imagens iniciais (custo de rede e memória); manter 8K como matrizes de arquivo.

### 3.6 Diferenciais / Como Trabalhamos

Bloco curto e editorial. Título sugerido: `Do dimensionamento à manutenção, tudo em um só lugar.`. Três argumentos baseados nos materiais fornecidos: orientação técnica sobre equipamento/ambiente; instalação e infraestrutura adequadas; manutenção e suporte conforme necessidade. Layout tipográfico com números 01–03, linhas finas e microinteração de entrada. Evitar inventar “certificações”, “melhor preço garantido”, “atendimento 24h” ou prazos. Nada de mais uma grade de cards igual à de serviços.

### 3.7 Área de Atendimento

Seção compacta sobre Curitiba e região, sem mapa/endereço até confirmação. CTA `Consultar disponibilidade` via WhatsApp. Não citar Colombo/litorais como cobertura garantida sem validação; “consulte atendimento para a sua região” é aceitável. Pode ter detalhe gráfico abstrato da marca em SVG autoral (não mapa fake), ou fotografia real adequadamente identificada sem alegar localização.

### 3.8 Contato — Lanyard React Bits

**Componente aprovado:** https://reactbits.dev/components/lanyard

**Código fornecido pelo usuário** é a referência funcional: `import Lanyard from './Lanyard';` e uso:

```tsx
<div className="lanyard-region">
  <Lanyard
    frontImage="/assets/lanyard/card-front.png"
    backImage="/assets/lanyard/card-back.png"
    strapImage="/assets/lanyard/band.png"
    orientation="portrait"
    finish="glossy"
    metal="silver"
    strapColor="#075AA3"
    breeze={0.15}
    damping={0.72}
    elasticity={0.38}
    interactive
  />
</div>
```

**IMPORTANTE:** a implementação do Lanyard personalizada com THREE foi fornecida na conversa anterior. Se esse arquivo já existir no projeto, **preserve-o** e use o código anterior; se não existir, obtenha componente original público React Bits e adapte para suportar as props de imagens front/back/band + materiais e física aprovados. Não instalar uma versão que simplesmente ignore `frontImage`, `backImage`, `strapImage`. Registre a origem usada; sem dependência de backend.

**Arte frontal:** mascote oficial dentro de arte azul com bordas decorativas (`card-front.png`); a própria imagem é plana. **Não criar outra silhueta de crachá ou furo/desenho sobre ela**, pois a geometria 3D já faz isso. **Verso:** arte azul-gelo com QR/Instagram (`card-back.png`). **Cordão:** textura aprovada com marca MF (`band.png`). Preservar artes exatamente; só corrigir UV/orientação da textura caso os caracteres fiquem invertidos no objeto 3D, sem redesenhar o conteúdo.

No desktop: chamada/CTA à esquerda e Lanyard à direita. O crachá tem movimento físico leve e responde a arraste e clique/virada. Não deixar a corda atravessar título, navbar ou outras áreas. **Interatividade opcional em dispositivos touch:** não bloquear scroll vertical, permitir gesto sobre objeto apenas quando apropriado. Em mobile fraco, Safari sem WebGL ou reduced-motion: foto estática da frente + link explícito para Instagram e CTA WhatsApp, sem erro de console.

**QR do verso NÃO FOI VALIDADO PELO USUÁRIO**. Não afirmar que funciona. Não fazê-lo ser a única forma de acessar o Instagram: sempre disponibilizar link HTML ao perfil. O teste de leitura real do QR permanece pendência a reportar. Se falhar, não silencie; sinalize e ofereça reconstrução do QR usando biblioteca determinística, após confirmação.

**Three.js:** usar importação lazy/viewport, limitar pixel ratio conforme dispositivo e DPR, reduzir frames quando longe da tela, liberar geometrias/materiais/texturas/RAF no unmount; WebGL context failure => fallback. Evitar loop de render infinito quando o crachá está parado se possível.

### 3.9 Rodapé

**Direção aprovada:** `Frozen Editorial Footer`, sempre com identidade escura mesmo no tema claro, desde que transição não cause contraste deficiente. Logo/marca grande e limpa, colunas `Navegação`, `Serviços`, `Atendimento`; links reais e corretos. Pode usar uma headline gráfica `MASTER FRIO`, mas **não** competir com o CTA de contato.

**OBRIGATÓRIO:** incluir marca d’água em PNG Or7 fornecida (`/assets/brand/or7-watermark.png`) na faixa inferior direita com boa legibilidade, proporção preservada, tamanho discreto e sem filtros criativos. Se vier com fundo preto, usar a versão com transparência preparada no pacote ou tratá-la com cuidado; não recriar a assinatura com texto genérico. Não inserir outras assinaturas aleatórias.

Crédito: `Protótipo demonstrativo desenvolvido por Or7.Dev`. Não insinuar contratação oficial da Master Frio. Se necessário, posicionar `PROTÓTIPO / DEMONSTRAÇÃO` na faixa legal discretamente, sem badge flutuante permanente.

---

## 4. ASSET MANIFEST — NOMES EXATOS, NÃO TROCAR

Todos estes arquivos estão dentro de `public/assets/` do ZIP. Não referenciar arquivos antigos com nomes longos de geração ou nomes genéricos `image1.png`:

```text
public/assets/
  hero/
    master-frio-hero-loop.mp4
    master-frio-hero-poster.webp
    master-frio-hero-ativo-referencia.webp
  brand/
    master-frio-logo-aprovado-referencia.png
    master-frio-logo-original.jpg
    master-frio-icone-aprovado.png
    or7-watermark.png
    or7-watermark-original.png
  fonts/
    SplineSans-Variable.woff2
    OFL.txt
  services/
    01-instalacao.webp
    02-manutencao-preventiva.webp
    03-manutencao-corretiva.webp
    04-recarga-gas.webp
    05-pequenos-servicos-eletrica.webp
    06-venda-ar-condicionado.webp
    07-infraestrutura-horizontal.webp
  gallery/
    01-fachada-comercial.webp
    02-execucao-em-campo.webp
    03-tubulacoes.webp
    04-condensadoras-cobertura.webp
    05-equipamentos-ferramentas.webp
  lanyard/
    card-front.png
    card-back.png
    band.png
referencias/
  galeria-8k/
    01-fachada-comercial-8k.jpg
    02-execucao-em-campo-8k.jpg
    03-tubulacoes-8k.jpg
    04-condensadoras-cobertura-8k.jpg
    05-equipamentos-ferramentas-8k.jpg
```

**Nota específica do serviço 05:** `05-pequenos-servicos-eletrica.webp` é arte originalmente horizontal escolhida pelo usuário. Não esticar para ficar vertical: crop cuidadoso via `object-fit: cover`, usando `object-position`, em moldura 3:4 na grid e enquadramento horizontal em viewports que permitirem. **Nota do serviço 07:** usar imagem horizontal da infraestrutura no banner final; respeitar o formato full-width.

**Logo:** `master-frio-logo-aprovado-referencia.png` é uma prancha de identidade com variantes, NÃO um logotipo pronto para uso direto em `<img>` na nav. `master-frio-icone-aprovado.png` já é um recorte do símbolo aprovado e pode ser usado na navbar ao lado de lettering HTML em Spline Sans com alinhamento fino. Se optar por lockup completo, extraia-o da prancha sem incluir molduras, rótulos ou fundo da apresentação. `master-frio-logo-original.jpg` é referência de origem da marca/mascote. Não usar o quadro inteiro na navbar; não distorcer ou pixelar.

---

## 5. SISTEMA DE ANIMAÇÕES — OITO DECISÕES APROVADAS

**1. Cinematic Scroll:** hero com escala/overlay sutis, não scroll-jacking. `GSAP + ScrollTrigger` só se necessário para controle de progresso. Pequenos valores, scrub muito suave, remover no reduced-motion.

**2. Text Mask Reveal:** linhas de headline em máscara com clip, não letras independentes. Sequência curta, sem atraso excessivo.

**3. Focus Cards refinado:** desfoque dos outros, zoom sutil da imagem ativa, texto legível, retorno suave.

**4. Image Reveal:** fotos editoriais reveladas ao entrar na viewport, apenas 1 vez; sem desaparecer quando usuário sobe a página.

**5. Floating Navbar inteligente:** estado e contraste conforme fundo; sem flicker; fluxo de foco preservado.

**6. Lanyard Physics:** física natural com amortecimento, arraste intuitivo, sem vento constante exagerado.

**7. Frost Switch Morph:** transição suave entre sol/lua (260–420ms) e cores do site (aprox. 200–280ms), sem flash branco/preto.

**8. Footer Reveal:** tipografia grande entra discretamente quando visível; sem se tornar obstáculo no scroll.

**Easing:** preferir `cubic-bezier(0.22, 1, 0.36, 1)` em reveal e `cubic-bezier(0.2, 0.8, 0.2, 1)` em interações leves; se usar mola, alto damping e baixa amplitude. Duração típica `280–650ms`, exceção scroll progressivo. Orquestrar para nunca disparar todos os componentes ao mesmo tempo na inicialização. Evitar animar `width`, `height`, `top`, `left` por frame; usar `transform`/`opacity` e `will-change` apenas durante movimento. A imagem continua legível e a interface acessível antes das animações.

**Testes obrigatórios:** scroll lento, rápido, trackpad, touch, alternância de tema no meio da página, retorno ao topo, mudança de aba, resize, orientação mobile. `prefers-reduced-motion` deve remover/paralisar movimentos não essenciais, **inclusive vídeo e física do crachá**, não apenas encurtar todas as durações para 0 causando saltos.

---

## 6. FROST SWITCH — OPÇÃO 01 OFICIAL

**Dois temas aprovados:** `Frozen Night` (padrão inicial) e `Arctic Day`.

O controle é uma cápsula compacta, com ícones **sol e lua** e um indicador deslizante; integrado à Floating Nav. **Não usar Celestial Switch, Eclipse Reveal, Crystal Morph, Arctic Segmented** nem outro tipo. O active state deve ser inequívoco e atender contraste AA. Implementar como botão/toggle semanticamente acessível, label dinâmico (`Ativar tema claro` / `Ativar tema escuro`), foco visível e interação por teclado. Salvar preferência em `localStorage` e aplicá-la antes da hidratação/pintura do React para impedir flash de tema (FOUC). Na ausência de preferência salva, iniciar **Frozen Night**, conforme aprovado. A Hero usa o mesmo vídeo nos dois temas; trocar apenas superfícies/tokens.

---

## 7. RESPONSIVIDADE — EXIGÊNCIA DE ACABAMENTO PREMIUM

**Pensar desktop e mobile como composições próprias, não como desktop comprimido.**

Breakpoints de referência (ajustar segundo conteúdo, não rigidamente):
- 320–359px: smartphones pequenos; garantir zero overflow e textos com respiro.
- 360–389px: Android comuns.
- 390–430px: iPhones recentes / celulares populares.
- 431–767px: celulares largos.
- 768–1023px: tablets/retratos.
- 1024–1439px: notebooks.
- 1440–1920px+: desktops, evitar linhas infinitas e fotos esticadas.

**Matriz mínima de verificações por viewport:** `320×568`, `360×800`, `375×667`, `390×844`, `393×852`, `412×915`, `430×932`, `768×1024`, `1024×768`, `1280×800`, `1440×900`, `1920×1080`. Conferir também zoom 200%, orientação landscape de telefone, safe-area/notch, menu mobile aberto, teclado virtual e modo reduced-motion.

**Navegadores alvo:** Chrome e Edge desktop; Safari em iOS (ou emulação/teste físico disponível); Chrome Android e Samsung Internet quando acessível. Não declarar aparelhos físicos testados se apenas usou emulação.

Critérios:
- nenhuma rolagem horizontal involuntária;
- nenhuma cabeça, ar-condicionado, unidade externa, legenda ou botão importante fora da tela;
- CTA com mínimo de 44×44 CSS px preferencialmente; espaçamento adequado entre alvos;
- navbar respeita safe-area e não cobre título/menu;
- fontes fluidas com `clamp()` e largura de leitura adequada;
- imagens com `aspect-ratio` e `object-position` por tipo;
- focus/hover não geram layout shift;
- menu fecha com teclado e respeita foco;
- reduced-motion oferece fluxo completo e sem dependência de animação;
- o Carousel permite swipe sem quebrar scroll;
- o Lanyard não bloqueia o scroll vertical nem captura gestos indevidos.

---

## 8. DESEMPENHO E SEO DEMONSTRATIVO

- **LCP, CLS, INP:** otimizar como site profissional; metas orientativas em condições de laboratório: LCP <=2,5s, CLS <=0,1, INP <=200ms (se houver interação), sem afirmar cumprimento antes de medir.
- Fontes locais WOFF2; incluir apenas arquivos necessários, preload com cautela.
- Imagens de galeria WebP leves; `loading="lazy"` abaixo da dobra; `decoding="async"`; dimensões/ratio fixos; Hero poster com prioridade.
- Vídeo hero MP4 fornecido com `muted`, `playsInline`, `poster`; avaliar compressão e alternativa WebM somente se não introduzir artefatos. Nunca reencodar de modo a destruir sequência aprovado. Não carregar os arquivos JPG 8K na interface inicial.
- Componentes 3D carregados **apenas quando a seção Contato estiver próxima da viewport**; fallback estático sempre acessível.
- Evitar dezenas de listeners de scroll; utilizar IntersectionObserver; otimizar resize e transform.
- `title`, `description`, metadados OpenGraph simples; descrição sem alegações não confirmadas. Como é PROTÓTIPO, **`noindex,nofollow`** por padrão, até autorização específica para publicação oficial.
- Não publicar dados pessoais de clientes, fotos de serviço com informações sensíveis ou geolocalização precisa não autorizada.

---

## 9. ACESSIBILIDADE E FUNCIONALIDADE

Aplicar WCAG 2.2 AA **como meta verificável**, com registros de testes. Sem prometer conformidade absoluta sem auditoria. Semântica `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`; exatamente um `<h1>`; heading hierarchy correta; idioma `pt-BR`; links com textos específicos; descrições `alt` reais; foco visível; não excluir outline sem alternativa; campos decorativos `aria-hidden`; landmarks testáveis.

Fluxos a testar:
1. Abrir menu mobile, navegar para serviços, fechar menu, voltar ao topo.
2. Alternar Frost Switch e persistir tema após reload.
3. Clicar em cada um dos 7 serviços e validar mensagem correspondente do WhatsApp.
4. Navegar Carousel com seta/teclado/swipe, abrir foto se houver `Ver foto`, fechar com Esc.
5. Rotacionar/arrastar Lanyard no desktop sem bloquear outros links; fallback se WebGL indisponível.
6. Abrir Instagram por link sem depender do QR.
7. Carregar Hero em rede lenta, autoplay bloqueado e reduced-motion.
8. Usar Tab/Shift+Tab em todos os CTAs sem foco preso/invisível.
9. Verificar contraste em todos os estados em ambos os temas.

Não usar texto de botão `Saiba mais` se não há ação real. Nenhum botão placeholder. Links externos abrem destino válido, com segurança.

---

## 10. ORDEM DE EXECUÇÃO (SEM PEDIR AUTORIZAÇÕES EXTRAS)

**Etapa A — Auditoria de assets:** conferir existência, dimensões, proporção, integridade e uso de cada arquivo do manifesto. Registrar ausências reais, sem inventar arquivo. Conferir primeiro e último frame do vídeo; comparar com poster. Mapear todos os nomes.

**Etapa B — Scaffold:** criar app Vite + React + TS + Tailwind 4 com fontes, tokens, dados centralizados, CSS base, tema persistente, SEO de demo, lint/build.

**Etapa C — Estrutura estática:** montar seções e todos os CTAs funcionais, com layout desktop/mobile e copy fiel. Validar contraste básico.

**Etapa D — Interações oficiais:** Floating Nav, Frost Switch, Focus Cards, Carousel, Lanyard (usando código fornecido ou original atual adaptado). Nada de “aproximações com divs” fingindo física ou carrossel.

**Etapa E — Cinematic Motion:** aplicar as 8 animações aprovadas, com duração/easing consistentes e fallback de reduced-motion. Só depois do layout estar sólido.

**Etapa F — Otimização:** performance, mídia responsiva, lazy-load, teste de overflow e de falhas de vídeo/WebGL, links, console.

**Etapa G — QA e relatório:** executar build/lint/typecheck; testes E2E quando possível; screenshots por breakpoint; indicar exatamente os problemas corrigidos, os ainda presentes e testes não realizados. Não declarar “100% responsivo” por aparência apenas.

**NÃO FAZER:** commit, push, deploy, hospedagem, publicação ou alterações em repositórios externos sem autorização do proprietário.

---

## 11. CRITÉRIOS DE ACEITE — NÃO ENCERRAR COM SITE INCOMPLETO

- [ ] Site renderiza localmente com comando claro e build sem erro.
- [ ] Spline Sans é usada de verdade em hero, navbar, cards, textos e botões.
- [ ] Frozen Night / Arctic Day com Frost Switch aprovado, tema persistente e sem flashes.
- [ ] Hero usa vídeo `master-frio-hero-loop.mp4` e poster desligado; câmera/AC visíveis e texto inferior esquerdo.
- [ ] Floating Nav 21st.dev segue opção 03; funciona com teclado e no mobile.
- [ ] Serviços exibem **seis verticais 3×2 + um horizontal abaixo**, com as imagens e nomes do manifesto; CTA de cada um funciona.
- [ ] Focus Cards desfoca as FOTOS dos outros sem esconder texto/CTA e funciona com foco teclado.
- [ ] Carousel Aceternity usa **as cinco fotos reais** e seus nomes; transições suaves; setas/swipe e lightbox se botão existir.
- [ ] Lanyard React Bits/Three usa frente, verso e fita aprovados; arraste, flip e fallback estático.
- [ ] Rodapé contém PNG original da assinatura Or7 preservada.
- [ ] Design consistente, sem cara genérica, animações 01–08 e reduced-motion.
- [ ] Responsivo nos breakpoints definidos, zero overflow e foco visível.
- [ ] Nenhuma métrica, preço, testemunho, certificação, avaliação ou endereço inventados.
- [ ] Número provisório do WhatsApp e pendência documentados, sem dois números conflitantes na UI.
- [ ] QR pendente de teste **não** é anunciado como validado; Instagram tem link direto.
- [ ] `noindex,nofollow` e identificação discreta de protótipo; nenhum deploy ou push.

---

## 12. RELATÓRIO DE SAÍDA EXIGIDO AO CLAUDE CODE

Depois de implementar, apresente:

1. Arquivos criados/alterados, dependências e origem de cada componente de terceiros.
2. Comandos exatos para rodar localmente (`npm install`, `npm run dev`, `npm run build`).
3. Matriz de seções e funcionalidades verificadas, distinguindo **implementado**, **testado** e **não testado**.
4. Resultado de `lint`, `typecheck`, `build` e testes de navegador; registrar erros restantes.
5. Screenshots desktop/mobile (ou caminhos) e observações de UX/contraste/performance.
6. Tabela com presença de cada asset e mapeamento de uso.
7. Pendências de negócio: confirmação do WhatsApp correto `(41) 99648-2334` vs `(41) 99680-7443`; nome comercial; 5 anos; endereço; CNPJ; promoções; QR code; autorização de uso das fotos.
8. Confirmação explícita de que **nenhum commit/push/deploy** ocorreu.

**Critério editorial final:** um visitante deve perceber marca própria, fotografia forte, organização técnica, interação relevante e confiança. Nenhum efeito deve existir apenas para “parecer moderno”. Entre impressionar e atrapalhar, impressione mantendo a interface útil.

**EXECUTE AGORA A IMPLEMENTAÇÃO LOCAL INTEGRAL, usando o pacote de assets entregue e respeitando todos os itens acima.**
