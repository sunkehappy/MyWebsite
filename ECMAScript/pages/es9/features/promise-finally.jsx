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
      <h1>Promise.prototype.finally</h1>
      <h2 className={DefaultContentStyles.custom_h2}>作用</h2>
      <div>
        Promise对象的状态变更之后，会被调用，不论状态变成是fullfilled还是rejected。
      </div>
      <h2 className={DefaultContentStyles.custom_h2}>实例代码：</h2>
      <pre>
        <code className="js">
{"let p1 = new Promise(resolve => {\n\
    resolve(1);\n\
});\n\
p1.then(value => {\n\
    console.log(`p1.then value: ${value}`);\n\
}).finally(() => {\n\
    console.log('p1.finally');\n\
});\n\
// p1.then value: 1\n\
// p1.finally\n\
\n\
let p2 = new Promise((resolve, reject) => {\n\
    reject(2);\n\
});\n\
\n\
p2/*.then(value => {\n\
    console.log(`p2.then value: ${value}`);\n\
})*/.catch(err => {\n\
    console.log(`p2.catch err: ${err}`);\n\
}).finally(() => {\n\
    console.log('p2.finally');\n\
});\n\
// p2.catch err: 2\n\
// p2.finally\n\
"}
        </code>
      </pre>
      <Button>
        <a href="http://js.jsrun.net/NAIKp/edit" target="__blank">试一试</a>
      </Button>
    </div>
  );
}
