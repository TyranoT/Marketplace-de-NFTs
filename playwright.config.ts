import { defineConfig, devices } from '@playwright/test'

/**
 * Os testes rodam contra a aplicação com mocks — a mesma que vai para o
 * deploy —, e não contra fixtures injetadas: o enunciado exige que o REST
 * passe pelos handlers do MSW e o tempo real pelo `socket.io-client`.
 *
 * `PLAYWRIGHT_BASE_URL` aponta para outro ambiente (o deploy, por exemplo);
 * sem ela, o próprio Playwright sobe o servidor de desenvolvimento.
 */
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000'

export default defineConfig({
  testDir: './e2e',
  /**
   * Um worker só: todas as abas de um contexto compartilham o
   * `localStorage` do banco simulado, e testes em paralelo na mesma origem
   * se atropelariam. Cada teste parte do cenário-semente pelo reset.
   */
  fullyParallel: false,
  workers: 1,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    locale: 'pt-BR',
  },
  expect: {
    /** Baselines estáveis: pequenas diferenças de antialiasing não reprovam. */
    toHaveScreenshot: { maxDiffPixelRatio: 0.02, animations: 'disabled' },
  },
  projects: [
    {
      name: 'desktop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
      },
    },
    /** O §8 pede 390, 768 e 1440: o tablet é onde o carrinho perdia o resumo. */
    {
      name: 'tablet',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 768, height: 1024 },
      },
    },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: 'npm run dev',
        url: BASE_URL,
        reuseExistingServer: true,
        timeout: 120_000,
      },
})
