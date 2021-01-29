import React, { useEffect } from "react";
import Highlight from "highlight.js";
import javascript from "highlight.js/lib/languages/javascript";

import DefaultContentStyles from "../../../components/default-content.module.css";
import {Button} from "antd";

Highlight.registerLanguage("javascript", javascript);

export default function AsyncAwait() {
  useEffect(() => {
    Highlight.initHighlighting();
  }, []);

  return (
    <div className={DefaultContentStyles.container}>
      <h1>String.prototype.padStart</h1>
      <h2 className={DefaultContentStyles.custom_h2}>作用</h2>
      <div>在字符串的左侧进行填充，修改字符串</div>
      <h2 className={DefaultContentStyles.custom_h2}>语法：</h2>
      <pre><code className="js">{"string_value.padStart(targetLength [, padString])"}</code></pre>
      <ul>
        <li>targetLength：字符串的目标长度。如果目标长度小于原始长度，则字符串不会被填充，也不会被截断。</li>
        <li>padString：被用来作为填充物的字符串。默认值是空格。这个字符串长度并不一定是1，所以会被重复使用，也可能会出现只用了一部分的情况</li>
      </ul>
      <h2 className={DefaultContentStyles.custom_h2}>实例代码：</h2>
      <pre>
        <code className="js">
{"console.log(\"123456\".padStart(3));\n\
// \"123456\"\n\
\n\
console.log(\"123456\".padStart(8, 0));\n\
// \"00123456\"\n\
\n\
console.log(\"123456\".padStart(8));\n\
// \"  123456\"\n\
\n\
console.log(\"123456\".padStart(12, \"9876\"));\n\
//\"987698123456\"\n\
"}
        </code>
      </pre>
      <Button>
        <a href="http://js.jsrun.net/f5IKp/edit" target="__blank">试一试</a>
      </Button>
      <h2 className={DefaultContentStyles.custom_h2}>padEnd与padStart类似，参数也类似，就不再赘述</h2>
    </div>
  );
}
