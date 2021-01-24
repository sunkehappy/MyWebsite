import React, { useEffect } from "react";
import Highlight from "highlight.js";
import javascript from "highlight.js/lib/languages/javascript";

import DefaultContentStyles from "../../default.content.module.css";
import { Button } from "antd";

Highlight.registerLanguage("javascript", javascript);

export default function PromiseFinally() {
  useEffect(() => {
    Highlight.initHighlighting();
  }, []);

  return (
    <div className={DefaultContentStyles.container}>
      <h1 className={DefaultContentStyles.custom_h1}>s修饰符</h1>
      <h2 className={DefaultContentStyles.custom_h2}>作用</h2>
      <div>使.通配符能匹配到\n和\r</div>
      <h2 className={DefaultContentStyles.custom_h2}>实例代码：</h2>
      <pre>
        <code className="js">
          {
            "// true\n\
console.log('.匹配e：', /abc.d/.test(\"abced\"));\n\
// false\n\
console.log('.匹配\\n：', /abc.d/.test(\"abc\\nd\"));\n\
// false\n\
console.log('.匹配\\r：', /abc.d/.test(\"abc\\rd\"));\n\
// true\n\
console.log('.和s修饰符匹配\\n：', /abc.d/s.test(\"abc\\nd\"));\n\
// true\n\
console.log('.和s修饰符匹配\\r：', /abc.d/s.test(\"abc\\rd\"));\n\
// true\n\
console.log('.和s修饰符匹配\\r或\\n：', /abc.+d/s.test(\"abc\\r\\nd\"));\n\
"
          }
        </code>
      </pre>
      <Button>
        <a href="http://js.jsrun.net/TjIKp/edit" target="__blank">
          试一试
        </a>
      </Button>
      <h1 className={DefaultContentStyles.custom_h1}>带命名的捕获</h1>
      <h2 className={DefaultContentStyles.custom_h2}>作用</h2>
      <div>可以为我们的捕获项命名，在这个功能出来之前，我们只能通过捕获结果的$x来读取结果，有了这个功能，我们就可以为这些捕获起一些有意义的名字。具体用法就是在捕获的小括号里面开头的地方写上"?&lt;名字&gt;"。下面的代码演示了一个字符串替换的例子，当正则表达式比较复杂的时候，带名字的捕获可读性会好很多。</div>
      <h2 className={DefaultContentStyles.custom_h2}>实例代码：</h2>
      <pre>
        <code className="js">
          {
            "let str = \"name1: zhangsan, name2: lisi\";\n\
let reUnnamed = /([a-z0-9]+):\s+([a-z]+),\s+([a-z0-9]+):\s+([a-z]+)/;\n\
// name1: lisi name2: zhangsan\n\
console.log(str.replace(reUnnamed, \"$1: $4 $3: $2\"));\n\
\n\
let reNamed = /(?<name1>[a-z0-9]+):\s+(?<value1>[a-z]+),\s+(?<name2>[a-z0-9]+):\s+(?<value2>[a-z]+)/;\n\
// name1: lisi name2: zhangsan\n\
console.log(str.replace(reNamed, \"$<name1>: $<value2> $<name2>: $<value1>\"));\n\
"
          }
        </code>
      </pre>
      <Button>
        <a href="http://js.jsrun.net/JjIKp/edit" target="__blank">
          试一试
        </a>
      </Button>
      <h1 className={DefaultContentStyles.custom_h1}>先行断言(lookahead) 和 后行断言(lookbehind)</h1>
      <h2 className={DefaultContentStyles.custom_h2}>作用</h2>
      <div>简单来说，就是可以让我们在正则表达式做搜索的时候，指定在xx正则条件下，去做yy正则的匹配。说起来比较绕，举个例子，我们有些名字和性别："Zhangsan is male, Lisi is female, Wangwu is male, Zhaoliu is female."。
      <ul>
        <li>先行断言：(?=...)。举例：男性的名字，/[a-zA-Z]+(?= is male)/g</li>
        <li>先行否定断言：(?!...)。举例：女性的名字，/[a-zA-Z]+(?= is (?!male))/g。注意这里面用了嵌套</li>
      </ul>
      </div>
      <div>
      "$3 $4 €2 €6 8 5"，我想匹配里面所有美元价格，还有所有不带类型的数字。
      </div>
      <ul>
        <li>后行断言：(?&lt;=...)。举例：只匹配“$”后面的数字，/(?&lt;=\$)\d+/</li>
        <li>后行否定断言(?&lt;!...)。举例：只匹配前面不是$和€的数字(也需要排除小数点，要不然会匹配到小数点后面的数字，这不是我们想要的)，/(?&lt;![\$€\.])\d+/</li>
      </ul>
      <h2 className={DefaultContentStyles.custom_h2}>实例代码：</h2>
      <pre>
        <code className="js">
          {
            "let moneyString = \"$3 $4 €2 €6 8 5\";\n\
// [ '3', '4' ]\n\
console.log(moneyString.match(/(?<=\$)\d+/g));\n\
// [ '8', '5' ]\n\
console.log(moneyString.match(/(?<![\$€])\d+/g));\n\
\n\
let fileNames = \"Zhangsan is male, Lisi is female, Wangwu is male, Zhaoliu is female.\"\n\
// [ 'Zhangsan', 'Wangwu' ]\n\
console.log(fileNames.match(/[a-zA-Z]+(?= is male)/g));\n\
// [ 'Lisi', 'Zhaoliu' ]\n\
console.log(fileNames.match(/[a-zA-Z]+(?= is (?!male))/g));\n\
"
          }
        </code>
      </pre>
      <Button>
        <a href="http://js.jsrun.net/xMIKp/edit" target="__blank">
          试一试
        </a>
      </Button>
    </div>
  );
}
