// Medição de laboratório: LCP, CLS, INP aproximado (Event Timing), bytes transferidos e custo do Lanyard.
// Uso: node scripts/perf.mjs <url> [--slow]   (--slow = Slow 4G + CPU 4×, via CDP)
import { chromium } from '@playwright/test'

const [url, ...flags] = process.argv.slice(2)
const slow = flags.includes('--slow')
const mobile = flags.includes('--mobile')
const runs = 3
const results = []

const browser = await chromium.launch({ channel: 'chrome' })
for (let r = 0; r < runs; r++) {
  const ctx = await browser.newContext(
    mobile
      ? { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3 }
      : { viewport: { width: 1440, height: 900 } },
  )
  const page = await ctx.newPage()
  const cdp = await ctx.newCDPSession(page)
  await cdp.send('Network.enable')
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true })
  if (slow) {
    await cdp.send('Network.emulateNetworkConditions', {
      offline: false,
      latency: 150,
      downloadThroughput: (1.6 * 1024 * 1024) / 8,
      uploadThroughput: (750 * 1024) / 8,
    })
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
  }
  const bytes = { initial: 0, lanyard: 0, video: 0 }
  let phase = 'initial'
  cdp.on('Network.loadingFinished', (e) => {
    bytes[phase] += e.encodedDataLength
  })
  cdp.on('Network.responseReceived', (e) => {
    if (e.response.url.endsWith('.mp4')) bytes.videoUrl = true
  })
  await page.addInitScript(() => {
    window.__vitals = { lcp: 0, cls: 0, inp: 0 }
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) window.__vitals.lcp = e.startTime
    }).observe({ type: 'largest-contentful-paint', buffered: true })
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) if (!e.hadRecentInput) window.__vitals.cls += e.value
    }).observe({ type: 'layout-shift', buffered: true })
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) if (e.interactionId) window.__vitals.inp = Math.max(window.__vitals.inp, e.duration)
    }).observe({ type: 'event', durationThreshold: 16, buffered: true })
  })
  const t0 = Date.now()
  await page.goto(url, { waitUntil: 'load', timeout: 120_000 })
  const loadMs = Date.now() - t0
  await page.waitForTimeout(slow ? 6000 : 2500)
  // Interações reais para o INP: tema e navegação pelo menu/âncora.
  await page.getByRole('button', { name: /Ativar tema/ }).first().click()
  await page.waitForTimeout(400)
  await page.getByRole('button', { name: /Ativar tema/ }).first().click()
  await page.waitForTimeout(400)
  // Percorre a página até o Contato (carrega o Lanyard) e mede o custo.
  phase = 'lanyard'
  const H = await page.evaluate(() => document.body.scrollHeight)
  for (let y = 0; y < H; y += 700) {
    await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: 'instant' }), y)
    await page.waitForTimeout(slow ? 250 : 80)
  }
  await page.evaluate(() => document.querySelector('#contato')?.scrollIntoView({ behavior: 'instant' }))
  await page.waitForSelector('.lanyard-canvas.is-ready', { timeout: 120_000 }).catch(() => null)
  // Espera o crachá assentar (brisa ~7 s + amortecimento ~3 s) antes de contar os quadros parado.
  await page.waitForTimeout(12_000)
  // Chamadas de desenho do Lanyard em 10 s com o crachá parado (mede se o loop de render assenta).
  const frames = await page.evaluate(
    () =>
      new Promise((resolve) => {
        const canvas = document.querySelector('.lanyard-region canvas')
        if (!canvas) return resolve(null)
        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
        let n = 0
        const orig = gl.drawElements.bind(gl)
        gl.drawElements = (...a) => {
          n++
          return orig(...a)
        }
        setTimeout(() => resolve(n), 10_000)
      }),
  )
  const vitals = await page.evaluate(() => window.__vitals)
  const heap = await page.evaluate(() => performance.memory?.usedJSHeapSize ?? null)
  results.push({ ...vitals, loadMs, bytes, framesIn10s: frames, heapMB: heap ? +(heap / 1048576).toFixed(1) : null })
  await ctx.close()
}
await browser.close()

const med = (k) => {
  const v = results.map((r) => r[k]).sort((a, b) => a - b)
  return v[Math.floor(v.length / 2)]
}
console.log(
  JSON.stringify(
    {
      url,
      perfil: `${mobile ? 'mobile 390×844 DPR3' : 'desktop 1440×900'}${slow ? ' · Slow 4G + CPU 4×' : ' · sem limitação'}`,
      mediana_de: runs,
      LCP_ms: Math.round(med('lcp')),
      CLS: +med('cls').toFixed(4),
      INP_aprox_ms: Math.round(med('inp')),
      KB_carga_inicial: Math.round(results[1].bytes.initial / 1024),
      KB_ao_rolar_ate_contato: Math.round(results[1].bytes.lanyard / 1024),
      draws_Lanyard_10s_parado: results.map((r) => r.framesIn10s),
      heapJS_MB: med('heapMB'),
    },
    null,
    1,
  ),
)
