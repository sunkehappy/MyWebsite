import React, { Component } from 'react'
import Main from '../../components/main';
import {ES10Feature} from '../../utils/feature-dic';
import ArrayPrototypeFlat from './features/array-prototy-flat';
import ArrayPrototypeFlatMap from './features/array-prototy-flat-map';
import StringPrototypeTrimStartEnd from './features/string-prototype-trim-start-end';
import ObjectFromEntries from './features/object-from-entries';
import OptionalCatchBinding from './features/optional-catch-binding';
import FunctionPrototypeToString from './features/function-prototype-to-string';

const FeatureTable = {
  arrayPrototypeFlat: <ArrayPrototypeFlat />,
  arrayPrototypeFlatMap: <ArrayPrototypeFlatMap />,
  stringPrototypeTrimStartEnd: <StringPrototypeTrimStartEnd />,
  objectFromEntries: <ObjectFromEntries />,
  optionalCatchBinding: <OptionalCatchBinding />,
  functionPrototypeToString: <FunctionPrototypeToString />,
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
  let features = Object.keys(ES10Feature);
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
      defaultOpenKeys={["es10"]}
      title={ES10Feature[feature].name}
    />
  );
}
