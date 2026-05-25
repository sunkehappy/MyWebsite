---
date:           2022-09-22
category:       前端
title:          immer原理解析
tags:           [React, ImmerJs, 原理, Proxy]
---

## 问题引入
在React里面，我们`setState`的时候，需要新生成一份state，如果这个state比较大，而且有嵌套，这种操作会变的很繁琐，也很容易出错，比如下面这个：
```JavaScript
const initialUser = {
  "id": 1,
  "name": "张三",
  "address": {
    "street": "上海市杨浦区",
    "suite": "黄兴路221号",
    "city": "上海市",
    "zipcode": "200000",
    "company": {
      "name": "得物",
      "title": "工程师",
    },
    "geo": {
      "lat": "31.3159",
      "lng": "121.1496"
    }
  },
};

function User() {
  const [user, setUser] = useState(initialUser);

  return (
    <div>
      <label>修改 user.address.geo.lat </label>
      <input
        value={user.address.geo.lat}
        onChange={e => {
          setUser({
            ...user,
            address: {
              ...user.address,
              geo: {
                ...user.address.geo,
                lat: e.target.value
              }
            }
          })
        }}
      />
    </div>
  )
}
```

我们可以看到这里的setUser写的非常难看，也不便于理解，10行代码就一个作用，类似`user.address.geo.lat = e.target.value`。但我们知道state是不能这么修改的，必须要新生成一份，难道就没有简单的办法来达到这一目的吗？
深拷贝？
一种思路就是直接深拷贝一份user，然后修改这个拷贝后的user并返回，比如像下面这样，写法十分简单：
```JavaScript
import {cloneDeep} from 'lodash';

const copy = cloneDeep(user);
user.address.geo.lat = e.target.value;
console.log(copy.company === user.company); // false
```

但这样会有几个问题
1. 拷贝效率低
2. 修改了不该修改的值
3. 处理不了环
比如如果别的组件用到了company，那深拷贝user之后company属性也变了，这会导致组件重复渲染。
如何只修改变化的部分？
有没有什么办法可以让我们劫持修改的步骤，这样我们能记录一下这些修改，然后后面把这些修改再综合起来，生成一份新的对象？确实是有的，`Proxy`。
```JavaScript
const proxyUser = new Proxy(initialUser, {
  set(target, property, newValue) {
    // 每次调用proxyUser.xx = yy的时候，都会走到这里。
    console.log(`modify ${property} with: ${newValue}`);
  },
});
```

我们可以提供这样一个函数myImmer，接收参数obj，把所有对这个obj的修改都放到函数里面，这样我们可以在修改前后做对应的处理，就像下面这样：
```JavaScript
  const myImmer = (obj, fn) => {
    const original = obj;
    const proxyObj = getProxyObj(obj);

    fn(proxyObj);

    const result = finalize(original);
    return result;
  };
  
  const proxyUser = myImmer(initialUser, (initialUser) => {
    initialUser.name = "李四";
    initialUser.address.geo.latitude = 31;
  });
```

### getProxyObj(第一版)
首先我们得明白，如果我们想要只修改变化的部分，那我们就得知道哪些地方被修改了。JS里面有什么办法可以在属性被修改的时候收到通知吗？那就是Proxy，不了解的读者可以百度搜索下，下面是一个简单的例子：
```JavaScript
const getProxyObj = (obj) => {
  return new Proxy(obj, {
    set(target, property, newValue) {
      console.log(
        `property "${property}", modified, new value: ${newValue}`
      );
      Reflect.set(target, property, newValue);
    },
  });
};
const proxyUser = getProxy(initialUser);
proxyUser.name = "李四";
console.log(initialUser === proxyUser); // false
console.log(initialUser.address === proxyUser.address); // true;
```
这个例子我们已经可以看到initialUser和proxyUser好像已经达到我们的预期了。但这个时候我们还需要一些处理，因为proxyUser是一个Proxy，我们要把它转成一个正常的普通的对象，跟initialUser一样。
可以思考下，我们最上面的例子里面手工拷贝是如何拷贝的？是一层一层来做的，那我们在这里也需要这么做，但在每层里面，我们怎么知道要不要拷贝呢？拷贝哪个属性呢？我们需要在修改的时候做一个记忆化，记住哪些属性被修改了，然后最后统一把被修改的地方拷贝一遍就好了。这个函数我们就叫它finalize，作用就是把Proxy转换成普通对象(需要拷贝，就像我们最上面例子里面的展开运算符一样)。
### finalize(第一版)
```JavaScript
  const finalize = (subObj) => {
    // 如果修改obj.a之后，再修改obj.b，那obj应该是
    // 同一份，所以我们不能无脑copy，需要做一个记忆化
    const copy = getOrCreateCopy(subObj);
    for (key in subObj) {
      copy[key] = finalize(subObj[key]);
    }
    return copy;
  };
```
getOrCreateCopy的作用就是有被拷贝的话就返回对应的拷贝，没有的话就拷贝一份并返回。
```JavaScript
  const getOrCreateCopy = (obj) => {
    let copy = copies.get(obj);
    if (!copy) {
      copy = Array.isArray(obj) ? [...obj] : { ...obj };
    }
    copies.set(obj, copy);
    return copy;
  };
```

这里引入了一个变量copies，这是一个Map，key就是一个对象，value就是这个对象的复制。
### getProxyObj(第二版，终版)
第一版里面我们的getProxyObj里面的set方法是直接修改的obj，这是不正确的，我们应该直接先拷贝一份，再修改。
```JavaScript
    ...
    set(target, property, newValue) {
      const copy = getOrCreateCopy(target);
      copy[property] = getProxyObj(newValue);
    },
    ...
```

注意这里我们这里又一次使用了getOrCreateCopy，因为如果target被拷贝过了，那我们就不能再次拷贝，要不然就不正确了。同时，newValue我们也用Proxy把它包裹了起来，要不然下一层的修改就不会被劫持。

还有个问题是我们的getProxyObj没添加get方法，我们要补充上去。
```JavaScript
    get(target, property) {
      console.log(`get "${property}"`);
      return getProxyObj(getCopyOrSource(target)[property]);
    },
```

这里为什么又加一个getCopyOrSource(target)而不是直接target？因为如果只是读取操作，是不需要去拷贝的。但是如果已经拷贝过，我们就得使用拷贝过的那一份，因为后续有可能有别的修改，这些修改是修改到拷贝的那一份上面的，不是原对象。
那为什么最外面又套一层getProxyObj？因为a.b.c = x 是先读取a.b，这是一个get，这里必须要Proxy，要不然后面的b.c = x就不会被劫持。

如果传进来的obj就不是对象，那我们就不能给它创建Proxy，这里需要做一个校验。
最后一个问题，如果我们已经给一个obj做过Proxy，后面还有读取和修改，我们再给它套一层Proxy吗？不能，我们要给他一个缓存，proxies，key是对象，value是它对应的Proxy之后的对象。

综合起来的完整版：
```JavaScript
  const copies = new Map();
  const proxies = new Map();

  const getCopyOrSource = (obj) => {
    return copies.get(obj) || obj;
  };

  const handler = {
    get(target, property) {
      console.log(`get "${property}"`);
      return getProxyObj(getCopyOrSource(target)[property]);
    },
    set(target, property, newValue) {
      const copy = getOrCreateCopy(target);
      copy[property] = getProxyObj(newValue);
    },
  };

  const getProxyObj = (obj) => {
    if (typeof obj === "object") {
      const p = proxies.get(obj) || new Proxy(obj, handler);
      proxies.set(obj, p);
      return p;
    }
    return obj;
  };
```

### finalize(第二版，终版)
我们的第一版里面，是无脑拷贝，正确的应该是只有修改路径上的那些对象应该被拷贝，可以体会一下最上面的那个例子：
```JavaScript
  const finalize = (subObj) => {
    // 加上下面三行
    if (!hasChanges(subObj)) {
      return subObj;
    }

    const copy = getOrCreateCopy(subObj);
    for (key in subObj) {
      copy[key] = finalize(subObj[key]);
    }
    return copy;
  };
```

### hasChanges
hasChanges(obj)的作用就是判断obj是否被修改过，这里不太好理解。我们可以按层来考虑这个问题，首先如果一个对象就没有被创建过Proxy，那他肯定不会被修改过。因为所有的修改，我们都是先创建Proxy，再修改。最顶层是在myImmer里面创建的，后续子层级里面的修改，都是先get，再修改，我们在get的时候就会创建Proxy。
创建了Proxy并不一定会修改，比如用户在函数里面就读取一下属性，输出一个log。
但如果一个对象有它对应的拷贝，那他肯定有改变，可以搜索一下copies的修改时机，就是set方法里面（finalize里面调用就是纯粹节省代码）。
判断完本层级，如果还不能确定是否有改变，那就需要看子层级，子层级如果有改动，就说明有改动，都没有就是真没有，需要递归。
```JavaScript
  const hasChanges = (obj) => {
    const proxy = proxies.get(obj);

    if (!proxy) {
      return false;
    }

    if (copies.get(obj)) {
      return true;
    }

    for (const key of Object.keys(obj)) {
      if (hasChanges(obj[key])) {
        return true;
      }
    }
    return false;
  };
```


## 最终版
```JavaScript
  const initialUser = {
    id: 1,
    name: "张三",
    address: {
      street: "上海市杨浦区",
      suite: "黄兴路221号",
      city: "上海市",
      zipcode: "200000",
      geo: {
        lat: "31.3159",
        lng: "121.1496",
      },
    },
    company: {
      name: "得物",
      title: "工程师",
    },
  };

  const copies = new Map();
  const proxies = new Map();

  const getCopyOrSource = (obj) => {
    return copies.get(obj) || obj;
  };

  const handler = {
    get(target, property) {
      console.log(`get "${property}"`);
      return getProxyObj(getCopyOrSource(target)[property]);
    },
    set(target, property, newValue) {
      const copy = getOrCreateCopy(target);
      copy[property] = getProxyObj(newValue);
    },
  };

  const getProxyObj = (obj) => {
    if (typeof obj === "object") {
      const p = proxies.get(obj) || new Proxy(obj, handler);
      proxies.set(obj, p);
      return p;
    }
    return obj;
  };

  const getOrCreateCopy = (obj) => {
    let copy = copies.get(obj);
    if (!copy) {
      copy = Array.isArray(obj) ? [...obj] : { ...obj };
    }
    copies.set(obj, copy);
    return copy;
  };

  const hasChanges = (obj) => {
    const proxy = proxies.get(obj);

    if (!proxy) {
      return false;
    }

    if (copies.get(obj)) {
      return true;
    }

    for (const key of Object.keys(obj)) {
      if (hasChanges(obj[key])) {
        return true;
      }
    }
    return false;
  };

  const finalize = (subObj) => {
    if (!hasChanges(subObj)) {
      return subObj;
    }

    const copy = getOrCreateCopy(subObj);
    for (key in subObj) {
      copy[key] = finalize(subObj[key]);
    }
    return copy;
  };

  const myImmer = (obj, fn) => {
    const original = obj;
    const proxyObj = getProxyObj(obj);

    fn(proxyObj);

    const result = finalize(original);
    return result;
  };

  const proxyUser = myImmer(obj, (obj) => {
    obj.name = "李四";
    obj.address.geo.latitude = 31;
  });
  console.log(initialUser === proxyUser); // false
  console.log(initialUser.company === proxyUser.company); // true;
```

## 参考
* [Loop through an array in JavaScript](https://stackoverflow.com/q/3010840/1548523)
* [Proxy - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
