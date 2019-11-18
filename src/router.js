import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      components: {default:Home,},    //页面多个router-view视图   //component: Home, //页面单个路由视图
      children: [
        {
          path: 'logList',
          name: 'logList',
          //路由懒加载，用到的时候再加载
          component: () => import(/* webpackChunkName: "about" */ './views/logList.vue')
        },
        {
          path: 'deleteLog',
          name: 'deleteLog',
          component: () => import('./views/deleteLog.vue')
        }
      ]
    },
    
  ]
})
