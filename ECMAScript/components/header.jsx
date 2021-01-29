import React, { Component } from 'react'

import Styles from './header.module.css';

export default class Header extends Component {
  render() {
    return (
      <div className={Styles.container}>
        <a className={Styles.link} href="/">主页</a>
        <div className="rightcontainer">
          <a className={Styles.link} href="https://blog.calvinhappy.com/" target="__blank">我的博客</a>
        </div>
      </div>
    )
  }
}
