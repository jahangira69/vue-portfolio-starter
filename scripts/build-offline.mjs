import { build } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { resolve, dirname, extname } from 'node:path'
const root = fileURLToPath(new URL('..', import.meta.url))
const outDir = resolve(root, '.offline-build')
await build({
  configFile: false, root, plugins: [{
    name: 'inline-local-project-images', enforce: 'pre',
    async transform(code, id) {
      if (!id.endsWith('/content/projects.json')) return
      const items = JSON.parse(code)
      const mediaTypes = { '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.webp':'image/webp', '.gif':'image/gif', '.avif':'image/avif', '.svg':'image/svg+xml' }
      for (const item of items) {
        if (item.image && !/^https?:/.test(item.image)) {
          const local = resolve(root, 'public', item.image.replace(/^\.?\//, ''))
          if (!local.startsWith(resolve(root, 'public') + '/')) throw new Error('Project image must be inside public/')
          const mime = mediaTypes[extname(local).toLowerCase()]
          if (!mime) throw new Error('Unsupported project image format: ' + item.image)
          item.image = 'data:' + mime + ';base64,' + (await readFile(local)).toString('base64')
        }
      }
      return { code: JSON.stringify(items), map: null }
    }
  }, vue()],
  define: { 'process.env.NODE_ENV': JSON.stringify('production') },
  build: { outDir, emptyOutDir: true, assetsInlineLimit: 2000000, minify: true,
    lib: { entry: resolve(root, 'offline/main.ts'), name: 'JordanPortfolio', formats: ['iife'], fileName: () => 'portfolio.js' },
    cssCodeSplit: false
  }
})
const js = (await readFile(resolve(outDir, 'portfolio.js'), 'utf8')).replace(/<\/script/gi, '<\\/script')
const css = await readFile(resolve(outDir, 'jordan-shumate-portfolio.css'), 'utf8').catch(() => readFile(resolve(outDir, 'style.css'), 'utf8'))
const favicon = await readFile(resolve(root, 'public/icons/favicon.svg'), 'utf8')
const html = `<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#f8f7f4"><meta name="description" content="Jordan Shumate — independent software engineer. Projects, case studies, skills and experience."><title>Jordan Shumate — Software Engineer</title><link rel="icon" href="data:image/svg+xml,${encodeURIComponent(favicon)}"><style>${css}</style></head><body><div id="app"></div><noscript>Please enable JavaScript to view this interactive Vue portfolio.</noscript><script>${js}</script></body></html>`
const destination = process.argv[2] ? resolve(process.argv[2]) : resolve(root, 'Jordan-Shumate-Preview.html')
await mkdir(dirname(destination), { recursive: true })
await writeFile(destination, html)
console.log(`Offline preview written: ${destination} (${(Buffer.byteLength(html)/1024).toFixed(1)} KB)`)
