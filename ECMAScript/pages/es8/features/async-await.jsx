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
      <h1>async/await</h1>
      <h2 className={DefaultContentStyles.custom_h2}>作用</h2>
      <div>要理解async/await就需要理解Promise，如果不懂Promise，建议百度搜索学习下，这里略过。async/await就是让我们能以同步形式的代码写异步操作，不用回调</div>
      <h2 className={DefaultContentStyles.custom_h2}>实例代码：</h2>
      <pre>
        <code className="js">
{"function resolveAfter2Seconds() {\n\
  return new Promise(resolve => {\n\
    setTimeout(() => {\n\
      resolve('resolved');\n\
    }, 2000);\n\
  });\n\
}\n\
\n\
async function asyncCall() {\n\
  console.log('calling');\n\
  const result = await resolveAfter2Seconds();\n\
  // 会在两秒后输出： \"resolved\"，注意，这里是停在了这里，只有在两秒后才会往下执行\n\
  console.log(result);\n\
}\n\
\n\
asyncCall();\n\
"}
        </code>
      </pre>
      <Button>
        <a href="http://js.jsrun.net/yHIKp/edit" target="__blank">试一试</a>
      </Button>
      <h2 className={DefaultContentStyles.custom_h2}>异常捕获</h2>
      <div>Promise最终会有两种状态：resolved和rejected，如果是resolved上面的写法是没问题的，如果被rejected掉，那我们就需要通过try/catch来捕获这个异常：</div>
      <pre>
        <code className="js">
{"function resolveAfter2Seconds() {\n\
  return new Promise((resolve, reject) => {\n\
    setTimeout(() => {\n\
      reject('rejected，你长得太帅！');\n\
    }, 2000);\n\
  });\n\
}\n\
\n\
async function asyncCall() {\n\
  console.log('calling');\n\
  try {\n\
      const result = await resolveAfter2Seconds();\n\
  } catch(e) {\n\
      console.log(`出错了：${JSON.stringify(e)}`);\n\
  }\n\
  // 会在2秒后输出  出错了：\"rejected，你长得太帅！\"\n\
  console.log(result);\n\
}\n\
\n\
asyncCall();\n\
"}
        </code>
      </pre>
      <Button>
        <a href="http://js.jsrun.net/W5IKp/edit" target="__blank">试一试</a>
      </Button>
      <h2 className={DefaultContentStyles.custom_h2}>参考：</h2>
      <div>
        <ol>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function">async function</a>
          </li>
          <li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise">Promise</a>
          </li>
        </ol>
      </div>
    </div>
  );
}
