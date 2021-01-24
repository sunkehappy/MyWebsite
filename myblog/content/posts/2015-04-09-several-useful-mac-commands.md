---
date: 2015-04-09
cagegory:	utility
title: 		几个有用的Mac命令
tags:		[linux commands]
---
今天遇到几个觉得能提高工作效率的命令，这里记录一下

<!--more-->

1. pbcopy和pbpaste

这个是用来在命令行里面直接操作剪贴板，还是可以省一些功夫的，比如把一些内容放到剪贴板：

```sh
echo "abc" | pbcopy
```

这样剪贴板里面就有了abc

2. 获取文件的全路径

```sh
echo `pwd`/a.txt
/Users/calvin/Desktop/code/mine/websiteDev/learnBootstrap/a.txt
```

再结合上面的剪贴板，就可以直接把一个文件的全路径拷贝一下。不过这里有个不方便的就是，那个文件名是需要自己写上去的，没有自动补全，有一个简便的方法是先输入一个空格，然后就有自动补全了，然后再删除空格。

```sh
echo `pwd`/a.txt | pbcopy
```

如果是在linux上面，直接用`readlink -f a.txt`就可以了。

---

如果后续还有发现的话再补充。
