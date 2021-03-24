---
date:           2021-03-23
category:       前端
title:          腾讯极客技术挑战赛第三期
tags:           [vite, 源代码]
---

在一个腾讯技术群里看到这个比赛，就顺手点开看了下，本以为会是算法比赛或者安全比赛。我尝试了一下之后，发现我也可以搞搞，因为是前端相关。我并不是专业搞安全的，也未能拿到很好的名次（69/927），不过在做题的过程中，我能突破自我，能想办法解决这些问题，还是很有成就感的。
<!--more-->
## 第一题
首先就是web上面点一下，稍等一下，就能种上一棵树。然后我就打开开发者工具，去看网络请求，然后尝试找规律。

![hmr-plugin-update-main-structure](/assets/images/vite/hmr-plugin-update-main-structure.png)

可以从上图看到，每点击一次种树，就会有1和2两个请求，一个`pull`一个`push`，而且似乎1请求里面返回的`a`数组里面的数字，会被2请求发回到服务端。那我就开始尝试用脚本跑一下试试，然后就选择了用Node.js和[axios](https://github.com/axios/axios)，下面的代码是比赛的时候写的，也没有刻意去优化。

```jsx
function plantTree() {
  axios.get('http://159.75.70.9:8081/pull?u=0000023905914B302E216CE478979D59')
    .then(async function (response) {
      // console.log('pull response: ', response);
      const t = response.data.t
      const a = response.data.a[0]
      console.log(`t: ${t}, a: ${a}`)
      axios.get(`http://159.75.70.9:8081/push?t=${t}&a=${a}`)
        .then(function (response) {
          console.log(`current score: ${response.data.score}`);
          plantTree();
        })
        .catch(function (error) {
          // handle error
          console.log(`inner error: ${error}`);
        });
    })
    .catch(function (error) {
      // handle error
      console.log(`error: ${error}`);
    });
}

plantTree();
```
然后跑了一下，结果真的可以，这样就种到了1万棵树。注意比赛的时候1秒内种上多棵树是可以触发加速，就是一个请求可以增加50，100甚至更多，方便选手进入下一题，~~比赛过后这个没了，只能老老实实的一颗一颗种~~，在微信群里喊了之后，腾讯的大佬们修复了，确认是分数重置之后的bug。

## 第二题
第二题其实和第一题没有很大的区别，就是`pull`返回的数需要计算出`x * (x+1)再放到`push`里面提交就可以了。这里就不写代码了，这样可以种到10万棵树。

## 第三题
这个题目用上面的方法就不行了，因为没办法找到简单的规律，其实一直到这里，我都在用算法竞赛的那个思路来做的，就是分析数据，找规律。其实这种是可以通过查看那个`pull`和`push`中间获取的JS文件的代码的。我也是在这个时候才发现这个思路。

然后我们看一个这个JS文件的样例：
```jsx
eval(atob("dmFyIF8weGU5MzY9WydBNTQ3Mzc4OCddOyhmdW5jdGlvbihfMHg0OGU4NWMsXzB4ZTkzNmQ4KXt2YXIgXzB4MjNmYzVhPWZ1bmN0aW9uKF8weDI4NThkOSl7d2hpbGUoLS1fMHgyODU4ZDkpe18weDQ4ZTg1Y1sncHVzaCddKF8weDQ4ZTg1Y1snc2hpZnQnXSgpKTt9fTtfMHgyM2ZjNWEoKytfMHhlOTM2ZDgpO30oXzB4ZTkzNiwweDE5NikpO3ZhciBfMHgyM2ZjPWZ1bmN0aW9uKF8weDQ4ZTg1YyxfMHhlOTM2ZDgpe18weDQ4ZTg1Yz1fMHg0OGU4NWMtMHgwO3ZhciBfMHgyM2ZjNWE9XzB4ZTkzNltfMHg0OGU4NWNdO3JldHVybiBfMHgyM2ZjNWE7fTt3aW5kb3dbXzB4MjNmYygnMHgwJyldPWZ1bmN0aW9uKF8weDMzNTQzNyl7dmFyIF8weDFhYWMwMj0weDMwZDNmO2Zvcih2YXIgXzB4M2JlZDZhPTB4MzBkM2Y7XzB4M2JlZDZhPjB4MDtfMHgzYmVkNmEtLSl7dmFyIF8weDM3NTM0MD0weDA7Zm9yKHZhciBfMHgxZGRiNzc9MHgwO18weDFkZGI3NzxfMHgzYmVkNmE7XzB4MWRkYjc3Kyspe18weDM3NTM0MCs9XzB4MzM1NDM3WydhJ11bMHgwXTt9XzB4Mzc1MzQwJV8weDMzNTQzN1snYSddWzB4Ml09PV8weDMzNTQzN1snYSddWzB4MV0mJl8weDNiZWQ2YTxfMHgxYWFjMDImJihfMHgxYWFjMDI9XzB4M2JlZDZhKTt9cmV0dXJuIF8weDFhYWMwMjt9Ow=="))
```

竟然是用的eval，网上查了下，`atob`是用来base64解码的，然后我直接拿着这个base64之后的字符串到网上解码，结果是一串JS代码，格式化一下：
```jsx
var _0xe936 = ["A5473788"];
(function (_0x48e85c, _0xe936d8) {
  var _0x23fc5a = function (_0x2858d9) {
    while (--_0x2858d9) {
      _0x48e85c["push"](_0x48e85c["shift"]());
    }
  };
  _0x23fc5a(++_0xe936d8);
})(_0xe936, 0x196);
var _0x23fc = function (_0x48e85c, _0xe936d8) {
  _0x48e85c = _0x48e85c - 0x0;
  var _0x23fc5a = _0xe936[_0x48e85c];
  return _0x23fc5a;
};
window[_0x23fc("0x0")] = function (_0x335437) {
  var _0x1aac02 = 0x30d3f;
  for (var _0x3bed6a = 0x30d3f; _0x3bed6a > 0x0; _0x3bed6a--) {
    var _0x375340 = 0x0;
    for (var _0x1ddb77 = 0x0; _0x1ddb77 < _0x3bed6a; _0x1ddb77++) {
      _0x375340 += _0x335437["a"][0x0];
    }
    _0x375340 % _0x335437["a"][0x2] == _0x335437["a"][0x1] &&
      _0x3bed6a < _0x1aac02 &&
      (_0x1aac02 = _0x3bed6a);
  }
  return _0x1aac02;
};
```
其实上面的代码中第一个匿名函数立即执行没啥用，循环了`0x196`次，就是从`_0x48e85c`数组中`shift`出来，再`push`进去，作者的目的应该就是为了干扰参赛者。然后`_0x23fc("0x0")`的结果就是为了拿到代码开头的`"A5473788"`。

**重点**来了，优化的关键就是那个二重`for`循环，外层`for`循环会执行`0x30d3f`，也就是`199999`次，问题不大，就看内层循环了。结果内层循环要做的就是`_0x335437["a"][0x0]`求和`_0x3bed6a`次，这个用JS简化下就好办了，用`_0x375340 = _0x335437["a"][0x0] * _0x3bed6a;`替换掉内层`for`循环，就可以跑通，然后配合加速，这个题就过了，当然也可以再优化，不过没必要了。这样就可以种到25万棵树。

## 第四题
这题的JS代码更有意思：[A593C8B8.js](/assets/js/A593C8B8.js)，这个我在知乎上看过一篇文章，大意就是讲JS的这种古怪代码。其实很简单，拿着那些东西到浏览器命令行里面，一敲就出结果了。比如说：`!+[]`就是`true`，这里有一个相关的介绍：[Why is [1,2] + [3,4] = “1,23,4” in JavaScript?](https://stackoverflow.com/a/7124907/1548523)。然后这样逐步替换，得到简化之后的代码：
```jsx
window.A593C8B8 = async (_) =>
  (($, _, __, ___, ____) => {
    let _____ = (function* () {
      while ([])
        yield [(_, __) => _ + __, (_, __) => _ - __, (_, __) => _ * __][
          ++__ % 3
        ]["bind"](0, ___, ____);
    })();
    let ______ = function (_____, ______, _______) {
      ____ = _____;
      ___ = ______["next"]()["value"]();
      __ == _["a"]["length"] && _______(-___);
    };
    return new Promise((__) =>
      _["a"][
        "forEach"
      ]((___) => $["setTimeout"]((____) => ______(___, _____, __), ___))
    );
  })(window, _, +[], +[], +[]);
```
结构稍微有点复杂，我第一次的时候有点看不太懂，为了用Node.js调试，把`window`换成了`globalThis`，这个是根据最新的ES11里面的[globalThis](https://ecmascript.calvinhappy.com/es11/globalThis)，然后通过调试，我看明白了。就是`A593C8B8.js`里面在`globalThis`挂载了一个名叫`A593C8B8`的函数，接受`_`作为参数，返回的是一个立即执行的匿名函数，这个匿名函数有5个参数，第一个是`globalThis`，第二个是最外层调用时传进来的`_`，后面都是0，如下图。

![tencent-geeks-chanllenge-3-p4-code-structure](/assets/images/tencent-geeks-chanllenge-3-p4-code-structure.png)

我们粗略分析可以看出来，这里面竟然用了个定时器，去掉定时器肯定可以节省不少时间，具体怎么去掉呢？其实它是拿着`pull`请求的`a`里面的数字进行进行倒计时的，那也就是说，如果我们提前给`a`按照升序排序，那我们就可以不用`setTimeout`，直接循环遍历即可。注意，这个代码很容易改错，改之前就可以通过脚本来跑的，大约1秒多就能种一颗，所以可以一边改一边跑脚本，确保改的是正确的，不正确的话就回退。
这里排序还遇到了一个很奇怪的问题，`[1,3,23].sort()`的结果跟我们预期不一样，是`[1, 23, 3]`，这是因为`sort`函数默认是直接按照字符串来排序的，所以我们需要给`sort`一个排序函数。只要去掉这个计时器，就能通过脚本跑起来，触发加速，这题就过了。当然上面的代码还可以再仔细研究，上面的其实是一个生成器函数，调用一下`next()`就会返回一个计算的函数，可以通过静态分析+动态调试分析把代码重写下，这里我就不做了，感兴趣的读者可以试一下，记得边修改边测试。这样就到了50万棵树

额外说一下，我并不是第一次就想到了用`globalThis`来替换`window`的，我是想的纯手动把这个浏览器可用的代码改成服务端可用的，我是不是很傻？另外为了动态调试，我是通过Charles抓包，然后修改返回的JS文件，在我想让它暂停的地方加上`debugger;`，这样来启动调试器，虽然比不上直接用`globalThis`替换脚本里面的`window`，但是也可以分析。

## 第五题
这一题我上来的时候是有点懵的，WebAssembly，第一次接触，然后我就开始网上找资料，最后发现可以通过Chrome来动态调试，好家伙这就没啥怕的了，直接读代码+调试，读懂之后用JS重写一下就可以了。

![tencent-geeks-chanllenge-3-p5-webassembly](/assets/images/tencent-geeks-chanllenge-3-p5-webassembly.png)

WebAssembly竟然是堆栈机器，很新颖的东西，之前没接触过。好在之前研究编译原理的时候复习过汇编，动态调试+猜+查文档，发现这个文件的作用就是传入`x`和`y`两个参数，外层循环`y`次，每一次循环就把x变成一个字符串，然后把最小值和最大值相乘，累加到最后结果里面，返回结果。我重点是参考了这个文档[](https://webassembly.github.io/spec/core/appendix/index-instructions.html)，能够验证我猜测的指令的作用，比如`i32.rem_u`，`i32.div_u`，`i32.gt_u`。

也可以额外加一个优化，当相乘结果为0的时候，就不要循环了，后面的循环全是0，直接返回就好了。这样就到了100万棵树。

## 第六题
到这一题就很难了，也很不方便分析，不优化的情况下成功种一棵树要跑10+分钟。来看下代码：[CA1807EB.js](/assets/js/CA1807EB.js)。

然后我也没有很好的办法，毕竟必须要优化，想要优化就必须看懂，很无奈我硬着头皮动态调试来搞明白这个程序到底想干什么。后来发现它有点像汇编（后来才明白这叫JS虚拟机），通过一遍又一遍的运行和猜想+验证，终于明白他是要计算`pull`里面返回的数组中每个元素的某个次方，结果取模一个很大的树`1125899906842597`，这个次方是一次一次乘出来的，不慢就怪了，这个次方是通过[CA1807EB.js](/assets/js/CA1807EB.js)这个脚本运行时提供的，考虑到这里面没有随机数，我就想把他们提取出来，然后直接手工计算，然后再优化。

然后过程不说了，一回生二回熟，各种断点，条件断点，终于提取出来了，然后就是如何快速计算`(a0**b0 * a1**b1 + ... + a5**b5 * a6**b6)%1125899906842597`，这个在算法竞赛中遇到过，不懂的可以百度一下“快速幂取模运算”。搞定这些之后，开始跑脚本，通了，不过跑到101万棵树的时候就跪了，抓包看了下，脚本变了！这个时候我就知道，不能手工提取这些数字，需要用脚本提取。然后我就开始利用之前观察到的规律去尝试动态提取，无奈时间不够了，周末要带孩子，平时要上班工作，第一次提取出来的结果跑不通，后来就来不及了，比赛要结束了。最终卡在了这里，现在来看，我主要是没想到修改输入数据，比如都改成1，这样循环的次数极大减少，调试提取数字就特别快，后面应该能。

现在比赛已经结束了。可以参考大佬们的代码的了，[第一名大佬的方法](https://github.com/mcfx/qq_geek_tree)的确是不一样。然后我的方法其实也是正确的，只是我第一次玩这个，不熟练，加上时间不够，就来不及了，跟其他参赛者交流发现，这种方法其实是可行的。方法整理：

* 第一名大佬的方法
* 提取数字+跑脚本法
  * 正则表达式
  * 用[1,1,1]这种，然后输出
  * 固定位置提取

其实可以看出来，出题人并不想卡参赛者，所以这些数字并没有乱序出现，只要有一种思路，就可以跑通。最后我是用的[1,1,...]这种数据替换，然后hook`BigInt`方法打印数据到文件（其实放到`globalThis`里面更好），然后主脚本记住上次JS文件的名字，有变化了就重新下载JS文件，注入代码，提取数据。记得每次跑完把hook的方法重置回去。这样就到了200万棵树，比赛的时候，这题能很早做出来，就可以进前10了。

## 第七题

我拿到的JS文件：[F3B9B832.js](/assets/js/F3B9B832.js)，参考了下别的选手的题解，发现需要大量分析代码，而且结果也很没意思，就考察安全逆向分析方面，有不少干扰代码，对我来说意义不大，后面的就不做了。

