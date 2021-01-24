import React, { Component } from 'react'
import Main from '../main';
import {ES8Feature} from '../../utils/feature-dic';
import AsyncAwait from './features/async-await';
import StringPrototypePadStartEnd from './features/string-prototpye-pad-start-end';
import TrailingCommas from './features/trailing-commas';
import ObjectKeysAndValues from './features/object-keys-and-values';

const FeatureTable = {
  asyncAwait: <AsyncAwait />,
  stringPrototypePadStartEnd: <StringPrototypePadStartEnd />,
  trailingCommas: <TrailingCommas />,
  objectKeysAndValues: <ObjectKeysAndValues />,
};

export async function getStaticProps({params}) {
  console.log(`feature is ${JSON.stringify(params)}`);
  return {
    props: {
      feature: params.feature,
    }
  };
}

export function getStaticPaths() {
  let features = Object.keys(ES8Feature);
  let pathParams = features.map(item => ({
    params: { feature: item}
  }));

  console.log(`getStaticPaths paths: ${JSON.stringify(pathParams)}`);

  return {
    paths: pathParams,
    fallback: false
  };
}

export default function Feature({feature}) {
  return (
    <Main
      featureComponent={FeatureTable[feature]}
    />
  );
}
