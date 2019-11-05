import Axios from 'axios'
import { Message } from 'element-ui'
import Router from '@/router'
import {
  TOKEN,
  UNAUTHORIZED
} from '@/config'
import {
  Storage,
  Loading
} from '@/utils'

const Service = Axios.create({
  baseURL: process.env.VUE_APP_BASEURL
  // baseURL: 'http://localhost:3000'
  // timeout: 5000
})

Service.interceptors.request.use((config) => {
  Loading.start()
  if (Storage.get(TOKEN)) {
    config.headers.Authorization = Storage.get(TOKEN)
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

Service.interceptors.response.use((response) => {
  Loading.end()
  const { data } = response
  return data
}, (error) => {
  Loading.end()

  const { status, data } = error.response
  if (data.message) {
    Message.error(data.message)
  }
  if (status === UNAUTHORIZED) {
    Storage.remove(TOKEN)
    Message.error('token失效，请重新登录！QAQ')
    Router.push('/user/signin')
  }

  return Promise.reject(error)
})

export default Service
