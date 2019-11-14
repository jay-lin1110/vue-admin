<template>
  <div>
    <!-- breadcrumb area -->
    <el-breadcrumb separator-class="el-icon-d-arrow-right">
      <el-breadcrumb-item>
        <el-tag type="danger" effect="dark" color="#e25061">用户管理</el-tag>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        <el-tag type="danger" effect="dark" color="#e25061">用户列表</el-tag>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <!-- card area -->
    <el-card class="box-card">
      <el-row class="d-flex">
        <!-- search input area -->
        <el-col :span="12">
          <el-input
            class="input-with-select w-100"
            placeholder="请输入内容"
            clearable
            v-model.trim.lazy="objSearch.strSearch"
            @keyup.enter.native="searchBy"
            @clear="getTable"
          >
            <template #prepend>
              <el-select v-model="objSearch.strSelect" style="width: 10rem;">
                <el-option
                  v-for="item in objSearch.searchOptions"
                  :key="item.value"
                  :label="item.lable"
                  :value="item.value"
                ></el-option>
              </el-select>
            </template>
            <template #append>
              <el-button icon="el-icon-search" @click.stop="searchBy"></el-button>
            </template>
          </el-input>
        </el-col>
        <!-- add user area -->
        <el-col :span="12" class="text-right">
          <el-button type="primary" icon="el-icon-plus" round @click.stop="handleCreate()">新建用户</el-button>
        </el-col>
      </el-row>
      <!-- user table -->
      <el-row class="mt-3">
        <el-table :data="tableData" height="333" class="w-100" highlight-current-row stripe>
          <el-table-column label="序号" align="center" width="70">
            <template #default="{row}">
              <span>{{ setIndex(row) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" width="180" align="center">
            <template #default="{ row }">
              <el-tooltip placement="top" :enterable="false">
                <template #content>
                  <i class="el-icon-time"></i>
                  <span class="ml-1">{{ row.createdAt | formatTime }}</span>
                </template>
                <div>
                  <i class="el-icon-time"></i>
                  <span class="ml-1">{{ row.createdAt | formatTime('YYYY-MM-DD') }}</span>
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="邮箱" prop="email" align="center"></el-table-column>
          <el-table-column label="姓名" prop="username" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template #default="{$index, row}">
              <el-button
                size="small"
                type="primary"
                icon="el-icon-edit"
                @click="handleEdit($index, row)"
              >编辑</el-button>
              <el-button
                size="small"
                type="danger"
                icon="el-icon-delete"
                @click="handleDelete($index, row)"
              >删除</el-button>
              <el-button
                size="small"
                type="warning"
                icon="el-icon-setting"
                @click="handleAuthorize(row)"
              >授权</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- pagination area -->
        <el-pagination
          class="mt-3"
          background
          :total="pagination.numTotal"
          :current-page="pagination.numCurrentPage"
          :page-sizes="pagination.arrPageSizes"
          :page-size="pagination.numPageSize"
          :layout="pagination.strLayout"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-row>
    </el-card>
    <!-- add user diglog area -->
    <el-dialog
      :visible.sync="isVisible"
      :close-on-click-modal="false"
      :show-close="false"
      @close="resetForm('dialogForm')"
    >
      <template #title>
        <el-breadcrumb separator-class="el-icon-d-arrow-right">
          <el-breadcrumb-item>
            <el-tag type="danger" effect="dark" color="#e25061">用户管理</el-tag>
          </el-breadcrumb-item>
          <el-breadcrumb-item>
            <el-tag type="danger" effect="dark" color="#e25061">用户列表</el-tag>
          </el-breadcrumb-item>
          <el-breadcrumb-item v-if="dialogType === 'create'">
            <el-tag type="danger" effect="dark" color="#e25061">新建用户</el-tag>
          </el-breadcrumb-item>
          <el-breadcrumb-item v-else>
            <el-tag type="danger" effect="dark" color="#e25061">编辑用户</el-tag>
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
        <el-form-item prop="email">
          <el-input
            prefix-icon="el-icon-message"
            v-model="objForm.email"
            name="email"
            type="email"
            placeholder="请输入邮箱"
          />
        </el-form-item>

        <el-form-item prop="username">
          <el-input
            prefix-icon="el-icon-user"
            v-model="objForm.username"
            name="username"
            type="text"
            placeholder="请输入用户名"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            type="password"
            prefix-icon="el-icon-lock"
            v-model="objForm.password"
            name="password"
            placeholder="请输入密码"
          />
        </el-form-item>
      </el-form>
      <template #footer class="dialog-footer">
        <el-button type="primary" @click.stop="submitForm('dialogForm')">确 定</el-button>
        <el-button type="danger" @click.stop="closeDialog('dialogForm')">取 消</el-button>
      </template>
    </el-dialog>
    <el-dialog
      :visible.sync="isAuth"
      :close-on-click-modal="false"
      :show-close="false"
      @close="resetForm('authForm')"
    >
      <template #title>
        <el-breadcrumb separator-class="el-icon-d-arrow-right">
          <el-breadcrumb-item>
            <el-tag type="danger" effect="dark" color="#e25061">用户管理</el-tag>
          </el-breadcrumb-item>
          <el-breadcrumb-item>
            <el-tag type="danger" effect="dark" color="#e25061">用户列表</el-tag>
          </el-breadcrumb-item>
          <el-breadcrumb-item>
            <el-tag type="danger" effect="dark" color="#e25061">用户授权</el-tag>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </template>
      <el-form
        ref="authForm"
        :model="authForm"
        status-icon
        hide-required-asterisk
        label-position="left"
        label-width="80px"
        @submit.native.prevent
      >
        <el-form-item label="用户名称" prop="username">
          <el-input prefix-icon="el-icon-user" v-model="authForm.username" disabled />
        </el-form-item>

        <el-form-item label="当前角色" prop="currentRole">
          <el-input prefix-icon="el-icon-lock" v-model="authForm.currentRole" disabled />
        </el-form-item>
        <el-form-item label="用户授权" prop="role">
          <el-select v-model="authForm.role" placeholder="请选择角色" clearable>
            <el-option
              v-for="item in roleOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer class="dialog-footer">
        <el-button type="primary" @click.stop="setRole()">确 定</el-button>
        <el-button type="danger" @click.stop="closeAuth()">取 消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUsers,
  deleteUser,
  signUp,
  getUserById,
  putUser,
  patchUser
} from '@/api/user'
import { getRoles } from '@/api/role'
import { CODE_OK } from '@/config'

export default {
  data() {
    return {
      objSearch: {
        strSearch: '',
        strSelect: 'username',
        searchOptions: [
          {
            lable: '用户邮箱',
            value: 'email'
          },
          {
            lable: '用户名称',
            value: 'username'
          },
          {
            lable: '用户ID',
            value: 'id'
          }
        ]
      },
      arrData: [], // user data
      tableData: [], // table data limited by page
      arrFliter: [], // filter data
      pagination: {
        numCurrentPage: 1,
        arrPageSizes: [5, 10, 50, 100],
        numPageSize: 1,
        strLayout: 'total, sizes, prev, pager, next, jumper',
        numTotal: 0
      },
      isAuth: false,
      roleOptions: [],
      authForm: {
        username: '',
        currentRole: '',
        role: ''
      },
      isVisible: false,
      dialogType: '',
      objForm: {
        username: '',
        email: '',
        password: ''
      },
      objRule: {
        email: [
          {
            required: true,
            message: '邮箱不能为空！QAQ',
            trigger: 'blur'
          },
          {
            type: 'email',
            message: '邮箱格式不正确！QAQ',
            trigger: 'blur'
          }
        ],
        username: [
          {
            required: true,
            message: '用户名不能为空！QAQ',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 20,
            message: '用户名长度在1到20个字符之间！QAQ',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '密码不能为空！QAQ',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 20,
            message: '用户名长度在3到20个字符之间！QAQ',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // init table data
    async getTable() {
      try {
        const { code, data } = await getUsers()
        if (code !== CODE_OK) {
          this.$message.error('查询用户失败!QAQ')
          return false
        }
        this.arrFliter = this.arrData = data
        this.setPagination()
      } catch (error) {
        console.log(error)
      }
    },
    // set table row index
    setIndex(row) {
      return this.arrData.findIndex(item => item._id === row._id) + 1
    },
    // handle edit operation
    handleCreate() {
      this.dialogType = 'create'
      this.openDialog()
    },
    // handle edit operation
    async handleEdit(index, row) {
      this.dialogType = 'edit'
      const { data } = await getUserById(row._id)
      this.objForm = { ...this.objForm, ...data }
      this.openDialog()
    },
    // open auth dialog and init role
    async handleAuthorize(row) {
      const { data } = await getRoles()
      const currentUser = this.arrData.find(item => item.id === row.id)
      const { username, role: currentRole } = currentUser
      this.authForm = {
        username,
        currentRole: currentRole ? currentRole.name : ''
      }
      this.roleOptions = data
      this.isAuth = true
    },
    // close auth dialog
    closeAuth() {
      this.isAuth = false
    },
    async setRole() {
      try {
        const currentUser = this.arrData.find(
          item => item.username === this.authForm.username
        )
        const { id, username, email } = currentUser
        const data = {
          username,
          email,
          role: this.authForm.role
        }
        const params = {
          id,
          data
        }
        const { code } = await patchUser(params)
        if (code !== CODE_OK) {
          return this.$message.error('授权失败！QAQ')
        }
        this.$message.success('授权成功！=。=')
        this.getTable()
        this.closeAuth()
      } catch (error) {
        console.log('error===>' + error.message)
      }
    },
    // handle delete operation
    async handleDelete(index, row) {
      try {
        const result = await this.$confirm(
          `确定删除${row.username}?`,
          '温馨提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).catch(error => error)
        if (result !== 'confirm') {
          return this.$message('取消删除!=。=')
        }
        const { code } = await deleteUser(row._id)
        if (code !== CODE_OK) {
          return this.$message.error('删除失败!QAQ')
        }
        this.$message.success('删除成功!=。=')
        this.getTable()
      } catch (error) {
        console.log('error===>' + error)
      }
    },
    // handle search operation by keyword
    searchBy() {
      if (!this.objSearch.strSelect) {
        return this.$message.warning('请先选择搜索条件!QAQ')
      }
      if (!this.objSearch.strSearch) {
        return this.$message.warning('请输入搜索内容!QAQ')
      }
      this.arrData = this.arrFliter.filter(
        item => item[this.objSearch.strSelect].match(this.objSearch.strSearch)
        // item[this.objSearch.strSelect].includes(this.objSearch.strSearch)
      )
      this.setPagination()
    },
    // init first page
    setPagination() {
      this.pagination.numTotal = this.arrData.length
      this.pagination.numPageSize = 5
      this.pagination.numCurrentPage = 1

      this.tableData = this.arrData.filter(
        (item, index) => index < this.pagination.numPageSize
      )
    },
    // handle size change operation
    handleSizeChange(pageSize) {
      this.pagination.numCurrentPage = 1
      this.pagination.numPageSize = pageSize

      this.tableData = this.arrData.filter(
        (item, index) => index < this.pagination.numPageSize
      )
    },
    // handle current page change operation
    handleCurrentChange(numCurrentPage) {
      const index = this.pagination.numPageSize * (numCurrentPage - 1)
      const data = this.pagination.numPageSize * numCurrentPage
      const table = []
      for (let i = index; i < data; i++) {
        if (this.arrData[i]) {
          table.push(this.arrData[i])
        }
      }
      this.tableData = table
    },
    // submit form
    async submitForm(formName) {
      try {
        const valid = await this.$refs[formName].validate()
        if (!valid) {
          return this.$message.error('表单格式不正确！QAQ')
        }
        if (this.dialogType === 'create') {
          const { code } = await signUp(this.objForm)
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
          const { code } = await putUser(params)
          if (code !== CODE_OK) {
            return this.$message.error('修改失败！QAQ')
          }
          this.$message.success('修改成功！=。=')
        }
        this.getTable()
        this.closeDialog()
      } catch (error) {
        console.log('error===>' + error.message)
      }
    },
    // reset form
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.authForm = this.objForm = {}
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
    this.getTable()
  }
}
</script>

<style lang="scss" scoped>
</style>
