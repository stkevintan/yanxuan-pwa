const send = require('koa-send');
const logger = require('../util/logger');
const { fileMap, push } = require('../util/helper');
const depTree = require('../util/depTree');
module.exports = (root = '') => {
    return async function serve(ctx, next) {
        let done = false;
        if (ctx.method === 'HEAD' || ctx.method === 'GET') {
            try {
                logger.info('Send Path', ctx.path);
                if (/(\.html|\/[\w-]*)([?#]\S*)?$/.test(ctx.path)) {
                    depTree.currentKey = ctx.path;
                }
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
        } else {
            if (/(\.html|\/[\w-]*)([?#]\S*)?$/.test(ctx.path)) {
                //server push
                for (const dep of depTree.getDep()) {
                    push(ctx.res.stream, {
                        relPath: dep.relPath,
                        filePath: dep.filePath
                    });
                }
            }
        }
    };
};
