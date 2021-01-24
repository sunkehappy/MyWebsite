---
date: 2015-03-10
category:	linux command
title:      curl和wget的简单区别
tags:		[linux command, curl, wget]
---

之前了解到curl和wget都可以用来从一个url下载文件，但是却不知道他们之间有什么区别

<!--more-->

wget的介绍是“无交互的网络下载器”，可以看出来，wget就是用来下载文件的。
curl的介绍是“转发（传输）一个URL”，更详细的说法是curl用它支持的协议（HTTP、HTTPS、FTP、POP3等等很多）从服务器传输数据到本地，或者从本地传输数据到服务器。

可以看出来它们的一个很大的区别是curl可以往服务器传输数据。比如往服务器提交一个表单，如果是post方式，肯定是要用curl的。

还有一个就是今天遇到的从GitHub上面下载压缩包的时候，用wget可以直接下载链接https://github.com/alanxz/rabbitmq-c/releases/download/v0.6.0/rabbitmq-c-0.6.0.tar.gz。但是用curl的话，下载下来是一个HTML文件。这是因为GitHub的服务器做了转发，压缩文件是放到AmazonAWS的。用curl的话，指定`-L`就好了。

```sh
curl -L -o rabbit.tar.gz https://github.com/alanxz/rabbitmq-c/releases/download/v0.6.0/rabbitmq-c-0.6.0.tar.gz
```

#### 参考
[How do I download a tarball from github using curl?](http://stackoverflow.com/q/5746325/1548523)
