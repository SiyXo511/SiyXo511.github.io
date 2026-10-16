// RSS 订阅源：构建时生成 /rss.xml，读者用 RSS 阅读器订阅这个地址就能收到新文章
// 文件名 rss.xml.ts → 输出 rss.xml；导出 GET 表示这是一个"端点"，返回的不是 HTML 页面而是任意内容
import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPublishedPosts } from '../lib/posts';

export async function GET(context: APIContext) {
  const posts = await getPublishedPosts();

  return rss({
    title: '小莳的博客',
    description: '小莳的经历、随笔和知识笔记',
    // astro.config.mjs 里设置的 site，用来把 /posts/xxx 拼成完整网址
    site: context.site!,
    // 每篇文章转换成一条 RSS 条目
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.createdAt,
      link: `/posts/${post.id}`,
      description: post.data.description ?? '',
      // 分类和标签都放进去，阅读器可以按它们筛选
      categories: [post.data.category, ...post.data.tags],
    })),
    customData: '<language>zh-CN</language>',
  });
}
