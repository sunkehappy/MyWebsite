import React, { useEffect } from "react";
import Highlight from "highlight.js";
import javascript from "highlight.js/lib/languages/javascript";

import DefaultContentStyles from "../../../components/default-content.module.css";
import {Button} from "antd";

Highlight.registerLanguage("javascript", javascript);

export default function AsyncAwait() {
  useEffect(() => {
    Highlight.initHighlighting();
  }, []);

  return (
    <div className={DefaultContentStyles.container}>
      <h1>Object.keys()和Object.values()</h1>
      <h2 className={DefaultContentStyles.custom_h2}>作用</h2>
      <div>注意这两个是类方法，用以获取某个对象的键或值，返回的是一个数组</div>
      <h2 className={DefaultContentStyles.custom_h2}>实例代码：</h2>
      <pre>
        <code className="js">
{"// 巧用Object.keys()来翻转对象，未考虑异常情况\n\
let obj = {\n\
    \"张三\": \"name\",\n\
    9: \"age\",\n\
};\n\
let newObj = {};\n\
for (let key of Object.keys(obj)) {\n\
    newObj[obj[key]] = key;\n\
}\n\
console.log(`newObj: ${JSON.stringify(newObj)}`);\n\
console.log(`obj的值：${JSON.stringify(Object.values(obj))}`);\n\
"}
        </code>
      </pre>
      <Button>
        <a href="http://js.jsrun.net/7DIKp/edit" target="__blank">试一试</a>
      </Button>
      <h2 className={DefaultContentStyles.custom_h2}>备注</h2>
      <div>还有一个Object.entries()来获取键值对，配合解构赋值，遍历的时候也很方便，参考如下代码：</div>
      <pre>
        <code className="js">
{"const animals = {\n\
    tiger: '🐅',\n\
    cat: '🐱',\n\
    monkey: '🐒',\n\
    elephant: '🐘'\n\
};\n\
\n\
// `for...of` loop\n\
for (const [key, value] of Object.entries(animals)) {\n\
    console.log(`${key}: ${value}`);\n\
}\n\
"}
        </code>
      </pre>
      <Button>
        <a href="http://js.jsrun.net/cDIKp/edit" target="__blank">试一试</a>
      </Button>
    </div>
  );
}
