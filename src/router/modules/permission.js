// 员工的路由规则
import Layout from '@/layout'
export default {
  // 路由规则
  path: '/permission', // 路由地址
  name: 'permissions', // 给模块的一级路由加一个name属性，这个属性后面做权限的时候会用到
  component: Layout,
  children: [{
    // 二级路由的path什么都不写的时候，表示二级路由的默认路由
    path: '', // 这里不用写，表示/employess不但有布局Layout还有员工主页
    name: 'permissions',
    component: () => import('@/views/permission'),
    // 路由元信息，存储数据的地方 可以放任何内容
    meta: {
      title: '权限管理', // 左侧导航读取了这里的title属性
      icon: 'lock'
    }
  }]
}
