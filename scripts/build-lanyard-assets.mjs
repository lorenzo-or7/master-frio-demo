// Gera as texturas otimizadas do Lanyard a partir das matrizes em assets-src/lanyard/.
//  - card-back: substitui SOMENTE a região do QR por um QR determinístico (biblioteca `qrcode`, ECC H)
//    apontando para o Instagram, no mesmo estilo (módulos arredondados #002D76 + ícone central).
//  - Exporta WebP (frente, verso, fita) e um PNG sem perdas do verso para verificação do QR.
// Uso: node scripts/build-lanyard-assets.mjs   (requer o Google Chrome instalado)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { chromium } from '@playwright/test'
import QRCode from 'qrcode'

const SRC = 'assets-src/lanyard'
const OUT = 'public/assets/lanyard'
const URL_IG = 'https://www.instagram.com/masterfrio2026/'
const INK = '#002d76'

const qr = QRCode.create(URL_IG, { errorCorrectionLevel: 'H' })
const size = qr.modules.size
const bits = Array.from(qr.modules.data)

const toDataUrl = (file) => `data:image/png;base64,${readFileSync(`${SRC}/${file}`).toString('base64')}`

const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage()
const result = await page.evaluate(
  async ({ front, back, band, size, bits, INK }) => {
    const load = async (src) => {
      const img = new Image()
      img.src = src
      await img.decode()
      return img
    }
    const canvasOf = (img) => {
      const c = document.createElement('canvas')
      c.width = img.width
      c.height = img.height
      c.getContext('2d').drawImage(img, 0, 0)
      return c
    }
    const b64 = (c, type, q) => c.toDataURL(type, q).split(',')[1]

    // ---------- Verso: nova região do QR ----------
    const backImg = await load(back)
    const c = canvasOf(backImg)
    const x = c.getContext('2d')
    // Região original do QR: x 170→914, y 297→1016. Centro ~ (542, 657).
    const cx = 542
    const cy = 657
    const qrPx = 680 // lado do QR (sem a zona de silêncio)
    const m = qrPx / size
    const quiet = m * 4

    // Limpa a região antiga com um painel claro de bordas suaves (funde com o degradê do fundo).
    const pad = 22
    const L = 150 - pad, T = 268 - pad, R = 935 + pad, B = 1044 + pad
    const grad = x.createRadialGradient(cx, cy, 300, cx, cy, 520)
    grad.addColorStop(0, '#ffffff')
    grad.addColorStop(1, 'rgba(255,255,255,0)')
    x.save()
    x.fillStyle = '#ffffff'
    x.filter = 'blur(14px)'
    x.beginPath()
    x.roundRect(cx - qrPx / 2 - quiet + 10, cy - qrPx / 2 - quiet + 10, qrPx + quiet * 2 - 20, qrPx + quiet * 2 - 20, 40)
    x.fill()
    x.restore()
    x.fillStyle = grad
    x.fillRect(L, T, R - L, B - T)
    x.fillStyle = '#ffffff'
    x.beginPath()
    x.roundRect(cx - qrPx / 2 - quiet * 0.75, cy - qrPx / 2 - quiet * 0.75, qrPx + quiet * 1.5, qrPx + quiet * 1.5, 36)
    x.fill()

    const ox = cx - qrPx / 2
    const oy = cy - qrPx / 2
    const isFinder = (r, col) =>
      (r < 7 && col < 7) || (r < 7 && col >= size - 7) || (r >= size - 7 && col < 7)
    // Reserva central para o ícone (7×7 módulos — ~3,6% da área, dentro da tolerância do ECC H).
    const logoMods = 7
    const lo = Math.floor((size - logoMods) / 2)
    const inLogo = (r, col) => r >= lo - 1 && r < lo + logoMods + 1 && col >= lo - 1 && col < lo + logoMods + 1

    x.fillStyle = INK
    for (let r = 0; r < size; r++) {
      for (let col = 0; col < size; col++) {
        if (!bits[r * size + col] || isFinder(r, col) || inLogo(r, col)) continue
        // Módulo: quadrado de cantos arredondados (mantém a leitura "em pontos" e preenche bem a célula).
        x.beginPath()
        x.roundRect(ox + col * m + m * 0.05, oy + r * m + m * 0.05, m * 0.9, m * 0.9, m * 0.32)
        x.fill()
      }
    }
    // Padrões de localização arredondados (mesma linguagem do original).
    const finder = (col, r) => {
      const px = ox + col * m
      const py = oy + r * m
      x.fillStyle = INK
      x.beginPath()
      x.roundRect(px, py, 7 * m, 7 * m, 1.6 * m)
      x.fill()
      x.fillStyle = '#ffffff'
      x.beginPath()
      x.roundRect(px + m, py + m, 5 * m, 5 * m, 1.1 * m)
      x.fill()
      x.fillStyle = INK
      x.beginPath()
      x.roundRect(px + 2 * m, py + 2 * m, 3 * m, 3 * m, 0.9 * m)
      x.fill()
    }
    finder(0, 0)
    finder(size - 7, 0)
    finder(0, size - 7)

    // Ícone do Instagram no centro (contorno, como no original).
    const s = logoMods * m
    const lx = ox + lo * m
    const ly = oy + lo * m
    x.strokeStyle = INK
    x.lineWidth = m * 0.95
    x.beginPath()
    x.roundRect(lx + m * 0.6, ly + m * 0.6, s - m * 1.2, s - m * 1.2, s * 0.26)
    x.stroke()
    x.beginPath()
    x.arc(lx + s / 2, ly + s / 2, s * 0.2, 0, Math.PI * 2)
    x.stroke()
    x.fillStyle = INK
    x.beginPath()
    x.arc(lx + s * 0.735, ly + s * 0.265, m * 0.55, 0, Math.PI * 2)
    x.fill()

    const backPng = b64(c, 'image/png')
    const backWebp = b64(c, 'image/webp', 0.9)

    // ---------- Frente e fita: apenas recodificação ----------
    const frontC = canvasOf(await load(front))
    const bandC = canvasOf(await load(band))

    // Decodificação do WebP gerado → PNG, para validar o QR exatamente como o navegador o recebe.
    const roundTrip = canvasOf(await load(`data:image/webp;base64,${backWebp}`))

    return {
      backPng,
      backWebp,
      backWebpAsPng: b64(roundTrip, 'image/png'),
      frontWebp: b64(frontC, 'image/webp', 0.9),
      bandWebp: b64(bandC, 'image/webp', 0.88),
    }
  },
  {
    front: toDataUrl('card-front.png'),
    back: toDataUrl('card-back.png'),
    band: toDataUrl('band.png'),
    size,
    bits,
    INK,
  },
)
await browser.close()

mkdirSync(OUT, { recursive: true })
mkdirSync('assets-src/lanyard/verificacao', { recursive: true })
writeFileSync(`${OUT}/card-back.webp`, Buffer.from(result.backWebp, 'base64'))
writeFileSync(`${OUT}/card-front.webp`, Buffer.from(result.frontWebp, 'base64'))
writeFileSync(`${OUT}/band.webp`, Buffer.from(result.bandWebp, 'base64'))
writeFileSync('assets-src/lanyard/verificacao/card-back-qr.png', Buffer.from(result.backPng, 'base64'))
writeFileSync('assets-src/lanyard/verificacao/card-back-webp-decodificado.png', Buffer.from(result.backWebpAsPng, 'base64'))
console.log(`QR versão ${qr.version} (${size}×${size} módulos), ECC H → ${URL_IG}`)
