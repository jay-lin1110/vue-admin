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

const UserSignup = () => import('@/views/user/user-signup')
const UserSignin = () => import('@/views/user/user-signin')
const NotFound = () => import('@/views/not-fonud')
const AdminHome = () => import('@/views/home')
const UserList = () => import('@/views/user/user-list')
const AuthorityList = () => import('@/views/authority/authority-list')
const RoleList = () => import('@/views/authority/role-list')

const Router = new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/user/signin'
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
      path: '/home',
      component: AdminHome,
      meta: {
        strTitle: '首页管理'
      },
      children: [
        {
          path: '/user',
          redirect: '/user/list'
        },
        {
          path: '/user/list',
          component: UserList,
          meta: {
            strTitle: '用户列表'
          }
        },
        {
          path: '/authority/list',
          component: AuthorityList,
          meta: {
            strTitle: '权限列表'
          }
        },
        {
          path: '/role/list',
          component: RoleList,
          meta: {
            strTitle: '角色列表'
          }
        }
      ]
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
