# cacheController
a cache controller for cache data from request, can be auto read when a request have finished. and auto remove the least use cache.

# Features
缓存控制插件 
用于和请求混合使用以达到缓存请求的作用

# Example
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

## params 实例参数说明



|  参数   | 默认值  | 说明  |   类型|
|  ----  | ----  |----|----|
| maxSize|10 |储存的数据大小当装满了会尝试清空最早使用的数据腾出空间 | number |
| maxUseTime  | 3 | 最大使用次数，当从缓存中读取次数超过该数字缓存将被移除。| number



## methods 方法说明

|  方法名   | 参数  | 说明  |  返回值 |
|  ---- | -----  |----|----|
| setCache | key:string, blob:{size:number,data:any}   | 存入缓存，key值唯一，当重复出现会覆盖。bolb size 必传且必必须是数字  | void |
| haveCache  | key:sytring | 返回缓存中是否含有对应key的缓存不计入读取次数 | boolean 
| getCache  | key:sytring | 返回缓存中有对应key的缓存 |  (any or null) 
| removeEarliestCache  | void | 删除最早使用的key对应的缓存 | void 
| deleteCache | key:string | 删除key对应的缓存 | void 
