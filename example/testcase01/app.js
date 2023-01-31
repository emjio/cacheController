import cacheController from 'cachecontroller'
const requestCacheController = new cacheController({ maxSize: 50, maxUseTime: 3 })

const sendbtn = document.querySelector('#sendRequest')
const resultContent = document.querySelector('#result')
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

sendbtn.addEventListener('click',()=>{
    api(params).then(res=>{
        if(res.code===200){
            resultContent.innerText = `${res.result.name} ---${res.result.from}`
        }
    }).catch(e=>{
        console.log(e)
    })
})