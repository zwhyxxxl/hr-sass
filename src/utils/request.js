import { Message } from 'element-ui'
import store from '@/store'
import router from '@/router'
// 导出一个axios的实例  而且这个实例要有请求拦截器 响应拦截器
import axios from 'axios'
import { getTimeStamp } from '@/utils/auth'
const TimeOut = 3600 // 定义超时时间
const service = axios.create({
  // 当执行npm run dev => .evn.development =>/api =>跨域代理
  baseURL: process.env.VUE_APP_BASE_API,
  setTimeout: 5000 // 设置超时时间
}) // 创建一个axios的实例

service.interceptors.request.use(
  (config) => {
    // config是请求的信息
    if (store.getters.token) {
      if (checkTimeOut()) {
        // 如果它为true表示 过期了
        // token没用了 因为超时了
        store.dispatch('user/logout') // 登出操作
        // 跳转到登录页
        router.push('/login')
        return Promise.reject(new Error('token超时了'))
      }
      config.headers.Authorization = `Bearer ${store.getters.token}`
    }
    return config // 必须要返回
  },
  (error) => {
    return Promise.reject(error)
  }
) // 请求拦截器

service.interceptors.response.use(
  (response) => {
    const { success, message, data } = response.data
    if (success) {
      return data
    } else {
      Message.error(message)
      return Promise.reject(new Error(message))
    }
  },
  (error) => {
    // error 信息 里面 response的对象
    if (error.response && error.response.data && error.response.data.code === 10002) {
      // 当等于10002的时候 表示 后端告诉我token超时了
      store.dispatch('user/logout') // 登出action 删除token
      router.push('/login')
    } else {
      Message.error(error.message) // 提示错误信息
    }
    return Promise.reject(error)
  }
) // 响应拦截器
// 定义判断是否超时的函数
function checkTimeOut() {
  var timeStamp = getTimeStamp()
  var currentTime = Date.now()
  return (currentTime - timeStamp) / 1000 > TimeOut
}
export default service // 导出axios实例
