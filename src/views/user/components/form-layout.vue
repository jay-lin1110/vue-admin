<template>
  <div class="layout_container">
    <el-form
      ref="userForm"
      :model="objForm"
      :rules="objRule"
      class="form_container"
      status-icon
      hide-required-asterisk
      label-position="left"
      @submit.native.prevent
    >
      <h3 class="title">
        <slot name="header">OOCL后台管理系统</slot>
      </h3>

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
          :type="strType"
          prefix-icon="el-icon-lock"
          v-model="objForm.password"
          name="password"
          placeholder="请输入密码"
          @keyup.enter.native="submitForm('userForm')"
        />
        <span class="show-pwd" @click="showPwd">
          <i class="el-icon-view"></i>
        </span>
      </el-form-item>

      <el-form-item v-if="formType === 'signup'" prop="checkPass">
        <el-input
          prefix-icon="el-icon-lock"
          v-model="objForm.checkPass"
          type="password"
          placeholder="请确认密码"
          @keyup.enter.native="submitForm('userForm')"
        />
      </el-form-item>

      <el-form-item>
        <el-button
          v-if="formType === 'signin'"
          type="danger"
          style="width:100%;"
          native.type="submit"
          @click.native.prevent="submitForm('userForm')"
        >登录</el-button>
        <el-button
          v-else
          type="danger"
          style="width:100%;"
          native.type="submit"
          @click.native.prevent="submitForm('userForm')"
        >注册</el-button>
      </el-form-item>

      <div class="form_footer">
        <slot name="footer">
          <el-link v-if="formType === 'signin'" type="primary" @click.native.prevent="goSignup">
            木有账号，前往注册。
            <i class="el-icon-d-arrow-right"></i>
          </el-link>
          <el-link v-else type="primary" @click.native.prevent="goSignin">
            已有账号，前往登录。
            <i class="el-icon-d-arrow-right"></i>
          </el-link>
        </slot>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    formType: {
      type: String,
      default: 'signin'
    }
  },
  data() {
    const checkPassword = (rule, value, callback) => {
      if (value !== this.objForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      strType: 'password',
      objForm: {
        username: '',
        email: '',
        password: '',
        checkPass: ''
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
        ],
        checkPass: [
          {
            required: true,
            message: '确认密码不能为空！QAQ',
            trigger: 'blur'
          },
          {
            validator: checkPassword,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    async submitForm(formName) {
      try {
        const valid = await this.$refs[formName].validate()
        if (!valid) {
          return this.$message.error('表单格式不正确！QAQ')
        }
        this.$emit('submit-form', this.objForm)
      } catch (error) {
        console.log('error===>' + error.message)
      }
    },
    goSignin() {
      this.$emit('go-signin')
    },
    goSignup() {
      this.$emit('go-signup')
    },
    showPwd() {
      if (this.strType === 'password') {
        this.strType = ''
      } else {
        this.strType = 'password'
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg: #2d3a4b;
$light_gray: #eee;

/* reset element-ui css */
.layout_container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 40px;
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item {
    border: 2px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #222;
$dark_gray: #889aa4;
$light_gray: #eee;
.layout_container {
  position: fixed;
  height: 100%;
  width: 100%;
  background: url('../../../assets/images/boat2.jpg') no-repeat center center;
  background-size: 100% 100%;
  background-color: $bg;
  .form_container {
    position: absolute;
    left: 0;
    right: 0;
    width: 400px;
    max-width: 100%;
    padding: 35px 35px 15px 35px;
    margin: 80px auto;
    background-color: rgba(0, 0, 0, 0.8);
  }
  .form_footer {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .title {
    font-size: 26px;
    font-weight: 400;
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .el-button--danger {
    color: #fff;
    background-color: #d63246;
    border-color: #d63246;
  }
}
</style>
