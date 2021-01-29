import React, { Component } from 'react'
import Main from '../../components/main';
import {ES9Feature} from '../../utils/feature-dic';
import AsyncGeneratorAndIterator from './features/async-generator-iterator';
import ObjectSpreadAndRest from './features/object-spread-rest';
import PromiseFinally from './features/promise-finally';
import TaggedTemplateLiteralRevision from './features/tagged-template-literal-revision';
import TaggedTemplateRawProperty from './features/tagged-template-raw-property';
import RegularExpressionRelated from './features/regular-expression-related';

const FeatureTable = {
  asyncGeneratorAndIterator: <AsyncGeneratorAndIterator />,
  objectSpreadAndRest: <ObjectSpreadAndRest />,
  promiseFinally: <PromiseFinally />,
  taggedTemplateLiteralRevision: <TaggedTemplateLiteralRevision />,
  taggedTemplateRawProperty: <TaggedTemplateRawProperty />,
  regularExpressionRelated: <RegularExpressionRelated />,
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
  let features = Object.keys(ES9Feature);
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
      defaultOpenKeys={["es9"]}
      title={ES9Feature[feature].name}
    />
  );
}
