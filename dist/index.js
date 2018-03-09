"use strict";
const Koa = require('koa');
const app = new Koa();
const koaBody = require('koa-body');
const cors = require('koa-cors');
app.use(koaBody());
app.use(cors());
app.use(async (ctx) => {
    const vec = await (decodeURIComponent(ctx.request.body.word));
    ctx.body = { vec };
});
app.listen(1234);
