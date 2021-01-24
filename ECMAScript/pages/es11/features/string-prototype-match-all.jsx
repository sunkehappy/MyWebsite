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
      <h1>String.prototype.matchAll()</h1>
      <h2 className={DefaultContentStyles.custom_h2}>作用</h2>
      <div>
        返回包含所有匹配正则表达式的结果及分组捕获组的迭代器。与 RegExp.prototype.exec 的区别在于：如果要得到所有匹配项，需要正则表达式有 /g 标志，且多次调用 .exec() 才会得到所有匹配的结果，而 matchAll 只需要调用一次。注意返回的是一个迭代器，并不是一个数组。
      </div>
      <h2 className={DefaultContentStyles.custom_h2}>参考代码：</h2>
      <pre>
        <code className="js">
{"const str = \"Here are 36 apples and 48 oranges.\";\n\
const result = str.matchAll(/\d+/g);\n\
// [\n\
//  [\"36\", index: 9, input: \"Here are 36 apples and 48 oranges.\", groups: undefined],\n\
//  [\"48\", index: 23, input: \"Here are 36 apples and 48 oranges.\", groups: undefined]\n\
// ]\n\
console.log([...result]);\n\
"}
        </code>
      </pre>
      <h2 className={DefaultContentStyles.custom_h2}>参考</h2>
      <div>直接看文档吧<a target="__blank" href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/matchAll">String.prototype.matchAll()</a></div>
    </div>
  );
}
