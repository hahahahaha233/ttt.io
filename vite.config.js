import { defineConfig } from 'vite';

export default defineConfig({
  base: '/ttt/', // 替换为你的仓库名称
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
});