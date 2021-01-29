import React, { Component } from 'react'
import Main from '../../components/main';
import {ES7Feature} from '../../utils/feature-dic';
import Includes from './features/includes';
import Pow from './features/pow';

const FeatureTable = {
  includes: <Includes />,
  pow: <Pow />,
};

export async function getStaticProps({params}) {
  // console.log(`feature is ${JSON.stringify(params)}`);
  return {
    props: {
      feature: params.feature,
    }
  };
}

export function getStaticPaths() {
  let features = Object.keys(ES7Feature);
  let pathParams = features.map(item => ({
    params: { feature: item}
  }));

  // console.log(`getStaticPaths paths: ${JSON.stringify(pathParams)}`);

  return {
    paths: pathParams,
    fallback: false
  };
}

export default function Feature({feature}) {
  return (
    <Main
      featureComponent={FeatureTable[feature]}
      defaultOpenKeys={["es7"]}
      title={ES7Feature[feature].name}
    />
  );
}
