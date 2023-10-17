<template>
  <el-dialog title="分配角色" :visible="showRoleDialog" @close="btnCancel">
    <el-checkbox-group v-model="roleIds">
      <!-- 要循环的选项 -->
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>
    <!-- 底部 -->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" type="primary" @click="btnOK">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRoleList } from '@/api/setting'
import { getUserDetailById } from '@/api/user'
import { assignRoles } from '@/api/employees'
export default {
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false
    },
    userId: {
      type: String,
      default: '',
      required: true
    }
  },
  data() {
    return {
      roleIds: [], // 负责存储当前数组所拥有的的ID
      list: []// 存储当前所有的角色对象
    }
  },
  created() {
    // 获取所有角色
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      const { rows } = await getRoleList({ page: 1, pagesize: 20 })// 默认只取十条数据
      this.list = rows
    },
    // 这个方法什么时候调用
    async getUserDetailById(id) {
      const { roleIds } = await getUserDetailById(id)
      this.roleIds = roleIds // 赋值本用户的角色
    },
    async btnOK() {
      try {
        await assignRoles({ id: this.userId, roleIds: this.roleIds })
        this.$emit('update:showRoleDialog', false)
        this.$message.success('设置角色成功')
      } catch (error) {
        console.log(error)
        this.$message.fail('设置角色失败')
      }
    },
    btnCancel() {
      this.roleIds = [] // 清空原来的数组
      this.$emit('update:showRoleDialog', false)
    }

  }
}
</script>

<style>

</style>
