---
date:           2021-08-19
category:       前端
title:          alibaba/hooks代码解读之useBoolean和useToggle
tags:           [React, React Hooks, 源代码]
---
说来惭愧，在上家公司里面hooks用的不多，现在的新公司新项目，全是函数式组件，没有类组件了。我也开始大量使用各种hooks，然后找到了这个第三方库[hooks](https://github.com/alibaba/hooks)，自定义的hooks。这篇文章就是来分析一下各个hooks的源代码。
<!--more-->

## [useToggle](https://github.com/alibaba/hooks/blob/master/packages/hooks/src/useToggle/index.ts)
本来第一个是想先分析`useBoolean`的，但是那里面用到了这个`useToggle`，所以就先分析这个了。`useToggle`是用来反转值的hooks，这个值可以是`boolean`，直觉上我们是这么觉得的，但它也可以是别的值，值的类型定义是这样的：`string | number | boolean | undefined`。它的前后两个状态甚至可以是两个不同的类型，比如初始值是0，反转值是`true`（只是举个例子，要看应用场景）。代码里面的泛型会比较难懂，我们一步一步看。

### `IState`和`Actions`
```JavaScript
type IState = string | number | boolean | undefined;
```
这个比较好懂，就是`IState`可能是字符串、数字、布尔或者为`undefined`（也就是不传值）。

```JavaScript
export interface Actions<T = IState> {
  setLeft: () => void;
  setRight: () => void;
  toggle: (value?: T) => void;
}
```
然后`Actions`是一个泛型接口，里面包含三个函数，泛型我就不解释了，可以参考[官方文档](https://www.typescriptlang.org/docs/handbook/2/generics.html)。还有一个要注意的点就是这里的`T`是有默认值的，当外界传进来值的时候就用外界传进来的值，没有的话`T`是`IState`类型。

### `useToggle`
#### `useToggle`声明
函数声明就是为了描述函数名，函数有几个参数，每个参数以及返回值的类型。
```JavaScript
function useToggle<T = boolean | undefined>(): [boolean, Actions<T>];

function useToggle<T = IState>(defaultValue: T): [T, Actions<T>];

function useToggle<T = IState, U = IState>(
  defaultValue: T,
  reverseValue: U,
): [T | U, Actions<T | U>];
```
这里就是三个`useToggle`函数的类型定义，也就是[Function Overloads](https://www.typescriptlang.org/docs/handbook/2/functions.html#function-overloads)。
1. 第一个类型是无参数的，返回的状态是布尔类型的，返回的同样是数组，数组第一个元素是布尔类型，第二个元素是修改状态的函数，类型就是上面`Actions`定义的，但是它的`T`只能是`boolean | undefined`。
2. 第二个类型是接受一个参数`T`，`T`的类型就是`IState`定义的类型，返回值类似上面的。
3. 第三个类型是接受两个参数`T`和`U`，他们的类型都是`IState`。注意这里要定义`T`和`U`，不能只定义一个`T`，然后`defaultValue`和`reverseValue`都是`T`类型，因为这样就限定了`defaultValue`和`reverseValue`是同一类型，我们想要的结果是他们可以是不同类型。函数的返回值的话类似上面的。这里不太明白的话可以这么思考，`T`有多少种类型，`U`有多少种类型，他们组合的话有多少种类型？（答案是他俩的类型种类相乘，还挺多的）。

#### `useToggle`定义
```JavaScript
function useToggle<D extends IState = IState, R extends IState = IState>(
  defaultValue: D = false as D,
  reverseValue?: R,
)
```
这个定义是比较难懂的，`extends`表示类型的约束，这个是泛型中类型约束的固定语法，就像我们定义函数参数的时候，用`:`来定义参数的类型约束一样。`D extends IState = IState`，这里我也*没看懂*。

#### `useToggle`函数体
```JavaScript
function useToggle<D extends IState = IState, R extends IState = IState>(
  defaultValue: D = false as D,
  reverseValue?: R,
) {
  const [state, setState] = useState<D | R>(defaultValue);

  const actions = useMemo(() => {
    const reverseValueOrigin = (reverseValue === undefined ? !defaultValue : reverseValue) as D | R;

    // 切换返回值
    const toggle = (value?: D | R) => {
      // 强制返回状态值，适用于点击操作
      if (value !== undefined) {
        setState(value);
        return;
      }
      setState((s) => (s === defaultValue ? reverseValueOrigin : defaultValue));
    };
    // 设置默认值
    const setLeft = () => setState(defaultValue);
    // 设置取反值
    const setRight = () => setState(reverseValueOrigin);
    return {
      toggle,
      setLeft,
      setRight,
    };
  }, [defaultValue, reverseValue]);

  return [state, actions];
}
```
我们可以看出来`useToggle`也是通过`useState`来实现的。这里面的`D | R`是因为被实例化的时候，`D`是一个类型而`R`可能是另外一种类型，那他们的`useState<xxx>`里面的`xxx`就应该是`D`的类型或上`R`的类型。然后再来看核心结构`actions`，这里用了`useMemo`来做记忆化，`defaultValue`和`reverseValue`的值是不会变的，所以`actions`也是不会变的，它也不应该会变，这如果外界依赖`actions`的话，就不会有问题。

这里面最难得就是那个`setState`，这里是设置了一个函数？不应该都是设置一个值吗？原来这是我不知道的一个特性，[参考这里](https://reactjs.org/docs/hooks-reference.html#functional-updates)。设置一个函数之后，这里就真的是非常巧妙。然后`setLeft`就对应设置为原始值，`setRight`就对应设置为反向值（就是那个`reverseValue`）。

### 用法

其实用到`useToggle`的类型还是挺多的，比如我们即将讲到的`useBoolean`。

### [useBoolean](https://github.com/alibaba/hooks/blob/master/packages/hooks/src/useBoolean/index.ts)
```JavaScript
import { useMemo } from 'react';
import useToggle from '../useToggle';

export interface Actions {
  setTrue: () => void;
  setFalse: () => void;
  toggle: (value?: boolean | undefined) => void;
}

export default function useBoolean(defaultValue = false): [boolean, Actions] {
  const [state, { toggle }] = useToggle(defaultValue);

  const actions: Actions = useMemo(() => {
    const setTrue = () => toggle(true);
    const setFalse = () => toggle(false);
    return { toggle, setTrue, setFalse };
  }, [toggle]);

  return [state, actions];
}
```
这个代码相对来说比较简单，就两个点，一个就是同样用`useMemo`做了记忆化，另一个就是是封装了一下`useToggle`。但是使用的时候会很方便，比如很多地方的`onCancel`就对应`setFalse`，这样就不用再定义一个箭头函数。


### 后记
当然这里并不是一个十分通用的hooks，只能说满足了我们这个业务需求，如果是别的需求，可以考虑用成熟的第三方库，比如阿里的[React Hooks Library](https://github.com/alibaba/hooks)，里面的useRequest就带有缓存，值得参考。

### 参考：
1. [hooks](https://github.com/alibaba/hooks)
1. [use-boolean](https://chakra-ui.com/docs/hooks/use-boolean#usage-of-on-and-off-methods)
1. [Functional updates](https://reactjs.org/docs/hooks-reference.html#functional-updates)
