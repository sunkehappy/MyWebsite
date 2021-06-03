---
date:           2021-06-03
category:       工具
title:          Git有用命令
tags:           [git]
---

Git有些命令记录在这里，平时我用图形界面多点，有些命令反而用命令行更好用。命令行的强大之处在于这些命令可以组合，这在命令行里面很难甚至做不到，比如下面这个：
```
git log --author "foo.bar" --grep="xxx" --follow ./src/js/app.jsx
```
甚至还可以组合时间段来过滤，好用极了。
<!--more-->
### git help
```
git version  # Display the version of git.

git help  # Prints the synopsis and a list of the most commonly used commands.
git help git  # Display the git man page.

git <COMMAND> -h  # Display the brief help.
git help <COMMAND/CONCEPT>  # Display help for specific subcommand or concept. "git  <COMMAND/CONCEPT> --help"

git help --help  # Display the help of 'git help'.
git help --all  # Print all available commands on the standard output.
git help --guide  # Print a list of the useful Git guides on the standard output.
```

### git config
```
git config --list  # 显示所有配置信息
git config --global --list  # 显示全局配置信息
git config --local --list  # 显示local repository配置信息（在local repository目录下执行）
```

### git remote
```
git remote  # 查看remote repository信息
git remote -v  # 查看remote repository详细信息。如果没有推送权限，就看不到remote repository的地址
git status
git status  # Show the working tree status. 
git status --short  # Give the output in the short-format.
```

### git log
```
git log  # 查看commit日志
git log -3  # 查看最近3次的commit日志
git log <file>  # 查看某个文件的commit日志
git log --follow <file>  # 显示某个文件的commit日志，包括文件改名

git log -p  # 补丁格式显示每个提交之间的具体差异
git log -p <file>  # 补丁格式显示指定文件每个提交之间的具体差异

git log --stat  # 显示每个提交的文件修改统计信息
git log <branch>  # 显示指定分支的commit日志

git log --oneline  # 逐条简洁显示commit日志
git log --oneline --graph  # 图形化显示分支合并历史
git log --oneline --graph --decorate  # 图形化显示分支合并历史，包含commit的引用信息

git log --merges  # 只显示merge commit日志
git log --no-merges  # 显示过滤merge commit之后的git log

git log --author=<author name>  # 搜索指定作者的提交历史
git log --grep='<search term>'  # 通过 commit 信息查找
git log --all --grep='<search term>'  # 通过 commit 信息查找 (所有分支)
git log -g --grep <key-word>  # 通过 commit 查找信息（包含reflog）
git log -S '<search term>'  # 通过更新的内容查找
git log --after="2016-12-1" --before="2017-1-1"  # 显示某个时间段的commit日志
```

### git shortlog
```
git shortlog  # Summarize 'git log' output order by the author
git shortlog --summary  # Suppress commit description and provide a commit count summary only.
git shortlog --numbered  # Sort output according to the number of commits per author instead of author alphabetic order.
git shortlog --email  # Show the email address of each author.
```

### git reflog
```
git reflog  # 显示当前分支的提交命令日志
```

### git show
```
git show  # 查看上一次commit的内容：
git show <commit id>  # 查看某次commit的内容
git show <commit>:<filename>  # 显示某次提交时，某个文件的内容
git show --name-only <commit id>  # 显示某次提交发生变化的文件
```

### git diff
```
git diff  # 显示暂存区和工作区的差异
git diff HEAD  # 显示工作区与当前分支最新commit之间的差异
git diff <commit-id-1>..<commit-id-2>  # 查看commit之间的对比
git diff <branch-name-1> <branch-name-2>  # 查看branch之间的对比
```

### git blame
```
git blame <file>  # Show what revision and author last modified each line of a file.
```
