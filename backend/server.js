const Koa = require('koa');
const fs = require('fs');
const path = require('path');
const http2 = require('http2');

const router = require('./middleware/router');
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

// set cors header
app.use(async function(ctx, next) {
    await next();
    ctx.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
    });
});

app.use(rewriter({ whiteList: ['/api', '/mimg'] }));
app.use(router.routes()).use(router.allowedMethods());
if (process.argv[2] !== 'dev') {
    app.use(static(path.resolve(__dirname, '../dist')));
}

app.listen(443, () => {
    logger.ok('app start at:', `https://gbzhu.cn`);
});
