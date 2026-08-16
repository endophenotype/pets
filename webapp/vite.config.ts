import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import autoprefixer from 'autoprefixer'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig, loadEnv } from 'vite'
import svgr from 'vite-plugin-svgr'

import { parsePublicEnv } from './src/lib/parsePublicEnv'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const vercelUrl = env.VERCEL_PROJECT_PRODUCTION_URL || env.VERCEL_URL
  env.HOST_ENV ||= env.VERCEL ? 'production' : ''
  env.SOURCE_VERSION ||= env.VERCEL_GIT_COMMIT_SHA || 'unknown'
  env.VITE_BACKEND_TRPC_URL ||= '/api/trpc'
  env.VITE_WEBAPP_URL ||= vercelUrl ? `https://${vercelUrl}` : ''
  env.VITE_CLOUDINARY_CLOUD_NAME ||= env.CLOUDINARY_CLOUD_NAME || ''
  const publicEnv = parsePublicEnv(env)

  return {
    plugins: [
      react(),
      svgr(),
      legacy({
        targets: ['> 0.01%'],
      }),
      env.HOST_ENV !== 'local'
        ? undefined
        : visualizer({
            filename: './dist/bundle-stats.html',
            gzipSize: true,
            brotliSize: true,
          }),
    ],
    css: {
      postcss: {
        plugins: [autoprefixer({})],
      },
    },
    build: {
      sourcemap: mode !== 'production',
      chunkSizeWarningLimit: 2000,
    },
    server: {
      port: +env.PORT,
    },
    preview: {
      port: +env.PORT,
    },
    define: {
      'process.env': publicEnv,
    },
  }
})
