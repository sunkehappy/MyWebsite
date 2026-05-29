---
date: 2021-02-02
category:       前端
title:          encodeURI和encodeURIComponent
tags:           [前端]
---

今天在项目中遇到一个bug，账单打开的时候会报错，经过初步分析，发现是一个请求里面带的参数不够，参数是从URL获取的，进一步分析发现，这些错误的页面的URL不全。
<!--more-->
然后继续往前找，发现是传递参数的时候，也传入了，但是由于用的方法不对，导致参数被截断了。错误的原因就是客户的账单名称里面带了“#”，而我们用的是encodeURI，它不会对“#”进行编码，导致了前面说的bug。

解决的办法就是用encodeURIComponent，然后取值的时候就用对应的decodeURIComponent。可以参考：[encodeURI vs encodeURIComponent](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI#encodeuri_vs_encodeuricomponent)
