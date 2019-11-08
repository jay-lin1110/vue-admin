<template>
  <div>
    <form-layout :form-type="strType" @submit-form="submitForm" @go-signup="goSignup">
      <!-- <template #header>OOCL用户登录</template> -->
    </form-layout>
  </div>
</template>

<script>
import jwtDecode from 'jwt-decode'
import { mapActions } from 'vuex'
import FormLayout from '../components/form-layout'
import { signIn } from '@/api/user'
import { TOKEN, CODE_OK } from '@/config'
import { Storage, Validator } from '@/utils'

export default {
  components: {
    FormLayout
  },
  data() {
    return {
      strType: 'signin'
    }
  },
  methods: {
    ...mapActions(['setUser', 'setAuthenticated']),
    async submitForm(objForm) {
      try {
        const { code, message, token } = await signIn(objForm)
        if (code !== CODE_OK) {
          return this.$message.error(message)
        }
        Storage.set(TOKEN, token)
        const decode = jwtDecode(token)
        const isAuthenticated = !Validator.isEmpty(decode)
        this.setUser(decode)
        this.setAuthenticated(isAuthenticated)
        this.$message.success('登录成功！=。=')
        this.$router.push('/home')
      } catch (error) {
        console.log('error===>' + error.message)
      }
    },
    goSignup() {
      this.$router.push('/user/signup')
    }
  }
}
</script>
