import PageTools from './PageTools'
import UploadExcel from './UploadExcel'
import ImageUpload from './ImageUpload'
import ScreenFull from './ScreenFull'
import ThemePicker from './ThemePicker'
import lang from './lang'
import TagsView from './TagsView'
export default {
  install(Vue) {
    Vue.component('PageTools', PageTools) // 注册工具栏组件
    Vue.component('UploadExcel', UploadExcel) // 注册导入excel组件
    Vue.component('ImageUpload', ImageUpload) // 注册图片上传组件
    Vue.component('ScreenFull', ScreenFull) // 注册全屏
    Vue.component('ThemePicker', ThemePicker) // 厌恶选择组件
    Vue.component('lang', lang) // 注册语言
    Vue.component('TagsView', TagsView) // 注册Tab页
  }
}
