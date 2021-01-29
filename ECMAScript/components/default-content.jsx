import React, { Component } from 'react';

import DefaultContentStyles from './default-content.module.css';

export default class DefaultContent extends Component {
  render() {
    return (
      <div className={DefaultContentStyles.container}>
        <h2 className={DefaultContentStyles.custom_h2}>这是什么网站？</h2>
        <div>
          作为前端开发者，我们一定需要熟悉<a href="https://www.ecma-international.org/technical-committees/tc39/?tab=general" target="_blank">ECMAScript</a>，如果你不熟悉这个名字，那如果一提ES6，你肯定想起了这是个什么东西。ECMA的全称是Ecma国际（前身为欧洲计算机制造商协会，European Computer Manufacturers Association），ECMAScript其实是一个标准，我们常说ES几就是具体的某一版，最近几年都是每年一个版本，其中就属ES2015，也就是ES6里面的新内容最多。我们日常开发中用到的JavaScript就是ECMAScript的一种实现，ECMAScript还可以有别的实现方式，不过相比于JavaScript，都不值得一提。此网站就是要帮助大家学习这些规范，以便在实际开发中用这些新特性来让我们的代码变得又短又快又安全。
        </div>
        <h2 className={DefaultContentStyles.custom_h2}>有哪些必备技能</h2>
        <div>
          本站假设你了解JavaScript的基础知识，当然即便不会，从这里开始一步步学习，也是可以的，每个人都是一点点的进步的。
        </div>
        <div></div>
        <h2 className={DefaultContentStyles.custom_h2}>备注</h2>
        我已经尽力给每个特性都提供可运行的参考代码，代码是托管到<a href="http://js.jsrun.net/" target="__blank">http://js.jsrun.net/</a>上面的，但是有些最新的特性，上面是不支持的，简单一点的话，大家可以打开Chrome浏览器，然后在命令行里面运行，虽然有些不太方便，不过用来学习足够了。如果想要在项目中使用最新的特性，就需要<a href="https://babeljs.io/" target="__blank">Babel</a>来转义成现在的浏览器都支持的JavaScript代码，在这里就不详细介绍了。另外ES6里面的内容特别多，而且已经有很成熟的博客介绍了，比如阮一峰的<a href="https://es6.ruanyifeng.com/" target="__blank">ES6 入门教程</a>，我这里就不重复写了。
        <h2 className={DefaultContentStyles.custom_h2}>开始学习</h2>
        这里的ES几，是有规律的，比如ES6就是ES2015，也就是2015年发布的标准，ES7就是ES2016，也就是2016年发布的，以此类推。现在就点击左边的菜单来学习ECMAScript的新特性吧！
      </div>
    )
  }
}
