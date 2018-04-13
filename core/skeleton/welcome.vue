<template>
    <div class="skeleton-wrapper">
        <img src="data:image/jpeg;base64,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">
        <div class="toplight"></div>
    </div>
</template>

<script>

export default {
    name: 'welcome-skeleton'
};
</script>

<style lang="scss" scoped>
@import '~@/assets/styles/mixin.scss';
@keyframes toplight-frame{
    0%{
        transform: skew(-20deg) translateX(-#{px2rem(70)});
    }

    100%{
        transform: skew(-20deg) translateX(#{px2rem(70)});
    }
}

.skeleton-wrapper{
    img{
        width: px2rem(96);
        height: px2rem(96);
        position: absolute;
        top: 50%;
        left: 50%;
        margin: -#{px2rem(48)} 0 0 -#{px2rem(48)};
}
    .toplight{
        width: px2rem(20);
        height: px2rem(100);
        position: absolute;
        left: 50%;
        top: 50%;
        margin: -#{px2rem(50)} 0 0 -#{px2rem(10)};
        background-color: rgba(255,255,255,.5);
        animation: 1s toplight-frame infinite;
    }
}
</style>
