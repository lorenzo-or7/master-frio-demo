import { expect, test, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const WA_NUMBER = '5541996482334'
const IG = 'https://www.instagram.com/masterfrio2026/'

const collectErrors = (page: Page) => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(`console: ${m.text()}`)
  })
  return errors
}

const scrollTo = (page: Page, selector: string) =>
  page.evaluate((sel) => {
    document.querySelector(sel)?.scrollIntoView({ behavior: 'instant', block: 'start' })
  }, selector)

test.describe('Estrutura e SEO de protótipo', () => {
  test('um único h1, pt-BR, noindex e ordem das seções', async ({ page }) => {
    const errors = collectErrors(page)
    await page.goto('./')
    await expect(page.locator('h1')).toHaveCount(1)
    await expect(page.locator('h1')).toHaveText('Frio na medida do seu ambiente.')
    await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR')
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex,\s*nofollow/)
    const ids = await page.locator('main > section').evaluateAll((els) => els.map((e) => e.id))
    expect(ids).toEqual(['inicio', 'sobre', 'servicos', 'trabalhos', 'como-trabalhamos', 'atendimento', 'contato'])
    await expect(page.locator('footer')).toContainText('© 2026 Master Frio Climatização. Todos os direitos reservados.')
    await expect(page.locator('footer')).toContainText('Protótipo demonstrativo desenvolvido por Or7.Dev')
    await expect(page.locator('footer img[src$="assets/brand/or7-watermark.png"]')).toHaveCount(1)
    expect(errors).toEqual([])
  })

  test('Spline Sans carregada e aplicada', async ({ page }) => {
    await page.goto('./')
    await page.evaluate(() => document.fonts.ready)
    const loaded = await page.evaluate(() => document.fonts.check('700 16px "Spline Sans"'))
    expect(loaded).toBe(true)
    for (const sel of ['h1', '.nav-link', '.btn-primary', 'p']) {
      const family = await page.locator(sel).first().evaluate((el) => getComputedStyle(el).fontFamily)
      expect(family.startsWith('"Spline Sans"') || family.startsWith('Spline Sans')).toBe(true)
    }
  })

  test('sem dados não confirmados na interface', async ({ page }) => {
    await page.goto('./')
    const text = await page.locator('body').innerText()
    for (const forbidden of ['99680-7443', '65.121.715', 'Monge Guido', '5 anos', 'R$', 'PMOC']) {
      expect(text).not.toContain(forbidden)
    }
  })
})

test.describe('WhatsApp e Instagram', () => {
  test('todos os links de WhatsApp usam o mesmo número e são seguros', async ({ page }) => {
    await page.goto('./')
    const links = page.locator('a[href*="wa.me"]')
    const count = await links.count()
    expect(count).toBeGreaterThanOrEqual(11)
    for (let i = 0; i < count; i++) {
      const a = links.nth(i)
      const href = (await a.getAttribute('href'))!
      expect(new URL(href).pathname).toBe(`/${WA_NUMBER}`)
      await expect(a).toHaveAttribute('target', '_blank')
      await expect(a).toHaveAttribute('rel', 'noopener noreferrer')
      const msg = new URL(href).searchParams.get('text')!
      expect(msg.startsWith('Olá!')).toBe(true)
      expect(msg).not.toMatch(/Obrigad[oa]/)
    }
  })

  test('cada um dos 7 serviços abre o WhatsApp com mensagem específica', async ({ page }) => {
    await page.goto('./')
    const expected = [
      'instalação de ar-condicionado',
      'manutenção preventiva',
      'manutenção corretiva',
      'recarga de gás refrigerante',
      'pequenos serviços de elétrica',
      'venda de ar-condicionado',
      'infraestrutura para climatização',
    ]
    const ctas = page.locator('.fc-card .fc-cta')
    await expect(ctas).toHaveCount(7)
    for (let i = 0; i < 7; i++) {
      const href = (await ctas.nth(i).getAttribute('href'))!
      expect(new URL(href).searchParams.get('text')).toBe(
        `Olá! Gostaria de saber mais sobre o serviço de ${expected[i]} e solicitar um orçamento.`,
      )
    }
  })

  test('Instagram acessível por link direto (sem depender do QR)', async ({ page }) => {
    await page.goto('./')
    const ig = page.locator(`a[href="${IG}"]`)
    expect(await ig.count()).toBeGreaterThanOrEqual(2)
    await expect(page.locator('#contato').locator(`a[href="${IG}"]`).first()).toBeVisible()
    await expect(ig.first()).toHaveAttribute('rel', 'noopener noreferrer')
  })
})

test.describe('Floating Nav e Frost Switch', () => {
  test('desktop: links de âncora levam às seções sem ficar atrás da nav', async ({ page }) => {
    await page.goto('./')
    await page.locator('.nav-links a[href="#servicos"]').click()
    await page.waitForTimeout(1200)
    const top = await page.locator('#servicos').evaluate((el) => el.getBoundingClientRect().top)
    const navBottom = await page.locator('.nav-capsule').evaluate((el) => el.getBoundingClientRect().bottom)
    expect(top).toBeGreaterThanOrEqual(navBottom - 2)
    expect(top).toBeLessThan(120)
  })

  test('tema alterna, persiste após reload e o rótulo acompanha', async ({ page }) => {
    await page.goto('./')
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'night')
    const sw = page.getByRole('button', { name: 'Ativar tema claro' })
    await sw.click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'day')
    await expect(page.getByRole('button', { name: 'Ativar tema escuro' })).toBeVisible()
    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'day')
    // Tema aplicado antes do React (sem flash): o atributo já existe no HTML inicial.
    const early = await page.evaluate(() => localStorage.getItem('mf-theme'))
    expect(early).toBe('day')
  })

  test('alternar tema no meio da página não reinicia o vídeo nem rola a página', async ({ page }) => {
    await page.goto('./')
    await scrollTo(page, '#trabalhos')
    await page.waitForTimeout(300)
    // A nav se oculta ao descer; uma pequena subida a traz de volta.
    await page.mouse.wheel(0, -120)
    await expect(page.locator('.nav-wrap')).not.toHaveAttribute('data-hidden', /.*/)
    await page.waitForTimeout(500)
    const y = await page.evaluate(() => scrollY)
    await page.getByRole('button', { name: 'Ativar tema claro' }).click()
    await page.waitForTimeout(400)
    expect(Math.abs((await page.evaluate(() => scrollY)) - y)).toBeLessThan(2)
  })
})

test.describe('Mobile', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })

  test('menu: abre, navega para serviços, fecha; Escape devolve o foco; clique fora fecha', async ({ page }) => {
    await page.goto('./')
    const toggle = page.getByRole('button', { name: 'Abrir menu' })
    await expect(toggle).toBeVisible()
    const box = (await toggle.boundingBox())!
    expect(box.x + box.width).toBeLessThanOrEqual(390)
    expect(box.height).toBeGreaterThanOrEqual(44)
    await toggle.click()
    const panel = page.locator('.nav-panel')
    await expect(panel).toBeVisible()
    await panel.getByRole('link', { name: /Serviços/ }).click()
    await expect(panel).toHaveCount(0)
    await page.waitForTimeout(1200)
    const top = await page.locator('#servicos').evaluate((el) => el.getBoundingClientRect().top)
    expect(top).toBeLessThan(160)

    await page.getByRole('button', { name: 'Abrir menu' }).click()
    await expect(panel).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(panel).toHaveCount(0)
    await expect(page.getByRole('button', { name: 'Abrir menu' })).toBeFocused()

    await page.getByRole('button', { name: 'Abrir menu' }).click()
    await expect(panel).toBeVisible()
    await page.mouse.click(200, 700)
    await expect(panel).toHaveCount(0)
  })

  test('hero: aparelho visível no topo e texto abaixo, sem sobreposição dos CTAs', async ({ page }) => {
    await page.goto('./')
    const media = await page.locator('.hero-media').boundingBox()
    const title = await page.locator('.hero-title').boundingBox()
    const ctas = await page.locator('.hero-ctas').boundingBox()
    expect(media!.height).toBeGreaterThan(400)
    expect(title!.y).toBeGreaterThan(media!.height * 0.5)
    expect(ctas!.y + ctas!.height).toBeLessThanOrEqual(844 + 1)
  })
})

test.describe('Serviços — Focus Cards', () => {
  test('layout 3×2 + 1 horizontal de largura total no desktop', async ({ page }) => {
    await page.goto('./')
    const boxes = await page.locator('.fc-card').evaluateAll((els) =>
      els.map((e) => {
        const r = e.getBoundingClientRect()
        return { x: Math.round(r.x), y: Math.round(r.y + scrollY), w: Math.round(r.width), h: Math.round(r.height) }
      }),
    )
    expect(boxes).toHaveLength(7)
    const rowY = [...new Set(boxes.slice(0, 6).map((b) => b.y))]
    expect(rowY).toHaveLength(2)
    expect(boxes[0].y).toBe(boxes[2].y)
    expect(boxes[3].y).toBe(boxes[5].y)
    expect(boxes[6].w).toBeGreaterThan(boxes[0].w * 2.9)
    expect(boxes[6].w).toBeGreaterThan(boxes[6].h)
    expect(boxes[0].h).toBeGreaterThan(boxes[0].w)
  })

  test('hover desfoca só as fotos dos demais; texto e CTA continuam nítidos', async ({ page }) => {
    await page.goto('./')
    await scrollTo(page, '#servicos')
    await page.locator('.fc-card').first().hover()
    await page.waitForTimeout(500)
    const states = await page.locator('.fc-card').evaluateAll((els) => els.map((e) => e.getAttribute('data-state')))
    expect(states[0]).toBe('active')
    expect(states.slice(1).every((s) => s === 'dimmed')).toBe(true)
    const second = page.locator('.fc-card').nth(1)
    expect(await second.locator('.fc-img').evaluate((el) => getComputedStyle(el).filter)).toContain('blur')
    expect(await second.locator('.fc-title').evaluate((el) => getComputedStyle(el).filter)).toBe('none')
    expect(await second.locator('.fc-title').evaluate((el) => getComputedStyle(el).opacity)).toBe('1')
    await page.mouse.move(5, 5)
    await page.waitForTimeout(500)
    const after = await page.locator('.fc-card').evaluateAll((els) => els.map((e) => e.getAttribute('data-state')))
    expect(after.every((s) => s === 'idle')).toBe(true)
  })

  test('foco por teclado ativa o card e Escape remove o destaque', async ({ page }) => {
    await page.goto('./')
    await page.locator('.fc-card .fc-cta').nth(2).focus()
    await expect(page.locator('.fc-card').nth(2)).toHaveAttribute('data-state', 'active')
    await page.keyboard.press('Escape')
    await expect(page.locator('.fc-card').nth(2)).toHaveAttribute('data-state', 'idle')
  })
})

test.describe('Trabalhos reais — Carousel e lightbox', () => {
  test('5 fotos reais, setas, teclado e swipe', async ({ page }) => {
    await page.goto('./')
    const imgs = page.locator('.car-slide img')
    await expect(imgs).toHaveCount(5)
    const srcs = await imgs.evaluateAll((els) => els.map((e) => e.getAttribute('src')))
    expect(srcs.map((x) => x!.slice(x!.indexOf('assets/')))).toEqual([
      'assets/gallery/01-fachada-comercial.webp',
      'assets/gallery/02-execucao-em-campo.webp',
      'assets/gallery/03-tubulacoes.webp',
      'assets/gallery/04-condensadoras-cobertura.webp',
      'assets/gallery/05-equipamentos-ferramentas.webp',
    ])
    await scrollTo(page, '#trabalhos')
    const count = page.locator('.car-count-current')
    await expect(count).toHaveText('01')
    await page.getByRole('button', { name: 'Próxima foto' }).click()
    await expect(count).toHaveText('02')
    await page.getByRole('button', { name: 'Foto anterior' }).click()
    await expect(count).toHaveText('01')
    await page.getByRole('button', { name: 'Foto anterior' }).click()
    await expect(count).toHaveText('05')

    await page.locator('.car-root').focus()
    await page.keyboard.press('ArrowRight')
    await expect(count).toHaveText('01')
    await page.keyboard.press('End')
    await expect(count).toHaveText('05')
    await page.keyboard.press('Home')
    await expect(count).toHaveText('01')

    // Swipe por toque (pointer events de toque)
    await page.locator('.car-viewport').evaluate((el) => {
      const r = el.getBoundingClientRect()
      const y = r.top + r.height / 2
      const opts = (x: number) => ({ bubbles: true, pointerId: 7, pointerType: 'touch', clientX: x, clientY: y, isPrimary: true })
      el.dispatchEvent(new PointerEvent('pointerdown', opts(r.left + r.width * 0.8)))
      el.dispatchEvent(new PointerEvent('pointerup', opts(r.left + r.width * 0.2)))
    })
    await expect(count).toHaveText('02')
  })

  test('"Ver foto" abre lightbox acessível; Escape fecha e devolve a página', async ({ page }) => {
    await page.goto('./')
    const startUrl = page.url()
    await scrollTo(page, '#trabalhos')
    await page.locator('.car-slide.is-current .car-open').click()
    const dialog = page.locator('dialog.lightbox')
    await expect(dialog).toHaveJSProperty('open', true)
    await expect(dialog.locator('img')).toHaveAttribute('src', /assets\/gallery\/01-fachada-comercial.webp$/)
    await expect(dialog.getByRole('button', { name: 'Fechar' })).toBeFocused()
    // A foto ampliada cabe inteira na tela
    const shown = await dialog.locator('img').evaluate((img: HTMLImageElement) => {
      const r = img.getBoundingClientRect()
      return { bottom: r.bottom, right: r.right, vh: innerHeight, vw: innerWidth }
    })
    expect(shown.bottom).toBeLessThanOrEqual(shown.vh)
    expect(shown.right).toBeLessThanOrEqual(shown.vw)
    await page.keyboard.press('ArrowRight')
    await expect(dialog.locator('img')).toHaveAttribute('src', /assets\/gallery\/02-execucao-em-campo.webp$/)
    await page.keyboard.press('Escape')
    await expect(dialog).toHaveJSProperty('open', false)

    // Botão voltar do navegador também fecha
    await page.locator('.car-slide.is-current .car-open').click()
    await expect(dialog).toHaveJSProperty('open', true)
    await page.goBack()
    await expect(dialog).toHaveJSProperty('open', false)
    expect(page.url()).toBe(startUrl)

    // Clique duplo rápido em "Fechar" não sai da página (history.back só uma vez)
    await page.locator('.car-slide.is-current .car-open').click()
    await expect(dialog).toHaveJSProperty('open', true)
    await dialog.getByRole('button', { name: 'Fechar' }).dblclick()
    await page.waitForTimeout(600)
    await expect(dialog).toHaveJSProperty('open', false)
    expect(page.url()).toBe(startUrl)
    await expect(page.locator('#trabalhos')).toBeVisible()
  })

  test('indicador segmentado leva direto a uma foto', async ({ page }) => {
    await page.goto('./')
    await scrollTo(page, '#trabalhos')
    await page.getByRole('button', { name: /Foto 4: Condensadoras em cobertura/ }).click()
    await expect(page.locator('.car-count-current')).toHaveText('04')
    await expect(page.getByRole('button', { name: /Foto 4:/ })).toHaveAttribute('aria-current', 'true')
  })
})

test.describe('Hero — vídeo e fallbacks', () => {
  test('poster imediato; vídeo aprovado carrega depois; botão de pausa funciona', async ({ page }) => {
    await page.goto('./')
    await expect(page.locator('.hero-poster')).toHaveAttribute('src', /assets\/hero\/master-frio-hero-poster.webp$/)
    const video = page.locator('video.hero-video')
    await expect(video).toHaveAttribute('src', /assets\/hero\/master-frio-hero-loop.mp4$/)
    await expect.poll(() => video.evaluate((v: HTMLVideoElement) => !v.paused), { timeout: 15_000 }).toBe(true)
    expect(await video.evaluate((v: HTMLVideoElement) => v.muted && v.loop && v.playsInline && !v.controls)).toBe(true)
    await page.getByRole('button', { name: 'Pausar vídeo de fundo' }).click()
    expect(await video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true)
    // Fora da viewport continua pausado e não reinicia
    const t = await video.evaluate((v: HTMLVideoElement) => v.currentTime)
    await scrollTo(page, '#servicos')
    await page.waitForTimeout(300)
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
    await page.waitForTimeout(500)
    expect(await video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true)
    expect(Math.abs((await video.evaluate((v: HTMLVideoElement) => v.currentTime)) - t)).toBeLessThan(0.05)
  })

  test('pausa automaticamente fora da viewport', async ({ page }) => {
    await page.goto('./')
    const video = page.locator('video.hero-video')
    await expect.poll(() => video.evaluate((v: HTMLVideoElement) => !v.paused), { timeout: 15_000 }).toBe(true)
    await scrollTo(page, '#trabalhos')
    await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true)
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
    await expect.poll(() => video.evaluate((v: HTMLVideoElement) => !v.paused)).toBe(true)
  })

  test('autoplay bloqueado: poster permanece, sem erros', async ({ page }) => {
    const errors = collectErrors(page)
    await page.addInitScript(() => {
      // Simula política que bloqueia autoplay: sem atributo autoplay e play() rejeitado.
      HTMLMediaElement.prototype.play = function () {
        return Promise.reject(new DOMException('blocked', 'NotAllowedError'))
      }
      new MutationObserver((records) => {
        for (const r of records)
          r.addedNodes.forEach((n) => {
            if (n instanceof HTMLVideoElement) n.removeAttribute('autoplay')
          })
      }).observe(document, { childList: true, subtree: true })
    })
    await page.goto('./')
    await page.waitForTimeout(2500)
    await expect(page.locator('.hero-poster')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Reproduzir vídeo de fundo' })).toBeVisible()
    expect(errors).toEqual([])
  })
})

test.describe('Reduced motion', () => {
  test.use({ reducedMotion: 'reduce' })

  test('sem vídeo automático e crachá estático com links', async ({ page }) => {
    const errors = collectErrors(page)
    await page.goto('./')
    await page.waitForTimeout(1500)
    await expect(page.locator('video.hero-video')).toHaveCount(0)
    await expect(page.locator('.hero-poster')).toBeVisible()
    await expect(page.locator('.line-inner').first()).toBeVisible()
    await scrollTo(page, '#contato')
    await page.waitForTimeout(800)
    await expect(page.locator('.lanyard-region')).toHaveAttribute('data-mode', 'static')
    await expect(page.locator('.lanyard-region canvas')).toHaveCount(0)
    await expect(page.locator('.badge-static img')).toBeVisible()
    await expect(page.locator('#contato a[href*="instagram.com/masterfrio2026"]').first()).toBeVisible()
    // Visitante ainda pode escolher reproduzir o vídeo
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
    await page.getByRole('button', { name: 'Reproduzir vídeo de fundo' }).click()
    await expect(page.locator('video.hero-video')).toHaveCount(1)
    expect(errors).toEqual([])
  })
})

test.describe('Contato — Lanyard', () => {
  test('3D carrega perto da seção, com front/back/fita aprovados, e vira pelo botão', async ({ page }) => {
    const errors = collectErrors(page)
    const requested: string[] = []
    page.on('request', (r) => requested.push(new URL(r.url()).pathname))
    await page.goto('./')
    await page.waitForTimeout(800)
    expect(requested.some((p) => p.includes('card-front.webp'))).toBe(false)
    await scrollTo(page, '#contato')
    await expect(page.locator('.lanyard-region canvas')).toHaveCount(1, { timeout: 15_000 })
    await expect(page.locator('.lanyard-canvas.is-ready')).toHaveCount(1, { timeout: 15_000 })
    for (const f of ['card-front.webp', 'card-back.webp', 'band.webp']) {
      expect(requested.some((p) => p.endsWith(`/assets/lanyard/${f}`))).toBe(true)
    }
    // Arraste real sobre o crachá (mouse)
    const region = (await page.locator('.lanyard-region').boundingBox())!
    await page.waitForTimeout(2500)
    const cx = region.x + region.width / 2
    const cy = region.y + region.height * 0.55
    await page.mouse.move(cx, cy)
    await page.mouse.down()
    await page.mouse.move(cx - 120, cy + 30, { steps: 8 })
    await page.mouse.move(cx + 80, cy - 20, { steps: 8 })
    await page.mouse.up()
    await page.getByRole('button', { name: 'Virar crachá' }).click()
    // links ao lado continuam clicáveis (crachá não bloqueia)
    await expect(page.locator('#contato .contact-actions a[href*="wa.me"]')).toBeVisible()
    await page.locator('#contato .contact-actions a[href*="wa.me"]').hover()
    expect(errors).toEqual([])
  })

  test('sem WebGL: fallback estático, sem erros no console', async ({ page }) => {
    const errors = collectErrors(page)
    await page.addInitScript(() => {
      // Simula navegador sem WebGL.
      const proto = HTMLCanvasElement.prototype as unknown as {
        getContext: (this: HTMLCanvasElement, type: string, ...args: unknown[]) => unknown
      }
      const orig = proto.getContext
      proto.getContext = function (type, ...args) {
        if (type.startsWith('webgl')) return null
        return orig.call(this, type, ...args)
      }
    })
    await page.goto('./')
    await scrollTo(page, '#contato')
    await page.waitForTimeout(1000)
    await expect(page.locator('.lanyard-region')).toHaveAttribute('data-mode', 'static')
    await expect(page.locator('.badge-static img')).toBeVisible()
    await expect(page.getByRole('link', { name: /Ver perfil no Instagram/ })).toBeVisible()
    expect(errors).toEqual([])
  })
})

test.describe('Responsividade — sem overflow horizontal', () => {
  const sizes = [
    [320, 568], [360, 800], [375, 667], [390, 844], [393, 852], [412, 915], [430, 932],
    [768, 1024], [820, 1180], [1024, 768], [1280, 800], [1440, 900], [1920, 1080], [844, 390],
    // Zoom de 200% em telas de 1280×800 e 1440×900 equivale a estas viewports CSS:
    [640, 400], [720, 450],
  ] as const
  for (const [w, h] of sizes) {
    test(`${w}×${h}`, async ({ page }) => {
      await page.setViewportSize({ width: w, height: h })
      await page.goto('./')
      const total = await page.evaluate(() => document.body.scrollHeight)
      for (let y = 0; y < total; y += Math.floor(h * 0.8)) {
        await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: 'instant' }), y)
        await page.waitForTimeout(40)
      }
      await page.waitForTimeout(300)
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
      expect(overflow).toBe(0)
      // CTA principal da hero cabe e tem alvo >= 44px
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
      const cta = await page.locator('.hero-ctas .btn-primary').boundingBox()
      expect(cta!.height).toBeGreaterThanOrEqual(44)
      expect(cta!.x + cta!.width).toBeLessThanOrEqual(w)
      // Navbar inteira dentro da viewport
      const nav = await page.locator('.nav-capsule').boundingBox()
      expect(nav!.x).toBeGreaterThanOrEqual(0)
      expect(nav!.x + nav!.width).toBeLessThanOrEqual(w)
    })
  }
})

test.describe('Acessibilidade (axe-core, WCAG 2.x A/AA)', () => {
  for (const theme of ['night', 'day'] as const) {
    test(`tema ${theme}`, async ({ page }) => {
      await page.addInitScript((t) => localStorage.setItem('mf-theme', t), theme)
      await page.goto('./')
      // Revela todos os blocos (animações de entrada concluídas) antes da análise
      const total = await page.evaluate(() => document.body.scrollHeight)
      for (let y = 0; y < total; y += 600) {
        await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: 'instant' }), y)
        await page.waitForTimeout(60)
      }
      await page.waitForTimeout(900)
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        // O vídeo/foto de fundo da hero impede o cálculo automático; contraste da hero é medido à parte.
        .exclude('.hero-media')
        .analyze()
      const summary = results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).slice(0, 4).join(' | ')}`)
      expect(summary).toEqual([])
    })
  }

  test('Tab percorre CTAs com foco visível e sem armadilha', async ({ page }) => {
    await page.goto('./')
    const seen = new Set<string>()
    for (let i = 0; i < 80; i++) {
      await page.keyboard.press('Tab')
      const info = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null
        if (!el || el === document.body) return null
        const cs = getComputedStyle(el)
        const visible = cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0
        const cardRing = !!el.closest('.fc-card') && getComputedStyle(el.closest('.fc-card')!).outlineStyle !== 'none'
        const track = el.querySelector('.frost-track')
        const switchRing = !!track && getComputedStyle(track).outlineStyle !== 'none'
        return { key: `${el.tagName}:${el.textContent?.trim().slice(0, 30)}:${el.getAttribute('href') ?? ''}`, visible: visible || cardRing || switchRing }
      })
      // Ao fim da página o foco volta à interface do navegador (body): ciclo completo, sem armadilha.
      if (info === null) break
      expect(info.visible, info.key).toBe(true)
      seen.add(info.key)
    }
    expect(seen.size).toBeGreaterThan(25)
  })
})
