---
title: '75. 颜色分类'
category: 笔记
column: leetcode
description: '计数排序两趟扫描，或用三个指针（荷兰国旗问题）一趟完成'
createdAt: 2026-10-21
tags: [数组, 计数排序, 双指针]
---

题目：[75. 颜色分类](https://leetcode.cn/problems/sort-colors/)（力扣 Hot100）

![题目截图](/images/leetcode/75-1.png)

方法一：计数

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
```

方法二：一趟扫描（荷兰国旗问题）

题目进阶要求只扫描一趟、只用常数空间，可以用三个指针：p0 指向下一个 0 该放的位置，p2 指向下一个 2 该放的位置，i 从左往右扫描。

遇到 0 时，把它和 p0 位置的数交换，p0 和 i 都后移；p0 位置的数之前已经被 i 扫描过，只可能是 0 或 1，换过来后不用再检查。

遇到 2 时，把它和 p2 位置的数交换，p2 前移，但 i 不动，因为从后面换过来的数还没有检查过。

遇到 1 时，i 直接后移。当 i 超过 p2 时，后面已经全是 2，扫描结束。
```go
func sortColors(nums []int) {
	p0, p2 := 0, len(nums)-1
	for i := 0; i <= p2; {
		switch nums[i] {
		case 0:
			nums[i], nums[p0] = nums[p0], nums[i]
			p0++
			i++
		case 2:
			nums[i], nums[p2] = nums[p2], nums[i]
			p2--
		default:
			i++
		}
	}
}
```
