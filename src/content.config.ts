// 内容集合配置：告诉 Astro 文章放在哪里、每篇文章的 frontmatter 长什么样
import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// 栏目：每个栏目是 src/content/columns/ 下的一个 .yml 文件，文件名就是栏目 id（也是网址）
const columns = defineCollection({
  loader: glob({ pattern: '**/*.yml', base: './src/content/columns' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
  }),
});

const posts = defineCollection({
  // 读取 src/content/posts/ 下所有 .md 文件，文件名就是文章的 id
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),

  // 每篇文章开头 --- 之间的 frontmatter 必须符合这个结构，否则构建时报错
  schema: z.object({
    title: z.string(),
    category: z.enum(['随笔', '笔记']),
    // 所属栏目（可选），填栏目文件名，例如 column: leetcode；填了不存在的栏目，构建会报错
    column: reference('columns').optional(),
    description: z.string().optional(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { columns, posts };
