import router from '@/router'
import store from '@/store'
import nprogress from 'nprogress'
const whiteList = ['/404', '/login']
// 路由的前置守卫
router.beforeEach((to, from, next) => {
  nprogress.start()
  if (store.getters.token) {
    if (to.path === '/login') {
      next('/')
    } else {
      next()
    }
  } else {
    if (whiteList.indexOf(to.path) > -1) {
      next()
    } else {
      next('/login')
    }
  }
  nprogress.done()
})
// 路由的后置守卫
router.afterEach(() => {
  nprogress.done()
})
