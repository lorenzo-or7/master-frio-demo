// Capturas por viewport: node scripts/shots.mjs <url> <saida> [larguraxaltura ...] [--full] [--scroll=y] [--theme=day]
import { chromium } from '@playwright/test'
const [url, out, ...rest] = process.argv.slice(2)
const full = rest.includes('--full')
const scroll = Number((rest.find((a) => a.startsWith('--scroll=')) || '--scroll=0').split('=')[1])
const theme = (rest.find((a) => a.startsWith('--theme=')) || '').split('=')[1]
const reduced = rest.includes('--reduced')
const sizes = rest.filter((a) => /^\d+x\d+$/.test(a))
const browser = await chromium.launch({ channel: 'chrome' })
for (const s of sizes) {
  const [w, h] = s.split('x').map(Number)
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, reducedMotion: reduced ? 'reduce' : 'no-preference', hasTouch: w < 768, isMobile: w < 768 })
  if (theme) await ctx.addInitScript((t) => localStorage.setItem('mf-theme', t), theme)
  const page = await ctx.newPage()
  page.on('console', (m) => (m.type() === 'error' || m.type() === 'warning') && console.log(`[${s}] ${m.type()}: ${m.text()}`))
  page.on('pageerror', (e) => console.log(`[${s}] pageerror: ${e.message}`))
  await page.goto(url, { waitUntil: 'networkidle' })
  if (full) {
    // percorre a página para disparar reveals únicos
    const H = await page.evaluate(() => document.body.scrollHeight)
    for (let y = 0; y < H; y += Math.floor(h * 0.7)) { await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: 'instant' }), y); await page.waitForTimeout(140) }
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' })); await page.waitForTimeout(800)
  }
  if (scroll) { await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), scroll); await page.waitForTimeout(1200) }
  else await page.waitForTimeout(1500)
  const extra = Number((rest.find((a) => a.startsWith('--wait=')) || '--wait=0').split('=')[1]); if (extra) await page.waitForTimeout(extra)
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
  console.log(`[${s}] overflowX=${overflow}`)
  await page.screenshot({ path: `${out}-${s}.png`, fullPage: full })
  await ctx.close()
}
await browser.close()
