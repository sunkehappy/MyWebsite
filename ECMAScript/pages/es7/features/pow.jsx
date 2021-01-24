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
      <h1>指数运算**</h1>
      <h2 className={DefaultContentStyles.custom_h2}>实例代码：</h2>
      <pre>
        <code className="js">
{"let base = 3;\n\
let exponent = 4;\n\
let result = base**exponent;\n\
console.log(result); //81\n\
// 等价于\n\
result = Math.pow(base, exponent);\n\
console.log(result); //81\n\
"}
        </code>
      </pre>
      <Button>
        <a href="http://js.jsrun.net/zsIKp/edit" target="__blank">试一试</a>
      </Button>
    </div>
  );
}
