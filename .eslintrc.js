module.exports = {
    // 当前文件目录是否为规则执行的根目录
    root: true,
    // 设置环境，会预定义所有环境对应的全局变量
    env: {
        node: true,
        es6: true,
        commonjs:true,
        es2021:true,
    },
    // 解析器选项
    parserOptions: {
    // 文件解析器
        ecmaVersion: 12,
        sourceType: 'module',
    },
    extends:[
        'standard'
    ],
    // 此处设置全局变量
    globals: {
        process: true
    },
    /*
  * "off" or 0 - 关闭规则
  * "warn" or 1 - 开启规则，只警告
  * "error" or 2 - 开启规则，报错
  * */
    rules: {
    }
}
