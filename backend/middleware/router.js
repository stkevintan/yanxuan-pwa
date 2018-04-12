const Router = require('koa-router');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const logger = require('../util/logger');
const image = require('../util/image');
const fs = require('fs');
const path = require('path');
const adapter = new FileSync(require.resolve('../db.json'));
const db = low(adapter);
const { push, fileMap } = require('../util/helper');
const depTree = require('../util/depTree');
const router = new Router();

const userTpl = {
    uId: '00000001',
    name: 'm18682145280_1',
    avatar: 'https://gbzhu.cn/mimg/8945ae63d940cc42406c3f67019c5cb6.png',
    membership: 0
};

router.post('/api/login', async (ctx, next) => {
    const { username, password } = ctx.request.body;
    logger.info('user login:', username, password);
    const userExist = db.has('userInfo').value();
    if (!userExist) {
        db.set('userInfo', []).write();
    }
    const userDb = db.get('userInfo');
    if (!userExist || !userDb.find({ name: username }).value()) {
        userDb
            .push(Object.assign({}, userTpl, { name: username, password }))
            .write();
    }
    ctx.body = { ok: true };
});

router.get('/api/user/:username', async (ctx, next) => {
    const { username } = ctx.params;
    const userExist = db.has('userInfo').value();
    if (!userExist) {
        db.set('userInfo', []).write();
        return (ctx.body = null);
    }
    const user = db
        .get('userInfo')
        .find({ name: username })
        .value();
    if (!user) {
        return (ctx.body = null);
    }
    const res = Object.assign({}, user);
    delete res.password;
    ctx.body = res;
});

router.get('/api/product/:id', (ctx, next) => {
    let { id } = ctx.params;
    logger.info('Current Request id:', id);
    id = /([^_]+)/.exec(id + '');
    if (id == null) ctx.throw(404);
    id = id[0];
    if (
        !db
            .get('product')
            .has(id)
            .value()
    )
        id = 'p1000001';
    const ret = db
        .get('product')
        .get(id)
        .value();
    if (ret == undefined) ctx.throw(404);
    ctx.body = ret;
});

// common
router.get('/api/:domain', (ctx, next) => {
    const { domain } = ctx.params;
    logger.info('Current Request Params:', domain);
    const ret = db.get(domain).value();
    if (ret == undefined) ctx.status = 404;
    else ctx.body = ret;
});

router.get('/api/:domain/:type', (ctx, next) => {
    const { domain, type } = ctx.params;
    logger.info('Current Request Params2:', domain, type);
    const ret = db
        .get(domain)
        .get(type)
        .value();
    if (ret == undefined) ctx.status = 404;
    else ctx.body = ret;
});

router.get(/\.(js|css)$/, async (ctx, next) => {
    let filePath = ctx.path;
    if (/\/sw-register\.js/.test(filePath)) return await next();
    // if (/^\/mimg\//.test(filePath)) filePath = filePath.substr(1);
    filePath = path.resolve('../dist', filePath.substr(1));
    await next();
    if (ctx.status === 200||ctx.status === 304) {
        depTree.addDep(filePath, ctx.url);
    }
});

router.get('/mimg/:filename', async (ctx, next) => {
    const { filename } = ctx.params;
    const filepath = require.resolve(`../mimg/${filename}`);
    if (fs.existsSync(filepath)) {
        const stream = fs.createReadStream(filepath);
        const thumbnail = ctx.query.thumbnail;
        const ext = (path.extname(filepath) || '.jpg').substr(1);
        if (thumbnail) {
            const [width, height] = thumbnail.split('x');
            const quality = ctx.query.quality;
            ctx.body = image(stream, { width, height, quality });
        } else {
            ctx.body = image(stream);
        }
        ctx.type = `image/${ext}`;
        ctx.set('Cache-Control', 'public, max-age=31536000');
    } else {
        logger.error('Image not found:', filepath);
        await next();
    }
});

router.get(/(\.html|\/[\w-]*)$|\/sw-register/, async (ctx, next) => {
    // disable html and sw-register cache
    ctx.set('Cache-Control', 'private, no-cache, no-store');
    await next();
});
module.exports = router;
