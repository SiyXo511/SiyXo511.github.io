// 文章相关的公共函数：所有需要“已发布文章”的页面都从这里取，保证规则只有一份
import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

// 已发布的文章（过滤掉草稿），按创建时间从新到旧排序
export async function getPublishedPosts(): Promise<Post[]> {
  const published = await getCollection('posts', (post) => !post.data.draft);
  return published.sort((a, b) => b.data.createdAt.valueOf() - a.data.createdAt.valueOf());
}
