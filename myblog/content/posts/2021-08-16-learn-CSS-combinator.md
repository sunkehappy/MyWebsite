---
date:           2021-08-16
category:       前端
title:          通过例子来学习CSS组合器
tags:           [CSS]
---
CSS的组合器并不是很好学习，我认为最好的学习方法就是通过一些例子，最好是在实际开发中可能会遇到的例子来学习。
<!--more-->

## 组合器概览
首先要说明，组合器并不是选择器，它只是用来组合选择器的，所以叫组合器（combinator）。

### 后代组合器（Descendant combinator）
 * ` `（空格）组合器，选择前一个元素的后代节点
 * `>` 直接子代组合器（Child combinator），选择前一个元素的直接后代节点
 * `+` 紧邻兄弟组合器（Adjacent sibling combinator），选择相邻元素，即后一个元素紧跟在前一个之后，并且共享同一个父节点。
 * `~` 一般兄弟组合器（General sibling combinator），选择兄弟元素，也就是说，后一个节点在前一个节点后面的任意位置，并且共享同一个父节点。罗里吧嗦说这么多就是为了强调，不需要挨着，不像上面的紧邻兄弟组合器

 ## 组合器使用举例

### 需求
纵向排列一些`div`，这些div中间需要有`8px`的间隙，但是第一个`div`距离顶部不要有空隙。这其实是一个很常见的需求，实现方法也有很多，这里主要是演示用CSS的组合器来做。

为了方便我们使用如下的`HTML`结构：
```HTML
<div class="container">
  <div class="row">
  line 1
  </div>
  <div class="row">
  line 2
  </div>
  <div class="row">
  line 3
  </div>
</div>
```
同时为了方便观察，我们给他们加上边框和背景色：
```CSS
.container {
  border: 1px solid black;
}

.row {
  background-color: lightblue;
}
```
现在的效果如图：

![initial-effect-of-divs](/assets/images/learn-CSS-combinator/initial-effect-of-divs.png)

我们想要的效果：

![initial-effect-of-divs](/assets/images/learn-CSS-combinator/effect-of-divs-after-CSS.png)

#### 方法一 紧邻兄弟组合器
我们只需要给`.row`加上`.row + .row`选择器，就可以选中除了`line 1`以外的`row`，也就是`line 2`和`line 3`，代码[看这里](https://jsfiddle.net/sunkehappy/m2s3jxkv/16)。

如果我们的这些`row`中间有空的`div`（或者别的元素）怎么办？

#### 方法二 一般兄弟组合器
写法跟上面类似，但是`~`不要求前后节点紧挨着，所以也就不会有上面那个害怕中间有空`div`的情况：`.row ~ .row`，代码[看这里](https://jsfiddle.net/sunkehappy/m2s3jxkv/20/)

#### 方法三 直接子代组合器+伪类选择器
这里需要两步，一步是为`row`添加`margin-top: 8px`，第二步就是为最上面的`row`清除`margin-top`，代码[看这里](https://jsfiddle.net/sunkehappy/m2s3jxkv/23/)

当然这里选择第一个`row`，可以像上面代码中那样用`first-of-type`，可以用`first-child`，也可以用`nth-child(1)`（注意这里的下标是从`1`开始的）。

### 参考：
1. [CSS 选择器](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Selectors)
1. [:nth-child](https://developer.mozilla.org/en-US/docs/Web/CSS/:nth-child)
1. [What does the “~” (tilde/squiggle/twiddle) CSS selector mean?](https://stackoverflow.com/a/10782297/1548523)
1. [https://stackoverflow.com/questions/2094508/is-there-a-css-selector-for-the-first-direct-child-only](https://stackoverflow.com/a/2094512/1548523)
1. [CSS Child vs Descendant selectors](https://stackoverflow.com/questions/1182189/css-child-vs-descendant-selectors)
1. [Add space between HTML elements only using CSS](https://stackoverflow.com/a/8185290/1548523)
