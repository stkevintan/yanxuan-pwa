const send = require('koa-send');
const logger = require('../util/logger');

module.exports = (root = "") => {
    return async function serve(ctx, next) {
        let done = false;
        if (ctx.method === "HEAD" || ctx.method === "GET") {
            try {
                logger.info('Send Path', ctx.path);
                done = await send(ctx, ctx.path, { root });
            } catch (err) {
                if (err.status !== 404) {
                    logger.error(err);
                    throw err;
                }
            }
        }
        if (!done) {
            await next();
        }
    };
};
