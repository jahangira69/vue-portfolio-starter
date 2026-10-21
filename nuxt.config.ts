export default defineNuxtConfig({
  compatibilityDate: '2026-10-01',
  srcDir: '.',
  devtools: { enabled: false },
  vite: { server: { allowedHosts: ['terminal.local'] } },
  css: ['~/assets/css/main.css'],
  typescript: { strict: true },
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      link: [{ rel: 'icon', type: 'image/svg+xml', href: `${process.env.NUXT_APP_BASE_URL || '/'}icons/favicon.svg` }],
      meta: [{ name: 'theme-color', content: '#f8f7f4' }]
    }
  },
  nitro: { compressPublicAssets: true },
  runtimeConfig: { public: { siteUrl: process.env.NUXT_PUBLIC_SITE_URL || '' } }
})
