<template>
  <div>
    <div class="text-center text-white">
      <i
        :class="isCollapse ? 'el-icon-d-arrow-right' : 'el-icon-d-arrow-left'"
        style="cursor: pointer; user-select: none; line-height: 39px;"
        @click.stop="handleCollapse"
      ></i>
    </div>
    <el-menu
      ref="refMenu"
      router
      unique-opened
      :default-active="strActiveIndex"
      background-color="#333"
      text-color="#fff"
      active-text-color="#d63246"
      :collapse="isCollapse"
      @select="handleSelect"
      @open="handleOpen"
      class="border-0"
    >
      <!-- <el-menu-item index="1" route="/home">
        <template #title>
        <i class="el-icon-s-home"></i>
        <span class="ml-4">首页管理</span>
        </template>
      </el-menu-item>-->

      <el-submenu :index="item.route" v-for="item in arrMenus" :key="item.id">
        <template #title>
          <i :class="objIcons[item.route]"></i>
          <span class="ml-4">{{ item.name }}</span>
        </template>
        <el-menu-item :index="menu.route" v-for="menu in item.menus" :key="menu.id">
          <i class="el-icon-menu"></i>
          <span>{{ menu.name }}</span>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import { getMenus } from '@/api/menu'

export default {
  data() {
    return {
      strActiveIndex: '1',
      strtOpenIndex: '',
      isCollapse: false,
      arrMenus: [],
      objIcons: {
        '/user': 'el-icon-user-solid',
        '/order': 'el-icon-s-order',
        '/comment': 'el-icon-s-comment',
        '/article': 'el-icon-document',
        '/authority': 'el-icon-s-tools',
        '/category': 'el-icon-coin',
        '/home': 'el-icon-s-home'
      }
    }
  },
  watch: {
    $route: {
      immediate: true,
      handler(newValue, oldValue) {
        this.strActiveIndex = newValue.path
      }
    }
  },
  methods: {
    handleSelect(index) {
      if (!index.includes('/')) {
        this.$refs.refMenu.close(this.strtOpenIndex)
      }
    },
    handleOpen(index) {
      this.strtOpenIndex = index
    },
    handleCollapse() {
      this.isCollapse = !this.isCollapse
      this.$emit('set-width', this.isCollapse)
    },
    async _getMenus() {
      const { data } = await getMenus()
      this.arrMenus = data.filter(item => item.menus.length)
      this.arrMenus.unshift({
        id: '111',
        name: '首页管理',
        route: '/home'
      })
    }
  },
  created() {
    this._getMenus()
  }
}
</script>
