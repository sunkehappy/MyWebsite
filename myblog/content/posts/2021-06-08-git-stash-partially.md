---
date:           2021-06-08
category:       工具
title:          Git stash部分文件
tags:           [git]
---

工作中`git stash`是一个很有用的命令，比如在当前分支上做开发，结果没做完，又要去另一个分支上修bug。有两种方式，一种是先临时提交下，后面再把这个提交修改掉。另一种就是先stash起来，后面再pop出来。当我们在做一些测试的时候，想比较两种修改，怎么样暂存一部分修改呢？
<!--more-->
### git stash -p

![git-stash-screenshort](/assets/images/git-stash-screenshort.png)

然后这里的意思就是针对这一块改动，要怎么办？具体的意思就是：
```
y - stage this hunk
n - do not stage this hunk
q - quit; do not stage this hunk nor any of the remaining ones
a - stage this hunk and all later hunks in the file
d - do not stage this hunk nor any of the later hunks in the file
g - select a hunk to go to
/ - search for a hunk matching the given regex
j - leave this hunk undecided, see next undecided hunk
J - leave this hunk undecided, see next hunk
k - leave this hunk undecided, see previous undecided hunk
K - leave this hunk undecided, see previous hunk
s - split the current hunk into smaller hunks
e - manually edit the current hunk
? - print help
```
处理完这一块，就会到下一块。如果初期不好记，就记住y(yes), n(no)和q(quit)。
### git stash list
这个命令就是用来查看之前暂存过哪些东西:
```
stash@{0}: WIP on master: b0f1f40 [Feature] Open new page when jump out of the ECMAScript site.
(END)
```
### git stash drop [-q|-\-quiet] [\<stash>]
这个命令就是丢弃掉之前的暂存，如果后面没有参数，默认drop掉stash@{0}，也就是最近一次的暂存。另外在git stash pop的时候如果遇到冲突，那就需要处理好冲突之后，drop掉那个暂存。
