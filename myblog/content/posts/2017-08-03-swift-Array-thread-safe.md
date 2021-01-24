---
date: 2017-08-03
category:	Swift
title: 		Swift中的Array与线程安全
tags:		[Swift]
draft:		true
---

今天修复了一个上传文件的bug，顺带复习了一下GCD，搞明白了barrier和sync的用法，然后也顺带看了下Array的线程安全。先亮结论：不安全。举例如下：

<!--more-->

```
import UIKit

var array = [Int]()

DispatchQueue.concurrentPerform(iterations: 1000) { index in
    let last = array.last ?? 0
    array.append(last + 1)
}

print(array)
```

上面的代码在Playground中很容易就崩了：

```
MyPlayground(28507,0x70000c3e8000) malloc: *** error for object 0x11a99fe68: pointer being freed was not allocated
*** set a breakpoint in malloc_error_break to debug
```

把上面的Array换成Objective-C的NSArray也是类似的，同样会崩溃。

那如果我们就是有多线程同时访问一个Array的需求，比如说单例类上面带了一个Array，我们应该怎么办呢？

加[读写锁](https://en.wikipedia.org/wiki/Readers%E2%80%93writer_lock)

举一个比较low的例子，读锁是低级装逼锁，允许大家一起装逼(一起读)。写锁是高级装逼，一定是要大家闪开(不允许有别人装逼，不允许读也不允许写)。

那回到GCD上面，怎么结合GCD来实现读写锁呢？

  * 新建一个并发队列
  * 用barrier实现写锁
  * 用sync实现读锁

这就要搞明白barrier的含义，barrier的含义在这里[dispatch_barrier_async](https://developer.apple.com/documentation/dispatch/1452797-dispatch_barrier_async)，注意这里我给的是Objective-C版本的解释，不过能看懂就行了。抄个图：

![Dispatch Barrier Image](/assets/images/Dispatch-Barrier-Swift.png)

看图barrier是不是在单独装逼，闲杂人等退避三舍？

再来看sync的解释：[dispatch_sync](https://developer.apple.com/documentation/dispatch/1452870-dispatch_sync?language=objc)，这里看来没啥特殊的啊？难道直接读取不行吗？不行，首先，读和写必须在同一个队列里面，其次，读取这里不能是异步的，必须是同步的啊。我们日常中使用Array，都是拿来就用，没有说要异步返回结果吧？


### 参考
  * [Creating Thread-Safe Arrays in Swift](http://basememara.com/creating-thread-safe-arrays-in-swift/)
  * [using dispatch_sync in Grand Central Dispatch](https://stackoverflow.com/questions/4607125/using-dispatch-sync-in-grand-central-dispatch)
  * [Grand Central Dispatch Tutorial for Swift 3: Part 1/2](https://www.raywenderlich.com/148513/grand-central-dispatch-tutorial-swift-3-part-1)
  * 