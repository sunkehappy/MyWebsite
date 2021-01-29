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
      <h1>String.prototype.trimStart()</h1>
      <h2 className={DefaultContentStyles.custom_h2}>作用</h2>
      <div>
        移除字符串左侧的空格，原地修改，注意只移除空格，不包含换行符和制表符。
      </div>
      <h2 className={DefaultContentStyles.custom_h2}>参考代码：</h2>
      <pre>
        <code className="js">
{"const greeting = '   Hello world!   ';\n\
\n\
console.log(greeting);\n\
// expected output: \"   Hello world!   \";\n\
\n\
console.log(greeting.trimStart());\n\
// expected output: \"Hello world!   \";\n\
"}
        </code>
      </pre>
      <Button>
        <a href="http://js.jsrun.net/gfaKp/edit" target="__blank">试一试</a>
      </Button>
      <h1 className={DefaultContentStyles.custom_h1}>String.prototype.trimEnd()</h1>
      <h2 className={DefaultContentStyles.custom_h2}>作用</h2>
      <div>类似于trimStart</div>
      <h2 className={DefaultContentStyles.custom_h2}>参考</h2>
      <div>直接看文档吧<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trimStart" target="__blank">String.prototype.trimStart()</a></div>
      <div>直接看文档吧<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trimEnd" target="__blank">String.prototype.trimEnd()</a></div>
    </div>
  );
}
