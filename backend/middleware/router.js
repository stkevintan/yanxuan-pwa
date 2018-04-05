const Router = require("koa-router");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const logger = require("../util/logger");
const adapter = new FileSync(require.resolve("../db.json"));
const db = low(adapter);

const router = new Router();

router.get("/api/product/:id", (ctx, next) => {
    const { id } = ctx.params;
    logger.info("Current Request id:", id);
    const regRet = /([^_]+)/.exec(id);
    if (regRet == null) ctx.throw(404);
    const ret = db
        .get("product")
        .get(regRet[0])
        .value();
    if (ret == undefined) ctx.throw(404);
    ctx.body = ret;
});


// common
router.get("/api/:domain", (ctx, next) => {
    const { domain } = ctx.params;
    logger.info("Current Request Params:", domain);
    const ret = db.get(domain).value();
    if (ret == undefined) ctx.status = 404;
    else ctx.body = ret;
});

router.get("/api/:domain/:type", (ctx, next) => {
    const { domain, type } = ctx.params;
    logger.info("Current Request Params2:", domain, type);
    const ret = db
        .get(domain)
        .get(type)
        .value();
    if (ret == undefined) ctx.status = 404;
    else ctx.body = ret;
});

module.exports = router;
