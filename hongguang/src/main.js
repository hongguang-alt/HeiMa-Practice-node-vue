import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './emement/elementui'
import './assets/fonts/iconfont.css'
import './axios/base'
import './emement/otherui'

Vue.config.productionTip = false

Vue.filter('dateformat',function(origin){
  const dt = new Date(origin)
  const y = dt.getFullYear()
  const m = (dt.getMonth()+1+'').padStart(2,0)
  const d = (dt.getDate()+'').padStart(2,0)
  const hh = (dt.getHours()+'').padStart(2,0)
  const mm = (dt.getMinutes()+'').padStart(2,0)
  const ss = (dt.getSeconds()+'').padStart(2,0)

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
