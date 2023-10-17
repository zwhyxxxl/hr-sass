// 做一个混入对象
import store from '@/store'
export default {
  // 混入对象是组件的选项对象
  methods: {
    // key是要检查的点
    checkPermission(key) {
      // 去用户的信息里找points中有没有key 如果有则认为有权限 如果没有则没有权限
      const { userInfo } = store.state.user
      if (userInfo.roles && userInfo.roles.points.length) {
        return userInfo.roles.points.some(item => item === key)
      }
      return false
    }
  }
}
