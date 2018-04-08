<template>
    <div class="page">
        <div class="navbar">
            <div class="bar-left-item"></div>
            <div class="bar-title"></div>
            <div class="bar-right-item">
                <a href="/search" class="">
                    <i class="search"></i>
                </a>
                <a href="/cart" class="">
                    <i class="cart"></i>
                </a>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'topbar-skeleton'
    };
</script>

<style lang="scss" scoped>
    @import '~@/assets/styles/mixin.scss';
    .navbar {
        position: fixed;
        top: 0;
        left: 0;
        width:100%;
        background-color: #fafafa;
        height: px2rem(44);
        z-index: 99;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid $border_color;
        padding: 0 px2rem(8) 0 px2rem(12);
    }

    .bar-left-item,
    .bar-right-item i {
        display: inline-block;
        width: px2rem(32);
        height: px2rem(32);
        display: inline-block;
        background-repeat: no-repeat;
        background-size: px2rem(86) px2rem(348);
    }

    .bar-left-item {
        width: px2rem(25);
        height: px2rem(25);
        background-image: url('https://gbzhu.cn/mimg/hd-s73530eadc0-9757196115.png');
        background-position: 0 px2rem(-127);
    }

    .bar-left-item-toggle {
        background-position: 0 px2rem(-157);
    }

    .bar-title {
        width: px2rem(86);
        height: px2rem(27);
        background: url('https://gbzhu.cn/mimg/hd-s73530eadc0-9757196115.png') no-repeat;
        background-position: 0 px2rem(-95);
        background-size: cover;
    }

    .bar-right-item .search {
        background-image: url('https://gbzhu.cn/mimg/hd-s73530eadc0-9757196115.png');
        background-position: 0 px2rem(-287);
    }

    .bar-right-item .cart {
        background-image: url('https://gbzhu.cn/mimg/hd-s73530eadc0-9757196115.png');
        background-position: 0 0;
        position: relative;
        margin-right: px2rem(10);
    }
</style>

