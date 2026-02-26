import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages ではリポジトリ名を base に指定（要変更: リポジトリ名に合わせる）
const base = process.env.GITHUB_PAGES === 'true' ? '/shin-mitsumori-tool/' : '/'

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
})
