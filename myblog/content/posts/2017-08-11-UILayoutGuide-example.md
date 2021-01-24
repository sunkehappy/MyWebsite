---
date: 2017-08-11
category:       Swift
title:          UILayoutGuide的用法
tags:           [Swift]
---

在iOS 9中引入了一个新的类[UILayoutGuide](https://developer.apple.com/documentation/uikit/uilayoutguide)。这个类可以用来

### 干什么？

  * 替代之前视图之间的空视图
  * 封装多个视图到一个模块

<!--more-->
#### 为什么要替代空视图？

先来举一个需求，在一行上面显示两个固定宽度的按钮，然后剩下的三个空间(左边按钮左边，两个按钮中间，右边按钮的右边)要宽度一样。想要实现这个需求，一般会想到加三个空的`UIView`放到那，然后让他们宽度相等，这样就可以实现这个需求了。

但是这样做的方法很笨，因为`UIView`是可以接受事件的，而我们这里用了它却只是用来占位置。而且这样做也会有性能消耗，代码可读性不太好。


#### 封装视图模块？

简单来说就是，有时候我们为了代码和视图结构清晰，会把一些看起来是一大块的子视图放到一起，然后用一个`UIView`来把它们包起来。但是有了`UILayoutGuide`之后，就用不着`UIView`了。

### 怎么用？

注意这个类是直接继承自`NSObject`，不是`UIView`的子类。然后就是创建实例，用实例创建约束条件。举例：

```
var leftAnchor: NSLayoutXAxisAnchor { get }
```

上面是获取左边锚点，让左边贴近`self.view`左侧的话就是这样：

```
leadingMargin.leftAnchor.constraint(equalTo: self.view.leftAnchor).isActive = true
```

注意这里的`constraint(equalTo:)`方法，它会生成并返回一个`NSLayoutConstraint`，然后需要手工把它的`isActive`改成`true`


```
func constraint(equalTo anchor: NSLayoutAnchor<AnchorType>) -> NSLayoutConstraint
```

上面例子的完整代码就是：

```
private func createSubview() {
    let topOffset = 70
    
    self.leftButton = UIButton()
    self.leftButton.setTitle("Left Button", for: .normal)
    self.leftButton.backgroundColor = UIColor.orange
    self.view.addSubview(self.leftButton)
    self.leftButton.snp.makeConstraints { (maker) in
        maker.width.equalTo(110)
        maker.height.equalTo(40)
        maker.top.equalTo(topOffset)
    }
    
    self.rightButton = UIButton()
    self.rightButton.setTitle("Right Button", for: .normal)
    self.rightButton.backgroundColor = UIColor.purple
    self.view.addSubview(self.rightButton)
    self.rightButton.snp.makeConstraints { (maker) in
        maker.width.equalTo(self.leftButton)
        maker.height.equalTo(self.leftButton)
        maker.top.equalTo(topOffset)
    }
    
    if #available(iOS 9.0, *) {
        let leadingMargin = UILayoutGuide()
        self.view.addLayoutGuide(leadingMargin)
        leadingMargin.leftAnchor.constraint(equalTo: self.view.leftAnchor).isActive = true
        leadingMargin.rightAnchor.constraint(equalTo: self.leftButton.leftAnchor).isActive = true
        
        let middleMargin = UILayoutGuide()
        self.view.addLayoutGuide(middleMargin)
        middleMargin.leftAnchor.constraint(equalTo: self.leftButton.rightAnchor).isActive = true
        middleMargin.rightAnchor.constraint(equalTo: self.rightButton.leftAnchor).isActive = true
        middleMargin.widthAnchor.constraint(equalTo: leadingMargin.widthAnchor).isActive = true
        
        let trailingMargin = UILayoutGuide()
        self.view.addLayoutGuide(trailingMargin)
        trailingMargin.leftAnchor.constraint(equalTo: self.rightButton.rightAnchor).isActive = true
        trailingMargin.rightAnchor.constraint(equalTo: self.view.rightAnchor).isActive = true
        trailingMargin.widthAnchor.constraint(equalTo: leadingMargin.widthAnchor).isActive = true
    } else {
        // Create UIView for iOS 8 to implement the same feature.
    }
}
```

注意这里我用了[SnapKit](https://github.com/snapkit/snapkit)来简化Auto Layout的输入。然后用来封装子视图的例子这里就不举了，有点类似。效果图：

![UILayoutGuide的图示](/assets/images/UILayoutGuideExample.png)

### 优缺点

优点：

  * 代码更清晰
  * 效率更高

缺点：

  * 不支持Interface Builder！
  * 需要iOS 9+

这里无法在IB上面创建`UILayoutGuide`真的是把这么好的功能搞得鸡肋了。

### Reference:

  * [SnapKit](https://github.com/snapkit/snapkit)
  * [UILayoutGuide](https://developer.apple.com/documentation/uikit/uilayoutguide)
  * [Goodbye Spacer Views Hello Layout Guides](https://useyourloaf.com/blog/goodbye-spacer-views-hello-layout-guides/)
