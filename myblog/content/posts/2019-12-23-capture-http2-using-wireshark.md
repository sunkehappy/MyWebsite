---
date: 2019-12-23
category:       网络
title:          用Wireshark抓包HTTP2请求
tags:           [wireshark, http2]
---

最近要准备一个关于HTTP/2协议的分享，所以就特意动手折腾了一下HTTP/2有关的东西。

纸上得来终觉浅，绝知此事要躬行。只看别人写的文章，哪怕是看的[HTTP 2 RFC](https://httpwg.org/specs/rfc7540.html)，也不如亲自动手折腾一下。第一步，用Wireshark来抓包，[下载地址](https://www.wireshark.org/download.html)。下载安装好之后，默认情况下Wireshark是无法解密HTTP/2的请求的，原因是目前的HTTP/2都是基于TLS的安全协议，Wireshark是无法解密的。

![Wireshark without decryption](/assets/images/wireshark-ssl.jpg)

所以第一步就是要想办法告诉Wireshark如何解密。想要解密，就需要有秘钥(TLS里面既有对称加密又有非对称加密)，有两种方法。

* 网站私钥
* 某些浏览器支持将 TLS 会话中使用的对称密钥保存在外部文件中

网站私钥可不是闹着玩的，极力不推荐用这种方式。然后第二种方式也很简单：

1. 新建一个文件来保存浏览器导出的key
2. 设置环境便令：SSLKEYLOGFILE为上面那个文件的路径
3. 然后让上面设置的环境变量生效

可以参考下面的命令：
```
mkdir ~/tls
touch ~/tls/sslkeylog.log
echo "export SSLKEYLOGFILE=~/tls/sslkeylog.log" >> ~/.bash_profile
source ~/.bash_profile
```
然后，在 Wireshark 的TLS配置面板的 「(Pre)-Master-Secret log filename」选项中这个文件选上。
![Wireshark TLS setting](/assets/images/wireshark-tls-setting.png)

然后就可以在Wireshark中看到HTTP2的请求了：
![HTTP2 in Wireshark](/assets/images/wireshark-http2.png)
