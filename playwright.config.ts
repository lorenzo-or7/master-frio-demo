import { defineConfig } from '@playwright/test'

// Usa o navegador instalado (Chrome por padrão; Edge com PW_CHANNEL=msedge) — sem baixar navegadores.
// Dois builds de produção: na raiz (/) e sob /master-frio-demo/ (mesma base do GitHub Pages).
export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  fullyParallel: true,
  workers: 4,
  reporter: [['list']],
  use: {
    // PW_CHANNEL=msedge roda a mesma suíte no Microsoft Edge instalado.
    channel: process.env.PW_CHANNEL ?? 'chrome',
    viewport: { width: 1440, height: 900 },
  },
  projects: [
    {
      name: 'raiz',
      testIgnore: /pages\.spec\.ts/,
      use: { baseURL: 'http://localhost:4173/' },
    },
    {
      name: 'pages',
      testMatch: /(pages|site)\.spec\.ts/,
      use: { baseURL: 'http://localhost:4174/master-frio-demo/' },
    },
  ],
  webServer: [
    {
      command: 'npm run build && npx vite preview --port 4173 --strictPort',
      url: 'http://localhost:4173/',
      reuseExistingServer: false,
      timeout: 180_000,
    },
    {
      command:
        'npx vite build --base=/master-frio-demo/ --outDir dist-pages && npx vite preview --base=/master-frio-demo/ --outDir dist-pages --port 4174 --strictPort',
      url: 'http://localhost:4174/master-frio-demo/',
      reuseExistingServer: false,
      timeout: 180_000,
    },
  ],
})
