---
date: 2017-08-22
category:       Swift
title:          如何阅读Swift语言源代码
tags:           [Swift]
---

准备开一个大坑，曾经我也有一个装逼的梦想，想要阅读Linux操作系统的源代码，后来因为娶妻生娃打游戏太忙就没弄。现在想想，嗯，这些都不是理由，都是借口。

### 探索

既然想阅读这么多代码，我最开始想的是先看看网上有没有什么现成的攻略可以看，这样结合起来，效率会高很多。因为我之前也尝试过阅读Linux源代码，然后那个跳转都没搞定，太折腾。

然后结果是没找到系统的，只是找到了一些零散的，比如关于Bool的，关于Int的，关于Codable的，等等。不过还是找到了一个很有用的文章：[如何阅读 Swift 标准库中的源码](http://swift.gg/2016/12/30/how-to-read-the-swift-standard-libray-source/)。啊哈，竟然可以用Xcode来阅读Swift的代码，这的确不能更爽了。因为我最开始的时候确实直接在[https://github.com/apple/swift](https://github.com/apple/swift)里面看的，这确实是比较难受的。

具体如何下载源码和如何编译，我就不赘述了，因为我也是跟着那篇文章了来的。从之前编译和安装各种软件的经历来看，不同的人在不同的系统上面编译和安装，总是会遇到各种奇怪的问题，最简单的办法就是去Google吧，这还真不是三两句话能解释清楚的。比如我就遇到了编译失败的`Swift does not support the SDK 'MacOSX10.12.sdk'`，去查了下，原来是需要用Xcode 9来编译，然后我就用`xcode-select`修改了一下默认的Xcode。然后接着编译又出错了：

```
/Applications/Xcode-beta.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX10.13.sdk/System/Library/Frameworks/AVFoundation.framework/Headers/AVFoundation.h:88:9: error: 'AVFoundation/AVRouteDetector.h' file not found
```

去查了下之后发现是Xcode 9 beta 5的bug，然后今天更新了beta 6之后就好了。所以大家如果也遇到编译出错了，就根据错误提示去解决吧。

### 打算

准备按照如下的顺序来阅读，首先肯定是标准库，然后就是基本类型

  * Bool
  * Int
  * Double
  * String

先写这么多吧，毕竟上面这4个都够我喝一壶了。
