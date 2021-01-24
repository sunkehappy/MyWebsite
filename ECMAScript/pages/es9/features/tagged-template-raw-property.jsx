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
      <h1>Promise.prototype.finally</h1>
      <h2 className={DefaultContentStyles.custom_h2}>作用</h2>
      <div>
        为标签模板函数的第一个参数加一个raw属性，用以获取未被处理未被转换的原始字符串，这个属性是一个数组。
      </div>
      <h2 className={DefaultContentStyles.custom_h2}>实例代码：</h2>
      <pre>
        <code className="js">
{"function myTagFn(str) {\n\
    return { \"Parsed\": str[0], \"Raw\": str.raw[0] }\n\
}\n\
let result1 = myTagFn`\\unicode`\n\
// { Parsed: undefined, Raw: '\\unicode' }\n\
console.log(result1)\n\
\n\
let result2 = myTagFn`\\u2764\\uFE0F`\n\
// { Parsed: '❤️', Raw: '\\u2764\\uFE0F' }\n\
console.log(result2)\n\
"}
        </code>
      </pre>
      <Button>
        <a href="http://js.jsrun.net/tAIKp/edit" target="__blank">试一试</a>
      </Button>
    </div>
  );
}
