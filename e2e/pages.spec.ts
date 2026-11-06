import { expect, test } from '@playwright/test'

/**
 * Smoke test do build de produção servido sob /master-frio-demo/ (mesma base do GitHub Pages).
 * Roda no projeto "pages" do Playwright (ver playwright.config.ts).
 */
test('build sob /master-frio-demo/: assets, fonte, mídia e 3D carregam sem 404 nem erros', async ({ page }) => {
  test.setTimeout(90_000)
  const failed: string[] = []
  const errors: string[] = []
  const urls: string[] = []
  page.on('response', (r) => {
    urls.push(r.url())
    if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`)
  })
  page.on('requestfailed', (r) => {
    // Cancelamento de faixa de mídia (vídeo) é normal.
    if (!r.url().endsWith('.mp4')) failed.push(`FALHA ${r.url()}`)
  })
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))

  await page.goto('./')
  expect(new URL(page.url()).pathname).toBe('/master-frio-demo/')
  const total = await page.evaluate(() => document.body.scrollHeight)
  for (let y = 0; y < total; y += 600) {
    await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: 'instant' }), y)
    await page.waitForTimeout(80)
  }
  await page.evaluate(() => document.querySelector('#contato')!.scrollIntoView({ behavior: 'instant' }))
  await expect(page.locator('.lanyard-canvas.is-ready')).toHaveCount(1, { timeout: 20_000 })

  // Fonte, vídeo e texturas pedidos sob a base
  expect(await page.evaluate(() => document.fonts.check('700 16px "Spline Sans"'))).toBe(true)
  const local = urls.filter((u) => u.startsWith('http://localhost'))
  expect(local.every((u) => new URL(u).pathname.startsWith('/master-frio-demo/'))).toBe(true)
  for (const asset of [
    'assets/fonts/SplineSans-Variable.woff2',
    'assets/hero/master-frio-hero-loop.mp4',
    'assets/lanyard/card-front.webp',
    'assets/lanyard/card-back.webp',
    'assets/lanyard/band.webp',
    'assets/gallery/01-fachada-comercial.webp',
  ]) {
    expect(local.some((u) => u.endsWith(`/master-frio-demo/${asset}`)), asset).toBe(true)
  }
  // Nenhuma imagem quebrada
  const broken = await page.evaluate(() =>
    [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src),
  )
  expect(broken).toEqual([])
  expect(failed).toEqual([])
  expect(errors).toEqual([])
})

test('âncoras internas funcionam sob a base e não saem do subdiretório', async ({ page }) => {
  await page.goto('./')
  await page.locator('.nav-links a[href="#servicos"]').click()
  await page.waitForTimeout(1200)
  expect(new URL(page.url()).pathname).toBe('/master-frio-demo/')
  const top = await page.locator('#servicos').evaluate((el) => el.getBoundingClientRect().top)
  expect(top).toBeLessThan(140)
})
