// Gera o conjunto de capturas do relatório: node scripts/capture-set.mjs <baseURL> <pastaSaida>
import { chromium } from '@playwright/test'
const [base, out] = process.argv.slice(2)
const b = await chromium.launch({ channel: 'chrome' })
const shots = [
  { name: 'desktop-escuro-pagina', w: 1440, h: 900, theme: 'night', full: true },
  { name: 'desktop-claro-pagina', w: 1440, h: 900, theme: 'day', full: true },
  { name: 'mobile-escuro-pagina', w: 390, h: 844, theme: 'night', full: true, mobile: true },
  { name: 'mobile-claro-pagina', w: 390, h: 844, theme: 'day', full: true, mobile: true },
  { name: 'desktop-hero', w: 1440, h: 900, theme: 'night', at: null },
  { name: 'mobile-hero', w: 390, h: 844, theme: 'night', at: null, mobile: true },
  { name: 'desktop-servicos', w: 1440, h: 900, theme: 'night', at: '#servicos' },
  { name: 'mobile-servicos', w: 390, h: 844, theme: 'night', at: '#servicos', mobile: true },
  { name: 'desktop-galeria', w: 1440, h: 900, theme: 'night', at: '#trabalhos' },
  { name: 'mobile-galeria', w: 390, h: 844, theme: 'night', at: '#trabalhos', mobile: true },
  { name: 'desktop-processo', w: 1440, h: 900, theme: 'night', at: '#como-trabalhamos' },
  { name: 'desktop-contato', w: 1440, h: 900, theme: 'night', at: '#contato' },
  { name: 'mobile-contato', w: 390, h: 844, theme: 'night', at: '#contato', mobile: true },
  { name: 'desktop-rodape', w: 1440, h: 900, theme: 'night', at: 'bottom' },
  { name: 'mobile-rodape', w: 390, h: 844, theme: 'night', at: 'bottom', mobile: true },
]
for (const s of shots) {
  const ctx = await b.newContext({ viewport: { width: s.w, height: s.h }, isMobile: !!s.mobile, hasTouch: !!s.mobile })
  await ctx.addInitScript((t) => localStorage.setItem('mf-theme', t), s.theme)
  const p = await ctx.newPage()
  await p.goto(base, { waitUntil: 'networkidle' })
  await p.waitForTimeout(1600)
  const H = await p.evaluate(() => document.body.scrollHeight)
  if (s.full) {
    for (let y = 0; y < H; y += 500) { await p.evaluate((yy) => scrollTo({ top: yy, behavior: 'instant' }), y); await p.waitForTimeout(90) }
    await p.waitForTimeout(2500)
    await p.evaluate(() => scrollTo({ top: 0, behavior: 'instant' })); await p.waitForTimeout(700)
    await p.screenshot({ path: `${out}/${s.name}.png`, fullPage: true })
  } else {
    if (s.at === 'bottom') await p.evaluate(() => scrollTo({ top: 1e7, behavior: 'instant' }))
    else if (s.at) await p.evaluate((sel) => document.querySelector(sel).scrollIntoView({ behavior: 'instant' }), s.at)
    await p.waitForTimeout(s.at === '#contato' ? 4500 : 1400)
    await p.screenshot({ path: `${out}/${s.name}.png` })
  }
  await ctx.close()
}
await b.close()
console.log('ok', shots.length)
