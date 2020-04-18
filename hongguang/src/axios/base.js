import Nprogress from 'nprogress'
import axios from 'axios';
import Vue from 'vue';
import 'nprogress/nprogress.css'
Vue.prototype.$http = axios;
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';


axios.interceptors.request.use(config => {
    Nprogress.start();
    // 在发送请求之前做些什么
    config.headers.Authorization = window.sessionStorage.getItem('token');
    return config;
  });

  axios.interceptors.response.use(config => {
    Nprogress.done();
    return config;
  });
