import Vue from 'vue'
import {
  Button,
  Message,
  Loading
} from 'element-ui'

Vue.use(Button)
Vue.use(Loading.directive)

Vue.prototype.$loading = Loading.service
Vue.prototype.$message = Message
