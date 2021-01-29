import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';

import Header from './header';
import Footer from './footer';
import LeftMenu from './left-menu';

import MainStyles from './main.module.css';

export default class Main extends Component {
  static propTypes = {
    defaultOpenKeys: PropTypes.array,
    featureComponent: PropTypes.element,
  }

  render() {
    const {
      featureComponent,
      defaultOpenKeys,
      title,
    } = this.props;

    return (
      <div className={MainStyles.container}>
        <Head>
          <title>{title}</title>
        </Head>
        <Header />
        <div className={MainStyles.subContainer}>
          <LeftMenu defaultOpenKeys={defaultOpenKeys} />
          {featureComponent}
        </div>
        <Footer />
      </div>
    )
  }
}
