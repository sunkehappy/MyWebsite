---
date: 2018-01-22
category:       游戏开发
title:          修改LayaAirIDE的tsc版本
tags:           [游戏开发, Laya, LayaBox, LayaAirIDE]
---

从[官网](https://www.layabox.com/)下载安装LayaAirIDE之后，新建一个项目，编译，会提示“版本不匹配! 全局 tsc (2.6.2) != VS Code 的语言服务(2.1.5)。可能出现不一致的编译错误”。最开始的时候我不太熟悉，就直接点击了“不要再次检查”。

![LayaBox TSC 版本不一致](/assets/images/layaBoxTscVersionWarning.png)

今天我在写枚举的时候发现，明明官网上面可以写字符串的枚举，我本地会出现编译错误，我就想到了这个版本的差别。然后就修改了LayaAirIDE中的TSC版本，然后就可以成功编译了。
<!--more-->

### 怎么改

首先查看自己本机安装的TypeScript是哪个版本：

```sh
$ tsc -v
Version 2.6.2
```

可以看出我装的就是2.6.2的，然后我们跑到告警的那个项目中，注意我这里是把第三方库全放到了libs文件夹下面：

```sh
npm install typescript@2.6.2
```

![libs文件夹结构](/assets/images/libsDirectoryAfterNpmInstallTypeScript.png)

注意如果这是你安装的第一个库，就不会有`package.json`文件，你可以在安装完`typescript@2.6.2`用`npm init`来初始化一下，就可以了。

用`Command+,`来打开`settings.json`文件，然后改成和我的一样。然后重启一下`LayaAirIDE`，就不会有警告了，也可以用字符串的枚举了。

![settings.json 内容](/assets/images/layaBoxSettings.json.png)

