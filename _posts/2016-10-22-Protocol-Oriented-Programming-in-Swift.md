---
date: 2016-10-22
title:		Swift的面向协议编程（翻译）
category:	翻译
tags:		[WWDC, Swift, 翻译]
---

翻译自：[Protocol-Oriented Programming in Swift](https://www.infoq.com/news/2015/06/protocol-oriented-swift/)

在WWDC2015中苹果Swift标准库老大[Dave Abrahams](https://en.wikipedia.org/wiki/David_Abrahams_/(computer_programmer/))，在C++/Boost方面很出名的人，说Swift是一种[面向协议的编程语言](https://developer.apple.com/videos/wwdc/2015/?id=408)，并且展示了如何用协议来优化你的代码。

<!--more-->

面向协议编程是一个OOP范式，相对于类，它更倾向于使用协议(就是Swift语言中的接口)。

### 类很棒吗？

在OOP中类被用来提供：

 * 封装
 * 访问控制
 * 抽象
 * 命名空间
 * 可表达性
 * 可扩展性

Abrahams却说实际上那都是类型的属性，类只不过是属性的一种实现方式。它们给程序员带来了沉重的负担，因为他们可能会引起：

 * 隐式的共享。如果两个对象同时引用第三个对象，那么他们就可以在对方不知道的情况下修改这个对象。这会导致一种解决方案：复制那个对象来避免共享，然后这又会导致效率低下。或者另一种解决方案，加锁，共享会需要加锁来避免竞争条件，但是这更会降低效率，甚至导致死锁。这需要更高的复杂度，也就是说更多的bug。
 * 继承问题。在许多OOP语言中父类只能有一个，这个父类是提前选好的。后面想要修改父类是极端困难的。而且，父类还会给派生类强制加上它自己所有的属性，这会导致初始化和不破坏父类需要的不变性变得很复杂。最后，什么可以被覆盖，如何覆盖，什么时候不应该覆盖都是有条件限制的，这些条件都留给文档了。
 * 丢失的类型关系。丢失的类型关系会导致接口和实现无法合并。这一般会出现在一些基类的方法中，这个基类无法对方法提供实现因此必须向下传递给派生类的方法实现。下面的代码片段说明了这个问题：


```swift
class Ordered {
    func precedes(other: Ordered) -> Bool {
        fatalError("implement me!")
    }
}

class Label : Ordered {
    var text: String = ""
    ...
}

class Number : Ordered {
    var value: Double = 0

    override func precedes(other: Ordered) -> Bool {
        return value < (other as! Number).value
    }
}
```


据Abrahams说，面向协议的编程是更好的抽象，因为它允许：

 * 值类型（除了类）
 * 静态类型关系（除了动态调度）
 * retroactive modeling
 * 对模型没有数据强制
 * 没有初始化负担
 * 澄清了什么应该被实现

### 面向协议编程

Abrahams说Swift里面做抽象的第一步就应该是协议。然后他用协议和结构体重写了Ordered的例子来说明实现方式是多么简洁：

```swift
protocol Ordered {
    func precedes(other: Self) -> Bool
}
struct Number : Ordered {
    var value: Double = 0
    func precedes(other: Number) -> Bool {
        return self.value < other.value
    }
}
```

在上面的代码片段中precedes方法里面用的Self使得Number类中的precedes方法的实现可以正确的获取参数并且不需要强制转换。
在协议里面包含Self有很重要的意义。

协议中的Self参数类型有一个很重要的含义。实际上，如果我们定义一个接受Ordered实例数组的binarySearch方法，我们可以这样写：

```swift
class Ordered { ... }

func binarySearch(sortedKeys: [Ordered], forKey k: Ordered) -> Int {
    var lo = 0
    var hi = sortedKeys.count
    while hi > lo {
        let mid = lo + (hi - lo) / 2
        if sortedKeys[mid].precedes(k) { lo = mid + 1 }
        else { hi = mid }
    }
    return lo
}
```
另一方面，如果我们用一个包含Self参数类型的协议的话，我们就得定一个泛型的方法：

```swift
protocol Ordered { ... }

func binarySearch<T : Ordered>(sortedKeys: [T], forKey k: T) -> Int {
    ...
}
```

使用Self参数类型和不用相差巨大。尤其是Self会把我们置于静态分发（static dispatch）中，还需要使用泛型和同质化的容器。下图有更详细的说明：
![使用Self和不用的对比](/assets/images/protocol-oriented-swift-1.jpeg)

### 可追溯的模型

为了更详细的介绍怎么用协议和结构体来替代类层次结构，Abrahams接着介绍了一个用来渲染几何图形的Renderer小程序。这个例子突出了协议和类提供的可追溯的模型。在这个具体的例子中，可追溯的模型被用在创建CGContext的一个实现了Renderer协议的扩展：

```swift
protocol Renderer {
    func moveTo(p: CGPoint)
    func lineTo(p: CGPoint)
    func arcAt(center: CGPoint, radius: CGFloat,
    startAngle: CGFloat, endAngle: CGFloat)
}

extension CGContext : Renderer {
    ...
}
```

通过这样做CGContext类型可以在任何使用Renderer类型的地方使用，即使是CGContext在Renderer之前被定义。

另一方面，提供一个输出几何图形的文字表现形式的实现了这个协议的TestRenderer类也是可以的：

```swift
struct TestRenderer : Renderer {
    func moveTo(p: CGPoint) { print("moveTo(\(p.x), \(p.y))") }
    func lineTo(p: CGPoint) { print("lineTo(\(p.x), \(p.y))") }
    ...
}
```
这两个Renderer的实现可以相互替换。

### 协议扩展

Swift 2.0引入了一个新功能，这个功能使得协议的使用更加方便：协议扩展。它允许为一个协议提供默认的实现。解释如下面这段代码：

```swift
extension CollectionType where Generator.Element : Equatable {
    public func indexOf(element: Generator.Element) -> Index? {
        for i in self.indices {
            if self[i] == element {
                return i
            }
        }
        return nil
    }
}
```

声明Generator.Element是Equtable的，然后才允许在indexOf中使用==操作符。

演讲的最后部分讲解了一些协议扩展和约束带来的小技巧，比如说美化泛型方法的定义，从：

```swift
func binarySearch<C : CollectionType where C.Index == RandomAccessIndexType, C.Generator.Element : Ordered>(sortedKeys: C, forKey k: C.Generator.Element) -> Int {
    ...
}
```
到：

```swift
extension CollectionType where Index == RandomAccessIndexType, Generator.Element : Ordered {
    func binarySearch(forKey: Generator.Element) -> Int {
        ...
    }
}
```

### 什么时候用类？

在演讲结束之前，Abrahams强调类仍然有它们的用武之地，尤其是当你需要隐式共享，比如当：

 * 拷贝或者比较实例是没有意义的
 * 实例的生命周期与外部效果相关联，比如一个临时文件。
 * 实例是“水槽”，只修改一些外部状态，比如CGContext。

最后，当时用Cocoa这样的围绕着对象和子类主题的框架的时候，尝试对抗系统是毫无意义的。但是，当重构一个很大的类的时候，使用协议和结构体来一点一点拆出来代码会很棒。