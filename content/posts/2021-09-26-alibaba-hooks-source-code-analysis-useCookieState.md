---
date:           2021-09-26
category:       前端
title:          alibaba/hooks代码解读之useCookieState
tags:           [React, React Hooks, 源代码]
---
`useCookieState`是用来管理Cookie的，可以用hook的方式十分方便的来访问Cookie。
<!--more-->

## [useCookieState](https://github.com/alibaba/hooks/blob/master/packages/hooks/src/useCookieState/index.ts)

### 简介
首先要明白什么是Cookie，可以看下MDN上面的定义，[Cookie][Cookie]和[Document.cookie][Document.cookie]。我们可以看出Cookie本身就是一个在HTTP请求头中的字段，我们可以通过`document.cookie`来存取，但是存取的时候它是一个字符串，需要转化为key-value的形式，而且会牵涉到编码/解码，所以不建议裸写存取方法。而`useCookieState`也是用的[js-cookie](https://github.com/js-cookie/js-cookie)来做的，这个hook本身就是一个以hook形式来访问Cookie。

### 总体结构
代码的整体结构很简单，一句话就是`useState`，其中`useState`的默认值是一个函数，这个用法官网上面也有介绍：[Lazy initial state](https://reactjs.org/docs/hooks-reference.html#lazy-initial-state)。另外就是状态的更新是被`updateState`封装起来了，而且`updateState`用了`useCallback`来保证当参数不变的时候不会变。

### 关键代码

这里看懂总体结构之后，就基本没有问题了，除了上面提到的初始值的懒加载，还有就是我在[alibaba/hooks代码解读之useBoolean和useToggle](/posts/2021-08-19-alibaba-hooks-source-code-analysis-usetoggle/)里面提到的[Functional updates](https://reactjs.org/docs/hooks-reference.html#functional-updates)。最后一点就是`useCookieState`的更新函数可以通过设置`null`或者`undefined`来清除某个Cookie。

### CookieAttributes
最后这个`Cookie.CookieAttributes`的代码我在GitHub上面没有找到，所以就通过在`node_modules`里面找到的`@types/js-cookie`里面的代码，贴到这里：
```JavaScript
interface CookieAttributes {
        /**
         * Define when the cookie will be removed. Value can be a Number
         * which will be interpreted as days from time of creation or a
         * Date instance. If omitted, the cookie becomes a session cookie.
         */
        expires?: number | Date | undefined;

        /**
         * Define the path where the cookie is available. Defaults to '/'
         */
        path?: string | undefined;

        /**
         * Define the domain where the cookie is available. Defaults to
         * the domain of the page where the cookie was created.
         */
        domain?: string | undefined;

        /**
         * A Boolean indicating if the cookie transmission requires a
         * secure protocol (https). Defaults to false.
         */
        secure?: boolean | undefined;

        /**
         * Asserts that a cookie must not be sent with cross-origin requests,
         * providing some protection against cross-site request forgery
         * attacks (CSRF)
         */
        sameSite?: 'strict' | 'Strict' | 'lax' | 'Lax' | 'none' | 'None' | undefined;

        /**
         * An attribute which will be serialized, conformably to RFC 6265
         * section 5.2.
         */
        [property: string]: any;
    }
```

### 参考：
1. [How do I create and read a value from cookie?](https://stackoverflow.com/a/4825695/1548523)
1. [js-cookie](https://github.com/js-cookie/js-cookie)
1. [Cookie][Cookie]
1. [Document.cookie][Document.cookie]

[Cookie]: https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Cookie
[Document.cookie]: https://developer.mozilla.org/zh-CN/docs/Web/API/Document/cookie
