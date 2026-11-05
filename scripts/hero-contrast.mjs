// Mede contraste real do texto da hero sobre vídeo + overlays (pior pixel = percentil 98 de luminância).
import { chromium } from '@playwright/test'
const lum = (r, g, b) => { const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4 }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b) }
const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
const TEXT = { title: [244, 248, 252], muted: [185, 205, 226] }
const b = await chromium.launch({ channel: 'chrome' })
for (const [w, h] of [[1440, 900], [1024, 768], [390, 844], [844, 390]]) {
  const page = await b.newPage({ viewport: { width: w, height: h } })
  await page.goto(process.argv[2] || 'http://localhost:4173', { waitUntil: 'networkidle' })
  const v = page.locator('video.hero-video')
  await v.evaluate((el) => new Promise((r) => (el.readyState >= 2 ? r() : el.addEventListener('loadeddata', r, { once: true }))))
  let worst = {}
  for (const t of [0.5, 2.5, 4.5, 6.5, 8.5]) {
    await v.evaluate((el, tt) => { el.pause(); el.currentTime = tt; return new Promise((r) => el.addEventListener('seeked', r, { once: true })) }, t)
    await page.waitForTimeout(150)
    const rects = await page.evaluate(() => {
      const pick = (s) => [...document.querySelectorAll(s)].map((e) => e.getBoundingClientRect().toJSON())
      const out = { title1: pick('.line-mask:first-child .line-inner'), title2: pick('.line-mask + .line-mask .line-inner'), support: pick('.hero-support') }
      document.querySelector('.hero-content').style.visibility = 'hidden'
      return out
    })
    const shot = await page.screenshot()
    await page.evaluate(() => (document.querySelector('.hero-content').style.visibility = ''))
    const stats = await page.evaluate(async ({ b64, rects }) => {
      const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode()
      const c = document.createElement('canvas'); c.width = img.width; c.height = img.height
      const x = c.getContext('2d'); x.drawImage(img, 0, 0)
      const res = {}
      for (const [k, list] of Object.entries(rects)) {
        const vals = []
        for (const r of list) { const d = x.getImageData(Math.max(0, r.x | 0), Math.max(0, r.y | 0), Math.max(1, r.width | 0), Math.max(1, r.height | 0)).data; for (let i = 0; i < d.length; i += 16) vals.push([d[i], d[i + 1], d[i + 2]]) }
        const L = (p) => { const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4 }; return 0.2126 * f(p[0]) + 0.7152 * f(p[1]) + 0.0722 * f(p[2]) }
        vals.sort((a, b) => L(a) - L(b))
        res[k] = vals[Math.floor(vals.length * 0.98)]
      }
      return res
    }, { b64: shot.toString('base64'), rects })
    for (const [k, px] of Object.entries(stats)) {
      const fg = k === 'title1' ? TEXT.title : TEXT.muted
      const r = ratio(lum(...fg), lum(...px))
      if (!worst[k] || r < worst[k].r) worst[k] = { r: +r.toFixed(2), t, px }
    }
  }
  console.log(`${w}x${h}`, JSON.stringify(worst))
  await page.close()
}
await b.close()
