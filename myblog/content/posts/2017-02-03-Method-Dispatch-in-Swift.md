---
date: 2017-02-03
title:		Swift的方法调度
category:	翻译
tags:		[Swift, 翻译, 运行时]
---

翻译自：[Method Dispatch in Swift](https://www.raizlabs.com/dev/2016/12/swift-method-dispatch/)

方法调度说的是当调用一个方法的时候程序如何选择哪一条指令来执行。这在每一次方法被调用的时候都会发生。知道方法调度是如何工作的对于编写高效代码来说是必须的，而且也能帮助理解Swift里面一些令人迷惑的行为。

编译型的语言使用了三种主要的方法调度：直接调度、表调度和消息调度，下面我会说明。大多数语言支持一种或两种。Java默认使用表调度，但是你可以通过添加`final`关键字切换到直接调度。C++默认使用直接调度，但是你可以通过添加`virtual`关键字来切换到表调度。Objective-C总是使用消息调度，但是也允许开发者使用C来获取直接调度的高效率。Swift目标直指支持三种方法调度。这相当好用，但是也是许多开发者疑惑的地方，也与许多Swift开着遇到的陷阱有关。

## 调度类型

调度的目的是告诉CPU在内存中的哪个位置可以找到一个特定方法调用的可执行指令。在我们开始探究Swift的调度之前先让我们一个一个看下这三种调度，每一种在执行效率和动态行为中都有折衷。

### 直接调度

直接调度是最快的一种。它不仅有最少的汇编指令，而且编译器也可以做各种智能优化，比如内联代码，许多其它本文不会涉及的东西。直接调度也常常被称为静态调度。

### 表调度

表调度是编译型语言中最常见的动态行为的实现方式。表调度在类声明中为每一个方法用一个函数指针的数组。大多数语言称之为“虚表”，但是Swift称之为“可见性表”。每一个子类都有它自己的一张父类表的拷贝，表中每个被覆盖的方法都是不同于父类的函数指针。当子类添加新的方法的时候，这些方法就被追加到这个数组的后面。然后在运行时就会访问这个表来决定执行哪个方法。

举个例子，看下面的两个类：

```Swift
class ParentClass {
    func method1() {}
    func method2() {}
}
class ChildClass: ParentClass {
    override func method2() {}
    func method3() {}
}
```

在这个场景中编译器会创建两个调度表，一个给`ParentClass`，一个给`ChildClass`：
![调度表](/assets/images/virtual-dispatch.png)

```Swift
let obj = ChildClass()
obj.method2()
```

当一个方法被调用的时候，过程会是：

 1. 读取对象`0xB00`的调度表
 2. 读取方法索引位置上的函数指针。在这个例子中，`method2`的方法索引是1，那么会读取地址`0xB00 + 1`.
 3. 跳转到地址`0x222`

表查找很直观，很好实现，效率特性也是可预见的。但是相比于直接调度，它就显得慢了。站在直接代码的角度来看，这里多了两个额外的读取和一个跳转，这有点头更。而且，另一个觉得这里慢是因为编译器无法在这里做任何优化。

另一个缺点是扩展无法延长这个调度表，因为子类会在表的末尾添加新的方法，那就没有安全的索引来让扩展来添加函数指针。这个[Swift进化文章](https://lists.swift.org/pipermail/swift-evolution/Week-of-Mon-20151207/001922.html)更详细的描述了这些限制。

### 消息调度

消息调度最具有动态性。这是Cocoa开发的基石，也是[KVO](https://developer.apple.com/library/content/documentation/Cocoa/Conceptual/KeyValueObserving/KeyValueObserving.html)、[UIAppearance](https://developer.apple.com/reference/uikit/uiappearance)和[Core Data](https://developer.apple.com/library/content///documentation/Cocoa/Conceptual/CoreData/index.html)功能的核心原理。这个功能的一个关键点就是它允许开发者在运行时修改调度行为。不仅可以通过[swizzling](https://www.mikeash.com/pyblog/friday-qa-2010-01-29-method-replacement-for-fun-and-profit.html)修改调用的方法，也可以通过[isa-swizzling]修改调用者，允许对象级别来定制调度。

举个例子，思考下面两个类：

```Swift
class ParentClass {
    dynamic func method1() {}
    dynamic func method2() {}
}
class ChildClass: ParentClass {
    override func method2() {}
    dynamic func method3() {}
}
```

Swift会为这个层次构建一个树形结构的模型：

![消息调度图示](/assets/images/message-dispatch.png)

当一个消息被调度的时候，运行时会爬行类结构层次图来决定调用哪个方法。听起来有点慢？它是真的慢。但是这个查找是被一个高速缓存层保护着的，一旦预热结束这个缓存层会使得查找和表调度一样快。这只是消息调度很小的一方面，[这篇文章](http://www.friday.com/bbum/2009/12/18/objc_msgsend-part-1-the-road-map/)详细且深入的的讲解了各种技术细节。

## Swift方法调度

那么，Swift调度方法是怎么做的？我还没有找到这个问题的一个简单明了的答案。但是这里是有四个方面说明了调度室怎么选择的：

 * 声明的位置
 * 引用类型
 * 被指定的行为
 * 可见性优化

在我说这些之前，得说明一下Swift并没有文档记录何时用表查找何时用消息调度。唯一确定的就是`dynamic`关键字会通过Objective-C的运行时使用消息调度。所有下面我提到的东西，都是从Swift 3.0里面的行为推断出来的，也会在将来的发行版本中改变。

### 位置有影响

Swift有两个位置可以声明一个方法：在一个类型的初始声明出或者在一个扩展中。根据声明的类型的不同，也会影响调度室如何进行的。

```Swift
class MyClass {
    func mainMethod() {}
}
extension MyClass {
    func extensionMethod() {}
}
```

在上面的例子中，`mainMethod`将会用表调度，`extensionMethod`会用直接调度。当我第一次发现的生活，我很惊讶。这些方法有这么大的差异并不清晰也不直观。下面是一个基于引用类型和声明位置来选择调度的完整表格：

![声明位置与调度方法](/assets/images/location-and-dispatch.png)

这里有几点要注意：

 * 值类型总是用直接调度，很棒很简单！
 * 协议和类的扩展用直接调度
 * `NSObject`的扩展用消息调度
 * `NSObject`对初始生命的方法用用表调度！
 * 在协议初始位置声明的方法的默认实现用表调度

### 引用类型也有影响

方法被调用的引用的类型也决定了调度的规则。这似乎很明显，但是有一个很重要的东西要区分下。一个常见的混淆就是当一个协议扩展和一个对象扩展都实现了相同的方法。

```swift
protocol MyProtocol {
}
struct MyStruct: MyProtocol {
}
extension MyStruct {
    func extensionMethod() {
        print("In Struct")
    }
}
extension MyProtocol {
    func extensionMethod() {
        print("In Protocol")
    }
}
 
let myStruct = MyStruct()
let proto: MyProtocol = myStruct
 
myStruct.extensionMethod() // -> “In Struct”
proto.extensionMethod() // -> “In Protocol”
```

许多刚用Swift的人都会觉得`proto.extensionMethod()`会调用结构体的实现。但是引用的类型决定了调度的选择，决定了协议可见的唯一方法就是使用直接调度。如果`extensionMethod`被移动到协议声明里面，就会使用表调度，然后结构体的实现会被调用。而且，注意两种声明都用了直接调度，所以鉴于直接调度的语义，期望中的“覆盖”行为是不肯能的。这会让Swift开发新手一脸懵逼，因为从Objective-C过来的人会觉得这就应该是这样啊。

Swift的Jira里面有一些关于这点的[bugs](https://bugs.swift.org/browse/SR-1422)，在swift-evolution邮件列表里面也有很多[讨论](https://lists.swift.org/pipermail/swift-evolution/Week-of-Mon-20151207/thread.html#983)，这里也有一篇很棒的[博客文章](https://nomothetis.svbtle.com/the-ghost-of-swift-bugs-future)。但是，这就是这样的，虽然没有很好的在文档中记录下来。

### 指定调度行为

Swift也有一些关键字可以改变调度行为。

#### final

`final`使得一个类中的一个方法可以是直接调度，这个关键字移除了任何动态行为的可能性。任何方法都可以用这个关键字，即使是扩展中的那些本来就是直接调度的方法。这也会对Objective-C运行时隐藏这个方法，也不会生成选择器。

#### dynamic

`dynamic`使类的方法可以用消息调度，它会使得方法在Objective-C运行时中可用。你必须引入`Foundation`来使用`dynamic`，因为`Foundation`里面包括了`NSObject`和Objective-C运行时的核心。`dynamic`可以被用来让一个在扩展中定义的方法可以被覆盖。`dynamic`关键字可以用在NSObject子类上，也可以用在Swift的类上。

#### @objc & @nonobjc

`@objc`和`@nonobjc`改变了方法在Objective-C运行时中的可见性。`@objc`最常见的用法就是修改选择器的命名空间，比如`@objc(abc_methodName)`。`@objc`不会改变调度的选择，它只是使得方法在Objective-C运行时中可见。`@nonobjc`会修改调度选择，它可以被用来禁用消息调度，因为它不会把方法加到消息调度依赖的Objective-C运行时中。我不确定它与`final`是否有不同，因为在我所看到的例子中他们的汇编看起来一样，我在阅读代码的时候更倾向于看到`final`因为它会让代码的意图更加清楚。

#### final @objc

标记一个方法为`final`同时用`@objc`来让它在消息调度中可用是可行的。这会让方法调用使用直接调度，也会在Objective-C运行时中注册选择器，这会让它响应`perform(selector)`和其它Objective-C功能，同时在直接调用的时候也很高效。

#### @inline

Swift也支持`@inline`，它会暗示编译器可以修改动态调度。有意思的是`dynamic @inline(__always) func dynamicOrDirect(){}`可以编译！看来它只是一个暗示，因为汇编显示这个方法仍然会用消息调度。这像是未定义行为，最好避免。

### 修饰符概览

![修饰符](/assets/images/modifier-overview.png)

如果你对以上例子的汇编感兴趣，你可以看[这里](https://gist.github.com/KingOfBrian/778dc93bffddf25b2c414360727c273b#file-message-swift)

### 可见性会优化

Swift会尽可能的优化方法调度。比如，如果你有一个方法不会被覆盖，Swift会注意到这一点然后对它使用直接调度。这个优化在大多数时候都很棒，但是也常常让Cocoa开发者们掉坑里，因为他们会用目标行为模式。比如：

```swift
override func viewDidLoad() {
    super.viewDidLoad()
    navigationItem.rightBarButtonItem = UIBarButtonItem(
        title: "Sign In", style: .plain, target: nil,
        action: #selector(ViewController.signInAction)
    )
}
private func signInAction() {}
```

这里，编译器会生成一个错误：`Argument of '#selector' refers to a method that is not exposed to Objective-C`。如果你记得Swift会优化方法来使用直接调度，那这个就说得通。修复办法也很简单：添加`@objc`或者`dynamic`到声明的地方来保证它对Objective-C运行时是可见的。当用`UIAppearance`的生活也会发生，因为它会依赖代理对象和`NSInvocation`。

当使用更多`Foundation`动态特性的时候需要注意，如果你不用`dynamic`关键字这个优化会悄悄地破坏KVO。如果一个属性被别的对象用KVO观察了，这个属性被升级到直接调度的社会化，代码仍然可以编译，但是动态生成的KVO方法不会被触发。

Swift博客有一篇[很好的文章](https://developer.apple.com/swift/blog/?id=27)描述了更多的细节和这些优化的基本原理。

#### 调度总结

这么多规则需要记忆，那这里有一个总结来概括上面的调度规则：

![调度规则总结表](/assets/images/dispatch-summary.png)

## NSObject和动态行为的缺失

之前一些Cocoa开发者评论动态行为的缺失。对话很有趣，也有很多点子出来。我希望继续这个争论，并且指出一些Swift的我认为会损害动态行为的调度行为，并且给出建议的解决方法。

### NSObject的表调度

在上面，我提到定义在`NSObject`子类的初始声明中的方法使用表调度。我发现这让人很迷惑，很难以解释，最后，它只是一个很微小的性能提升。除了这些：

 * 大多数`NSObject`子类是在很多`obj_msgSend`上面的。我强烈怀疑这些调度升级中的任何一个在实践中会为任何Cocoa子类带来性能提升。
 * 大多数Swift`NSObject`子类使用扩展，这就避开了这种升级。

总结，这就是另一个使得调度故事复杂化的小细节。

### 调度升级破坏了NSObject的特性

可见性性能优化很棒，我也很喜欢Swift在可以的时候进行智能的调度升级。但是在我的`UIView`子类颜色属性上的理论上的性能提升，破坏了`UIKit`里面的一个建立好的模式，这对语言来说也是有害的。

### NSObject是另一个选择

就像结构体是静态调度的一个选择一样，`NSObject`也是消息调度的一个选择。现在，如果你将要对一个Swift新手解释为什么一个类是`NSObject`子类，你得解释Objective-C和它的历史。没必要去继承`NSObject`，除非是继承Objective-C代码库。

现在，Swift里面`NSObject`的调度行为只能描述为“复杂的”，这并不是一个理想状态。我更期望见到这个变化：当你继承自`NSObject`的时候，它就是一个你想要完全的动态消息调度的信号。

### 隐式的动态变更

Swift可以在检测什么时候方法是被动态的使用的地方做的更好。我相信检测`#selector`和`#keypath`里面是什么方法并且自动把他们标记为动态的，这件事是可行的。这就可以移除这里记录的大多数动态性相关的问题，除了`UIAppearance`。就算是`UIAppearance`，我相信也会有另外一套复杂的小技巧可以把它们标记出来。

## 错误和bug

看过Swift的调度规则之后，让我们看一些Swift开发者可能会遇到的错误场景。

### SR-584

这个[Swift bug](https://bugs.swift.org/browse/SR-584)其实是一个Swift的调度规则。事实就是定义在`NSObject`子类的初始声明里面的方法使用表调度，定义在扩展里面的方法使用消息调度。让我们创建一个有一个简单方法的对象来描述这个行为：

```swift
class Person: NSObject {
    func sayHi() {
        print("Hello")
    }
}
func greetings(person: Person) {
    person.sayHi()
}
greetings(person: Person()) // prints 'Hello'
```

方法`greetings(person:)`使用表调度来调用`sayHi()`，这是我们期望的，然后“Hello”被打印了出来。很正常。让我们继承`Person`

```swift
class MisunderstoodPerson: Person {}
extension MisunderstoodPerson {
    override func sayHi() {
        print("No one gets me.")
    }
}
greetings(person: MisunderstoodPerson()) // prints 'Hello'
```

注意`sayHi()`是在扩展中声明的，这就意味着方法将会按照消息调度规则被调用。当`greetings(person:)`被调用的时候，`sayHi()`被按照表调度规则调度给了`Person`对象。因为`MisunderstoodPerson`覆盖是通过消息调度添加的，`MisunderstoodPerson`的调度表仍然有`Person`的实现，然后就出现了令人迷惑的地方。

一个变通方案是确保方法使用相同的调度机制。你可以要么添加`dynamic`关键字，或者把方法的实现从扩展一道初始声明中。

这里，明白Swift的调度规则能帮助我们理解它，当然Swift应该足够智能的帮助我们处理这个情况。

### SR-103

这个[Swift Bug](https://bugs.swift.org/browse/SR-103)讲的是协议和子类里面方法的默认实现。让我们定义一个带有一个默认实现的方法的协议来说明这个问题：

```swift
protocol Greetable {
    func sayHi()
}
extension Greetable {
    func sayHi() {
        print("Hello")
    }
}
func greetings(greeter: Greetable) {
    greeter.sayHi()
}
```

现在让我们定义一个实现了这个协议的子类，让我们创建一个实现了`Greetable`协议的`Person`类和一个覆盖了`sayHi()`方法的`LoudPerson`子类。

```swift
class Person: Greetable {}
class LoudPerson: Person {
    func sayHi() {
        print("HELLO")
    }
}
```

注意在`LoudPerson`里面并没有`override`，这是唯一能看得到的会导致它不能正常工作的警告。在这个例子中，`LoudPerson`类无法正确的在`Greetable`可见性表中注册`sayHi()`方法，当`sayHi()`被通过`Greetable`协议调度的时候，使用的是默认实现。

一个变通方案是记得在协议初始声明的地方给所有方法提供一个默认实现，即使是一个空的默认实现。或者你把类声明为`final`来确保无法子类化。

有[提到](https://lists.swift.org/pipermail/swift-evolution/Week-of-Mon-20151207/000928.html)Doug Gregor正在努力把协议的默认实现隐式的重新声明为类的方法。这就可以解决上面的问题，期望中的`override`行为也就正常了。

### 其它bug

另一个我觉得要提的bug是[SR-435](https://bugs.swift.org/browse/SR-435)，它说的是两个协议扩展，一个比另一个精确。bug里面的例子显示了一个无约束的扩展和一个约束条件是`Equatable`类型的扩展。当在一个协议中调用方法的生活，哪个精确的方法没有被调用。我不确定是否每次都这样，但是值得注意。

如果你知道任何Swift调度相关的bug，[请联系我](https://twitter.com/kingofbrian)，我会更新这篇博客。

## 有意思的错误

有一个有意思的编译错误信息，我们能从中看出Swift的愿望。就像上面提到的，类扩展使用直接调度，那如果你尝试覆盖一个在扩展中声明的方法，会发生什么？

```swift
class MyClass {
}
extension MyClass {
    func extensionMethod() {}
}
 
class SubClass: MyClass {
    override func extensionMethod() {}
}
```

上面的代码会编译出错：`Declarations in extensions can not be overridden yet`。很明显，Swift团队有计划去扩展基本的表调度机制，或者书我正在努力预测未来，这也是语言的乐观的选择。

## 感谢

我希望上面的方法调度是一个愉快之旅，我也希望它能帮你明白一点Swift。除了我对`NSObject`的不满，我认为Swift提供了一个很棒的性能故事。我希望它能足够简单，然后我就不用写这篇文章了。
