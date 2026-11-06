// Smoke test de uma URL publicada: node scripts/smoke-remote.mjs <url>
import { chromium } from '@playwright/test'
const url = process.argv[2]
const b = await chromium.launch({ channel: 'chrome' })
const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
const bad = [], errors = [], reqs = []
p.on('response', (r) => { reqs.push(r.url()); if (r.status() >= 400) bad.push(`${r.status()} ${r.url()}`) })
p.on('requestfailed', (r) => bad.push(`FAIL ${r.failure()?.errorText} ${r.url()}`))
p.on('pageerror', (e) => errors.push(e.message))
p.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
await p.goto(url, { waitUntil: 'networkidle' })
const H = await p.evaluate(() => document.body.scrollHeight)
for (let y = 0; y < H; y += 600) { await p.evaluate((yy) => scrollTo({ top: yy, behavior: 'instant' }), y); await p.waitForTimeout(120) }
await p.waitForTimeout(4000)
const info = await p.evaluate(async () => ({
  font: document.fonts.check('700 16px "Spline Sans"'),
  video: (() => { const v = document.querySelector('video'); return v ? { src: v.currentSrc, ready: v.readyState, paused: v.paused } : null })(),
  canvas: !!document.querySelector('.lanyard-region canvas'),
  og: document.querySelector('meta[property="og:image"]')?.getAttribute('content'),
  robots: document.querySelector('meta[name="robots"]')?.getAttribute('content'),
  brokenImgs: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src),
}))
console.log(JSON.stringify({ requests: reqs.length, bad, errors, ...info }, null, 1))
await b.close()
