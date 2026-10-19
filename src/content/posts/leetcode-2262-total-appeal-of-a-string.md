---
title: '2262. 字符串的总引力'
category: 笔记
column: leetcode
description: '贡献法：把所有子串的引力和拆成每个位置的贡献之和'
createdAt: 2026-10-15
tags: [字符串, 贡献法]
---

题目：[2262. 字符串的总引力](https://leetcode.cn/problems/total-appeal-of-a-string/)（每日一题）

![题目截图](/images/leetcode/2262-1.png)

这道题我的第一思路是使用双重遍历+哈希表来做，不断枚举子字符串，将每个子字符串的引力相加得到结果，最终超时。

然后看了题解，题解的一个做法是通过计算每个字符对答案的贡献值来得出答案：因为我们要算的是子字符串中不同字符数量的个数，所以我们可以将字符串中每个元素的贡献相加得到答案。

具体来说，遍历到位置 `i` 的字符 `s[i]` 时：

1. **它能贡献多少次**：以 `i` 为起点的子字符串共有 `n - i` 个，这些子字符串都一定包含 `s[i]`，所以它至少能贡献 `n - i` 次。
    
2. **有多少子字符串能吃到这个贡献**：对于那些在 `i` 之前、且以某个与 `s[i]` 相同的字符结尾的子字符串，`s[i]` 不会作为“新的不同字符”被计入。因此，真正能额外吃到这份贡献的，是那些**以 `i` 结尾、且起点在最近一个相同字符之后**的子字符串。设上一个相同字符的位置为 `last`，那么这样的子字符串有 `i - last` 个。

![贡献法示意图](/images/leetcode/2262-2.png)

```go
func appealSum(s string) (ans int64) {
	n := len(s)
	last := [26]int{}
	for i := 0; i < 26; i++ {
		last[i] = -1
	}
	for i, c := range s {
		c -= 'a'
		if last[c] == -1 {
			ans += int64(n - i) * int64(i+1)
		} else {
			ans += int64(n - i) * int64(i - last[c])
		}
			last[c] = i
		}
	return
}
```
