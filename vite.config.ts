import { paraglideVitePlugin } from '@inlang/paraglide-js'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react-swc'
import basicSsl from '@vitejs/plugin-basic-ssl'
import { ensureFileHasDefautCode } from './plugins/defaultFeatureFileContent'
import path from 'path'
import { defaultCodeFeature } from './plugins/default-code'

function DefaultFileContentPlugin(): Plugin {
  return {
    name: 'vite-plugin-default-file-content',
    handleHotUpdate({ file }) {
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        const fileName = path.basename(file, path.extname(file))
        const functionName = fileName
          .split(/[-_]/)
          .map(
            (word) =>
              word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
          )
          .join('')

        const targetDirs = [
          path.resolve(__dirname, 'src/presentation/features'),
        ]

        ensureFileHasDefautCode(
          file,
          defaultCodeFeature(functionName),
          targetDirs,
        )
      }
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiUrl = env.VITE_APP_API_URL || 'http://localhost:5226'

  return {
    plugins: [
      basicSsl(),
      paraglideVitePlugin({
        project: './project.inlang',
        outdir: './src/paraglide',
      }),
      tanstackRouter({
        target: 'react',
        autoCodeSplitting: true,
      }),
      react(),
      tailwindcss(),
      DefaultFileContentPlugin(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@paraglide': path.resolve(__dirname, './src/paraglide'),
        '@shared': path.resolve(__dirname, './src/shared'),
        '@application': path.resolve(__dirname, './src/application'),
        '@domain': path.resolve(__dirname, './src/domain'),
        '@infrastructure': path.resolve(__dirname, './src/infrastructure'),
        '@presentation': path.resolve(__dirname, './src/presentation'),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: apiUrl,
          changeOrigin: true,
          secure: false,
          // ngrok requires this header to bypass browser warning
          headers: {
            'ngrok-skip-browser-warning': 'true',
          },
        },
        '/files': {
          target: apiUrl,
          changeOrigin: true,
          secure: false,
          headers: {
            'ngrok-skip-browser-warning': 'true',
          },
        },
      },
    },
  }
})
