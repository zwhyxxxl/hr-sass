// 负责管理所有的自定义指令
export const imagerror = {
  // 指令对象 会在当前的dom元素插入到节点之后执行
  inserted(dom, options) {
    // options是 指令中的变量的解释  其中有一个属性叫做 value
    // dom 表示当前指令作用的dom对象
    // dom认为此时就是图片
    // 当图片有地址 但是地址会没有加载成功的时候 会报错 触发图片的一个事件 => onerror
    dom.src = dom.src || options.value
    dom.onerror = () => {
      // 当图片出现异常的时候 会将指令配置的默认图片设置为该图片的内容
      // dom可以注册error事件
      dom.src = options.value // 这里不能写死
    }
  },
  // 也是一个钩子函数 会在当前指令作用的组件更新数据完毕执行
  // inserted只会执行一次
  // 组件初始化之后，一旦更新就不会再进去inserted。会进入componentUpdated
  componentUpdated(dom, options) {
    dom.src = dom.src || options.value
  }
}
