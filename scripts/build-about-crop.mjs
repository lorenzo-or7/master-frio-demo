// Recorte editorial (sem upscale) da foto real 01 para a seção Sobre.
// Uso: node scripts/build-about-crop.mjs  → public/assets/gallery/about-01-detalhe.webp
import { readFileSync, writeFileSync } from 'node:fs'
import { chromium } from '@playwright/test'
const SRC = 'public/assets/gallery/01-fachada-comercial.webp'
const CROP = { x: 900, y: 640, w: 700, h: 875 } // 4:5, condensadora direita + suporte + tubulação
const b = await chromium.launch({ channel: 'chrome' })
const p = await b.newPage()
const out = await p.evaluate(async ({ src, c }) => {
  const img = new Image(); img.src = src; await img.decode()
  const cv = document.createElement('canvas'); cv.width = c.w; cv.height = c.h
  cv.getContext('2d').drawImage(img, c.x, c.y, c.w, c.h, 0, 0, c.w, c.h)
  return cv.toDataURL('image/webp', 0.9).split(',')[1]
}, { src: `data:image/webp;base64,${readFileSync(SRC).toString('base64')}`, c: CROP })
writeFileSync('public/assets/gallery/about-01-detalhe.webp', Buffer.from(out, 'base64'))
await b.close()
console.log('ok', CROP)
