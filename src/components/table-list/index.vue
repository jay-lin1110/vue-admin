<template>
  <div class="table_list">
    <!-- breadcrumb area -->
    <el-breadcrumb separator-class="el-icon-d-arrow-right">
      <el-breadcrumb-item>
        <el-tag type="danger" effect="dark" color="#e25061">{{ propBread.menu1 }}</el-tag>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        <el-tag type="danger" effect="dark" color="#e25061">{{ propBread.menu1 }}</el-tag>
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
            v-model.trim.lazy="keyword"
            @keyup.enter.native="searchBy"
            @clear="getData"
          >
            <template #prepend>
              <el-select v-model="query" style="width: 10rem;">
                <el-option
                  v-for="item in propSearch.conditions"
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
          <el-button
            type="primary"
            icon="el-icon-plus"
            round
            @click.stop="handleCreate()"
          >{{ propSearch.createType }}</el-button>
        </el-col>
      </el-row>
      <!-- table area -->
      <el-row class="mt-3" :gutter="10">
        <el-table :data="tableData" height="333" class="w-100" highlight-current-row stripe>
          <el-table-column v-if="isExpand" type="expand" width="80">
            <template #default="{row}">
              <el-row
                class="d-flex mb-3 pb-3 border-bottom ai-center"
                justify="center"
                v-for="item1 in row.authorities.filter(item => item.level === '1')"
                :key="item1.id"
              >
                <el-col :span="6">
                  <el-tag type="danger">{{item1.name}}</el-tag>
                </el-col>
                <el-col :span="18">
                  <el-row
                    v-for="item2 in row.authorities.filter(item => item.level === '2' && item.parent === item1.id)"
                    :key="item2.id"
                  >
                    <el-col :span="6">
                      <el-tag class="mb-3" type="warning">{{item2.name}}</el-tag>
                    </el-col>
                    <el-col :span="12">
                      <el-tag
                        class="mb-3 mr-3"
                        type="success"
                        v-for="item3 in row.authorities.filter(item => item.level === '3' && item.parent === item2.id)"
                        :key="item3.id"
                      >{{item3.name}}</el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column label="序号" align="center" width="80">
            <template #default="{row}">
              <span>{{ setIndex(row) }}</span>
            </template>
          </el-table-column>
          <!-- table column -->
          <el-table-column
            align="center"
            v-for="(item, index) in propColumn"
            :key="index"
            width="200"
          >
            <!-- column header -->
            <template #header>
              <span class="ml-2 text-primary fs-xl fw-bold">
                <i :class="item['icon']"></i>
                {{ item['label'] }}
              </span>
            </template>
            <!-- column content -->
            <template #default="{row}">
              <el-tooltip v-if="item['type'] === 'time'" placement="top" :enterable="false">
                <template #content>
                  <span class="el-icon-time">{{ row[index] | formatTime }}</span>
                </template>
                <span>{{ row[index] | formatTime('YYYY-MM-DD') }}</span>
              </el-tooltip>
              <!-- <span v-if="index === 'createdAt'">{{ row[index] | formatTime('YYYY-MM-DD') }}</span> -->
              <el-tag v-else-if="item['type'] === 'tag'" size="medium">{{ row[index] }}</el-tag>
              <span v-else>{{ row[index] }}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作" align="center">
            <template #default="{$index, row}">
              <el-button
                size="small"
                type="primary"
                icon="el-icon-edit"
                @click.stop="handleEdit(row)"
              >编辑</el-button>
              <el-button
                size="small"
                type="danger"
                icon="el-icon-delete"
                @click.stop="handleDelete(row)"
              >删除</el-button>
              <el-button
                v-if="isAuth"
                size="small"
                type="warning"
                icon="el-icon-setting"
                @click.stop="handleAuthorize(row)"
              >授权</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- pagination area -->
        <el-pagination
          class="mt-3"
          background
          :total.sync="pagination.numTotal"
          :current-page.sync="pagination.numCurrentPage"
          :page-sizes.sync="pagination.arrPageSizes"
          :page-size.sync="pagination.numPageSize"
          :layout.sync="pagination.strLayout"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  props: {
    // 面包屑
    propBread: {
      type: Object,
      required: true,
      default: () => ({
        menu1: '后台管理',
        menu2: '管理列表'
      })
    },
    // 搜索选项
    propSearch: {
      type: Object,
      required: true,
      default: () => ({
        conditions: [
          {
            lable: '请选择',
            value: ''
          }
        ],
        createType: '新建按钮'
      })
    },
    propData: {
      type: Array,
      default: () => []
    },
    isExpand: {
      type: Boolean,
      default: false
    },
    isAuth: {
      type: Boolean,
      default: false
    },
    propColumn: {
      type: Object
    }
  },
  data() {
    return {
      tableData: [], // table data limited by page
      arrFliter: [], // filter data
      keyword: '',
      query: '',
      pagination: {
        numCurrentPage: 1,
        arrPageSizes: [5, 10, 50, 100],
        numPageSize: 1,
        strLayout: 'total, sizes, prev, pager, next, jumper',
        numTotal: 0
      }
    }
  },
  watch: {
    propData: {
      immediate: true,
      deep: true,
      handler(newValue) {
        this.arrFliter = newValue
        this.setPagination()
      }
    }
  },
  methods: {
    // get table data
    getData() {
      this.$emit('get-data')
    },
    // set table row index
    setIndex(row) {
      return this.propData.findIndex(item => item._id === row._id) + 1
    },
    // handle edit operation
    handleCreate() {
      this.$emit('handle-create')
    },
    // handle edit operation
    handleEdit(row) {
      this.$emit('handle-edit', row)
    },
    // handle delete operation
    handleDelete(row) {
      this.$emit('handle-delete', row)
    },
    // handle authorize operation
    handleAuthorize(row) {
      this.$emit('handle-authorize', row)
    },
    // handle search operation by keyword
    searchBy() {
      if (!this.query) {
        return this.$message.warning('请先选择搜索条件!QAQ')
      }
      if (!this.keyword) {
        this.$message.warning('请输入搜索内容!QAQ')
        // this.getData()
      }
      this.arrFliter = this.propData.filter(
        item => item[this.query].match(this.keyword)
        // item => item[this.query].includes(this.keyword)
      )
      this.setPagination()
    },
    // init first page
    setPagination() {
      this.pagination.numTotal = this.arrFliter.length
      this.pagination.numPageSize = 5
      this.pagination.numCurrentPage = 1

      this.tableData = this.arrFliter.filter(
        (item, index) => index < this.pagination.numPageSize
      )
    },
    // handle size change operation
    handleSizeChange(pageSize) {
      this.pagination.numCurrentPage = 1
      this.pagination.numPageSize = pageSize

      this.tableData = this.propData.filter(
        (item, index) => index < this.pagination.numPageSize
      )
    },
    // handle current page change operation
    handleCurrentChange(numCurrentPage) {
      const index = this.pagination.numPageSize * (numCurrentPage - 1)
      const data = this.pagination.numPageSize * numCurrentPage
      const table = []
      for (let i = index; i < data; i++) {
        if (this.propData[i]) {
          table.push(this.propData[i])
        }
      }
      this.tableData = table
    }
  }
}
</script>

<style lang="scss" scoped>
.el-card {
  min-height: 473px;
}
</style>
