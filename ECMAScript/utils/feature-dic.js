const ES7Feature = {
  includes: {
    key: "includes",
    name: "Array.prototype.includes()",
  },
  pow: {
    key: "pow",
    name: "指数运算**",
  },
};

const ES8Feature = {
  asyncAwait: {
    key: "asyncAwait",
    name: "async/await",
  },
  stringPrototypePadStartEnd: {
    key: "stringPrototypePadStartEnd",
    name: "String.prototpye.padStart/padEnd"
  },
  trailingCommas: {
    key: "trailingCommas",
    name: "trailing commas"
  },
  objectKeysAndValues: {
    key: "objectKeysAndValues",
    name: "Object.keys()和Object.values()",
  },
};

const ES9Feature = {
  asyncGeneratorAndIterator: {
    key: "asyncGeneratorAndIterator",
    name: "异步生成器和迭代器",
  },
  objectSpreadAndRest: {
    key: "objectSpreadAndRest",
    name: "对象的扩展和rest运算符",
  },
  promiseFinally: {
    key: "promiseFinally",
    name: "Promise.prototype.finally()",
  },
  taggedTemplateLiteralRevision: {
    key: "taggedTemplateLiteralRevision",
    name: "标签模板字面量修正",
  },
  taggedTemplateRawProperty: {
    key: "taggedTemplateRawProperty",
    name: "标签模板函数第一个参数的raw属性"
  },
  regularExpressionRelated: {
    key: "regularExpressionRelated",
    name: "正则表达式相关"
  },
};

const ES10Feature = {
  arrayPrototypeFlat: {
    key: "arrayPrototypeFlat",
    name: "Array.prototype.flat()"
  },
  arrayPrototypeFlatMap: {
    key: "arrayPrototypeFlatMap",
    name: "Array.prototype.flatMap()"
  },
  stringPrototypeTrimStartEnd: {
    key: "stringPrototypeTrimStartEnd",
    name: "String.prototype.trimStart()"
  },
  objectFromEntries: {
    key: "objectFromEntries",
    name: "Object.fromEntries()"
  },
  optionalCatchBinding: {
    key: "optionalCatchBinding",
    name: "可选的捕获绑定"
  },
  functionPrototypeToString: {
    key: "functionPrototypeToString",
    name: "Function.prototype.toString()"
  },
};

const ES11Feature = {
  dynamicImport: {
    key: "dynamicImport",
    name: "Dynamic import"
  },
  importMeta: {
    key: "importMeta",
    name: "import.meta",
  },
  exportAsFrom: {
    key: "exportAsFrom",
    name: "export ... as ... from ..."
  },
  optionalChaining: {
    key: "optionalChaining",
    name: "Optional Chaining"
  },
  nullishCoalescing: {
    key: "nullishCoalescing",
    name: "空值合并运算符"
  },
  bigIntComponent: {
    key: "bigIntComponent",
    name: "BigInt",
  },
  promiseAllSettled: {
    key: "promiseAllSettled",
    name: "Promise.allSettled()",
  },
  stringPrototypeMatchAll: {
    key: "stringPrototypeMatchAll",
    name: "String.prototype.matchAll()",
  },
  globalThis: {
    key: "globalThis",
    name: "globalThis",
  },
};

export {
  ES7Feature,
  ES8Feature,
  ES9Feature,
  ES10Feature,
  ES11Feature,
};
