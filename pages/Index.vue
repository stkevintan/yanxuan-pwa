<template>
  <div id="main">
    <router-view class="content"></router-view>
    <tabbar :items="items" />
  </div>
</template>

<script>
function setState(store) {}
import tabbar from "@/components/tabbar";
export default {
  name: "index",
  metaInfo: {
    title: "网易严选",
    titleTemplate: "%s - 以严谨的态度，为中国消费者甄选天下优品",
    meta: [
      { name: "keywords", content: "网易严选,严选,电子商务,网购,居家,厨房,饮食,甄选家,有态度,一流制造商,匠心打造,源头把控,绿色,安全,舒适,健康,品质,严格甄选,出口品质" },
      { name: "description", content: "网易严选秉承网易一贯的严谨态度，深入世界各地，严格把关所有商品的产地、工艺、原材料，甄选居家、厨房、饮食等各类商品，力求给你最优质的商品。" }
    ]
  },
  async asyncData({ store, route }) {
    setState(store);
  },
  components: {
    tabbar
  },
  computed: {
    items() {
      const barItems = [
        {
          title: "首页",
          icon: `-${125 / 37.5}rem`,
          selectedIcon: `-${100 / 37.5}rem`,
          to: "/home"
        },
        {
          title: "专题",
          icon: `-${175 / 37.5}rem`,
          selectedIcon: `-${150 / 37.5}rem`,
          to: "/topic"
        },
        {
          title: "分类",
          icon: `-${75 / 37.5}rem`,
          selectedIcon: `-${50 / 37.5}rem`,
          to: "/category"
        },
        {
          title: "购物车",
          icon: `-${25 / 37.5}rem`,
          selectedIcon: "0px",
          to: "/cart",
          badge: this.$store.getters['main/cartCommodityCount']
        },
        {
          title: "个人",
          icon: `-${225 / 37.5}rem`,
          selectedIcon: `-${200 / 37.5}rem`,
          to: "/profile"
        }
      ];
      return barItems;
    }
  }
};
</script>

<style lang="scss" scoped>
  #main {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
  }

  .content {
    flex: 1;
  }
</style>
