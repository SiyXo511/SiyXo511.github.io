---
title: '146. LRU 缓存'
category: 笔记
column: leetcode
description: '哈希表按 key 找节点，双向链表维护使用顺序，get 和 put 都是 O(1)'
createdAt: 2026-10-20
tags: [设计, 哈希表, 双向链表]
---

题目：[146. LRU 缓存](https://leetcode.cn/problems/lru-cache/)（力扣 Hot100）

![题目截图](/images/leetcode/146-1.png)

LRU缓存的设计需要对使用先后进行排序，题目要求get和put以O(1)的平均复杂度运行，所以我们不仅要设计一个可以根据key直接找出对应value的方法，还要在O(1)时间内完成对使用先后的排序。因此我们可以使用一个map和双向链表来解决这个问题，因为双向链表可以在O(1)时间内完成移动、添加以及删除操作，满足题目要求。

map可以记录key与对应的链表节点的地址关系，这样我们通过key可以快速找到目标节点，方便完成读值和操作。

这里涉及两个链表操作，第一个是添加到头部，因为当我们get或者put的时候会更新这个key的使用，使它变成最新用过的；第二个是删除尾部，当put的时候如果需要新建节点但是容量满的时候就需要逐出最久未使用的key。
```go
type DListNode struct {
    key int
    value int
    pre *DListNode
    next *DListNode
}
type LRUCache struct {
    capacity int
    record map[int]*DListNode
    head *DListNode // 新
    tail *DListNode // 旧
}

func Constructor(capacity int) LRUCache {
    cache := LRUCache{}
    cache.capacity = capacity
    cache.record = make(map[int]*DListNode)
    tail := &DListNode{}
    head := &DListNode{}
    tail.pre = head
    head.next = tail
    cache.tail = tail
    cache.head = head
    return cache
}

func (this *LRUCache) Get(key int) int {
    node, exists := this.record[key]
    if !exists {
        return -1
    }

    // 断链
    node.pre.next = node.next
    node.next.pre = node.pre
    
    // move to head
    this.head.next.pre = node
    node.next = this.head.next
    node.pre = this.head
    this.head.next = node
    
    return node.value
}

func (this *LRUCache) Put(key int, value int)  {
    node, exists := this.record[key]
    if exists {
        node.value = value

        // 断链
        node.pre.next = node.next
        node.next.pre = node.pre
        
        // move to head
        this.head.next.pre = node
        node.next = this.head.next
        node.pre = this.head
        this.head.next = node
        return
    }
    if len(this.record) == this.capacity {
        tmp := this.tail.pre
        delete(this.record, tmp.key)
        // 断链
        tmp.pre.next = tmp.next
        tmp.next.pre = tmp.pre
    }
    newNode := &DListNode{
        key: key,
        value: value,
    }
    // move to head
    this.head.next.pre = newNode
    newNode.next = this.head.next
    newNode.pre = this.head
    this.head.next = newNode

    this.record[key] = newNode
}
