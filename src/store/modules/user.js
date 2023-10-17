import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'
import { resetRouter } from '@/router/index'
// 状态
const state = {
  token: getToken(),
  userInfo: {}
}
// 修改状态
const mutations = {
  // 设置token
  setToken(state, token) {
    state.token = token // 设置token  只是修改state的数据  123 =》 1234
    // vuex变化 => 缓存数据
    setToken(token) // vuex和 缓存数据的同步
  },
  // 删除缓存
  removeToken(state) {
    state.token = null // 删除vuex的token
    removeToken() // 先清除 vuex  再清除缓存 vuex和 缓存数据的同步
  },

  // 存入用户信息
  setUserInfo(state, result) {
    state.userInfo = result // 响应式
  },
  // 删除用户信息
  removeUserInfo(state) {
    state.userInfo = {}
  }
}
// 执行异步
const actions = {
  // 定义login action  也需要参数 调用action时 传递过来的参数
  async login(context, data) {
    const result = await login(data) // 实际上就是一个promise  result就是执行的结果
    // axios默认给数据加了一层data
    context.commit('setToken', result)
    setTimeStamp()// 设置当前时间戳
  },
  async getUserInfo(context) {
    const result = await getUserInfo()
    // 获取用户详细信息
    const baseInfo = await getUserDetailById(result.userId)
    const baseReuslt = { ...result, ...baseInfo }
    // 此时result里面已经有userId
    context.commit('setUserInfo', baseReuslt) // 修改state中的用户资料
    return baseReuslt // 这里这句话 是伏笔 当下是用不上的 但是后期会用上 敬请期待
  },

  // 登出操作
  logout(context) {
    // 删除token
    context.commit('removeToken')// 不仅仅阐述了vuex中的，也删除了缓存中的
    // 删除用户资料
    context.commit('removeUserInfo')
    // 重置路由
    resetRouter()
    // 设置权限模块下的路由为初始状态
    // Vuex子模块怎么调用子模块 都没加锁的情况下可以随意调用
    // 因为不加命名空间的情况下 所有的mutations和actions都是挂载在全局上的 可以直接调用
    // 但是加了命名空间的子模块怎么调用另一个加了命名空间的子模块的mutation
    // 加了命名空间的context指的不是全局的context
    context.commit('permission/setRoutes', [], { root: true })
    // 子模块调用子模块的action 可以 将 commit的第三个参数 设置成  { root: true } 就表示当前的context不是子模块了 而是父模块
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
