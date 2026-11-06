# Master Frio · Relatório da revisão V2 (Or7)

Data: 06/11/2026 · Base: `origin/main` (`54202a5`), atualizada localmente por fast-forward · **Nenhum commit, push ou deploy feito.**

## 1. Resumo executivo

A V2 manteve a stack, os componentes aprovados e todas as funcionalidades. Ela corrige o que estava objetivamente errado e eleva a direção de arte. As mudanças principais:

- **QR do crachá:** o QR original não decodificava. Foi reconstruído de forma determinística e agora é lido por dois decodificadores.
- **Metadados:** o `og:image` passou a usar URL absoluta.
- **Texturas do Lanyard:** caíram de 5,7 MB para 0,64 MB.
- **Render do crachá:** o loop agora para quando o crachá assenta. Antes ele rodava a ~120 quadros/s sem parar.
- **Troca de tema:** ficou cerca de 3× mais rápida em CPU lenta.
- **Novo título da hero:** "Frio na medida do seu ambiente."
- **Ritmo:** superfícies tonais alternadas e uma faixa azul de destaque em Atendimento.
- **Sobre:** recorte editorial próprio, sem repetir o enquadramento da galeria.
- **Galeria:** fotos limpas, sem inclinação 3D.
- **Processo:** passou a progredir com a rolagem.
- **Rodapé:** letreiro com o espaçamento real da fonte.
- **Motion:** primitivas diferentes por intenção, no lugar de um único fade-up.

A suíte passou de 38 para **95 testes**. Ela roda na raiz e sob `/master-frio-demo/`, no Chrome (95/95) e no Edge (95/95).

## 2. Diagnóstico

### Falhas confirmadas (corrigidas)

| # | Falha | Evidência |
|---|---|---|
| 1 | QR do verso não decodificava | jsQR e ZXing: `NotFoundException` na imagem inteira e em 2 recortes |
| 2 | `og:image` relativo (`/master-frio-demo/assets/...`) | Inspeção do `dist/index.html` e do site público |
| 3 | Lanyard renderizava sem parar (~1.200 draws/s, ~120 quadros/s) | Contagem de `drawElements` por 20 s. A brisa (`breeze`) e um piso de ruído do solver impediam o repouso |
| 4 | Troca de tema lenta: 260–390 ms antes e 340–460 ms no V2 inicial, em CPU 4× | Event Timing API. Causa: a regra `html.theme-switching *` aplicava transições em todos os elementos |
| 5 | Título com máscara podia nunca aparecer no celular ("Nosso trabalho, de perto.") | Captura 390×844. O IntersectionObserver observava o span que estava fora da máscara |
| 6 | Fechar o lightbox com clique duplo rápido chamava `history.back()` duas vezes e saía da página | Revisão de código; agora coberto por teste |
| 7 | Contraste da hero com título maior: 2,91:1 em 1024×768 (falha no V2 inicial) | `scripts/hero-contrast.mjs`, pior pixel atrás do texto em 5 instantes do vídeo |
| 8 | O scroll cinematográfico reduzia a opacidade do CTA para 0,35 ainda na tela | axe `color-contrast` |
| 9 | Letreiro do rodapé: espaçamento esticado via `textLength` e, num passo intermediário, "O" cortado | Captura 1440 px; agora coberto por teste |
| 10 | Tablet em retrato (820×1180) com faixa vazia entre a cena e o texto | Captura |

### Riscos técnicos (registrados, não são bugs)

- **LCP no celular lento:** 2,92 s no perfil Slow 4G + CPU 4× (era 3,26 s). Ainda acima da meta de 2,5 s, porque o pôster disputa banda com o JS (~189 kB gzip).
- **Foto 03-tubulacoes:** tem aparência muito limpa ou tratada. O pacote a declara como registro real, ampliado e otimizado. Recomendo confirmar com a empresa antes de apresentá-la como trabalho executado.
- **Teste do QR:** foi feito com decodificadores de software, inclusive com a imagem reduzida, desfocada e girada. Falta a leitura com a câmera de um celular real.

### Oportunidades atendidas

- Foto repetida em Sobre.
- Título genérico.
- Motion repetitivo.
- Ritmo tonal monótono.
- Densidade no mobile: os cards de serviço ficaram 1:1 em vez de 4:5.
- Galeria com legenda sobre a foto.
- Anéis decorativos sem força.

## 3. Implementação

**Arquivos alterados**
- `index.html`, `vite.config.ts` (plugin `%SITE_URL%` para OG; dev na porta 5190, porque a 5173 e a 5180 estão em uso por outros projetos seus).
- `package.json` (devDeps `qrcode` e `jsqr`, só para gerar e verificar o QR), `playwright.config.ts`, `.gitignore`.
- `src/data/site.ts`, `src/hooks/useTheme.ts`, `src/styles/{tokens,global,components}.css`.
- Componentes: Hero, About, Services, focus-cards, carousel, Projects, Lightbox, Process, Coverage, Contact, Lanyard, Footer e Reveal.
- `e2e/site.spec.ts`, `scripts/hero-contrast.mjs`.

**Arquivos criados**
- `src/lib/motion.ts`.
- Testes: `e2e/v2.spec.ts`, `e2e/pages.spec.ts`.
- Scripts reprodutíveis: `scripts/{build-lanyard-assets,build-about-crop,build-poster,perf,capture-set,smoke-remote}.mjs`.
- Assets em `public/assets/`: `lanyard/{card-front,card-back,band}.webp`, `gallery/about-01-detalhe.webp`, `hero/master-frio-hero-poster-1280.webp`.
- Matrizes originais: `assets-src/lanyard/*.png`, mais as provas do QR em `assets-src/lanyard/verificacao/`.
- `docs/capturas/{antes,depois}/` (15 capturas em cada).

**Removidos de `public/`:** os três PNGs do Lanyard (5,7 MB). Os originais estão preservados em `assets-src/lanyard/`.

**Preservado:**
- Floating Nav (opção 03), Frost Switch (opção 01), Focus Cards 3×2+1, Carousel Aceternity com API `slides`, lightbox, Lanyard React Bits com física, arraste, virada e fallback.
- Vídeo aprovado, Spline Sans, tokens, mascote e marca Or7.
- `noindex,nofollow`, reduced-motion e WhatsApp centralizado com o número provisório.
- Workflow do GitHub Pages: não alterado.

## 4. Design, por seção

- **Hero:**
  - Eyebrow factual ("Climatização residencial e comercial · Curitiba e região") e H1 em duas linhas intencionais: "Frio na medida / do seu ambiente."
  - Overlay localizado (esquerda/baixo); o aparelho fica limpo no quadrante superior direito.
  - Mobile e tablet em retrato usam grid: a cena ocupa o espaço que o texto não usa e se sobrepõe 10rem a ele, então a composição se ajusta do iPhone SE ao iPad.
  - O CTA secundário vira link subordinado no mobile.
  - O controle do vídeo ganhou um anel de progresso do ciclo.
- **Superfícies:** valores tonais dos azuis aprovados (night `#07182F / #0A1F3D / #102B52`; day `#F4F8FC / #FFFFFF / #E8F0F8`) e uma faixa de destaque `#075AA3`. Nenhuma paleta nova.
- **Sobre:**
  - Recorte de detalhe da foto real 01: condensadora, suporte e tubulação. A galeria mostra a fachada inteira.
  - O lead ganhou um fio em azul-gelo e o texto foi enxugado.
- **Serviços:**
  - Descrições revisadas. A recarga de gás "começa pelo diagnóstico".
  - Cards 1:1 no celular (antes 4:5 com mínimo de 380 px).
  - Entrada escalonada por coluna.
  - A nota de imagens ilustrativas ficou mais discreta e aponta para os registros reais.
- **Trabalhos:**
  - Sem rotação 3D; as fotos vizinhas recuam em escala e opacidade.
  - Legenda editorial numerada abaixo da foto, sem gradiente sobre a fotografia real.
  - Indicador segmentado clicável.
- **Como trabalhamos:**
  - Linha técnica que se preenche com a rolagem e marcador da etapa ativa.
  - Numeração grande e rótulos Antes / Durante / Depois. Nada inventado.
- **Atendimento:** faixa azul de destaque com "Curitiba e região." monumental e linhas de fluxo de ar. É um gesto do vídeo, não um mapa.
- **Contato:**
  - Título em duas linhas e canais (WhatsApp, Instagram, Atendimento) em linhas finas.
  - O palco do crachá ganhou um trilho de onde a fita pende.
- **Rodapé:** letreiro em SVG com viewBox medido para a Spline Sans 700 a −0,045em. Ele escala sem esticar o espaçamento, o que é verificado por teste.

## 5. Motion

| Animação | Antes | V2 |
|---|---|---|
| Headlines | fade-up 14px | máscara por linha, 620 ms, escalonada, disparada pelo título |
| Eyebrows | fade-up | traço se desenha (600 ms) + rótulo |
| Parágrafos/legendas | fade-up 550 ms | "rise" 12px/700 ms ou "fade" 800 ms, conforme o papel |
| Foto do Sobre | máscara 900 ms | máscara 950 ms + escala 1.12→1 (1100 ms) + parallax ±4% |
| Cards de serviço | sem entrada | 28px/750 ms, escalonados por coluna |
| Galeria | rotação 3D | escala/opacidade 620 ms |
| Processo | linhas estáticas | progresso com mola ligado à rolagem + etapa ativa |
| Atendimento | — | linhas de ar desenhadas (1,1 s) + título deslizando |
| Rodapé | fade-up | letreiro sobe de dentro da máscara (1050 ms) |
| Tema | transição em todos os elementos | crossfade da View Transitions API (240 ms) |
| Lanyard | brisa permanente | brisa ~4 s após entrada ou interação, dissipa em ~3 s e o render para |

Easing `cubic-bezier(0.22, 1, 0.36, 1)`. GSAP só no scroll da hero (agora sem opacidade); Motion para todo o resto. Nenhuma propriedade é controlada pelas duas bibliotecas ao mesmo tempo.

**Reduced-motion:** headlines e blocos nascem no estado final, o vídeo não carrega sozinho, o crachá é estático e o tema troca de forma instantânea (testado).

## 6. Performance (medido)

Arquivos:

| Arquivo | Antes | V2 |
|---|---|---|
| Texturas do Lanyard | 5.708.434 B (PNG) | 637.730 B (WebP) |
| Pôster no celular | 152.024 B | 57.720 B (1280×720 = resolução do vídeo, via `srcset`) |
| `dist/` total | 14 MB | 9,0 MB |
| JS principal (gzip) | 186,3 kB | 188,6 kB |
| Chunk do Lanyard (gzip) | 152,1 kB | 152,1 kB |

Métricas de laboratório: `scripts/perf.mjs`, mediana de 3 execuções, mesmo servidor local para os dois builds, cache desligado.

| Perfil | LCP | CLS | INP aprox. | Até o Contato | Lanyard parado |
|---|---|---|---|---|---|
| Desktop · antes | 1,22 s | 0 | 72 ms | 8,9 MB | 0–12.000 draws/10 s |
| Desktop · V2 | 1,26 s | 0 | 24 ms | 2,5 MB | 0 |
| Mobile Slow 4G + CPU 4× · antes | 3,26 s | 0 | 360 ms | 12,3 MB | ~11.700 |
| Mobile Slow 4G + CPU 4× · V2 | **2,92 s** | 0 | **128 ms** | **4,2 MB** | **0** |

Heap JS no mobile lento: 15,0 → 10,9 MB. O INP foi medido em cliques reais (tema). Não houve Lighthouse.

## 7. Responsividade

Matriz executada pelos testes (sem overflow, CTA ≥ 44 px, nav dentro da tela, percorrendo a página inteira):

320×568, 360×800, 375×667, 390×844, 393×852, 412×915, 430×932, 768×1024, 820×1180, 1024×768, 1280×800, 1440×900, 1920×1080, 844×390, além de 640×400 e 720×450 (equivalentes a zoom de 200% em 1280×800 e 1440×900).

A revisão visual foi feita por capturas. Corrigido: a faixa vazia no tablet em retrato, o eyebrow em duas linhas e a quebra "ar-/condicionado" (agora com hífen não separável).

## 8. QA

| Verificação | Resultado |
|---|---|
| `npm run typecheck` | ✅ 0 erros |
| `npm run lint` | ✅ 0 erros · 2 avisos herdados do React Bits (`Lanyard.tsx`, sem mudança) |
| `npm run build` | ✅ (aviso de chunk > 500 kB do Vite, não é erro) |
| Playwright · Chrome | ✅ **95/95** (projeto `raiz` + projeto `pages` sob `/master-frio-demo/`) |
| Playwright · Edge (`PW_CHANNEL=msedge`) | ✅ **95/95** |
| axe-core WCAG 2.0/2.1/2.2 A+AA | ✅ sem violações nos dois temas, nas duas bases |
| Contraste da hero sobre o vídeo (8 composições × 5 quadros) | ✅ título ≥ 3,45:1 (exige 3), apoio ≥ 7,3:1 e eyebrow ≥ 5,0:1 (exigem 4,5) |
| QR | ✅ jsQR e ZXing → `https://www.instagram.com/masterfrio2026/` (PNG, WebP servido, 50%/30%/22%, desfoque, rotação 8°) |
| Smoke do site público (antes da V2) | ✅ fonte carregada, vídeo pronto, Lanyard ativo, sem imagem quebrada nem erro de console |

Testes novos:
- headlines visíveis após rolar (desktop e mobile);
- QR decodificado no navegador;
- Lanyard para de renderizar e volta ao interagir;
- etapa ativa do processo;
- OG absoluto;
- Sobre sem repetir a galeria;
- letreiro inteiro no SVG;
- indicador da galeria;
- clique duplo no "Fechar";
- smoke do build com base: requisições sob `/master-frio-demo/`, sem 404 e sem erros.

## 9. Capturas

`docs/capturas/antes/` e `docs/capturas/depois/`, com os mesmos 15 enquadramentos:
- página inteira desktop e mobile, nos temas escuro e claro;
- hero, serviços, galeria e contato, no desktop e no mobile;
- processo no desktop;
- rodapé, no desktop e no mobile.

## 10. Pendências reais

- **WhatsApp:** (41) 99648-2334 é provisório e não confirmado; (41) 99680-7443 aparece em outras peças. Para trocar, altere apenas `src/data/site.ts`.
- **Dados comerciais não exibidos:** nome alternativo, CNPJ, endereço, "5 anos" e preços.
- **Autorização** de uso público das fotografias e do mascote. Confirmar também a natureza da foto 03.
- **QR:** validar com a câmera de um celular real.
- **Não testado:** Safari/iOS, Samsung Internet, aparelhos físicos, leitor de tela real, teclado virtual e notch real. Edge e Chrome foram testados só no desktop, com emulação de viewport.
- **LCP mobile em rede lenta:** 2,92 s, acima da meta. O próximo passo seria reduzir o JS principal (ex.: `LazyMotion`).
- **Publicação:** as alterações estão só no disco. Para publicar é preciso commit + push em `main`, que dispara o workflow. Aguardo autorização.

## 11. Estado do Git

- `main` local foi atualizado por fast-forward para `origin/main` (`54202a5`), sem commit novo.
- Todas as mudanças da V2 estão no diretório de trabalho; o índice está vazio.
- **Nenhum commit, push ou deploy foi realizado.** As configurações do GitHub Pages não foram alteradas.
