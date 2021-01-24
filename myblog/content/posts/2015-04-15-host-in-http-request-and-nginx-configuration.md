---
date: 2015-04-15
cagegory:	http
title: 		http请求中的host和nginx中的例子
tags:		[http request, host, nginx]
---
以前配合后台开发app的时候，需要配host然后才能访问某些网页，比如dev.sunke.me，test.sunke.me，只知道这么做，却不知道为什么，今天研究了下，记录一下

<!--more-->

### 为什么需要配host？

假如A和B两个人都在同一台机器上开发网站，他们开发的是不同的功能，很不同，可以认为是两个系统，比如一个是前台，一个是后台。这样就可以搞成同一台服务器上面的两个虚拟服务器，然后通过在发到服务器上面的请求中加入host信息来指定访问哪一台虚拟服务器。

### nginx怎么配置？

通过添加多个server就可以了，然后在不同server中指定不同的服务器[NGINX Web Server]。

![nginx configration picture](/assets/images/nginx-configration.png)

### 本地怎么配置？

    # /private/etc/hosts
    # learning host
    45.56.127.13 zhangsan.com
    45.56.127.13 lisi.com

### 效果

![webpage via host for lisi](/assets/images/webpage-via-host-for-lisi.png)   
![webpage via host for zhangsan](/assets/images/webpage-via-host-for-zhangsan.png)

### 请求里面的host信息

![host information http request](/assets/images/host-information-http-request.png)

这样nginx在处理这个请求的时候，就会拿着host信息去找对应的server处理。

### 参考

1. [关于Nginx的server_name](http://onlyzq.blog.51cto.com/1228/535279)   
2. [NGINX Web Server][NGINX Web Server]   
3. [关于nginx中的host变量](http://ju.outofmemory.cn/entry/79388)

[NGINX Web Server]: http://nginx.com/resources/admin-guide/web-server/