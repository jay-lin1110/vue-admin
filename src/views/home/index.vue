<template>
  <el-container class="home_contaniner h-100">
    <!-- 顶栏 -->
    <el-header class="bg-primary" style="padding: 0;">
      <home-header @set-account="openDrawer"></home-header>
    </el-header>
    <el-container>
      <el-aside :width="!isCollapse ? '200px' : '64px'" class="bg-dark">
        <home-aside @set-width="setWidth"></home-aside>
      </el-aside>
      <el-main class="bg-grey">
        <router-view />
        <el-drawer
          title="个人设置"
          :visible.sync="isVisible"
          direction="rtl"
          custom-class="demo-drawer"
          :wrapperClosable="false"
          :show-close="false"
          :size="'35%'"
          ref="drawer"
        >
          <div class="demo-drawer__content pr-3 pl-3">
            <el-form
              ref="drawerForm"
              :model="objForm"
              :rules="objRule"
              status-icon
              hide-required-asterisk
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
            <div class="demo-drawer__footer ml-3">
              <el-button type="danger" @click.stop="closeDrawer('drawerForm')">取 消</el-button>
              <el-button type="primary" @click.stop="submitForm('drawerForm')">确 定</el-button>
            </div>
          </div>
        </el-drawer>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { CODE_OK } from '@/config'
import { putUser } from '@/api/user'
import { mapGetters } from 'vuex'
import HomeHeader from './components/home-header'
import HomeAside from './components/home-aside'

export default {
  components: {
    HomeHeader,
    HomeAside
  },
  data() {
    return {
      isCollapse: false,
      isVisible: false,
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
      },
      formLabelWidth: '80px'
    }
  },
  computed: {
    ...mapGetters(['user'])
  },
  methods: {
    // set aside width
    setWidth(isCollapse) {
      this.isCollapse = isCollapse
    },
    // open drawer
    openDrawer() {
      this.objForm = { ...this.objForm, ...this.user }
      console.log(this.objForm)
      this.isVisible = true
    },
    // close drawer
    closeDrawer(formName) {
      this.resetForm(formName)
      this.isVisible = false
    },
    // set personal account
    async submitForm1() {},
    async submitForm(formName) {
      try {
        const valid = await this.$refs[formName].validate()
        if (!valid) {
          return this.$message.error('表单格式不正确！QAQ')
        }
        const params = {
          id: this.objForm._id,
          data: this.objForm
        }
        const { code } = await putUser(params)
        if (code !== CODE_OK) {
          return this.$message.error('修改失败！QAQ')
        }
        this.$message.success('修改成功！=。=')
        this.resetForm(formName)
        this.$refs.drawer.closeDrawer()
      } catch (error) {
        console.log('error===>' + error.message)
      }
    },
    // reset form
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
