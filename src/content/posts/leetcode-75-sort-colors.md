---
title: '75. 颜色分类'
category: 笔记
column: leetcode
description: '计数排序：先数出 0、1、2 各有几个，再按顺序依次填回数组'
createdAt: 2026-10-21
tags: [数组, 计数排序]
---

题目：[75. 颜色分类](https://leetcode.cn/problems/sort-colors/)（力扣 Hot100）

![题目截图](/images/leetcode/75-1.png)

题目要求将数组里元素按照0，1，2的顺序排放，所以这里可以统计0，1，2元素的数量，然后根据对应的数量在对应的位置填充相应的数字就可以了。
```go
func sortColors(nums []int) {
	r, w, b := 0, 0, 0
	for i := 0; i < len(nums); i++ {
		switch nums[i] {
		case 0:
			r++
		case 1:
			w++
		case 2:
			b++
		}
	}
	for i := 0; i < r; i++ {
		nums[i] = 0
	}
	for i := r; i < w+r; i++ {
		nums[i] = 1
	}
	for i := w+r; i < b+w+r; i++ {
		nums[i] = 2
	}
}
