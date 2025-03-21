import { defineConfig } from 'vite';

export default defineConfig({
  base: '/ttt/', // 替换为你的仓库名称
  build: {
    outDir: 'dist', // 构建输出目录
    assetsDir: 'assets', // 静态资源目录
  },
});