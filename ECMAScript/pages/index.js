import React, { Component } from 'react'
import DefaultContent from './default-content';

import Main from './main';

export default class Feature extends Component {
  render() {
    return (
      <Main
        featureComponent={<DefaultContent />}
      />
    )
  }
}
