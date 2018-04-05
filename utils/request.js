import axios from "axios";

const _request = axios.create({
  baseURL: "https://gbzhu.cn/api", 
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

const request = async (url, params = {}) => {
    try {
        const res = await _request.get(url, { params });
        checkStatus(res);
      return await res.data;
    } catch (err) {
        console.error("request failed with error:", err);
    }
};

export default request;
