---
date:           2021-09-05
category:       前端
title:          alibaba/hooks代码解读之useClickAway
tags:           [React, React Hooks, 源代码]
---
`useClickAway`是用来管理点击的，但是这些点击是在目标元素之外，不在之内。啥时候会用到它呢？比如我做了一个弹窗，当点击弹窗外的地方的时候，我想要收起弹窗，这个时候就可以用`useClickAway`。
<!--more-->

## [useClickAway](https://github.com/alibaba/hooks/blob/master/packages/hooks/src/useClickAway/index.ts)
先看方法的定义：
```JavaScript
export default function useClickAway(
  onClickAway: (event: EventType) => void,
  target: BasicTarget | BasicTarget[],
  eventName: string = defaultEvent,
)
```
这里一共三个参数，
1. 第一个是一个回调，回调的参数是`EventType`，它的具体类型是：`type EventType = MouseEvent | TouchEvent;`。
2. 第二个参数是目标元素，也可以是目标元素的集合
3. 第三个参数是事件名，默认是`click`。

这里要额外看一下`BasicTarget`，
```JavaScript
export type BasicTarget<T = HTMLElement> =
  | (() => T | null)
  | T
  | null
  | MutableRefObject<T | null | undefined>;
```
我们可以看出`BasicTarget`中`T`默认是`HTMLElement`类型的，它可能有4种值，一种是`null`，一种就是`T`，还有就是一个无参但是可以返回`T`或`null`的函数，最后一种就是我们经常使用的`ref`，它的定义就是`React.MutableRefObject。`简单来说就是`BasicTarget`是一个很灵活的类型，我们可以从中获取到我们想要的`target`，当然也有可能为空。

然后是这两行：
```JavaScript
  const onClickAwayRef = useRef(onClickAway);
  onClickAwayRef.current = onClickAway;
```
其实猛一看，它为什么还要用`ref`呢？如果是我来写的话，我是不会用的。但是再仔细想一想的话，还真是应该用`ref`，这其实是hooks反直觉的一个地方，`onClickAway`最开始传进来的时候有可能是一个值，然后用户后面又传进来一个新的值，如果我们不用`ref`，那我们的`onClickAway`就一直是第一次传进来的，这不符合需求。

接着是两个大的useEffect，副作用来自`target`和`eventName`。这里面的核心就是在`document`上面加了一个`click`事件的回调，注意，这里要强调是`document`，因为如果只加到`target`上面，那当我们点击到`target`之外的地方的时候，是收不到回调的。然后，在`handler`里面我们要去判断，点击的目标是否在`target`里面，还是在`target`外面。然后这里稍微写的有些晦涩，是因为`target`是要支持单个或者多个，而且它是`BasicTarget`类型的，也就是说值的获取会稍微有些麻烦，判断的时候就需要兼顾所有这些情况。
最后注意这个`useEffect`里面需要返回一个清除函数，不能忘记。

### 参考：
1. [hooks](https://github.com/alibaba/hooks)
1. [Node.contains()](https://developer.mozilla.org/en-US/docs/Web/API/Node/contains)
1. [Functional updates](https://reactjs.org/docs/hooks-reference.html#functional-updates)
