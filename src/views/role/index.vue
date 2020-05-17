<template>
  <div class="app-container">
    <el-form :inline="true" style="float:left;margin-left: 3%">
      <el-form-item>
        <el-input
          v-model="searchValue"
          size="small"
          placeholder="输入角色名"
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
        <el-button v-if="hasPerm('sys:role:add')" type="success" size="small" @click="addRecord">创建角色</el-button>
        <el-button v-if="hasPerm('sys:role:del')" type="danger" size="small" :disabled="recordsSelections.length<=0" @click="deleteAll()">批量删除</el-button>
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
        label="角色名"
      >
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="创建时间"
      >
        <template slot-scope="scope">
          {{ scope.row.createTime }}
        </template>
      </el-table-column><el-table-column
        header-align="center"
        align="center"
        label="更新时间"
      >
        <template slot-scope="scope">
          {{ scope.row.updateTime }}
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
<!--          <el-button type="primary" plain size="small" @click="getRecordDetail(scope.row)">角色详情</el-button>-->
          <el-button v-if="hasPerm('sys:role:edit')" type="warning" plain size="small" @click="updateRecord(scope.row)">编辑</el-button>
          <el-button v-if="hasPerm('sys:role:del')" type="danger" plain size="small" @click="deleteOne(scope.row)">删除</el-button>
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
    <el-button @click="test()" />
    <roleInfo v-if="roleInfoVisible" ref="roleInfo" @refreshList="getRecords" />
  </div>
</template>

<script>
import { getRoleList, updateRoleStatus, deleteRole } from '@/api/role'
import { hasPerm } from '@/utils/auth'
import roleInfo from './roleInfo'

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
    roleInfo
  },
  data() {
    return {
      field: 'name',
      searchValue: '',
      list: null,
      listLoading: false,
      data: {
        current: 1,
        size: 10
      },
      recordsSelections: '',
      roleInfoVisible: false
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
      getRoleList(this.data.current, this.data.size, params).then(response => {
        console.log('resp data')
        console.log(response)
        this.userList = response.data.records
        this.data = response.data
        this.listLoading = false
      },
      error => {
        console.log('role error')
        console.log(error)
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
      updateRoleStatus(row.id, row.status).then(response => {
        if (response.code !== 4001) {
          this.userList[index].status = row.status === '有效' ? '无效' : '有效'
        }
      })
    },
    clearSearch() {
      this.searchValue = ''
      this.getRecords()
    },
    getRecordDetail(record) {},
    updateRecord(record) {
      /* record.id = 5
      record.username = 'testtest1'
      record.account = 'test1'
      record.password = 'password'
      record.rId = '1'
      record.status = '有效'*/
      this.roleInfoVisible = true
      setTimeout(() => { this.$refs.roleInfo.init1('update', record) }, 10)
    },
    addRecord() {
      this.roleInfoVisible = true
      setTimeout(() => { this.$refs.roleInfo.init1('add', {}) }, 10)
    },
    deleteOne(record) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRole({ roleIds: record.id }).then(resp => {
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
        deleteRole({ roleIds: idList.join(',').toString() }).then(resp => {
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
    addUser() {},
    test() {
      hasPerm('sys')
    }
  }
}
</script>
