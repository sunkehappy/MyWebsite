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
      <h1>Promise.allSettled()</h1>
      <h2 className={DefaultContentStyles.custom_h2}>作用</h2>
      <div>
        返回一个在所有给定的 Promise 已进入 fullfilled 或 rejected 状态的 Promise，并带有一个对象数组，每个对象表示对应的 Promise 结果。
      </div>
      <h2 className={DefaultContentStyles.custom_h2}>参考代码：</h2>
      <pre>
        <code className="js">
{"const promise1 = Promise.resolve(3);\n\
const promise2 = new Promise((resolve, reject) => setTimeout(reject, 100, 'foo'));\n\
const promises = [promise1, promise2];\n\
\n\
// \"fulfilled\"\n\
// \"rejected\"\n\
Promise.allSettled(promises).\n\
  then((results) => results.forEach((result) => console.log(result.status)));\n\
"}
        </code>
      </pre>
      <h2 className={DefaultContentStyles.custom_h2}>参考</h2>
      <div>直接看文档吧<a target="__blank" href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled">Promise.allSettled()</a></div>
    </div>
  );
}
