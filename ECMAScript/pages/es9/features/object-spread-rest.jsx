import React, { useEffect } from "react";
import Highlight from "highlight.js";
import javascript from "highlight.js/lib/languages/javascript";

import DefaultContentStyles from "../../../components/default-content.module.css";
import {Button} from "antd";

Highlight.registerLanguage("javascript", javascript);

export default function ObjectSpreadAndRest() {
  useEffect(() => {
    Highlight.initHighlighting();
  }, []);

  return (
    <div className={DefaultContentStyles.container}>
      <h1>对象的扩展和rest运算符</h1>
      <h2 className={DefaultContentStyles.custom_h2}>作用</h2>
      <div>
        在ES6中，...和rest运算符只能用到Array上面，ES9里面对这两种运算符进行了增强，他们的效果和在Array中类似。
      </div>
      <h2 className={DefaultContentStyles.custom_h2}>实例代码：</h2>
      <pre>
        <code className="js">
{"let a = {\"a\" : 1};\n\
let b = {\"b\" : 2};\n\
let c = {...a, ...b, \"c\": 3};\n\
// { a: 1, b: 2, c: 3 }\n\
console.log(c);\n\
let {\"a\": d, ...e} = c;\n\
// 1\n\
console.log(d);\n\
// { b: 2, c: 3 }\n\
console.log(e);\n\
"}
        </code>
      </pre>
      <Button>
        <a href="http://js.jsrun.net/hCIKp/edit" target="__blank">试一试</a>
      </Button>
    </div>
  );
}
