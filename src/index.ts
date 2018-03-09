import redis from './redis_client'
import { word2vec } from './utility'

// tslint:disable-next-line:variable-name
const Koa = require('koa')
const app = new Koa()
const koaBody = require('koa-body')
const cors = require('koa-cors')

app.use(koaBody())
app.use(cors())

// tslint:disable-next-line:no-any
app.use(async (ctx: any) => {
    try {
        const word = decodeURIComponent(ctx.request.body.word)
        console.log(word)
        const vec_opt = await word2vec(redis, word)
        const result_opt = vec_opt.map(vec => ({ 'status': 1, vec }))
        ctx.body = result_opt.getOrElse({ 'status': 0 })
    } catch (e) {
        console.log(e)
        // -1 means could never recover
        ctx.body = { 'status': -1 }
    }
})

app.listen(1234)
