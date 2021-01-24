import React, { useEffect } from "react";
import Highlight from "highlight.js";
import javascript from "highlight.js/lib/languages/javascript";

import DefaultContentStyles from "../../default.content.module.css";
import {Button} from "antd";

Highlight.registerLanguage("javascript", javascript);

export default function Includes() {
  useEffect(() => {
    Highlight.initHighlighting();
  }, []);

  return (
    <div className={DefaultContentStyles.container}>
      <h1>Array.prototype.includes()</h1>
      <h2 className={DefaultContentStyles.custom_h2}>作用：</h2>
      <div>查找一个值在不在数组里,若是存在则返回true,不存在返回false.</div>
      <h2 className={DefaultContentStyles.custom_h2}>实例代码：</h2>
      <pre>
        <code className="js">
{"let a = [3, 2, 5];\n\
console.log(`a include 2: ${a.includes(2)}`);\n\
console.log(`a include 4: ${a.includes(4)}`);\n\
"}
        </code>
      </pre>
      <h2 className={DefaultContentStyles.custom_h2}>更多说明</h2>
      <div>
        如果不用Array.prototype.includes()，我们也可以用indexOf()方法通过判断索引来判断是否在数组里面，但是这个方法没法处理NaN，再看代码：
      </div>
      <pre>
        <code className="js">
{"a.push(NaN);\n\
let nanIndex = a.indexOf(NaN);\n\
// 会输出false\n\
console.log(`using indexOf a has NaN: ${nanIndex !== -1}`);\n\
// 会输出true\n\
console.log(`using includes() a has NaN: ${a.includes(NaN)}`);\n\
"}
        </code>
      </pre>
      <Button>
        <a href="http://js.jsrun.net/IEIKp/edit" target="__blank">试一试</a>
      </Button>
    </div>
  );
}
