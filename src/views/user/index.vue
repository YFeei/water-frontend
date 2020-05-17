<template>
  <div class="app-container">
    <el-form :inline="true" style="float:left;margin-left: 3%" @keyup.enter.native="searchFile">
      <el-form-item>
        <el-input
          v-model="searchValue"
          size="small"
          placeholder="输入用户名"
          prefix-icon="el-icon-search"
          clearable
          @input="getRecords"
        />
      </el-form-item>
      <el-form-item>
        <!--        <el-button size="small" type="success" @click="searchFile">搜索</el-button>-->
        <el-button size="small" @click="clearSearch">重置</el-button>
      </el-form-item>
    </el-form>
    <el-form :inline="true" style="float:right;margin-right: 2%;">
      <el-form-item>
        <el-button v-if="hasPerm('sys:user:add')" type="success" size="small" @click="addRecord">创建用户</el-button>
        <el-button v-if="hasPerm('sys:user:del')" type="danger" size="small" :disabled="recordsSelections.length<=0" @click="deleteAll()">批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="data.records"
      style="width: 100%;"
      :cell-style="{paddingTop:'10px',paddingBottom:'10px'}"

      @selection-change="selectionChangeHandle"
    >
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50"
      />
      <el-table-column
        header-align="left"
        align="left"
        width="300"
        label="用户名"
      >
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="联系电话"
      >
        <template slot-scope="scope">
          {{ scope.row.telephone }}
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="300"
        label="状态"
      >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="有效"
            inactive-value="无效"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="updateStatus(scope.$index,scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="300"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button  type="primary" plain size="small" @click="getRecordDetail(scope.row)">用户详情</el-button>
          <el-button v-if="hasPerm('sys:user:edit')" type="warning" plain size="small" @click="updateRecord(scope.row)">编辑</el-button>
          <el-button v-if="hasPerm('sys:user:del')" type="danger" plain size="small" @click="deleteOne(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page.sync="data.current"
      :hide-on-single-page="data.pages>1"
      :page-sizes="[5, 10, 15, 20, 25, 30]"
      layout="total, prev, pager, next, sizes"
      :total="data.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!--    <el-button @click="test()" />-->
    <userInfo v-if="userInfoVisible" ref="userInfo" @refreshList="getRecords" />
    <userDetail v-if="userDetailVisible" ref="userDetail" @refreshList="getRecords" />
  </div>
</template>

<script>
import { getUserList, updateUserStatus, deleteUser } from '@/api/user'
import { hasPerm } from '@/utils/auth'
import userInfo from './userInfo'
import userDetail from './userDetail'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  components: {
    userInfo,
    userDetail
  },
  data() {
    return {
      field: 'username',
      searchValue: '',
      list: null,
      listLoading: false,
      data: {
        current: 1,
        size: 10
      },
      recordsSelections: '',
      userInfoVisible: false,
      userDetailVisible: false
    }
  },
  created() {
    this.getRecords()
  },
  methods: {
    getRecords() {
      console.log('perm:' + hasPerm(this.$store.getters.perms, 'list1'))
      this.listLoading = true
      const params = {}
      if (this.searchValue !== '') {
        params[this.field] = this.searchValue
      }
      getUserList(this.data.current, this.data.size, params).then(response => {
        this.userList = response.data.records
        this.data = response.data
        this.listLoading = false
      })
    },
    selectionChangeHandle(val) {
      this.recordsSelections = val
    },
    handleSizeChange(val) {
      this.data.size = val
      this.getRecords()
    },
    handleCurrentChange(val) {
      this.data.current = val
      this.getRecords()
    },
    updateStatus(index, row) {
      console.log('update' + row.id + ' ' + row.status)
      updateUserStatus(row.id, row.status).then(response => {
        if (response.code !== 4001) {
          this.userList[index].status = row.status === '有效' ? '无效' : '有效'
        }
      })
    },
    clearSearch() {
      this.searchValue = ''
      this.getRecords()
    },
    getRecordDetail(record) {
      this.userDetailVisible = true
      setTimeout(() => { this.$refs.userDetail.init1(record) }, 20)
    },
    updateRecord(record) {
      /* record.id = 5
      record.username = 'testtest1'
      record.account = 'test1'
      record.password = 'password'
      record.rId = '1'
      record.status = '有效'
      updateUser(record).then(resp => {
        console.log(resp)
      })*/
      this.userInfoVisible = true
      setTimeout(() => { this.$refs.userInfo.init1('update', record) }, 10)
    },
    addRecord() {
      this.userInfoVisible = true
      setTimeout(() => { this.$refs.userInfo.init1('add', {}) }, 20)
    },
    deleteOne(record) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUser({ userIds: record.id }).then(resp => {
          if (resp.code === 4001) {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 1000
            })
            this.getRecords()
          }
        })
      })
    },
    deleteAll() {
      console.log(this.recordsSelections)
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.ListLoading = true
        const idList = []
        for (const item of this.recordsSelections) {
          idList.push(item.id)
        }
        console.log(idList.join(','))
        deleteUser({ userIds: idList.join(',').toString() }).then(resp => {
          if (resp.code === 4001) {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 1000
            })
            this.getRecords()
          } else {
            this.$message({
              message: '删除失败',
              type: 'error',
              duration: 1000
            })
          }
          this.ListLoading = false
        })
      })
    },
    test() {
      hasPerm('sys')
    }
  }
}
</script>
