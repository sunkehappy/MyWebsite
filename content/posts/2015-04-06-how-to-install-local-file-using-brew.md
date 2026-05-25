---
date: 2015-04-06
category: Homebrew
title: 如何用Homebrew安装本地文件
tags: [Homebrew, ssh, wget]
---
由于家里的网络有问题，即使是用我的VPS上面的VPN也无法用Homebrew来安装node，最后不得不ssh到VPS上来下载，然后在本地用scp命令拉下来。

<!--more-->

这个功能相对来说是比较鸡肋的，因为一般人都是直接联网用Homebrew install xxx来直接安装某个包，而不像我，网络有问题。

但是，既然有问题，短时间内又无法换网络，就先解决这个问题。

1. 确定是哪个包无法下载。

![unable to download node using brew](/assets/images/unable-to-download-node-using-brew.png)

2. 然后就是SSH到VPS上面去用wget下载

```sh
wget https://homebrew.bintray.com/bottles/node-0.12.1.yosemite.bottle.tar.gz
```

3. 用scp拷贝到本地：

```sh
mv node-0.12.1.yosemite.bottle.tar.gz /Library/Caches/Homebrew/
```

4. 确认Homebrew的下载目录

```sh
Calvin:sunke.me sunkehappy$ brew --cache
/Library/Caches/Homebrew
```

5. 移动包到Homebrew的缓存目录然后重新尝试安装

```sh
Calvin:web sunkehappy$ mv node-v0.12.1.tar.gz /Library/Caches/Homebrew/
Calvin:web sunkehappy$ brew install node
```

然后这样就安装成功了！

##### 参考
1. [How to install a local file in Homebrew](http://mygeekdaddy.net/2014/12/05/how-to-install-a-local-file-in-homebrew/)