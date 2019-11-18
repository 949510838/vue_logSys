import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// axios主要是用于向后台发起请求和qs序列化提交参数
import qs from 'qs'
import axios from 'axios'
import { baseUrl } from "../config/env"; //引入baseUrl 用于配置开发和上线的url
axios.defaults.timeout = 10000; //设置请求时间
axios.defaults.baseURL = baseUrl;
Vue.prototype.$baseURL = baseUrl; //把baseURL挂载到baseURL上，在页面中给非axios的请求使用
Vue.prototype.$http = axios //将axios挂载在vue的$http属性上
Vue.prototype.$qs = qs //axios的post请求需要设置'application/x-www-form-urlencoded'问题（jquery不需要），所以要用到qs序列化post提交参数（get提交不需要）
//axios.defaults.baseURL = '/sell' //通过axios发送请求时，自动在前面加上/sell，/sell代表开启的代理的域名和端口(配置在vue.config.js中)


import $ from 'jquery'
import "bootstrap"
import "bootstrap/dist/css/bootstrap.css"
import "./assets/icon/icon.css"


import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
