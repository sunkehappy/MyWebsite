---
date: 2015-04-16
cagegory:	linux command
title: 		kill和killall命令
tags:		[linux command]
---
之前见到kill命令，还有见过killall -9，一直没搞明白具体是什么意思，这里记录下。

<!--more-->

### kill命令

kill命令是用来终止一个进程，或者是给进程发送信号量。可以附带指定杀死哪个进程，这个是由pid指定的。

    kill pid
	kill -signal_name pid

如果不指定信号量，会默认使用TERM信号量。可以参考[KILL(1)][http://www.man7.org/linux/man-pages/man1/kill.1.html]和[SIGNAL(7)][http://www.man7.org/linux/man-pages/man7/signal.7.html]

### killall命令

killall是通过名字杀死所有和指定名字一样的进程。在指定信号量的方式上，和kill是一样的。而killall -9是指定了`KILL`的信号量，强制杀死进程。

### 后记

还有不太清楚的地方可以参考命令手册

    man kill
	man killall

