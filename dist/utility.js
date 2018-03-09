"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const funfix_core_1 = require("funfix-core");
const AipNlpClient = require('baidu-aip-sdk').nlp;
const APP_ID = '10833569';
const API_KEY = 'apsDSpsFwWYyYRLy7Ng77gc6';
const SECRET_KEY = 'I29eIUGvvQ8bi9Q4Dq362ccd9RmCkdvR';
const aip = new AipNlpClient(APP_ID, API_KEY, SECRET_KEY);
async function default_1(redis, word) {
    const result_from_redis = await redis.get(word);
    if (result_from_redis)
        return funfix_core_1.Option.of(result_from_redis);
    const result_from_aip = await aip.wordembedding(word);
    const vec = result_from_aip.vec;
    if (vec) {
        const vec_string = vec.toString();
        redis.set(word, vec_string);
        return funfix_core_1.Option.of(vec_string);
    }
    return funfix_core_1.Option.none();
}
exports.default = default_1;
