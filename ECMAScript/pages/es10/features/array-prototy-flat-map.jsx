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
      <h1>Array.prototype.flatMap(callback)</h1>
      <h2 className={DefaultContentStyles.custom_h2}>作用</h2>
      <div>
        类似于先调用map，然后再按照深度1调用<a href="/es10/arrayPrototypeFlat" target="__blank">Array.prototype.flat(depth)</a>，但是比这种分步调用效率稍微高一点。
      </div>
      <h2 className={DefaultContentStyles.custom_h2}>参考代码：</h2>
      <pre>
        <code className="js">
{"const nums = [1, [2], [[3]], [[[4]]]];\n\
const alphaNumber = ['one', 'two', 'three', 'four', 'five', 'six'];\n\
// ['one',2,[3],[[4]]]\n\
console.log(JSON.stringify(nums.flatMap((item, index) => {\n\
    if (!Array.isArray(item)) {\n\
        return alphaNumber[item - 1];\n\
    }\n\
    return item;\n\
})));\n\
"}
        </code>
      </pre>
      <h2 className={DefaultContentStyles.custom_h2}>参考</h2>
      <div><a target="__blank" href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap">Array.prototype.flatMap()</a></div>
    </div>
  );
}
