import React, { Component } from 'react';

import DefaultContentStyles from './default.content.module.css';

export default class DefaultContent extends Component {
  render() {
    return (
      <div className={DefaultContentStyles.container}>
        <h2 className={DefaultContentStyles.custom_h2}>这是什么网站？</h2>
        <div>
          作为前端开发者，我们一定需要熟悉<a href="http://www.ecma-international.org/" target="_blank">ECMAScript</a>，如果你不熟悉这个名字，那如果一提ES6，你肯定想起了这是个什么东西。此网站就是要帮助大家学习最新的规范，以便在实际开发中用这些新特性来让我们的代码变得又短又快又安全
        </div>
        <h2 className={DefaultContentStyles.custom_h2}>有哪些必备技能</h2>
        <div>
          本站假设你了解JavaScript的基础知识，当然即便不会，从这里开始一步步学习，也是可以的，每个人都是一点点的进步的。
        </div>
        <div></div>
        <h2 className={DefaultContentStyles.custom_h2}>开始学习</h2>
        点击左边的菜单来学习ECMAScript新特性！
      </div>
    )
  }
}
