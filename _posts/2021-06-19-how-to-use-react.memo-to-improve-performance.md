---
date:           2021-06-19
category:       前端
title:          如何用React.memo来提高性能[翻译]
tags:           [性能优化, React]
---

即便我们不去做性能优化，`React`内部已经帮我们做了很多性能上的优化，而`React.memo`可以更进一步优化组件的渲染次数。

在这篇文章中我将会跟你解释一下如何通过使用`React.memo`来优化React性能，一些使用时候的常见错误，以及为什么你并不总是需要用`React.memo`
<!--more-->
### 什么是`React.memo`
`React.mo`是React v16.6引入的一个函数，你可以用它来优化纯函数组件的渲染性能。

`Memo`是从`memoization`派生出来的，也就是记忆化的意思。简单来说就是`React.memo`会把被封装的函数的结果保存在内存中，对于**相同输入**的调用，会直接返回缓存，而不是重新计算。

这里要注意是纯函数，如果参数不变，结果就不会变。`React.memo`就是来防止多次重复执行的。

我写了一个简单的例子来说明这个问题，你可以在输入框中输入一些内容试一试，[在这里](https://codepen.io/fgerschau/pen/WNQrOgZ)。

蓝色的组件包含三个子组件，一个输入框和两个黑块，黄色的字表示的是那个组件的渲染次数。

如果你输入一些内容的话，你会发现左边的黑块和蓝色的块都会随着你输入内容而更新，而右边的黑块就不会更新。

右边的黑块就是用`React.memo`来避免相同`props`的时候的重复渲染。

> 在[这篇文章]()中，我探索了React里面重新渲染的原理以及其它的优化渲染性能的方法。

现在让我们来详细看看它的原理。

### 如何使用`React.memo`

基本用法如下，你需要把你的函数组件放到`React.memo`里面。如果写到一行会比较好看：
```jsx
const Tile = React.memo(() => {
  let eventUpdates = React.useRef(0);
  return (
    <div className="black-tile">
      <Updates updates={eventUpdates.current++} />
    </div>
  );
});
```
有了这个你就已经优化了你的组件的渲染速度，但是当处理更复杂的组件的时候，你有可能会遇到别的问题。

### 常见错误
`React.memo`跟想要的结果不一样？下面就是一些你可能会遇到的错误：

#### 处理对象
假如我们想给上面的`Tile`加一个对象属性：
```jsx
const App = () => {
  const updates = React.useRef(0);
  const [text, setText] = React.useState('');
  const data = { test: 'data' };

  return (
    <div className="app">
      <div className="blue-wrapper">
        <input
          value={text}
          placeholder="Write something"
          onChange={(e) => setText(e.target.value)}
        />
        <Updates updates={updates.current++} />
        <Tile />
        <TileMemo data={data} />
      </div>
    </div>
  );
};
```
我们会发现`TileMemo`每次我们输入内容的时候都会重新渲染，不信的话你可以在[codepen](https://codepen.io/fgerschau/pen/WNQrOgZ)里面试一下。

这里`React.memo`结果跟我们预期不一样的原因是它只是属性的浅比较(shallow comparison)，每一次`App`更新的时候`data`都会被重新声明。重新声明的`data`跟原来的`data`如果用`===`比较的话，是不一样的，所以`TileMemo`每次都会重新渲染。

#### 1. 通过`areEqual`来解决
`React.memo`通过它的第二个参数来解决这种问题。这个参数接受一个`areEqual`函数，我们可以通过这个函数来控制组件何时需要渲染。

```jsx
const TileMemo = React.memo(() => {
  let updates = React.useRef(0);
  return (
    <div className="black-tile">
      <Updates updates={updates.current++} />
    </div>
  );
}, (prevProps, nextProps) => {
  if (prevProps.data.test === nextProps.data.test) {
    return true; // props are equal
  }
  return false; // props are not equal -> update the component
});
```

#### 2. 通过`React.useMemo`来解决
你也可以用`React.useMemo`把对象包装起来，这样它就会记住这个对象，当`App`更新的时候也不会重新声明。

```jsx
const data = React.useMemo(() => ({
  test: 'data',
}), []);
```

第二个参数是一个数组，数组里面是依赖的变量。如果这些变量中的任何一个有变化，React就会重新计算这个值。在我们的例子里面，我们的数组是空的，所以就不会重新计算。

### 处理函数
在JS里面，函数的行为和对象很像，这会导致和之前一样的问题。每次`App`更新的时候，`onClick`函数就会被声明。`TileMemo`会认为`onClick`有变化，因为引用变化了。
```jsx
const App = () => {
  const updates = React.useRef(0);
  const [text, setText] = React.useState('');
  const onClick = () => {
    console.log('click');
  };

  return (
    <div className="app">
      <div className="blue-wrapper">
        <input
          value={text}
          placeholder="Write something"
          onChange={(e) => setText(e.target.value)}
        />
        <Updates updates={updates.current++} />
        <Tile />
        <TileMemo onClick={onClick} />
      </div>
    </div>
  );
};
```

#### React.useCallback
我们可以通过记忆化记住这个函数来解决这个问题，就像我们处理对象那样。
```jsx
const onClick = React.useCallback(() => {
  console.log('click');
}, []);
```
这里第二个参数也是一个数组，当数组内元素变化的时候，值也会变化。

### `React.memo`还是不行？
如果你遇到这里没有提到的关于`React.memo`的问题，请给我[发邮件](mailto:me@felixgerschau.com?subject=React.memo+does+not+work)

### 为什么不默认使用`React.memo`？
你可能会认为`React.memo`没有任何缺点，然后想把你的所有函数组件全封装起来。这里的问题是`React.memo`显式的缓存了函数，也就是说它会在内存中保存结果(VDOM)。

如果你封装了太多或者太大的组件，他们也就会耗费太多内存。这就是为什么你在记忆化比较大的组件的时候要小心。

另一种你不应该使用它的情况就是属性变化太频繁。`React.memo`引入了额外的负担来比较属性和被记住的属性，这本身并不会影响性能太多，但是这也不是`React.memo`所期望的结果。

React本身在优化渲染性能方面已经非常高效，大多数时候你并不需要去优化这些不必要的重复渲染。你所要的第一件事是实际测量一下，找到性能瓶颈，可以用[profile](https://reactjs.org/docs/optimizing-performance.html#profiling-components-with-the-chrome-performance-tab)来分析一下哪个组件渲染最多，在这些地方用`React.memo`效果最明显。

`React.memo`只是理解React如何决定重新渲染组件的一部分，我会在[另一篇文章](https://felixgerschau.com/react-rerender-components/)中解释它，在那里我解释了为什么你不需要一开始就用`React.memo`。

### 原文链接
[How to use React.memo() to improve performance](https://felixgerschau.com/react-performance-react-memo/)