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
      <h1>String.prototype.matchAll()</h1>
      <h2 className={DefaultContentStyles.custom_h2}>作用</h2>
      <div>
        用来解决浏览器、Node.js 等不同环境下，全局对象名称不统一，获取全局对象比较麻烦的问题，有了这个，不管什么环境，用globalThis就行了，简单省事儿。如果没这个东西，我们在web里面可以用window，self，frames，在Web Worker里面只能用self，但是在Node.js里面我们只能用global，现在这个globalThis真是一个好东西。
      </div>
      
      <h2 className={DefaultContentStyles.custom_h2}>参考</h2>
      <div>直接看文档吧<a target="__blank" href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis">globalThis</a></div>
    </div>
  );
}
