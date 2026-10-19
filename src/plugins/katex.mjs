// Markdown 数学公式插件：Sätteri 开启 math 后，会把 $...$ 解析成 inlineMath 节点、$$...$$ 解析成 math 节点
// 这个插件在构建时用 KaTeX 把它们渲染成 HTML，读者的浏览器里不需要运行任何 JS
import { defineMdastPlugin } from 'satteri';
import katex from 'katex';

// 公式写错时不让整个构建失败，而是把出错的公式标红显示，方便发现
const options = { throwOnError: false };

export const katexPlugin = defineMdastPlugin({
  name: 'katex',
  // $$...$$：独占一行的公式，居中显示
  math(node) {
    return { type: 'html', value: katex.renderToString(node.value, { ...options, displayMode: true }) };
  },
  // $...$：嵌在文字里的公式
  inlineMath(node) {
    return { type: 'html', value: katex.renderToString(node.value, options) };
  },
});
