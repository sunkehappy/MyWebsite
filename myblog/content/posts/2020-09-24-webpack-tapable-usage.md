---
date: 2020-09-24
category:       源代码
title:          WebPack的Tapable库用法介绍
tags:           [WebPack, 源代码]
---

最近打算看一下WebPack的源代码，遇到的第一个我觉得需要详细看下的不太复杂的点(相比于整个WebPack的代码)就是[Tapable](https://github.com/webpack/tapable)。因为稍微看下WebPack的代码的话就会发现到处都是hooks，这些hooks就是用的这个Tapable。这里先简单说下这个Tapable是用来干啥的，首先如果你简单了解过WebPack的原理的话，就会明白，WebPack就是通过entry构建依赖树，然后把这棵树上的所有代码打包到一起。那这详细说的话，其实是可以分为很多步的，比如找到入口(对应addEntry钩子)，生成代码之前(beforeCodeGeneration)，生成代码之后(afterCodeGeneration)，等等有很多。那我们相应的也会在这些步骤前或后做一些事情，这种情形就需要用钩子(hook)，这是很常见的开发技巧。如果只是很简单的场景，那我们直接用回调就可以了。比如那个找到入口，我可以这样写：
```
compilation.onAddEntry = (...) => {...}
```
那如果场景比较复杂呢？比如我想在代码生成后做多件事情，上面那个回调可只能加一个回调函数的，我们改造下，让上面的`onAddEntry`变成一个数组？那再进一步，我们这里做得完善点，于是就有了Tapable。

