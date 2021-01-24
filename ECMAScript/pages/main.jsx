import React, { Component } from 'react'

import LeftMenu from './left-menu';
import MainStyles from './main.module.css';

export default class Main extends Component {
  constructor() {
    super();

  }

  render() {
    const {
      featureComponent
    } = this.props;

    return (
      <div className={MainStyles.container}>
        <LeftMenu />
        {featureComponent}
      </div>
    )
  }
}
