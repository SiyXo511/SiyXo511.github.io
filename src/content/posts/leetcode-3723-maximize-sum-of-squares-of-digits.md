---
title: '3723. 数位平方和的最大值'
category: 笔记
column: leetcode
description: '和固定时，数字越集中平方和越大，所以从高位开始尽量填 9'
createdAt: 2026-10-14
tags: [贪心, 数学]
---

题目：[3723. 数位平方和的最大值](https://leetcode.cn/problems/maximize-sum-of-squares-of-digits/)（每日一题）

![题目截图](/images/leetcode/3723-1.png)

这题是一道很简单的数学题，只需要明白sum要如何分配才能使数位平方和最大就可以了。想一想就可以知道，要使平方和最大，就要每个数位尽可能出现大的数字，而不是被平分，这里其实可以把这个计算映射到二维平面上，以sum为9为例，9\*9其实就是横纵坐标都为9与坐标轴包围起来的面积，如果将sum进行分配，就相当于在对角线上移动，最终得到两个正方形的面积，从图中可以看到必然带来面积损失，因此这道题其实就是将前面的数字尽可能用9填满，旱的旱死涝的涝死。

![和为 9 时分配就是沿对角线移动的示意图](/images/leetcode/3723-2.png)

```go
func maxSumOfSquares(num int, sum int) string {
	if sum > num * 9 {
		return ""
	}
	ans := make([]byte, num)
	for i := 0; i < num; i++ {
		ans[i] = '0' // 如果不初始化byte的零值为0，不是'0'，后续转string会出现\u0000
	}
	for i := 0; i < num && sum > 0; i++ {
		if sum > 9 {
			sum -= 9
			ans[i] = byte(9) + '0'
			continue
		}
		ans[i] = byte(sum) + '0'
		break
	}
	return string(ans)
}
```
