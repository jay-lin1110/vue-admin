import { TOKEN } from '@/config'
import {
  Storage,
  Axios
} from '@/utils'

const HttpPlugin = {
  install(Vue, options) {
    Vue.prototype.$http = Axios

    Vue.mixin({
      computed: {
        uploadUrl: () => `${Axios.defaults.baseURL}/upload`
      },
      methods: {
        setAuth: () => ({ Authorization: Storage.get(TOKEN) || '' })
      }
    })
  }
}

export default HttpPlugin
