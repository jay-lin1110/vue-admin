<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import jwtDecode from 'jwt-decode'
import { mapActions } from 'vuex'
import { TOKEN } from '@/config'
import { Storage, Validator } from '@/utils'

export default {
  name: 'app',
  methods: {
    ...mapActions(['setUser', 'setAuthenticated']),
    initUser() {
      const token = Storage.get(TOKEN)
      if (token) {
        const decode = jwtDecode(token)
        const isAuthenticated = !Validator.isEmpty(decode)
        this.setUser(decode)
        this.setAuthenticated(isAuthenticated)
      }
    }
  },
  created() {
    this.initUser()
  }
}
</script>

<style lang="scss">
/* #app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */
</style>
