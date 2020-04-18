import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import User from '../components/user/user.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import Cate from '../components/good/Cate.vue'
import Params from '../components/good/Params.vue'
import List from '../components/good/List.vue'
import Add from '../components/good/Add.vue'
import Order from "../components/order/Order.vue"
import Report from '../components/report/report.vue'
Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect:'/home/welcome',
    children:[
      {path:'/home/welcome',component:Welcome},
      {path:'/home/users',component:User},
      {path:'/home/rights',component:Rights},
      {path:'/home/roles',component:Roles},
      {path:'/home/categories',component:Cate},
      {path:'/home/params',component:Params},
      {path:'/home/goods',component:List},
      {path:'/home/goods/add',component:Add},
      {path:'/home/orders',component:Order},
      {path:'/home/reports',component:Report},
    ]
  }
]

const router = new VueRouter({
  routes
})

//导航守卫
router.beforeEach((to, _from, next) => {
  //to 将要访问的路径
  //from 代表从哪个路径跳转而来
  //next 是一个函数，表示放行
  // next()放行 next('/login') 强制跳转
  if (to.path == '/login') return next();
  const session = window.sessionStorage.getItem('token');
  if (!session) return next("/login");
  return next();
})

export default router