---
date: 2017-07-25
category:	杂
title: 		iOS学习杂谈
tags:		[杂, WWDC]
---

最近一周是我入职oTMS两年来最轻松的时间了，一方面没有报出来的bug等着修，另一方面这个sprint排的任务做的差不多的，可以闲下来学点新知识。

先看下我最近半年的情况吧，毕竟上下文还是很重要的。大女儿上了托班，相对来说我老妈的带孩子压力小了一点（因为还有老二）。二女儿还小，目前9个多月，我一会到家就剩下带孩子，帮忙做家务，然后哄哄孩子，洗洗刷刷，睡觉。没有挤出时间来学习，略惭愧吧。那上班的时候又忙着做开发任务，也未能挤出时间学习，路上在玩游戏，这点我倒没有觉得丢人什么的，我觉得这是我的爱好，能让我轻松一点。

<!--more-->

然后最近几天看了几集最新一年的WWDC视频，了解了一下Swift 4和iOS 11都有哪些新东西。感觉最棒的几点记录一下：

### 增强了JSON转model相关的东西

这里有好几个技术点，一个是序列化，Swift 4引入了新的序列化工具：

#### [Codable](https://developer.apple.com/documentation/swift/codable)。

说白了就是大家用Swift 4来做JSON转model的话，不需要再去引入第三方工具拉！具体的可以看WWDC的[What's New in Foundation]或者自己Google一下，已经有不少人写了sample。

#### keyPath

既然是JSON转model，就一定要用KVC，也一定会用到keyPath，在Swift 4里面，keyPath得到了极大的增强，确实是极大。也是参看视频：[What's New in Foundation]

#### KVO

优化了KVC，那KVO也附带的被优化了下，这次终于提供了带block的KVO，而不是之前那种带函数的。这个也是上面那个视频

### 优化了字符串

去掉了那个恶心的String.character，支持多行字符串，为了提高性能，引入了Substring类型。开发者基本不需要去太过关注Substring，因为现有接口基本都是String，然后如果是Substring，需要调用String的初始化方法来生成一个新的String。Range和NSRange可以互转了。可以参考[这个Playground](https://github.com/ole/whats-new-in-swift-4/)

终于可以组合协议了！以前Swift 4之前在声明函数的时候参数都只能指明一种协议，现在可以用&来指明多种协议了，这个确实是很棒，迟来的爱。

### 其它优化

#### 有了自动填充密码的功能

然而卵用其实没那么大的，现在很多app都是手机号+短信验证码登录，密码太多记不过来啊

#### 新的导航条标题

又黑又大，我觉得好难看。好在是可配的，开发者自己选择。

#### 增强了Dynamic Type

新增了`UIFontMetrics`来帮助调整相关的数据，能够响应系统设置的字体大小。我之所以关注这个是因为真的有用户需要这些功能，比如我老爹，眼睛有点花了，看不清小的字体，他的iPhone字体调的很大，那有些app就没有做相关的调整，导致打开app之后还是那种小字。


吐槽的差不多了，最后，我还看了一篇关于原生“转”React Native的文章：[Retrospective: Swift at Artsy](http://artsy.github.io/blog/2017/02/05/Retrospective-Swift-at-Artsy/)。这让我想起了我去年年关用React Native做的一个demo项目，感觉开发起来也挺爽的。然后再结合我们公司的实际情况，我觉得我们app未来必定是混合的。当然有可能是H5，也有可能是React Native。因为真的各有利弊，原生开发费时间，做的东西慢，做的好。H5或者React Native开发的快，快对我们公司来说，很重要。

额，还有一篇文章：[Things You Should Never Do, Part I](https://www.joelonsoftware.com/2000/04/06/things-you-should-never-do-part-i/)，很有意思。讲的是开发工程师不要老是觉得自己做的项目太烂，应该推倒重来。这里面举了几个推倒重来例子，结果真的倒了。。。烂项目可以通过重构来拯救，嗯，可以看看重构相关的书和文章，最好是有配套的单元测试和测试用例。



[What's New in Foundation]: https://developer.apple.com/videos/play/wwdc2017/212/
