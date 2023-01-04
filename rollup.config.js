import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import replace from 'rollup-plugin-replace';
import { terser } from 'rollup-plugin-terser';
export default {
    input: "./src/index.js",
    output: [
        {
            file: "./dist/cache.cjs.js",
            format: "cjs",
            sourcemap: true,
            exports: 'default',
        },
    ],
    plugins: [
        resolve({
            jsnext: true,  // 该属性是指定将Node包转换为ES2015模块
            // main 和 browser 属性将使插件决定将那些文件应用到bundle中
            main: true,  // Default: true 
            browser: true // Default: false
        }),
        commonjs(),
        json(),
        replace({
            ENV: JSON.stringify(process.env.NODE_ENV || 'development')
        }),
        terser()
    ]
}; 