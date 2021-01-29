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
      <h1>BigInt</h1>
      <h2 className={DefaultContentStyles.custom_h2}>作用</h2>
      <div>
        BigInt就是用来表示比较大的整数，略微增强了JS的表达能力，当然跟那些专门的的库还是没法比的。
      </div>
      <h2 className={DefaultContentStyles.custom_h2}>参考代码：</h2>
      <pre>
        <code className="js">
{"let oldLimit = Number.MAX_SAFE_INTEGER;\n\
// 9007199254740991\n\
console.log(oldLimit);\n\
// 9007199254740992\n\
console.log(++oldLimit);\n\
// 9007199254740992\n\
console.log(++oldLimit);\n\
// 9007199254740992\n\
console.log(++oldLimit);\n\
\n\
let newLimit = BigInt(Number.MAX_SAFE_INTEGER);\n\
// 9007199254740991n\n\
console.log(newLimit);\n\
// 9007199254740992n\n\
console.log(++newLimit);\n\
// 9007199254740993n\n\
console.log(++newLimit);\n\
// 9007199254740994n\n\
console.log(++newLimit);\n\
"}
        </code>
      </pre>
      <Button>
        <a href="http://js.jsrun.net/LyaKp/edit" target="__blank">试一试</a>
      </Button>
    </div>
  );
}
