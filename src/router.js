import Vue from 'vue'
import VueRouter from 'vue-router'
import { TOKEN } from '@/config'
import { Storage } from '@/utils'

Vue.use(VueRouter)

// NavigationDuplicated导航重复
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const InitTest = () => import('@/components/init-test')
const UserSignup = () => import('@/views/user/user-signup')
const UserSignin = () => import('@/views/user/user-signin')
const NotFound = () => import('@/views/not-fonud')

const Router = new VueRouter({
  routes: [
    {
      path: '/',
      component: InitTest
    },
    {
      path: '/user/signin',
      component: UserSignin,
      meta: {
        isPublic: true,
        strTitle: '用户登录'
      }
    },
    {
      path: '/user/signup',
      component: UserSignup,
      meta: {
        isPublic: true,
        strTitle: '用户注册'
      }
    },
    {
      path: '/404',
      component: NotFound,
      hidden: true,
      meta: {
        isPublic: true,
        strTitle: '404'
      }
    },
    {
      path: '*',
      redirect: '/404',
      hidden: true,
      meta: {
        isPublic: true,
        strTitle: '404'
      }
    }
  ]
})

Router.beforeEach((to, from, next) => {
  if (to.meta && to.meta.strTitle) {
    document.title = `${to.meta.strTitle} - OOCL管理系统`
  }
  if (!to.meta.isPublic && !Storage.get(TOKEN)) {
    next('/user/signin')
  }
  next()
})

export default Router
