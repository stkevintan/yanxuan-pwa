const Koa = require('koa');
const fs = require('fs');
const path = require('path');
const http2 = require('http2');
const http = require('http');
const koaBody = require('koa-body');
const compress = require('./middleware/compress');
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
      key: fs.readFileSync(require.resolve('/etc/letsencrypt/live/you.keyin.me/privkey.pem')),
      cert: fs.readFileSync(require.resolve('/etc/letsencrypt/live/you.keyin.me/fullchain.pem'))
    };
  }
  listen(...args) {
    const server = http2.createSecureServer(this.options, this.callback());
    return server.listen(...args);
  }
  redirect(...args) {
    const server = http.createServer(this.callback());
    return server.listen(...args);
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

app.use(compress());

logger.info('current node env is :', process.env.NODE_ENV);
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
app.use(rewriter({whiteList: ['/api', '/mimg']}));

app.use(router.routes()).use(router.allowedMethods());
if (process.env.NODE_ENV === 'production') {
  app.use(static(path.resolve(__dirname, '../dist')));
}
try {
  app.listen(443, () => {
    logger.ok('app start at:', `https://you.keyin.cn`);
  });

  // receive all the http request, redirect them to https
  app.redirect(80, () => {
    logger.ok('http redirect server start at', `http://you.keyin.me`);
  });
} catch (e) {
  logger.error(
      `${e}\n`, 'try: sudo setcap \'cap_net_bind_service=+ep\' `which node`');
}
