# Master Frio Climatização · Relatório de implementação do protótipo

Data: 05/11/2026 · Execução local · **Nenhum commit, push, deploy ou publicação foi feito.** A pasta nem é um repositório git.

## Como rodar

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # tsc -b + vite build → dist/
npm run preview    # http://localhost:4173 (serve o build)
npm run lint       # oxlint
npm run typecheck  # tsc -b
npm run test:e2e   # Playwright (usa o Google Chrome instalado; faz build e sobe o preview sozinho)
```

Scripts de apoio: `node scripts/shots.mjs <url> <prefixo> 390x844 1440x900 [--full] [--theme=day] [--reduced]` (capturas + medição de overflow) e `node scripts/hero-contrast.mjs <url>` (contraste real do texto da hero sobre o vídeo).

---

## 1. Implementação

Stack: Vite 8 + React 19 + TypeScript 7 + Tailwind CSS 4 (+ CSS de tokens/componentes), Motion 14 (`motion/react`), GSAP 3.15 + ScrollTrigger (só no scroll da hero), three 0.187 (só no Lanyard), lucide-react 1.69.

| Seção | O que foi feito |
|---|---|
| Floating Nav (opção 03) | Cápsula suspensa adaptada da referência 21st.dev. Tom determinístico via IntersectionObserver (fica escura sobre a hero e o rodapé), some ao descer e volta ao subir (com histerese), continua visível durante saltos para âncora, marcador da seção ativa, `scroll-margin-top`, safe-area. Mobile/tablet: menu em painel com fechamento por link, Escape (devolve o foco) e clique fora. |
| Frost Switch (opção 01) | Cápsula com sol/lua e indicador deslizante (340 ms), rótulo dinâmico "Ativar tema claro/escuro", `localStorage` aplicado por script inline **antes da pintura** (sem flash), transição de cores de 240 ms só durante a troca. Padrão: Frozen Night. |
| Hero | Poster imediato (`fetchpriority=high`) e vídeo aprovado carregado depois do `load` (não carrega com reduced-motion nem com economia de dados). Fallback se o autoplay falhar, pausa fora da viewport sem reiniciar, botão pausar/reproduzir (WCAG 2.2.2). Reveal por linhas (600 ms) e zoom de scroll 1→1.04 com GSAP scrub, sem pin. Celular e tablet em retrato têm composição própria: cena no topo com o aparelho inteiro e texto abaixo. |
| Sobre | Layout assimétrico (texto 6/12, foto 5/12), revelação por máscara vertical uma única vez, parallax de ±3% (transform). A foto real 02 aparece com recorte diferente do da galeria. Marcador "Residências · Comércios · Curitiba e região". |
| Serviços (Focus Cards) | 3×2 + 1 horizontal no desktop, 2 colunas + horizontal no tablet, 1 coluna no celular. Texto, ícone e CTA são DOM em Spline Sans. Só as fotos dos outros cards perdem foco (blur 2.5px, opacidade 0.55). Ativa por mouse e por foco de teclado; Escape tira o destaque; toque não altera estado. Card inteiro clicável (link esticado) com mensagem de WhatsApp específica. |
| Trabalhos (Carousel) | 5 fotos reais com `object-position` por foto, setas, teclado (←/→/Home/End), swipe (`touch-action: pan-y`), sem autoplay. "Ver foto" abre um lightbox em `<dialog>` com Escape, voltar do navegador e navegação interna. |
| Como trabalhamos | Três passos numerados 01–03 com linhas finas que se desenham uma vez. Nenhum número, prazo ou certificação inventados. |
| Área de atendimento | Bloco compacto, CTA "Consultar disponibilidade" e gráfico SVG autoral de anéis de fluxo de ar (não é mapa). Sem endereço. |
| Contato / Lanyard | Lanyard three.js carregado só quando a seção está a 600 px da viewport (chunk separado). Arraste, clique/toque para virar e um botão "Virar crachá" acessível por teclado. No toque, o scroll vertical não é bloqueado. Sem WebGL, com reduced-motion ou em aparelho fraco: crachá estático + link do Instagram. A linha de ferramentas tem altura fixa para não causar layout shift. |
| Rodapé | Sempre escuro. Colunas Navegação/Serviços/Atendimento com links reais, marca gráfica "MASTER FRIO" em SVG decorativo, faixa legal com "Protótipo / demonstração", crédito Or7.Dev e o PNG `or7-watermark.png` original (só a margem transparente é recortada, proporção preservada). |
| SEO de demo | `title`, `description`, OpenGraph simples, `robots`/`googlebot` = `noindex, nofollow`, `lang="pt-BR"`, `theme-color` por tema. |

### Origem dos componentes de terceiros

| Componente | Origem | Adaptações registradas no topo do arquivo |
|---|---|---|
| `src/components/ui/focus-cards.tsx` | Registry Aceternity UI `focus-cards` (baixado em 05/11/2026) | Desfoque só nas fotos, texto sempre visível, foco de teclado/Escape, layout 3×2+1, CTA por card. |
| `src/components/ui/carousel.tsx` | Registry Aceternity UI `carousel` | API `slides={slideData}` preservada. Tabler → lucide (sem nova dependência), sem rAF contínuo, lightbox real, teclado/swipe, lista HTML válida (o original tinha `div` entre `ul` e `li`, apontado pelo axe), ARIA de carrossel. |
| `src/components/contact/Lanyard.tsx` | React Bits (github.com/DavidHDev/react-bits, `ts-tailwind/Components/Lanyard`), three.js puro, API idêntica à do briefing | Cartão 3:4 igual às artes, fita vertical desenhada sem rotação e com as margens brancas recortadas automaticamente (só orientação/UV), `touchScroll`, `maxPixelRatio`, `onUnsupported` (fallback), `flipSignal` (botão acessível). |
| Floating Nav / Frost Switch | Escritos para o projeto a partir da referência estética 21st.dev e da opção 01 aprovada | — |

Não havia `Lanyard.tsx` anterior no projeto: o pacote recebido não continha o arquivo citado como "fornecido na conversa anterior". Por isso foi usada a versão pública atual do React Bits, que aceita `frontImage`, `backImage` e `strapImage`.

### Arquivos criados

`index.html`, `package.json`, `vite.config.ts`, `tsconfig*.json`, `.oxlintrc.json`, `.gitignore`, `playwright.config.ts`, `.claude/launch.json`, `src/main.tsx`, `src/App.tsx`, `src/data/site.ts`, `src/styles/{fonts,tokens,global,components}.css`, `src/hooks/{useTheme,useMediaQuery}.ts`, `src/lib/utils.ts`, `src/components/{navigation/FloatingNav, hero/Hero, about/About, services/Services, projects/{Projects,Lightbox}, process/Process, coverage/Coverage, contact/{Contact,Lanyard}, footer/Footer, ui/{BrandMark,FrostSwitch,Reveal,icons,focus-cards,carousel}}.tsx`, `e2e/site.spec.ts`, `scripts/{shots,hero-contrast}.mjs`. Nenhum asset de `public/assets/` foi alterado.

---

## 2. Resultados verificados

| Verificação | Resultado |
|---|---|
| `npm run typecheck` (tsc -b) | ✅ 0 erros |
| `npm run lint` (oxlint) | ✅ 0 erros · 2 avisos, ambos no código original do React Bits (`Lanyard.tsx`: padrão "latest ref" `settingsRef.current = …` e flag `alive` no cleanup). Mantidos para não alterar o componente além do necessário. |
| `npm run build` | ✅ Build ok. JS principal 555 kB (186 kB gzip), Lanyard + three em chunk lazy de 593 kB (152 kB gzip), CSS 37 kB. O Vite avisa sobre chunks acima de 500 kB (aviso, não erro). |
| `npm run test:e2e` (Playwright 1.65 + Chrome do sistema + axe-core) | ✅ **38/38 passando** contra o build de produção |

O que os 38 testes E2E cobrem (todos rodados de fato):
- Um único `h1`, `pt-BR`, `noindex,nofollow`, ordem das seções, crédito Or7 e PNG da marca d'água.
- Spline Sans carregada e aplicada em h1, nav, botões e parágrafos.
- Ausência de 99680-7443, CNPJ, endereço, "5 anos", "R$" e PMOC no texto da página.
- Todos os 11+ links de WhatsApp usam o mesmo número, abrem em nova aba com `rel="noopener noreferrer"` e nenhuma mensagem termina em "Obrigado/a". Os 7 serviços geram a mensagem exata esperada.
- Instagram por link direto, independente do QR.
- Âncoras: no desktop e no menu mobile a seção para logo abaixo da nav. Menu mobile fecha ao escolher link, com Escape (foco volta ao botão) e com clique fora; alvos de toque ≥ 44 px.
- Tema alterna, persiste após reload e não rola a página quando trocado no meio dela.
- Focus Cards: layout 3×2+1 medido; hover desfoca só as fotos (título com `filter: none` e opacidade 1); foco de teclado ativa o card e Escape limpa.
- Carousel: as 5 fotos na ordem certa, setas, teclado, swipe por pointer de toque. Lightbox abre com foco em "Fechar", a foto cabe na tela, fecha com Escape e com o voltar do navegador.
- Hero: vídeo aprovado toca muted/loop/playsInline sem controles, pausa e retoma fora da viewport sem reiniciar, respeita a pausa do visitante; com autoplay bloqueado o poster fica e não há erro.
- Reduced motion: sem vídeo automático, crachá estático, links visíveis e o visitante ainda pode reproduzir o vídeo.
- Lanyard: `card-front/back/band.png` só são baixados perto da seção; arraste de mouse real; botão de virar; links ao lado continuam clicáveis. Sem WebGL: fallback estático sem erro no console.
- Zero overflow horizontal ao percorrer a página inteira em 13 viewports (320×568, 360×800, 375×667, 390×844, 393×852, 412×915, 430×932, 768×1024, 1024×768, 1280×800, 1440×900, 1920×1080, 844×390). CTA da hero ≥ 44 px e nav dentro da tela em todas.
- axe-core (WCAG 2.0/2.1/2.2 A e AA) sem violações nos dois temas. A hero foi excluída da análise automática porque o vídeo de fundo impede o cálculo; o contraste dela foi medido à parte (abaixo).
- Tab percorre toda a página com foco visível em todos os elementos e volta ao navegador no fim (sem armadilha de foco).

**Contraste da hero medido sobre o vídeo real** (`scripts/hero-contrast.mjs`): o pior pixel (percentil 98) atrás de cada bloco de texto, em 5 instantes do vídeo (0.5 a 8.5 s):

| Viewport | Título linha 1 (≥3:1) | Título linha 2 (≥3:1) | Texto de apoio (≥4,5:1) |
|---|---|---|---|
| 1440×900 | 5.65 | 5.40 | 9.42 |
| 1024×768 | 4.29 | 4.80 | 7.28 |
| 390×844 | 14.11 | 10.82 | 10.92 |
| 844×390 | 14.39 | 9.46 | 9.52 |

A primeira medição reprovou o celular deitado (1,97:1 e 3,64:1, porque o fluxo de ar azul passava atrás do texto). O overlay e a largura do texto dessa composição foram ajustados.

**Tokens** (combinações reais): texto/fundo 16.67 (night) e 14.18 (day); secundário 10.92 / 6.24; gelo 10.78 / 6.56; CTA branco sobre #0877CE 4.63 e no hover 7.00; foco 10.78 / 6.56. O divisor #22466C tem 1.83:1, mas é uma linha decorativa.

**Asset audit:** os 26 arquivos de `public/assets/` batem com o SHA-256 do manifesto. O vídeo tem 10,03 s em 1280×720. A diferença de hash em `LEIA_PRIMEIRO.md` (2067 contra 2031 bytes) é compatível com conversão de fim de linha.

### Problemas encontrados e corrigidos durante o QA

1. `.btn` sobrescrevia `.nav-cta { display:none }`, o que estourava a nav no celular (botão de menu terminava em x=414 numa tela de 390).
2. Os cards de serviço com `aspect-ratio` e `min-height` geravam 4 px de overflow em 320 px.
3. A barra do Lanyard aparecia só depois do 3D carregar, causando layout shift de 56 px.
4. `scroll-padding-top` somado a `scroll-margin-top` deixava as âncoras 88 px abaixo do esperado.
5. A imagem do lightbox estourava a tela.
6. Lista inválida no Carousel original (apontada pelo axe).
7. Contraste da marca gráfica do rodapé (agora é SVG decorativo).
8. Contraste da hero no celular deitado.
9. Título da hero grande demais no desktop, invadindo a área do aparelho.
10. Aparelho cortado no tablet em retrato.
11. Botão de pausa sobre o título no celular.
12. Recorte errado da assinatura Or7.

### Mapa de assets

| Asset | Uso |
|---|---|
| hero/master-frio-hero-loop.mp4 | Vídeo da hero |
| hero/master-frio-hero-poster.webp | Poster/LCP, fallback, OpenGraph |
| hero/master-frio-hero-ativo-referencia.webp | Não usado (referência) |
| brand/master-frio-icone-aprovado.png | Símbolo na nav e no rodapé (recortado por CSS) + favicon |
| brand/master-frio-logo-aprovado-referencia.png, master-frio-logo-original.jpg | Não usados (prancha/referência, conforme o briefing) |
| brand/or7-watermark.png | Rodapé |
| brand/or7-watermark-original.png | Não usado. Atenção: é um JPEG com extensão .png |
| fonts/SplineSans-Variable.woff2 (+ OFL.txt) | Fonte única, com preload |
| services/01 a 07 | Focus Cards (05 e 07 com escala leve para esconder os cantos arredondados embutidos) |
| gallery/01 a 05 | Carousel + lightbox. A foto 02 também aparece no Sobre, com outro recorte |
| lanyard/card-front.png, card-back.png, band.png | Lanyard 3D. A frente e a fita também aparecem no fallback estático |
| referencias/galeria-8k/*.jpg | Ausentes no pacote leve (o LEIA_PRIMEIRO avisa que foram omitidos). Não são usados no site |

---

## 3. Pendências

### Não testado
- **Aparelhos físicos:** nenhum (iOS Safari, Chrome Android, Samsung Internet). Toda a responsividade foi verificada por emulação de viewport no Chrome desktop. O comportamento de toque foi simulado com eventos sintéticos.
- **Navegadores:** só o Chrome foi automatizado. Edge e Safari não foram testados.
- **Zoom de 200%, teclado virtual e notch real:** não testados (o código usa `viewport-fit=cover` e `env(safe-area-inset-*)`, mas isso não foi validado em aparelho).
- **Rede lenta:** sem throttling. **LCP, CLS e INP não foram medidos** com Lighthouse/Web Vitals, então não afirmo que as metas são cumpridas. Corrigi um layout shift real que encontrei (item 3 acima).
- **Leitor de tela real** (NVDA/VoiceOver): não testado. Houve apenas axe e inspeção de semântica/ARIA.
- **Trackpad e alternância de aba:** sem teste dedicado (o vídeo pausa via IntersectionObserver e o Lanyard para fora da viewport).

### Decisões e divergências registradas
- **Hero sempre escura nos dois temas:** o vídeo é escuro e o texto fica sobre overlay escuro, então trocar a superfície no tema claro reduziria o contraste.
- O título de "Como trabalhamos" virou **"Critério técnico em cada etapa."** porque o título sugerido repetia literalmente o gancho já usado em "Sobre".
- A legenda **"Imagens ilustrativas dos tipos de serviço."** foi colocada em Serviços para não apresentar imagens geradas como fotos de serviços executados.
- O Lanyard mantém `breeze={0.15}` (valor aprovado). Com brisa, o loop de render não para sozinho enquanto o crachá está visível. Ele pausa fora da viewport, com aba oculta e com reduced-motion (que usa o crachá estático).
- O bundle principal tem 186 kB gzip (React + Motion + GSAP). Dá para reduzir com `LazyMotion`, se for prioridade.

### Pendências de negócio (precisam de confirmação da empresa)
1. **WhatsApp:** a UI usa só o número provisório **(41) 99648-2334**. Outras peças mostram **(41) 99680-7443**. Nenhum dos dois foi confirmado. Para trocar, altere apenas `src/data/site.ts`.
2. Nome comercial: "Master Frio Climatização" (em uso) ou "Master Frio Soluções em Climatização".
3. Tempo de experiência ("5 anos"): não exibido.
4. Endereço (Rua Monge Guido de Azevedo, 227): não exibido, sem mapa.
5. CNPJ 65.121.715/0001-48: não exibido.
6. Promoções e preços (R$ 200/250/600): não exibidos.
7. **QR code do verso do crachá: não foi validado.** Não testei a leitura com câmera. O site não afirma que ele funciona e sempre oferece o link direto do Instagram. Se o QR falhar, posso reconstruí-lo de forma determinística, após confirmação.
8. Autorização de uso das fotos reais da galeria e da imagem do mascote.
9. Cobertura além de Curitiba e região (Colombo, RMC, litorais): não prometida no site.

**Confirmação:** nenhum commit, push, deploy, publicação ou alteração em repositório externo foi realizado.
