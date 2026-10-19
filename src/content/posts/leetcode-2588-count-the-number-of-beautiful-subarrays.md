---
title: '2588. 统计美丽子数组数目'
category: 笔记
column: leetcode
description: '消去操作等价于异或，问题转化为统计异或和为 0 的子数组'
createdAt: 2026-10-17
tags: [位运算, 前缀和, 哈希表]
---

题目：[2588. 统计美丽子数组数目](https://leetcode.cn/problems/count-the-number-of-beautiful-subarrays/)（每日一题）

![题目截图](/images/leetcode/2588-1.png)

题目所允许的操作简单来说就是如果两个num的二进制第k位都为1就可以消去，这个操作和异或很像，所以这题可以很直接去使用位运算。同时扩展到多位的情况，如果两个num的二进制多个位都同为1，则可以一起消去，并且任意两个num的消去顺序不影响结果，这完全就是异或操作！题目可以直接转变成计算区间的num异或结果为0的数目。

所以这道题我们可以使用前缀和prefix记录和前面的num全部进行异或后的结果，然后将这之前的prefix里异或为0的数目进行累加，得出最终结果。

> 两个异或结果为0则他们的数值是相等的

```go
func beautifulSubarrays(nums []int) int64 {
	n := len(nums)
	prefix := make([]int, n+1)
	rec := make(map[int]int)
	rec[0] = 1 // 如果当前前缀异或结果已经为0则需要+1
	ans := 0
	for i := 0; i < n; i++ {
		prefix[i+1] = prefix[i] ^ nums[i]
		if cnt, exists := rec[prefix[i+1]]; exists {
			ans += cnt
		}
		rec[prefix[i+1]]++
	}
	return int64(ans)
}
```
