import Vue from 'vue'
import '@/assets/css/index.scss'
import '@/assets/css/common.css'
import './plugins/element'
import App from './App'
import router from './router'
import store from './store'
import Axios from '@/utils/request'
import * as Filters from '@/filters'

// 自定义全局过滤器
Object.keys(Filters).forEach((key) => {
  Vue.filter(key, Filters[key])
})

Vue.prototype.$http = Axios

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
