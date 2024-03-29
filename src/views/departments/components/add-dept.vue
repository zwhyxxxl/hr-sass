<template>
  <!-- 新增部门的弹层 -->
  <el-dialog :title="showTitle" :visible="showDialog" @close="btnCancel">
    <!-- 表单数据 -->
    <el-form ref="deptForm" label-width="120px" :model="formData" :rules="rules">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>

      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>

      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="formData.manager" style="width:80%" placeholder="请选择" @focus="getEmployeeSimple">
          <el-option v-for="item in peoples" :key="item.id" :value="item.username" :label="item.username" />
        </el-select>
      </el-form-item>

      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formData.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <!-- 确定和取消 -->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" @click="btnCancel">取消</el-button>
        <el-button size="small" type="primary" @click="btnOK">确定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
import { getDepartments, addDepartments, getDepartDetail, updateDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object,
      default: null
    }
  },
  data() {
    // 检查部门名称是否重复发
    const checkNameRepeat = async(rule, value, callback) => {
      // value是部门名称，要和同级部门下的部门比较，有没有相同的

      const { depts } = await getDepartments()
      let isRepeat = false
      if (this.formData.id) {
        // 编辑模式
        // 我的名字不能和其他的同级部门的名字进行重复
        // 首先找到同级部门
        isRepeat = depts.filter(item => item.pid === this.formData.pid && item.id !== this.treeNode.id).some(item => item.name === value)
      } else {
        // 新增模式
        // 找同级部门下有没有和value相同的数据
      // 找到所有的子部门
        isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
      }

      isRepeat ? callback(new Error(`同级部门下已经存在${value}部门`)) : callback()
    }
    const checkCodeRepeat = async(rule, value, callback) => {
      // value是部门名称，要和所有部门下比较，有没有相同的
      const { depts } = await getDepartments()
      let isRepeat = false
      if (this.formData.id) {
        // 编辑模式
        isRepeat = depts.filter(item => item.id !== this.formData.id).some(item => item.code === value && value)
      } else {
        // 新增模式
        // 找同级部门下有没有和value相同的数据
        // 找到所有的子部门
        isRepeat = depts.some(item => item.code === value && value)
      }

      isRepeat ? callback(new Error(`组织架构下下已经存在${value}编码了`)) : callback()
    }
    return {
      formData: {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      },
      rules: {
        name: [{ required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称长度为1-50个字符', trigger: 'blur' },
          { trigger: 'blur',
            validator: checkNameRepeat }],
        code: [{ required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码长度为1-50个字符', trigger: 'blur' },
          { trigger: 'blur',
            validator: checkCodeRepeat }
        ],
        manager: [{ required: true, message: '部门负责人不能为空', trigger: 'blur' }],
        introduce: [{ required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门介绍长度为1-300个字符', trigger: 'blur' }]

      }, // 校验规则
      peoples: []
    }
  },
  computed: {
    showTitle() {
      return this.formData.id ? '编辑部门' : '新增子部门'
    }
  },
  methods: {
    async getEmployeeSimple() {
      this.peoples = await getEmployeeSimple()
    },
    // 获取详情方法
    async getDepartDetail(id) {
      this.formData = await getDepartDetail(id)
    },
    btnOK() {
      this.$refs.deptForm.validate(async isOK => {
        if (isOK) {
          // 传递数据
          if (this.formData.id) {
            // 编辑
            await updateDepartments(this.formData)
          } else {
            await addDepartments({ ...this.formData, pid: this.treeNode.id })
          }
          this.$emit('addDepts')
          this.$emit('update:showDialog', false)
          // 关闭dialog的时候 会触发el-dialog的close时间 去调用banCancel
        }
      })
    },
    btnCancel() {
      // 重置数据 resetFields只能重置表单上的数据
      this.formData = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
      this.$emit('update:showDialog', false)
      this.$refs.deptForm.resetFields() // 重置校验字段
    }
  }
}
</script>
<style>

</style>
