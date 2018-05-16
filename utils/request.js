import Axios from 'axios';

const axios = Axios.create({
    baseURL: 'https://you.keyin.me/api'
    // timeout: 1000
});

const checkStatus = res => {
    if (res.status >= 200 && res.status < 300) {
        return res;
    }
    const err = new Error(res.statusText);
    err.res = res;
    throw err;
};

const parseJSON = res => {
    return res.json();
};

const request = async (url, config = {}) => {
    try {
        const res = await axios.request({ url, ...config });
        checkStatus(res);
        return await res.data;
    } catch (err) {
        console.error('request failed with error:', err);
    }
};

export default request;
