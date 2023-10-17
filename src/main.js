import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import * as directives from '@/directives'
import CheckPermission from '@/mixin/checkPermission'
import '@/icons' // icon
import '@/permission' // permission control
import i18n from '@/lang'

import Component from '@/components'
Vue.use(Component) // 注册自己的插件

import Print from 'vue-print-nb'
Vue.use(Print)

import * as filters from '@/filters' // 引入工具类
// 注册全局的过滤器
Object.keys(filters).forEach((key) => {
  // 注册过滤器
  Vue.filter(key, filters[key])
})

// 全局混入检查对象
Vue.mixin(CheckPermission) // 所有的组件都拥有了一个检查的方法
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value) // t方法 会去对应的语言包寻找对应的内容
})
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)
// 全局导入自定义指令
Object.keys(directives).forEach((key) => {
  Vue.directive(key, directives[key])
})
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: (h) => h(App)
})
