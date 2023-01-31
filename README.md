# cacheController

a cache controller for cache data from request, can be auto read when a request have finished. and auto remove the least use cache.

# Features

缓存控制插件
用于和请求混合使用以达到缓存请求的作用

# Example
 1. 配合请求拦截器使用
```javascript
// axios.js

import CacheController from 'cachecontroller'
const requestCacheController = new CacheController({ maxSize: 50, maxUseTime: 3 })


// 创建axios实例
const service = axios.create({
    baseURL: '/api',
    timeout: 15000
})


const request = async (config) =>{
    //  可自行实现
        const generateDataStr = config => {
            const { method, data, params } = config
            let dataStr = ''
            if (method === 'get' && params) {
                dataStr = typeof params !== 'string' ? JSON.stringify(params) : params
            }
            if (method === 'post' && data) {
                dataStr = typeof data !== 'string' ? JSON.stringify(data) : data
            }
            return dataStr
        }
        const dataStr = generateDataStr(config)
        const hash = `${method}${url}${dataStr}${unique ? Math.random() : ''}`
        return new Promise((resolve, reject) => { 
        if (requestCacheController.haveCache(hash)) {
            return resolve(requestCacheController.getCache(hash))   
            }else{
            const data = await service.request(config)
            if(config.cache){
                requestCacheController.setCache(hash, { data, size: 1 })
            }
            return data
        }
    })
}

// api.js

import request from 'axios.js'

export function addAddress (params) {
    return request({
        url:'/address',
        params,
        cache:true
    })
}

```
2. 配合缓存生成器使用

```javascript 
import cacheController from 'cachecontroller'
const requestCacheController = new cacheController({ maxSize: 50, maxUseTime: 3 })

const request = (params)=>{    
   return fetch(`https://api.apiopen.top/api/sentences?page=${params.page}&size=${params.size}`)
    .then((res)=> res.json())
    .then((json)=> json)
}
const params = {
    page:1,
    size:2
}
const api = requestCacheController.generateRequest(`sentences`,request)
    api(params).then(res=>{
        if(res.code===200){
        // do sth
        }
    }).catch(e=>{
        // console.log(e)
    })

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

[ ] 实现生成器，对请求函数进行封装，返回一个可执行的promise 实现动态生成缓存请求方法。
