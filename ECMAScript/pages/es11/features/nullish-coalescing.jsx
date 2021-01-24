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
      <h1>空值合并运算符</h1>
      <h2 className={DefaultContentStyles.custom_h2}>作用</h2>
      <div>
        如果运算符左边的值不为空，就使用这个值；如果不为空，就使用右边的值。跟之前的||有点像，不同点就是空值合并运算符只处理“空”，包括null和undefined，不处理0, NaN, ""等，这些是假值，但是不是空值。
      </div>
      <h2 className={DefaultContentStyles.custom_h2}>参考代码：</h2>
      <pre>
        <code className="js">
{"// \"abc\"\n\
\"\" || \"abc\"\n\
// \"\"\n\
\"\" ?? \"abc\"\n\
\n\
// \"abc\"\n\
NaN || \"abc\"\n\
//NaN\n\
NaN ?? \"abc\"\n\
\n\
// \"abc\"\n\
0 || \"abc\"\n\
// 0\n\
0 ?? \"abc\n\
"}
        </code>
      </pre>
      <h2 className={DefaultContentStyles.custom_h2}>备注</h2>
      <div>千万不要和||运算符搞混了</div>
    </div>
  );
}
