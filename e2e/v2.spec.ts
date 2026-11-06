import { createRequire } from 'node:module'
import { expect, test, type Page } from '@playwright/test'

const require = createRequire(import.meta.url)
const JSQR_PATH = require.resolve('jsqr/dist/jsQR.js')

const walk = async (page: Page, step = 500) => {
  const total = await page.evaluate(() => document.body.scrollHeight)
  for (let y = 0; y < total; y += step) {
    await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: 'instant' }), y)
    await page.waitForTimeout(70)
  }
  await page.waitForTimeout(1200)
}

test.describe('V2 — regressões', () => {
  test('todas as headlines em máscara terminam visíveis após a rolagem (desktop)', async ({ page }) => {
    await page.goto('./')
    await walk(page)
    const hidden = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>('.line-mask')]
        .filter((mask) => {
          const inner = mask.querySelector<HTMLElement>('.line-inner')
          if (!inner) return false
          const m = mask.getBoundingClientRect()
          const r = inner.getBoundingClientRect()
          return r.top > m.top + 2 || Number(getComputedStyle(inner).opacity) < 0.99
        })
        .map((m) => m.textContent),
    )
    expect(hidden).toEqual([])
  })

  test.describe('mobile', () => {
    test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
    test('headlines visíveis também no celular', async ({ page }) => {
      await page.goto('./')
      await walk(page, 400)
      const hidden = await page.evaluate(() =>
        [...document.querySelectorAll<HTMLElement>('.line-mask')]
          .filter((mask) => {
            const inner = mask.querySelector<HTMLElement>('.line-inner')
            const m = mask.getBoundingClientRect()
            const r = inner!.getBoundingClientRect()
            return r.top > m.top + 2
          })
          .map((m) => m.textContent),
      )
      expect(hidden).toEqual([])
    })

    test('hero mobile: CTA principal na primeira dobra e aparelho não coberto pelo texto', async ({ page }) => {
      await page.goto('./')
      const cta = (await page.locator('.hero-ctas .btn-primary').boundingBox())!
      expect(cta.y + cta.height).toBeLessThanOrEqual(844)
      const eyebrow = (await page.locator('.hero-eyebrow').boundingBox())!
      // O aparelho fica na metade de cima; o texto começa abaixo de 40% da tela.
      expect(eyebrow.y).toBeGreaterThan(844 * 0.4)
    })
  })

  test('QR do verso do crachá decodifica para o Instagram (jsQR, sobre o WebP servido)', async ({ page }) => {
    await page.goto('./')
    await page.addScriptTag({ path: JSQR_PATH })
    const data = await page.evaluate(async () => {
      const src = new URL('assets/lanyard/card-back.webp', document.baseURI).href
      const img = new Image()
      img.src = src
      await img.decode()
      const c = document.createElement('canvas')
      c.width = img.width
      c.height = img.height
      const x = c.getContext('2d')!
      x.drawImage(img, 0, 0)
      const d = x.getImageData(0, 0, c.width, c.height)
      // @ts-expect-error -- jsQR injetado como script global
      return window.jsQR(d.data, d.width, d.height)?.data ?? null
    })
    expect(data).toBe('https://www.instagram.com/masterfrio2026/')
  })

  test('Lanyard assenta e para de renderizar quando parado', async ({ page }) => {
    test.setTimeout(90_000)
    await page.goto('./')
    await page.evaluate(() => document.querySelector('#contato')!.scrollIntoView({ behavior: 'instant' }))
    await expect(page.locator('.lanyard-canvas.is-ready')).toHaveCount(1, { timeout: 20_000 })
    await page.evaluate(() => {
      const c = document.querySelector<HTMLCanvasElement>('.lanyard-region canvas')!
      const gl = (c.getContext('webgl2') || c.getContext('webgl')) as WebGLRenderingContext
      const w = window as unknown as { __draws: number }
      w.__draws = 0
      const orig = gl.drawElements.bind(gl)
      gl.drawElements = ((...a: Parameters<typeof gl.drawElements>) => {
        w.__draws++
        return orig(...a)
      }) as typeof gl.drawElements
    })
    await page.waitForTimeout(13_000)
    await page.evaluate(() => ((window as unknown as { __draws: number }).__draws = 0))
    await page.waitForTimeout(3000)
    expect(await page.evaluate(() => (window as unknown as { __draws: number }).__draws)).toBe(0)
    // Uma interação reativa a física
    await page.getByRole('button', { name: 'Virar crachá' }).click()
    await page.waitForTimeout(500)
    expect(await page.evaluate(() => (window as unknown as { __draws: number }).__draws)).toBeGreaterThan(0)
  })

  test('Como trabalhamos: etapa ativa acompanha a rolagem', async ({ page }) => {
    await page.goto('./')
    const items = page.locator('.process-item')
    await items.nth(0).scrollIntoViewIfNeeded()
    await page.evaluate(() => {
      const el = document.querySelectorAll('.process-item')[2] as HTMLElement
      window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - innerHeight / 2 + 40, behavior: 'instant' })
    })
    await expect(items.nth(2)).toHaveClass(/is-active/)
  })

  test('OpenGraph com URL absoluta e protótipo continua noindex', async ({ page }) => {
    await page.goto('./')
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      'content',
      'https://lorenzo-or7.github.io/master-frio-demo/assets/hero/master-frio-hero-poster.webp',
    )
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex,\s*nofollow/)
  })

  test('letreiro do rodapé cabe inteiro no SVG (sem letra cortada)', async ({ page }) => {
    await page.goto('./')
    await page.evaluate(() => document.fonts.ready)
    const fit = await page.evaluate(() => {
      const svg = document.querySelector<SVGSVGElement>('.footer-wordmark')!
      const text = svg.querySelector('text')!
      const bb = text.getBBox()
      const vb = svg.viewBox.baseVal
      return { right: bb.x + bb.width, vbRight: vb.x + vb.width, left: bb.x, vbLeft: vb.x }
    })
    expect(fit.right).toBeLessThanOrEqual(fit.vbRight)
    expect(fit.left).toBeGreaterThanOrEqual(fit.vbLeft)
  })

  test('Sobre não repete o enquadramento da galeria', async ({ page }) => {
    await page.goto('./')
    const about = await page.locator('.about-img').getAttribute('src')
    const gallery = await page.locator('.car-img').evaluateAll((els) => els.map((e) => e.getAttribute('src')))
    expect(gallery).not.toContain(about)
  })
})
