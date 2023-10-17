<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 放置内容 -->
      <el-card>
        <el-tabs>
          <el-tab-pane label="角色管理">
            <!-- 左侧内容 -->
            <el-row style="height:60px">
              <el-button size="small" icon="el-icon-plus" type="primary" @click="showDialog=true">新增角色</el-button>
            </el-row>
            <el-table border="" :data="list">
              <el-table-column align="center" label="序号" width="120" type="index" />
              <el-table-column align="center" label="角色名" width="240" prop="name" />
              <el-table-column align="center" label="描述" prop="description" />
              <el-table-column align="center" label="操作">
                <template slot-scope="{row}">
                  <el-button size="small" type="success" @click="assignPerm(row.id)">分配权限</el-button>
                  <el-button size="small" type="primary" @click="editRow(row.id)">编辑</el-button>
                  <el-button size="small" type="danger" @click="deleteRole(row.id)">删除</el-button>
                </template>

              </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <el-row type="flex" justify="center" align="middle" style="height:60px">
              <el-pagination layout="prev,pager,next" :total="page.total" :page-size="page.pagesize" :current-page="page.page" @current-change="changePage" />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息">
            <!-- 右侧内容 -->
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false" />
            <el-form label-width="120px" style="margin-top:50px" :model="formData">
              <el-form-item label="企业名称">
                <el-input v-model="formData.name" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formData.companyAddress" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="电话">
                <el-input v-model="formData.companyPhone" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formData.mailbox" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="formData.remarks" type="textarea" :rows="3" disabled style="width:400px" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <!-- 放置一个弹层组件 -->
    <el-dialog title="编辑部门" :visible="showDialog" @close="btnCancel">
      <el-form ref="roleForm" label-width="120px" :model="roleForm" :rules="rules">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" type="text" />
        </el-form-item>
        <el-form-item label="角色详情">
          <el-input v-model="roleForm.description" type="text" />
        </el-form-item>
        <!-- 放置footer插槽 -->
        <el-row type="flex" justify="center">
          <el-col :span="8">
            <el-button size="small" @click="btnCancel">取消</el-button>
            <el-button type="primary" size="small" @click="btnOK">确定</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
    <el-dialog :visible.sync="showPermDialog" title="分配权限" @close="btnPermCancel">
      <!-- 权限是一个树 -->
      <!-- 将数据绑定到组件上 -->
      <!-- check-strictly 在显示复选框的情况下，是否严格的遵循父子不互相关联的做法，默认为 false -->
      <el-tree
        ref="permTree"
        node-key="id"
        :default-checked-keys="selectCheck"
        :check-strictly="true"
        show-checkbox
        :data="permData"
        :props="defaultProps"
        :default-expand-all="true" />
      <!-- 确定取消 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button type="primary" size="small" @click="btnPermOK">确定</el-button>
          <el-button size="small" @click="btnPermCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, getCompanyInfo, deleteRole, getRoleDetail, updateRole, addRole, assignPerm } from '@/api/setting'
import { getPermissionList } from '@/api/permission'
import { mapGetters } from 'vuex'
import { tranListToTreeData } from '@/utils/index'
export default {
  data() {
    return {
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      },
      showDialog: false, // 控制弹层的现实
      roleForm: {
        description: '',
        name: ''
      },
      formData: {}, // 公司信息
      list: [], // 承接角色数据
      page: {
        // 放置页码和相关数据
        page: 1,
        pagesize: 10,
        total: 0// 记录综述
      },
      showPermDialog: false, // 控制分配权限的弹层
      permData: [], // 接受权限数据
      defaultProps: {
        label: 'name'
      }, // 定义显示字段的名称和子属性的名称
      roleId: null, // 记录当前分配权限的id
      selectCheck: []// 当前id所拥有的权限点记录
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  created() {
    this.getRoleList()
    this.getCompanyInfo()
  },
  methods: {
    // 获取数据
    async getRoleList() {
      const { total, rows } = await getRoleList(this.page)
      this.page.total = total
      this.list = rows
    },
    changePage(newPage) {
      // newPage是当前点击的页码
      this.page.page = newPage
      this.getRoleList()
    },
    // 获取的公司的信息
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.companyId)
    },
    // 删除角色
    async deleteRole(id) {
      try {
        await this.$confirm('确认删除该角色吗？')
        await deleteRole(id)
        // 重新加载数据
        this.getRoleList()
        this.$message.success('删除角色成功')
      } catch (error) {
        console.log(error)
      }
    },
    // 编辑角色信息
    async editRow(id) {
      this.roleForm = await getRoleDetail(id)
      this.showDialog = true
    },
    // 提交修改
    async btnOK() {
      try {
        await this.$refs.roleForm.validate()
        if (this.roleForm.id) {
          // 编辑
          await updateRole(this.roleForm)

          this.$message.success('操作成功')
        } else {
          // 新增
          await addRole(this.roleForm)
        }
        this.getRoleList()
        this.showDialog = false
      } catch (error) {
        console.log(error)
      }
    },
    btnCancel() {
      this.roleForm = {
        name: '',
        description: ''
      }
      // 移除校验规则
      this.$refs.roleForm.resetFields()
      this.showDialog = false
    },
    /**
     * 弹出设置权限
    */
    async assignPerm(id) {
      // 获取权限点数据
      const data = await getPermissionList()
      this.permData = tranListToTreeData(data, '0')
      this.roleId = id
      // 获取这个id有的权限
      const { permIds } = await getRoleDetail(id)
      // console.log(permIds)
      this.selectCheck = permIds
      this.showPermDialog = true
    },
    async  btnPermOK() {
      // 调用el-tree的方法
      // console.log(this.$refs.permTree.getCheckedKeys())
      await assignPerm({ permIds: this.$refs.permTree.getCheckedKeys(), id: this.roleId })
      this.$message.success('分配权限成功')
      this.showPermDialog = false
    },
    btnPermCancel() {
      this.selectCheck = [] // 重置数据
      this.showPermDialog = false
    }
  }

}
</script>

<style>

</style>
