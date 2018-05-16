module.exports = {
  parser: 'babel-eslint',
  env: {
    browser: true,
    node: true,
  },
  // extending airbnb config and config derived from eslint-config-prettier
  extends: ['airbnb', 'prettier'],

  // activating esling-plugin-prettier (--fix stuff)
  plugins: ['prettier'],

  // 自定义 eslint 检查规则
  rules: {
    // 自定义 prettier 规则 (实际上，可配置项非常有限)
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        trailingComma: 'all',
      },
    ],
    semi: [2, 'always'], // 语句强制分号结尾
    camelcase: 0, // 强制驼峰法命名
    'no-new': 0, // 禁止在使用new构造一个实例后不赋值
    'space-before-function-paren': 0, // 函数定义时括号前面不要有空格
    'no-plusplus': 0, // 禁止使用 ++， ——
    'max-len': 0, // 字符串最大长度
    'comma-dangle': ["error", 'always-multiline'], // 多行对象字面量项尾总是有逗号
    'func-names': 0, // 函数表达式必须有名字
  },
};
