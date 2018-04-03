const Koa = require("koa");
const router = require("koa-router");
const http2 = require("http2");
const options = require("./keys"); // 这里输出的是证书
class KoaOnHttps extends Koa {
  constructor() {
    super();
  }
  listen() {
    const server = http2.createServer(options, this.callback());
    return server.listen.apply(server, arguments);
  }
}
const app = new KoaOnHttps();

// x-response-time
app.use(async function(ctx, next) {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  ctx.set("X-Response-Time", `${ms}ms`);
});
// logger
app.use(async function(ctx, next) {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}`);
});
app.listen(3000);
