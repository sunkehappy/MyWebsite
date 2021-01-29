import React, { Component } from 'react'
import Main from '../../components/main';
import {ES11Feature} from '../../utils/feature-dic';
import DynamicImport from './features/dynamic-import';
import ImportMeta from './features/import-meta';
import ExportAsFrom from './features/export-as-from';
import OptionalChaining from './features/optional-chaining';
import NullishCoalescing from './features/nullish-coalescing';
import BigIntComponent from './features/big-int';
import PromiseAllSettled from './features/promise-all-settled';
import StringPrototypeMatchAll from './features/string-prototype-match-all';
import GlobalThis from './features/global-this';

const FeatureTable = {
  dynamicImport: <DynamicImport />,
  importMeta: <ImportMeta />,
  exportAsFrom: <ExportAsFrom />,
  optionalChaining: <OptionalChaining />,
  nullishCoalescing: <NullishCoalescing />,
  bigIntComponent: <BigIntComponent />,
  promiseAllSettled: <PromiseAllSettled />,
  stringPrototypeMatchAll: <StringPrototypeMatchAll />,
  globalThis: <GlobalThis />,
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
  let features = Object.keys(ES11Feature);
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
      defaultOpenKeys={["es11"]}
      title={ES11Feature[feature].name}
    />
  );
}
