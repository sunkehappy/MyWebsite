import React, { Component } from 'react'
import DefaultContent from '../components/default-content';

import Main from '../components/main';

export default class Feature extends Component {
  render() {
    return (
      <Main
        title="ECMAScript"
        featureComponent={<DefaultContent />}
      />
    )
  }
}
