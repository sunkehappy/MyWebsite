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
      <h1>可选的捕获绑定</h1>
      <h2 className={DefaultContentStyles.custom_h2}>作用</h2>
      <div>
        以前的try/catch后面必须跟上具体的捕获绑定，现在可以不跟了。（强烈建议不要这么干，最好是能记录下异常，万一后面需要分析呢）
      </div>
      <h2 className={DefaultContentStyles.custom_h2}>参考代码：</h2>
      <pre>
        <code className="js">
{"try {\n\
    console.log(\"in try\");\n\
    throw new Exception(\"This is a exception\");\n\
} catch {\n\
    console.log(\"in catch\");\n\
}\n\
// in try\n\
// in catch\n\
"}
        </code>
      </pre>
      <h2 className={DefaultContentStyles.custom_h2}>参考</h2>
      <div><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch#the_exception_identifier" target="__blank">The exception identifier</a></div>
    </div>
  );
}
