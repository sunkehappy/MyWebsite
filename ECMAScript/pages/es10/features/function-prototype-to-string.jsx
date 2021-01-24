import React, { useEffect } from "react";
import Highlight from "highlight.js";
import javascript from "highlight.js/lib/languages/javascript";

import DefaultContentStyles from "../../default.content.module.css";
import {Button} from "antd";

Highlight.registerLanguage("javascript", javascript);

export default function PromiseFinally() {
  useEffect(() => {
    Highlight.initHighlighting();
  }, []);

  return (
    <div className={DefaultContentStyles.container}>
      <h1>Function.prototype.toString()</h1>
      <h2 className={DefaultContentStyles.custom_h2}>作用</h2>
      <div>
        Function是继承自Object，但是它的toString方法是自己提供的，并不是直接从父类继承来的。ES10是进一步标准化所有对象和内置函数的字符串表示。
      </div>
      <h2 className={DefaultContentStyles.custom_h2}>参考代码：</h2>
      <pre>
        <code className="js">
{"// function parseInt() { [native code] }\n\
Number.parseInt.toString();\n\
// function () { [native code] }\n\
function () { }.bind(0).toString();\n\
"}
        </code>
      </pre>
      <h2 className={DefaultContentStyles.custom_h2}>参考</h2>
      <div><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/toString" target="__blank">Function.prototype.toString()</a></div>
    </div>
  );
}
