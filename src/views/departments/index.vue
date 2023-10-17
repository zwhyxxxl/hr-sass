<template>
  <div v-loading="loading" class="dashboard-container">
    <div class="app-container">
      <!-- 组织架构的内容 -->
      <!-- 头部 -->
      <el-card class="tree-card">
        <!-- 结构内容 -->
        <TreeTools :tree-node="company" :is-root="true" @addDepts="addDepts" />
        <!-- 放置一个el-tree -->
        <el-tree :data="departs" :props="defaultProps" :default-expand-all="true">
          <!-- 传入内容 插槽内容  插槽内容会循环多次，有多少节点就循环多少次-->
          <!-- slot-scoped='obj' 接收传递给插槽的数据 data是每个节点的数据对象-->
          <TreeTools slot-scope="{ data }" :tree-node="data" @addDepts="addDepts" @delDepts="getDepartments" @editDepts="editDepts" />
        </el-tree>
      </el-card>
    </div>
    <AddDept ref="addDept" :show-dialog.sync="showDialog" :tree-node="node" @addDepts="getDepartments" />
  </div>
</template>

<script>
import TreeTools from './components/tree-tools'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils/index'
import AddDept from './components/add-dept.vue'
export default {
  components: {
    TreeTools,
    AddDept
  },
  data() {
    return {
      node: null, // 记录当前点击的节点
      showDialog: false,
      company: { },
      departs: [],
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      loading: false
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    async getDepartments() {
      this.loading = true
      try {
        const data = await getDepartments()
        this.company = { name: data.companyName, manager: '负责人', id: '' }
        this.departs = tranListToTreeData(data.depts, '')
        console.log(data)
      } catch (error) {
        console.log(error)
      }
      this.loading = false
    },
    addDepts(node) {
      this.showDialog = true // 显示弹层
      // 因为node是当前的点击的部门， 此时这个部门应该记录下来,
      this.node = node
    },
    editDepts(node) {
      this.showDialog = true
      this.node = node
      this.$refs.addDept.getDepartDetail(node.id)
    }
  }
}
</script>

<style scoped>
.tree-card{
  padding: 30px  140px;
  font-size:14px;
}
</style>
