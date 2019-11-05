import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// NavigationDuplicated导航重复
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const InitTest = () => import('@/components/init-test')
const NotFound = () => import('@/views/not-fonud')

const Router = new VueRouter({
  routes: [
    {
      path: '/',
      component: InitTest
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

export default Router
