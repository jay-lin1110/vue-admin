import { TOKEN } from '@/config'
import {
  Storage
} from '@/utils'

const UploadMixin = {
  // 文件上传的服务器
  computed: {
    uploadUrl() { // $_UploadMixin_uploadUrl
      return `${this.$http.defaults.baseURL}/upload`
    }
  },
  // 图片上传api设置请求头的方法
  methods: {// $_UploadMixin_setAuth
    setAuth: () => ({ Authorization: Storage.get(TOKEN) || '' })
  }
}

export {
  UploadMixin
}
