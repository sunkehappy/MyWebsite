---
date: 2015-04-21
cagegory:	Linux
title: 		core dump分析实例
tags:		[Linux]
---
程序运行中间，如果出错了，有可能会有core dump，生成core.12345文件，这个文件有助于定位问题，这里记录下。

<!--more-->

看下[core dump](http://zh.wikipedia.org/wiki/%E6%A0%B8%E5%BF%83%E8%BD%AC%E5%82%A8)的定义。
再来看个例子：

### 设置core file size

默认情况下，core file size是0，也就是说，不会生成core dump文件，所以这里要改一下。

![设置core dump文件大小](/assets/images/set-core-dump-file-size.png)

注意如果你多次用`ulimit -c xxx`修改core file size，有可能会出现错误：-bash: ulimit: core file size: cannot modify limit: 不允许的操作，这样的话你重启命令行再试一下有可能就好了（参考[core文件设置](http://blog.csdn.net/apengjiang/article/details/7312920)）

### 写一个程序让它崩溃，然后生成core dump文件

![生成core dump文件的程序](/assets/images/source-to-generate-core-dump.png)

把上面的代码写到test.cpp中，然后用下面的命令编译：

```
g++ -g -o test.exe test.cpp
```

这里的`-g`参数是说生成的可执行文件里面附带调试信息，如果不加的话看core dump文件的时候看不到程序是在哪一行崩溃的。然后运行，就会生成core dump文件core.pid，这里的pid就是程序执行时候的pid，每次会变。

### 用gdb去看这个core dump文件。

![用gdb查看core dump文件](/assets/images/open-core-dump-file-with-gdb.png)

正常的程序发布的时候是没有调试信息，但是用`bt`去查看栈调用仍然可以看到，就是看不到行，这仍然能帮忙定位问题。
