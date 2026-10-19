---
title: '974. 和可被 K 整除的子数组'
category: 笔记
column: leetcode
description: '前缀和 + 哈希表统计同余数量，并把负余数归一到 [0, k)'
createdAt: 2026-10-16
tags: [前缀和, 哈希表]
---

题目：[974. 和可被 K 整除的子数组](https://leetcode.cn/problems/subarray-sums-divisible-by-k/)（每日一题）

![题目截图](/images/leetcode/974-1.png)

题目要求找出所有可以被k整除的子数组的数目，可以通过罗列所有子数组的组合，然后判断是否被k整除来获得答案，时间复杂度为o(n^2)，提交会超时。

切换一种思路，我们想要的其实就是一个右端点和左端点之间的和对k的余数，只要余数为0，这个子数组就是有效的，所有这里我们可以使用前缀和来实现，使用前缀和获取以右端点为终端所有子数组的和，然后遍历右端点，找到所有这个右端点前面的前缀和减去之后余数为0的数量，相加即可得到最终答案。为了避免超时，我们可以使用哈希表来实现o(1)搜索，最终时间复杂度为o(n)，空间复杂度为o(n)。

这里要注意的是，搜索的时候要考虑前后两种情况，一种是向前增加成为k的倍数(k - prefix\[i\]%k)，另一种是向后减少成为k的倍数(prefix\[i\]%k -k)，并且如果两种情况的数值相等时只能选取一种情况。

```go
func subarraysDivByK(nums []int, k int) int {
	n := len(nums)
	ans := 0
	prefix := make([]int, n+1)
	for i := 0; i < n; i++ {
		prefix[i+1] = prefix[i] + nums[i]
	}
	cnt := make(map[int]int)
	cnt[0] = 1
	for i := 0; i < n; i++ {
		a := (prefix[i+1] % k - k) % k
		b := (prefix[i+1] % k + k) % k
		if c, exists := cnt[a]; exists {
			ans += c
		}
		if c, exists := cnt[b]; a != b && exists{
			ans += c
		}
		cnt[prefix[i+1]%k]++
	}
	return ans
}
```

这里可以进一步简化一下，因为现在我们还在考虑正负，导致需要分情况讨论，这里我们可以将\[-k, k\]的范围归一到\[0, \k]，具体做法就是在上面的基础上将负数部分也+k%k。这样修改之后和刚才是等效的，因为刚才的时候哈希表的范围也是\[-k, k\]，现在我们把他的范围也归一一下，对应的负数部分的数值添加到了对应地方，避免了既在正数范围找，也在负数范围找。
```go
func subarraysDivByK(nums []int, k int) int {
	n := len(nums)
	ans := 0
	prefix := make([]int, n+1)
	for i := 0; i < n; i++ {
		prefix[i+1] = prefix[i] + nums[i]
	}
	cnt := make(map[int]int)
	cnt[0] = 1
	for i := 0; i < n; i++ {
		b := (prefix[i+1] % k + k) % k
		if c, exists := cnt[b]; exists {
			ans += c
		}
		cnt[b]++
	}
	return ans
}
```
