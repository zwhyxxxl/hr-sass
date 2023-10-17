// import router from '@/router'
// import store from '@/store'
// import nprogress from 'nprogress'
// const whiteList = ['/404', '/login']
// // 路由的前置守卫
// router.beforeEach(async(to, from, next) => {
//   nprogress.start()
//   if (store.getters.token) {
//     if (to.path === '/login') {
//       next('/')
//     } else {
//       if (!store.getters.userId) {
//         // async函数return的内容用await可以接收到
//         const { roles } = await store.dispatch('user/getUserInfo')
//         // 筛选用户的可用路由
//         const routes = await store.dispatch('permission/filterRoutes', roles.menus)// routes就是筛选得到的动态路由
//         // console.log(routes)
//         // 把动态路由添加到路由表中 默认的路由表只有静态路由
//         // addRoutes必须用next(地址) 不能用next()
//         router.addRoutes([...routes, { path: '*', redirect: '/404', hidden: true }])// 添加动态路由到路由表
//         // 添加完动态路由之后
//         next(to.path)// 跳到对应的地址 相当于多做一次跳转
//       } else {
//         next()
//       }
//     }
//   } else {
//     if (whiteList.indexOf(to.path) > -1) {
//       next()
//     } else {
//       next('/login')
//     }
//   }
//   nprogress.done()
// })
// // 路由的后置守卫
// router.afterEach(() => {
//   // 进度条
//   nprogress.done()
// })
