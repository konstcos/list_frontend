import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'url';
import Components from 'unplugin-vue-components/vite';
import { PrimeVueResolver } from '@primevue/auto-import-resolver';


// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const outDir = env.VITE_OUT_DIR || 'dist'

  return {
    plugins: [
      vue(),
      Components({
        resolvers: [
          PrimeVueResolver()
        ]
      }),
    ],
    root: '.',
    base: command === 'serve' ? '/' : '/dist/',
    build: {
      outDir: outDir,
      emptyOutDir: true,
    },
  };
});
