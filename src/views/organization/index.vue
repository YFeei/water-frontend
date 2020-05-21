<template>
  <div class="app-container">
    <el-form :inline="true" style="float:left;margin-left: 3%" @keyup.enter.native="searchFile">
      <el-form-item>
        <el-input
          v-model="searchValue"
          size="small"
          placeholder="输入机构名"
          prefix-icon="el-icon-search"
          clearable
          @input="getRecords"
        />
      </el-form-item>
      <el-form-item>
        <el-button size="small" @click="clearSearchValue">重置</el-button>
      </el-form-item>
    </el-form>
    <el-form :inline="true" style="float: right;margin-right: 2%;">
      <el-form-item>
        <el-button type="success" size="small" @click="addOrg">创建机构</el-button>
        <el-button type="danger" size="small" :disabled="recordsSelections.length<=0" @click="deleteOrgs">批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="data.records"
      style="width: 100%"
      :cell-style="{paddingTop:'10px', paddingBottom:'10px'}"
      @selection-change="selectionChangeHandle"
    >
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50"
      />
      <el-table-column
        header-align="center"
        align="center"
        label="机构名称"
        prop="name"
      />
      <el-table-column
        header-align="center"
        align="center"
        label="机构负责人"
        prop="manager"
      />
      <el-table-column
        header-align="center"
        align="center"
        label="负责人联系电话"
        prop="telephone"
      />
      <el-table-column
        header-align="center"
        align="center"
        label="机构详细地址"
        prop="addr"
      />
      <el-table-column
        header-align="center"
        align="center"
        fixed="right"
        label="使用状态"
      >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="有效"
            inactive-value="无效"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="updateOrgStatus(scope.$index,scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="所属公司"
        prop="companyName"
      />
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="300"
        label="相关操作"
      >
        <template slot-scope="scope">
          <el-button type="primary" plain size="small" @click="getDetail(scope.row)">查看详情</el-button>
          <el-button type="warning" plain size="small" @click="updateComp(scope.row)">编辑</el-button>
          <el-button type="danger" plain size="small" @click="deleteComp(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page.sync="data.current"
      :hide-on-single-page="data.size>0"
      :page-sizes="[5, 10, 15, 20, 25, 30]"
      layout="total, prev, pager, next, sizes"
      :total="data.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <org-info v-if="orgInfoVisible" ref="orgInfo" @refreshList="getRecords" />
    <org-detail v-if="orgDetailVisible" ref="orgDetail" />
  </div>
</template>

<script>
import { getOrgList, deleteOrg, getOrgListByName, updateOrgStatus } from '../../api/org'
import orgInfo from './orgInfo'
import orgDetail from './orgDetail'

export default {
  components: {
    // eslint-disable-next-line vue/no-unused-components
    orgInfo,
    orgDetail
  },
  data() {
    return {
      field: 'name',
      searchValue: '',
      listLoading: false,
      data: {
        current: 1,
        size: 10
      },
      orgInfoVisible: false,
      orgDetailVisible: false,
      recordsSelections: ''
    }
  },
  created() {
    this.getRecords()
  },
  methods: {
    getRecords() {
      this.listLoading = true
      if (this.searchValue !== '') {
        getOrgListByName(this.data.current, this.data.size, this.searchValue).then(response => {
          this.data = response.data
        })
      } else {
        getOrgList(this.data.current, this.data.size).then(response => {
          this.data = response.data
        })
      }
      this.listLoading = false
    },
    clearSearchValue() {
      this.searchValue = ''
      this.getRecords()
    },
    addOrg() {
      this.orgInfoVisible = true
      setTimeout(() => { this.$refs.orgInfo.init('add', {}) }, 20)
    },
    deleteOrgs() {
      console.log(this.recordsSelections)
      this.$confirm('此操作将永久删除选中的记录，是否继续删除？', '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        const idList = []
        for (const item of this.recordsSelections) {
          idList.push(item.id)
        }
        console.log('deleteIds : ' + idList.join(','))
        deleteOrg({ orgIds: idList.join(',').toString() }).then(response => {
          if (response.code === 4001) {
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
          this.listLoading = false
        })
      })
    },
    selectionChangeHandle(val) {
      this.recordsSelections = val
    },
    getDetail(record) {
      this.$message({
        message: record,
        type: 'success',
        duration: 1000
      })
      //
      this.orgDetailVisible = true
      setTimeout(() => { this.$refs.orgDetail.init(record) }, 10)
    },
    updateComp(record) {
      this.orgInfoVisible = true
      setTimeout(() => { this.$refs.orgInfo.init('update', record) }, 10)
    },
    deleteComp(record) {
      this.$confirm('此操作将永久删除该记录，是否继续删除？', '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteOrg({ orgIds: record.id }).then(response => {
          if (response.code === 4001) {
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
        })
      })
    },
    handleSizeChange(val) {
      this.data.size = val
      this.getRecords()
    },
    handleCurrentChange(val) {
      this.data.current = val
      this.getRecords()
    },
    updateOrgStatus(index, row) {
      console.log('updateCompStatus , row : ')
      console.log(row)
      updateOrgStatus(row.id, row.status).then(response => {
        if (response.code === 4001) {
          this.$message({
            message: '更新状态成功',
            type: 'success',
            duration: 1000
          })
        } else {
          this.$message({
            message: '更新状态失败',
            type: 'error',
            duration: 1000
          })
          //  更新状态失败后，要将视图上的改变，修改成原来的状态
          this.data.records[index].status = row.status === '有效' ? '无效' : '有效'
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
