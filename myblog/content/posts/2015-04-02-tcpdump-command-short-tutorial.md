---
date: 2015-04-02
category:	linux command
title:      tcpdump命令简单用法
tags:		[tcpdump, linux command]
---
昨天在配合其他同事联调加解密的时候老大告诉我可以用tcpdump命令来简单的看下发来的请求是否是加密的，第一次听说这个命名，研究下

<!--more-->

#### 几个常用的参数

##### -i参数

-i参数是listen on **i**nterface，监听某个网络接口，这里一般是用网卡编号。如果不指定网卡，tcpdump会默认只监视第一个网络接口，一般是eth0。

##### -X参数

-X参数是把每个包的内容以十六进制和ASCII的形式分别打印出来，这在昨天调试加密协议的时候就非常有用。

##### -A参数

和上面的有点像，就是只以ASCII形式打印。

#### 表达式

表达式是用来过滤的，只有表达式为真的请求会被打印，比如我们只想看某个端口的，就用port来过滤下。可用的表达式可以用man pcap-filter来查找。另外，表达式就会支持与和或，也就是and和or

##### port

这样只有经过port的请求会被打印

##### host

这样就只有发往host或者从host发来的请求才会被打印

##### dst

dst是说以XX为destination的表达式。

#### 例子

先看本地的网卡：

![ifconfig来获取网络接口](/assets/images/ifconfig.png)

好，下面就用-i en0来指定网络接口。我们先来看个简单的，就打开网页，然后看下请求，这还需要指定80端口

```
sudo tcpdump -i en0 port 80
```
这样抓到的只有头，没有打印包的内容，我们可以用-A来看包的内容。

![tcpdump结果](/assets/images/tcpdump.png)

简单介绍结束，更多的用法还得继续深入挖掘。
