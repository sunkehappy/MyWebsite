---
date:           2021-05-29
category:       前端
title:          优化WebPack打包结果
tags:           [WebPack]
---

最近一直在做性能优化，最近在做的点就是打包体积优化，这里记录一下我的优化方法和结果。首先也要明白一些常见的减小包体积的措施，像[Tree Shaking](https://webpack.js.org/guides/tree-shaking/#root)，[Code Splitting](https://webpack.js.org/guides/code-splitting/#root)，[loadable-components](https://github.com/gregberge/loadable-components)，这些都可以用来减小[首页]包体积。
<!--more-->
## 建立比较基准线
想要做优化，首先我们要有个比较的标准，就是优化前什么样，优化后什么样。下面这张图是优化前的打包结果：

![on-boarding-before-optimization](/assets/images/webpack-optimization/on-boarding-before-optimization.png)

## 优化过程

### 分析打包结果
我们可以通过[webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer)来查看打包之后里面具体有哪些包，以及每个包的体积。

![webpack-bundle-analyzer-sample](/assets/images/webpack-optimization/webpack-bundle-analyzer-sample.gif)
然后我们就是用这个工具来实际分析我们的打包结果，从打包结果里面我很容易就找到几个问题

#### Ant-Design icon的tree-shaking不生效
本来这个库和Ant-Design一样都支持tree-shaking的，结果这里失效了，这其实是[bug](https://github.com/ant-design/ant-design-icons/issues/307)，我遇到的情况跟这个bug里面描述的一样，我就不贴图了。这个bug修复之后，就没有这个问题了。

#### [moment.js](https://github.com/moment/moment)附带非常多的语言数据
moment.js本身是非常好用的处理时间的第三方库，而且是支持国际化的，非常优秀。但是它也有缺陷，它不支持tree shaking，可以在他们的[官方文档上面找到声明](https://momentjs.com/docs/)。下图就是我打包之后的结果：
![moment.js-language-data.jpg](/assets/images/webpack-optimization/moment.js-language-data.jpg)

想要去掉这些语言数据也不难，可以通过WebPack的插件[ContextReplacementPlugin](https://webpack.js.org/plugins/context-replacement-plugin/#root)。这个插件的作用可以这么理解，我们有时候会这么写代码：`require('./locale/' + name + '.json')`，这个导入是依赖`name`变量的值的，这个只能在运行时才能知道具体的值，但是WebPack是打包工具，它是无法知道运行时的值的，那它怎么办呢？它是通过目录`'./locale/'`加上正则表达式`/^.*\.json$/`全打包进去的。这个正则表达式的具体作用可以通过[这个网站来看](https://jex.im/regulex/#!flags=&re=%5E.*%5C.json%24)。具体写法可以参考：
```
new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /(en|zh)/)
```
这里我只保留了中文和英文，因为我们的项目是支持中英文的。其实最开始的时候我是比较激进的，把所有的语言数据都删掉了，等到这些修改交给QA测试的时候才发现，日历组件在中文模式下也会显示英文。我一开始也没想起来这里的问题，我们是用的Ant-Design的日历组件，然后我就去看日历组件，因为它本身是支持国际化的，但是我发现它里面并没有这些日期相关的文本。那它的这些日历组件是怎么实现的国际化呢？我通过搜索发现它是直接用的moment.js，然后我又想到我之前做的优化，于是又把中英文加回来了。

#### [lodash](https://github.com/lodash/lodash)体积太大
先看图：
![lodash-package-too-big](/assets/images/webpack-optimization/lodash-package-too-big.png)
我们可以通过`npm ls lodash`来看，好几个库都在用`lodash`，但是前端的就只有Ant-Design系列的库在用，而他们已经在用标准用法了，不过我们项目里面比较老的写法是直接导入的全部的库，就像这样：`import lodash from 'lodash';`，这些需要一个一个手工替换下（当然也可以用脚本，不过我这里要替换的地方不多，就不写脚本了，因为写完脚本也需要时间，还没发复用，也不能覆盖全部情况，还需要一个一个检查）。具体lodash的情况请参考：[如何减小lodash的体积]()

#### 代码不规范

##### 跨应用引用项目
我们是多个单页应用在一个工程中的，不规范的地方是一个单页应用会引入另一个单页应用中的组件，而这个组件又会引入一些体积爆炸的库（说的就是[BizCharts](https://github.com/alibaba/BizCharts/issues/1085)，图里面有，我就不贴了）。通过修正这些不规范的地方，也可以减小一些单页应用（不是每个都有这样的问题）的包体积。

##### 未考虑tree shaking
其实上面问题的根源就是最开始写代码的时候，没有考虑到tree shaking，之前的代码中，`util`类总喜欢定义成类，然后提供静态方法，这样的方式是没办法做tree shaking的，正确的办法应该是`util`文件中导出一系列方法，然后导入的地方只导入需要的功能。类似这样：`import {xxx} from 'util.js'`。

#### 国际化语言数据未拆分
就像我上面说的，我们是一个大工程里面分多个单页应用，但是这些单页应用的语言文件都是在一起的，这就导致镇和一个单页应用都会全量导入所有的语言数据，这其实是不必要的，也是前期架构上的不足。因为我们不会也不应该出现跨应用的语言数据的共享，那我们的语言数据就应该是可以切分开的。但是现在这个工作做起来会比较麻烦，因为语言数据比较多，但是技术上是可行的，就是一个工作量的问题，可以作为一个技术债，等有时间的时候慢慢改，这个问题是可以一点一点的改的，并不需要一下子全改掉。

#### 动态加载不完善
我们可以用WebPack的[Code Splitting](https://webpack.js.org/guides/code-splitting/#root)来做到这一点，详细的请看WebPack的官网。

### 看下一下阶段性的优化结果：
![on-boarding-after-optimization](/assets/images/webpack-optimization/on-boarding-after-optimization.png)
可以看出来index文件减小了600KB，减小了20%。然后在用webpack-bundle-analyzer来分析的话，基本可以看出没有什么比较大的优化空间了，因为一个React全家桶搭建出来的应用，首页必然要加载React，Redux系列(包含Redux和React-Redux)，Saga(或同等类型的包)，React-Router(还包含history)，polyfill。我们还用了Ant-Design，这里就要加载moment.js。我们还要支持国际化，所以这里就没什么可玩的了，后续就搞别的优化的地方，下一个就是HTTP/2，这个一直在催，结果功能开发一直在压，运维那边也没时间搞，这个必须要推进了。
