<template>
  <div class="carousel-container">
    <div class="carousel-swiper" ref="swiper" v-on:click="onPicClick" v-on:touchmove="handleMove" v-on:touchend="handleEnd" v-on:touchstart="handleStart">
      <img class="carousel-img" v-for="i in queue" v-lazy="pics[i]" :key="i" />
    </div>
    <div v-if="!hideIndicator" class="carousel-indicator-container">
      <span v-bind:class="['carousel-indicator', index === queue[1] && 'indicator-current']" v-for="(item, index) in pics"></span>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Vue from 'vue';
export default {
  props: {
    pics: Array,
    hideIndicator: {
      default: false,
      type: Boolean
    },
    onPicChange: {
      type: Function,
      default: () => {}
    },
    onPicClick: {
      type: Function,
      default: index => {
        console.log('click pic at index: ', index);
      }
    }
  },
  data() {
    return {
      animationDuration: 2500,
      lastPosition: 0,
      queue: [0, 1, 2],
      timeId: 0,
      dragFrom: 0,
      dragDelta: 0
    };
  },
  created() {},
  mounted() {
    this.$watch(
      'queue',
      () => {
        this.onPicChange(this.queue[1]);
      },
      {
        immediate: true
      }
    );
    this.animate(0);
    this.initAnimate();
  },
  beforeDestroy() {
    clearTimeout(this.timeId);
  },
  methods: {
    normalize(index) {
      return (index + this.pics.length) % this.pics.length;
    },
    handleEnd(e) {
      const width = this.$el.clientWidth;
      // 大于是左
      if (this.dragDelta > width / 3) {
        this.turn(this.dragDelta, -1);
      } else if (this.dragDelta < -width / 3) {
        this.turn(-this.dragDelta, 1);
      } else {
        this.animate(600);
      }
      this.initAnimate();
    },
    handleStart(e) {
      clearTimeout(this.timeId);
      this.dragFrom = e.targetTouches[0].clientX;
    },
    handleMove(e) {
      const current = e.touches[0].clientX;
      const width = this.$el.clientWidth;
      const delta = current - this.dragFrom;
      this.dragDelta = delta;
      if (Math.abs(delta) >= width) {
        this.dragDelta = width;
        return;
      }
      this.animate(0, delta - width);
    },
    initAnimate() {
      var startAnim = () => {
        this.timeId = setTimeout(() => {
          const width = this.$el.clientWidth;
          this.turn(width, 1);
          startAnim.call(this);
        }, this.animationDuration);
      };
      startAnim();
    },
    animate(duration, offsetX = -this.$el.clientWidth) {
      const transition =
        duration > 0
          ? `transition: transform ${duration}ms linear`
          : `transition:none`;
      if (this.$refs.swiper) {
        this.$refs.swiper.style = `${transition}; transform:translateX(${offsetX}px);`;
      }
    },

    /**
     * @param delta time
     * @param direction -1:left, 1:right
     */
    turn(delta, direction = 1) {
      const width = this.$el.clientWidth;
      const offsetX = direction < 0 ? 0 : -2 * width;
      const duration = delta / width * 300;
      this.animate(duration, offsetX);
      setTimeout(() => {
        if (direction < 0) {
          this.queue.unshift(this.normalize(this.queue[0] - 1));
          this.queue.pop();
        } else {
          this.queue.push(this.normalize(this.queue[2] + 1));
          this.queue.shift();
        }
        this.animate(0);
      }, duration);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~@/assets/styles/mixin.scss';
.carousel-container {
  position: relative;
  overflow: hidden;
  width: 100%;
  // height: px2rem(200);
  flex: 1;
}

.carousel-swiper {
  height: 100%;
  white-space: nowrap;
  font-size: 0;
  transition: transform 600ms linear;
}

.carousel-img {
  display: inline-block;
  width: 100%;
  height: 100%;
}

.carousel-link img {
  width: 100%;
  height: 100%;
}

.carousel-indicator-container {
  position: absolute;
  bottom: px2rem(15);
  text-align: center;
  width: 100%;
  z-index: 9;
}

.carousel-indicator {
  background-color: #fff;
  display: inline-block;
  width: px2rem(20);
  height: px2rem(2);
  margin-right: px2rem(5);
  opacity: 0.6;
}

.indicator-current {
  opacity: 1;
}
</style>
