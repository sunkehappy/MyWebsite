---
date: 2019-12-19
category:       后台
title:          Flask开启gzip
tags:           [python, flask, gzip]
---

最近有个项目是用的Python的Flask做的后台，前端是React和Ant Design，然后前端打包出来的文件比较大，有两三兆，申请的服务器比较慢，带宽只有2Mb/s。所以初次打开网站会比较慢，有时候需要十几秒。
那有两种思路，一种就是增加带宽，当然这样的话费用也就上去了。另一种思路就是开启gzip压缩，因为这些都是文本文件，开启gzip的话，可以极大地提升加载速度。这让我想起来之前遇到的百度的一个网页，有个文件是6MB还是多少，竟然没开gzip，当网络慢的时候，那个网页基本打不开。令人吐槽。
在我这种架构模式下，我是用的[Flask-Compress](https://github.com/shengulong/flask-compress)，代码也很简单，参考那个GitHub页面上面的例子就可以了。不过我在找这种库的时候还费了一番功夫，我想如果是nginx的话，应该会有大把的资料，可能我这种模式不是很常见吧。