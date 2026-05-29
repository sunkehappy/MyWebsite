---
date: 2015-02-27
category:	reading notes
title:      《Advanced Programming in the Unix Environment》读书笔记（一）
tags:		[读书笔记, Unix环境高级编程]
---
粗略的看了前两章，在这里记录一下我感兴趣的知识

<!--more-->

### 第一章 Unix系统概述

#### Unix操作系统架构

![Unix操作系统架构](/assets/images/architecture-of-Unix-operating-system.png)

这个图很有意思，最外层的应用程序可以调用shell，也可以调用库函数，还可以直接调用内核的服务。这一点在章节1.11里面有更深入的介绍。可以拿应用程序申请内存空间做例子，一般程序可以通过malloc来申请一块内存，这里malloc是标准的C库函数，最终malloc也会调用[sbrk][sbrk]。这里其实应用程序也可以直接调用[sbrk][sbrk]，只不过这个[sbrk][sbrk]太低层很难用罢了。这个可以用下面的图片表示：

![C库函数和系统调用](/assets/images/C-functions-and-system-calls.png)

#### fork函数

fork调用之后会返回两次，一次是父进程pid>0，一次是子进程pid=0。但是这里说的pid是fork的返回值，而不是进程的真实id，可以通过调用getpid()函数来获取真实的pid。

### 第二章 Unix标准化和实现
直接略过了，我实在是看不下去，大概了解到Unix有很多变种，像BSD，FreeBSD，MacOS，Linux，Solaris等等。还有就是有很多Unix标准。C语言也有标准，不过生活当中用到的标准要比已经制定下来的标准落后很多。各个操作系统之间还是有一些不同的，这会给程序的移植造成问题，如果要做移植，就得充分了解要移植到的操作系统与当时写代码的系统有哪些不同，程序需不需要做改动才能成功移植。

[sbrk]: http://en.wikipedia.org/wiki/Sbrk