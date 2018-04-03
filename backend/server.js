const Koa = require("koa");
const fs = require("fs");
const http2 = require("http2");
const router = require("./router");
const cors = require("koa-cors");

class KoaOnHttps extends Koa {
    constructor() {
        super();
    }
    get options() {
        return {
            key: fs.readFileSync(require.resolve("./keys/server.key")),
            cert: fs.readFileSync(require.resolve("./keys/server.crt"))
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
    ctx.set("X-Response-Time", `${ms}ms`);
});
// logger
app.use(async function(ctx, next) {
    const start = new Date();
    await next();
    const ms = new Date() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}`);
    ctx.res.type = "json";
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(3300, () => {
    console.log("app start at:", `https://localhost:3300`);
});
