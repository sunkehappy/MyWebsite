---
date:           2021-06-13
category:       基础知识
title:          用Wireshark学计算机网络
tags:           [wireshark, 计算机网络]
---

计算机网络是计算机里面很重要的课题，是网络链接大家。相信科班出身的人大学都学过计算机网络，非科班的也会多多少少了解点。但是计算机网络这个东西吧，说实在的平常工作中用的并不是很多，系统学习过之后也会忘记，这个是没办法的，只有时不时的拿出来复习一下。本文就是用来复习的，并不是一篇新手的计算机网络指导，想要从头学的话，我推荐《计算机网络：自顶向下方法》，然后自己动手结合wireshark学自己感兴趣的，不用全学，除非是感兴趣。

<!--more-->
### 计算机网络整体结构

![computer-networks-whole-structure](/assets/images/computer-networks-by-wireshark/computer-networks-whole-structure.png)

这个图是网上扒拉的，十分清楚，我就不画了。一般情况下，我们只需要说有5层就好了，表示层和会话层并没有与之对应的具体协议，只是一个概念。

### 从浏览器输入网址，到界面显示，都发生了什么？
这真的是一个经典的面试题，里面的事情太多了，详细的来讲，内容可以扯很多。这里我们就简单点只说应用层到TCP。

这里我要举的例子就是结合HTTP/2，看一下我自己的网站的过程。这里跳过前面的几步，已经拿到[https://calvinhappy.com](https://calvinhappy.com)对应的IP地址是`8.130.31.240`。

这里我是怎么知道这个网站的ip是`8.130.31.240`的呢？可以用ping来拿ip，也可以在Chrome的开发者工具里面看，如下图：

![view-ip-address-in-chrome-developer-tools](/assets/images/computer-networks-by-wireshark/view-ip-address-in-chrome-developer-tools.png)

### TCP
HTTP是基于TCP的，所以要先3次握手建立TCP链接。

![tcp-three-way-handshake](/assets/images/computer-networks-by-wireshark/tcp-three-way-handshake.png)

图看不清的话可以右键然后新tab查看，我选的这个theme这里不好，不能点击查看大图。这里要说的就是一个TCP的ack里面的ack号是上一个seq号+1，这里的+1表示的是被确认的那个tcp包里面的seq加上里面数据的长度，再加一。所以也不一定就是说每个ack包里面的ack number都是上一个包的seq+1，后面有具体的例子。

#### TCP报文格式
计算机网络里面所有的报文都有固定套路，也就是固定格式，报文的发送和解析也都需要按照这些格式来操作。下面这个就是TCP报文的结构：

![tcp-packet-structure](/assets/images/computer-networks-by-wireshark/tcp-packet-structure.png)

下面这张图就是整个TCP三次握手的第一个报文：

![tcp-three-way-handshake-first-packet](/assets/images/computer-networks-by-wireshark/tcp-three-way-handshake-first-packet.png)

注意TCP里面只讲端口号，IP报文里面只讲IP，计算机网络里面各个层就干好自己的事情，虽然有时候会有些重叠，但是大部分时候，各关心各的。TCP里面的端口号是两个字节，一个字节可以表示的十六位字符是`00`到`FF`，两个字节就是`0000`到`FFFF`，所以上面的截图中，我选中目的端口号是`443`，换算成十六进制就是`0x01bb`。

注意端口号下面的带中括号的那些，是wireshark给我们加的，帮助我们分析的数据，并不在TCP报文中。

### TLS
TCP链接有了，就可以开始TLS了，就是建立安全链接。当然不用tls也是可以的，不过现在的网络基本都会用HTTPS，纯HTTP的，都会被慢慢淘汰掉。

TLS会分成简单几步：

![https-handshake-analysis](/assets/images/computer-networks-by-wireshark/https-handshake-analysis.png)

具体的抓包过程如下：

![https-handshake-in-wireshark](/assets/images/computer-networks-by-wireshark/https-handshake-in-wireshark.png)

### HTTP/2

首先有的服务器支持HTTP/2，有的不支持，这个是在哪里协商的呢？是在TLS的`client hello`报文里面的，如下图：

![http2-negotiation-in-tls](/assets/images/computer-networks-by-wireshark/http2-negotiation-in-tls.png)

HTTP/2的整体概念是这样的：

![http2-packet-in-wiresark](/assets/images/computer-networks-by-wireshark/http2-packet-in-wiresark.png)

简单来说就是，客户端之间只需要一个连接，一个连接可以同时传输多个文件，因为一个连接里面可以有多个stream，每个stream都可以进行文件的传输。这就是**多路复用**。

每个HTTP请求和响应还有一些控制数据(控制HTTP连接相关)，都可以用二进制帧来表示，像`header`, `data`这样的帧，这就是**二进制分帧**。

客户端和服务端都维护HTTP的header的哈希表，类似密码本，比如客户端说`2`，服务端就知道是`method: GET`。对于那些事先不知道的，可以动态的加入到密码本里面(哈弗曼编码)。这就是**头部压缩**。

别的功能像请求优先级，服务端推送，目前用的还不是很多。

### 参考
* [表示层（ presentation layer）和会话层（session layer）为什么会被弃用？](https://www.zhihu.com/question/58798786)
* [tcp协议握手为什要各随机一个数字并加一?](https://www.zhihu.com/question/34400902/answer/191928024)
* [TCP报文格式](https://blog.csdn.net/a19881029/article/details/29557837)
* [What Is Retransmission In TCP? Error Control And Duplicate Acknowledgement.](https://www.cspsprotocol.com/tcp-retransmission/)
* [HPACK: Header Compression for HTTP/2](https://datatracker.ietf.org/doc/html/rfc7541)
* [Tls v1.3的里程碑发展](https://cloud.tencent.com/developer/article/1358919)
