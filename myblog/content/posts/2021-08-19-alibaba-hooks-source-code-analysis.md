---
date:           2021-08-19
category:       前端
title:          阿里hooks代码解读
tags:           [React, React Hooks, 源代码]
---
说来惭愧，在上家公司里面hooks用的不多，现在的新公司新项目，全是函数式组件，没有类组件了。我也开始大量使用各种hooks，然后找到了这个第三方库[hooks](https://github.com/alibaba/hooks)，自定义的hooks。这篇文章就是来分析一下各个hooks的源代码。
<!--more-->

### [useToggle](https://github.com/alibaba/hooks/blob/master/packages/hooks/src/useToggle/index.ts)
本来第一个是想先分析`useBoolean`的，但是那里面用到了这个`useToggle`，所以就先分析这个了。
```JavaScript
```

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
这个代码相对来说比较简单，就两个点，一个是


### 后记
当然这里并不是一个十分通用的hooks，只能说满足了我们这个业务需求，如果是别的需求，可以考虑用成熟的第三方库，比如阿里的[React Hooks Library](https://github.com/alibaba/hooks)，里面的useRequest就带有缓存，值得参考。

### 参考：
1. [hooks](https://github.com/alibaba/hooks)
1. [use-boolean](https://chakra-ui.com/docs/hooks/use-boolean#usage-of-on-and-off-methods)
