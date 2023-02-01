# cacheController

a cache controller for cache data from request, can be auto read when a request have finished. and auto remove the least use cache.

# Features

缓存控制插件
用于和请求混合使用以达到缓存请求的作用
# Example

play with the [examples](https://github.com/emjio/cacheController/tree/dev/example) (see how to run them below).

# Install && Use

```shell
npm i cachecontroller

```
```javascript

import CacheController from 'cachecontroller'
const requestCacheController = new CacheController({ maxSize: 50, maxUseTime: 3 })

```


## Params 实例参数说明

|  参数   | 默认值  | 说明  |   类型|
|  ----  | ----  |----|----|
| maxSize|10 |储存的数据大小当装满了会尝试清空最早使用的数据腾出空间 | number |
| maxUseTime  | 3 | 最大使用次数，当从缓存中读取次数超过该数字缓存将被移除。| number

## Methods 方法说明

|  方法名   | 类型  | 说明  |  
|  ---- | -----  |----|
| setCache | (key: string, blob: { size : number, data : any }) => void   | 存入缓存，key值唯一，当重复出现会覆盖。bolb size 必传且必必须是数字  |
| haveCache  | (key: string) => boolean | 返回缓存中是否含有对应key的缓存不计入读取次数 |
| getCache  | (key: string) => any or null | 返回缓存中有对应key的缓存 |  (any or null)
| removeEarliestCache | () => void | 删除最早使用的key对应的缓存 | void
| deleteCache | (key: string) => void | 删除key对应的缓存 |
|generateRequest| (key: string, ()=> Promise) => void | 为一个请求方法生成一个自动缓存的请求方法 |

## Development Setup  开发启动

```shell

# install deps

npm install

# build dist files

npm run build

# serve examples at localhost:8080

npm run serve

# lint & run all tests

npm test

```

## Todo list

- [X] 实现生成器，对请求函数进行封装，返回一个可执行的promise 实现动态生成缓存请求方法。
- [ ] 实现缓存持久化储存hook，提供客户端持久化能力。