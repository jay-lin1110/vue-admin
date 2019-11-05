<template>
  <div>
    <form-layout :form-type="strType" @submit-form="submitForm" @go-signin="goSignin">
      <!-- <template #header>OOCL用户注册</template> -->
    </form-layout>
  </div>
</template>

<script>
import FormLayout from '../components/form-layout'
import { signUp } from '@/api/user'
import { CODE_OK } from '@/config'

export default {
  components: {
    FormLayout
  },
  data() {
    return {
      strType: 'signup'
    }
  },
  methods: {
    async submitForm(objForm) {
      try {
        const { code, message } = await signUp(objForm)
        if (code !== CODE_OK) {
          return this.$message.error(message)
        }
        this.$message.success('注册成功！=。=')
        this.goSignin()
      } catch (error) {
        console.log('error===>' + error.message)
      }
    },
    goSignin() {
      this.$router.push('/user/signin')
    }
  }
}
</script>
