import React, { useEffect } from "react";
import Highlight from "highlight.js";
import javascript from "highlight.js/lib/languages/javascript";

import DefaultContentStyles from "../../../components/default-content.module.css";
import {Button} from "antd";

Highlight.registerLanguage("javascript", javascript);

export default function PromiseFinally() {
  useEffect(() => {
    Highlight.initHighlighting();
  }, []);

  return (
    <div className={DefaultContentStyles.container}>
      <h1>export ... as ... from ...</h1>
      <h2 className={DefaultContentStyles.custom_h2}>作用</h2>
      <div>
        增强了之前的导出语法，可以一步导入+聚合+导出。类似export * as MyComponent from './Component.js'
      </div>
      <h2 className={DefaultContentStyles.custom_h2}>参考</h2>
      <div><a target="__blank" href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export">export</a></div>
    </div>
  );
}
