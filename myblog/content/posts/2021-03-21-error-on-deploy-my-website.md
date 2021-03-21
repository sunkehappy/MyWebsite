---
date:           2021-03-21
category:       博客
title:          解决我的网站打不开的问题
tags:           [博客, nginx, git]
---
今天发现我的网站打不开了，用[Charles](https://www.charlesproxy.com/)抓包发现后台返回了503，然后我想到我的网站，前面是一个nginx，然后根据子域名不同把请求转发到不同的服务上面，然后就推测
<!--more-->
应该是nginx那里出问题了。

然后我就去服务器上面看下， 先看运行的docker：

![my-website-docker-container-ls](/assets/images/my-website-docker-container-ls.png)

发现就一个容器在运行，是next.js的，没有nginx的容器。然后再去看当时的部署脚本运行情况。

![my-website-nginx-docker-log](/assets/images/my-website-nginx-docker-log.png)

这个log粗看起来也没啥问题，仔细一想，我想起来，我一直都是用的`-d`来跑的`sudo docker-compose up --build`，有没有可能log不全？然后我就去掉`-d`来重跑启动命令。

![my-website-nginx-docker-error-log](/assets/images/my-website-nginx-docker-error-log.png)

果真是出错了，HTTPS的证书找不到，我看了下本地代码里面，确实是没这些证书文件。这又让我想起了前段时间，我把网站的代码仓库做成了公开的，然后把里面的私钥用git submodule的方式，从另一个私有仓库里面获取的。然后这个我在公司里面搞的，家里面的电脑上还没有更新这些submodule，然后我就通过`git submodule update --init --recursive`拉取到这些证书，然后重新部署一下，然后就可以访问了。

还别说，这样做网站可比之前用GitHub Pages来搞网站有意思多了，能折腾的地方很多。