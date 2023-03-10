import Taro from '@tarojs/taro';
import { axios } from 'taro-axios';

export interface ApiData {
  code: number,
  data: any,
  message: string
}

const service = axios.create({
  baseURL: 'http://localhost:3000',
  // withCredentials: true,
  timeout: 60000
});

service.interceptors.request.use(
  config => {
    const token = Taro.getStorageSync('token');
    if (token !== null && token !== "") {
      config.headers.Authorization = `Bearer ${token}`;
    } 
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
// respone拦截器
service.interceptors.response.use(
  response => {
    const res = response.data;
    if (res.status && res.status !== 200) {
      return Promise.reject(res || "error");
    }
    return Promise.resolve(res);
  },
  error => {
    return Promise.reject(error);
  }
);

export default service;