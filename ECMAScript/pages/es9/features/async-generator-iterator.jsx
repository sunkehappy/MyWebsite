import React, { useEffect } from "react";
import Highlight from "highlight.js";
import javascript from "highlight.js/lib/languages/javascript";

import DefaultContentStyles from "../../default.content.module.css";
import {Button} from "antd";

Highlight.registerLanguage("javascript", javascript);

export default function AsyncAwait() {
  useEffect(() => {
    Highlight.initHighlighting();
  }, []);

  return (
    <div className={DefaultContentStyles.container}>
      <h1>异步生成器和迭代器</h1>
      <h2 className={DefaultContentStyles.custom_h2}>作用</h2>
      <div>要理解异步生成器和迭代器需要先理解什么是生成器，这里可以参考阮一峰的ES6中的
        <a target="__blank" href="https://es6.ruanyifeng.com/#docs/generator">Generator 函数的语法</a>和
        <a target="__blank" href="https://es6.ruanyifeng.com/#docs/iterator">Iterator 和 for...of 循环</a>。
        ES9的这个异步的生成器和异步的迭代器就是说，之前的生成器和迭代器加上异步。比如说我可以1秒后生成一个"A"，然后再等1秒生成一个"B"，然后再等一秒生成一个"C"，然后我把生成的结果，通过异步的迭代器输出出来，参考代码：
      </div>
      <h2 className={DefaultContentStyles.custom_h2}>实例代码：</h2>
      <pre>
        <code className="js">
{"async function* generateChars() {\n\
    for (const ch of \"ABC\") {\n\
        yield await new Promise((resolve) => {\n\
        setTimeout(() => {\n\
            resolve(ch);\n\
        }, 1000);\n\
        });\n\
    }\n\
}\n\
\n\
async function testAsyncAwaitAndGenerators() {\n\
    let start = Date.now();\n\
    for await (const ch of generateChars()) {\n\
        console.log(\n\
        `距离开始时间：${parseInt(\n\
            (Date.now() - start) / 1000\n\
        )}秒，字符：${ch}`\n\
        );\n\
    }\n\
}\n\
\n\
// 距离开始时间：1秒，字符：A\n\
// 距离开始时间：2秒，字符：B\n\
// 距离开始时间：3秒，字符：C\n\
testAsyncAwaitAndGenerators();\n\
"}
        </code>
      </pre>
      <Button>
        <a href="http://js.jsrun.net/2nIKp/edit" target="__blank">试一试</a>
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
            <a target="__blank" href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of">for await...of</a>
          </li>
        </ol>
      </div>
    </div>
  );
}
