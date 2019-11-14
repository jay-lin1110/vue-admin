<template>
  <div>
    <table-list
      :prop-bread="breadOptions"
      :prop-search="searchOptions"
      :prop-data="arrData"
      :prop-column="columnOptions"
      @get-data="getData"
      @handle-edit="handleEdit"
      @handle-create="handleCreate"
      @handle-delete="handleDelete"
    ></table-list>
    <!-- diglog area -->
    <el-dialog
      :visible.sync="isVisible"
      :close-on-click-modal="false"
      :show-close="false"
      @close="resetForm('dialogForm')"
    >
      <template #title>
        <el-breadcrumb separator-class="el-icon-d-arrow-right">
          <el-breadcrumb-item>
            <el-tag type="danger" effect="dark" color="#e25061">权限管理</el-tag>
          </el-breadcrumb-item>
          <el-breadcrumb-item>
            <el-tag type="danger" effect="dark" color="#e25061">权限列表</el-tag>
          </el-breadcrumb-item>
          <el-breadcrumb-item v-if="dialogType === 'create'">
            <el-tag type="danger" effect="dark" color="#e25061">新建权限</el-tag>
          </el-breadcrumb-item>
          <el-breadcrumb-item v-else>
            <el-tag type="danger" effect="dark" color="#e25061">编辑权限</el-tag>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </template>
      <el-form
        ref="dialogForm"
        :model="objForm"
        :rules="objRule"
        status-icon
        hide-required-asterisk
        label-position="left"
        @submit.native.prevent
      >
        <el-form-item>
          <el-select v-model="objForm.parent" placeholder="请选择上级权限" @change="changeParent">
            <el-option-group v-for="group in parentOptions" :key="group.label" :label="group.label">
              <el-option
                v-for="item in group.options"
                :key="item.id"
                :label="item.name"
                :value="item.id"
                :disabled="item.disabled"
              ></el-option>
            </el-option-group>
          </el-select>
        </el-form-item>

        <el-form-item prop="name">
          <el-input
            prefix-icon="el-icon-message"
            v-model="objForm.name"
            name="name"
            type="text"
            placeholder="请输入权限名称"
          />
        </el-form-item>

        <el-form-item>
          <el-select v-model="objForm.level" placeholder="请选择等级" @change="changeLevel" clearable>
            <el-option
              v-for="item in levelOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer class="dialog-footer">
        <el-button type="primary" @click.stop="submitForm('dialogForm')">确 定</el-button>
        <el-button type="danger" @click.stop="closeDialog('dialogForm')">取 消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import TableList from '@/components/table-list/index'
import {
  getAuthorities,
  getAuthorityById,
  postAuthority,
  putAuthority,
  deleteAuthority
} from '@/api/authority'
import { CODE_OK } from '@/config'

export default {
  components: {
    TableList
  },
  data() {
    return {
      breadOptions: {
        menu1: '权限管理',
        menu2: '权限列表'
      },
      searchOptions: {
        conditions: [
          {
            lable: '权限名称',
            value: 'name'
          },
          {
            lable: '权限ID',
            value: 'id'
          },
          {
            lable: '权限等级',
            value: 'level'
          }
        ],
        createType: '新建权限'
      },
      columnOptions: {
        createdAt: {
          label: '创建时间',
          icon: 'el-icon-time',
          type: 'time'
        },
        name: {
          label: '权限名称',
          icon: 'el-icon-time',
          type: 'tag'
        },
        level: {
          label: '权限等级',
          icon: 'el-icon-time'
        }
      },
      arrData: [],
      isVisible: false,
      dialogType: '',
      levelList: [
        {
          label: '等级一',
          value: '1'
        },
        {
          label: '等级二',
          value: '2'
        },
        {
          label: '等级三',
          value: '3'
        }
      ],
      levelOptions: [
        {
          label: '等级一',
          value: '1'
        },
        {
          label: '等级二',
          value: '2'
        },
        {
          label: '等级三',
          value: '3'
        }
      ],
      parentOptions: [
        {
          label: '一级权限',
          options: []
        },
        {
          label: '二级权限',
          options: []
        }
      ],
      objForm: {
        name: '',
        level: ''
      },
      objRule: {
        name: [
          {
            required: true,
            message: '权限名称不能为空！QAQ',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 20,
            message: '权限名称长度在1到20个字符之间！QAQ',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // handle level change event and set parentOptions
    changeLevel(level) {
      this.parentOptions[0].options = this.parentOptions[0].options.map(
        item => {
          if (item.level >= level) {
            item.disabled = true
          } else {
            item.disabled = false
          }
          return item
        }
      )
      this.parentOptions[1].options = this.parentOptions[1].options.map(
        item => {
          if (item.level >= level) {
            item.disabled = true
          } else {
            item.disabled = false
          }
          return item
        }
      )
    },
    // handle parent change event and set levelOptions
    changeParent(id) {
      const { level } = this.arrData.find(item => item.id === id)
      this.levelOptions = this.levelList.map(item => {
        if (item.value <= level) {
          item.disabled = true
        } else {
          item.disabled = false
        }
        return item
      })
    },
    // init table data
    async getData() {
      try {
        const { code, data } = await getAuthorities()
        if (code !== CODE_OK) {
          this.$message.error('获取权限数据失败!QAQ')
          return false
        }
        this.arrData = data
        this.parentOptions[0].options = this.arrData.filter(
          item => item.level === '1'
        )
        this.parentOptions[1].options = this.arrData.filter(
          item => item.level === '2'
        )
      } catch (error) {
        console.log(error)
      }
    },
    // handle edit operation
    handleCreate() {
      this.dialogType = 'create'
      this.openDialog()
    },
    // handle edit operation
    async handleEdit(row) {
      this.dialogType = 'edit'
      const { data } = await getAuthorityById(row._id)
      this.objForm = { ...this.objForm, ...data }
      this.openDialog()
    },
    // handle delete operation
    async handleDelete(row) {
      try {
        const result = await this.$confirm(`确定删除${row.name}?`, '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(error => error)
        if (result !== 'confirm') {
          return this.$message('取消删除!=。=')
        }
        const { code } = await deleteAuthority(row._id)
        if (code !== CODE_OK) {
          return this.$message.error('删除失败!QAQ')
        }
        this.$message.success('删除成功!=。=')
        this.getData()
      } catch (error) {
        console.log('error===>' + error)
      }
    },
    // submit form
    async submitForm(formName) {
      try {
        const valid = await this.$refs[formName].validate()
        if (!valid) {
          return this.$message.error('表单格式不正确！QAQ')
        }
        if (this.dialogType === 'create') {
          const { code } = await postAuthority(this.objForm)
          if (code !== CODE_OK) {
            return this.$message.error('添加失败！QAQ')
          }
          this.$message.success('添加成功！=。=')
        }
        if (this.dialogType === 'edit') {
          const params = {
            id: this.objForm._id,
            data: this.objForm
          }
          const { code } = await putAuthority(params)
          if (code !== CODE_OK) {
            return this.$message.error('修改失败！QAQ')
          }
          this.$message.success('修改成功！=。=')
        }
        this.getData()
        this.closeDialog(formName)
      } catch (error) {
        console.log('error===>' + error.message)
      }
    },
    // reset forma
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.objForm = {
        name: '',
        level: ''
      }
      this.levelOptions = [
        {
          label: '等级一',
          value: '1'
        },
        {
          label: '等级二',
          value: '2'
        },
        {
          label: '等级三',
          value: '3'
        }
      ]
      this.getData()
    },
    // open dialog
    openDialog() {
      this.isVisible = true
    },
    // close Dialog
    closeDialog(formName) {
      this.isVisible = false
    }
  },
  created() {
    this.getData()
  }
}
</script>

<style lang="scss" scoped>
</style>
