<template>
  <div>
    <table-list
      :prop-bread="breadOptions"
      :prop-search="searchOptions"
      :prop-data="arrData"
      :is-expand="isExpand"
      :is-auth="isAuth"
      :prop-column="columnOptions"
      @get-data="getData"
      @handle-edit="handleEdit"
      @handle-create="handleCreate"
      @handle-delete="handleDelete"
      @handle-authorize="handleAuthorize"
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
            <el-tag type="danger" effect="dark" color="#e25061">角色管理</el-tag>
          </el-breadcrumb-item>
          <el-breadcrumb-item v-if="dialogType === 'create'">
            <el-tag type="danger" effect="dark" color="#e25061">角色列表</el-tag>
          </el-breadcrumb-item>
          <el-breadcrumb-item v-if="dialogType === 'create'">
            <el-tag type="danger" effect="dark" color="#e25061">新建角色</el-tag>
          </el-breadcrumb-item>
          <el-breadcrumb-item v-else>
            <el-tag type="danger" effect="dark" color="#e25061">编辑角色</el-tag>
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
        <el-form-item prop="name">
          <el-input
            prefix-icon="el-icon-message"
            v-model="objForm.name"
            name="name"
            type="text"
            placeholder="请输入角色名称"
          />
        </el-form-item>

        <el-form-item>
          <el-select v-model="objForm.level" placeholder="请选择等级" clearable>
            <el-option
              v-for="item in levelOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer class="dialog-footer">
        <el-button type="primary" @click.stop="submitForm('dialogForm')">确 定</el-button>
        <el-button type="danger" @click.stop="closeDialog('dialogForm')">取 消</el-button>
      </template>
    </el-dialog>
    <el-dialog
      :visible.sync="isTree"
      :close-on-click-modal="false"
      :show-close="false"
      @close="resetTree"
    >
      <template #title>
        <el-breadcrumb separator-class="el-icon-d-arrow-right">
          <el-breadcrumb-item>
            <el-tag type="danger" effect="dark" color="#e25061">权限管理</el-tag>
          </el-breadcrumb-item>
          <el-breadcrumb-item>
            <el-tag type="danger" effect="dark" color="#e25061">角色列表</el-tag>
          </el-breadcrumb-item>
          <el-breadcrumb-item>
            <el-tag type="danger" effect="dark" color="#e25061">角色授权</el-tag>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </template>
      <el-tree
        ref="refTree"
        :data="authorityTree"
        :props="treeProps"
        :node-key="'id'"
        :default-checked-keys="defaultKeys"
        show-checkbox
        default-expand-all
      ></el-tree>
      <template #footer class="dialog-footer">
        <el-button type="primary" @click.stop="setAuthority">确 定</el-button>
        <el-button type="danger" @click.stop="closeTree">取 消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import TableList from '@/components/table-list/index'
import {
  getRoles,
  getRoleById,
  postRole,
  putRole,
  deleteRole
} from '@/api/role'
import { getAuthorities } from '@/api/authority'
import { CODE_OK } from '@/config'

export default {
  components: {
    TableList
  },
  data() {
    return {
      breadOptions: {
        menu1: '角色管理',
        menu2: '角色列表'
      },
      searchOptions: {
        conditions: [
          {
            lable: '角色名称',
            value: 'name'
          },
          {
            lable: '角色ID',
            value: 'id'
          },
          {
            lable: '角色等级',
            value: 'level'
          }
        ],
        createType: '新建角色'
      },
      isExpand: true,
      isAuth: true,
      columnOptions: {
        createdAt: {
          label: '创建时间',
          icon: 'el-icon-time',
          type: 'time'
        },
        name: {
          label: '角色名称',
          icon: 'el-icon-time',
          type: 'tag'
        },
        level: {
          label: '角色等级',
          icon: 'el-icon-time'
        }
      },
      arrData: [],
      isVisible: false,
      isTree: false,
      authorityTree: [],
      treeProps: {
        children: 'children',
        label: 'name'
      },
      role: {},
      defaultKeys: [],
      dialogType: '',
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
      objForm: {
        name: '',
        level: ''
      },
      objRule: {
        name: [
          {
            required: true,
            message: '角色名称不能为空！QAQ',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 20,
            message: '角色名称长度在1到20个字符之间！QAQ',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // init table data
    async getData() {
      try {
        const { code, data } = await getRoles()
        if (code !== CODE_OK) {
          this.$message.error('获取角色数据失败!QAQ')
          return false
        }
        this.arrData = data
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
      const { data } = await getRoleById(row._id)
      this.objForm = { ...this.objForm, ...data }
      this.openDialog()
    },
    // handle authorize operation
    async handleAuthorize(row) {
      const { data: role } = await getRoleById(row._id)
      this.defaultKeys = [
        ...role.authorities
          .filter(item => item.level === '3')
          .map(item => item.id)
      ]
      const { data: authorityTree } = await getAuthorities()
      this.authorityTree = authorityTree.filter(item => item.level === '1')
      this.role = { ...this.role, ...role }
      this.isTree = true
    },
    // edit authorities
    async setAuthority() {
      const authorities = [
        ...this.$refs.refTree.getCheckedKeys(),
        ...this.$refs.refTree.getHalfCheckedKeys()
      ]
      const { id, name, level } = this.role
      const data = {
        name,
        level,
        authorities
      }
      const params = {
        id,
        data
      }
      const { code } = await putRole(params)
      if (code !== CODE_OK) {
        return this.$message.error('授权失败！QAQ')
      }
      this.$message.success('授权成功！=。=')
      this.getData()
      this.closeTree()
    },
    closeTree() {
      this.isTree = false
    },
    // reset defaultKeys
    resetTree() {
      this.defaultKeys = []
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
        const { code } = await deleteRole(row._id)
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
          const { code } = await postRole(this.objForm)
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
          const { code } = await putRole(params)
          if (code !== CODE_OK) {
            return this.$message.error('修改失败！QAQ')
          }
          this.$message.success('修改成功！=。=')
        }
        this.getData()
        this.closeDialog()
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
    },
    // open dialog
    openDialog() {
      this.isVisible = true
    },
    // close Dialog
    closeDialog() {
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
