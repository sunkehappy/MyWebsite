import React, { Component } from 'react'
import Footer from './footer';
import Header from './header';

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
        <Header />
        <div className={MainStyles.subContainer}>
          <LeftMenu />
          {featureComponent}
        </div>
        <Footer />
      </div>
    )
  }
}
