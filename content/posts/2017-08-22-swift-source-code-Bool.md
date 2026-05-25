---
date: 2017-08-22
category:       Swift
title:          Swift源代码解读（一）Bool类型
tags:           [Swift, Swift Language Code]
---

经过上一篇建立环境之后，我们就可以在Xcode中阅读Bool的源代码了，放一个截图：

![Swift language source code bool](/assets/images/swift-language-code-bool.png)

Swift的`Bool`是[值类型](https://developer.apple.com/swift/blog/?id=10)。
先看`Bool`的定义：

<!--more-->

```
@_fixed_layout
public struct Bool {
```

这里的`@_fixed_layout`是在告诉[SIL(Swift Intermediate Language)](https://github.com/apple/swift/blob/master/docs/SIL.rst)`Bool`的内存布局是固定的。(这里不是很懂，为什么要固定？后面再补充吧)

然后就是`Bool`的内部值：

```
@_versioned
internal var _value: Builtin.Int1
```

这里的`@_versioned`不太懂，找到的资料是[Add a @_versioned attribute for testing resilience.](https://github.com/apple/swift/commit/9e9c80e0903343f44aab4461ddf656511f9440c6)。只是大概明白是SIL会用到。

然后`_value`被定义为`internal`的，按照Swift的[访问控制](https://developer.apple.com/library/content/documentation/Swift/Conceptual/Swift_Programming_Language/AccessControl.html)，`internal`级别的实体在定义它的模块内是可以访问到的，但是在定义它的模块之外，是无法访问的。我们也确实是无法在我们的代码中直接访问`Bool`的`_value`属性。

这里的`Builtin.Int1`是一个平时不会遇到的类型，通过Xcode自带的跳转找不到它的定义，后面知道了再补充。猜测就是一个字节的整数。


然后就是三个初始化函数：

```
  @_transparent
  public init() {
    let zero: Int8 = 0
    self._value = Builtin.trunc_Int8_Int1(zero._value)
  }

  @_versioned
  @_transparent
  internal init(_ v: Builtin.Int1) { self._value = v }
  
  public init(_ value: Bool) {
    self = value
  }
```

其中两个都是`public`，一个是不接受参数的`init()`，默认为false；另一个是接受外部传进来的Bool值的初始化参数`init(_ value: Bool)`，根据外面传进来的参数来初始化自己。然后为什么是`self = value`？而不是`self._value = value._value`？

接下来是`ExpressibleByBooleanLiteral`以及它对应的内部协议`_ExpressibleByBuiltinBooleanLiteral`：

```
  @_transparent
  public init(_builtinBooleanLiteral value: Builtin.Int1) {
    self._value = value
  }
  
  @_transparent
  public init(booleanLiteral value: Bool) {
    self = value
  }
```

简单来说就是有了上面这两个方法，就可以直接用`Bool`和`Builtin.Int1`的字面常量来初始化一个新的`Bool`实例。而且这两个方式不希望外部人员调用的，应该用`let a = true`这样的方式来初始化，这样写就会调用对应的初始化方法。

接下来是一个内部才会使用的方法：

```
extension Bool {
  // This is a magic entry point known to the compiler.
  @_transparent
  public // COMPILER_INTRINSIC
  func _getBuiltinLogicValue() -> Builtin.Int1 {
    return _value
  }
}
```

虽然外部也可以调用，但是没什么实际的用途：[Implicit public access to (Bool) internal type 'Builtin.Int1': runtime exception if appending instances of 'Int1' to an array](https://stackoverflow.com/q/36648890/1548523)

接下来是`CustomStringConvertible`：

```
extension Bool : CustomStringConvertible {
  /// A textual representation of the Boolean value.
  public var description: String {
    return self ? "true" : "false"
  }
}
```

有了这个协议我们在打印`Bool`变量的时候，就可以方便的看到它是`true`还是`false`，注意这两个是字符串。更多细节可以看官方文档：[CustomStringConvertible](https://developer.apple.com/documentation/swift/customstringconvertible)

接下来又是一个内部方法：

```
// This is a magic entry point known to the compiler.
@_transparent
public // COMPILER_INTRINSIC
func _getBool(_ v: Builtin.Int1) -> Bool { return Bool(v) }
```

然后就是两个比较重要的协议`Hashable`和`Equatable`：

```
extension Bool : Equatable, Hashable {
  /// The hash value for the Boolean value.
  ///
  /// Two values that are equal always have equal hash values.
  ///
  /// - Note: The hash value is not guaranteed to be stable across different
  ///   invocations of the same program. Do not persist the hash value across
  ///   program runs.
  @_transparent
  public var hashValue: Int {
    return self ? 1 : 0
  }

  @_transparent
  public static func == (lhs: Bool, rhs: Bool) -> Bool {
    return Bool(Builtin.cmp_eq_Int1(lhs._value, rhs._value))
  }
}
```

很有意思的是注释里面说哈希值并不保证稳定，难道说true的时候也会是0？但是看代码其实应该是稳定的才对啊。奇怪。

这里的相等的判断是用的`Builtin`的方法来直接判断`_value`是否相等。为啥不这样写`Bool(lhs._value == rhs._value)`？难道是因为`_value`无法直接使用`==`函数？

然后是通过字符串来初始化的方法：

```
extension Bool : LosslessStringConvertible {
  public init?(_ description: String) {
    if description == "true" {
      self = true
    } else if description == "false" {
      self = false
    } else {
      return nil
    }
  }
}
```

值得注意的是这个初始化方法返回的是可选类型的，也就是说并不一定能初始化成功。实际使用中这个方法确实是相当于为开发者省了功夫，不用再手工去判断用来初始化的字符串，当然，如果传进来的是`TRUE`，这个方法还是会跪。真是碰到这种情况，开发者还是得自己写，那为什么标准库不把这个考虑进去？我猜可能并不是所有开发者都想这样做，另一方面统一转成小写也会有效率上面的消耗吧。

最后就是三个操作函数：

```
  @_transparent
  public static prefix func ! (a: Bool) -> Bool {
    return Bool(Builtin.xor_Int1(a._value, true._value))
  }

  @_transparent
  @inline(__always)
  public static func && (lhs: Bool, rhs: @autoclosure () throws -> Bool) rethrows
      -> Bool {
    return lhs ? try rhs() : false
  }

  @_transparent
  @inline(__always)
  public static func || (lhs: Bool, rhs: @autoclosure () throws -> Bool) rethrows
      -> Bool {
    return lhs ? true : try rhs()
  }
```

然后注意这里的`@autoclosure`，自动闭包，具体的可以参考这里：[@AUTOCLOSURE 和 ??](http://swifter.tips/autoclosure/)

