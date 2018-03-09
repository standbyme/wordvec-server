import { Option } from 'funfix-core'
import * as Redis from 'ioredis'
// @ts-ignore
// tslint:disable-next-line:variable-name
const AipNlpClient = require('baidu-aip-sdk').nlp

const APP_ID = '10833569'
const API_KEY = 'apsDSpsFwWYyYRLy7Ng77gc6'
const SECRET_KEY = 'I29eIUGvvQ8bi9Q4Dq362ccd9RmCkdvR'

const aip = new AipNlpClient(APP_ID, API_KEY, SECRET_KEY)
function sleep(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time))
}

// tslint:disable-next-line:no-any
export async function word2vec(redis: Redis.Redis, word: string): Promise<Option<string>> {

    const result_from_redis = await redis.get(word)
    if (result_from_redis) return Option.of(result_from_redis)
    const result_from_aip = await aip.wordembedding(word)
    const vec = result_from_aip.vec
    if (vec) {
        const vec_string = vec.toString()
        redis.set(word, vec_string)
        return Option.of(vec_string)
    }
    const error_code = result_from_aip.error_code
    if (error_code) {
        switch (error_code) {
            case 282300:
                return Option.none()
            case 18:
                await sleep(10)
                return await word2vec(redis, word)
            default:
                throw error_code
        }
    }
}
