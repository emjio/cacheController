/**
 * @description 缓存生成器,对请求数据做缓存当重复请求的时候读取缓存而不是走http请求 当存满cache 的时候移除最少使用的cache
 * 
 */

export default class CacheController {
    #size = 0;
    #cacheBlob = new Map()
    #useQuene = {}
    #maxSize = 10
    #maxUseTime = 3
    /**
     * 
     * @param { Object } props init参数 
     */
    constructor(props) {
        const { maxSize, maxUseTime } = { ...props }
        if (maxSize <= 0 || isNaN(maxSize)) {
            throw new Error('maxSize should be a number');
        }
        if (maxUseTime <= 0 || isNaN(maxUseTime)) {
            throw new Error('maxSize should be a number');
        }
        this.#maxSize = maxSize
        this.#maxUseTime = maxUseTime
        this.axiosInstance = props.axios;
    }

    setCache(key, blob) {
        while (this.#size + blob.size > this.#maxSize && this.#size !== 0) {
            this.removeEarliestCache()
        }

        this.#cacheBlob.set(key, blob)
        this.#useQuene[key] = 0
        this.#size += blob.size
    }

    haveCache(key) {
        return this.#cacheBlob.has(key)
    }
    getCache(key) {
        let cache = null
        if (key in this.#useQuene) {
            cache = this.#cacheBlob.get(key).data
            this.#useQuene[key] += 1
            if (this.#useQuene[key] >= this.#maxUseTime) {
                this.deleteCache(key)
            }
        }
        return cache
    }

    generateRequest(key,fn) {
        return async (params) => {
            const cacheKey = `${key}-${JSON.stringify(params)}`
            if (this.haveCache(cacheKey)) {
                return this.getCache(cacheKey)
            }
            try {
                const data = await fn(params);
                this.setCache(cacheKey, { data, size: 1 });
                return data
            } catch (e) {
                throw new Error(e)
            }
        }
    }

    removeEarliestCache() {
        const earliestUseKey = Object.keys(this.#useQuene).sort((a, b) => this.#useQuene[a] - this.#useQuene[b])[0]
        delete this.#useQuene[earliestUseKey]
        this.#size -= this.#cacheBlob.get(earliestUseKey).size
        this.#cacheBlob.delete(earliestUseKey)
    }

    deleteCache(key) {
        if (this.#cacheBlob.has(key)) {
            delete this.#useQuene[key]
            this.#size -= this.#cacheBlob.get(key).size
            this.#cacheBlob.delete(key)
        }
    }
}
