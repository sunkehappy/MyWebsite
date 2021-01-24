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
        ES6引入了标签模板，ES7让标签模板支持unicode，但是如果有无效的unicode出现，标签模板会抛出语法错误的异常。ES9就是修复这个问题，当有无效unicode出现的时候，就会用undefined代替。
      </div>
      <h2 className={DefaultContentStyles.custom_h2}>实例代码：</h2>
      <pre>
        <code className="js">
{"function myTagFn(str) {\n\
  return { \"parsed\": str[0] }\n\
}\n\
let result1 =myTagFn`\\unicode` //无效的unicode字符\n\
// {parsed: undefined}\n\
console.log(result1)\n\
let result2 =myTagFn`\\u2764\uFE0F`//红色的❤️\n\
// {parsed: \"❤️\"}\n\
console.log(result2)\n\
"}
        </code>
      </pre>
      <Button>
        <a href="http://js.jsrun.net/DAIKp/edit" target="__blank">试一试</a>
      </Button>
    </div>
  );
}
