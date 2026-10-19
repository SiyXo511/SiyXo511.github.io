// @ts-check
import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import { katexPlugin } from './src/plugins/katex.mjs';

export default defineConfig({
  // 网站上线后的完整地址：生成 RSS、sitemap、绝对链接时会用到
  site: 'https://siyxo511.github.io',

  markdown: {
    // Astro 7 默认的 Markdown 处理器是 Sätteri：开启公式解析，再用自己的插件把公式渲染成 HTML
    processor: satteri({
      features: { math: true },
      mdastPlugins: [katexPlugin],
    }),
  },
});
