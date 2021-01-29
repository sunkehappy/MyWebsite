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
      <h1>Object.fromEntries()</h1>
      <h2 className={DefaultContentStyles.custom_h2}>作用</h2>
      <div>
        与Object.entries()作用相反，通过一个[[key, value]]数组来创建对象
      </div>
      <h2 className={DefaultContentStyles.custom_h2}>参考代码：</h2>
      <pre>
        <code className="js">
{"const numberNames = [[1,'one'], [2,'two'], [3, 'three'], [4,'four'], [5, 'five'], [6, 'six']];\n\
const numberNamesObject = Object.fromEntries(numberNames);\n\
console.log(numberNamesObject);\n\
// output : {1: \"one\", 2: \"two\", 3: \"three\", 4: \"four\", 5: \"five\", 6: \"six\"}\n\
"}
        </code>
      </pre>
      <h2 className={DefaultContentStyles.custom_h2}>参考</h2>
      <div>直接看文档吧<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/fromEntries" target="__blank">Object.fromEntries()</a></div>
    </div>
  );
}
