const Koa = require('koa');
const fs = require('fs');
const path = require('path');
const http2 = require('http2');
const http = require('http');
const koaBody = require('koa-body');
const router = require('./middleware/router');
const sslify = require('./middleware/sslify');
const rewriter = require('./middleware/rewriter');
const static = require('./middleware/static');
const logger = require('./util/logger');

class KoaOnHttps extends Koa {
    constructor() {
        super();
    }
    get options() {
        return {
            key: fs.readFileSync(require.resolve('./keys/www.gbzhu.cn.key')),
            cert: fs.readFileSync(require.resolve('./keys/www.gbzhu.cn.crt'))
        };
    }
    listen() {
        const server = http2.createSecureServer(this.options, this.callback());
        return server.listen.apply(server, arguments);
    }
}

const app = new KoaOnHttps();

app.use(sslify());
app.use(koaBody());
// x-response-time
app.use(async function(ctx, next) {
    const start = new Date();
    await next();
    const ms = new Date() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
});
// logger
app.use(async function(ctx, next) {
    const start = new Date();
    await next();
    const ms = new Date() - start;
    logger.info(`${ctx.method} ${ctx.url} - ${ms}`);
});

if (process.env.NODE_ENV === 'development') {
    // set cors header
    app.use(async function(ctx, next) {
        ctx.set({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Method': 'OPTIONS, GET, HEAD, POST, PUT',
            'Access-Control-Allow-Headers': 'Content-Type'
        });
        await next();
    });
}
app.use(rewriter({ whiteList: ['/api', '/mimg'] }));
app.use(router.routes()).use(router.allowedMethods());
if (process.env.NODE_ENV === 'production') {
    app.use(static(path.resolve(__dirname, '../dist')));
}

//receive all the http request, redirect them to https
http.createServer(app.callback()).listen(80, () => {
    logger.ok('http redirect server start at', `http://gbzhu.cn`);
});


app.listen(443, () => {
    logger.ok('app start at:', `https://gbzhu.cn`);
});
