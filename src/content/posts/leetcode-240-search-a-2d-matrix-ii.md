---
title: '240. 搜索二维矩阵 II'
category: 笔记
column: leetcode
description: '从右上角出发，利用行列单调性每次排除一行或一列'
createdAt: 2026-10-13
tags: [矩阵, 双指针]
---

题目：[240. 搜索二维矩阵 II](https://leetcode.cn/problems/search-a-2d-matrix-ii/)（力扣 Hot100）

![题目截图](/images/leetcode/240-1.png)

题目的目标就是在这个m行n列的二维矩阵matrix中判断target是否存在。

这个矩阵是有序的，因此可以使用单调性来快速搜索target。核心思路是选取行最大列最小或者行最小列最大的一个点，然后根据与target的大小判断要移动行还是移动列。

这里我们选取行最大列最小的点，即矩阵右上角的这个点，我们记录他现在的位置，然后判断与target的大小，如果当前这个值大了，说明他比当前位置所在列的所有候选值都小，因此最后一列里面没有正确答案，所以需要向左移动去寻找。以图中的这个例子，我们会一直移动到4所在的位置。然后当前这个值小了，同理可以说明他比当前位置所在行的剩余候选项的所有值都大，所以需要向下移动继续寻找。重复这两个过程就可以找到目标值（如果有的话），没有的话当前行或者列就会超出范围。

总结一下这个过程其实就是不断拿掉已经排除选择的过程，是一种递归的思想，将大问题拆成小问题来解决。

```go
func searchMatrix(matrix [][]int, target int) bool {
	m := len(matrix)
	n := len(matrix[0])
	r := 0
	c := n-1
	for r < m && c >= 0{
		if matrix[r][c] == target {
			return true
		}
		if matrix[r][c] > target {
			c--
			continue
		}
		if matrix[r][c] < target {
			r++
			continue
		} 
	}
	return false
}
```
