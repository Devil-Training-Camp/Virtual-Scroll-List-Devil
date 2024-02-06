import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: './src/index.ts', // 入口文件路径
      name: 'my-react-virtual-list', // 模块名称
      fileName: (format) => {
        if (format === 'umd') return `my-virtual-list.cjs.js`;
        if (format === 'es') return `my-virtual-list.esm.js`;
      },
    },
    rollupOptions: {
      external: ['react', 'react-dom'], // 依赖于外部库
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
    outDir: 'dist'
  }
})
