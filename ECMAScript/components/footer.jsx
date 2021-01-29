import React, { Component } from 'react'

import Styles from './footer.module.css';

export default class Footer extends Component {
  render() {
    return (
      <div className={Styles.container}>
        Copyright © 2021 - 2021 Calvin Sun. All rights reserved.
        <a className={Styles.link} href="http://beian.miit.gov.cn/" target="__blank">沪ICP备2021002982号</a>
      </div>
    )
  }
}
