// 获取首页的数据
import request from './request';

export const fetchHome = () => {
    const url = '/home';
    return request(url);
    // try {
    //   return request(url)
    // } catch (err) {
    //   console.log(err)
    //   return new Promise((resolve, reject) => {
    //     setTimeout(() => {
    //       resolve(JSON.parse(homeJSON))
    //     }, 1000)
    //   })
    // }
};

export const fetchUserInfo = username => {
    const url = `/user/${username}`;
    return request(url);
};

export const fetchManufacturers = () => {
    const url = '/manufacturers';
    return request(url);
};

export const fetchRecommendItems = () => {
    const url = '/itemRecommend';
    return request(url);
};

export const fetchAllNewItems = () => {
    const url = '/allNewItem';
    return request(url);
};

export const fetchCateList = () => {
    const url = '/cateList';
    return request(url);
};

export const fetchProduct = id => {
    const url = `/product/${id}`;
    return request(url);
};

export const fecthCategory = () => {
    const url = `/section`;
    return request(url);
};

export const fetchCategoryCommodity = () => {
    const url = '/categoryCommodity';
    return request(url);
};

export const fetchPinCommodity = () => {
    const url = '/pinCommodity';
    return request(url);
};

export const fetchCommodityFormat = () => {
    const url = '/commodityFormat';
    return request(url);
};

export const fetchTopicDetail = () => {
    const url = '/topicDetail';
    return request(url);
};

export const fetchLogin = (username, password) => {
    const url = '/login';
    return request(url, { data: { username, password }, method: 'post' });
};
export const fetchLoginState = username => {
    const url = '/islogin';
    return request(url, { params: { username } });
};
