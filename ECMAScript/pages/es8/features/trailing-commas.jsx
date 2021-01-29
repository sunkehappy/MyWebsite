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
      <h1>Trailing Commas</h1>
      <h2 className={DefaultContentStyles.custom_h2}>作用</h2>
      <div>在数组、对象、函数参数等地方最后一个参数后面允许添加“,”。通俗解释：想象一下数组里面的元素，一行一个，最后一个后面是不需要逗号的，但是如果在最后一个元素后面再加一个，就会需要在原来的最后一个元素后面加一个逗号，然后再加一个元素。这在源代码的修改diff的时候，略奇怪，删掉一行增加两行。如果我们允许trailing commas，就可以做到只增加一行。</div>
      <h2 className={DefaultContentStyles.custom_h2}>实例代码：</h2>
      <pre>
        <code className="js">
{"let a = [\n\
    1,\n\
    3,\n\
    5,\n\
    7,\n\
];\n\
// 4个\n\
console.log(`a里面有${a.length}个元素`);\n\
\n\
let b = [\n\
    1,\n\
    3,\n\
    5,\n\
    7,\n\
    ,\n\
];\n\
// 5个\n\
console.log(`b里面有${b.length}个元素`);\n\
console.log(`b的最后一个元素是：${b[4]}`);\n\
"}
        </code>
      </pre>
      <Button>
        <a href="http://js.jsrun.net/sDIKp/edit" target="__blank">试一试</a>
      </Button>
      <h2 className={DefaultContentStyles.custom_h2}>备注</h2>
      <div>可以看到，多一个“,”并不是什么作用都没有，所以也不要乱写，详细的信息可以参考<a target="__blank" href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Trailing_commas">Trailing commas</a></div>
    </div>
  );
}
