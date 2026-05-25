---
date:           2021-09-24
category:       前端
title:          React Portal介绍
tags:           [React, React Portal]
---
前两天在开发功能的时候，遇到一个需求，需要做一个吸在底部的输入框，当点击某个按钮的时候显示，当点击空白的时候收起。
<!--more-->

## 方案一
### 需求分析
首先看吸在底部，那我们就可以用`position: fixed`来把它放到底部。然后就是点击空白收起，这个可以通过使用`useClickAway`来实现，我之前写过它的实现方法的分析：[传送门](/posts/2021-09-05-alibaba-hooks-source-code-analysis-useclickaway/)。

### 不足的地方
由于我们只是通过`position: fixed`来把这个组件放到屏幕的底部，但是在DOM树上面，它还是嵌套的比较深的。这让我想起了Portal，也就是React里面的传送门，但是在这之前我对这个功能并不熟悉，所以就趁此机会来深入了解下这个东西，看它能不能解决我们的问题。

## 方案二 React Portal
关于为什么会有React Portal我觉得可以参考[这篇文章][react portal]。简单来说就是我们既想把一些组件渲染到DOM树的最外层（比如我们的DOM树是挂到`#root`的`div`上面，那我们就想跟它平级加一个），原因一是不想被父元素截断，二是不想继承父级的CSS属性。又想在写的时候简单好写，就像正常的组件一样。而且Portal还支持事件的冒泡，不得不说是真牛逼！

当然我们用Portal也不是一点缺点都没有，因为用Portal的话需要一个挂载点，我们的项目是用的umi，这里面是没有HTML文件的，那我们也就不方便添加Portal的挂载点。所以我就偷懒用了方案一，而且目前看来是没有问题的，如果后续有变更，可以再考虑用Portal。

## 参考：
1. [Learn React Portals by example][react portal]
1. [Portals](https://reactjs.org/docs/portals.html)
1. [Functional updates](https://reactjs.org/docs/hooks-reference.html#functional-updates)


[react portal]: https://blog.logrocket.com/learn-react-portals-by-example/
