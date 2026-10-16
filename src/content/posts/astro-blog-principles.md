---
title: 用 Astro 搭博客：从原理到几个小巧思
category: 笔记
description: 用 Astro 从零搭这个博客的过程中，我想明白的几件事。
createdAt: 2026-10-13
tags:
  - Astro
  - 博客
draft: false
---

即将要找工作了，但是我发现我并没有什么可以展示的东西，因此打算做一个博客，添加一些可以展示的东西。这里我选择了Astro框架来搭建，Claude 当时给了我几个选项，分别是Astro、Next.js、纯HTML和Hugo/VitePress，在当时看来Astro是很适合的，几乎提供了我所需要的一切。

## 先介绍一下 Astro

### Astro 是什么

Astro是一个专为内容驱动型网站优化的现代Web 框架，.astro文件主要由两部分组成，一部分是组件脚本，被代码栅栏包裹，也叫做Frontmatter，另一部分是组件模板。组件脚本用来导入依赖、获取数据、接收组件属性和进行计算与模板逻辑，它本质上是只在服务端或者构建期执行的js或ts代码，执行之后会生成静态html页面，至此组件脚本的任务就完成了。同时Astro采用服务器优先(Server-First)的模式，渲染尽可能发生在构建期的服务器端，从而给客户端带来极高的响应速度，减轻性能压力。

Astro的零js的准确含义是组件脚本里的js会在构建之后消失，而模板里的script脚本和带client:\*的岛屿组件仍然会保留，变成客户端代码。

|  | 组件脚本 `---` | 模板里的 `<script>` |
| --- | --- | --- |
| 在哪运行 | 构建时，在服务器或我的电脑上 | 在读者的浏览器里 |
| 最后还在吗 | 不在了，只留下它算出来的 HTML | 在，被打包后放进 HTML |
| 例子 | `getStaticPaths`、`isActive` | 深浅色切换按钮的点击事件 |

此外，Astro还有一些特性：

1. 群岛架构
群岛架构是一种新的前端架构模式，核心是将大部分页面渲染成快速且静态的HTML，只在页面上需要交互的部分添加JavaScript。这里可以想象成在大量HTML的海洋上存在一些JavaScript群岛，这种设计模式对博客系统特别适合，因为博客并不涉及大量且复杂的交互，更多的是展示功能，通过静态HTML和CSS可以完成绝大部分功能。
2. UI框架无关
 Astro 支持在同一个项目里混用 React、Vue、Svelte 等框架的组件，也可以只用 .astro 组件。默认情况下，这些框架组件都只在构建时渲染成静态 HTML。只有加上 client:load、client:visible 等 client:\* 指令的框架组件，才会成为岛屿，在浏览器里各自加载、互不影响。.astro 组件本身不能成为岛屿，需要交互时要靠模板里的 <script>，比如本站的深浅色切换按钮。
3. 内置Markdown支持
 .md 文件放进内容集合后，Astro 会在构建时把它编译成 HTML，不需要额外装插件。配合内容集合的 schema，frontmatter 写错了（比如 category 写成不存在的分类）会直接构建失败，而不是悄悄生成一个出错的页面。

### 和Next.js 最大的区别是什么

Next.js是全栈React框架，专为构建复杂的动态Web应用而设计，适合高度动态交互、重度依赖用户登录态、复杂逻辑和状态管理的项目（比如SaaS平台、电商、社交、内部管理系统）。

> 其实从这里就可以看出来，Next.js对于构建博客来说是大材小用，无法发挥Next.js的最大价值。

Next.js与Astro的根本差异是设计目标的不同：Astro追求以内容为中心，而Next.js追求以应用为中心，本质是React应用的服务器增强版。

| **比较维度** | **Astro** | **Next.js** |
| --- | --- | --- |
| **核心定位** | 内容驱动型网站（博客、文档、营销站） | 复杂交互型应用（SaaS、仪表盘、电商系统） |
| **客户端 JS 负载** | **默认 0 KB JS**，仅为显式声明的交互岛屿打包 JS | **默认携带 React 运行时**，即使静态页面也会下载水合代码 |
| **UI 框架绑定** | **框架无关**（可混用 React、Vue、Svelte 或只用纯 HTML/CSS） | **严格绑定 React** 生态 |
| **架构模式** | \*\*[群岛架构](https://docs.astro.build/zh-cn/concepts/islands/)\*\*（静态 HTML 海洋 + 局部独立岛屿） | **整树水合 / RSC 树**（服务端组件与客户端组件树交织） |
| **开发与维护复杂度** | 简单直观，模板语法接近原生 HTML，开箱即用 Markdown | 概念较重（Server/Client Components 边界、复杂的缓存与刷新机制） |

## 页面是如何出现的

首先我们看一下Astro简化后的部分内部逻辑，可以看到它会固定扫描src/pages下的文件，渲染成HTML文件。

1. 遇到文件名带方括号的动态路由文件（如 [id].astro），先调用它导出的 getStaticPaths 拿到页面清单，再按每一项的 params 决定路径、把 props 传给模板，逐个渲染成 HTML。
2. 普通astro文件直接进行渲染得到html文件

这种"我只提供函数，由框架来决定什么时候调用"的模式叫控制反转（Inversion of Control）。好莱坞原则："别打电话给我们，我们会打给你"。React 的组件函数、Express 的路由回调，也都是这个思路。

```ts
// ↓ 这是 Astro 内部的逻辑（伪代码），不在项目里
for (const pageFile of 扫描('src/pages')) {          // 找到 posts/[id].astro
  const page = await import(pageFile);

  if (文件名里有方括号) {
    const list = await page.getStaticPaths();        // ① 调用导出的函数
    // list = [{ params: { id: 'hello-world' }, props: { post } }]

    for (const item of list) {                        // ② 遍历清单
      const html = await 渲染(page, {
        params: item.params,                          // → Astro.params
        props:  item.props,                           // → Astro.props  ← 模板里拿到的 post 就是这里来的
      });
      写文件(`dist/posts/${item.params.id}/index.html`, html);  // ③ 落盘
    }
  } else {
    写文件(..., await 渲染(page, {}));                // about.astro 这种：只渲染一次
  }
}
```

> **① 构建时（`npm run build`，在我的电脑或 GitHub 的服务器上）**
> - 内容集合读取 `src/content/posts/*.md`，用 schema 校验 frontmatter
> - `[id].astro` 的 `getStaticPaths` 返回所有文章的 id → 决定要生成哪些页面
> - 对每篇文章：运行 `---` 里的代码 → `render()` 把 Markdown 变成 HTML → 套进 `PostMeta`、`BaseLayout` 等组件
> - 组件里的 `<style>` 被加上作用域，`<script>` 被转成 JS、打包压缩
> - 最终产出一个文件：`dist/posts/hello-world/index.html`
>
> **② 部署时**
> - GitHub Actions 把 `dist/` 整个上传到 GitHub Pages
>
> **③ 访问时（在读者的浏览器里）**
> - 浏览器请求 `/posts/hello-world` → 服务器直接把那个 HTML 文件返回（没有任何计算）
> - 浏览器从上往下读 HTML：`<head>` 里的 `is:inline` 脚本立刻执行（设置主题）→ HTML解析完后执行打包好的 `<script>`（给切换按钮绑定点击事件）

## 后台管理

为了可以发布、修改以及删除文章，我使用了一个CMS搭建了一个后台。首先介绍一下CMS(Content Management System，即内容管理系统)，简单来说CMS就是不用写代码也能管理网站内容的后台，CMS有两类，一类是像WordPress这种的传统CMS，他们的内容保存在服务器的数据库上，需要服务器时刻运行；另一类是像Sveltia这种的Git-based CMS，他们的内容就是仓库的.md文件，使用git来追踪管理，后台管理页面本质上也是一个静态页面，放在网站的某个路径下就可以使用，当内容修改时通过github api推送到github，github action会重新构建并部署。因为github pages也不能运行服务器，这里我使用的Sveltia CMS作为我的后台，就博客而言已经足够使用了。

具体接入需要三步：

1. 需要一个index.html的页面，可以放在/public/admin下，文件只引入sveltia的脚本。放在/public是因为astro会原样复制这里的文件，不会套上博客的样式。
2. 提供config.yml，config.yml需要与astro保持相同的schema，因为sveltia会根据config.yml生成表单，如果不一致会导致astro在构建时校验失败。
3. 获取github access token，在[https://github.com/settings/personal-access-tokens/new](https://github.com/settings/personal-access-tokens/new)中填入过期时间、对应的博客仓库和Contents的Read和Write权限获取token。然后打开后台填入后进入后台页面。

> 不要在公共电脑登录这个token，因为它保存在浏览器中

## 小巧思

#### 1. 避免重新加载页面时因为主题切换导致的闪烁

闪烁发生的原因是获取页面主题方案发生在渲染页面后，而页面默认渲染的主题时和当前选择的主题方案不一致，导致它会先渲染预设方案的页面，然后按照选择的方案再画一次。

解决方法是改变主题切换的时机，在渲染页面前获取当前选择的方案，避免二次渲染。

>这段 script 能在页面画出来之前执行，靠的是两点：一是它放在 <head> 里，浏览器读到就会立即执行，这时 <body> 还没开始渲染；二是加了 is:inline，Astro 不会把它打包成 type="module" 脚本。module 脚本会推迟到 HTML 解析完才执行，那时页面可能已经用默认主题画出来了。

```html
<script is:inline>
	try {
		const saved = localStorage.getItem('theme');
		if (saved === 'light' || saved === 'dark') {
			document.documentElement.dataset.theme = saved;
		}
	} catch {}
</script>
```

#### 2. 分栏匹配

当点进一个栏目之后，让这个栏目高亮可以帮助提示当前的位置，但分栏匹配具体实现起来也很有意思，因为大多数网站都会将/路径作为首页，仅仅使用前缀匹配会导致首页栏一直高亮，因此对于/需要进行特殊判断，同时还需要考虑某个栏目是另一个路径的前缀问题，比如/posts 和 /posts-old。

解决方法是首先对/进行特判，判断分栏href和当前path是否都是/。然后确定在分栏href末尾添加/，再使用startswith进行匹配。

```ts
// 判断某个导航项是否对应当前页面，用来高亮
function isActive(href: string): boolean {
	if(href === '/') {
		return href === currentPath;
	} else {
		return currentPath === href || currentPath.startsWith(href + '/');
	}
}
```
