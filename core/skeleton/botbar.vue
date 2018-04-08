Formatted HTML:
<template>
<div class="page">
   <div class="tabbar">
      <div class="tabbar-item">
         <div class="tabbar-item-icon" style="background-position-y:-3.33333rem;"></div>
         <span>首页</span>
      </div>
      <div class="tabbar-item">
         <div class="tabbar-item-icon" style="background-position-y: -4.66667rem;"></div>
         <span>专题</span>
      </div>
      <div class="tabbar-item">
         <div class="tabbar-item-icon" style="background-position-y: -2rem;">
            <!---->
         </div>
         <span>分类</span>
      </div>
      <div class="tabbar-item">
         <div class="tabbar-item-icon" style="background-position-y: -0.666667rem;">
         </div>
         <span>购物车</span>
      </div>
      <div class="tabbar-item">
         <div class="tabbar-item-icon" style="background-position-y: -6rem;">
            <!---->
         </div>
         <span>个人</span>
      </div>
   </div>
</div>
</template>

<script>
export default {
  name: 'botbar-skeleton'
};
</script>

<style lang="scss" scoped>
@import '~@/assets/styles/mixin.scss';
html,
body {
  height: 100%;
}
.tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: px2rem(49);
  flex: 0 0 auto;
  background-color: #fafafa;
  border-top: 1px solid $border_color;
  display: flex;
  flex-direction: row;
  z-index: 99;
}
.tabbar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.tabbar-item-icon {
  width: px2rem(20);
  height: px2rem(20);
  background: url('~@/assets/images/tabbar.png') no-repeat 0 0;
  background-size: cover;
  position: relative;
}
.tabbar-item span {
  margin-top: px2rem(3.5);
  color: $text_color;
  font-size: px2rem($size_small);
}
</style>
