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
      <h1>Optional Chaining</h1>
      <h2 className={DefaultContentStyles.custom_h2}>作用</h2>
      <div>
        这里的Optional是说调用者有可能为空，如果读者接触过Swift，就知道这是什么语法了。简单来说，强类型语言里面变量都会有类型，比如String，但它也有可能为空，我们可以说它是optional的。但是为空的话，后面的链式调用就会出问题，怎么办呢？通过增强一下语法，链式调用前加一个?表示如果前面的值是undefined，就直接返回undefined；如果不为undefined，就继续后面的调用，获取最后的结果。
      </div>
      <h2 className={DefaultContentStyles.custom_h2}>参考代码：</h2>
      <pre>
        <code className="js">
{"const myObject = {\n\
    name: \"Parwinder\",\n\
    car: \"Cybertruck\",\n\
    age: 42,\n\
    computers: {\n\
        first: {\n\
            name: \"iMac\",\n\
            year: 2017,\n\
            spec: {\n\
                cpu: \"i7\",\n\
                ram: \"16GB\"\n\
            }\n\
        },\n\
        second: {\n\
            name: \"MacBook Pro\"\n\
        }\n\
    }\n\
}\n\
\n\
console.log(myObject.computers.first.spec.cpu); // i7\n\
console.log(myObject.computers.second.spec.cpu); // Cannot read property 'cpu' of undefined\n\
console.log(myObject.computers.second.spec?.cpu); // undefined\n\
"}
        </code>
      </pre>
      <h2 className={DefaultContentStyles.custom_h2}>备注</h2>
      <div>这是一个非常有用的语法，在合适的地方使用可以大大简化我们的代码，提高代码可读性，增强JS代码的表达能力，配合<a target="__blank" href="/es11/nullishCoalescing">空值合并运算符</a></div>
    </div>
  );
}
