<template>
  <div class="d-flex jc-between ai-center h-100 w-100">
    <div class="d-flex ai-center ml-3">
      <img src="../../../assets/images/logo.png" height="50px" />
      <h3 class="ml-3 text-white">OOCL管理系统</h3>
    </div>
    <div class="d-flex ai-center">
      <div>
        <el-avatar :size="50" :src="user.avatar"></el-avatar>
      </div>
      <el-dropdown placement="bottom-end" class="pt-0 pb-0 pl-3 pr-3">
        <span class="el-dropdown-link text-white">
          个人中心
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click.native.stop="setAccount">账户设置</el-dropdown-item>
            <el-dropdown-item @click.native.stop="handleSignout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { TOKEN } from '@/config'
import { Storage } from '@/utils'

export default {
  computed: {
    ...mapGetters(['user'])
  },
  methods: {
    ...mapActions(['signOut']),
    handleSignout() {
      Storage.remove(TOKEN)
      this.signOut()
      this.$router.push('/user/signin')
    },
    setAccount() {
      this.$emit('set-account')
    }
  }
}
</script>

<style lang="scss">
</style>
