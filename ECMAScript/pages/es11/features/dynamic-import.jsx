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
      <h1>Dynamic import</h1>
      <h2 className={DefaultContentStyles.custom_h2}>作用</h2>
      <div>
        动态导入模块。一般情况下我们都是在模块开头静态导入模块，然后在后续就可以使用这些模块了，这里的dynamic import就是让我们可以动态的导入模块。
      </div>
      <h2 className={DefaultContentStyles.custom_h2}>参考代码：</h2>
      <pre>
        <code className="js">
{"// greeting.js\n\
export const greeting = (name) => console.log(`Hello ${name}`);\n\
\n\
// main.js\n\
// You can import this conditionally into your application.\n\
const time = \"morning\"; // this is dynamically set to the time of day, hardcoded for example\n\
\n\
if (time === \"morning\") {\n\
    const say = await import(\"./greeting.js\");\n\
    say.greeting(\"ES11\"); // Hello ES11\n\
}\n\
"}
        </code>
      </pre>
      <h2 className={DefaultContentStyles.custom_h2}>备注</h2>
      <div>目前WebPack已经支持这种特性，写法也稍有不同，类似import('abc.js').then(...)这种，这次ES11是原生的提供这种功能，来的有点晚。请参考<a target="__blank" href="https://webpack.js.org/guides/code-splitting/#dynamic-imports">Dynamic Imports</a></div>
    </div>
  );
}
