import cacheController from 'cachecontroller'
import axios from 'axios'
const requestCacheController = new cacheController({ maxSize: 50, maxUseTime: 3 })




// 创建axios实例
const service = axios.create({
    baseURL: 'https://api.apiopen.top/api',
    timeout: 15000
})

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

const request = async (config) =>{
         const { method, data, params,url } = config
        const dataStr = generateDataStr(config)
        const hash = `${method}${url}${dataStr}`
        return new Promise(async(resolve, reject) => { 
        if (requestCacheController.haveCache(hash)) {
            console.log('读取到缓存')
            return resolve(requestCacheController.getCache(hash))   
            }else{
                console.log('从网络获取')
            const data = await service.request(config)
            if(config.cache){
                requestCacheController.setCache(hash, { data:data.data, size: 1 })
            }
            return resolve(data.data)
        }
    })
}

const sendbtn = document.querySelector('#sendRequest')
const resultContent = document.querySelector('#result')

const params = {
    page:1,
    size:2
}

 function getSentences(params) {
    return request({
        url:'/sentences',
        params,
        method:'get',
        cache:true
    })
}
sendbtn.addEventListener('click',()=>{
    getSentences(params).then(res=>{
        if(res.code===200){
            resultContent.innerText = `${res.result.name} ---${res.result.from}`
        }
    }) 
})