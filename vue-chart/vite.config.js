import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false,
        ws: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    // Vitest 구성
    globals: true,            // Jest와 유사한 전역 테스트 함수 사용 가능
    environment: 'happy-dom', // 테스트 환경
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'], // 테스트 파일 패턴
    coverage: {
      reporter: ['text', 'json', 'html'], // 커버리지 리포터 형식
      exclude: [
        'node_modules/',
        'src/assets/',
        'dist/',
        'public/',
        'src/main.js',
        '**/*.d.ts',
      ],
    },
    setupFiles: ['./src/test/setup.js'] // 테스트 셋업 파일
  }
})