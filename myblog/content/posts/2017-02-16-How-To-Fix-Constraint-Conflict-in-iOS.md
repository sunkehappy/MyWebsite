---
date: 2017-02-16
title:		如何解决iOS中的约束冲突
category:	翻译
tags:		[iOS, AutoLayout]
---

AutoLayout在布局上面用起来很好用，很多时候只用它就可以搞定布局相关的需求。不过在用AutoLayout做布局的时候也有一些问题很烦，其中一个就是约束冲突。有的时候忽然发现命令行里面打出约束冲突的日志，如果此时界面简单还好，拔来拔去就那几个地方，很容易就搞定了。但是如果此时界面很复杂，想找出是哪个地方的约束冲突了就不好搞了。很多时候bug不好修是因为找不到bug是哪里引起的，找到了根源就好修了。

<!--more-->
### 非运行时的约束冲突

如果在InterfaceBuilder里面就能看到的约束冲突，就很好解决了。

![InterfaceBuilder中的约束冲突](/assets/images/IB_constraint_confilict.png)

比如上图中高度有两个约束，一个是要等于128，另一个是要大于等于200，那这两个约束是无法同时满足的，然后就冲突了，一个解决办法就是去掉其中一个就好了。

### 运行时的约束冲突

另一种常见的约束冲突就是app跑着的时候在命令行中出现一大串文字说哪哪哪出现了约束冲突以及一个建议的解决方案：

![命令行中的约束冲突日志](/assets/images/console_constraint_conflict.png)

这里我还是用的上面那个例子，只是我是在运行的时候动态的修改了那个约束把高度改成了200。由于这个界面很简单，通过阅读这个日志我们就能知道，是高度冲突了。但是考虑一下这样的场景：我的订单详情页面有4个子页面，每个子页面都是复杂的页面，比如有的有表格，表格的行里面显示的内容也很复杂，有的要显示图片列表。如果在这样的界面里面有约束冲突，我们如何定位？

我觉得我们可以有如下一些方向：

 1. 直接阅读日志。比如里面有比较明显相关约束的信息，通过这些信息我可以猜到是哪个页面。就像上面那个例子，因为高度约束是我加的，当我看到高度约束冲突的时候我就很容易想到可能是那里出问题了。
 2. 按照约束引入的时间。比如我昨天还没有见到这个约束冲突，那就是说今天的修改导致的，然后检查下我今天都改了什么，说不定就找到哪里引起问题了。
 3. 如果还是定位不到，也可以考虑结合[Reveal](https://revealapp.com/)来直接看界面的约束。~~不过这个方法的弊端就是如果界面太复杂，这个方法效率太低。~~新版本的reveal已经可以直接显示出冲突的约束了，看起来相当吊，不过效果还有待确认，因为我这里发现Reveal上面显示有冲突但是命令行的日志里面并没有相关的日志。

![Reveal上面的约束冲突](/assets/images/reveal_constraint_conflict.png)

 4. 结合LLDB动态调试定位。我们的关键难题就是定位不到是哪里冲突了，如果我们能够通过log里面的信息结合调试器来定位，就会容易很多。比如开头那个日志里面可以看到是内存地址`0x7fe619e37fa0`的相关约束冲突了，那这个地址上面的对象在界面上面是哪个？

```
(lldb) expr -l objc++ -O -- [(id)0x7fe619e37fa0 setBackgroundColor: [UIColor redColor]]
```

这样就可以把`0x7fe619e37fa0`的背景色改成红色，那相应的也可以调用其它的方法，比如它是一个`UITableViewCellContentView`，那我们可以用`superview`来知道是哪种cell，然后再在cell上面调用一些方法来定位是哪一行，比如我在cell上面存储了`indexPath`，那我就再加上`indexPath`：

```
(lldb) expr -l objc++ -O -- [[(id)0x7fe619e37fa0 superview] indexPath]
```

这样就很容易定位是哪里冲突了，找到冲突的地方再解决冲突就容易多了。

### 备注

LLDB的命令参考自：[Interact with swift object with memory location in the debugger](http://stackoverflow.com/questions/25467845/interact-with-swift-object-with-memory-location-in-the-debugger)
