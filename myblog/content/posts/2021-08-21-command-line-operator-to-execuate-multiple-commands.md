---
date:           2021-08-21
category:       命令行
title:          在命令行一次执行多个命令
tags:           [命令行]
---
之前我只知道可以用分号来分隔命令，这些命令可以一次执行，但是今天在看[hooks](https://github.com/alibaba/hooks)源代码的时候，发现它的`init`命令里面是用`&&`来分隔命令的，那他们之间有什么区别呢？注意我们这里只讨论Linux下的情况，不讨论Windows下的情况，他们不一样。
<!--more-->

## 各种命令
### 分号`;`
简单来说就是一次执行多个命令，互不影响，例如
```shell
ls ; pwd ; whoami
```

### 与操作符`&&`
后面的命令只有在前一个命令执行成功之后才会执行，这是根据前一个命令执行完成后的返回值来确定的。比如下面的这一串命令，就是[hooks](https://github.com/alibaba/hooks)里面项目初始化的命令，前一个命令执行失败的话，后面的命令就没必要执行了，因为他们是后面的命令依赖前面的命令：
```shell
rm -rf node_modules && npm install && npm run clean && npm run bootstrap && npm run build
```

### 或操作符`||`
骚操作要来了，会不会有这样的需求，只有前一个命令执行不成功的时候，才执行后面的命令？来看这个需求：如果`MyFolder`不存在，就创建它：
```shell
[ -d MyFolder ] || mkdir MyFolder
```
再来个骚的：如果`MyFolder`文件夹不存在，就创建它，然后直接进入这个文件夹，如果存在，就直接进入：
```shell
[ -d MyFolder ] || mkdir MyFolder;cd MyFolder
```

## 扩展
### `&`
一个`Ampersand`表示的是后台运行，比如：
```shell
./script.py & ./script2.py & ./script3.py & 
```
我这里跑了三个脚本，都在后台跑，互不影响，想要查看他们的话，可以用`jobs`来查看，也可以用`fg`来把某个脚本放到前台来跑。

### `|`
单条竖线表示管道，也就是把前一个命令执行的结果作为输入传给后面的这个命令，比如我想找一下目前运行的进程中类似`zsh`的：
```shell
ps axu | grep zsh
```

## 参考：
1. [How to execute multiple commands in a single line](https://stackoverflow.com/a/13719223/1548523)
1. [How to Run Two or More Terminal Commands at Once in Linux](https://www.howtogeek.com/269509/how-to-run-two-or-more-terminal-commands-at-once-in-linux/)
1. [Ampersands & on the command line](https://bashitout.com/2013/05/18/Ampersands-on-the-command-line.html)
