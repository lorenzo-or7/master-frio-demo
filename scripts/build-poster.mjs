// Variante 1280×720 do pôster (mesma resolução do vídeo aprovado) para telas pequenas.
// Uso: node scripts/build-poster.mjs → public/assets/hero/master-frio-hero-poster-1280.webp
import { readFileSync, writeFileSync } from 'node:fs'
import { chromium } from '@playwright/test'
const SRC = 'public/assets/hero/master-frio-hero-poster.webp'
const b = await chromium.launch({ channel: 'chrome' })
const p = await b.newPage()
const out = await p.evaluate(async (src) => {
  const img = new Image(); img.src = src; await img.decode()
  const c = document.createElement('canvas'); c.width = 1280; c.height = 720
  const x = c.getContext('2d'); x.imageSmoothingQuality = 'high'; x.drawImage(img, 0, 0, 1280, 720)
  return c.toDataURL('image/webp', 0.82).split(',')[1]
}, `data:image/webp;base64,${readFileSync(SRC).toString('base64')}`)
writeFileSync('public/assets/hero/master-frio-hero-poster-1280.webp', Buffer.from(out, 'base64'))
await b.close()
