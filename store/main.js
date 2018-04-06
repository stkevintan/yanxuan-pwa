import * as TYPES from '@/constant/types';
import Vue from 'vue';
import {
    saveShowCommodityDetail,
    savCartCommodityrToLocalStorage,
    saveShowCartCommodity,
    getCartCommodityFromLocalStorage
} from '@/utils/storage';
import { getShowCommodityDetail, getShowCartCommodity } from '@/utils/storage';

export const state = () => ({
    userInfo: null,
    cartList: [],
    removeCartList: [],
    cartIsEdit: false,
    currentCartCommodity: getShowCartCommodity(),
    showCommodityDetail: getShowCommodityDetail(),
    selectFormat: {},
    vBottomTabBar: true
});

export const getters = {
    // 购物车的商品数量
    cartCommodityCount: state => {
        const totalCount = state.cartList.reduce((total, commodity) => {
            return total + Number(commodity.count);
        }, 0);
        return totalCount;
    },
    removeCommodityCount: state => {
        const totalCount = state.removeCartList.reduce((total, commodity) => {
            return total + Number(commodity.count);
        }, 0);
        return totalCount;
    }
};

// 用户信息 // 购物车的商品 // 点击选择规格的商品 // 选好规格，未加入到购物车
export const actions = {
    getCartCommodity({ commit }) {
        // TODO: 判断是否登录，登录的从服务器获取数据，否则直接从本地获取
        commit(TYPES.SETCARTCOMMODITY, getCartCommodityFromLocalStorage());
    },
    addToCart({ commit }, commodity) {
        commit(TYPES.ADDTOCART, commodity);
    },
    showCommodityDetail({ commit }, commodity) {
        commit(TYPES.SHOWCOMMODITYDETAIL, commodity);
    },
    changeSelectFormat({ commit }, data) {
        commit(TYPES.CHANGESELECTFORMAT, data);
    },
    selectCartCommodity({ commit }, commodity) {
        // TODO: 判断是否登录，登录的发送请求
        commit(TYPES.SELECTCARTCOMMODITY, commodity);
    },
    selectAllCartCommodity({ commit }) {
        commit(TYPES.SELECTALLCARTCOMMODITY);
    },
    getRemoveCartCommodity({ commit }, commodity) {
        commit(TYPES.GETREMOVECARTCOMMODITY, commodity);
    },
    removeCartCommodity({ commit }, commodities) {
        commit(TYPES.REMOVECARTCOMMODITY, commodities);
    },
    selectRemoveAllCartCommodity({ commit }, selected = false) {
        commit(TYPES.SELECTREMOVEALLCARTCOMMODITY, selected);
    },
    changeCartCommodity({ commit }, data) {
        console.log(data);
    },
    pushToCartFormat({ commit }, commodity) {
        commit(TYPES.PUSTCARTFORMAT, commodity);
    },
    changeCartEdit({ commit }, edit) {
        commit(TYPES.CHANGECARTEDIT, edit);
    },
    changeRemoveCartCommodity({ commit }, changeData) {
        commit(TYPES.CHANGEREMOVECARTCOMMODITY, changeData);
    },
    resetCartCommodity({ commit }) {
        commit(TYPES.RESETCARTCOMMODITY);
    },
    finishEditCartCommodity({ commit }) {
        commit(TYPES.FINISHEDITCARTCOMMODITY);
    },
    toggleBottomTabBar({ commit }, target) {
        commit(TYPES.TOGGLEBOTTOMTABBAR, target);
    }
};

export const mutations = {
    [TYPES.TOGGLEBOTTOMTABBAR](state, target) {
        state.vBottomTabBar = target;
    },
    [TYPES.ADDTOCART](state, commodity) {
        const count = commodity.count;
        const pId = commodity.pId;
        // 返回在数组中的索引。返回-1，不包含
        const newCartIndex = state.cartList.findIndex(cart => {
            return (
                cart.pId === pId && cart.selectString === commodity.selectString
            );
        });
        if (newCartIndex === -1) {
            const cartCommodity = {
                pId: pId,
                title: commodity.title,
                price: commodity.price,
                pic: commodity.pic,
                selected: true,
                count: count,
                formats: commodity.formats,
                selectString: commodity.selectString
            };
            state.cartList.push(cartCommodity);
        } else {
            state.cartList[newCartIndex].count += count;
        }
        state.cartCommodityCount += count;
        savCartCommodityrToLocalStorage(state.cartList);
    },
    [TYPES.REMOVEFROMCART](state, data) {},
    [TYPES.CHANGESELECTFORMAT](state, data) {
        // 以新对象替换老对象使用使用前一种方法无效
        // state.selectFormat[data.pId] = data.format
        state.selectFormat = Object.assign({}, state.selectFormat, {
            [data.pId]: {
                format: data.format,
                count: data.count
            }
        }); // { ...state.selectFormat, [data.pId]: { format: data.format, count: data.count } }
    },
    [TYPES.SHOWCOMMODITYDETAIL](state, commodity) {
        state.showCommodityDetail = commodity;
        saveShowCommodityDetail(commodity);
    },
    [TYPES.SETCARTCOMMODITY](state, commodities) {
        state.cartList = commodities;
    },
    [TYPES.SELECTCARTCOMMODITY](state, commodity) {
        const index = state.cartList.indexOf(commodity);
        if (index === -1) return;
        //设置对象的属性。如果对象是响应式的，确保属性被创建后也是响应式的，同时触发视图更新。这个方法主要用于避开 Vue 不能检测属性被添加的限制。
        Vue.set(state.cartList, index, {
            ...commodity,
            selected: !commodity.selected
        });
    },
    [TYPES.SELECTALLCARTCOMMODITY](state) {
        // 全选 => 全不选。 一个或一个以上选择 => 全选
        const selectCount = state.cartList.filter(c => c.selected).length;
        if (selectCount === state.cartList.length) {
            const newCartList = state.cartList.map(c => {
                return Object.assign({}, c, { selected: false });
            });
            state.cartList = newCartList;
        } else {
            const newCartList = state.cartList.map(c => {
                return Object.assign({}, c, { selected: true });
            });
            state.cartList = newCartList;
        }
    },
    [TYPES.GETREMOVECARTCOMMODITY](state, commodity) {
        const index = state.removeCartList.indexOf(commodity);
        if (index === -1) {
            state.removeCartList.push(commodity);
        } else {
            state.removeCartList.splice(index, 1);
        }
    },
    [TYPES.SELECTREMOVEALLCARTCOMMODITY](state, selected) {
        if (!selected) {
            state.removeCartList = [];
        } else {
            console.log('cart list: ', state.cartList);
            state.removeCartList = Object.assign([], state.cartList);
        }
    },
    [TYPES.REMOVECARTCOMMODITY](state, commodities) {
        let cartCommodities = Object.assign([], state.cartList);
        let removeCartList = Object.assign([], state.removeCartList);
        commodities.forEach((c, i) => {
            const index = cartCommodities.indexOf(c);
            cartCommodities.splice(index, 1);
            const removeIndex = removeCartList.indexOf(c);
            removeCartList.splice(removeIndex, 1);
        });
        state.cartList = cartCommodities;
        state.removeCartList = removeCartList;
        savCartCommodityrToLocalStorage(cartCommodities);
    },
    [TYPES.PUSTCARTFORMAT](state, commodity) {
        state.currentCartCommodity = commodity;
        saveShowCartCommodity(commodity);
    },
    [TYPES.CHANGECARTEDIT](state, edit) {
        state.cartIsEdit = edit;
    },
    [TYPES.CHANGEREMOVECARTCOMMODITY](state, changeData) {
        const currentCartCommodity = state.currentCartCommodity;
        const newCommodity = Object.assign(
            {},
            currentCartCommodity,
            changeData
        );
        const index = state.cartList.indexOf(currentCartCommodity);
        const removeIndex = state.removeCartList.indexOf(currentCartCommodity);
        Vue.set(state.cartList, index, newCommodity);
        removeIndex >= 0 && Vue.set(state.removeCartList, index, newCommodity);
        state.currentCartCommodity = newCommodity;
        saveShowCartCommodity(newCommodity);
    },
    [TYPES.RESETCARTCOMMODITY](state) {
        state.cartList = getCartCommodityFromLocalStorage();
    },
    [TYPES.FINISHEDITCARTCOMMODITY](state) {
        savCartCommodityrToLocalStorage(state.cartList);
    }
};
