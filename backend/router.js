const Router = require("koa-router");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("./data.json");
const db = low(adapter);

const router = new Router();

router.get("/home", (ctx, next) => {
  console.log('home');
  ctx.res.body = db.get("home").value();
  next();
});
router.get("/userInfo", (ctx, next) => {
    ctx.res.body = db.get("userInfo").value();
    next();
});
router.get("/manufacturers", (ctx, next) => {
    ctx.res.body = db.get("manufacturers").value();
    next();
});
router.get("/itemRecommend", (ctx, next) => {
    ctx.res.body = db.get("itemRecommend").value();
    next();
});
router.get("/cateList", (ctx, next) => {
    ctx.res.body = db.get("cateList").value();
    next();
});
router.get("/productDetail", (ctx, next) => {
    ctx.res.body = db.get("productDetail").value();
    next();
});
router.get("/section", (ctx, next) => {
    ctx.res.body = db.get("section").value();
    next();
});
router.get("/categoryCommodity", (ctx, next) => {
    ctx.res.body = db.get("categoryCommodity").value();
    next();
});
router.get("/commodityFormat", (ctx, next) => {
    ctx.res.body = db.get("commodityFormat").value();
    next();
});
router.get("/topicDetail", (ctx, next) => {
    ctx.res.body = db.get("topicDetail").value();
    next();
});

module.exports = router;
