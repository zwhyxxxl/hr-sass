// 专门处理权限路由的模块
import { constantRoutes, asyncRoutes } from '@/router/index'
const state = {
  // 开始拥有静态路由的权限
  routes: [...constantRoutes]// 路由表 当前用户用的所有路由的数组
}
const mutations = {
  // 修改routes的mutations
  // payload是登陆成功需要添加的新路由
  setRoutes(state, newRoutes) {
    state.routes = [...constantRoutes, ...newRoutes]
  }
}
const actions = {
  // 第二个参数为当前用户所拥有的权限
  // menus:['settings','permissions']
  filterRoutes(context, menus) {
    const routes = []
    // 筛选出动态路由中和menus能够对上的路由
    menus.forEach(key => {
      routes.push(...asyncRoutes.filter(item => {
        // console.log(item)
        return item.name === key
      }))
    })
    context.commit('setRoutes', routes)
    return routes // 这里为什么还要return  state数据 是用来 显示左侧菜单用的  return  是给路由addRoutes用的
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
