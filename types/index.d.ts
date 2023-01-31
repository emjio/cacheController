export interface Options {
    maxSize: number;
    maxUseTime:number,
}

export interface Blob<T=any>{
    size: number;
    data:T
} 

export interface Request {
 (params:any):Promise<any>
}
export  class CacheController  {
    #size:number;
    #cacheBlob:Map<string>;
    #maxSize:number;
    #maxTime:number;
    Constructor: (props:Options)=>void;
    setCache: (key:string,Blob:Blob)=>void;
    haveCache:(key:string)=>boolean;
    getCache: (key:string)=>any;
    removeCache: (key:string)=>void;
    removeEarliestCache: (key:string)=>void;
    generateRequest:(key:string,fn:Request)=> Promise<any>
}