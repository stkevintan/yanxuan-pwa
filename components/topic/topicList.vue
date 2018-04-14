<template>
  <div class="topic-list">
     <router-link class="topic-list-item dl" to="/cate-list/0">
      <img v-lazy="'https://ols1thqnl.qnssl.com/assets/dinglei.jpg'" />
      <p>丁磊私物推荐</p>
    </router-link>
    <router-link class="topic-list-item yx" to="/cate-list/1">
      <img v-lazy="'https://ols1thqnl.qnssl.com/assets/yanxuan.jpg'" />
      <p>严选推荐</p>
    </router-link>
    <router-link class="topic-list-item txs" to="/cate-list/2">
      <img v-lazy="'https://ols1thqnl.qnssl.com/assets/tuijianshi.png'" />
      <p>挑选师推荐</p>
    </router-link>
    <router-link class="topic-list-item mx" to="/cate-list/3">
      <img v-lazy="'https://ols1thqnl.qnssl.com/assets/mingxing.png'" />
      <p>明星商品</p>
    </router-link>
  </div>
</template>

<style lang="scss" scoped>
@import '~@/assets/styles/mixin.scss';
.topic-list {
  height: px2rem(96);
  // width: 100%;
  margin-bottom: px2rem(10);
  background-color: #fff;
  white-space: nowrap;
  overflow-x: auto;
  padding: px2rem(10) px2rem(15);
  display: relative;
}

.topic-list-item {
  position: relative;
  display: inline-block;
  width: px2rem(136);
  height: px2rem(76);
  margin-right: px2rem(10);
  border-radius: px2rem(4);
  overflow: hidden;
  img {
    position: relative;
    width: 100%;
    height: 100%;
  }
  p {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    color: #fff;
    height: px2rem(76);
    text-align: center;
    line-height: px2rem(76);
    font-size: px2rem($size_middle);
  }
}
</style>
