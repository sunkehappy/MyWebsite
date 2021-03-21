---
date:           2021-03-21
category:       脚本
title:          Python用subprocess进行父子进程通信
tags:           [python, 进程]
---
这两天搞了一个小项目，简单来说就是用UDP来模拟TCP和HTTP的部分功能，例如校验和，RSA加密，序列号，确认的序列号，头部位来表示各种状态，比如是否是ack、是否结束，是否有加密。
<!--more-->
程序上面从头写到尾，并没什么大问题，就不详细介绍了。我在最后测试的时候遇到一个问题，测试总调度程序是用的`subprocess`模块来做的，调用代码是这样的：
![python-subprocess-call](/assets/images/python-subprocess-call.png)

被调用的程序那边是这样的：

![python-child-program-print-port](/assets/images/python-child-program-print-port.png)

我遇到的问题就是程序会卡在61行，读不到被调用程序输出的端口号。这个问题是经过简化了，本来这两个程序是都放到某个平台上测试的，上去就卡死，难以分析原因。本地测试的时候也会有问题，但是如果是用Visual Studio Code调试，就没问题，可以读到这个端口号。

然后我就开始通过关键字来找答案，首先是找文档和样例，来明白Python的`subprocess`是怎么用的。然后开始找“Python读取subprocess的输出”，“Python subprocess写入到管道”，等等关键字。
最后在[这里](http://www.cocoachina.com/articles/97917)发现了一个比较重要的线索，里面提到被调用的程序必须退出，但是我这个被调用的是UDP的服务端，不能退出的。我有继续找，最终在[这里的文档](https://blog.csdn.net/kongsuhongbaby/article/details/85265526)提到，可能有缓冲。然后我就修改了被调用程序的输出端口号的方法，不再用`print`，而是用下面的代码：

![python-child-program-flush-output](/assets/images/python-child-program-flush-output.png)

当然另一种方法是修改调用程序那边，不要用缓冲区，因为这里就读取一个端口号，没必要用缓冲区的，不过我这个场景里面，我无法修改调用方的程序，就只能在被调用方里面刷新缓冲区，也的确解决了问题。

顺带可以复习一下进程间通信的常见方法：
1. 管道
2. 系统IPC（包括共享内存，消息队列，信号量）
3. 套接字

这里的Python是用的管道的。
