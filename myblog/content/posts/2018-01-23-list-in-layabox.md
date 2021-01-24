---
date: 2018-01-23
category:       游戏开发
title:          LayaBox中的列表List
tags:           [LayaBox, Laya, List, 列表]
---

今天在用`List`的时候遇到一个问题，我的一个节目，需要用到嵌套的`List`，最开始的时候一直都搞不懂在渲染二级`cell`的时候，如何把数据传到渲染的函数中。因为我之前只有一层`List`的时候，都是在`class`中维护好了数据列表，假设叫`userArray`，然后在`list`的渲染函数`renderHandler`中，根据`index`来取数据的。
<!--more-->

那二级的时候，就不知道数据应该用什么了，因为这个时候的`index`是二级`cell`的`index`，没有一级`cell`的`index`。

然后研究了半天，发现可以用`List`的`dataSource`属性。如果在初始化`List`的时候，设定了dataSource，在`renderHandler`被调用的时候，`cell.dataSource`就是从`List`的`dataSource`中根据`index`取出来的值。这样的话嵌套List的问题就解决了。
