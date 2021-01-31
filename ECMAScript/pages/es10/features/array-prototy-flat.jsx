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
      <h1>Array.prototype.flat(depth)</h1>
      <h2 className={DefaultContentStyles.custom_h2}>作用</h2>
      <div>
        根据depth来展开数组里面的元素，默认只展开一层。
      </div>
      <h2 className={DefaultContentStyles.custom_h2}>参考代码：</h2>
      <pre>
        <code className="js">
{"const nums = [1, [2], [[3]], [[[4]]]];\n\
// [1,2,[3],[[4]]]\n\
console.log(JSON.stringify(nums.flat()));\n\
// [1,2,3,[4]]\n\
console.log(JSON.stringify(nums.flat(2)));\n\
// [1,2,3,4]\n\
console.log(JSON.stringify(nums.flat(Infinity)));\n\
"}
        </code>
      </pre>
      <h2 className={DefaultContentStyles.custom_h2}>参考</h2>
      <div><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat" target="__blank">Array.prototype.flat()</a></div>
    </div>
  );
}
