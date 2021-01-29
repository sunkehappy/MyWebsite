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
      <h1>import.meta</h1>
      <h2 className={DefaultContentStyles.custom_h2}>作用</h2>
      <div>
        这个就是获取导入时候的一些元信息，一般情况下用不到，举个例子就明白了。
      </div>
      <h2 className={DefaultContentStyles.custom_h2}>参考代码：</h2>
      <pre>
        <code className="js">
{"// 假设是下面的导入模块的代码\n\
// <script type=\"module\" src=\"my-module.js\"></script>\n\
\n\
// my-module.js 里面\n\
console.log(import.meta); // { url: \"file:///home/user/my-module.js\" }\n\
\n\
\n\
// 注意，import.meta只能在module里面用，如果在命令行里面直接输入，会报错\n\
// import.meta\n\
// VM69:1 Uncaught SyntaxError: Cannot use 'import.meta' outside a module\n\
"}
        </code>
      </pre>
      <h2 className={DefaultContentStyles.custom_h2}>参考</h2>
      <div><a target="__blank" href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import.meta">import.meta</a></div>
    </div>
  );
}
