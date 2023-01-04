const terser = require('rollup-plugin-terser').terser
const pkg = require('./package.json')
const nodeResolve = require('rollup-plugin-node-resolve')
const cjs = require('rollup-plugin-commonjs')
const { cloneDeep,upperFirst} = require('lodash');
const filename = pkg.browser.slice(pkg.browser.indexOf('/') + 1, pkg.browser.indexOf('.'))
const path = require('path')

const resolve = (dir) => {
  return path.join(__dirname, dir)
}

const out = [
  {
    file: pkg.main,
    format: 'cjs'
  },
  {
    file: pkg.module,
    format: 'esm'
  },
  {
    file: pkg.browser,
    format: 'umd',
    // 对外导出名首字母友好的大写
    // example: 当 filename 为 vue 时，模块名即为 Vue
    name: upperFirst(filename)
  }
]

// 最小化版本文件头注释信息
const banner =
  `/*!
 * ${pkg.name} v${pkg.version}
 * (c) 2020-2021 ${pkg.author}
 * Released under the ${pkg.license} License.
 */
`;

// 最小化版本处理函数
const minimize = (obj) => {
  // 深拷贝
  const minObj = cloneDeep(obj)
  // 文件名添加 .min
  minObj.file = minObj.file.slice(0, minObj.file.lastIndexOf('.js')) + '.min.js'
  // 只对最小化版本去除 console，并压缩 js
  minObj.plugins = [terser({ compress: { drop_console: true } })]
  // 只对最小化版本添加文件头注释信息
  minObj.banner = banner
  return minObj
}

module.exports = {
  input: resolve('src/index.js'),
  output: [
    ...out, ...out.map(type => {
      type.file = resolve(type.file)
      return minimize(type)
    }),
    ],
    plugins:[
        nodeResolve(),
        cjs()

  ]
}