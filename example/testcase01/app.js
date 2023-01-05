import cacheController from 'cachecontroller'
const requestCacheController = new cacheController({ maxSize: 50, maxUseTime: 3 })

const sendbtn = document.querySelector('#sendRequest')
const resultContent = document.querySelector('#result')
const request = ()=>{
   return fetch('https://api.apiopen.top/api/sentences')
    .then((res)=> res.json())
    .then((json)=> json)
}
const api = requestCacheController.generateRequest(request)

sendbtn.addEventListener('click',()=>{
    console.log(api)
    api().then(res=>{
        console.log(requestCacheController)
        if(res.code===200){
            resultContent.innerText = `${res.result.name} ---${res.result.from}`
        }
    }).catch(e=>{
        console.log(e)
    })
})