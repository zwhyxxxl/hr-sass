
import { Message } from 'element-ui'
// 导出一个axios的实例  而且这个实例要有请求拦截器 响应拦截器
import axios from 'axios'
const service = axios.create(
  { // 当执行npm run dev => .evn.development =>/api =>跨域代理
    baseURL: process.env.VUE_APP_BASE_API,
    setTimeout: 5000// 设置超时时间
  }
) // 创建一个axios的实例
service.interceptors.request.use() // 请求拦截器
service.interceptors.response.use(response => {
  const { success, message, data } = response.data
  if (success) {
    return data
  } else {
    Message.error(message)
    return Promise.reject(new Error(message))
  }
}, error => {
  Message.error(error.message)
  return Promise.reject(error)
}) // 响应拦截器
export default service // 导出axios实例
